import React, { useMemo } from 'react';
import { useStore } from '../../state/store.jsx';
import { aircraft, aircraftById } from '../../data/aircraft.js';
import { isWeak } from '../../state/sessionEngine.js';

export default function Dashboard({ navigate }) {
  const { state, masteryById } = useStore();

  const todayKey = dateKey(Date.now());
  const todaySessions = state.sessions.filter(s => dateKey(s.ts) === todayKey);
  const cardsToday = todaySessions.reduce((sum, s) => sum + s.results.length, 0);
  const minsToday = Math.round(todaySessions.reduce((sum, s) => sum + (s.durationMs || 0), 0) / 60000);

  const recToday = todaySessions.flatMap(s => s.results.map(r => r.recognitionRating)).filter(Boolean);
  const accToday = recToday.length ? Math.round(recToday.filter(r => r === 'easy').length / recToday.length * 100) : 0;

  const newToday = useMemo(() => {
    const ids = new Set(todaySessions.flatMap(s => s.results.map(r => r.aircraftId)));
    return [...ids].filter(id => {
      const prog = state.progress[id];
      return prog && prog.exposures <= todaySessions.flatMap(s => s.results.filter(r => r.aircraftId === id)).length;
    }).length;
  }, [state.progress, todaySessions]);

  // Weekly
  const weekStart = startOfWeek(new Date());
  const weekSessions = state.sessions.filter(s => s.ts >= weekStart);
  const cardsWeek = weekSessions.reduce((sum, s) => sum + s.results.length, 0);

  const masteredCount = aircraft.filter(a => masteryById[a.id]?.state === 'Mastered').length;
  const tier1Count = aircraft.filter(a => a.tier === 1).length;
  const tier1Mastered = aircraft.filter(a => a.tier === 1 && masteryById[a.id]?.state === 'Mastered').length;

  const weakList = useMemo(() => aircraft.filter(a => isWeak(a.id, state.progress[a.id]))
    .sort((a, b) => (state.progress[b.id]?.lastSeen || 0) - (state.progress[a.id]?.lastSeen || 0))
    .slice(0, 8), [state.progress]);

  // Category breakdown (last 7 days)
  const catBreakdown = useMemo(() => {
    const map = {};
    for (const s of weekSessions) {
      for (const r of s.results) {
        const cat = aircraftById[r.aircraftId]?.category || 'Other';
        map[cat] = (map[cat] || 0) + 1;
      }
    }
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [weekSessions]);

  // Accuracy trend (last 7 days)
  const trend = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i); d.setHours(0, 0, 0, 0);
      const dayKey = dateKey(d.getTime());
      const ses = state.sessions.filter(s => dateKey(s.ts) === dayKey);
      const recs = ses.flatMap(s => s.results.map(r => r.recognitionRating)).filter(Boolean);
      const acc = recs.length ? Math.round(recs.filter(r => r === 'easy').length / recs.length * 100) : null;
      days.push({ key: dayKey, label: d.toLocaleDateString(undefined, { weekday: 'short' }), acc, count: recs.length });
    }
    return days;
  }, [state.sessions]);

  // Daily mission
  const mission = useMemo(() => {
    if (cardsToday < 10) return { text: `Train at least 10 cards today (${cardsToday}/10)`, done: false };
    if (weakList.length > 0) return { text: `Review ${Math.min(5, weakList.length)} weak aircraft`, done: false };
    if (tier1Mastered < tier1Count) return { text: `Master ${tier1Count - tier1Mastered} more Tier 1 aircraft`, done: false };
    return { text: 'Today\'s mission complete. Strong work.', done: true };
  }, [cardsToday, weakList.length, tier1Mastered, tier1Count]);

  return (
    <div className="col gap-24">
      <div>
        <h1 style={{ marginBottom: 4 }}>Dashboard</h1>
        <div className="muted">Your training overview.</div>
      </div>

      {/* Today */}
      <section>
        <h4>Today</h4>
        <div className="stat-grid">
          <Stat label="Cards reviewed" value={cardsToday} />
          <Stat label="Recognition" value={cardsToday ? `${accToday}%` : '—'} sub="strict" />
          <Stat label="New aircraft" value={newToday} />
          <Stat label="Time" value={`${minsToday} min`} />
          <Stat label="Streak" value={`🔥 ${state.streak.count}`} />
        </div>
      </section>

      {/* Mission */}
      <section className="card" style={{ borderColor: mission.done ? 'var(--accent)' : 'var(--border)' }}>
        <h4>Daily mission</h4>
        <div className="row" style={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <div style={{ fontSize: 16 }}>{mission.text}</div>
          <button className="btn btn-primary" onClick={() => navigate('flashcards')}>Train now →</button>
        </div>
      </section>

      {/* Weekly */}
      <section>
        <h4>This week</h4>
        <div className="row gap-16" style={{ alignItems: 'stretch', flexWrap: 'wrap' }}>
          <div className="card" style={{ flex: '1 1 280px' }}>
            <div className="muted" style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Accuracy trend</div>
            <Sparkline data={trend} />
          </div>
          <div className="card" style={{ flex: '1 1 280px' }}>
            <div className="muted" style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Cards by category (7d)</div>
            <CategoryBars data={catBreakdown} total={cardsWeek} />
          </div>
        </div>
      </section>

      {/* Mastery overview */}
      <section>
        <h4>Mastery</h4>
        <div className="stat-grid">
          <Stat label="Tier 1 mastered" value={`${tier1Mastered}/${tier1Count}`} />
          <Stat label="Total mastered" value={`${masteredCount}/${aircraft.length}`} />
          <Stat label="Weak now" value={weakList.length} />
        </div>
      </section>

      {/* Weak list */}
      <section className="card">
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <h4 style={{ margin: 0 }}>Weak aircraft</h4>
          {weakList.length > 0 && (
            <button className="btn btn-sm btn-primary" onClick={() => navigate('flashcards')}>Start weak review →</button>
          )}
        </div>
        {weakList.length === 0 ? (
          <div className="muted" style={{ marginTop: 12 }}>No weak aircraft right now. Keep up the work.</div>
        ) : (
          <ul style={{ marginTop: 12, paddingLeft: 18 }}>
            {weakList.map(a => (
              <li key={a.id}>
                <a href="#" onClick={e => { e.preventDefault(); navigate('library', a.id); }}>{a.name}</a>
                <span className="muted"> — last seen {state.progress[a.id]?.lastSeen ? new Date(state.progress[a.id].lastSeen).toLocaleDateString() : 'never'}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function Stat({ label, value, sub }) {
  return (
    <div className="stat">
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      {sub && <div className="stat-sub">{sub}</div>}
    </div>
  );
}

function Sparkline({ data }) {
  // Simple bar-style sparkline
  const max = 100;
  return (
    <div style={{ display: 'flex', alignItems: 'end', gap: 6, height: 80, marginTop: 12 }}>
      {data.map(d => (
        <div key={d.key} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <div style={{
            width: '100%', height: '100%', background: 'var(--bg-elev-2)', borderRadius: 4,
            display: 'flex', alignItems: 'flex-end', position: 'relative'
          }}>
            <div style={{
              width: '100%',
              height: `${d.acc !== null ? d.acc : 0}%`,
              background: d.acc === null ? 'transparent' : (d.acc >= 80 ? 'var(--accent)' : d.acc >= 60 ? 'var(--warn)' : 'var(--danger)'),
              borderRadius: 4,
              transition: 'height 0.3s'
            }} />
          </div>
          <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{d.label}</div>
          <div style={{ fontSize: 10, color: 'var(--text-dim)' }}>{d.acc !== null ? `${d.acc}%` : '—'}</div>
        </div>
      ))}
    </div>
  );
}

function CategoryBars({ data, total }) {
  if (!total) return <div className="muted" style={{ marginTop: 12 }}>No sessions this week yet.</div>;
  return (
    <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
      {data.map(([cat, count]) => {
        const pct = Math.round((count / total) * 100);
        return (
          <div key={cat}>
            <div className="row" style={{ justifyContent: 'space-between', fontSize: 13 }}>
              <span>{cat}</span>
              <span className="muted">{count} ({pct}%)</span>
            </div>
            <div className="progress" style={{ marginTop: 4 }}>
              <div className="progress-fill" style={{ width: `${pct}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function dateKey(ts) {
  const d = new Date(ts);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
function startOfWeek(d) {
  const date = new Date(d);
  const day = date.getDay() || 7;
  if (day !== 1) date.setHours(-24 * (day - 1));
  date.setHours(0, 0, 0, 0);
  return date.getTime();
}

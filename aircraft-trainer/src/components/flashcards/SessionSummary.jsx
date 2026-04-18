import React, { useMemo } from 'react';
import { useStore } from '../../state/store.jsx';
import { aircraftById } from '../../data/aircraft.js';
import { summarize } from '../../state/sessionEngine.js';

export default function SessionSummary({ result, onRestart, navigate }) {
  const { state, masteryById } = useStore();
  const session = result.session;

  // Compute summary using before/after mastery
  const summary = useMemo(() => summarize(session, result.summaryArgs.masteryBefore, masteryById), [session, masteryById, result.summaryArgs.masteryBefore]);

  const minutes = Math.max(1, Math.round(session.durationMs / 60000));
  const streakCount = state.streak.count;

  return (
    <div className="col gap-24" style={{ maxWidth: 720, margin: '0 auto' }}>
      <div className="card fadein">
        <div style={{ textAlign: 'center', padding: '8px 0 16px' }}>
          <div className="muted" style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Session complete</div>
          <h1 style={{ fontSize: 32, marginTop: 8, marginBottom: 0, color: 'var(--accent)' }}>✓</h1>
        </div>

        <div className="stat-grid">
          <Stat label="Cards reviewed" value={summary.cardsReviewed} />
          <Stat label="Time" value={`${minutes} min`} />
          <Stat label="Recognition" value={`${summary.recognitionAccuracy}%`} sub="strict" />
          {summary.totals.perfKnow + summary.totals.perfUnsure + summary.totals.perfDont > 0 && (
            <Stat label="Performance" value={`${summary.performanceAccuracy}%`} />
          )}
        </div>
      </div>

      {summary.newlyMastered.length > 0 && (
        <div className="card">
          <h4>Newly mastered</h4>
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {summary.newlyMastered.map(id => (
              <li key={id} style={{ color: 'var(--accent)' }}>✓ {aircraftById[id]?.name || id}</li>
            ))}
          </ul>
        </div>
      )}

      {summary.stillUnsure.length > 0 && (
        <div className="card">
          <h4>Still unsure</h4>
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {summary.stillUnsure.slice(0, 8).map(id => {
              const ac = aircraftById[id];
              return <li key={id} className="muted">? {ac?.name || id}</li>;
            })}
          </ul>
        </div>
      )}

      {summary.bestCategory && (
        <div className="card">
          <h4>Best category this session</h4>
          <div style={{ fontSize: 16 }}>
            {summary.bestCategory.name} <span className="muted">— {summary.bestCategory.accuracy}%</span>
          </div>
        </div>
      )}

      {streakCount > 0 && (
        <div className="card" style={{ textAlign: 'center', borderColor: 'var(--accent)' }}>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Streak</div>
          <div style={{ fontSize: 24, fontWeight: 700, marginTop: 4 }}>
            <span style={{ marginRight: 6 }}>🔥</span>{streakCount} day{streakCount !== 1 ? 's' : ''}
          </div>
        </div>
      )}

      <div className="row gap-8" style={{ justifyContent: 'center' }}>
        <button className="btn btn-primary btn-lg" onClick={onRestart}>Start next session</button>
        <button className="btn btn-lg" onClick={() => navigate('dashboard')}>View dashboard</button>
      </div>
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

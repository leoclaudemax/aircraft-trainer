import React, { useState } from 'react';
import { useStore } from '../../state/store.jsx';
import { aircraft, aircraftById } from '../../data/aircraft.js';
import { performanceTiers } from '../../data/performanceTiers.js';
import { partnersFor, tellApartFor } from '../../data/confusionPairs.js';
import AircraftImage from '../common/AircraftImage.jsx';
import { buildSession } from '../../state/sessionEngine.js';

export default function AircraftDetail({ id, onBack, onOpen, onCompare, navigate }) {
  const { state, masteryById, actions } = useStore();
  const ac = aircraftById[id];
  const [tab, setTab] = useState('recognition');
  const [compareSelectorOpen, setCompareSelectorOpen] = useState(false);

  if (!ac) return <div className="empty">Aircraft not found.</div>;

  const prog = state.progress[id];
  const mastery = masteryById[id];
  const tier = performanceTiers[ac.perfTier];
  const partners = partnersFor(id);

  const sessionRecent = state.sessions
    .filter(s => s.results.some(r => r.aircraftId === id))
    .slice(-5)
    .reverse();

  const startFocusSession = () => {
    const deck = buildSession({ aircraftIds: [id], size: 8 }, state.progress, masteryById);
    // Repeat to make a useful session
    const repeated = [];
    while (repeated.length < 8) repeated.push({ aircraftId: id });
    navigate('flashcards', null);
    // FlashcardsRoute will start at setup; we'd need a richer route to deep-link.
    // Simple approach: copy to clipboard message that user can use the "Aircraft only" filter.
    setTimeout(() => alert('Use Train tab → custom session, then start. (Deep-link sessions can be added.)'), 0);
  };

  return (
    <div className="col gap-24">
      <div className="row" style={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <button className="btn btn-ghost" onClick={onBack}>← Library</button>
        <div className="row gap-8">
          <button className="btn" onClick={() => actions.toggleFavorite(id)}>{prog.favorite ? '♥ Favorited' : '♡ Favorite'}</button>
          <button className={`btn ${prog.flagged ? 'btn-danger' : ''}`} onClick={() => actions.toggleFlag(id)}>{prog.flagged ? '⚑ Hard-flagged' : '⚐ Flag as hard'}</button>
          <button className="btn" onClick={() => setCompareSelectorOpen(o => !o)}>↔ Compare</button>
        </div>
      </div>

      <div className="row gap-24" style={{ alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 320px', maxWidth: 480 }}>
          <div className="fc-image-wrap" style={{ aspectRatio: '4 / 3' }}>
            <AircraftImage aircraft={ac} alt={ac.name} />
          </div>
        </div>
        <div style={{ flex: '2 1 320px' }}>
          <h1 style={{ fontSize: 28 }}>{ac.name}</h1>
          <div className="row gap-8" style={{ marginBottom: 12, flexWrap: 'wrap' }}>
            <span className={`badge badge-tier-${ac.tier}`}>Tier {ac.tier}</span>
            <span className="badge">{ac.subcategory}</span>
            <span className="badge">Perf tier {ac.perfTier}</span>
            <span className="badge" title="Frequency at FIC Delta">{'★'.repeat(ac.frequency)}{'☆'.repeat(3 - ac.frequency)}</span>
            {mastery && <span className={`badge badge-${mastery.state.toLowerCase()}`}>{mastery.label}</span>}
            {ac.contentLevel === 'stub' && <span className="badge badge-new">stub</span>}
          </div>
          <p className="muted">{ac.recognition}</p>
          <div className="progress" style={{ marginTop: 8 }}>
            <div className="progress-fill" style={{ width: `${mastery?.percent || 0}%` }} />
          </div>
          <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>{mastery?.percent || 0}% composite progress</div>
        </div>
      </div>

      {compareSelectorOpen && (
        <div className="card">
          <h4>Pick an aircraft to compare</h4>
          <div className="chips" style={{ marginTop: 8 }}>
            {(partners.length ? partners : aircraft.filter(a => a.id !== id && a.tier === ac.tier).map(a => a.id))
              .map(pid => aircraftById[pid])
              .filter(Boolean)
              .map(p => (
                <button key={p.id} className="chip" onClick={() => onCompare(id, p.id)}>{p.name}</button>
              ))}
          </div>
        </div>
      )}

      <div>
        <div className="tabs">
          {['recognition', 'performance', 'context', 'progress'].map(t => (
            <button key={t} className={`tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
              {t[0].toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {tab === 'recognition' && (
          <div className="col gap-16">
            <Section title="Visual markers">
              <ul>{ac.visualMarkers.map((v, i) => <li key={i}>{v}</li>)}</ul>
            </Section>
            {ac.confusedWith?.length > 0 && (
              <Section title="Most confused with">
                <ul>
                  {ac.confusedWith.map(pid => {
                    const p = aircraftById[pid];
                    if (!p) return null;
                    const tip = tellApartFor(id, pid);
                    return (
                      <li key={pid}>
                        <a href="#" onClick={e => { e.preventDefault(); onOpen(pid); }}>{p.name}</a>
                        {tip && <span className="muted"> — {tip}</span>}
                      </li>
                    );
                  })}
                </ul>
              </Section>
            )}
            {ac.memoryTip && (
              <Section title="Memory tip">
                <p style={{ color: 'var(--accent)' }}>{ac.memoryTip}</p>
              </Section>
            )}
            <Section title="Your notes">
              <textarea
                className="input"
                style={{ minHeight: 80, resize: 'vertical' }}
                value={prog.notes}
                onChange={e => actions.setNotes(id, e.target.value)}
                placeholder="Personal recognition notes…"
              />
            </Section>
          </div>
        )}

        {tab === 'performance' && tier && (
          <div className="col gap-16">
            <Section title={tier.name}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
                <Stat label="Cruise" value={tier.cruise} />
                <Stat label="Climb" value={tier.climb} />
                <Stat label="Altitude" value={tier.altitude} />
              </div>
            </Section>
            <Section title="ATC handling note">
              <p>{tier.atcNote}</p>
            </Section>
            <Section title="Other aircraft in this performance tier">
              <div className="chips">
                {aircraft.filter(a => a.perfTier === ac.perfTier && a.id !== id).map(a => (
                  <button key={a.id} className="chip" onClick={() => onOpen(a.id)}>{a.name}</button>
                ))}
              </div>
            </Section>
          </div>
        )}

        {tab === 'context' && (
          <div className="col gap-16">
            <Section title="Typical uses & context">
              <p>{ac.context}</p>
            </Section>
            <Section title="Family">
              <p className="muted">{ac.family}</p>
            </Section>
            {ac.aliases?.length > 0 && (
              <Section title="Also known as">
                <div className="chips">
                  {ac.aliases.map(a => <span key={a} className="chip" style={{ pointerEvents: 'none' }}>{a}</span>)}
                </div>
              </Section>
            )}
          </div>
        )}

        {tab === 'progress' && (
          <div className="col gap-16">
            <div className="stat-grid">
              <Stat label="Recognition" value={`${Math.round(mastery?.strict || 0)}%`} sub="strict" />
              <Stat label="Recognition" value={`${Math.round(mastery?.assisted || 0)}%`} sub="assisted" />
              <Stat label="Performance" value={`${Math.round(mastery?.perf || 0)}%`} />
              <Stat label="Exposures" value={mastery?.exposures || 0} />
              <Stat label="State" value={mastery?.label || 'New'} />
            </div>

            <Section title="Recent sessions">
              {sessionRecent.length === 0 && <div className="muted">No sessions yet for this aircraft.</div>}
              {sessionRecent.map(s => {
                const r = s.results.find(r => r.aircraftId === id);
                return (
                  <div key={s.ts} className="row" style={{ justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
                    <div className="muted" style={{ fontSize: 13 }}>{new Date(s.ts).toLocaleString()}</div>
                    <div>
                      <span className="badge" style={{
                        color: r?.recognitionRating === 'easy' ? 'var(--accent)' : r?.recognitionRating === 'unsure' ? 'var(--warn)' : 'var(--danger)'
                      }}>{r?.recognitionRating || '-'}</span>
                      {r?.performanceRating && <span className="badge" style={{ marginLeft: 4 }}>perf: {r.performanceRating}</span>}
                    </div>
                  </div>
                );
              })}
            </Section>
          </div>
        )}
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="card">
      <h4>{title}</h4>
      <div>{children}</div>
    </div>
  );
}
function Stat({ label, value, sub }) {
  return (
    <div className="stat">
      <div className="stat-label">{label}</div>
      <div className="stat-value" style={{ fontSize: 18 }}>{value}</div>
      {sub && <div className="stat-sub">{sub}</div>}
    </div>
  );
}

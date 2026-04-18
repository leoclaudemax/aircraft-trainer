import React from 'react';
import { aircraftById } from '../../data/aircraft.js';
import { performanceTiers } from '../../data/performanceTiers.js';
import { tellApartFor } from '../../data/confusionPairs.js';
import AircraftImage from '../common/AircraftImage.jsx';

export default function Compare({ ids, onBack, onOpen }) {
  const [a, b] = (ids || []).map(id => aircraftById[id]).filter(Boolean);
  if (!a || !b) return <div className="empty">Pick two aircraft to compare.</div>;

  const tip = tellApartFor(a.id, b.id);

  const rows = [
    ['Silhouette', null, null],
    ['Family', a.family, b.family],
    ['Subcategory', a.subcategory, b.subcategory],
    ['Tier', `Tier ${a.tier}`, `Tier ${b.tier}`],
    ['Performance tier', performanceTiers[a.perfTier]?.name, performanceTiers[b.perfTier]?.name],
    ['Cruise', performanceTiers[a.perfTier]?.cruise, performanceTiers[b.perfTier]?.cruise],
    ['Climb', performanceTiers[a.perfTier]?.climb, performanceTiers[b.perfTier]?.climb],
    ['Recognition', a.recognition, b.recognition],
    ['Visual markers', null, null],
    ['Memory tip', a.memoryTip || '—', b.memoryTip || '—'],
  ];

  return (
    <div className="col gap-24">
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <button className="btn btn-ghost" onClick={onBack}>← Library</button>
        <h1 style={{ margin: 0 }}>Compare</h1>
        <div />
      </div>

      {tip && (
        <div className="card" style={{ borderColor: 'var(--accent)' }}>
          <h4>Tell-apart cue</h4>
          <p style={{ color: 'var(--accent)', margin: 0 }}>{tip}</p>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 1fr', gap: 12, alignItems: 'start' }}>
        <div />
        {[a, b].map(ac => (
          <div key={ac.id} className="card" style={{ cursor: 'pointer' }} onClick={() => onOpen(ac.id)}>
            <div className="lib-card-img"><AircraftImage aircraft={ac} /></div>
            <div className="lib-card-name">{ac.name}</div>
            <div className="muted" style={{ fontSize: 13 }}>{ac.subcategory}</div>
          </div>
        ))}

        {rows.map(([label, va, vb], i) => {
          if (label === 'Silhouette') return null;
          if (label === 'Visual markers') {
            return (
              <React.Fragment key={i}>
                <div className="muted" style={{ paddingTop: 14, fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
                <div className="card"><ul style={{ margin: 0, paddingLeft: 18 }}>{a.visualMarkers.map((m, idx) => <li key={idx}>{m}</li>)}</ul></div>
                <div className="card"><ul style={{ margin: 0, paddingLeft: 18 }}>{b.visualMarkers.map((m, idx) => <li key={idx}>{m}</li>)}</ul></div>
              </React.Fragment>
            );
          }
          return (
            <React.Fragment key={i}>
              <div className="muted" style={{ paddingTop: 14, fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
              <div className="card">{va || '—'}</div>
              <div className="card">{vb || '—'}</div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

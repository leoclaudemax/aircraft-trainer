import React, { useMemo, useState } from 'react';
import { useStore } from '../../state/store.jsx';
import { aircraft, categoryList } from '../../data/aircraft.js';
import { performanceTiers, tierOrder } from '../../data/performanceTiers.js';
import { isWeak } from '../../state/sessionEngine.js';
import AircraftImage from '../common/AircraftImage.jsx';

const MASTERY_STATES = ['New', 'Learning', 'Uncertain', 'Strong', 'Mastered'];

export default function LibraryGrid({ onOpen }) {
  const { state, masteryById } = useStore();
  const [search, setSearch] = useState('');
  const [tier, setTier] = useState(null);
  const [category, setCategory] = useState(null);
  const [perfTier, setPerfTier] = useState(null);
  const [mastery, setMastery] = useState(null);
  const [statusFilter, setStatusFilter] = useState(null); // flagged | weak | favorites

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return aircraft.filter(a => {
      if (q) {
        const hay = [a.name, a.family, ...(a.aliases || [])].join(' ').toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (tier && a.tier !== tier) return false;
      if (category && a.category !== category) return false;
      if (perfTier && a.perfTier !== perfTier) return false;
      if (mastery && masteryById[a.id]?.state !== mastery) return false;
      if (statusFilter === 'flagged' && !state.progress[a.id]?.flagged) return false;
      if (statusFilter === 'favorites' && !state.progress[a.id]?.favorite) return false;
      if (statusFilter === 'weak' && !isWeak(a.id, state.progress[a.id])) return false;
      return true;
    });
  }, [search, tier, category, perfTier, mastery, statusFilter, state.progress, masteryById]);

  return (
    <div className="col gap-24">
      <div>
        <h1 style={{ marginBottom: 4 }}>Library</h1>
        <div className="muted">{filtered.length} of {aircraft.length} aircraft</div>
      </div>

      <div className="card col gap-16">
        <input
          className="input"
          placeholder="Search by name, family, or alias…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <div className="col gap-8">
          <FilterRow label="Tier">
            <Chip active={tier === null} onClick={() => setTier(null)}>All</Chip>
            {[1, 2, 3].map(t => <Chip key={t} active={tier === t} onClick={() => setTier(t)}>Tier {t}</Chip>)}
          </FilterRow>

          <FilterRow label="Category">
            <Chip active={category === null} onClick={() => setCategory(null)}>All</Chip>
            {categoryList.map(c => <Chip key={c} active={category === c} onClick={() => setCategory(c)}>{c}</Chip>)}
          </FilterRow>

          <FilterRow label="Mastery">
            <Chip active={mastery === null} onClick={() => setMastery(null)}>All</Chip>
            {MASTERY_STATES.map(m => <Chip key={m} active={mastery === m} onClick={() => setMastery(m)}>{m}</Chip>)}
          </FilterRow>

          <FilterRow label="Performance tier">
            <Chip active={perfTier === null} onClick={() => setPerfTier(null)}>All</Chip>
            {tierOrder.map(p => (
              <Chip key={p} active={perfTier === p} onClick={() => setPerfTier(p)}>T{p}</Chip>
            ))}
          </FilterRow>

          <FilterRow label="Status">
            <Chip active={statusFilter === null} onClick={() => setStatusFilter(null)}>All</Chip>
            <Chip active={statusFilter === 'flagged'} onClick={() => setStatusFilter('flagged')}>Flagged</Chip>
            <Chip active={statusFilter === 'weak'} onClick={() => setStatusFilter('weak')}>Weak</Chip>
            <Chip active={statusFilter === 'favorites'} onClick={() => setStatusFilter('favorites')}>Favorites</Chip>
          </FilterRow>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty">No aircraft match your filters.</div>
      ) : (
        <div className="lib-grid">
          {filtered.map(ac => <Card key={ac.id} ac={ac} onOpen={() => onOpen(ac.id)} mastery={masteryById[ac.id]} prog={state.progress[ac.id]} />)}
        </div>
      )}
    </div>
  );
}

function Card({ ac, onOpen, mastery, prog }) {
  return (
    <div className="card card-hover" onClick={onOpen}>
      <div className="lib-card-img">
        <AircraftImage aircraft={ac} />
      </div>
      <div className="lib-card-name">{ac.name}</div>
      <div className="lib-card-meta">
        <span className={`badge badge-tier-${ac.tier}`}>T{ac.tier}</span>
        <span className="badge">{ac.category}</span>
        <span className="badge" title="Frequency at FIC Delta">{'★'.repeat(ac.frequency)}{'☆'.repeat(3 - ac.frequency)}</span>
        {prog?.flagged && <span className="badge badge-uncertain">⚑</span>}
        {prog?.favorite && <span className="badge">♥</span>}
      </div>
      <div className="row gap-8" style={{ alignItems: 'center' }}>
        <div className="progress" style={{ flex: 1 }}>
          <div className={`progress-fill ${masteryClass(mastery?.state)}`} style={{ width: `${mastery?.percent || 0}%` }} />
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', minWidth: 64, textAlign: 'right' }}>{mastery?.label || 'New'}</div>
      </div>
    </div>
  );
}

function masteryClass(state) {
  if (state === 'Mastered' || state === 'Strong') return '';
  if (state === 'Uncertain') return 'warn';
  if (state === 'Learning') return 'danger';
  return 'muted';
}

function FilterRow({ label, children }) {
  return (
    <div className="row" style={{ alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
      <div className="muted" style={{ fontSize: 12, minWidth: 80, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
      <div className="chips">{children}</div>
    </div>
  );
}

function Chip({ active, onClick, children }) {
  return <button className={`chip ${active ? 'active' : ''}`} onClick={onClick}>{children}</button>;
}

import React, { useMemo, useState } from 'react';
import { useStore } from '../../state/store.jsx';
import { aircraft, categoryList } from '../../data/aircraft.js';
import { confusionPairs } from '../../data/confusionPairs.js';
import { isWeak, buildSession } from '../../state/sessionEngine.js';

export default function SessionSetup({ onStart, initial }) {
  const { state, masteryById } = useStore();
  const settings = state.settings;

  const [tiers, setTiers] = useState([1]);
  const [categories, setCategories] = useState([]); // empty = all
  const [size, setSize] = useState(settings.defaultSessionSize);
  const [order, setOrder] = useState('random');
  const [mode, setMode] = useState('rec+perf'); // rec | rec+perf
  const [mixPairs, setMixPairs] = useState(true);
  const [difficulty, setDifficulty] = useState(settings.defaultDifficulty);

  const toggle = (arr, v, set) => set(arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v]);

  // Quick launches
  const quickLaunch = (kind) => {
    const baseConfig = {
      onFinishMode: 'normal',
      includePerformance: true,
      timed: false,
      examMode: false,
      mixConfusionPairs: true,
      difficulty: 'learning'
    };
    if (kind === 'tier1') {
      onStart({
        ...baseConfig,
        deck: buildSession({ tiers: [1], size: 20, order: 'random', mixConfusionPairs: true }, state.progress, masteryById),
        label: 'Tier 1 today'
      });
    } else if (kind === 'quick5') {
      onStart({
        ...baseConfig,
        deck: buildSession({ tiers: [1, 2, 3], size: 10, order: 'random' }, state.progress, masteryById),
        label: '5-minute quick'
      });
    } else if (kind === 'weak') {
      const deck = buildSession({ tiers: [1, 2, 3], size: 15, order: 'weakness', onlyWeak: true }, state.progress, masteryById);
      if (!deck.length) {
        alert('No weak aircraft yet — train more first.');
        return;
      }
      onStart({ ...baseConfig, deck, label: 'Weak aircraft review' });
    } else if (kind === 'new') {
      const deck = buildSession({ tiers: [1, 2, 3], size: 15, order: 'tier', onlyNew: true }, state.progress, masteryById);
      if (!deck.length) {
        alert('You\'ve seen every aircraft at least once.');
        return;
      }
      onStart({ ...baseConfig, deck, label: 'New aircraft only' });
    } else if (kind === 'pairs') {
      // build deck from confusion pairs
      const ids = new Set();
      for (const p of confusionPairs) { ids.add(p.a); ids.add(p.b); }
      const deck = buildSession({ aircraftIds: [...ids], size: 18, order: 'random', mixConfusionPairs: true }, state.progress, masteryById);
      onStart({ ...baseConfig, deck, label: 'Similar pairs drill' });
    } else if (kind === 'exam') {
      onStart({
        ...baseConfig,
        examMode: true,
        timed: true,
        timerSeconds: settings.examTimerSeconds,
        includePerformance: false,
        deck: buildSession({ tiers: [1, 2], size: 20, order: 'random', mixConfusionPairs: false }, state.progress, masteryById),
        label: 'Exam mode',
        difficulty: 'exam'
      });
    }
  };

  const startCustom = () => {
    const deck = buildSession({
      tiers,
      categories: categories.length ? categories : null,
      size,
      order,
      mixConfusionPairs: mixPairs
    }, state.progress, masteryById);
    if (!deck.length) {
      alert('No aircraft match the selected filters.');
      return;
    }
    onStart({
      deck,
      label: 'Custom session',
      includePerformance: mode === 'rec+perf',
      examMode: difficulty === 'exam',
      timed: difficulty === 'exam',
      timerSeconds: settings.examTimerSeconds,
      mixConfusionPairs: mixPairs,
      difficulty
    });
  };

  const stats = useMemo(() => {
    const totalT1 = aircraft.filter(a => a.tier === 1).length;
    const masteredT1 = aircraft.filter(a => a.tier === 1 && masteryById[a.id]?.state === 'Mastered').length;
    const weakCount = aircraft.filter(a => isWeak(a.id, state.progress[a.id])).length;
    const newCount = aircraft.filter(a => state.progress[a.id]?.exposures === 0).length;
    return { totalT1, masteredT1, weakCount, newCount };
  }, [state.progress, masteryById]);

  return (
    <div className="col gap-24">
      <div className="row" style={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ marginBottom: 4 }}>Train</h1>
          <div className="muted">Build a session or pick a quick launch.</div>
        </div>
        <div className="row gap-8">
          <div className="badge">{stats.masteredT1}/{stats.totalT1} Tier 1 mastered</div>
          <div className="badge badge-uncertain">{stats.weakCount} weak</div>
          <div className="badge badge-new">{stats.newCount} new</div>
        </div>
      </div>

      <section>
        <h4>Quick launch</h4>
        <div className="lib-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
          <QuickCard title="Tier 1 today" desc="20 cards · Tier 1 · random" onClick={() => quickLaunch('tier1')} primary />
          <QuickCard title="5-minute quick" desc="10 cards · any tier" onClick={() => quickLaunch('quick5')} />
          <QuickCard title="Weak aircraft" desc={`${stats.weakCount} candidates · weakness order`} onClick={() => quickLaunch('weak')} disabled={stats.weakCount === 0} />
          <QuickCard title="New only" desc={`${stats.newCount} unseen aircraft`} onClick={() => quickLaunch('new')} disabled={stats.newCount === 0} />
          <QuickCard title="Similar pairs" desc="Confusion pairs drill" onClick={() => quickLaunch('pairs')} />
          <QuickCard title="Exam mode" desc="Timed · no hints · strict" onClick={() => quickLaunch('exam')} />
        </div>
      </section>

      <section className="card">
        <h4>Custom session</h4>

        <div className="col gap-16" style={{ marginTop: 8 }}>
          <Group label="Tier">
            {[1, 2, 3].map(t => (
              <Chip key={t} active={tiers.includes(t)} onClick={() => toggle(tiers, t, setTiers)}>Tier {t}</Chip>
            ))}
          </Group>

          <Group label="Category (optional)">
            {categoryList.map(c => (
              <Chip key={c} active={categories.includes(c)} onClick={() => toggle(categories, c, setCategories)}>{c}</Chip>
            ))}
          </Group>

          <div className="row gap-16" style={{ flexWrap: 'wrap' }}>
            <div className="field" style={{ minWidth: 160 }}>
              <label>Mode</label>
              <select className="select" value={mode} onChange={e => setMode(e.target.value)}>
                <option value="rec+perf">Recognition + Performance</option>
                <option value="rec">Recognition only</option>
              </select>
            </div>

            <div className="field" style={{ minWidth: 120 }}>
              <label>Session size</label>
              <select className="select" value={size} onChange={e => setSize(Number(e.target.value))}>
                {[5, 10, 15, 20, 30].map(n => <option key={n} value={n}>{n} cards</option>)}
              </select>
            </div>

            <div className="field" style={{ minWidth: 180 }}>
              <label>Order</label>
              <select className="select" value={order} onChange={e => setOrder(e.target.value)}>
                <option value="random">Random</option>
                <option value="tier">Grouped by tier</option>
                <option value="category">Grouped by category</option>
                <option value="weakness">By weakness (hard first)</option>
              </select>
            </div>

            <div className="field" style={{ minWidth: 140 }}>
              <label>Difficulty</label>
              <select className="select" value={difficulty} onChange={e => setDifficulty(e.target.value)}>
                <option value="learning">Learning</option>
                <option value="strong">Strong</option>
                <option value="exam">Exam</option>
              </select>
            </div>
          </div>

          <Group label="Options">
            <Chip active={mixPairs} onClick={() => setMixPairs(!mixPairs)}>Mix confusion pairs</Chip>
          </Group>

          <div className="row" style={{ justifyContent: 'flex-end' }}>
            <button className="btn btn-primary btn-lg" onClick={startCustom}>Start session →</button>
          </div>
        </div>
      </section>
    </div>
  );
}

function QuickCard({ title, desc, onClick, disabled, primary }) {
  return (
    <button
      className={`card card-hover`}
      style={{
        textAlign: 'left',
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
        borderColor: primary ? 'var(--accent)' : undefined
      }}
      disabled={disabled}
      onClick={onClick}
    >
      <div style={{ fontWeight: 600, marginBottom: 4 }}>{title}</div>
      <div className="muted" style={{ fontSize: 13 }}>{desc}</div>
    </button>
  );
}

function Group({ label, children }) {
  return (
    <div className="field">
      <label>{label}</label>
      <div className="chips">{children}</div>
    </div>
  );
}

function Chip({ active, onClick, children }) {
  return <button className={`chip ${active ? 'active' : ''}`} onClick={onClick}>{children}</button>;
}

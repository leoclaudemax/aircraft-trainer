import React from 'react';
import { useStore } from '../../state/store.jsx';

export default function Settings() {
  const { state, actions } = useStore();
  const s = state.settings;

  const exportData = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aircraft-trainer-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (!data.settings || !data.progress) throw new Error('Invalid file');
        if (confirm('Replace your current data with this file?')) {
          actions.importState(data);
        }
      } catch (err) {
        alert('Could not import file: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="col gap-24" style={{ maxWidth: 720 }}>
      <div>
        <h1 style={{ marginBottom: 4 }}>Settings</h1>
        <div className="muted">Preferences are stored in your browser only.</div>
      </div>

      <Section title="Appearance">
        <Row label="Theme">
          <select className="select" value={s.theme} onChange={e => actions.updateSettings({ theme: e.target.value })}>
            <option value="dark">Dark</option>
            <option value="light">Light</option>
          </select>
        </Row>
      </Section>

      <Section title="Training defaults">
        <Row label="Default session size">
          <select className="select" value={s.defaultSessionSize} onChange={e => actions.updateSettings({ defaultSessionSize: Number(e.target.value) })}>
            {[5, 10, 15, 20, 30].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </Row>
        <Row label="Default difficulty">
          <select className="select" value={s.defaultDifficulty} onChange={e => actions.updateSettings({ defaultDifficulty: e.target.value })}>
            <option value="learning">Learning</option>
            <option value="strong">Strong</option>
            <option value="exam">Exam</option>
          </select>
        </Row>
        <Row label="Exam mode timer (seconds)">
          <input
            className="input"
            type="number" min="5" max="120"
            value={s.examTimerSeconds}
            onChange={e => actions.updateSettings({ examTimerSeconds: Number(e.target.value) })}
            style={{ width: 100 }}
          />
        </Row>
        <Row label="Keyboard shortcuts">
          <input
            type="checkbox"
            checked={s.keyboardShortcuts}
            onChange={e => actions.updateSettings({ keyboardShortcuts: e.target.checked })}
          />
        </Row>
      </Section>

      <Section title="Keyboard shortcuts (during sessions)">
        <ul style={{ margin: 0, paddingLeft: 18, color: 'var(--text-muted)' }}>
          <li><span className="kbd">R</span> or <span className="kbd">Space</span> — reveal answer</li>
          <li><span className="kbd">S</span> — skip · <span className="kbd">F</span> — flag as hard</li>
          <li><span className="kbd">1</span>/<span className="kbd">2</span>/<span className="kbd">3</span> — Easy / Unsure / Wrong</li>
          <li><span className="kbd">P</span> — learn performance tier</li>
          <li><span className="kbd">Y</span>/<span className="kbd">U</span>/<span className="kbd">N</span> — performance: Know / Unsure / Don't know</li>
          <li><span className="kbd">↵</span> or <span className="kbd">Space</span> — next card</li>
          <li><span className="kbd">Esc</span> — end session</li>
        </ul>
      </Section>

      <Section title="Data">
        <div className="row gap-8" style={{ flexWrap: 'wrap' }}>
          <button className="btn" onClick={exportData}>Export backup</button>
          <label className="btn" style={{ cursor: 'pointer' }}>
            Import backup
            <input type="file" accept="application/json" onChange={importData} style={{ display: 'none' }} />
          </label>
          <button
            className="btn btn-danger"
            onClick={() => { if (confirm('This will delete ALL your progress. Are you sure?')) actions.resetAll(); }}
          >
            Reset all progress
          </button>
        </div>
      </Section>

      <div className="muted" style={{ fontSize: 12, textAlign: 'center', padding: 24 }}>
        Aircraft Trainer · built for FIC Delta OJT preparation.<br/>
        Images via Wikipedia / Wikimedia Commons.
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="card col gap-16">
      <h4 style={{ margin: 0 }}>{title}</h4>
      {children}
    </div>
  );
}

function Row({ label, children }) {
  return (
    <div className="row" style={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
      <div>{label}</div>
      <div>{children}</div>
    </div>
  );
}

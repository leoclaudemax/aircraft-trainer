import React from 'react';
import { useStore } from '../../state/store.jsx';

export default function Topbar({ nav, active, onNav }) {
  const { state, actions } = useStore();
  const toggleTheme = () => actions.updateSettings({ theme: state.settings.theme === 'dark' ? 'light' : 'dark' });

  return (
    <header className="topbar">
      <div className="topbar-brand">
        <div className="mark">A</div>
        <div>Aircraft Trainer<span className="hidden-mobile muted" style={{ marginLeft: 8, fontWeight: 400 }}>· FIC Delta</span></div>
      </div>
      <nav className="topbar-nav">
        {nav.map(n => (
          <button
            key={n.id}
            className={`nav-btn ${active === n.id ? 'active' : ''}`}
            onClick={() => onNav(n.id)}
          >
            {n.label}
          </button>
        ))}
      </nav>
      <button className="btn btn-ghost btn-sm" onClick={toggleTheme} title="Toggle theme">
        {state.settings.theme === 'dark' ? '☾' : '☀'}
      </button>
    </header>
  );
}

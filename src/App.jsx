import React, { useState } from 'react';
import { useStore } from './state/store.jsx';
import Topbar from './components/common/Topbar.jsx';
import FlashcardsRoute from './components/flashcards/FlashcardsRoute.jsx';
import LibraryRoute from './components/library/LibraryRoute.jsx';
import Dashboard from './components/dashboard/Dashboard.jsx';
import Settings from './components/settings/Settings.jsx';

const NAV = [
  { id: 'flashcards', label: 'Train' },
  { id: 'library', label: 'Library' },
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'settings', label: 'Settings' }
];

export default function App() {
  const [route, setRoute] = useState('flashcards');
  const [routeArg, setRouteArg] = useState(null);

  const navigate = (id, arg = null) => { setRoute(id); setRouteArg(arg); window.scrollTo(0, 0); };

  return (
    <div className="app">
      <Topbar nav={NAV} active={route} onNav={navigate} />
      <main className="main fadein" key={route}>
        {route === 'flashcards' && <FlashcardsRoute initial={routeArg} navigate={navigate} />}
        {route === 'library' && <LibraryRoute initialAircraftId={routeArg} navigate={navigate} />}
        {route === 'dashboard' && <Dashboard navigate={navigate} />}
        {route === 'settings' && <Settings />}
      </main>
    </div>
  );
}

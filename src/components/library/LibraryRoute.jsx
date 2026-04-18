import React, { useState } from 'react';
import LibraryGrid from './LibraryGrid.jsx';
import AircraftDetail from './AircraftDetail.jsx';
import Compare from './Compare.jsx';

export default function LibraryRoute({ initialAircraftId, navigate }) {
  const [view, setView] = useState(initialAircraftId ? 'detail' : 'grid');
  const [activeId, setActiveId] = useState(initialAircraftId || null);
  const [compareIds, setCompareIds] = useState(null);

  const openAircraft = (id) => { setActiveId(id); setView('detail'); window.scrollTo(0, 0); };
  const openCompare = (idA, idB) => { setCompareIds([idA, idB]); setView('compare'); window.scrollTo(0, 0); };
  const back = () => { setView('grid'); setActiveId(null); setCompareIds(null); };

  if (view === 'detail') return <AircraftDetail id={activeId} onBack={back} onOpen={openAircraft} onCompare={openCompare} navigate={navigate} />;
  if (view === 'compare') return <Compare ids={compareIds} onBack={back} onOpen={openAircraft} />;
  return <LibraryGrid onOpen={openAircraft} />;
}

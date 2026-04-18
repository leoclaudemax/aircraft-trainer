import React, { useEffect, useState } from 'react';
import { fetchAircraftImage } from '../../state/store.jsx';

export default function AircraftImage({ aircraft, alt, className = '' }) {
  const [src, setSrc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(false);
    setSrc(null);
    fetchAircraftImage(aircraft.wikipediaTitle).then(url => {
      if (cancelled) return;
      if (url) setSrc(url);
      else setError(true);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [aircraft.id]);

  if (loading) {
    return (
      <div className={`fc-image-placeholder ${className}`}>
        <div style={{ width: 32, height: 32, border: '2px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }
  if (error || !src) {
    return (
      <div className={`fc-image-placeholder ${className}`}>
        <div style={{ fontSize: 32 }}>✈</div>
        <div>Image unavailable</div>
        <div className="dim" style={{ fontSize: 11 }}>Could not load from Wikipedia</div>
      </div>
    );
  }
  return <img src={src} alt={alt || aircraft.name} loading="lazy" />;
}

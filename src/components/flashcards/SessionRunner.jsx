import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useStore } from '../../state/store.jsx';
import { aircraftById } from '../../data/aircraft.js';
import { performanceTiers } from '../../data/performanceTiers.js';
import { tellApartFor } from '../../data/confusionPairs.js';
import { applyRating, createQueue, summarize } from '../../state/sessionEngine.js';
import AircraftImage from '../common/AircraftImage.jsx';

// Phases per card: 'image' | 'reveal' | 'rated' | 'perf-reveal' | 'perf-rated'
export default function SessionRunner({ config, onFinish, onAbort }) {
  const { state, masteryById, actions } = useStore();
  const [queue, setQueue] = useState(() => createQueue(config.deck));
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState('image');
  const [results, setResults] = useState([]); // accumulated
  const resultsRef = useRef([]);
  const [hardFlaggedThisCard, setHardFlaggedThisCard] = useState(false);
  const [showPerf, setShowPerf] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const startedAt = useRef(Date.now());
  const masteryBefore = useRef(masteryById);

  // Keep ref in sync so async callbacks (setTimeout in exam mode) see latest results.
  useEffect(() => { resultsRef.current = results; }, [results]);

  const card = queue[index];
  const ac = card ? aircraftById[card.aircraftId] : null;
  const tier = ac ? performanceTiers[ac.perfTier] : null;
  const finished = !card;

  // Exam timer
  useEffect(() => {
    if (!config.timed || phase !== 'image' || finished) return;
    setTimeLeft(config.timerSeconds || 30);
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - start) / 1000);
      const remaining = (config.timerSeconds || 30) - elapsed;
      if (remaining <= 0) {
        clearInterval(interval);
        // auto-rate as wrong
        rateRecognition('wrong');
      } else {
        setTimeLeft(remaining);
      }
    }, 250);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, index, finished]);

  // Keyboard shortcuts
  useEffect(() => {
    if (!state.settings.keyboardShortcuts) return;
    const handler = (e) => {
      if (finished) return;
      const tag = e.target.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea') return;
      const key = e.key.toLowerCase();
      if (phase === 'image') {
        if (key === 'r' || key === ' ') { e.preventDefault(); setPhase('reveal'); }
        else if (key === 's') skip();
        else if (key === 'f') flagHard();
      } else if (phase === 'reveal') {
        if (key === '1') rateRecognition('easy');
        else if (key === '2') rateRecognition('unsure');
        else if (key === '3') rateRecognition('wrong');
      } else if (phase === 'rated') {
        if (key === 'p' && config.includePerformance && !config.examMode) revealPerf();
        else if (key === 'enter' || key === ' ') nextCard();
      } else if (phase === 'perf-reveal') {
        if (key === 'y') ratePerf('know');
        else if (key === 'u') ratePerf('unsure');
        else if (key === 'n') ratePerf('dont');
      } else if (phase === 'perf-rated') {
        if (key === 'enter' || key === ' ') nextCard();
      }
      if (key === 'escape') {
        if (confirm('End session and discard progress?')) onAbort();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, finished, card]);

  const flagHard = () => {
    if (!ac) return;
    setHardFlaggedThisCard(true);
    if (!state.progress[ac.id].flagged) actions.toggleFlag(ac.id);
  };

  const skip = () => {
    if (!ac) return;
    const newQueue = applyRating(queue, index, 'skip');
    advance(newQueue);
  };

  const rateRecognition = (rating) => {
    if (!ac) return;
    // Record result
    const result = { aircraftId: ac.id, recognitionRating: rating, ts: Date.now() };
    setResults(r => [...r, result]);
    setPhase('rated');

    // Apply spaced rep & advance later (so user sees reveal first)
    // We compute the queue change but only commit when user clicks "Next" or rates perf.
    pendingQueueChange.current = applyRating(queue, index, rating, { hardFlagged: hardFlaggedThisCard });

    // If exam mode or no perf included, auto-advance shortly
    if (config.examMode || !config.includePerformance) {
      // small delay so user sees the answer
      setTimeout(() => nextCard(), 600);
    }
  };

  const revealPerf = () => setPhase('perf-reveal');

  const ratePerf = (rating) => {
    // Update last result with performance rating
    setResults(rs => {
      const copy = [...rs];
      copy[copy.length - 1] = { ...copy[copy.length - 1], performanceRating: rating };
      return copy;
    });
    setPhase('perf-rated');
  };

  const pendingQueueChange = useRef(null);

  const nextCard = () => {
    const newQueue = pendingQueueChange.current || queue;
    pendingQueueChange.current = null;
    advance(newQueue);
  };

  const advance = (newQueue) => {
    setHardFlaggedThisCard(false);
    setShowPerf(false);
    if (index + 1 >= newQueue.length) {
      setQueue(newQueue);
      finishSession(newQueue);
    } else {
      setQueue(newQueue);
      setIndex(index + 1);
      setPhase('image');
    }
  };

  const finishSession = (finalQueue) => {
    const session = {
      ts: Date.now(),
      durationMs: Date.now() - startedAt.current,
      results: resultsRef.current,
      label: config.label,
      examMode: !!config.examMode
    };
    actions.recordSession(session);
    // Compute summary using mastery before & after
    // Since recordSession will update progress -> mastery, we approximate "after" by re-running the engine.
    setTimeout(() => {
      // dispatch already mutated state; pull fresh masteryById on next render via parent.
      // For the summary we just hand the session in; SessionSummary reads fresh state.
      onFinish({ session, summaryArgs: { masteryBefore: masteryBefore.current } });
    }, 0);
  };

  if (finished) return null;

  // ----- Render -----
  const total = queue.length;
  const remaining = total - index;
  const fraction = (index / total) * 100;

  return (
    <div className="fc-stage fadein" key={index + ':' + phase}>
      <div className="fc-progress-row">
        <button className="btn btn-ghost btn-sm" onClick={() => { if (confirm('End session?')) onAbort(); }}>← End</button>
        <div className="muted">Card {index + 1} of {total}</div>
        <div className="spacer" />
        {config.timed && phase === 'image' && timeLeft !== null && (
          <div className={timeLeft <= 5 ? 'badge badge-uncertain' : 'badge'}>{timeLeft}s</div>
        )}
        <div className="badge">{config.label}</div>
      </div>
      <div className="progress"><div className="progress-fill" style={{ width: `${fraction}%` }} /></div>

      <div className="fc-image-wrap">
        <AircraftImage aircraft={ac} alt={phase === 'image' ? 'Mystery aircraft' : ac.name} />
      </div>

      {phase === 'image' && (
        <>
          <div className="fc-prompt">What aircraft is this?</div>
          <div className="fc-actions">
            <button className="btn btn-primary btn-lg" onClick={() => setPhase('reveal')}>Reveal <span className="kbd hidden-mobile">R</span></button>
            <button className="btn" onClick={skip}>Skip <span className="kbd hidden-mobile">S</span></button>
            <button className={`btn ${hardFlaggedThisCard ? 'btn-danger' : ''}`} onClick={flagHard} disabled={hardFlaggedThisCard}>
              {hardFlaggedThisCard ? '✓ Flagged' : 'Flag as hard'} <span className="kbd hidden-mobile">F</span>
            </button>
          </div>
        </>
      )}

      {(phase === 'reveal' || phase === 'rated' || phase === 'perf-reveal' || phase === 'perf-rated') && (
        <div className="reveal-block fadein">
          <div className="reveal-name">{ac.name}</div>
          <div className="reveal-meta">
            <span className={`badge badge-tier-${ac.tier}`}>Tier {ac.tier}</span>
            <span className="badge">{ac.subcategory}</span>
            <span className="badge">{ac.category}</span>
            <span className="badge">Perf {ac.perfTier}</span>
          </div>

          <div className="reveal-section">
            <h4>Recognition</h4>
            <p>{ac.recognition}</p>
          </div>

          <div className="reveal-section">
            <h4>Visual markers</h4>
            <ul>{ac.visualMarkers.map((v, i) => <li key={i}>{v}</li>)}</ul>
          </div>

          {ac.confusedWith?.length > 0 && (
            <div className="reveal-section">
              <h4>Most confused with</h4>
              <ul>
                {ac.confusedWith.map(id => {
                  const partner = aircraftById[id];
                  if (!partner) return null;
                  const tip = tellApartFor(ac.id, id);
                  return <li key={id}>→ {partner.name}{tip ? ` — ${tip}` : ''}</li>;
                })}
              </ul>
            </div>
          )}

          <div className="reveal-section">
            <h4>Context</h4>
            <p className="muted">{ac.context}</p>
          </div>

          {ac.memoryTip && (
            <div className="reveal-section">
              <h4>Memory tip</h4>
              <p style={{ color: 'var(--accent)' }}>{ac.memoryTip}</p>
            </div>
          )}

          {phase === 'reveal' && (
            <>
              <div className="divider" />
              <div className="muted" style={{ marginBottom: 8, textAlign: 'center', fontSize: 13 }}>How well did you recognize it?</div>
              <div className="fc-rate-row">
                <button className="rate-btn easy" onClick={() => rateRecognition('easy')}>✓ Easy <span className="kbd hidden-mobile">1</span></button>
                <button className="rate-btn unsure" onClick={() => rateRecognition('unsure')}>⚠ Unsure <span className="kbd hidden-mobile">2</span></button>
                <button className="rate-btn wrong" onClick={() => rateRecognition('wrong')}>✗ Wrong <span className="kbd hidden-mobile">3</span></button>
              </div>
            </>
          )}

          {phase === 'rated' && config.includePerformance && !config.examMode && (
            <>
              <div className="divider" />
              <div className="row" style={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                <button className="btn" onClick={revealPerf}>Learn performance tier <span className="kbd hidden-mobile">P</span></button>
                <button className="btn btn-primary" onClick={nextCard}>Next card <span className="kbd hidden-mobile">↵</span></button>
              </div>
            </>
          )}

          {(phase === 'perf-reveal' || phase === 'perf-rated') && tier && (
            <>
              <div className="divider" />
              <div className="reveal-section">
                <h4>{tier.name}</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 14, marginBottom: 12 }}>
                  <div><span className="muted">Cruise:</span> {tier.cruise}</div>
                  <div><span className="muted">Climb:</span> {tier.climb}</div>
                  <div style={{ gridColumn: 'span 2' }}><span className="muted">Altitude:</span> {tier.altitude}</div>
                </div>
                <div style={{ background: 'var(--bg-elev-2)', padding: 12, borderRadius: 8, fontSize: 14 }}>
                  <div className="muted" style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>ATC handling note</div>
                  {tier.atcNote}
                </div>
              </div>

              {phase === 'perf-reveal' && (
                <>
                  <div className="divider" />
                  <div className="muted" style={{ marginBottom: 8, textAlign: 'center', fontSize: 13 }}>Did you know this?</div>
                  <div className="fc-rate-row">
                    <button className="rate-btn easy" onClick={() => ratePerf('know')}>✓ Know <span className="kbd hidden-mobile">Y</span></button>
                    <button className="rate-btn unsure" onClick={() => ratePerf('unsure')}>⚠ Unsure <span className="kbd hidden-mobile">U</span></button>
                    <button className="rate-btn wrong" onClick={() => ratePerf('dont')}>✗ Don't know <span className="kbd hidden-mobile">N</span></button>
                  </div>
                </>
              )}

              {phase === 'perf-rated' && (
                <div className="row" style={{ justifyContent: 'flex-end', marginTop: 12 }}>
                  <button className="btn btn-primary" onClick={nextCard}>Next card <span className="kbd hidden-mobile">↵</span></button>
                </div>
              )}
            </>
          )}

          {phase === 'rated' && (config.examMode || !config.includePerformance) && (
            <div className="row" style={{ justifyContent: 'center', marginTop: 12 }}>
              <div className="muted" style={{ fontSize: 13 }}>Loading next…</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

import React, { useState } from 'react';
import SessionSetup from './SessionSetup.jsx';
import SessionRunner from './SessionRunner.jsx';
import SessionSummary from './SessionSummary.jsx';

// Phases: 'setup' | 'running' | 'summary'
export default function FlashcardsRoute({ initial, navigate }) {
  const [phase, setPhase] = useState('setup');
  const [sessionConfig, setSessionConfig] = useState(null);
  const [sessionResult, setSessionResult] = useState(null);

  const startSession = (config) => {
    setSessionConfig(config);
    setPhase('running');
  };

  const finishSession = (result) => {
    setSessionResult(result);
    setPhase('summary');
  };

  const restart = () => {
    setSessionResult(null);
    setSessionConfig(null);
    setPhase('setup');
  };

  if (phase === 'setup') return <SessionSetup onStart={startSession} initial={initial} />;
  if (phase === 'running') return <SessionRunner config={sessionConfig} onFinish={finishSession} onAbort={restart} />;
  return <SessionSummary result={sessionResult} onRestart={restart} navigate={navigate} />;
}

import React from 'react';
import { Dashboard } from './features/screening/Dashboard';

const App: React.FC = () => {
  console.log("CRITICAL: App.tsx function is EXECUTING");
  return (
    <div style={{ padding: '40px', backgroundColor: '#e0f2fe', color: '#0369a1', fontFamily: 'sans-serif' }}>
      <h1>LAYER 1 VERIFIED: App.tsx Loaded</h1>
      <Dashboard />
    </div>
  );
};

export default App;

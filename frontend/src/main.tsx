import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
// import { GlobalErrorBoundary } from './GlobalErrorBoundary';

// Inline Error Boundary to rule out import errors
class InlineErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean, error: any }> {
  state = { hasError: false, error: null };
  static getDerivedStateFromError(error: any) { return { hasError: true, error }; }
  render() {
    if (this.state.hasError) return <div style={{ padding: 40, background: 'red', color: 'white' }}>INLINE ERROR: {this.state.error?.toString()}</div>;
    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <React.StrictMode>
      <InlineErrorBoundary>
        <div style={{ padding: 40, border: '5px solid orange' }}>
          <h1>SAFE MODE: Loading App...</h1>
          <App />
        </div>
      </InlineErrorBoundary>
    </React.StrictMode>,
  )
}

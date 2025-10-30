import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

function ErrorScreen({ message, details }) {
  return (
    <div style={{
      padding: '16px',
      background: '#fff5f5',
      color: '#b00020',
      border: '1px solid #f5c2c7',
      borderRadius: '8px',
      fontFamily: 'system-ui,Segoe UI,Roboto,Helvetica,Arial,sans-serif'
    }}>
      <h2 style={{ margin: '0 0 8px 0' }}>Runtime error</h2>
      <div style={{ marginBottom: 8 }}>{message}</div>
      {details ? (
        <pre style={{ whiteSpace: 'pre-wrap', margin: 0, maxHeight: '40vh', overflow: 'auto' }}>{details}</pre>
      ) : null}
    </div>
  );
}

function showFatalError(message, details) {
  // Render via React to avoid DOM mutations outside React tree
  root.render(
    <React.StrictMode>
      <ErrorScreen message={message} details={details} />
    </React.StrictMode>
  );
}

window.addEventListener('error', (e) => {
  showFatalError(e.message || 'An unexpected error occurred.', e.error?.stack);
});
window.addEventListener('unhandledrejection', (e) => {
  const reason = e.reason instanceof Error ? `${e.reason.message}\n${e.reason.stack}` : String(e.reason);
  showFatalError('Unhandled promise rejection', reason);
});

// Add error boundary
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('React Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', backgroundColor: '#fee', color: '#c00' }}>
          <h1>Something went wrong with the Smart School App</h1>
          <p>Error: {this.state.error?.message}</p>
          <pre>{this.state.error?.stack}</pre>
          <button onClick={() => window.location.reload()} style={{ marginTop: '10px', padding: '10px' }}>
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Dynamically import to surface module import errors on screen
import('./SmartSchoolApp.jsx')
  .then(({ default: SmartSchoolApp }) => {
    root.render(
      <React.StrictMode>
        <ErrorBoundary>
          <SmartSchoolApp />
        </ErrorBoundary>
      </React.StrictMode>
    );
  })
  .catch((err) => {
    console.error('Failed to load SmartSchoolApp:', err);
    showFatalError('Failed to load app module.', err?.stack || String(err));
  });

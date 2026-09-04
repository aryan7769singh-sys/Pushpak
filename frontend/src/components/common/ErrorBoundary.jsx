import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('UI Error Caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '2rem',
          margin: '2rem',
          background: 'var(--bg-surface)',
          border: '1px solid var(--status-error)',
          borderRadius: 'var(--radius-lg)',
          color: 'var(--text-primary)',
        }}>
          <h2 style={{ color: 'var(--status-error)', marginBottom: '0.5rem' }}>Component Rendering Error</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            An unexpected error occurred in the user interface.
          </p>
          <pre style={{
            background: 'var(--bg-primary)',
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            overflowX: 'auto',
            fontSize: '0.8rem',
            color: 'var(--status-degraded)',
          }}>
            {this.state.error?.toString()}
          </pre>
        </div>
      );
    }

    return this.props.children;
  }
}

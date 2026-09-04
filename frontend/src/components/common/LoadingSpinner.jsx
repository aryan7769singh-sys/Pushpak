import React from 'react';

export function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3rem',
      gap: '1rem',
      color: 'var(--text-secondary)'
    }}>
      <div style={{
        width: '32px',
        height: '32px',
        border: '3px solid var(--border-subtle)',
        borderTopColor: 'var(--accent-cyan)',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <span style={{ fontSize: '0.85rem' }}>{message}</span>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

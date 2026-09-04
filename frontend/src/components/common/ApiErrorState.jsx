import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export function ApiErrorState({
  title = 'API Service Unavailable',
  message = 'Unable to establish communication with the PUSHPAK API service.',
  onRetry,
}) {
  return (
    <div
      style={{
        padding: '24px',
        margin: '16px 0',
        background: '#fef2f2',
        border: '1px solid #fecaca',
        borderRadius: '3px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: '12px',
      }}
    >
      <div
        style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          background: '#fee2e2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#dc2626',
        }}
      >
        <AlertCircle size={20} />
      </div>

      <div>
        <h3
          style={{
            margin: '0 0 4px 0',
            fontSize: '14px',
            fontWeight: 700,
            color: '#991b1b',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
          }}
        >
          {title}
        </h3>
        <p
          style={{
            margin: 0,
            fontSize: '12px',
            color: '#7f1d1d',
            maxWidth: '520px',
            lineHeight: 1.5,
          }}
        >
          {message}
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
        <span className="gov-badge alert" style={{ fontSize: '10px' }}>
          DEGRADED / OFFLINE
        </span>
        {onRetry && (
          <button
            className="gov-btn gov-btn-primary"
            onClick={onRetry}
            style={{ height: '26px', fontSize: '11px', padding: '0 10px' }}
          >
            <RefreshCw size={12} />
            <span>Retry Connection</span>
          </button>
        )}
      </div>
    </div>
  );
}

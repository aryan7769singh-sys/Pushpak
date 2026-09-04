import React, { useEffect, useState } from 'react';
import { fetchHealth } from '../../services/api';
import { StatusBadge } from '../common/StatusBadge';
import { ExternalLink, RefreshCw } from 'lucide-react';

export function Topbar() {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkStatus = async () => {
    setLoading(true);
    const result = await fetchHealth();
    setHealth(result.data);
    setLoading(false);
  };

  useEffect(() => {
    checkStatus();
    const interval = setInterval(checkStatus, 30000); // 30s auto-refresh
    return () => clearInterval(interval);
  }, []);

  const overallStatus = health?.status || 'loading';

  return (
    <header className="topbar">
      <div className="topbar-left">
        <div className="horizon-pills-row">
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginRight: '4px' }}>
            Advance Horizons:
          </span>
          <span className="horizon-pill t1" title="T+1: Last-minute dynamic surge">T+1</span>
          <span className="horizon-pill t7" title="T+7: 1-week urgent advance">T+7</span>
          <span className="horizon-pill t15" title="T+15: 2-week corporate baseline">T+15</span>
          <span className="horizon-pill t30" title="T+30: 1-month leisure planning">T+30</span>
          <span className="horizon-pill t45" title="T+45: 45-day extended advance">T+45</span>
        </div>
      </div>

      <div className="topbar-right">
        <button
          onClick={checkStatus}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            padding: '4px',
          }}
          title="Refresh backend status"
        >
          <RefreshCw size={14} className={loading ? 'spinning' : ''} />
        </button>

        <StatusBadge
          status={overallStatus}
          label={
            overallStatus === 'ok'
              ? 'SYSTEM OK'
              : overallStatus === 'degraded'
              ? 'DB DEGRADED'
              : overallStatus === 'loading'
              ? 'CHECKING...'
              : 'OFFLINE'
          }
        />

        <a
          href="http://127.0.0.1:8000/docs"
          target="_blank"
          rel="noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '0.75rem',
            color: 'var(--text-secondary)',
            background: 'var(--bg-surface)',
            padding: '4px 8px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <span>OpenAPI Docs</span>
          <ExternalLink size={12} />
        </a>
      </div>
    </header>
  );
}

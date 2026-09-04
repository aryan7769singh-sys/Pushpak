import React, { useState, useEffect } from 'react';
import { Search, ShieldCheck, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchHealth } from '../../services/api';
import { StatusBadge } from '../common/StatusBadge';

export function GovernmentHeader({ pageTitle = "EXECUTIVE INDEX VIEW", sectionLabel = "OVERVIEW" }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [healthStatus, setHealthStatus] = useState('healthy');
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    async function checkApi() {
      const res = await fetchHealth();
      if (mounted) {
        if (res.ok && res.data.status === 'ok') {
          setHealthStatus('healthy');
        } else if (res.data?.status === 'degraded') {
          setHealthStatus('degraded');
        } else {
          setHealthStatus('offline');
        }
      }
    }
    checkApi();
    const interval = setInterval(checkApi, 30000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/routes?search=${encodeURIComponent(searchTerm.trim().toUpperCase())}`);
    }
  };

  return (
    <header className="gov-top-header">
      {/* Left: Page Title & Breadcrumb */}
      <div className="header-left">
        <div>
          <div className="header-breadcrumbs">
            <span>PUSHPAK</span>
            <span>/</span>
            <span>{sectionLabel}</span>
          </div>
          <div className="header-page-title">{pageTitle}</div>
        </div>
      </div>

      {/* Center: Search Corridor & 5 Horizons */}
      <div className="header-center">
        <form onSubmit={handleSearchSubmit} className="search-corridor-box">
          <Search size={13} color="#64748b" />
          <input
            type="text"
            placeholder="Search corridor (e.g. DEL-BOM)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>

        <div className="header-horizons">
          <span style={{ fontSize: '10px', color: 'var(--text-subtle)', fontWeight: 600, marginRight: '2px' }}>
            HORIZONS:
          </span>
          <span className="horizon-tag t1" title="T+1: 24h Spot Surge">T+1</span>
          <span className="horizon-tag t7" title="T+7: 7-Day Urgent">T+7</span>
          <span className="horizon-tag t15" title="T+15: 15-Day Corporate">T+15</span>
          <span className="horizon-tag t30" title="T+30: 30-Day Leisure">T+30</span>
          <span className="horizon-tag t45" title="T+45: 45-Day Early">T+45</span>
        </div>
      </div>

      {/* Right: Date, Freshness, System Health */}
      <div className="header-right">
        <div className="freshness-tag">
          <span className="pulse-dot" />
          <span>04 SEP 2026 | 18:30 IST</span>
        </div>

        <StatusBadge
          status={healthStatus}
          label={healthStatus === 'healthy' ? 'SYSTEM HEALTHY' : healthStatus === 'degraded' ? 'DB DEGRADED' : 'OFFLINE'}
        />

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '11px',
            fontWeight: 600,
            color: 'var(--navy-dark)',
            borderLeft: '1px solid var(--border-light)',
            paddingLeft: '10px',
          }}
          title="Smart India Hackathon 2026 Official Institutional Portal"
        >
          <ShieldCheck size={14} color="#1e3a8a" />
          <span>SIH-2026</span>
        </div>
      </div>
    </header>
  );
}

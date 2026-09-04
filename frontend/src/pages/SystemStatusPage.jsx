import React, { useState, useEffect } from 'react';
import { fetchHealth, fetchSystemInfo } from '../services/api';
import { StatusBadge } from '../components/common/StatusBadge';
import { KpiCard } from '../components/common/KpiCard';
import { Server, Database, RefreshCw, Layers, ShieldCheck, Activity } from 'lucide-react';

export function SystemStatusPage() {
  const [health, setHealth] = useState(null);
  const [systemInfo, setSystemInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [latency, setLatency] = useState(null);
  const [lastProbeTime, setLastProbeTime] = useState('');

  const runProbe = async () => {
    setLoading(true);
    const start = performance.now();
    const [hRes, sRes] = await Promise.all([fetchHealth(), fetchSystemInfo()]);
    const duration = Math.round(performance.now() - start);

    setHealth(hRes.data);
    if (sRes.ok) setSystemInfo(sRes.data);
    setLatency(duration);
    setLastProbeTime(new Date().toLocaleTimeString());
    setLoading(false);
  };

  useEffect(() => {
    runProbe();
  }, []);

  const overallStatus = health?.status || 'unknown';
  const apiStatus = health?.components?.api?.status || 'unknown';
  const dbStatus = health?.components?.database?.status || 'unknown';

  const pipelineComponents = [
    {
      name: "FastAPI REST API Service",
      role: "API Service",
      status: apiStatus === 'ok' ? 'HEALTHY' : 'OFFLINE',
      detail: health?.components?.api?.message || 'Probing API service...',
      version: health?.version || '0.1.0',
    },
    {
      name: "PostgreSQL Database Engine",
      role: "Storage & Persistence",
      status: dbStatus === 'connected' ? 'HEALTHY' : 'DEGRADED',
      detail: health?.components?.database?.message || 'Check database credentials in backend/.env',
      version: "PostgreSQL 18",
    },
    {
      name: "Frontend Intelligence Dashboard",
      role: "User Interface",
      status: "HEALTHY",
      detail: "Client-side routing operational, optimized institutional build",
      version: "0.1.0",
    },
    {
      name: "Data Ingestion & Normalization Pipeline",
      role: "Data Pipeline",
      status: "PLANNED",
      detail: "Pipeline architecture specified; real ingestion activates in Phase 3",
      version: "Phase 3 Target",
    },
    {
      name: "Jevons Statistical Index Engine",
      role: "Statistical Engine",
      status: "PLANNED",
      detail: "Index methodology specified; computation engine activates in Phase 4",
      version: "Phase 4 Target",
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="gov-page-header">
        <div className="gov-title-block">
          <h1>SYSTEM STATUS & AUDIT DIAGNOSTICS</h1>
          <p>Real-time infrastructure health probe and component availability surveillance.</p>
        </div>
        <div className="gov-action-controls">
          <span style={{ fontSize: '11px', color: 'var(--text-subtle)' }}>
            Last checked: {lastProbeTime || 'Checking...'}
          </span>
          <button className="gov-btn" onClick={runProbe} disabled={loading}>
            <RefreshCw size={13} className={loading ? 'spinning' : ''} />
            <span>Run Probe</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="gov-kpi-grid">
        <KpiCard
          title="Overall System State"
          value={overallStatus === 'ok' ? 'HEALTHY' : overallStatus === 'degraded' ? 'DEGRADED' : 'OFFLINE'}
          subtext="Composite status across operational services"
          badgeText={overallStatus.toUpperCase()}
          badgeType={overallStatus === 'ok' ? 'ok' : overallStatus === 'degraded' ? 'warn' : 'alert'}
          highlight={true}
        />
        <KpiCard
          title="FastAPI REST API"
          value={apiStatus === 'ok' ? 'ONLINE' : 'OFFLINE'}
          subtext={`Service: ${health?.service || 'pushpak-api'} v${health?.version || '0.1.0'}`}
          badgeText="RESPONSIVE"
          badgeType={apiStatus === 'ok' ? 'ok' : 'alert'}
        />
        <KpiCard
          title="PostgreSQL 18 DB"
          value={dbStatus === 'connected' ? 'CONNECTED' : 'UNREACHABLE'}
          subtext={dbStatus === 'connected' ? 'Port 5432 healthy' : 'Set credentials in backend/.env'}
          badgeText="POSTGRES"
          badgeType={dbStatus === 'connected' ? 'ok' : 'warn'}
        />
        <KpiCard
          title="Diagnostic Round-Trip Latency"
          value={latency !== null ? `${latency} ms` : '—'}
          subtext="Native fetch() probe response time"
          badgeText="PROBED"
          badgeType="info"
        />
      </div>

      {/* PUSHPAK Components Table */}
      <div className="gov-card">
        <div className="gov-card-header">
          <div className="gov-card-title">
            PUSHPAK PIPELINE & COMPONENT STATUS
            <span className="gov-card-subtitle">Operational status of backend services and platform pipeline components</span>
          </div>
        </div>
        <div className="gov-table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
          <table className="gov-table">
            <thead>
              <tr>
                <th>COMPONENT</th>
                <th>ROLE</th>
                <th>OPERATIONAL STATUS</th>
                <th>DIAGNOSTIC TELEMETRY / MESSAGE</th>
                <th>VERSION / PHASE</th>
              </tr>
            </thead>
            <tbody>
              {pipelineComponents.map((sub) => (
                <tr key={sub.name}>
                  <td style={{ fontWeight: 600, color: 'var(--navy-dark)' }}>{sub.name}</td>
                  <td><span className="gov-badge info">{sub.role}</span></td>
                  <td><StatusBadge status={sub.status} /></td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '11.5px', maxWidth: '380px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {sub.detail}
                  </td>
                  <td className="font-mono">{sub.version}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Raw Payload Diagnostic Box */}
      <div className="gov-card">
        <div className="gov-card-header">
          <div className="gov-card-title">
            LIVE HEALTH API RESPONSE (GET /api/v1/health)
            <span className="gov-card-subtitle">Transparent runtime diagnostic telemetry</span>
          </div>
          <span className="font-mono" style={{ fontSize: '11px', color: 'var(--text-subtle)' }}>
            Environment: {health?.environment || 'development'}
          </span>
        </div>
        <div className="gov-card-body" style={{ padding: '8px 12px' }}>
          <pre style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '2px',
            padding: '10px',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'var(--navy-dark)',
            overflowX: 'auto',
          }}>
            {JSON.stringify(health, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}

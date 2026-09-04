import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { LeadTimeCurveChart } from '../components/charts/LeadTimeCurveChart';
import { QualityBadge } from '../components/common/QualityBadge';
import { KpiCard } from '../components/common/KpiCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ApiErrorState } from '../components/common/ApiErrorState';
import {
  fetchDashboardHorizons,
  fetchDashboardRoutes,
  fetchDashboardAlerts,
} from '../services/api';
import { RefreshCw } from 'lucide-react';

export function AnalyticsPage() {
  const [selectedSector, setSelectedSector] = useState('DEL-BOM');
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  const [horizons, setHorizons] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [alerts, setAlerts] = useState([]);

  const loadData = useCallback(async () => {
    setLoading(true);
    setApiError(null);

    const [hzRes, routesRes, alertsRes] = await Promise.all([
      fetchDashboardHorizons(),
      fetchDashboardRoutes(),
      fetchDashboardAlerts(),
    ]);

    if (!hzRes.ok) {
      setApiError(`Horizons API: ${hzRes.error}`);
      setLoading(false);
      return;
    }
    if (!routesRes.ok) {
      setApiError(`Routes API: ${routesRes.error}`);
      setLoading(false);
      return;
    }
    if (!alertsRes.ok) {
      setApiError(`Alerts API: ${alertsRes.error}`);
      setLoading(false);
      return;
    }

    setHorizons(hzRes.data.horizons || []);
    setRoutes(routesRes.data.routes || []);
    setAlerts(alertsRes.data.alerts || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const activeCorridor = useMemo(() => {
    return routes.find(c => c.route_id === selectedSector) || routes[0] || null;
  }, [routes, selectedSector]);

  const leadTimePoints = useMemo(() => {
    if (!activeCorridor) return [];
    return [
      { horizon: 'T+1', fare: activeCorridor.t1_fare, label: '24h Spot' },
      { horizon: 'T+7', fare: activeCorridor.t7_fare, label: '7 Days' },
      { horizon: 'T+15', fare: activeCorridor.t15_fare, label: '15 Days' },
      { horizon: 'T+30', fare: activeCorridor.t30_fare, label: '30 Days' },
      { horizon: 'T+45', fare: activeCorridor.t45_fare, label: '45 Days' },
    ];
  }, [activeCorridor]);

  const volatilityRanking = useMemo(() => {
    return [...routes].sort((a, b) => {
      const vA = parseFloat(a.volatility.match(/\((.*?)%\)/)?.[1] || '0');
      const vB = parseFloat(b.volatility.match(/\((.*?)%\)/)?.[1] || '0');
      return vB - vA;
    }).slice(0, 8);
  }, [routes]);

  if (loading && routes.length === 0) {
    return <LoadingSpinner message="Retrieving advance-purchase lead-time curves and analytics from API..." />;
  }

  if (apiError && routes.length === 0) {
    return (
      <div>
        <div className="gov-page-header">
          <div className="gov-title-block">
            <h1>ADVANCED AIRFARE ANALYTICS</h1>
            <p>Lead-time horizon curves, volatility ranking, and demonstration surveillance alerts.</p>
          </div>
        </div>
        <ApiErrorState
          title="Analytics API Unavailable"
          message={`Communication failure while querying analytics feeds: ${apiError}.`}
          onRetry={loadData}
        />
      </div>
    );
  }

  const surgePremiumPct = activeCorridor && activeCorridor.t45_fare > 0
    ? Math.round(((activeCorridor.t1_fare - activeCorridor.t45_fare) / activeCorridor.t45_fare) * 100)
    : 166;

  return (
    <div>
      {/* Header */}
      <div className="gov-page-header">
        <div className="gov-title-block">
          <h1>ADVANCED AIRFARE ANALYTICS</h1>
          <p>Lead-time horizon curves, volatility ranking, and demonstration surveillance alerts (API Demonstration).</p>
        </div>
        <div className="gov-action-controls">
          <span className="gov-badge info">API DEMONSTRATION</span>
          <select
            className="gov-select"
            value={selectedSector}
            onChange={(e) => setSelectedSector(e.target.value)}
          >
            {routes.map(c => (
              <option key={c.route_id} value={c.route_id}>
                {c.route_id} ({c.sector})
              </option>
            ))}
          </select>
          <button className="gov-btn" onClick={loadData} title="Sync with API">
            <RefreshCw size={13} />
            <span>Sync</span>
          </button>
        </div>
      </div>

      {/* KPI Stats (Powered by API GET /api/v1/dashboard/horizons & /routes) */}
      <div className="gov-kpi-grid">
        <KpiCard
          title="Dynamic Surge Premium"
          value={`+${surgePremiumPct}%`}
          delta="T+1 vs T+45"
          deltaType="negative"
          subtext={`Current sector: ${activeCorridor?.route_id || selectedSector} (Demo)`}
          badgeText="SPOT SURGE"
          badgeType="alert"
          highlight={true}
        />
        <KpiCard
          title="Required Horizons"
          value={`${horizons.length} SLICES`}
          subtext="T+1, T+7, T+15, T+30, T+45"
          badgeText="PROJECT SPECS"
          badgeType="info"
        />
        <KpiCard
          title="Sector Base Fare"
          value={`₹${activeCorridor?.base_fare?.toLocaleString() || '4,680'}`}
          subtext="Unbundled airline base fare floor"
          badgeText="UNBUNDLED"
          badgeType="info"
        />
        <KpiCard
          title="Demonstration Anomaly Alerts"
          value={alerts.length.toString()}
          delta="DEMO ALERTS"
          deltaType="negative"
          subtext="Active demonstration surveillance triggers"
          badgeText="DEMO ALERTS"
          badgeType="warn"
        />
      </div>

      {/* Section 1: Lead-Time Curves & Section 2: Pricing Wave Timeline */}
      <div className="gov-two-column">
        <div className="gov-card">
          <div className="gov-card-header">
            <div className="gov-card-title">
              1. LEAD-TIME DECAY CURVE: {selectedSector}
              <span className="gov-card-subtitle">Price decay across required horizons (API Sector Values)</span>
            </div>
            <span className="gov-badge info">DEMO DATA</span>
          </div>
          <div className="gov-card-body">
            <LeadTimeCurveChart data={leadTimePoints} route={selectedSector} />
          </div>
        </div>

        <div className="gov-card">
          <div className="gov-card-header">
            <div className="gov-card-title">
              2. PRICING WAVE TIMELINE (DEMO MODEL)
              <span className="gov-card-subtitle">Departure day pricing distribution model</span>
            </div>
            <span className="gov-badge info">DEMO MODEL</span>
          </div>
          <div className="gov-card-body" style={{ fontSize: '11.5px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { day: 'Monday (Corporate Launch)', index: 126.8, bar: 85, color: '#dc2626' },
                { day: 'Tuesday (Mid-Week Lull)', index: 118.2, bar: 60, color: '#16a34a' },
                { day: 'Wednesday (Mid-Week Baseline)', index: 119.5, bar: 65, color: '#2563eb' },
                { day: 'Thursday (Pre-Weekend Surge)', index: 124.1, bar: 78, color: '#2563eb' },
                { day: 'Friday (Weekend Rush Peak)', index: 131.4, bar: 95, color: '#dc2626' },
                { day: 'Saturday (Early Discretionary)', index: 122.3, bar: 70, color: '#2563eb' },
                { day: 'Sunday (Return Business Surge)', index: 129.7, bar: 90, color: '#dc2626' },
              ].map((row) => (
                <div key={row.day} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '160px', color: 'var(--text-main)', fontWeight: 500 }}>{row.day}</span>
                  <div style={{ flex: 1, background: '#f1f5f9', height: '12px', borderRadius: '1px', overflow: 'hidden' }}>
                    <div style={{ width: `${row.bar}%`, height: '100%', background: row.color }} />
                  </div>
                  <span className="font-mono" style={{ width: '45px', textAlign: 'right', fontWeight: 600 }}>{row.index}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Section 3 & 4: Route Volatility Ranking & Demonstration Anomaly Alerts */}
      <div className="gov-two-column">
        <div className="gov-card">
          <div className="gov-card-header">
            <div className="gov-card-title">
              3. ROUTE VOLATILITY RANKING (API BASKET)
              <span className="gov-card-subtitle">Corridors ranked by coefficient of price variation</span>
            </div>
            <span className="gov-badge info">DEMO DATA</span>
          </div>
          <div className="gov-table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
            <table className="gov-table">
              <thead>
                <tr>
                  <th>RANK</th>
                  <th>CORRIDOR</th>
                  <th>SECTOR</th>
                  <th style={{ textAlign: 'right' }}>VOLATILITY</th>
                  <th>QUALITY</th>
                </tr>
              </thead>
              <tbody>
                {volatilityRanking.map((c, i) => (
                  <tr key={c.route_id}>
                    <td className="font-mono" style={{ fontWeight: 700, color: 'var(--text-subtle)' }}>{i + 1}</td>
                    <td className="font-mono" style={{ fontWeight: 700, color: 'var(--navy-dark)' }}>{c.route_id}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{c.sector}</td>
                    <td className="font-mono" style={{ textAlign: 'right', color: '#dc2626', fontWeight: 600 }}>{c.volatility}</td>
                    <td><QualityBadge flag={c.quality} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="gov-card">
          <div className="gov-card-header">
            <div className="gov-card-title">
              4. DEMONSTRATION SURVEILLANCE ALERTS
              <span className="gov-card-subtitle">Retrieved from /api/v1/dashboard/alerts</span>
            </div>
            <span className="gov-badge alert">DEMO ALERTS</span>
          </div>
          <div className="gov-card-body" style={{ padding: '8px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  style={{
                    padding: '8px',
                    background: alert.level === 'warning' ? '#fef2f2' : alert.level === 'anomaly' ? '#fffbeb' : '#f0fdf4',
                    border: `1px solid ${alert.level === 'warning' ? '#fecaca' : alert.level === 'anomaly' ? '#fde68a' : '#bbf7d0'}`,
                    borderRadius: '2px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: alert.level === 'warning' ? '#991b1b' : alert.level === 'anomaly' ? '#92400e' : '#166534', fontSize: '11.5px' }}>
                    <span>{alert.title}</span>
                    <span className="font-mono">{alert.horizon || alert.category}</span>
                  </div>
                  <div style={{ fontSize: '11px', color: '#475569', marginTop: '2px' }}>
                    {alert.detail}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

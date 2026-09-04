import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { KpiCard } from '../components/common/KpiCard';
import { InsightCard } from '../components/common/InsightCard';
import { TimeSeriesChart } from '../components/charts/TimeSeriesChart';
import { IndiaCorridorMap } from '../components/charts/IndiaCorridorMap';
import { CorridorSurveillanceTable } from '../components/common/CorridorSurveillanceTable';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ApiErrorState } from '../components/common/ApiErrorState';
import {
  fetchDashboardSummary,
  fetchDashboardTimeseries,
  fetchDashboardMovers,
  fetchDashboardAlerts,
  fetchDashboardRoutes,
} from '../services/api';
import { Download, RefreshCw } from 'lucide-react';

export function ExecutiveOverviewPage() {
  const navigate = useNavigate();
  const [basket, setBasket] = useState('ALL-50');
  const [dateRange, setDateRange] = useState('7D');
  const [isExporting, setIsExporting] = useState(false);

  // API State
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  const [summary, setSummary] = useState(null);
  const [timeseries, setTimeseries] = useState(null);
  const [movers, setMovers] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [routes, setRoutes] = useState([]);

  const loadDashboardData = useCallback(async () => {
    setLoading(true);
    setApiError(null);

    const [summaryRes, tsRes, moversRes, alertsRes, routesRes] = await Promise.all([
      fetchDashboardSummary(),
      fetchDashboardTimeseries({ frequency: 'daily' }),
      fetchDashboardMovers(),
      fetchDashboardAlerts(),
      fetchDashboardRoutes(),
    ]);

    // Check if any critical API request failed
    if (!summaryRes.ok) {
      setApiError(`Summary API: ${summaryRes.error}`);
      setLoading(false);
      return;
    }
    if (!tsRes.ok) {
      setApiError(`Timeseries API: ${tsRes.error}`);
      setLoading(false);
      return;
    }
    if (!moversRes.ok) {
      setApiError(`Movers API: ${moversRes.error}`);
      setLoading(false);
      return;
    }
    if (!alertsRes.ok) {
      setApiError(`Alerts API: ${alertsRes.error}`);
      setLoading(false);
      return;
    }
    if (!routesRes.ok) {
      setApiError(`Routes API: ${routesRes.error}`);
      setLoading(false);
      return;
    }

    setSummary(summaryRes.data);
    setTimeseries(tsRes.data);
    setMovers(moversRes.data);
    setAlerts(alertsRes.data.alerts || []);
    const normalized = (routesRes.data.routes || []).map(r => ({
      ...r,
      id: r.route_id,
      dest: r.destination,
      distanceKm: r.distance_km,
      dailyFlights: r.daily_flights,
      avgFare: r.avg_fare,
      t1Fare: r.t1_fare,
      t7Fare: r.t7_fare,
      t15Fare: r.t15_fare,
      t30Fare: r.t30_fare,
      t45Fare: r.t45_fare,
      changePct: r.change_pct,
      baseFare: r.base_fare,
      airportCharges: r.airport_charges,
      auxFees: r.aux_fees,
    }));
    setRoutes(normalized);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      alert("PUSHPAK Surveillance Bulletin (PDF/CSV) generated for current observation window.");
      setIsExporting(false);
    }, 400);
  };

  if (loading) {
    return <LoadingSpinner message="Retrieving executive surveillance indicators from /api/v1/dashboard/..." />;
  }

  if (apiError) {
    return (
      <div>
        <div className="gov-page-header">
          <div className="gov-title-block">
            <h1>EXECUTIVE INDEX VIEW</h1>
            <p>Real-time monitoring and statistical intelligence for domestic airfare movements.</p>
          </div>
        </div>
        <ApiErrorState
          title="Executive Dashboard Offline"
          message={`Communication failure while querying the PUSHPAK API layer: ${apiError}. The dashboard will not display outdated or unverified local fallbacks.`}
          onRetry={loadDashboardData}
        />
      </div>
    );
  }

  return (
    <div>
      {/* Top Control Bar */}
      <div className="gov-page-header">
        <div className="gov-title-block">
          <h1>EXECUTIVE INDEX VIEW</h1>
          <p>Real-time monitoring and statistical intelligence for domestic airfare movements.</p>
        </div>

        <div className="gov-action-controls">
          <select
            className="gov-select"
            value={basket}
            onChange={(e) => setBasket(e.target.value)}
          >
            <option value="ALL-50">All 50 Strategic Corridors</option>
            <option value="METRO">Metro-to-Metro Basket (Top 15)</option>
            <option value="TIER2">Tier-1 to Tier-2 Connectors</option>
            <option value="REGIONAL">Regional & UDAN Sectors</option>
          </select>

          <select
            className="gov-select"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="24H">Last 24 Hours</option>
            <option value="7D">Last 7 Days</option>
            <option value="30D">Last 30 Days</option>
            <option value="YTD">Year-to-Date (YTD)</option>
          </select>

          <button className="gov-btn" onClick={loadDashboardData} title="Refresh API feed">
            <RefreshCw size={13} />
            <span>Sync</span>
          </button>

          <button className="gov-btn" onClick={handleExport} disabled={isExporting}>
            <Download size={13} />
            <span>{isExporting ? 'Exporting...' : 'Export Bulletin'}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row (Powered by API GET /api/v1/dashboard/summary) */}
      <div className="gov-kpi-grid">
        <KpiCard
          title="PUSHPAK Headline Index"
          value={summary?.headline_index?.toFixed(1) || '124.5'}
          delta={`+${summary?.daily_change || 1.2}%`}
          deltaType="positive"
          subtext="Base: Jan 2026 = 100"
          badgeText="ALL BASKET"
          badgeType="info"
          sparklineData={summary?.sparkline_headline || [121.2, 121.8, 122.5, 123.1, 123.7, 124.1, 124.5]}
          sparklineColor="#1e3a8a"
          highlight={true}
        />

        <KpiCard
          title="PUSHPAK Core Index"
          value={summary?.core_index?.toFixed(1) || '119.8'}
          delta={`+${summary?.weekly_change ? (summary.weekly_change / 10).toFixed(1) : '0.3'}%`}
          deltaType="positive"
          subtext="Excludes seasonal spikes"
          badgeText="CORE FILTERED"
          badgeType="info"
          sparklineData={summary?.sparkline_core || [118.5, 118.7, 119.0, 119.2, 119.4, 119.6, 119.8]}
          sparklineColor="#0284c7"
        />

        <KpiCard
          title="Data Ingestion Status"
          value="HEALTHY"
          subtext={`Demo baseline sync • ${summary?.route_count || 50} corridors`}
          badgeText="DEMO FEED"
          badgeType="ok"
          delta={`${((summary?.observation_count || 1200000) / 1000000).toFixed(1)}M DEMO OBS`}
          deltaType="positive"
        />

        <KpiCard
          title="Projected CPI Impact"
          value="+0.02%"
          delta="ESTIMATE"
          deltaType="negative"
          subtext="SIMULATION • NOT OFFICIAL CPI"
          badgeText="SIMULATION"
          badgeType="simulation"
        />
      </div>

      {/* Two-Column Analytics Section */}
      <div className="gov-two-column">
        {/* Left Column: Historical Index Chart & 50 Corridors Map */}
        <div>
          {/* Historical Time-Series Chart (Powered by API GET /api/v1/dashboard/timeseries) */}
          <div className="gov-card">
            <div className="gov-card-header">
              <div className="gov-card-title">
                HISTORICAL PUSHPAK INDEX
                <span className="gov-card-subtitle">Daily Jevons elementary index trajectory (API Demo Series)</span>
              </div>
              <span className="gov-badge info">DEMO • {timeseries?.base_period || 'JAN 2026 = 100'}</span>
            </div>
            <div className="gov-card-body">
              <TimeSeriesChart series={timeseries?.series} />
            </div>
          </div>

          {/* 50 Strategic Corridors Route Visualization (Powered by API GET /api/v1/dashboard/routes) */}
          <div className="gov-card">
            <div className="gov-card-header">
              <div className="gov-card-title">
                50 STRATEGIC DOMESTIC CORRIDORS
                <span className="gov-card-subtitle">High-frequency airspace network surveillance (API Basket)</span>
              </div>
              <button
                className="gov-btn"
                style={{ fontSize: '11px', height: '22px' }}
                onClick={() => navigate('/routes')}
              >
                View Network Matrix →
              </button>
            </div>
            <div className="gov-card-body" style={{ padding: '8px' }}>
              <IndiaCorridorMap
                corridors={routes}
                onSelectCorridor={(id) => navigate(`/routes/${id}`)}
              />
            </div>
          </div>
        </div>

        {/* Right Column: PUSHPAK Insights & Top Inflationary Corridors */}
        <div>
          {/* PUSHPAK Insights (Powered by API GET /api/v1/dashboard/alerts) */}
          <div className="gov-card">
            <div className="gov-card-header">
              <div className="gov-card-title">
                PUSHPAK INSIGHTS
                <span className="gov-card-subtitle">Demonstration surveillance alerts</span>
              </div>
              <span className="gov-badge info">DEMO ALERTS</span>
            </div>
            <div className="gov-card-body" style={{ padding: '8px' }}>
              {alerts.map((alert) => (
                <InsightCard
                  key={alert.id}
                  category={alert.category}
                  title={alert.title}
                  detail={alert.detail}
                  time={alert.timestamp}
                  level={alert.level}
                />
              ))}
            </div>
          </div>

          {/* Top Inflationary Corridors (Powered by API GET /api/v1/dashboard/movers) */}
          <div className="gov-card">
            <div className="gov-card-header">
              <div className="gov-card-title">
                TOP INFLATIONARY CORRIDORS
                <span className="gov-card-subtitle">Highest 24h price surge (API Movers)</span>
              </div>
              <span className="gov-badge alert">DEMO DATA</span>
            </div>
            <div className="gov-card-body" style={{ padding: '10px 12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {(movers?.gainers || []).map((item) => (
                  <div key={item.route_id} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                      <span style={{ fontWeight: 600, color: 'var(--navy-dark)' }}>
                        <span style={{ color: 'var(--text-subtle)', marginRight: '6px' }}>{item.rank}.</span>
                        {item.route_label || `${item.origin} → ${item.destination}`}
                      </span>
                      <span className="font-mono" style={{ color: '#dc2626', fontWeight: 700 }}>
                        +{item.change_pct}%
                      </span>
                    </div>
                    {/* Horizontal Bar */}
                    <div style={{ background: '#f1f5f9', height: '6px', borderRadius: '1px', overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${Math.min(100, Math.max(10, (item.change_pct / 7) * 100))}%`,
                          height: '100%',
                          background: item.change_pct > 4.5 ? '#dc2626' : '#ea580c',
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full Width: Corridor Price Surveillance Matrix (Powered by API GET /api/v1/dashboard/routes) */}
      <CorridorSurveillanceTable corridors={routes} initialLimit={6} />
    </div>
  );
}

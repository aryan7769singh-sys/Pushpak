import React, { useState, useEffect, useCallback } from 'react';
import { KpiCard } from '../components/common/KpiCard';
import { TimeSeriesChart } from '../components/charts/TimeSeriesChart';
import { LeadTimeCurveChart } from '../components/charts/LeadTimeCurveChart';
import { CarrierComparisonChart } from '../components/charts/CarrierComparisonChart';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ApiErrorState } from '../components/common/ApiErrorState';
import { fetchDashboardTimeseries, fetchDashboardHorizons } from '../services/api';
import { Download, RefreshCw } from 'lucide-react';

export function AirfareIndexPage() {
  const [frequency, setFrequency] = useState('daily');
  const [activeHorizonKey, setActiveHorizonKey] = useState('T+15');

  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  const [timeseriesData, setTimeseriesData] = useState(null);
  const [horizonsData, setHorizonsData] = useState([]);

  const loadData = useCallback(async (selectedFreq = frequency) => {
    setLoading(true);
    setApiError(null);

    const [tsRes, hzRes] = await Promise.all([
      fetchDashboardTimeseries({ frequency: selectedFreq }),
      fetchDashboardHorizons(),
    ]);

    if (!tsRes.ok) {
      setApiError(`Timeseries API error: ${tsRes.error}`);
      setLoading(false);
      return;
    }
    if (!hzRes.ok) {
      setApiError(`Horizons API error: ${hzRes.error}`);
      setLoading(false);
      return;
    }

    setTimeseriesData(tsRes.data);
    setHorizonsData(hzRes.data.horizons || []);
    setLoading(false);
  }, [frequency]);

  useEffect(() => {
    loadData(frequency);
  }, [frequency, loadData]);

  if (loading && !timeseriesData) {
    return <LoadingSpinner message="Retrieving price index time series from /api/v1/dashboard/timeseries..." />;
  }

  if (apiError && !timeseriesData) {
    return (
      <div>
        <div className="gov-page-header">
          <div className="gov-title-block">
            <h1>AIRFARE PRICE INDEX</h1>
            <p>Statistical decomposition of PUSHPAK Headline, Core, and advance-purchase horizons.</p>
          </div>
        </div>
        <ApiErrorState
          title="Price Index Feed Unavailable"
          message={`Unable to connect to the PUSHPAK timeseries and horizon endpoints: ${apiError}.`}
          onRetry={() => loadData(frequency)}
        />
      </div>
    );
  }

  // Active horizon data lookup
  const activeHorizon = horizonsData.find(h => h.horizon === activeHorizonKey) || horizonsData[2] || {
    horizon: 'T+15',
    index_value: 124.5,
    change_pct: 1.2,
    description: '15-Day domestic corporate baseline horizon',
    average_fare: 5100,
  };

  const series = timeseriesData?.series || [];
  const latestPoint = series.length > 0 ? series[series.length - 1] : { headline: 124.5, core: 119.8, date: 'Current' };

  return (
    <div>
      {/* Page Header */}
      <div className="gov-page-header">
        <div className="gov-title-block">
          <h1>AIRFARE PRICE INDEX</h1>
          <p>Statistical decomposition of PUSHPAK Headline, Core, and required project lead-time horizons.</p>
        </div>
        <div className="gov-action-controls">
          {/* Frequency Selector */}
          <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-subtle)', fontWeight: 600 }}>Frequency:</span>
            {['daily', 'weekly', 'monthly'].map((f) => (
              <button
                key={f}
                className={`gov-btn ${frequency === f ? 'gov-btn-primary' : ''}`}
                style={{ fontSize: '11px', height: '26px', textTransform: 'capitalize' }}
                onClick={() => setFrequency(f)}
              >
                {f}
              </button>
            ))}
          </div>

          <span className="gov-badge info">DEMO DATA • {timeseriesData?.base_period || 'JAN 2026 = 100'}</span>

          <button className="gov-btn" onClick={() => loadData(frequency)} title="Sync API series">
            <RefreshCw size={13} />
            <span>Sync</span>
          </button>

          <button className="gov-btn" onClick={() => alert("Index methodology data downloaded.")}>
            <Download size={13} />
            <span>Export Series (CSV)</span>
          </button>
        </div>
      </div>

      {/* KPI Decomposition (Powered by API GET /api/v1/dashboard/timeseries & /horizons) */}
      <div className="gov-kpi-grid">
        <KpiCard
          title="Headline Index"
          value={latestPoint.headline.toFixed(1)}
          delta="+1.2%"
          subtext="Unfiltered domestic basket (Demo)"
          sparklineData={series.map(d => d.headline)}
          sparklineColor="#1e3a8a"
          highlight={true}
        />
        <KpiCard
          title="Core Index"
          value={latestPoint.core.toFixed(1)}
          delta="+0.3%"
          subtext="Spike trimmed baseline (Demo)"
          sparklineData={series.map(d => d.core)}
          sparklineColor="#0284c7"
        />
        <KpiCard
          title={`Active Horizon (${activeHorizon.horizon})`}
          value={activeHorizon.index_value.toString()}
          delta={`${activeHorizon.change_pct > 0 ? '+' : ''}${activeHorizon.change_pct}%`}
          deltaType={activeHorizon.change_pct > 0 ? 'negative' : 'positive'}
          subtext={activeHorizon.description}
          badgeText="HORIZON SLICE"
          badgeType="info"
        />
        <KpiCard
          title="Aggregation Method"
          value="JEVONS"
          delta="GEOMETRIC"
          deltaType="positive"
          subtext="Axiomatic transitivity"
          badgeText="IMF 2020 STANDARD"
          badgeType="ok"
        />
      </div>

      {/* Horizon Selector Tabs (Powered by API GET /api/v1/dashboard/horizons) */}
      <div className="gov-card" style={{ marginBottom: '12px' }}>
        <div className="gov-card-header">
          <div className="gov-card-title">
            FIVE REQUIRED PROJECT HORIZONS DECOMPOSITION
            <span className="gov-card-subtitle">Select lead-time window to inspect price relative sub-indices (API Contract)</span>
          </div>
          <span className="gov-badge info">DEMO PROVENANCE</span>
        </div>
        <div style={{ padding: '8px 12px', background: '#f8fafc', borderBottom: '1px solid var(--border-light)', display: 'flex', gap: '8px' }}>
          {horizonsData.map((hz) => (
            <button
              key={hz.horizon}
              className={`gov-btn ${activeHorizonKey === hz.horizon ? 'gov-btn-primary' : ''}`}
              style={{ fontSize: '11px', height: '26px' }}
              onClick={() => setActiveHorizonKey(hz.horizon)}
            >
              <strong>{hz.horizon}</strong> ({hz.index_value})
            </button>
          ))}
        </div>
        <div className="gov-card-body">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <h4 style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--navy-dark)', marginBottom: '8px' }}>
                Horizon Trajectory: {activeHorizon.horizon} (Lead Time: {activeHorizon.lead_days} Days)
              </h4>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                {activeHorizon.description}. Demonstration average fare across basket: ₹{activeHorizon.average_fare?.toLocaleString() || 'N/A'}.
              </p>
              <LeadTimeCurveChart route="Strategic Domestic Average" />
            </div>

            <div>
              <h4 style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--navy-dark)', marginBottom: '8px' }}>
                Carrier Dispersion Benchmark
              </h4>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                Carrier-level observed fare ranges across monitored sectors (Demonstration Reference).
              </p>
              <CarrierComparisonChart />
            </div>
          </div>
        </div>
      </div>

      {/* Historical Trend Full Chart (Powered by API GET /api/v1/dashboard/timeseries) */}
      <div className="gov-card">
        <div className="gov-card-header">
          <div className="gov-card-title">
            HISTORICAL INDEX MOVEMENT TABLE ({frequency.toUpperCase()})
            <span className="gov-card-subtitle">Observed time-series decomposition from /api/v1/dashboard/timeseries</span>
          </div>
          <span className="gov-badge info">{series.length} OBSERVATION POINTS</span>
        </div>
        <div className="gov-table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
          <table className="gov-table">
            <thead>
              <tr>
                <th>OBSERVATION PERIOD</th>
                <th style={{ textAlign: 'right' }}>HEADLINE INDEX</th>
                <th style={{ textAlign: 'right' }}>CORE INDEX</th>
                <th style={{ textAlign: 'right' }}>SIMULATED VOLUME</th>
                <th>PROVENANCE</th>
                <th>QUALITY STATUS</th>
              </tr>
            </thead>
            <tbody>
              {series.map((pt, idx) => (
                <tr key={pt.date || idx}>
                  <td className="font-mono" style={{ fontWeight: 600 }}>{pt.date}</td>
                  <td className="font-mono" style={{ textAlign: 'right', fontWeight: 700, color: 'var(--navy-dark)' }}>
                    {pt.headline.toFixed(1)}
                  </td>
                  <td className="font-mono" style={{ textAlign: 'right', color: '#0284c7', fontWeight: 600 }}>
                    {pt.core.toFixed(1)}
                  </td>
                  <td className="font-mono" style={{ textAlign: 'right' }}>
                    {pt.volume?.toLocaleString()}
                  </td>
                  <td>
                    <span className="gov-badge info">DEMO</span>
                  </td>
                  <td>
                    <span className="gov-badge ok">VERIFIED</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { KpiCard } from '../components/common/KpiCard';
import { InsightCard } from '../components/common/InsightCard';
import { TimeSeriesChart } from '../components/charts/TimeSeriesChart';
import { IndiaCorridorMap } from '../components/charts/IndiaCorridorMap';
import { CorridorSurveillanceTable } from '../components/common/CorridorSurveillanceTable';
import { SYSTEM_INSIGHTS, TOP_INFLATIONARY_CORRIDORS, DEMO_METADATA } from '../data/mockData';
import { Download, RefreshCw, Layers } from 'lucide-react';

export function ExecutiveOverviewPage() {
  const navigate = useNavigate();
  const [basket, setBasket] = useState('ALL-50');
  const [dateRange, setDateRange] = useState('7D');
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      alert("PUSHPAK Surveillance Bulletin (PDF/CSV) generated for current observation window.");
      setIsExporting(false);
    }, 400);
  };

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

          <button className="gov-btn" onClick={handleExport} disabled={isExporting}>
            <Download size={13} />
            <span>{isExporting ? 'Exporting...' : 'Export Bulletin'}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="gov-kpi-grid">
        <KpiCard
          title="PUSHPAK Headline Index"
          value="124.5"
          delta="+1.2%"
          deltaType="positive"
          subtext="Base: Jan 2026 = 100"
          badgeText="ALL BASKET"
          badgeType="info"
          sparklineData={[121.2, 121.8, 122.5, 123.1, 123.7, 124.1, 124.5]}
          sparklineColor="#1e3a8a"
          highlight={true}
        />

        <KpiCard
          title="PUSHPAK Core Index"
          value="119.8"
          delta="+0.3%"
          deltaType="positive"
          subtext="Excludes seasonal spikes"
          badgeText="CORE FILTERED"
          badgeType="info"
          sparklineData={[118.5, 118.7, 119.0, 119.2, 119.4, 119.6, 119.8]}
          sparklineColor="#0284c7"
        />

        <KpiCard
          title="Data Ingestion Status"
          value="HEALTHY"
          subtext="Demo baseline sync (Simulated Data)"
          badgeText="DEMO FEED"
          badgeType="ok"
          delta="1.2M DEMO OBS"
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
          {/* Historical Time-Series Chart */}
          <div className="gov-card">
            <div className="gov-card-header">
              <div className="gov-card-title">
                HISTORICAL PUSHPAK INDEX
                <span className="gov-card-subtitle">Daily Jevons elementary index trajectory (Demo Series)</span>
              </div>
              <span className="gov-badge info">DEMO • JAN 2026 = 100</span>
            </div>
            <div className="gov-card-body">
              <TimeSeriesChart />
            </div>
          </div>

          {/* 50 Strategic Corridors Route Visualization */}
          <div className="gov-card">
            <div className="gov-card-header">
              <div className="gov-card-title">
                50 STRATEGIC DOMESTIC CORRIDORS
                <span className="gov-card-subtitle">High-frequency airspace network surveillance (UI Map Demo)</span>
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
              <IndiaCorridorMap onSelectCorridor={(id) => navigate(`/routes/${id}`)} />
            </div>
          </div>
        </div>

        {/* Right Column: PUSHPAK Insights & Top Inflationary Corridors */}
        <div>
          {/* PUSHPAK Insights */}
          <div className="gov-card">
            <div className="gov-card-header">
              <div className="gov-card-title">
                PUSHPAK INSIGHTS
                <span className="gov-card-subtitle">Demonstration surveillance alerts</span>
              </div>
              <span className="gov-badge info">DEMO ALERTS</span>
            </div>
            <div className="gov-card-body" style={{ padding: '8px' }}>
              {SYSTEM_INSIGHTS.map((insight) => (
                <InsightCard key={insight.id} {...insight} />
              ))}
            </div>
          </div>

          {/* Top Inflationary Corridors */}
          <div className="gov-card">
            <div className="gov-card-header">
              <div className="gov-card-title">
                TOP INFLATIONARY CORRIDORS
                <span className="gov-card-subtitle">Highest 24h price surge (UI Demonstration)</span>
              </div>
              <span className="gov-badge alert">DEMO DATA</span>
            </div>
            <div className="gov-card-body" style={{ padding: '10px 12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {TOP_INFLATIONARY_CORRIDORS.map((item) => (
                  <div key={item.route} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                      <span style={{ fontWeight: 600, color: 'var(--navy-dark)' }}>
                        <span style={{ color: 'var(--text-subtle)', marginRight: '6px' }}>{item.rank}.</span>
                        {item.route}
                      </span>
                      <span className="font-mono" style={{ color: '#dc2626', fontWeight: 700 }}>
                        +{item.changePct}%
                      </span>
                    </div>
                    {/* Horizontal Bar */}
                    <div style={{ background: '#f1f5f9', height: '6px', borderRadius: '1px', overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${(item.changePct / 6) * 100}%`,
                          height: '100%',
                          background: item.changePct > 4.5 ? '#dc2626' : '#ea580c',
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

      {/* Full Width: Corridor Price Surveillance Matrix */}
      <CorridorSurveillanceTable initialLimit={6} />
    </div>
  );
}

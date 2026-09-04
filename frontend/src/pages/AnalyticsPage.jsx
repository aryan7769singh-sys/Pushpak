import React, { useState } from 'react';
import { CORRIDORS, SYSTEM_INSIGHTS } from '../data/mockData';
import { LeadTimeCurveChart } from '../components/charts/LeadTimeCurveChart';
import { QualityBadge } from '../components/common/QualityBadge';
import { KpiCard } from '../components/common/KpiCard';
import { Activity, AlertTriangle, TrendingUp, BarChart2, ShieldAlert } from 'lucide-react';

export function AnalyticsPage() {
  const [selectedSector, setSelectedSector] = useState('DEL-BOM');

  const activeCorridor = CORRIDORS.find(c => c.id === selectedSector) || CORRIDORS[0];

  const leadTimePoints = [
    { horizon: 'T+1', fare: activeCorridor.t1Fare, label: '24h Spot' },
    { horizon: 'T+7', fare: activeCorridor.t7Fare, label: '7 Days' },
    { horizon: 'T+15', fare: activeCorridor.t15Fare, label: '15 Days' },
    { horizon: 'T+30', fare: activeCorridor.t30Fare, label: '30 Days' },
    { horizon: 'T+45', fare: activeCorridor.t45Fare, label: '45 Days' },
  ];

  const volatilityRanking = [...CORRIDORS].sort((a, b) => {
    const vA = parseFloat(a.volatility.match(/\((.*?)%\)/)?.[1] || 0);
    const vB = parseFloat(b.volatility.match(/\((.*?)%\)/)?.[1] || 0);
    return vB - vA;
  }).slice(0, 8);

  return (
    <div>
      {/* Header */}
      <div className="gov-page-header">
        <div className="gov-title-block">
          <h1>ADVANCED AIRFARE ANALYTICS</h1>
          <p>Lead-time horizon curves, volatility ranking, and demonstration surveillance alerts (UI Demonstration).</p>
        </div>
        <div className="gov-action-controls">
          <span className="gov-badge info">UI DEMONSTRATION</span>
          <select
            className="gov-select"
            value={selectedSector}
            onChange={(e) => setSelectedSector(e.target.value)}
          >
            {CORRIDORS.map(c => <option key={c.id} value={c.id}>{c.id} ({c.sector})</option>)}
          </select>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="gov-kpi-grid">
        <KpiCard
          title="Active Dynamic Surge Premium"
          value="+166%"
          delta="T+1 vs T+45"
          deltaType="negative"
          subtext={`Current sector: ${selectedSector} (Demo)`}
          badgeText="SPOT SURGE"
          badgeType="alert"
          highlight={true}
        />
        <KpiCard
          title="System Volatility Median"
          value="11.6%"
          subtext="Median standard deviation across 50 corridors (Demo)"
          badgeText="NETWORK SPREAD"
          badgeType="info"
        />
        <KpiCard
          title="Price Wave Amplitude"
          value="₹4,600"
          subtext="Average intra-week cyclical swing (Demo)"
          badgeText="CYCLICAL"
          badgeType="info"
        />
        <KpiCard
          title="Demonstration Anomaly Flags"
          value="2"
          delta="DEMO ALERTS"
          deltaType="negative"
          subtext="DEL-PAT & DEL-GAU active demo alerts"
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
              <span className="gov-card-subtitle">Price decay across T+1 to T+45 (Simulated Sector Data)</span>
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

      {/* Section 3 & 4: Route Volatility Ranking & Statistical Anomaly Alerts */}
      <div className="gov-two-column">
        <div className="gov-card">
          <div className="gov-card-header">
            <div className="gov-card-title">
              3. ROUTE VOLATILITY RANKING (DEMO METRICS)
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
                  <tr key={c.id}>
                    <td className="font-mono" style={{ fontWeight: 700, color: 'var(--text-subtle)' }}>{i + 1}</td>
                    <td className="font-mono" style={{ fontWeight: 700, color: 'var(--navy-dark)' }}>{c.id}</td>
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
              4. DEMONSTRATION ANOMALY & SPIKE ALERTS
              <span className="gov-card-subtitle">UI demonstration of future anomaly alerts</span>
            </div>
            <span className="gov-badge alert">DEMO ALERTS</span>
          </div>
          <div className="gov-card-body" style={{ padding: '8px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ padding: '8px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '2px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#991b1b', fontSize: '11.5px' }}>
                  <span>ANOMALY DETECTED: DEL → PAT</span>
                  <span className="font-mono">T+1 SPOT</span>
                </div>
                <div style={{ fontSize: '11px', color: '#7f1d1d', marginTop: '2px' }}>
                  Spot fares trading at ₹11,800 (+5.8% daily jump). 94% scheduled capacity sold out. Demonstration surveillance trigger active.
                </div>
              </div>

              <div style={{ padding: '8px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '2px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#92400e', fontSize: '11.5px' }}>
                  <span>ELEVATED VOLATILITY: DEL → GAU</span>
                  <span className="font-mono">T+7 HORIZON</span>
                </div>
                <div style={{ fontSize: '11px', color: '#78350f', marginTop: '2px' }}>
                  T+7 fares at ₹7,800 vs historical baseline ₹5,900. Price dispersion across operating carriers exceeds ₹2,400.
                </div>
              </div>

              <div style={{ padding: '8px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '2px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#166534', fontSize: '11.5px' }}>
                  <span>STABILITY COMPLIANT: BOM → BLR</span>
                  <span className="font-mono">NETWORK NORMAL</span>
                </div>
                <div style={{ fontSize: '11px', color: '#14532d', marginTop: '2px' }}>
                  Price relatives within ±0.4% band. Cross-carrier price alignment stable at ₹4,420 average.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

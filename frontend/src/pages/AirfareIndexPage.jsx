import React, { useState } from 'react';
import { KpiCard } from '../components/common/KpiCard';
import { TimeSeriesChart } from '../components/charts/TimeSeriesChart';
import { LeadTimeCurveChart } from '../components/charts/LeadTimeCurveChart';
import { CarrierComparisonChart } from '../components/charts/CarrierComparisonChart';
import { CORRIDORS, AIRLINES } from '../data/mockData';
import { Download, Info, Calendar } from 'lucide-react';

export function AirfareIndexPage() {
  const [activeHorizon, setActiveHorizon] = useState('T+15');

  const HORIZON_DATA = {
    'T+1': { index: 142.8, change: '+5.8%', desc: '24–48h Last-minute emergency & spot volatility', color: '#dc2626' },
    'T+7': { index: 128.4, change: '+2.1%', desc: '7-Day advance urgent & short-term business', color: '#d97706' },
    'T+15': { index: 124.5, change: '+1.2%', desc: '15-Day domestic corporate baseline horizon', color: '#2563eb' },
    'T+30': { index: 114.2, change: '+0.4%', desc: '30-Day leisure planning baseline', color: '#4f46e5' },
    'T+45': { index: 108.6, change: '-0.2%', desc: '45-Day extended advance lowest fare floor', color: '#16a34a' },
  };

  const curr = HORIZON_DATA[activeHorizon];

  return (
    <div>
      {/* Page Header */}
      <div className="gov-page-header">
        <div className="gov-title-block">
          <h1>AIRFARE PRICE INDEX</h1>
          <p>Statistical decomposition of PUSHPAK Headline, Core, and advance-purchase horizons.</p>
        </div>
        <div className="gov-action-controls">
          <span className="gov-badge info">DEMO DATA • JAN 2026 = 100</span>
          <button className="gov-btn" onClick={() => alert("Index methodology data downloaded.")}>
            <Download size={13} />
            <span>Export Series (CSV)</span>
          </button>
        </div>
      </div>

      {/* KPI Decomposition */}
      <div className="gov-kpi-grid">
        <KpiCard
          title="Headline Index"
          value="124.5"
          delta="+1.2%"
          subtext="Unfiltered domestic basket"
          sparklineData={[120.1, 121.4, 122.0, 123.2, 124.5]}
          sparklineColor="#1e3a8a"
          highlight={true}
        />
        <KpiCard
          title="Core Index"
          value="119.8"
          delta="+0.3%"
          subtext="Outlier & spike trimmed"
          sparklineData={[118.2, 118.5, 118.9, 119.3, 119.8]}
          sparklineColor="#0284c7"
        />
        <KpiCard
          title={`Active Horizon (${activeHorizon})`}
          value={curr.index.toString()}
          delta={curr.change}
          deltaType={curr.change.startsWith('+') ? 'negative' : 'positive'}
          subtext={curr.desc}
          badgeText="HORIZON SLICE"
          badgeType="info"
        />
        <KpiCard
          title="Aggregation Formula"
          value="JEVONS"
          delta="GEOMETRIC"
          deltaType="positive"
          subtext="Axiomatic transitivity"
          badgeText="IMF 2020 STANDARD"
          badgeType="ok"
        />
      </div>

      {/* Horizon Selector Tabs */}
      <div className="gov-card" style={{ marginBottom: '12px' }}>
        <div className="gov-card-header">
          <div className="gov-card-title">
            FIVE ADVANCE-PURCHASE HORIZON DECOMPOSITION
            <span className="gov-card-subtitle">Select lead-time window to inspect price relative sub-indices</span>
          </div>
        </div>
        <div style={{ padding: '8px 12px', background: '#f8fafc', borderBottom: '1px solid var(--border-light)', display: 'flex', gap: '8px' }}>
          {['T+1', 'T+7', 'T+15', 'T+30', 'T+45'].map((hz) => (
            <button
              key={hz}
              className={`gov-btn ${activeHorizon === hz ? 'gov-btn-primary' : ''}`}
              style={{ fontSize: '11px', height: '26px' }}
              onClick={() => setActiveHorizon(hz)}
            >
              <strong>{hz}</strong> ({HORIZON_DATA[hz].index})
            </button>
          ))}
        </div>
        <div className="gov-card-body">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <h4 style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--navy-dark)', marginBottom: '8px' }}>
                Horizon Trajectory: {activeHorizon}
              </h4>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                {HORIZON_DATA[activeHorizon].desc}. Price relatives for this horizon represent high-frequency observations captured exactly {activeHorizon.replace('T+', '')} days prior to scheduled flight departure.
              </p>
              <LeadTimeCurveChart route="Strategic Domestic Average" />
            </div>

            <div>
              <h4 style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--navy-dark)', marginBottom: '8px' }}>
                Carrier Dispersion: {activeHorizon}
              </h4>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                Carrier-level average observed fares across all monitored corridors for the {activeHorizon} horizon.
              </p>
              <CarrierComparisonChart />
            </div>
          </div>
        </div>
      </div>

      {/* Historical Trend Full Chart */}
      <div className="gov-card">
        <div className="gov-card-header">
          <div className="gov-card-title">
            HISTORICAL INDEX MOVEMENT TABLE
            <span className="gov-card-subtitle">Observed time-series decomposition (Simulated Demo Data)</span>
          </div>
        </div>
        <div className="gov-table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
          <table className="gov-table">
            <thead>
              <tr>
                <th>OBSERVATION PERIOD</th>
                <th style={{ textAlign: 'right' }}>HEADLINE INDEX</th>
                <th style={{ textAlign: 'right' }}>CORE INDEX</th>
                <th style={{ textAlign: 'right' }}>T+1 SUB-INDEX</th>
                <th style={{ textAlign: 'right' }}>T+15 SUB-INDEX</th>
                <th style={{ textAlign: 'right' }}>T+45 SUB-INDEX</th>
                <th style={{ textAlign: 'right' }}>DAILY MOVEMENT</th>
                <th>QUALITY VERIFICATION</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-mono" style={{ fontWeight: 600 }}>04 Sep 2026</td>
                <td className="font-mono" style={{ textAlign: 'right', fontWeight: 700, color: 'var(--navy-dark)' }}>124.5</td>
                <td className="font-mono" style={{ textAlign: 'right' }}>119.8</td>
                <td className="font-mono" style={{ textAlign: 'right', color: '#dc2626' }}>142.8</td>
                <td className="font-mono" style={{ textAlign: 'right' }}>124.5</td>
                <td className="font-mono" style={{ textAlign: 'right', color: '#16a34a' }}>108.6</td>
                <td className="font-mono" style={{ textAlign: 'right', color: '#dc2626' }}>+1.2%</td>
                <td><span className="gov-badge ok">VERIFIED</span></td>
              </tr>
              <tr>
                <td className="font-mono" style={{ fontWeight: 600 }}>01 Sep 2026</td>
                <td className="font-mono" style={{ textAlign: 'right', fontWeight: 700 }}>124.1</td>
                <td className="font-mono" style={{ textAlign: 'right' }}>119.6</td>
                <td className="font-mono" style={{ textAlign: 'right', color: '#dc2626' }}>141.9</td>
                <td className="font-mono" style={{ textAlign: 'right' }}>124.1</td>
                <td className="font-mono" style={{ textAlign: 'right', color: '#16a34a' }}>108.7</td>
                <td className="font-mono" style={{ textAlign: 'right', color: '#dc2626' }}>+0.4%</td>
                <td><span className="gov-badge ok">VERIFIED</span></td>
              </tr>
              <tr>
                <td className="font-mono" style={{ fontWeight: 600 }}>29 Aug 2026</td>
                <td className="font-mono" style={{ textAlign: 'right', fontWeight: 700 }}>123.7</td>
                <td className="font-mono" style={{ textAlign: 'right' }}>119.5</td>
                <td className="font-mono" style={{ textAlign: 'right', color: '#dc2626' }}>140.2</td>
                <td className="font-mono" style={{ textAlign: 'right' }}>123.7</td>
                <td className="font-mono" style={{ textAlign: 'right', color: '#16a34a' }}>108.9</td>
                <td className="font-mono" style={{ textAlign: 'right', color: '#16a34a' }}>-0.2%</td>
                <td><span className="gov-badge ok">VERIFIED</span></td>
              </tr>
              <tr>
                <td className="font-mono" style={{ fontWeight: 600 }}>25 Aug 2026</td>
                <td className="font-mono" style={{ textAlign: 'right', fontWeight: 700 }}>122.9</td>
                <td className="font-mono" style={{ textAlign: 'right' }}>119.3</td>
                <td className="font-mono" style={{ textAlign: 'right', color: '#dc2626' }}>139.1</td>
                <td className="font-mono" style={{ textAlign: 'right' }}>122.9</td>
                <td className="font-mono" style={{ textAlign: 'right', color: '#16a34a' }}>109.1</td>
                <td className="font-mono" style={{ textAlign: 'right', color: '#dc2626' }}>+0.8%</td>
                <td><span className="gov-badge ok">VERIFIED</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

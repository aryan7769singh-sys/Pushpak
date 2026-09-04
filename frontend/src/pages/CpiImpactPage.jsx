import React, { useState } from 'react';
import { KpiCard } from '../components/common/KpiCard';
import { AlertTriangle, FileSpreadsheet, FileText, Sliders } from 'lucide-react';

export function CpiImpactPage() {
  const [hypotheticalShock, setHypotheticalShock] = useState(5.0); // % shock
  const [demoCpiWeight, setDemoCpiWeight] = useState(0.23); // Demo configuration weight (%)

  // Simulated estimated CPI impact (in percentage points)
  const estimatedImpact = ((hypotheticalShock * (demoCpiWeight / 100))).toFixed(4);

  return (
    <div>
      {/* Page Header */}
      <div className="gov-page-header">
        <div className="gov-title-block">
          <h1>CPI IMPACT SIMULATION</h1>
          <p>Analytical simulation of domestic airfare movements on a simulated Consumer Price Index transport basket.</p>
        </div>
        <div className="gov-action-controls">
          <button className="gov-btn" onClick={() => alert("Simulation report CSV generated.")}>
            <FileSpreadsheet size={13} />
            <span>Audit Report (CSV)</span>
          </button>
          <button className="gov-btn" onClick={() => alert("Simulation PDF briefing generated.")}>
            <FileText size={13} />
            <span>Briefing Note (PDF)</span>
          </button>
        </div>
      </div>

      {/* Mandatory Analytical Notice */}
      <div style={{
        padding: '8px 12px',
        background: '#fffbeb',
        border: '1px solid #fde68a',
        borderRadius: '2px',
        fontSize: '11.5px',
        color: '#92400e',
        marginBottom: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}>
        <AlertTriangle size={15} style={{ flexShrink: 0 }} />
        <span>
          <strong>SIMULATION / ANALYTICAL ESTIMATE ONLY:</strong> This module provides mathematical demonstration estimates of domestic airfare price shock contributions. <strong>THIS IS NOT AN OFFICIAL CPI RELEASE, FORECAST, OR OFFICIAL PROJECTION.</strong> All parameters (including the demonstration basket weight) are configurable demo values and do not represent official MoSPI figures. Official CPI statistics are published solely by the Ministry of Statistics and Programme Implementation (MoSPI).
        </span>
      </div>

      {/* Analytical KPI Cards */}
      <div className="gov-kpi-grid">
        <KpiCard
          title="Demo Airfare Basket Weight"
          value={`${demoCpiWeight}%`}
          subtext="Configurable demo weight (Not an official MoSPI weight)"
          badgeText="DEMO CONFIGURATION"
          badgeType="warn"
        />
        <KpiCard
          title="PUSHPAK Headline Movement"
          value="+1.2%"
          delta="CURRENT"
          deltaType="positive"
          subtext="Current period aggregate index change (Demo)"
          badgeText="REAL-TIME DEMO"
          badgeType="info"
          highlight={true}
        />
        <KpiCard
          title="Estimated CPI Contribution"
          value={`+${estimatedImpact}%`}
          delta="ANALYTICAL"
          deltaType="positive"
          subtext="Simulated contribution to overall CPI"
          badgeText="SIMULATION"
          badgeType="simulation"
        />
        <KpiCard
          title="Methodological Baseline"
          value="JEVONS-CPI"
          subtext="Harmonized with UN CPI Manual 2020"
          badgeText="METHODOLOGY"
          badgeType="ok"
        />
      </div>

      {/* Scenario Controls & Simulation Model */}
      <div className="gov-two-column">
        {/* Scenario Controls */}
        <div className="gov-card">
          <div className="gov-card-header">
            <div className="gov-card-title">
              SCENARIO IMPACT CONTROLS (DEMO CONFIGURATION)
              <span className="gov-card-subtitle">Adjust simulated shock and demonstration weight</span>
            </div>
            <Sliders size={14} color="#1e3a8a" />
          </div>
          <div className="gov-card-body">
            {/* Shock Slider */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '12px' }}>
                <span style={{ fontWeight: 600, color: 'var(--navy-dark)' }}>Hypothetical Airfare Price Shock:</span>
                <span className="font-mono" style={{ fontWeight: 700, color: hypotheticalShock > 0 ? '#dc2626' : '#16a34a' }}>
                  {hypotheticalShock > 0 ? '+' : ''}{hypotheticalShock}%
                </span>
              </div>
              <input
                type="range"
                min="-20"
                max="30"
                step="0.5"
                value={hypotheticalShock}
                onChange={(e) => setHypotheticalShock(parseFloat(e.target.value))}
                style={{ width: '100%', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-subtle)', marginTop: '2px' }}>
                <span>-20% Deflation</span>
                <span>0% Baseline</span>
                <span>+30% Severe Surge</span>
              </div>
            </div>

            {/* Configurable Weight Input */}
            <div style={{ marginBottom: '16px', padding: '10px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '2px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--navy-dark)' }}>
                  Demo Basket Weight (%):
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <input
                    type="number"
                    min="0.01"
                    max="5.0"
                    step="0.01"
                    value={demoCpiWeight}
                    onChange={(e) => setDemoCpiWeight(parseFloat(e.target.value) || 0.01)}
                    className="gov-input"
                    style={{ width: '70px', height: '26px', textAlign: 'right', fontFamily: 'var(--font-mono)' }}
                  />
                  <span style={{ fontSize: '11px', color: 'var(--text-subtle)' }}>%</span>
                </div>
              </div>
              <p style={{ fontSize: '10.5px', color: 'var(--text-subtle)', margin: 0 }}>
                This is a configurable demonstration value for testing sensitivity. It is not an official MoSPI weight.
              </p>
            </div>

            <div style={{ padding: '12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '2px' }}>
              <h4 style={{ fontSize: '12px', color: 'var(--navy-dark)', marginBottom: '8px' }}>
                Simulation Results Summary
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Assumed Basket Shock:</span>
                  <span className="font-mono" style={{ fontWeight: 600 }}>{hypotheticalShock}%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Configured Demo Basket Weight:</span>
                  <span className="font-mono" style={{ fontWeight: 600 }}>{demoCpiWeight}%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #cbd5e1', paddingTop: '6px', marginTop: '2px' }}>
                  <span style={{ fontWeight: 700, color: 'var(--navy-dark)' }}>Simulated Overall CPI Impact:</span>
                  <span className="font-mono" style={{ fontWeight: 700, color: hypotheticalShock > 0 ? '#dc2626' : '#16a34a' }}>
                    {hypotheticalShock > 0 ? '+' : ''}{estimatedImpact} percentage points
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Historical CPI Comparison Table */}
        <div className="gov-card">
          <div className="gov-card-header">
            <div className="gov-card-title">
              HISTORICAL BASKET COMPARISON (DEMO DATA)
              <span className="gov-card-subtitle">Monthly simulated airfare vs reported CPI</span>
            </div>
            <span className="gov-badge info">DEMO DATA</span>
          </div>
          <div className="gov-table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
            <table className="gov-table">
              <thead>
                <tr>
                  <th>MONTH</th>
                  <th style={{ textAlign: 'right' }}>AIRFARE INDEX</th>
                  <th style={{ textAlign: 'right' }}>MOM CHANGE</th>
                  <th style={{ textAlign: 'right' }}>SIMULATED IMPACT</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { month: 'August 2026', index: '124.5', change: '+1.2%', impact: '+0.0028 pp' },
                  { month: 'July 2026', index: '123.0', change: '+2.8%', impact: '+0.0064 pp' },
                  { month: 'June 2026', index: '119.6', change: '-1.4%', impact: '-0.0032 pp' },
                  { month: 'May 2026', index: '121.3', change: '+4.1%', impact: '+0.0094 pp' },
                  { month: 'April 2026', index: '116.5', change: '+0.5%', impact: '+0.0011 pp' },
                ].map((row) => (
                  <tr key={row.month}>
                    <td className="font-mono" style={{ fontWeight: 600 }}>{row.month}</td>
                    <td className="font-mono" style={{ textAlign: 'right' }}>{row.index}</td>
                    <td className="font-mono" style={{ textAlign: 'right', color: row.change.startsWith('+') ? '#dc2626' : '#16a34a' }}>
                      {row.change}
                    </td>
                    <td className="font-mono" style={{ textAlign: 'right', fontWeight: 600 }}>{row.impact}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

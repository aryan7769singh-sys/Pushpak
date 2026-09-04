import React, { useState } from 'react';
import { AIRLINES, CORRIDORS } from '../data/mockData';
import { CarrierComparisonChart } from '../components/charts/CarrierComparisonChart';
import { KpiCard } from '../components/common/KpiCard';
import { Plane, Download, BarChart2 } from 'lucide-react';

export function AirlinesPage() {
  const [selectedAirline, setSelectedAirline] = useState('6E');

  const matrixCorridors = CORRIDORS.slice(0, 8);

  return (
    <div>
      {/* Header */}
      <div className="gov-page-header">
        <div className="gov-title-block">
          <h1>AIRLINE MARKET VIEW</h1>
          <p>Carrier pricing dispersion, market share metrics, and cross-operator domestic fare benchmarks.</p>
        </div>
        <div className="gov-action-controls">
          <span className="gov-badge info">5 SCHEDULED OPERATORS</span>
          <button className="gov-btn" onClick={() => alert("Carrier price matrix exported.")}>
            <Download size={13} />
            <span>Export Carrier Matrix (CSV)</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="gov-kpi-grid">
        <KpiCard
          title="Market Leader (IndiGo)"
          value="62.4%"
          subtext="Demo Reference Share • 1,950 daily flights"
          badgeText="DEMO REFERENCE"
          badgeType="info"
          highlight={true}
        />
        <KpiCard
          title="Full Service Carrier (Air India)"
          value="₹6,180"
          delta="+14.0%"
          deltaType="negative"
          subtext="Demo baseline premium benchmark"
          badgeText="FULL SERVICE"
          badgeType="warn"
        />
        <KpiCard
          title="Lowest Fare Floor (SpiceJet)"
          value="₹4,890"
          delta="-9.8%"
          deltaType="positive"
          subtext="Lowest aggregate basket fare (Demo)"
          badgeText="BUDGET"
          badgeType="ok"
        />
        <KpiCard
          title="Cross-Carrier Price Spread"
          value="₹1,290"
          subtext="Spread between highest & lowest (Demo)"
          badgeText="DISPERSION"
          badgeType="info"
        />
      </div>

      {/* Carrier Benchmark & Price Movement */}
      <div className="gov-two-column">
        <div className="gov-card">
          <div className="gov-card-header">
            <div className="gov-card-title">
              CARRIER PRICE MOVEMENT
              <span className="gov-card-subtitle">Aggregate domestic network average fares (Demo Reference)</span>
            </div>
            <span className="gov-badge info">SIMULATED BASKET</span>
          </div>
          <div className="gov-card-body">
            <CarrierComparisonChart />
          </div>
        </div>

        <div className="gov-card">
          <div className="gov-card-header">
            <div className="gov-card-title">
              CARRIER MARKET CONCENTRATION
              <span className="gov-card-subtitle">Capacity deployment by scheduled operator (Demo Reference Data)</span>
            </div>
            <span className="gov-badge info">DEMO REFERENCE</span>
          </div>
          <div className="gov-table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
            <table className="gov-table">
              <thead>
                <tr>
                  <th>AIRLINE</th>
                  <th>CODE</th>
                  <th style={{ textAlign: 'right' }}>MARKET SHARE (DEMO REF)</th>
                  <th style={{ textAlign: 'right' }}>DAILY FLIGHTS</th>
                </tr>
              </thead>
              <tbody>
                {AIRLINES.map((a) => (
                  <tr key={a.code}>
                    <td style={{ fontWeight: 600 }}>{a.name}</td>
                    <td className="font-mono">{a.code}</td>
                    <td className="font-mono" style={{ textAlign: 'right', fontWeight: 700 }}>{a.marketShare}%</td>
                    <td className="font-mono" style={{ textAlign: 'right' }}>{a.dailyFlights}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* AIRLINE × ROUTE PRICE MATRIX */}
      <div className="gov-card">
        <div className="gov-card-header">
          <div className="gov-card-title">
            AIRLINE × ROUTE PRICE MATRIX
            <span className="gov-card-subtitle">Comparative average fares across key strategic sectors (INR Demo Data)</span>
          </div>
          <span className="gov-badge info">DEMO MATRIX</span>
        </div>
        <div className="gov-table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
          <table className="gov-table">
            <thead>
              <tr>
                <th>CORRIDOR</th>
                <th>SECTOR</th>
                <th style={{ textAlign: 'right', color: '#0284c7' }}>INDIGO (6E)</th>
                <th style={{ textAlign: 'right', color: '#dc2626' }}>AIR INDIA (AI)</th>
                <th style={{ textAlign: 'right', color: '#ea580c' }}>SPICEJET (SG)</th>
                <th style={{ textAlign: 'right', color: '#7c3aed' }}>AKASA (QP)</th>
                <th style={{ textAlign: 'right' }}>SECTOR SPREAD</th>
              </tr>
            </thead>
            <tbody>
              {matrixCorridors.map((c) => {
                const fare6E = Math.round(c.avgFare * 0.98);
                const fareAI = Math.round(c.avgFare * 1.12);
                const fareSG = Math.round(c.avgFare * 0.92);
                const fareQP = Math.round(c.avgFare * 0.95);
                const spread = fareAI - fareSG;

                return (
                  <tr key={c.id}>
                    <td className="font-mono" style={{ fontWeight: 700, color: 'var(--navy-dark)' }}>{c.id}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{c.sector}</td>
                    <td className="font-mono" style={{ textAlign: 'right' }}>₹{fare6E.toLocaleString()}</td>
                    <td className="font-mono" style={{ textAlign: 'right', fontWeight: 600 }}>₹{fareAI.toLocaleString()}</td>
                    <td className="font-mono" style={{ textAlign: 'right' }}>₹{fareSG.toLocaleString()}</td>
                    <td className="font-mono" style={{ textAlign: 'right' }}>₹{fareQP.toLocaleString()}</td>
                    <td className="font-mono" style={{ textAlign: 'right', color: '#dc2626', fontWeight: 600 }}>
                      +₹{spread.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

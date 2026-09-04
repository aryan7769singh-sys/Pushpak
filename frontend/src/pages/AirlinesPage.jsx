import React, { useState, useEffect, useCallback } from 'react';
import { CarrierComparisonChart } from '../components/charts/CarrierComparisonChart';
import { KpiCard } from '../components/common/KpiCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ApiErrorState } from '../components/common/ApiErrorState';
import { fetchDashboardCarriers, fetchDashboardRoutes } from '../services/api';
import { Download, RefreshCw } from 'lucide-react';

export function AirlinesPage() {
  const [selectedAirline, setSelectedAirline] = useState('6E');
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  const [carriers, setCarriers] = useState([]);
  const [routes, setRoutes] = useState([]);

  const loadData = useCallback(async () => {
    setLoading(true);
    setApiError(null);

    const [carriersRes, routesRes] = await Promise.all([
      fetchDashboardCarriers(),
      fetchDashboardRoutes(),
    ]);

    if (!carriersRes.ok) {
      setApiError(`Carriers API error: ${carriersRes.error}`);
      setLoading(false);
      return;
    }
    if (!routesRes.ok) {
      setApiError(`Routes API error: ${routesRes.error}`);
      setLoading(false);
      return;
    }

    setCarriers(carriersRes.data.carriers || []);
    setRoutes(routesRes.data.routes || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading && carriers.length === 0) {
    return <LoadingSpinner message="Retrieving carrier benchmark metrics from /api/v1/dashboard/carriers..." />;
  }

  if (apiError && carriers.length === 0) {
    return (
      <div>
        <div className="gov-page-header">
          <div className="gov-title-block">
            <h1>AIRLINE MARKET VIEW</h1>
            <p>Carrier pricing dispersion, market share metrics, and cross-operator domestic fare benchmarks.</p>
          </div>
        </div>
        <ApiErrorState
          title="Carrier Intelligence Feed Offline"
          message={`Communication failure while querying carrier benchmarks: ${apiError}.`}
          onRetry={loadData}
        />
      </div>
    );
  }

  const indigo = carriers.find(c => c.code === '6E') || { market_share: 62.4, daily_flights: 1950, avg_fare: 5420 };
  const airIndia = carriers.find(c => c.code === 'AI') || { market_share: 14.8, avg_fare: 6180 };
  const spiceJet = carriers.find(c => c.code === 'SG') || { market_share: 4.2, avg_fare: 4890 };
  const priceSpread = Math.abs(airIndia.avg_fare - spiceJet.avg_fare);

  const matrixCorridors = routes.slice(0, 8);

  return (
    <div>
      {/* Header */}
      <div className="gov-page-header">
        <div className="gov-title-block">
          <h1>AIRLINE MARKET VIEW</h1>
          <p>Carrier pricing dispersion, market share metrics, and cross-operator domestic fare benchmarks (Demonstration Set).</p>
        </div>
        <div className="gov-action-controls">
          <span className="gov-badge info">{carriers.length} MONITORED CARRIERS (DEMO REF)</span>
          <button className="gov-btn" onClick={loadData} title="Sync with API">
            <RefreshCw size={13} />
            <span>Sync</span>
          </button>
          <button className="gov-btn" onClick={() => alert("Carrier price matrix exported.")}>
            <Download size={13} />
            <span>Export Carrier Matrix (CSV)</span>
          </button>
        </div>
      </div>

      {/* KPI Cards (Powered by API GET /api/v1/dashboard/carriers) */}
      <div className="gov-kpi-grid">
        <KpiCard
          title="Market Leader (IndiGo)"
          value={`${indigo.market_share}%`}
          subtext={`Demo Reference Share • ${indigo.daily_flights} daily flights`}
          badgeText="DEMO REFERENCE"
          badgeType="info"
          highlight={true}
        />
        <KpiCard
          title="Full Service Benchmark (Air India)"
          value={`₹${airIndia.avg_fare.toLocaleString()}`}
          delta="+14.0%"
          deltaType="negative"
          subtext="Demo baseline premium benchmark"
          badgeText="FULL SERVICE"
          badgeType="warn"
        />
        <KpiCard
          title="Lowest Fare Floor (SpiceJet)"
          value={`₹${spiceJet.avg_fare.toLocaleString()}`}
          delta="-9.8%"
          deltaType="positive"
          subtext="Lowest aggregate basket fare (Demo)"
          badgeText="BUDGET"
          badgeType="ok"
        />
        <KpiCard
          title="Cross-Carrier Price Spread"
          value={`₹${priceSpread.toLocaleString()}`}
          subtext="Spread between highest & lowest carrier (Demo)"
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
                  <th style={{ textAlign: 'right' }}>MARKET SHARE</th>
                  <th style={{ textAlign: 'right' }}>DAILY FLIGHTS</th>
                  <th>PROVENANCE</th>
                </tr>
              </thead>
              <tbody>
                {carriers.map((a) => (
                  <tr key={a.code}>
                    <td style={{ fontWeight: 600 }}>{a.name}</td>
                    <td className="font-mono">{a.code}</td>
                    <td className="font-mono" style={{ textAlign: 'right', fontWeight: 700 }}>{a.market_share}%</td>
                    <td className="font-mono" style={{ textAlign: 'right' }}>{a.daily_flights}</td>
                    <td>
                      <span className="gov-badge info">{a.market_share_type || 'DEMO_REFERENCE'}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* AIRLINE × ROUTE PRICE MATRIX (Derived from API /routes) */}
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
                const fareAvg = c.avg_fare || c.avgFare || 5000;
                const fare6E = Math.round(fareAvg * 0.98);
                const fareAI = Math.round(fareAvg * 1.12);
                const fareSG = Math.round(fareAvg * 0.92);
                const fareQP = Math.round(fareAvg * 0.95);
                const spread = fareAI - fareSG;

                return (
                  <tr key={c.route_id || c.id}>
                    <td className="font-mono" style={{ fontWeight: 700, color: 'var(--navy-dark)' }}>
                      {c.route_id || c.id}
                    </td>
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

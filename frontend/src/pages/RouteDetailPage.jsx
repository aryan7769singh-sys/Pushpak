import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CORRIDORS, AIRLINES, RECENT_OBSERVATIONS } from '../data/mockData';
import { KpiCard } from '../components/common/KpiCard';
import { QualityBadge } from '../components/common/QualityBadge';
import { LeadTimeCurveChart } from '../components/charts/LeadTimeCurveChart';
import { CarrierComparisonChart } from '../components/charts/CarrierComparisonChart';
import { ArrowLeft, Download, ShieldCheck, Database, Clock } from 'lucide-react';

export function RouteDetailPage() {
  const { routeId } = useParams();
  const navigate = useNavigate();

  // Find route or fallback to DEL-BOM
  const corridor = CORRIDORS.find(c => c.id === routeId) || CORRIDORS[0];

  const leadTimePoints = [
    { horizon: 'T+1', fare: corridor.t1Fare, label: '24h Spot' },
    { horizon: 'T+7', fare: corridor.t7Fare, label: '7 Days' },
    { horizon: 'T+15', fare: corridor.t15Fare, label: '15 Days' },
    { horizon: 'T+30', fare: corridor.t30Fare, label: '30 Days' },
    { horizon: 'T+45', fare: corridor.t45Fare, label: '45 Days' },
  ];

  return (
    <div>
      {/* Top Header */}
      <div className="gov-page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            className="gov-btn"
            onClick={() => navigate('/routes')}
            style={{ height: '28px', padding: '0 8px' }}
          >
            <ArrowLeft size={13} />
            <span>All Routes</span>
          </button>
          <div className="gov-title-block">
            <h1 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>{corridor.id}</span>
              <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-subtle)' }}>
                ({corridor.origin} → {corridor.dest})
              </span>
            </h1>
            <p>{corridor.sector} • Distance: {corridor.distanceKm} km • Scheduled Daily Frequency: ~{corridor.dailyFlights} flights</p>
          </div>
        </div>

        <div className="gov-action-controls">
          <QualityBadge flag={corridor.quality} />
          <button className="gov-btn" onClick={() => alert(`Audit report for corridor ${corridor.id} exported.`)}>
            <Download size={13} />
            <span>Export Audit (CSV)</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="gov-kpi-grid">
        <KpiCard
          title="Current Average Fare"
          value={`₹${corridor.avgFare.toLocaleString()}`}
          delta={`${corridor.changePct > 0 ? '+' : ''}${corridor.changePct}%`}
          deltaType={corridor.changePct > 0 ? 'negative' : 'positive'}
          subtext="24h price relative vs base"
          highlight={true}
        />
        <KpiCard
          title="T+1 Spot Surge Fare"
          value={`₹${corridor.t1Fare.toLocaleString()}`}
          delta="SURGE"
          deltaType="negative"
          subtext="Premium vs T+45: +166%"
          sparklineData={[9800, 10200, 10500, 10850, corridor.t1Fare]}
          sparklineColor="#dc2626"
        />
        <KpiCard
          title="Volatility Index"
          value={corridor.volatility.split(' ')[0]}
          subtext={corridor.volatility}
          badgeText="STABILITY"
          badgeType="info"
        />
        <KpiCard
          title="Data Confidence"
          value="99.4%"
          subtext="Deduplicated canonical records"
          badgeText="AUDITED"
          badgeType="ok"
        />
      </div>

      {/* Two-Column Detail Layout */}
      <div className="gov-two-column">
        {/* Left Column: Lead-time curve & Carrier Comparison */}
        <div>
          <div className="gov-card">
            <div className="gov-card-header">
              <div className="gov-card-title">
                HORIZON DECAY CURVE (T+1 TO T+45)
                <span className="gov-card-subtitle">Empirical price progression by purchase advance time</span>
              </div>
            </div>
            <div className="gov-card-body">
              <LeadTimeCurveChart data={leadTimePoints} route={corridor.id} />
            </div>
          </div>

          <div className="gov-card">
            <div className="gov-card-header">
              <div className="gov-card-title">
                CARRIER BENCHMARKS ON {corridor.id}
                <span className="gov-card-subtitle">Observed airline price positioning</span>
              </div>
            </div>
            <div className="gov-card-body">
              <CarrierComparisonChart />
            </div>
          </div>
        </div>

        {/* Right Column: Unbundled Fare Breakdown & Surveillance Provenance */}
        <div>
          <div className="gov-card">
            <div className="gov-card-header">
              <div className="gov-card-title">
                CANONICAL FARE COMPOSITION
                <span className="gov-card-subtitle">Mandatory unbundling structure</span>
              </div>
              <span className="gov-badge info">AVERAGE</span>
            </div>
            <div className="gov-table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
              <table className="gov-table">
                <tbody>
                  <tr>
                    <td>Airline Base Fare (80%)</td>
                    <td className="font-mono" style={{ textAlign: 'right', fontWeight: 600 }}>₹{corridor.baseFare}</td>
                  </tr>
                  <tr>
                    <td>Goods & Services Tax (GST 10%)</td>
                    <td className="font-mono" style={{ textAlign: 'right' }}>₹{corridor.taxes}</td>
                  </tr>
                  <tr>
                    <td>User Development / PSF (Airport)</td>
                    <td className="font-mono" style={{ textAlign: 'right' }}>₹{corridor.airportCharges}</td>
                  </tr>
                  <tr>
                    <td>Auxiliary Platform & Convenience</td>
                    <td className="font-mono" style={{ textAlign: 'right' }}>₹{corridor.auxFees}</td>
                  </tr>
                  <tr style={{ background: '#f8fafc', fontWeight: 700 }}>
                    <td>Total Observed Price</td>
                    <td className="font-mono" style={{ textAlign: 'right', color: 'var(--navy-dark)', fontSize: '13px' }}>
                      ₹{corridor.avgFare}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="gov-card">
            <div className="gov-card-header">
              <div className="gov-card-title">
                SURVEILLANCE PROVENANCE
                <span className="gov-card-subtitle">Audit trail and regulatory metadata</span>
              </div>
              <ShieldCheck size={14} color="#16a34a" />
            </div>
            <div className="gov-card-body" style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '4px' }}>
                  <span>Monitored Flights / Day</span>
                  <span className="font-mono" style={{ fontWeight: 600, color: 'var(--navy-dark)' }}>{corridor.dailyFlights} flights</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '4px' }}>
                  <span>Active Operators</span>
                  <span style={{ fontWeight: 600, color: 'var(--navy-dark)' }}>IndiGo, Air India, SpiceJet, Akasa</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '4px' }}>
                  <span>Sampling Cadence</span>
                  <span className="font-mono">Every 15 Minutes</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Regulatory Watch</span>
                  <span className="gov-badge ok">COMPLIANT</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Observation History Table for this Route */}
      <div className="gov-card">
        <div className="gov-card-header">
          <div className="gov-card-title">
            RECENT AUDIT OBSERVATIONS: {corridor.id}
            <span className="gov-card-subtitle">Latest raw snapshots for this corridor</span>
          </div>
        </div>
        <div className="gov-table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
          <table className="gov-table">
            <thead>
              <tr>
                <th>OBSERVATION ID</th>
                <th>TIMESTAMP (IST)</th>
                <th>AIRLINE</th>
                <th>FLIGHT</th>
                <th>HORIZON</th>
                <th style={{ textAlign: 'right' }}>BASE FARE</th>
                <th style={{ textAlign: 'right' }}>TAXES</th>
                <th style={{ textAlign: 'right' }}>AIRPORT</th>
                <th style={{ textAlign: 'right' }}>TOTAL FARE</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {RECENT_OBSERVATIONS.filter(o => o.origin === corridor.origin && o.destination === corridor.dest).map((obs) => (
                <tr key={obs.id}>
                  <td className="font-mono" style={{ fontWeight: 600 }}>{obs.id}</td>
                  <td className="font-mono" style={{ color: 'var(--text-subtle)' }}>{obs.timestamp}</td>
                  <td style={{ fontWeight: 500 }}>{obs.airline}</td>
                  <td className="font-mono">{obs.flightNo}</td>
                  <td>
                    <span className={`horizon-tag ${obs.horizon.toLowerCase().replace('+', '')}`}>
                      {obs.horizon}
                    </span>
                  </td>
                  <td className="font-mono" style={{ textAlign: 'right' }}>₹{obs.baseFare}</td>
                  <td className="font-mono" style={{ textAlign: 'right' }}>₹{obs.taxes}</td>
                  <td className="font-mono" style={{ textAlign: 'right' }}>₹{obs.airportCharges}</td>
                  <td className="font-mono" style={{ textAlign: 'right', fontWeight: 700, color: 'var(--navy-dark)' }}>₹{obs.totalFare}</td>
                  <td><span className="gov-badge ok">{obs.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

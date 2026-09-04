import React from 'react';
import { Database, ArrowRight, CheckCircle2, Clock, ShieldCheck, Layers, RefreshCw } from 'lucide-react';
import { DEMO_METADATA } from '../data/mockData';

export function DataSourcesPage() {
  const sources = [
    {
      name: "Historical Airfare Archive",
      category: "Historical Dataset",
      status: "Ingested",
      records: "1,200,000",
      cadence: "Static Baseline",
      reliability: "100%",
    },
    {
      name: "Scheduled Carrier GDS / API Feeds",
      category: "API & Direct Connect",
      status: "Active Polling",
      records: "38,400 / day",
      cadence: "15-Minute Polling",
      reliability: "99.8%",
    },
    {
      name: "Direct Airline Sources (IndiGo, AI, SG, Akasa)",
      category: "Airline Direct Feeds",
      status: "Active",
      records: "18,200 / day",
      cadence: "30-Minute Polling",
      reliability: "99.4%",
    },
    {
      name: "Permitted Aggregator / OTA Reference Feeds",
      category: "OTA Sources",
      status: "Active",
      records: "24,000 / day",
      cadence: "Hourly Batch",
      reliability: "98.9%",
    },
    {
      name: "DGCA Domestic Traffic Reference Data",
      category: "Regulatory Reference",
      status: "Synced",
      records: "Monthly Route Pax",
      cadence: "Monthly Bulletin",
      reliability: "Official Statutory",
    },
    {
      name: "MoSPI CPI Weighting Reference Matrix",
      category: "Statistical Reference",
      status: "Synced",
      records: "CPI 2012 Base Basket",
      cadence: "Annual Update",
      reliability: "Official Statutory",
    },
  ];

  const pipelineStages = [
    { step: 1, name: "SOURCE INGESTION", desc: "Multi-channel intake (APIs, archives, feeds)", status: "Active" },
    { step: 2, name: "CANONICAL OBSERVATION", desc: "Common contract normalization (Base, Tax, Fees)", status: "Active" },
    { step: 3, name: "VALIDATION & DEDUP", desc: "Deduplication & missing flight verification", status: "Active" },
    { step: 4, name: "FARE CLEANING", desc: "Outlier filtering & sold-out detection", status: "Active" },
    { step: 5, name: "INDEX ENGINE", desc: "Jevons geometric mean aggregation across horizons", status: "Phase 4 Ready" },
  ];

  return (
    <div>
      {/* Header */}
      <div className="gov-page-header">
        <div className="gov-title-block">
          <h1>DATA SOURCES & PIPELINE</h1>
          <p>Architectural overview of data collection feeds, normalization gates, and quality verification pipelines.</p>
        </div>
        <div className="gov-action-controls">
          <span className="gov-badge ok">6 SOURCE CHANNELS CONNECTED</span>
        </div>
      </div>

      {/* Pipeline Flow Visualization */}
      <div className="gov-card">
        <div className="gov-card-header">
          <div className="gov-card-title">
            PUSHPAK DATA PROCESSING PIPELINE
            <span className="gov-card-subtitle">End-to-end normalization from raw capture to Jevons aggregation</span>
          </div>
        </div>
        <div className="gov-card-body">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', overflowX: 'auto', padding: '8px 0' }}>
            {pipelineStages.map((stage, i) => (
              <React.Fragment key={stage.step}>
                <div style={{
                  flex: 1,
                  minWidth: '150px',
                  background: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  borderRadius: '2px',
                  padding: '10px',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-subtle)', fontFamily: 'var(--font-mono)' }}>
                      STEP 0{stage.step}
                    </span>
                    <span className={`gov-badge ${stage.status.includes('Active') ? 'ok' : 'info'}`}>
                      {stage.status}
                    </span>
                  </div>
                  <div style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--navy-dark)', marginBottom: '3px' }}>
                    {stage.name}
                  </div>
                  <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', lineHeight: '1.3' }}>
                    {stage.desc}
                  </div>
                </div>

                {i < pipelineStages.length - 1 && (
                  <ArrowRight size={16} color="#94a3b8" style={{ flexShrink: 0 }} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Sources Table */}
      <div className="gov-card">
        <div className="gov-card-header">
          <div className="gov-card-title">
            REGISTERED DATA SOURCES & AUDIT CADENCE
            <span className="gov-card-subtitle">Provenance registry for all domestic fare capture streams</span>
          </div>
        </div>
        <div className="gov-table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
          <table className="gov-table">
            <thead>
              <tr>
                <th>SOURCE IDENTIFIER</th>
                <th>CATEGORY</th>
                <th>SAMPLING CADENCE</th>
                <th style={{ textAlign: 'right' }}>RECORD VOLUME</th>
                <th>AUDIT STATUS</th>
                <th>RELIABILITY SCORE</th>
              </tr>
            </thead>
            <tbody>
              {sources.map((s) => (
                <tr key={s.name}>
                  <td style={{ fontWeight: 600, color: 'var(--navy-dark)' }}>{s.name}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{s.category}</td>
                  <td className="font-mono">{s.cadence}</td>
                  <td className="font-mono" style={{ textAlign: 'right', fontWeight: 600 }}>{s.records}</td>
                  <td>
                    <span className="gov-badge ok">
                      <CheckCircle2 size={11} style={{ display: 'inline', marginRight: '3px' }} />
                      {s.status}
                    </span>
                  </td>
                  <td className="font-mono" style={{ fontWeight: 600, color: '#166534' }}>{s.reliability}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

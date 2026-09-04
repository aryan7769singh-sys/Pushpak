import React, { useState, useMemo } from 'react';
import { RECENT_OBSERVATIONS } from '../data/mockData';
import { QualityBadge } from '../components/common/QualityBadge';
import { DetailDrawer } from '../components/common/DetailDrawer';
import { Search, Download, Filter, ChevronDown, ChevronUp, Eye } from 'lucide-react';

export function DataExplorerPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [horizonFilter, setHorizonFilter] = useState('ALL');
  const [airlineFilter, setAirlineFilter] = useState('ALL');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState('timestamp');
  const [sortAsc, setSortAsc] = useState(false);
  const pageSize = 8;

  const filteredObservations = useMemo(() => {
    return RECENT_OBSERVATIONS.filter(obs => {
      const matchSearch =
        obs.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        obs.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
        obs.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
        obs.airline.toLowerCase().includes(searchTerm.toLowerCase()) ||
        obs.flightNo.toLowerCase().includes(searchTerm.toLowerCase());
      const matchHorizon = horizonFilter === 'ALL' || obs.horizon === horizonFilter;
      const matchAirline = airlineFilter === 'ALL' || obs.airline === airlineFilter;
      return matchSearch && matchHorizon && matchAirline;
    }).sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      if (aVal < bVal) return sortAsc ? -1 : 1;
      if (aVal > bVal) return sortAsc ? 1 : -1;
      return 0;
    });
  }, [searchTerm, horizonFilter, airlineFilter, sortField, sortAsc]);

  const totalPages = Math.ceil(filteredObservations.length / pageSize) || 1;
  const paginatedData = filteredObservations.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSort = (field) => {
    if (sortField === field) setSortAsc(!sortAsc);
    else { setSortField(field); setSortAsc(false); }
  };

  return (
    <div>
      {/* Header */}
      <div className="gov-page-header">
        <div className="gov-title-block">
          <h1>DATA EXPLORER</h1>
          <p>Canonical observation registry, unbundled fare structure, and statutory audit provenance.</p>
        </div>
        <div className="gov-action-controls">
          <span className="gov-badge info">1.2M DEMO OBSERVATIONS</span>
          <button className="gov-btn" onClick={() => alert("Raw observations export initiated.")}>
            <Download size={13} />
            <span>Export Slice (CSV)</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="gov-filter-bar">
        <div className="search-corridor-box" style={{ width: '240px', height: '28px' }}>
          <Search size={13} color="#64748b" />
          <input
            type="text"
            placeholder="Search Obs ID, Origin, Flight No..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11.5px' }}>
          <span style={{ color: 'var(--text-subtle)', fontWeight: 600 }}>Horizon:</span>
          <select
            className="gov-select"
            value={horizonFilter}
            onChange={(e) => setHorizonFilter(e.target.value)}
          >
            <option value="ALL">All Horizons</option>
            <option value="T+1">T+1 (24h)</option>
            <option value="T+7">T+7 (7d)</option>
            <option value="T+15">T+15 (15d)</option>
            <option value="T+30">T+30 (30d)</option>
            <option value="T+45">T+45 (45d)</option>
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11.5px' }}>
          <span style={{ color: 'var(--text-subtle)', fontWeight: 600 }}>Airline:</span>
          <select
            className="gov-select"
            value={airlineFilter}
            onChange={(e) => setAirlineFilter(e.target.value)}
          >
            <option value="ALL">All Operators</option>
            <option value="IndiGo">IndiGo</option>
            <option value="Air India">Air India</option>
            <option value="SpiceJet">SpiceJet</option>
            <option value="Akasa Air">Akasa Air</option>
            <option value="Air India Express">Air India Express</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="gov-table-wrapper">
        <table className="gov-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('timestamp')} className="sortable">DATE & TIME (IST)</th>
              <th>ORIGIN</th>
              <th>DEST</th>
              <th>AIRLINE</th>
              <th>FLIGHT</th>
              <th>HORIZON</th>
              <th style={{ textAlign: 'right' }}>BASE FARE</th>
              <th style={{ textAlign: 'right' }}>TAXES</th>
              <th style={{ textAlign: 'right' }}>AIRPORT</th>
              <th style={{ textAlign: 'right' }}>AUX FEES</th>
              <th style={{ textAlign: 'right' }} onClick={() => handleSort('totalFare')} className="sortable">
                TOTAL FARE
              </th>
              <th>STATUS</th>
              <th>QUALITY</th>
              <th style={{ textAlign: 'center' }}>INSPECT</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((obs) => (
              <tr
                key={obs.id}
                className="clickable"
                onClick={() => setSelectedRecord(obs)}
              >
                <td className="font-mono" style={{ color: 'var(--text-subtle)' }}>{obs.timestamp}</td>
                <td className="font-mono" style={{ fontWeight: 700, color: 'var(--navy-dark)' }}>{obs.origin}</td>
                <td className="font-mono" style={{ fontWeight: 700, color: 'var(--navy-dark)' }}>{obs.destination}</td>
                <td style={{ fontWeight: 500 }}>{obs.airline}</td>
                <td className="font-mono">{obs.flightNo}</td>
                <td>
                  <span className={`horizon-tag ${obs.horizon.toLowerCase().replace('+', '')}`}>
                    {obs.horizon}
                  </span>
                </td>
                <td className="font-mono" style={{ textAlign: 'right' }}>₹{obs.baseFare.toLocaleString()}</td>
                <td className="font-mono" style={{ textAlign: 'right' }}>₹{obs.taxes.toLocaleString()}</td>
                <td className="font-mono" style={{ textAlign: 'right' }}>₹{obs.airportCharges.toLocaleString()}</td>
                <td className="font-mono" style={{ textAlign: 'right' }}>₹{obs.auxFees.toLocaleString()}</td>
                <td className="font-mono" style={{ textAlign: 'right', fontWeight: 700, color: 'var(--navy-dark)' }}>
                  ₹{obs.totalFare.toLocaleString()}
                </td>
                <td><span className="gov-badge ok">{obs.status}</span></td>
                <td><QualityBadge flag={obs.quality} /></td>
                <td style={{ textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                  <button
                    className="gov-btn"
                    style={{ height: '22px', padding: '0 6px', fontSize: '10px' }}
                    onClick={() => setSelectedRecord(obs)}
                  >
                    <Eye size={11} />
                  </button>
                </td>
              </tr>
            ))}
            {paginatedData.length === 0 && (
              <tr>
                <td colSpan="14" style={{ textAlign: 'center', padding: '24px', color: 'var(--text-subtle)' }}>
                  No observations found matching the specified parameters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div style={{ padding: '8px 12px', background: '#ffffff', border: '1px solid var(--border-light)', borderTop: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px' }}>
          <span style={{ color: 'var(--text-subtle)' }}>
            Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, filteredObservations.length)} of {filteredObservations.length} observations
          </span>
          <div style={{ display: 'flex', gap: '4px' }}>
            <button
              className="gov-btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              style={{ height: '24px', padding: '0 8px', fontSize: '11px' }}
            >
              Previous
            </button>
            <span style={{ padding: '3px 8px', fontWeight: 600 }}>
              {currentPage} / {totalPages}
            </span>
            <button
              className="gov-btn"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              style={{ height: '24px', padding: '0 8px', fontSize: '11px' }}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Row Detail Drawer */}
      <DetailDrawer
        isOpen={!!selectedRecord}
        onClose={() => setSelectedRecord(null)}
        title={selectedRecord ? `Canonical Observation: ${selectedRecord.id}` : ''}
        subtitle={selectedRecord ? `${selectedRecord.airline} • Flight ${selectedRecord.flightNo}` : ''}
      >
        {selectedRecord && (
          <div>
            <div style={{ padding: '10px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '2px', marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ color: 'var(--text-subtle)', fontSize: '11px' }}>Corridor</span>
                <span className="font-mono" style={{ fontWeight: 700, color: 'var(--navy-dark)' }}>
                  {selectedRecord.origin} → {selectedRecord.destination}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ color: 'var(--text-subtle)', fontSize: '11px' }}>Observation Timestamp</span>
                <span className="font-mono">{selectedRecord.timestamp}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-subtle)', fontSize: '11px' }}>Lead-Time Horizon</span>
                <span className={`horizon-tag ${selectedRecord.horizon.toLowerCase().replace('+', '')}`}>
                  {selectedRecord.horizon}
                </span>
              </div>
            </div>

            <h4 style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--navy-dark)', marginBottom: '8px' }}>
              Unbundled Fare Breakdown (INR)
            </h4>
            <div className="gov-table-wrapper" style={{ marginBottom: '16px' }}>
              <table className="gov-table">
                <tbody>
                  <tr>
                    <td>Airline Base Fare</td>
                    <td className="font-mono" style={{ textAlign: 'right', fontWeight: 600 }}>₹{selectedRecord.baseFare}</td>
                  </tr>
                  <tr>
                    <td>Goods & Services Tax (GST)</td>
                    <td className="font-mono" style={{ textAlign: 'right' }}>₹{selectedRecord.taxes}</td>
                  </tr>
                  <tr>
                    <td>Airport Charges (UDF / PSF)</td>
                    <td className="font-mono" style={{ textAlign: 'right' }}>₹{selectedRecord.airportCharges}</td>
                  </tr>
                  <tr>
                    <td>Auxiliary / Platform Fees</td>
                    <td className="font-mono" style={{ textAlign: 'right' }}>₹{selectedRecord.auxFees}</td>
                  </tr>
                  <tr style={{ background: '#f8fafc', fontWeight: 700 }}>
                    <td>Total Observed Fare</td>
                    <td className="font-mono" style={{ textAlign: 'right', color: 'var(--navy-dark)', fontSize: '13px' }}>
                      ₹{selectedRecord.totalFare}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h4 style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--navy-dark)', marginBottom: '8px' }}>
              Quality & Verification Log
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11.5px', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '4px' }}>
                <span>Quality Status</span>
                <QualityBadge flag={selectedRecord.quality} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '4px' }}>
                <span>Verification State</span>
                <span className="gov-badge ok">{selectedRecord.status}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Audit Hash (SHA-256)</span>
                <span className="font-mono" style={{ fontSize: '10px', color: 'var(--text-subtle)' }}>
                  3a8f9c1b4e2d... (Demo Observation Hash)
                </span>
              </div>
            </div>

            <div style={{ marginTop: '20px' }}>
              <button
                className="gov-btn gov-btn-primary"
                style={{ width: '100%', justifyContent: 'center', height: '32px' }}
                onClick={() => setSelectedRecord(null)}
              >
                Close Audit Inspection
              </button>
            </div>
          </div>
        )}
      </DetailDrawer>
    </div>
  );
}

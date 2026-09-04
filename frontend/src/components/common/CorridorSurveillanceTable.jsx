import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { CORRIDORS } from '../../data/mockData';
import { QualityBadge } from './QualityBadge';
import { DetailDrawer } from './DetailDrawer';
import { Search, ChevronDown, ChevronUp, ExternalLink, FileText, CheckSquare } from 'lucide-react';

export function CorridorSurveillanceTable({
  title = "CORRIDOR PRICE SURVEILLANCE MATRIX",
  subtitle = "Dynamic monitoring of strategic domestic corridors.",
  initialLimit = 8,
  showPagination = true,
  corridors: propCorridors,
}) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [sectorFilter, setSectorFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortField, setSortField] = useState('changePct');
  const [sortAsc, setSortAsc] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCorridor, setSelectedCorridor] = useState(null);
  const pageSize = initialLimit;

  const corridors = useMemo(() => {
    const raw = propCorridors || CORRIDORS;
    return raw.map(c => ({
      ...c,
      id: c.id || c.route_id || 'UNKNOWN',
      origin: c.origin || '',
      dest: c.dest || c.destination || '',
      sector: c.sector || 'Domestic Sector',
      distanceKm: c.distanceKm ?? c.distance_km ?? 1000,
      dailyFlights: c.dailyFlights ?? c.daily_flights ?? 20,
      avgFare: c.avgFare ?? c.avg_fare ?? 0,
      t1Fare: c.t1Fare ?? c.t1_fare ?? 0,
      t7Fare: c.t7Fare ?? c.t7_fare ?? 0,
      t15Fare: c.t15Fare ?? c.t15_fare ?? 0,
      t30Fare: c.t30Fare ?? c.t30_fare ?? 0,
      t45Fare: c.t45Fare ?? c.t45_fare ?? 0,
      changePct: c.changePct ?? c.change_pct ?? 0,
      baseFare: c.baseFare ?? c.base_fare ?? 0,
      taxes: c.taxes ?? 0,
      airportCharges: c.airportCharges ?? c.airport_charges ?? 0,
      auxFees: c.auxFees ?? c.aux_fees ?? 0,
      volatility: c.volatility || 'Standard',
      quality: c.quality || 'STANDARD',
      status: c.status || 'Surveillance Active',
    }));
  }, [propCorridors]);

  // Sectors for filter dropdown
  const sectors = useMemo(() => {
    return ['ALL', ...new Set(corridors.map(c => c.sector))];
  }, [corridors]);

  // Filter & sort
  const filteredData = useMemo(() => {
    return corridors.filter(c => {
      const routeId = c.id || '';
      const destCode = c.dest || '';
      const matchSearch =
        routeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
        destCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.sector.toLowerCase().includes(searchTerm.toLowerCase());
      const matchSector = sectorFilter === 'ALL' || c.sector === sectorFilter;
      const matchStatus = statusFilter === 'ALL' || c.quality === statusFilter;
      return matchSearch && matchSector && matchStatus;
    }).sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }
      if (aVal < bVal) return sortAsc ? -1 : 1;
      if (aVal > bVal) return sortAsc ? 1 : -1;
      return 0;
    });
  }, [searchTerm, sectorFilter, statusFilter, sortField, sortAsc]);

  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
  const paginatedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  return (
    <div className="gov-card">
      <div className="gov-card-header">
        <div>
          <div className="gov-card-title">{title}</div>
          {subtitle && <div className="gov-card-subtitle">{subtitle}</div>}
        </div>
        <span className="gov-badge info">
          {filteredData.length} CORRIDORS
        </span>
      </div>

      {/* Filter Row */}
      <div style={{ padding: '8px 12px', background: '#f8fafc', borderBottom: '1px solid var(--border-light)', display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div className="search-corridor-box" style={{ width: '200px', height: '28px' }}>
          <Search size={13} color="#64748b" />
          <input
            type="text"
            placeholder="Search corridor..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px' }}>
          <span style={{ color: 'var(--text-subtle)', fontWeight: 600 }}>Sector:</span>
          <select
            className="gov-select"
            value={sectorFilter}
            onChange={(e) => { setSectorFilter(e.target.value); setCurrentPage(1); }}
          >
            {sectors.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px' }}>
          <span style={{ color: 'var(--text-subtle)', fontWeight: 600 }}>Quality:</span>
          <select
            className="gov-select"
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
          >
            <option value="ALL">All Quality Flags</option>
            <option value="STANDARD">Standard</option>
            <option value="HIGH OBSERVATION">High Observation</option>
            <option value="ANOMALY">Anomaly</option>
            <option value="SOLD OUT">Sold Out</option>
          </select>
        </div>
      </div>

      {/* Matrix Table */}
      <div className="gov-table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
        <table className="gov-table">
          <thead>
            <tr>
              <th className="sortable" onClick={() => handleSort('id')}>
                CORRIDOR {sortField === 'id' && (sortAsc ? <ChevronUp size={12} style={{ display: 'inline' }} /> : <ChevronDown size={12} style={{ display: 'inline' }} />)}
              </th>
              <th>SECTOR / ROUTE</th>
              <th className="sortable" onClick={() => handleSort('avgFare')} style={{ textAlign: 'right' }}>
                AVG FARE {sortField === 'avgFare' && (sortAsc ? <ChevronUp size={12} style={{ display: 'inline' }} /> : <ChevronDown size={12} style={{ display: 'inline' }} />)}
              </th>
              <th className="sortable" onClick={() => handleSort('t1Fare')} style={{ textAlign: 'right' }}>
                T+1 FARE
              </th>
              <th className="sortable" onClick={() => handleSort('t45Fare')} style={{ textAlign: 'right' }}>
                T+45 FARE
              </th>
              <th className="sortable" onClick={() => handleSort('changePct')} style={{ textAlign: 'right' }}>
                DAILY MOVEMENT {sortField === 'changePct' && (sortAsc ? <ChevronUp size={12} style={{ display: 'inline' }} /> : <ChevronDown size={12} style={{ display: 'inline' }} />)}
              </th>
              <th>QUALITY FLAG</th>
              <th style={{ textAlign: 'center' }}>REGULATORY ACTION</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row) => (
              <tr
                key={row.id}
                className="clickable"
                onClick={() => setSelectedCorridor(row)}
              >
                <td style={{ fontWeight: 700, color: 'var(--navy-dark)' }} className="font-mono">
                  {row.id}
                </td>
                <td style={{ color: 'var(--text-muted)' }}>
                  {row.sector} <span style={{ fontSize: '10.5px', color: 'var(--text-subtle)' }}>({row.distanceKm} km • {row.dailyFlights} flt/d)</span>
                </td>
                <td style={{ textAlign: 'right', fontWeight: 600 }} className="font-mono">
                  ₹{row.avgFare.toLocaleString()}
                </td>
                <td style={{ textAlign: 'right', color: '#dc2626', fontWeight: 600 }} className="font-mono">
                  ₹{row.t1Fare.toLocaleString()}
                </td>
                <td style={{ textAlign: 'right', color: '#16a34a', fontWeight: 600 }} className="font-mono">
                  ₹{row.t45Fare.toLocaleString()}
                </td>
                <td style={{ textAlign: 'right' }}>
                  <span className={`kpi-delta ${row.changePct > 0 ? 'negative' : 'positive'}`}>
                    {row.changePct > 0 ? '+' : ''}{row.changePct}%
                  </span>
                </td>
                <td>
                  <QualityBadge flag={row.quality} />
                </td>
                <td style={{ textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                  <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                    <button
                      className="gov-btn"
                      style={{ fontSize: '10px', height: '22px', padding: '0 6px' }}
                      title="Inspect Corridor Detail"
                      onClick={() => navigate(`/routes/${row.id}`)}
                    >
                      Details
                    </button>
                    <button
                      className="gov-btn"
                      style={{ fontSize: '10px', height: '22px', padding: '0 6px', color: '#1e3a8a' }}
                      title="Generate Audit Report"
                      onClick={() => setSelectedCorridor(row)}
                    >
                      Audit
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {paginatedData.length === 0 && (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '24px', color: 'var(--text-subtle)' }}>
                  No corridors matching search criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {showPagination && totalPages > 1 && (
        <div style={{ padding: '8px 12px', background: '#f8fafc', borderTop: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px' }}>
          <span style={{ color: 'var(--text-subtle)' }}>
            Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, filteredData.length)} of {filteredData.length} corridors
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

      {/* Corridor Inspection Detail Drawer */}
      <DetailDrawer
        isOpen={!!selectedCorridor}
        onClose={() => setSelectedCorridor(null)}
        title={selectedCorridor ? `Corridor Surveillance: ${selectedCorridor.id}` : ''}
        subtitle={selectedCorridor ? `${selectedCorridor.sector} • ${selectedCorridor.distanceKm} km` : ''}
      >
        {selectedCorridor && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', paddingBottom: '8px', borderBottom: '1px solid var(--border-light)' }}>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-subtle)' }}>Surveillance Status</span>
                <div style={{ fontWeight: 700, color: 'var(--navy-dark)' }}>{selectedCorridor.status}</div>
              </div>
              <QualityBadge flag={selectedCorridor.quality} />
            </div>

            <div className="gov-kpi-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginBottom: '14px' }}>
              <div className="gov-kpi-card">
                <span className="kpi-header">Average Fare</span>
                <span className="kpi-value font-mono" style={{ fontSize: '18px' }}>₹{selectedCorridor.avgFare.toLocaleString()}</span>
                <span className="kpi-footer">Daily change: {selectedCorridor.changePct}%</span>
              </div>
              <div className="gov-kpi-card">
                <span className="kpi-header">T+1 Spot Fare</span>
                <span className="kpi-value font-mono" style={{ fontSize: '18px', color: '#dc2626' }}>₹{selectedCorridor.t1Fare.toLocaleString()}</span>
                <span className="kpi-footer">Surge: {selectedCorridor.volatility}</span>
              </div>
            </div>

            <h4 style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--navy-dark)', marginBottom: '8px' }}>
              Unbundled Fare Breakdown
            </h4>
            <div className="gov-table-wrapper" style={{ marginBottom: '16px' }}>
              <table className="gov-table">
                <tbody>
                  <tr>
                    <td>Base Airline Fare</td>
                    <td className="font-mono" style={{ textAlign: 'right', fontWeight: 600 }}>₹{selectedCorridor.baseFare}</td>
                  </tr>
                  <tr>
                    <td>Goods & Services Tax (GST)</td>
                    <td className="font-mono" style={{ textAlign: 'right' }}>₹{selectedCorridor.taxes}</td>
                  </tr>
                  <tr>
                    <td>Airport Charges (UDF/PSF)</td>
                    <td className="font-mono" style={{ textAlign: 'right' }}>₹{selectedCorridor.airportCharges}</td>
                  </tr>
                  <tr>
                    <td>Auxiliary / Platform Fees</td>
                    <td className="font-mono" style={{ textAlign: 'right' }}>₹{selectedCorridor.auxFees}</td>
                  </tr>
                  <tr style={{ background: '#f8fafc', fontWeight: 700 }}>
                    <td>Total Observed Fare</td>
                    <td className="font-mono" style={{ textAlign: 'right', color: 'var(--navy-dark)' }}>₹{selectedCorridor.avgFare}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
              <button
                className="gov-btn gov-btn-primary"
                style={{ flex: 1, justifyContent: 'center', height: '32px' }}
                onClick={() => {
                  const id = selectedCorridor.id;
                  setSelectedCorridor(null);
                  navigate(`/routes/${id}`);
                }}
              >
                Full Route Intelligence
              </button>
              <button
                className="gov-btn"
                style={{ flex: 1, justifyContent: 'center', height: '32px' }}
                onClick={() => setSelectedCorridor(null)}
              >
                Close Audit
              </button>
            </div>
          </div>
        )}
      </DetailDrawer>
    </div>
  );
}

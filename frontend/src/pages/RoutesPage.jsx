import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { CORRIDORS, AIRPORTS } from '../data/mockData';
import { QualityBadge } from '../components/common/QualityBadge';
import { Search, Filter, ArrowRight, Download } from 'lucide-react';

export function RoutesPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [originFilter, setOriginFilter] = useState('ALL');
  const [destFilter, setDestFilter] = useState('ALL');
  const [qualityFilter, setQualityFilter] = useState('ALL');
  const [sortField, setSortField] = useState('changePct');
  const [sortAsc, setSortAsc] = useState(false);

  const origins = useMemo(() => ['ALL', ...new Set(CORRIDORS.map(c => c.origin))], []);
  const destinations = useMemo(() => ['ALL', ...new Set(CORRIDORS.map(c => c.dest))], []);

  const filteredRoutes = useMemo(() => {
    return CORRIDORS.filter(c => {
      const matchSearch =
        c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.sector.toLowerCase().includes(searchTerm.toLowerCase());
      const matchOrigin = originFilter === 'ALL' || c.origin === originFilter;
      const matchDest = destFilter === 'ALL' || c.dest === destFilter;
      const matchQuality = qualityFilter === 'ALL' || c.quality === qualityFilter;
      return matchSearch && matchOrigin && matchDest && matchQuality;
    }).sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      if (typeof aVal === 'string') { aVal = aVal.toLowerCase(); bVal = bVal.toLowerCase(); }
      if (aVal < bVal) return sortAsc ? -1 : 1;
      if (aVal > bVal) return sortAsc ? 1 : -1;
      return 0;
    });
  }, [searchTerm, originFilter, destFilter, qualityFilter, sortField, sortAsc]);

  return (
    <div>
      {/* Header */}
      <div className="gov-page-header">
        <div className="gov-title-block">
          <h1>ROUTE SURVEILLANCE</h1>
          <p>Continuous price monitoring and quality audit across 50 strategic domestic flight sectors.</p>
        </div>
        <div className="gov-action-controls">
          <span className="gov-badge info">{filteredRoutes.length} CORRIDORS ACTIVE</span>
          <button className="gov-btn" onClick={() => alert("Route surveillance dataset exported.")}>
            <Download size={13} />
            <span>Export Registry (CSV)</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="gov-filter-bar">
        <div className="search-corridor-box" style={{ width: '220px', height: '28px' }}>
          <Search size={13} color="#64748b" />
          <input
            type="text"
            placeholder="Filter by corridor (e.g. DEL-BOM)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11.5px' }}>
          <span style={{ color: 'var(--text-subtle)', fontWeight: 600 }}>Origin:</span>
          <select
            className="gov-select"
            value={originFilter}
            onChange={(e) => setOriginFilter(e.target.value)}
          >
            {origins.map(o => <option key={o} value={o}>{o === 'ALL' ? 'All Origins' : o}</option>)}
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11.5px' }}>
          <span style={{ color: 'var(--text-subtle)', fontWeight: 600 }}>Destination:</span>
          <select
            className="gov-select"
            value={destFilter}
            onChange={(e) => setDestFilter(e.target.value)}
          >
            {destinations.map(d => <option key={d} value={d}>{d === 'ALL' ? 'All Destinations' : d}</option>)}
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11.5px' }}>
          <span style={{ color: 'var(--text-subtle)', fontWeight: 600 }}>Quality:</span>
          <select
            className="gov-select"
            value={qualityFilter}
            onChange={(e) => setQualityFilter(e.target.value)}
          >
            <option value="ALL">All Qualities</option>
            <option value="STANDARD">Standard</option>
            <option value="HIGH OBSERVATION">High Observation</option>
            <option value="ANOMALY">Anomaly</option>
            <option value="SOLD OUT">Sold Out</option>
          </select>
        </div>
      </div>

      {/* Main Route Table */}
      <div className="gov-table-wrapper">
        <table className="gov-table">
          <thead>
            <tr>
              <th onClick={() => { setSortField('id'); setSortAsc(!sortAsc); }} className="sortable">ROUTE</th>
              <th>SECTOR TYPE</th>
              <th style={{ textAlign: 'right' }}>AVERAGE FARE</th>
              <th style={{ textAlign: 'right' }} onClick={() => { setSortField('changePct'); setSortAsc(!sortAsc); }} className="sortable">
                INDEX CHANGE
              </th>
              <th style={{ textAlign: 'right' }}>T+1</th>
              <th style={{ textAlign: 'right' }}>T+7</th>
              <th style={{ textAlign: 'right' }}>T+15</th>
              <th style={{ textAlign: 'right' }}>T+30</th>
              <th style={{ textAlign: 'right' }}>T+45</th>
              <th>VOLATILITY</th>
              <th>QUALITY</th>
              <th style={{ textAlign: 'center' }}>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {filteredRoutes.map((route) => (
              <tr
                key={route.id}
                className="clickable"
                onClick={() => navigate(`/routes/${route.id}`)}
              >
                <td style={{ fontWeight: 700, color: 'var(--navy-dark)' }} className="font-mono">
                  {route.id}
                </td>
                <td style={{ color: 'var(--text-muted)' }}>
                  {route.sector}
                </td>
                <td style={{ textAlign: 'right', fontWeight: 600 }} className="font-mono">
                  ₹{route.avgFare.toLocaleString()}
                </td>
                <td style={{ textAlign: 'right' }}>
                  <span className={`kpi-delta ${route.changePct > 0 ? 'negative' : 'positive'}`}>
                    {route.changePct > 0 ? '+' : ''}{route.changePct}%
                  </span>
                </td>
                <td style={{ textAlign: 'right', color: '#dc2626' }} className="font-mono">₹{route.t1Fare}</td>
                <td style={{ textAlign: 'right', color: '#d97706' }} className="font-mono">₹{route.t7Fare}</td>
                <td style={{ textAlign: 'right', color: '#2563eb' }} className="font-mono">₹{route.t15Fare}</td>
                <td style={{ textAlign: 'right', color: '#4f46e5' }} className="font-mono">₹{route.t30Fare}</td>
                <td style={{ textAlign: 'right', color: '#16a34a' }} className="font-mono">₹{route.t45Fare}</td>
                <td style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{route.volatility}</td>
                <td><QualityBadge flag={route.quality} /></td>
                <td style={{ textAlign: 'center' }}>
                  <button
                    className="gov-btn"
                    style={{ fontSize: '10px', height: '22px', padding: '0 6px' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/routes/${route.id}`);
                    }}
                  >
                    Detail <ArrowRight size={10} />
                  </button>
                </td>
              </tr>
            ))}
            {filteredRoutes.length === 0 && (
              <tr>
                <td colSpan="12" style={{ textAlign: 'center', padding: '24px', color: 'var(--text-subtle)' }}>
                  No corridors matched the filter parameters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

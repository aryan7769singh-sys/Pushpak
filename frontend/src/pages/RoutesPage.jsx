import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { QualityBadge } from '../components/common/QualityBadge';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ApiErrorState } from '../components/common/ApiErrorState';
import { fetchDashboardRoutes } from '../services/api';
import { Search, ArrowRight, Download, RefreshCw } from 'lucide-react';

export function RoutesPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  const [routes, setRoutes] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [originFilter, setOriginFilter] = useState('ALL');
  const [destFilter, setDestFilter] = useState('ALL');
  const [qualityFilter, setQualityFilter] = useState('ALL');
  const [sortField, setSortField] = useState('changePct');
  const [sortAsc, setSortAsc] = useState(false);

  const loadRoutes = useCallback(async () => {
    setLoading(true);
    setApiError(null);

    const res = await fetchDashboardRoutes();
    if (!res.ok) {
      setApiError(res.error || 'Failed to fetch corridors from API');
      setLoading(false);
      return;
    }

    const normalized = (res.data?.routes || []).map(r => ({
      id: r.route_id,
      origin: r.origin,
      dest: r.destination,
      routeLabel: r.route_label || `${r.origin} → ${r.destination}`,
      sector: r.sector,
      distanceKm: r.distance_km,
      dailyFlights: r.daily_flights,
      avgFare: r.avg_fare,
      t1Fare: r.t1_fare,
      t7Fare: r.t7_fare,
      t15Fare: r.t15_fare,
      t30Fare: r.t30_fare,
      t45Fare: r.t45_fare,
      changePct: r.change_pct,
      volatility: r.volatility,
      quality: r.quality,
      status: r.status,
      weightStatus: r.weight_status || 'DEMO',
    }));

    setRoutes(normalized);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadRoutes();
  }, [loadRoutes]);

  const origins = useMemo(() => ['ALL', ...new Set(routes.map(c => c.origin))], [routes]);
  const destinations = useMemo(() => ['ALL', ...new Set(routes.map(c => c.dest))], [routes]);

  const filteredRoutes = useMemo(() => {
    return routes.filter(c => {
      const matchSearch =
        c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.sector.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.dest.toLowerCase().includes(searchTerm.toLowerCase());
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
  }, [routes, searchTerm, originFilter, destFilter, qualityFilter, sortField, sortAsc]);

  if (loading && routes.length === 0) {
    return <LoadingSpinner message="Retrieving 50 strategic domestic corridors from /api/v1/dashboard/routes..." />;
  }

  if (apiError && routes.length === 0) {
    return (
      <div>
        <div className="gov-page-header">
          <div className="gov-title-block">
            <h1>ROUTE SURVEILLANCE</h1>
            <p>Continuous price monitoring across 50 strategic domestic flight sectors.</p>
          </div>
        </div>
        <ApiErrorState
          title="Route Basket Offline"
          message={`Unable to load the 50 strategic domestic corridor basket from API: ${apiError}.`}
          onRetry={loadRoutes}
        />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="gov-page-header">
        <div className="gov-title-block">
          <h1>ROUTE SURVEILLANCE</h1>
          <p>Continuous price monitoring and quality audit across 50 strategic domestic flight sectors (API Basket).</p>
        </div>
        <div className="gov-action-controls">
          <span className="gov-badge info">{routes.length} CORRIDORS (DEMO BASKET)</span>
          <button className="gov-btn" onClick={loadRoutes} title="Sync with API">
            <RefreshCw size={13} />
            <span>Sync</span>
          </button>
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
            placeholder="Filter corridor (e.g. DEL-BOM)..."
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

      {/* Main Route Table (Powered by API GET /api/v1/dashboard/routes) */}
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
              <th>WEIGHT</th>
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
                <td><span className="gov-badge info">{route.weightStatus}</span></td>
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
                <td colSpan="13" style={{ textAlign: 'center', padding: '24px', color: 'var(--text-subtle)' }}>
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

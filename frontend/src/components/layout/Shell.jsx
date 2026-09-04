import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { GovernmentHeader } from './GovernmentHeader';
import { ErrorBoundary } from '../common/ErrorBoundary';

const ROUTE_LABELS = {
  '/': { title: 'EXECUTIVE INDEX VIEW', section: 'OVERVIEW' },
  '/airfare-index': { title: 'AIRFARE PRICE INDEX', section: 'INDEX' },
  '/routes': { title: 'ROUTE SURVEILLANCE', section: 'ROUTES' },
  '/airlines': { title: 'AIRLINE MARKET VIEW', section: 'AIRLINES' },
  '/analytics': { title: 'ADVANCED AIRFARE ANALYTICS', section: 'ANALYTICS' },
  '/cpi-impact': { title: 'CPI IMPACT SIMULATION', section: 'ANALYTICS' },
  '/data-explorer': { title: 'DATA EXPLORER', section: 'DATA' },
  '/data-sources': { title: 'DATA SOURCES & PIPELINE', section: 'DATA' },
  '/methodology': { title: 'METHODOLOGY', section: 'DOCUMENTATION' },
  '/status': { title: 'SYSTEM STATUS', section: 'SYSTEM' },
};

export function Shell() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  // Find matching route label or default
  const current = ROUTE_LABELS[location.pathname] || {
    title: location.pathname.startsWith('/routes/') ? 'ROUTE SURVEILLANCE DETAIL' : 'EXECUTIVE INDEX VIEW',
    section: location.pathname.startsWith('/routes/') ? 'ROUTES' : 'OVERVIEW',
  };

  return (
    <div className="gov-shell">
      <Sidebar
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(!collapsed)}
      />

      <div className="gov-main-area">
        <GovernmentHeader
          pageTitle={current.title}
          sectionLabel={current.section}
        />

        <main className="gov-page-scroll">
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}

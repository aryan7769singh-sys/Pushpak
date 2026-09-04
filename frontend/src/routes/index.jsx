import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Shell } from '../components/layout/Shell';

import { ExecutiveOverviewPage } from '../pages/ExecutiveOverviewPage';
import { AirfareIndexPage } from '../pages/AirfareIndexPage';
import { RoutesPage } from '../pages/RoutesPage';
import { RouteDetailPage } from '../pages/RouteDetailPage';
import { AirlinesPage } from '../pages/AirlinesPage';
import { AnalyticsPage } from '../pages/AnalyticsPage';
import { CpiImpactPage } from '../pages/CpiImpactPage';
import { DataExplorerPage } from '../pages/DataExplorerPage';
import { DataSourcesPage } from '../pages/DataSourcesPage';
import { MethodologyPage } from '../pages/MethodologyPage';
import { SystemStatusPage } from '../pages/SystemStatusPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Shell />,
    children: [
      { index: true, element: <ExecutiveOverviewPage /> },
      { path: 'airfare-index', element: <AirfareIndexPage /> },
      { path: 'routes', element: <RoutesPage /> },
      { path: 'routes/:routeId', element: <RouteDetailPage /> },
      { path: 'airlines', element: <AirlinesPage /> },
      { path: 'analytics', element: <AnalyticsPage /> },
      { path: 'cpi-impact', element: <CpiImpactPage /> },
      { path: 'data-explorer', element: <DataExplorerPage /> },
      { path: 'data-sources', element: <DataSourcesPage /> },
      { path: 'methodology', element: <MethodologyPage /> },
      { path: 'status', element: <SystemStatusPage /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]);

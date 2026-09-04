import React from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { StatCard } from '../components/common/StatCard';
import { EmptyState } from '../components/common/EmptyState';
import { Layers, Activity, Route, ShieldCheck, Database, Calendar } from 'lucide-react';

export function DashboardPage() {
  return (
    <PageContainer
      title="PUSHPAK Domestic Airfare Intelligence"
      subtitle="National real-time domestic airfare price index platform — Smart India Hackathon 2026"
    >
      <div className="stats-grid">
        <StatCard
          title="Domestic Corridors"
          value="50"
          subtext="Target Indian routes"
          icon={Route}
        />
        <StatCard
          title="Advance Horizons"
          value="5"
          subtext="T+1, T+7, T+15, T+30, T+45"
          icon={Calendar}
        />
        <StatCard
          title="Index Aggregation"
          value="Jevons"
          subtext="Geometric elementary mean"
          icon={Activity}
        />
        <StatCard
          title="Active Milestone"
          value="Phase 1"
          subtext="Product Foundation"
          icon={Layers}
        />
      </div>

      <EmptyState
        icon={Layers}
        title="Product Foundation Active"
        description="The backend FastAPI REST service and frontend React analytics dashboard have been initialized. Phase 1 establishes project architecture, environment handling, PostgreSQL 18 connectivity, and client-side routing. Statistical calculation engines, web scrapers, and domain data models will be introduced in subsequent milestones following real dataset inspection."
        phase="Phase 1 - Product Foundation"
      />
    </PageContainer>
  );
}

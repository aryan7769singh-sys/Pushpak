import React from 'react';
import { Sparkline } from '../charts/Sparkline';

export function KpiCard({
  title,
  value,
  delta,
  deltaType = 'positive',
  subtext,
  badgeText,
  badgeType = 'info',
  sparklineData,
  sparklineColor = '#1e3a8a',
  highlight = false,
}) {
  return (
    <div className={`gov-kpi-card ${highlight ? 'highlight' : ''}`}>
      <div className="kpi-header">
        <span>{title}</span>
        {badgeText && (
          <span className={`gov-badge ${badgeType}`}>
            {badgeText}
          </span>
        )}
      </div>

      <div className="kpi-body">
        <div className="kpi-value">{value}</div>
        {sparklineData && (
          <Sparkline data={sparklineData} color={sparklineColor} width={70} height={22} />
        )}
      </div>

      <div className="kpi-footer">
        {delta && (
          <span className={`kpi-delta ${deltaType}`}>
            {delta}
          </span>
        )}
        <span style={{ fontSize: '11px', color: 'var(--text-subtle)', marginLeft: 'auto' }}>
          {subtext}
        </span>
      </div>
    </div>
  );
}

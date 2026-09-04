import React from 'react';

export function StatCard({ title, value, subtext, horizon, icon: Icon }) {
  return (
    <div className="stat-card">
      <div className="stat-header">
        <span>{title}</span>
        {Icon && <Icon size={16} style={{ color: 'var(--text-muted)' }} />}
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-footer">
        {horizon && (
          <span className={`horizon-pill ${horizon.toLowerCase().replace('+', '')}`}>
            {horizon}
          </span>
        )}
        {subtext && <span style={{ color: 'var(--text-secondary)' }}>{subtext}</span>}
      </div>
    </div>
  );
}

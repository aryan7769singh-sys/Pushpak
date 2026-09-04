import React from 'react';

export function EmptyState({ icon: Icon, title, description, phase = 'Phase 2 - Data & Schema' }) {
  return (
    <div className="empty-state-card">
      {Icon && (
        <div className="empty-state-icon">
          <Icon size={24} />
        </div>
      )}
      <span className="phase-pill">{phase}</span>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-desc">{description}</p>
    </div>
  );
}

import React from 'react';

export function StatusBadge({ status = 'HEALTHY', label }) {
  const norm = status.toLowerCase();
  let badgeClass = 'gov-badge ok';

  if (['ok', 'healthy', 'connected', 'confirmed', 'normal monitoring'].includes(norm)) {
    badgeClass = 'gov-badge ok';
  } else if (['warn', 'warning', 'degraded', 'surveillance active', 'high observation'].includes(norm)) {
    badgeClass = 'gov-badge warn';
  } else if (['alert', 'error', 'offline', 'unreachable', 'capacity deficit', 'anomaly'].includes(norm)) {
    badgeClass = 'gov-badge alert';
  } else {
    badgeClass = 'gov-badge info';
  }

  return (
    <span className={badgeClass}>
      <span className="pulse-dot" style={{
        width: '5px',
        height: '5px',
        background: 'currentColor',
        marginRight: '2px',
      }} />
      {label || status.toUpperCase()}
    </span>
  );
}

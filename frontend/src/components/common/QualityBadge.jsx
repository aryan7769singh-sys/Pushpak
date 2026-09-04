import React from 'react';

export function QualityBadge({ flag = 'STANDARD' }) {
  const normalized = flag.toUpperCase().trim();

  let className = 'gov-badge standard';
  if (normalized === 'HIGH OBSERVATION') {
    className = 'gov-badge high-observation';
  } else if (normalized === 'ANOMALY') {
    className = 'gov-badge anomaly';
  } else if (normalized === 'SOLD OUT' || normalized === 'LOW COVERAGE') {
    className = 'gov-badge sold-out';
  } else if (normalized === 'SIMULATION') {
    className = 'gov-badge simulation';
  }

  return (
    <span className={className}>
      {flag}
    </span>
  );
}

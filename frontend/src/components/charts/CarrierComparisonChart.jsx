import React from 'react';
import { AIRLINES } from '../../data/mockData';

export function CarrierComparisonChart({ carriers = AIRLINES }) {
  const maxFare = Math.max(...carriers.map(c => c.avgFare));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {carriers.map((carrier) => {
        const pct = (carrier.avgFare / maxFare) * 100;
        return (
          <div key={carrier.code} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11.5px' }}>
            <span style={{ width: '90px', fontWeight: 600, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {carrier.name}
            </span>
            <div style={{ flex: 1, background: '#f1f5f9', height: '14px', borderRadius: '2px', overflow: 'hidden', position: 'relative' }}>
              <div
                style={{
                  width: `${pct}%`,
                  height: '100%',
                  background: carrier.color || '#2563eb',
                  borderRadius: '2px',
                  transition: 'width 200ms ease',
                }}
              />
            </div>
            <span className="font-mono" style={{ width: '65px', textAlign: 'right', fontWeight: 700, color: 'var(--navy-dark)' }}>
              ₹{carrier.avgFare.toLocaleString()}
            </span>
            <span style={{ width: '45px', textAlign: 'right', color: 'var(--text-subtle)', fontSize: '10.5px' }}>
              {carrier.marketShare}%
            </span>
          </div>
        );
      })}
    </div>
  );
}

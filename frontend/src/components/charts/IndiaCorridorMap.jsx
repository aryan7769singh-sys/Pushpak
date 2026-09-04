import React, { useState } from 'react';
import { AIRPORTS, CORRIDORS } from '../../data/mockData';

export function IndiaCorridorMap({ onSelectCorridor, corridors = CORRIDORS }) {
  const [activeAirport, setActiveAirport] = useState(null);
  const [activeCorridor, setActiveCorridor] = useState(null);

  const width = 540;
  const height = 360;

  // Scale percentage coordinates to SVG viewBox
  const getAirportCoords = (code) => {
    const ap = AIRPORTS.find(a => a.code === code);
    if (!ap) return { x: 270, y: 180 };
    return {
      x: (ap.x / 100) * width,
      y: (ap.y / 100) * height,
    };
  };

  return (
    <div style={{ position: 'relative', width: '100%', background: '#ffffff', borderRadius: '3px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', padding: '0 4px' }}>
        <div style={{ fontSize: '11px', color: 'var(--text-subtle)' }}>
          Spatial topology of 50 high-density monitored corridors across Indian airspace
        </div>
        <div style={{ display: 'flex', gap: '10px', fontSize: '10.5px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#dc2626' }} />
            <span>Surge (&gt;+4%)</span>
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#2563eb' }} />
            <span>Normal</span>
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#16a34a' }} />
            <span>Deflating</span>
          </span>
        </div>
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '2px' }}>
        {/* Subtle decorative grid */}
        <defs>
          <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
            <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#f1f5f9" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width={width} height={height} fill="url(#grid)" />

        {/* Simplified India Geopolitical Boundary Outline / Shading */}
        <path
          d="M 180 50 L 220 30 L 240 70 L 290 85 L 340 100 L 440 110 L 480 135 L 420 160 L 400 180 L 360 210 L 290 320 L 240 330 L 200 310 L 170 260 L 140 200 L 130 160 L 160 110 Z"
          fill="#edf2f7"
          stroke="#cbd5e1"
          strokeWidth="1.2"
          opacity="0.85"
        />

        {/* Corridor Route Vectors */}
        {corridors.map((corridor) => {
          const origin = getAirportCoords(corridor.origin);
          const destCode = corridor.dest || corridor.destination;
          const dest = getAirportCoords(destCode);
          const corridorId = corridor.id || corridor.route_id;
          const changePct = corridor.changePct ?? corridor.change_pct ?? 0;

          // Control point for subtle curve
          const midX = (origin.x + dest.x) / 2;
          const midY = (origin.y + dest.y) / 2 - 15;

          const isHovered = (activeCorridor?.id || activeCorridor?.route_id) === corridorId;
          const strokeColor = changePct > 4 ? '#dc2626' : changePct < 0 ? '#16a34a' : '#2563eb';

          return (
            <path
              key={corridor.id}
              d={`M ${origin.x} ${origin.y} Q ${midX} ${midY} ${dest.x} ${dest.y}`}
              fill="none"
              stroke={strokeColor}
              strokeWidth={isHovered ? 2.8 : 1.2}
              strokeOpacity={isHovered ? 1 : 0.45}
              style={{ cursor: 'pointer', transition: 'all 120ms ease' }}
              onMouseEnter={() => setActiveCorridor(corridor)}
              onMouseLeave={() => setActiveCorridor(null)}
              onClick={() => onSelectCorridor && onSelectCorridor(corridor.id)}
            />
          );
        })}

        {/* Airport Hub Nodes */}
        {AIRPORTS.map((airport) => {
          const coords = getAirportCoords(airport.code);
          const isSelected = activeAirport?.code === airport.code;

          return (
            <g
              key={airport.code}
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setActiveAirport(airport)}
              onMouseLeave={() => setActiveAirport(null)}
            >
              <circle
                cx={coords.x}
                cy={coords.y}
                r={isSelected ? 6 : 4}
                fill={isSelected ? '#0f294a' : '#1e3a8a'}
                stroke="#ffffff"
                strokeWidth="1.5"
              />
              <text
                x={coords.x}
                y={coords.y - 7}
                fontSize="9.5"
                fontWeight="700"
                fill="#0f294a"
                textAnchor="middle"
                fontFamily="var(--font-mono)"
              >
                {airport.code}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Corridor Hover Inspector Overlay */}
      {activeCorridor && (
        <div
          style={{
            position: 'absolute',
            bottom: '10px',
            right: '10px',
            background: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: '2px',
            padding: '6px 10px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            fontSize: '11px',
            zIndex: 10,
          }}
        >
          <div style={{ fontWeight: 700, color: 'var(--navy-dark)' }}>
            {activeCorridor.origin} → {activeCorridor.dest || activeCorridor.destination} ({activeCorridor.sector})
          </div>
          <div style={{ display: 'flex', gap: '10px', marginTop: '2px', color: 'var(--text-subtle)' }}>
            <span>Avg: <strong style={{ color: '#0f172a' }}>₹{(activeCorridor.avgFare ?? activeCorridor.avg_fare ?? 0).toLocaleString()}</strong></span>
            <span>T+1: <strong style={{ color: '#dc2626' }}>₹{(activeCorridor.t1Fare ?? activeCorridor.t1_fare ?? 0).toLocaleString()}</strong></span>
            <span>Day: <strong style={{ color: (activeCorridor.changePct ?? activeCorridor.change_pct ?? 0) > 0 ? '#dc2626' : '#16a34a' }}>
              {(activeCorridor.changePct ?? activeCorridor.change_pct ?? 0) > 0 ? '+' : ''}{activeCorridor.changePct ?? activeCorridor.change_pct ?? 0}%
            </strong></span>
          </div>
        </div>
      )}
    </div>
  );
}

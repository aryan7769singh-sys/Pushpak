import React, { useState } from 'react';
import { HISTORICAL_INDEX_SERIES } from '../../data/mockData';

export function TimeSeriesChart({ series = HISTORICAL_INDEX_SERIES }) {
  const [filterMode, setFilterMode] = useState('both'); // 'headline' | 'core' | 'both'
  const [hoverIndex, setHoverIndex] = useState(null);

  const width = 640;
  const height = 220;
  const padding = { top: 20, right: 30, bottom: 30, left: 40 };

  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const allValues = [
    ...series.map(d => d.headline),
    ...series.map(d => d.core),
  ];
  const minVal = Math.floor(Math.min(...allValues) - 1);
  const maxVal = Math.ceil(Math.max(...allValues) + 1);
  const valRange = maxVal - minVal || 1;

  const getX = (idx) => padding.left + (idx / (series.length - 1)) * chartWidth;
  const getY = (val) => padding.top + chartHeight - ((val - minVal) / valRange) * chartHeight;

  const headlinePoints = series.map((d, i) => `${getX(i).toFixed(1)},${getY(d.headline).toFixed(1)}`).join(' ');
  const corePoints = series.map((d, i) => `${getX(i).toFixed(1)},${getY(d.core).toFixed(1)}`).join(' ');

  // Y-axis grid lines
  const yTicks = [minVal, minVal + Math.round(valRange / 2), maxVal];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            className={`gov-btn ${filterMode === 'both' ? 'gov-btn-primary' : ''}`}
            style={{ fontSize: '11px', height: '24px', padding: '0 8px' }}
            onClick={() => setFilterMode('both')}
          >
            All Indices
          </button>
          <button
            className={`gov-btn ${filterMode === 'headline' ? 'gov-btn-primary' : ''}`}
            style={{ fontSize: '11px', height: '24px', padding: '0 8px' }}
            onClick={() => setFilterMode('headline')}
          >
            Headline (124.5)
          </button>
          <button
            className={`gov-btn ${filterMode === 'core' ? 'gov-btn-primary' : ''}`}
            style={{ fontSize: '11px', height: '24px', padding: '0 8px' }}
            onClick={() => setFilterMode('core')}
          >
            Core (119.8)
          </button>
        </div>

        <div style={{ display: 'flex', gap: '14px', fontSize: '11px', color: 'var(--text-muted)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '12px', height: '3px', background: '#1e3a8a', display: 'inline-block' }} />
            <span>PUSHPAK Headline</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '12px', height: '3px', background: '#0284c7', display: 'inline-block' }} />
            <span>PUSHPAK Core</span>
          </div>
        </div>
      </div>

      <div style={{ position: 'relative', width: '100%', overflowX: 'auto' }}>
        <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto', minWidth: '480px' }}>
          {/* Y-Axis Grid Lines */}
          {yTicks.map((tick, i) => (
            <g key={i}>
              <line
                x1={padding.left}
                y1={getY(tick)}
                x2={width - padding.right}
                y2={getY(tick)}
                stroke="#e2e8f0"
                strokeDasharray="2 2"
              />
              <text
                x={padding.left - 8}
                y={getY(tick) + 3}
                fontSize="10"
                fill="#64748b"
                textAnchor="end"
                fontFamily="var(--font-mono)"
              >
                {tick.toFixed(1)}
              </text>
            </g>
          ))}

          {/* X-Axis Labels */}
          {series.map((d, i) => (
            <g key={i}>
              <line
                x1={getX(i)}
                y1={height - padding.bottom}
                x2={getX(i)}
                y2={height - padding.bottom + 4}
                stroke="#cbd5e1"
              />
              <text
                x={getX(i)}
                y={height - padding.bottom + 16}
                fontSize="10"
                fill="#64748b"
                textAnchor="middle"
                fontFamily="var(--font-mono)"
              >
                {d.date}
              </text>
            </g>
          ))}

          {/* Headline Line */}
          {(filterMode === 'both' || filterMode === 'headline') && (
            <>
              <polyline
                fill="none"
                stroke="#1e3a8a"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={headlinePoints}
              />
              {series.map((d, i) => (
                <circle
                  key={i}
                  cx={getX(i)}
                  cy={getY(d.headline)}
                  r={hoverIndex === i ? 4 : 2.5}
                  fill="#1e3a8a"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />
              ))}
            </>
          )}

          {/* Core Line */}
          {(filterMode === 'both' || filterMode === 'core') && (
            <>
              <polyline
                fill="none"
                stroke="#0284c7"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={corePoints}
              />
              {series.map((d, i) => (
                <circle
                  key={i}
                  cx={getX(i)}
                  cy={getY(d.core)}
                  r={hoverIndex === i ? 4 : 2.5}
                  fill="#0284c7"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />
              ))}
            </>
          )}

          {/* Hover interactive zones */}
          {series.map((d, i) => (
            <rect
              key={i}
              x={getX(i) - 20}
              y={padding.top}
              width="40"
              height={chartHeight}
              fill="transparent"
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHoverIndex(i)}
              onMouseLeave={() => setHoverIndex(null)}
            />
          ))}

          {/* Hover Indicator Line & Tooltip */}
          {hoverIndex !== null && (
            <g>
              <line
                x1={getX(hoverIndex)}
                y1={padding.top}
                x2={getX(hoverIndex)}
                y2={height - padding.bottom}
                stroke="#94a3b8"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
            </g>
          )}
        </svg>

        {hoverIndex !== null && (
          <div
            style={{
              position: 'absolute',
              top: '12px',
              left: `${(getX(hoverIndex) / width) * 100}%`,
              transform: 'translateX(-50%)',
              background: '#0f172a',
              color: '#ffffff',
              padding: '4px 8px',
              borderRadius: '2px',
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              pointerEvents: 'none',
              boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
              whiteSpace: 'nowrap',
              zIndex: 10,
            }}
          >
            <div><strong>{series[hoverIndex].date}</strong></div>
            <div style={{ color: '#93c5fd' }}>Headline: {series[hoverIndex].headline}</div>
            <div style={{ color: '#67e8f9' }}>Core: {series[hoverIndex].core}</div>
          </div>
        )}
      </div>
    </div>
  );
}

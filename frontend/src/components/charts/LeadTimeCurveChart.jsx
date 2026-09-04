import React from 'react';

export function LeadTimeCurveChart({
  data = [
    { horizon: 'T+1', fare: 11200, label: '24h Spot' },
    { horizon: 'T+7', fare: 6850, label: '7 Days' },
    { horizon: 'T+15', fare: 5400, label: '15 Days' },
    { horizon: 'T+30', fare: 4650, label: '30 Days' },
    { horizon: 'T+45', fare: 4200, label: '45 Days' },
  ],
  route = "DEL → BOM",
}) {
  const width = 500;
  const height = 180;
  const padding = { top: 20, right: 30, bottom: 30, left: 55 };

  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const fares = data.map(d => d.fare);
  const minFare = Math.floor(Math.min(...fares) * 0.9);
  const maxFare = Math.ceil(Math.max(...fares) * 1.05);
  const fareRange = maxFare - minFare || 1;

  const getX = (idx) => padding.left + (idx / (data.length - 1)) * chartWidth;
  const getY = (val) => padding.top + chartHeight - ((val - minFare) / fareRange) * chartHeight;

  const points = data.map((d, i) => `${getX(i).toFixed(1)},${getY(d.fare).toFixed(1)}`).join(' ');

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
        <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-subtle)' }}>
          Lead-Time Fare Decay Curve: {route}
        </span>
        <span style={{ fontSize: '10.5px', color: '#dc2626', fontWeight: 600 }}>
          Surge Premium: +{(((data[0].fare - data[data.length - 1].fare) / data[data.length - 1].fare) * 100).toFixed(0)}%
        </span>
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '2px' }}>
        {/* Y Grid */}
        {[minFare, Math.round((minFare + maxFare) / 2), maxFare].map((tick, i) => (
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
              x={padding.left - 6}
              y={getY(tick) + 3}
              fontSize="9.5"
              fill="#64748b"
              textAnchor="end"
              fontFamily="var(--font-mono)"
            >
              ₹{tick.toLocaleString()}
            </text>
          </g>
        ))}

        {/* X Labels */}
        {data.map((d, i) => (
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
              y={height - padding.bottom + 14}
              fontSize="10"
              fontWeight="600"
              fill="#0f294a"
              textAnchor="middle"
              fontFamily="var(--font-mono)"
            >
              {d.horizon}
            </text>
          </g>
        ))}

        {/* Shaded Area under Curve */}
        <polygon
          points={`${getX(0)},${height - padding.bottom} ${points} ${getX(data.length - 1)},${height - padding.bottom}`}
          fill="#eff6ff"
          opacity="0.8"
        />

        {/* Curve Line */}
        <polyline
          fill="none"
          stroke="#1e3a8a"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />

        {/* Data Point Dots and Values */}
        {data.map((d, i) => (
          <g key={i}>
            <circle
              cx={getX(i)}
              cy={getY(d.fare)}
              r={3.5}
              fill="#ffffff"
              stroke="#1e3a8a"
              strokeWidth="2"
            />
            <text
              x={getX(i)}
              y={getY(d.fare) - 7}
              fontSize="9"
              fontWeight="700"
              fill="#0f294a"
              textAnchor="middle"
              fontFamily="var(--font-mono)"
            >
              ₹{d.fare.toLocaleString()}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

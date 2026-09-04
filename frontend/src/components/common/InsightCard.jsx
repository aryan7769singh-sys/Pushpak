import React from 'react';
import { AlertCircle, TrendingUp, Database, Zap } from 'lucide-react';

export function InsightCard({ category, title, detail, time, level = 'info' }) {
  const getIcon = () => {
    switch (category) {
      case 'PRICE MOVEMENT': return <TrendingUp size={13} color="#2563eb" />;
      case 'MARKET STRUCTURE': return <Zap size={13} color="#d97706" />;
      case 'DATA QUALITY': return <Database size={13} color="#16a34a" />;
      default: return <AlertCircle size={13} color="#dc2626" />;
    }
  };

  const getBorderColor = () => {
    switch (level) {
      case 'warning': return '#fde68a';
      case 'anomaly': return '#fecaca';
      case 'healthy': return '#bbf7d0';
      default: return '#e2e8f0';
    }
  };

  return (
    <div
      style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderLeft: `3px solid ${getBorderColor() === '#e2e8f0' ? '#2563eb' : getBorderColor()}`,
        borderRadius: '2px',
        padding: '7px 9px',
        marginBottom: '6px',
        boxShadow: 'var(--shadow-subtle)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          {getIcon()}
          <span style={{ fontSize: '9.5px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-subtle)', letterSpacing: '0.04em' }}>
            {category}
          </span>
        </div>
        <span style={{ fontSize: '10px', color: 'var(--text-light)', fontFamily: 'var(--font-mono)' }}>
          {time}
        </span>
      </div>

      <div style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--text-main)', marginBottom: '2px' }}>
        {title}
      </div>
      <div style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: '1.4' }}>
        {detail}
      </div>
    </div>
  );
}

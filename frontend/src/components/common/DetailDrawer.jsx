import React from 'react';
import { X } from 'lucide-react';

export function DetailDrawer({ isOpen, onClose, title, subtitle, children }) {
  if (!isOpen) return null;

  return (
    <div className="gov-drawer-backdrop" onClick={onClose}>
      <div className="gov-drawer-content" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <div>
            <div className="drawer-title">{title || 'Observation Audit Inspector'}</div>
            {subtitle && (
              <div style={{ fontSize: '11px', color: '#93c5fd', marginTop: '1px' }}>
                {subtitle}
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#ffffff',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <X size={18} />
          </button>
        </div>
        <div className="drawer-body">
          {children}
        </div>
      </div>
    </div>
  );
}

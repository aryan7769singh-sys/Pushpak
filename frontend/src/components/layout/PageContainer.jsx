import React from 'react';

export function PageContainer({ title, subtitle, actions, children }) {
  return (
    <div className="page-scroll-area">
      <div className="page-header">
        <div className="page-title-row">
          <div>
            <h1 className="page-title">{title}</h1>
            {subtitle && <p className="page-subtitle">{subtitle}</p>}
          </div>
          {actions && <div>{actions}</div>}
        </div>
      </div>
      {children}
    </div>
  );
}

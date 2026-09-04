import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  TrendingUp,
  MapPin,
  Route,
  Plane,
  Activity,
  Scale,
  Database,
  Layers,
  BookOpen,
  Server,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

const NAV_GROUPS = [
  {
    group: "OVERVIEW",
    items: [
      { to: "/", label: "Executive Overview", icon: LayoutDashboard },
    ],
  },
  {
    group: "INDEX",
    items: [
      { to: "/airfare-index", label: "Airfare Index", icon: TrendingUp },
    ],
  },
  {
    group: "ROUTES",
    items: [
      { to: "/routes", label: "Routes", icon: MapPin },
      { to: "/routes/DEL-BOM", label: "Route Detail", icon: Route },
    ],
  },
  {
    group: "AIRLINES",
    items: [
      { to: "/airlines", label: "Airlines", icon: Plane },
    ],
  },
  {
    group: "ANALYTICS",
    items: [
      { to: "/analytics", label: "Analytics", icon: Activity },
      { to: "/cpi-impact", label: "CPI Impact", icon: Scale },
    ],
  },
  {
    group: "DATA",
    items: [
      { to: "/data-explorer", label: "Data Explorer", icon: Database },
      { to: "/data-sources", label: "Data Sources", icon: Layers },
    ],
  },
  {
    group: "DOCUMENTATION",
    items: [
      { to: "/methodology", label: "Methodology", icon: BookOpen },
    ],
  },
  {
    group: "SYSTEM",
    items: [
      { to: "/status", label: "System Status", icon: Server },
    ],
  },
];

export function Sidebar({ collapsed = false, onToggleCollapse }) {
  return (
    <aside className={`gov-sidebar ${collapsed ? 'collapsed' : ''}`}>
      {/* Sidebar Top Wordmark */}
      <div className="sidebar-brand">
        <div className="brand-emblem">P</div>
        {!collapsed && (
          <div className="brand-text">
            <span className="brand-title">PUSHPAK</span>
            <span className="brand-subtitle">Real-Time Airfare Price Index</span>
          </div>
        )}
      </div>

      {/* Nav Groups */}
      <nav className="sidebar-nav-container">
        {NAV_GROUPS.map((grp) => (
          <div key={grp.group}>
            {!collapsed && <div className="nav-group-header">{grp.group}</div>}
            {grp.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}
                title={collapsed ? item.label : undefined}
              >
                <item.icon size={15} style={{ flexShrink: 0 }} />
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* Sidebar Footer */}
      <div className="sidebar-footer">
        {!collapsed ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="pulse-dot" style={{ width: '6px', height: '6px' }} />
            <span style={{ fontWeight: 600, color: '#166534', fontSize: '11px' }}>
              System Healthy
            </span>
          </div>
        ) : (
          <span className="pulse-dot" style={{ width: '6px', height: '6px', margin: '0 auto' }} />
        )}

        <button
          className="sidebar-collapse-btn"
          onClick={onToggleCollapse}
          title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>
    </aside>
  );
}

import { NavLink, useLocation } from 'react-router-dom';
import type { ReactElement } from 'react';
import type { NavItem } from '../../types';

const NAV_ITEMS: NavItem[] = [
  { id: 'overview',    label: 'Overview',         path: '/',                  icon: 'overview',   group: 'main' },
  { id: 'repository',  label: 'Repository',        path: '/repository',        icon: 'repo',       group: 'main' },
  { id: 'codemap',     label: 'Code Map',           path: '/code-map',          icon: 'map',        group: 'main' },
  { id: 'simulator',   label: 'Change Simulator',  path: '/simulator',         icon: 'simulate',   group: 'analysis' },
  { id: 'impact',      label: 'Impact Analysis',   path: '/impact',            icon: 'impact',     group: 'analysis' },
  { id: 'risk',        label: 'Risk Center',        path: '/risk',              icon: 'risk',       group: 'analysis' },
  { id: 'tests',       label: 'Test Impact',        path: '/tests',             icon: 'test',       group: 'analysis' },
  { id: 'scenarios',   label: 'Scenario Compare',  path: '/scenarios',         icon: 'compare',    group: 'analysis' },
  { id: 'release',     label: 'Release Gate',       path: '/release',           icon: 'release',    group: 'delivery' },
  { id: 'reports',     label: 'Reports',            path: '/reports',           icon: 'report',     group: 'delivery' },
  { id: 'settings',    label: 'Settings',           path: '/settings',          icon: 'settings',   group: 'system' },
];

const GROUPS: { id: string; label: string }[] = [
  { id: 'main',     label: 'Workspace' },
  { id: 'analysis', label: 'Analysis' },
  { id: 'delivery', label: 'Delivery' },
  { id: 'system',   label: 'System' },
];

function NavIcon({ icon }: { icon: string }) {
  const icons: Record<string, ReactElement> = {
    overview: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
    repo: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path d="M3 3h18v18H3z" rx="2" />
        <path d="M3 9h18M9 21V9" />
      </svg>
    ),
    map: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <circle cx="7" cy="7" r="3" />
        <circle cx="17" cy="7" r="3" />
        <circle cx="12" cy="17" r="3" />
        <line x1="10" y1="7" x2="14" y2="7" />
        <line x1="9" y1="10" x2="12" y2="14" />
        <line x1="15" y1="10" x2="12" y2="14" />
      </svg>
    ),
    simulate: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <polygon points="5,3 19,12 5,21" />
      </svg>
    ),
    impact: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <circle cx="12" cy="12" r="3" />
        <circle cx="12" cy="12" r="7" />
        <circle cx="12" cy="12" r="11" />
      </svg>
    ),
    risk: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path d="M12 2L2 19h20z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <circle cx="12" cy="16" r="0.5" fill="currentColor" />
      </svg>
    ),
    test: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path d="M9 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-4" />
        <path d="M13 3h8v8" />
        <path d="M21 3l-9 9" />
      </svg>
    ),
    compare: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <line x1="12" y1="3" x2="12" y2="21" />
        <path d="M5 6l7-3 7 3" />
        <path d="M5 18l7 3 7-3" />
      </svg>
    ),
    release: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path d="M9 12l2 2 4-4" />
        <circle cx="12" cy="12" r="9" />
      </svg>
    ),
    report: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
      </svg>
    ),
    settings: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
      </svg>
    ),
  };
  return icons[icon] ?? null;
}

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-60 flex-shrink-0 bg-surface-200 border-r border-border flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-border flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-md bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
            <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
              <path d="M4 18 L9 10 L13 15 L17 8" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="17" cy="8" r="2" fill="white"/>
            </svg>
          </div>
          <div>
            <span className="text-sm font-bold text-text-primary tracking-tight">DevPulse</span>
            <p className="text-2xs text-text-muted leading-tight">Change Intelligence</p>
          </div>
        </div>
      </div>

      {/* Active change banner */}
      <div className="mx-3 mt-3 p-2.5 rounded-md bg-emerald-500/8 border border-emerald-500/20 flex-shrink-0">
        <div className="flex items-center gap-1.5 mb-1">
          <span className="dot-pulse" />
          <span className="text-2xs font-semibold text-emerald-400 uppercase tracking-wider">Active Change</span>
        </div>
        <p className="text-xs text-text-secondary font-mono truncate">Payment timeout 30s → 60s</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        {GROUPS.map((group) => {
          const items = NAV_ITEMS.filter(i => i.group === group.id);
          return (
            <div key={group.id} className="mb-4">
              <p className="section-title px-2 mb-1.5">{group.label}</p>
              {items.map((item) => {
                const isActive = item.path === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(item.path);
                return (
                  <NavLink
                    key={item.id}
                    to={item.path}
                    className={({ isActive: navActive }) =>
                      `nav-item ${navActive || isActive ? 'nav-item-active' : ''}`
                    }
                    end={item.path === '/'}
                  >
                    <span className={isActive ? 'text-emerald-400' : 'text-text-muted'}>
                      <NavIcon icon={item.icon} />
                    </span>
                    <span>{item.label}</span>
                    {item.badge != null && (
                      <span className="ml-auto text-2xs bg-surface-100 border border-border rounded px-1.5 py-0.5 text-text-muted font-mono">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-border flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-600 flex items-center justify-center text-2xs font-bold text-white flex-shrink-0">
            A
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-text-primary truncate">Acme Team</p>
            <p className="text-2xs text-text-muted truncate">Free plan</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

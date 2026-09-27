import { useLocation } from 'react-router-dom';
import StatusBadge from '../ui/StatusBadge';

const PAGE_META: Record<string, { title: string; description: string }> = {
  '/':           { title: 'Overview',          description: 'Repository health at a glance' },
  '/repository': { title: 'Repository',         description: 'Acme Payment Service · Python · 32 files' },
  '/code-map':   { title: 'Code Map',            description: 'Dependency graph and module structure' },
  '/simulator':  { title: 'Change Simulator',   description: 'Describe and simulate proposed changes' },
  '/impact':     { title: 'Impact Analysis',    description: 'Affected files, modules, and call paths' },
  '/risk':       { title: 'Risk Center',         description: 'Risk factors and mitigation strategies' },
  '/tests':      { title: 'Test Impact',         description: 'Test recommendations and execution' },
  '/scenarios':  { title: 'Scenario Compare',   description: 'Compare multiple change scenarios side-by-side' },
  '/release':    { title: 'Release Gate',        description: 'Pre-release safety checks and blockers' },
  '/reports':    { title: 'Reports',             description: 'Impact reports and change history' },
  '/settings':   { title: 'Settings',            description: 'Repository configuration and preferences' },
};

export default function Header() {
  const location = useLocation();
  const meta = PAGE_META[location.pathname] ?? PAGE_META['/'];

  return (
    <header className="h-14 border-b border-border bg-surface-200/60 backdrop-blur-sm flex items-center justify-between px-6 flex-shrink-0 sticky top-0 z-20">
      {/* Left: breadcrumb + title */}
      <div className="flex items-center gap-3 min-w-0">
        <div>
          <h1 className="text-sm font-semibold text-text-primary leading-tight">{meta.title}</h1>
          <p className="text-xs text-text-muted leading-tight hidden sm:block">{meta.description}</p>
        </div>
      </div>

      {/* Right: repo status + actions */}
      <div className="flex items-center gap-3 flex-shrink-0">
        {/* Repository badge */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-md bg-surface-100 border border-border">
          <svg className="w-3.5 h-3.5 text-text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" />
          </svg>
          <span className="text-xs text-text-secondary font-medium">Acme Payment Service</span>
        </div>

        <StatusBadge status="complete" label="Analyzed" />

        {/* Notification bell */}
        <button className="btn-ghost p-2 relative">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
          </svg>
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-risk-high rounded-full" />
        </button>
      </div>
    </header>
  );
}

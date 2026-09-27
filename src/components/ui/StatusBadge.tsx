import type { AnalysisStatus } from '../../types';

interface StatusBadgeProps {
  status: AnalysisStatus | 'active' | 'idle' | 'running' | 'pass' | 'fail' | 'warn' | 'skip';
  label?: string;
  pulse?: boolean;
}

const CONFIG: Record<string, { label: string; classes: string; dotClass: string }> = {
  complete:  { label: 'Analyzed',  classes: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20', dotClass: 'bg-emerald-400' },
  analyzing: { label: 'Analyzing', classes: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20',         dotClass: 'bg-cyan-400 animate-pulse' },
  pending:   { label: 'Pending',   classes: 'bg-surface-100 text-text-secondary border border-border',         dotClass: 'bg-text-muted' },
  error:     { label: 'Error',     classes: 'bg-risk-critical/10 text-risk-critical border border-risk-critical/20', dotClass: 'bg-risk-critical' },
  active:    { label: 'Active',    classes: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20', dotClass: 'bg-emerald-400 animate-pulse-dot' },
  idle:      { label: 'Idle',      classes: 'bg-surface-100 text-text-muted border border-border',             dotClass: 'bg-text-muted' },
  running:   { label: 'Running',   classes: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20',         dotClass: 'bg-cyan-400 animate-pulse' },
  pass:      { label: 'Pass',      classes: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20', dotClass: 'bg-emerald-400' },
  fail:      { label: 'Fail',      classes: 'bg-risk-critical/10 text-risk-critical border border-risk-critical/20', dotClass: 'bg-risk-critical' },
  warn:      { label: 'Warn',      classes: 'bg-risk-medium/10 text-risk-medium border border-risk-medium/20', dotClass: 'bg-risk-medium' },
  skip:      { label: 'Skip',      classes: 'bg-surface-100 text-text-muted border border-border',             dotClass: 'bg-text-muted' },
};

export default function StatusBadge({ status, label, pulse }: StatusBadgeProps) {
  const cfg = CONFIG[status] ?? CONFIG['idle'];
  const displayLabel = label ?? cfg.label;
  const dotClass = pulse ? cfg.dotClass + ' animate-pulse-dot' : cfg.dotClass;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium uppercase tracking-wider ${cfg.classes}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dotClass}`} />
      {displayLabel}
    </span>
  );
}

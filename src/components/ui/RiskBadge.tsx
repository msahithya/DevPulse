import type { RiskLevel } from '../../types';

interface RiskBadgeProps {
  level: RiskLevel;
  showLabel?: boolean;
  size?: 'sm' | 'md';
}

const CONFIG: Record<RiskLevel, { label: string; classes: string; dot: string }> = {
  critical: {
    label: 'Critical',
    classes: 'bg-risk-critical/10 text-risk-critical border border-risk-critical/20',
    dot: 'bg-risk-critical',
  },
  high: {
    label: 'High',
    classes: 'bg-risk-high/10 text-risk-high border border-risk-high/20',
    dot: 'bg-risk-high',
  },
  medium: {
    label: 'Medium',
    classes: 'bg-risk-medium/10 text-risk-medium border border-risk-medium/20',
    dot: 'bg-risk-medium',
  },
  low: {
    label: 'Low',
    classes: 'bg-risk-low/10 text-risk-low border border-risk-low/20',
    dot: 'bg-risk-low',
  },
  none: {
    label: 'None',
    classes: 'bg-surface-100 text-text-muted border border-border',
    dot: 'bg-text-muted',
  },
};

export default function RiskBadge({ level, showLabel = true, size = 'md' }: RiskBadgeProps) {
  const cfg = CONFIG[level];
  const textSize = size === 'sm' ? 'text-2xs' : 'text-xs';
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded font-medium uppercase tracking-wider ${textSize} ${cfg.classes}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
      {showLabel && cfg.label}
    </span>
  );
}

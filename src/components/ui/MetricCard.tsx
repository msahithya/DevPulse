import type { ReactNode } from 'react';

interface MetricCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  icon?: ReactNode;
  accent?: 'emerald' | 'cyan' | 'default';
  trend?: { value: string; up?: boolean };
  className?: string;
}

export default function MetricCard({
  label,
  value,
  subValue,
  icon,
  accent = 'default',
  trend,
  className = '',
}: MetricCardProps) {
  const accentBorder = accent === 'emerald'
    ? 'border-l-emerald-500'
    : accent === 'cyan'
    ? 'border-l-cyan-500'
    : 'border-l-transparent';

  return (
    <div className={`card border-l-2 ${accentBorder} animate-fade-in ${className}`}>
      <div className="card-body">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="label mb-2">{label}</p>
            <p className="text-2xl font-semibold text-text-primary font-mono tracking-tight">
              {value}
            </p>
            {subValue && (
              <p className="text-xs text-text-muted mt-1">{subValue}</p>
            )}
            {trend && (
              <p className={`text-xs mt-1.5 font-medium ${trend.up === false ? 'text-risk-high' : 'text-emerald-400'}`}>
                {trend.up === false ? '↓' : '↑'} {trend.value}
              </p>
            )}
          </div>
          {icon && (
            <div className="w-9 h-9 rounded-md bg-surface-100 border border-border flex items-center justify-center text-text-secondary flex-shrink-0">
              {icon}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

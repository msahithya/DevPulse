interface CodeViewerProps {
  content: string;
  language?: string;
  filename?: string;
  highlightLines?: number[];
  maxHeight?: string;
}

interface TimelineStepProps {
  step: number;
  label: string;
  description?: string;
  status: 'complete' | 'active' | 'pending';
  last?: boolean;
}

interface DependencyNodeProps {
  name: string;
  type: string;
  module?: string;
  selected?: boolean;
  affected?: boolean;
  onClick?: () => void;
}

interface ImpactNodeProps {
  name: string;
  impactType: 'direct' | 'transitive' | 'test';
  riskLevel: string;
  reason?: string;
  onClick?: () => void;
}

export function CodeViewer({ content, language = 'python', filename, highlightLines = [], maxHeight = '400px' }: CodeViewerProps) {
  const lines = content.split('\n');

  return (
    <div className="rounded-md border border-border overflow-hidden bg-surface-300">
      {/* Header */}
      {filename && (
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-surface-200">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-risk-critical/60" />
            <span className="w-2.5 h-2.5 rounded-full bg-risk-medium/60" />
            <span className="w-2.5 h-2.5 rounded-full bg-risk-low/60" />
          </div>
          <span className="font-mono text-xs text-text-secondary ml-1">{filename}</span>
          <span className="ml-auto text-2xs text-text-muted uppercase tracking-wider">{language}</span>
        </div>
      )}
      {/* Code */}
      <div className="overflow-auto" style={{ maxHeight }}>
        <table className="w-full text-sm">
          <tbody>
            {lines.map((line, idx) => {
              const lineNum = idx + 1;
              const isHighlighted = highlightLines.includes(lineNum);
              return (
                <tr
                  key={idx}
                  className={`${isHighlighted ? 'bg-emerald-500/10 border-l-2 border-l-emerald-500' : ''}`}
                >
                  <td className="px-4 py-0 text-right text-text-muted font-mono text-xs select-none w-12 border-r border-border/50">
                    {lineNum}
                  </td>
                  <td className="px-4 py-0.5 font-mono text-xs text-text-code whitespace-pre">
                    {line}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function TimelineStep({ step, label, description, status, last = false }: TimelineStepProps) {
  const circleClass = {
    complete: 'bg-emerald-500 border-emerald-500 text-surface-400',
    active: 'bg-cyan-500 border-cyan-500 text-surface-400 shadow-glow-cyan',
    pending: 'bg-surface-200 border-border text-text-muted',
  }[status];

  const lineClass = {
    complete: 'border-emerald-500/40',
    active: 'border-cyan-500/20',
    pending: 'border-border',
  }[status];

  const labelClass = {
    complete: 'text-text-primary',
    active: 'text-cyan-400',
    pending: 'text-text-muted',
  }[status];

  return (
    <div className="flex gap-4">
      {/* Step indicator */}
      <div className="flex flex-col items-center">
        <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold flex-shrink-0 ${circleClass}`}>
          {status === 'complete' ? (
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : step}
        </div>
        {!last && <div className={`w-px flex-1 mt-1 border-l-2 min-h-[24px] ${lineClass}`} />}
      </div>
      {/* Content */}
      <div className="pb-6 flex-1">
        <p className={`text-sm font-medium ${labelClass}`}>{label}</p>
        {description && <p className="text-xs text-text-muted mt-0.5">{description}</p>}
      </div>
    </div>
  );
}

export function DependencyNode({ name, type, module, selected, affected, onClick }: DependencyNodeProps) {
  const baseClass = 'rounded-md border px-3 py-2 transition-all duration-150';
  const stateClass = selected
    ? 'border-emerald-500 bg-emerald-500/10 shadow-glow-emerald'
    : affected
    ? 'border-risk-high/40 bg-risk-high/5'
    : 'border-border bg-surface-100 hover:border-border-bright';

  return (
    <div
      onClick={onClick}
      className={`${baseClass} ${stateClass} ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className="font-mono text-xs font-medium text-text-primary">{name}</div>
      <div className="flex items-center gap-1.5 mt-0.5">
        <span className="text-2xs text-text-muted capitalize">{type}</span>
        {module && (
          <>
            <span className="text-border">·</span>
            <span className="text-2xs text-text-muted">{module}</span>
          </>
        )}
      </div>
    </div>
  );
}

export function ImpactNode({ name, impactType, riskLevel, reason, onClick }: ImpactNodeProps) {
  const typeColor = impactType === 'direct'
    ? 'text-risk-high'
    : impactType === 'transitive'
    ? 'text-risk-medium'
    : 'text-purple-400';

  const typeBorder = impactType === 'direct'
    ? 'border-risk-high/30'
    : impactType === 'transitive'
    ? 'border-risk-medium/30'
    : 'border-purple-500/30';

  return (
    <div
      onClick={onClick}
      className={`rounded-md border bg-surface-100 ${typeBorder} px-3 py-2.5 transition-all duration-150 ${onClick ? 'cursor-pointer hover:bg-surface-200' : ''}`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-xs font-medium text-text-primary">{name}</span>
        <span className={`text-2xs font-medium uppercase tracking-wider ${typeColor}`}>{impactType}</span>
      </div>
      {reason && (
        <p className="text-2xs text-text-muted mt-1 line-clamp-2">{reason}</p>
      )}
      <div className="mt-1.5 flex items-center gap-1">
        <span className="text-2xs text-text-muted">Risk:</span>
        <span className={`text-2xs font-semibold uppercase ${
          riskLevel === 'critical' ? 'text-risk-critical' :
          riskLevel === 'high' ? 'text-risk-high' :
          riskLevel === 'medium' ? 'text-risk-medium' :
          riskLevel === 'low' ? 'text-risk-low' : 'text-text-muted'
        }`}>{riskLevel}</span>
      </div>
    </div>
  );
}

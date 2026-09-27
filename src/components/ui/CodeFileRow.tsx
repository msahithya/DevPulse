import type { CodeFile, FileType } from '../../types';
import RiskBadge from './RiskBadge';

interface CodeFileRowProps {
  file: CodeFile;
  selected?: boolean;
  onClick?: (file: CodeFile) => void;
  showRisk?: boolean;
  showMeta?: boolean;
  className?: string;
}

const FILE_ICONS: Record<FileType, string> = {
  service:  '⚙',
  api:      '🔌',
  model:    '📦',
  test:     '🧪',
  utility:  '🔧',
  config:   '📄',
  database: '🗄',
};

const FILE_COLORS: Record<FileType, string> = {
  service:  'text-cyan-400',
  api:      'text-emerald-400',
  model:    'text-blue-400',
  test:     'text-purple-400',
  utility:  'text-yellow-400',
  config:   'text-text-secondary',
  database: 'text-orange-400',
};

export default function CodeFileRow({
  file,
  selected = false,
  onClick,
  showRisk = true,
  showMeta = true,
  className = '',
}: CodeFileRowProps) {
  return (
    <div
      onClick={() => onClick?.(file)}
      className={`
        flex items-center gap-3 px-4 py-3 border-b border-border last:border-b-0
        transition-colors duration-100 group
        ${onClick ? 'cursor-pointer hover:bg-surface-100' : ''}
        ${selected ? 'bg-surface-100 border-l-2 border-l-emerald-500' : ''}
        ${className}
      `}
    >
      {/* Icon */}
      <span className={`text-base w-5 text-center flex-shrink-0 ${FILE_COLORS[file.type]}`}>
        {FILE_ICONS[file.type]}
      </span>

      {/* Name + path */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm text-text-primary font-medium truncate">
            {file.name}
          </span>
        </div>
        {showMeta && (
          <p className="text-xs text-text-muted mt-0.5 truncate">{file.path}</p>
        )}
      </div>

      {/* Meta */}
      <div className="flex items-center gap-3 flex-shrink-0">
        {showMeta && (
          <div className="hidden sm:flex items-center gap-3 text-xs text-text-muted font-mono">
            <span>{file.lines}L</span>
            <span className="text-border">|</span>
            <span className="capitalize text-text-secondary">{file.type}</span>
          </div>
        )}
        {showRisk && file.riskLevel !== 'none' && (
          <RiskBadge level={file.riskLevel} size="sm" />
        )}
      </div>
    </div>
  );
}

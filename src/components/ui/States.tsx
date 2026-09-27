import type { ReactNode } from 'react';

interface LoadingStateProps {
  message?: string;
  subMessage?: string;
  size?: 'sm' | 'md' | 'lg';
}

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

interface EmptyStateProps {
  title?: string;
  message?: string;
  action?: ReactNode;
  icon?: ReactNode;
}

export function LoadingState({ message = 'Loading…', subMessage, size = 'md' }: LoadingStateProps) {
  const containerClass = size === 'sm'
    ? 'py-8'
    : size === 'lg'
    ? 'py-24'
    : 'py-16';

  return (
    <div className={`flex flex-col items-center justify-center ${containerClass} gap-4`}>
      {/* Spinner */}
      <div className="relative">
        <div className="w-8 h-8 rounded-full border-2 border-border animate-spin border-t-emerald-500" />
      </div>
      <div className="text-center">
        <p className="text-sm text-text-secondary">{message}</p>
        {subMessage && <p className="text-xs text-text-muted mt-1">{subMessage}</p>}
      </div>
    </div>
  );
}

export function ErrorState({ title = 'Something went wrong', message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <div className="w-10 h-10 rounded-full bg-risk-critical/10 border border-risk-critical/20 flex items-center justify-center">
        <svg className="w-5 h-5 text-risk-critical" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-text-primary">{title}</p>
        {message && <p className="text-xs text-text-muted mt-1">{message}</p>}
      </div>
      {onRetry && (
        <button onClick={onRetry} className="btn-secondary text-xs">
          Try again
        </button>
      )}
    </div>
  );
}

export function EmptyState({ title = 'Nothing here yet', message, action, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      {icon && (
        <div className="w-10 h-10 rounded-full bg-surface-100 border border-border flex items-center justify-center text-text-muted">
          {icon}
        </div>
      )}
      <div className="text-center">
        <p className="text-sm font-medium text-text-secondary">{title}</p>
        {message && <p className="text-xs text-text-muted mt-1 max-w-sm">{message}</p>}
      </div>
      {action}
    </div>
  );
}

import type { ReactNode } from 'react';
import { useEffect } from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  width?: 'sm' | 'md' | 'lg' | 'xl';
}

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  side?: 'right' | 'left';
  width?: string;
}

export function Modal({ open, onClose, title, children, width = 'md' }: ModalProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!open) return null;

  const widthClass = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' }[width];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-surface-400/80 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Panel */}
      <div className={`relative z-10 w-full ${widthClass} card shadow-2xl animate-fade-in`}>
        {title && (
          <div className="card-header flex items-center justify-between">
            <h2 className="text-sm font-semibold text-text-primary">{title}</h2>
            <button onClick={onClose} className="btn-ghost p-1.5 -mr-1.5">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        <div className="card-body">{children}</div>
      </div>
    </div>
  );
}

export function Drawer({ open, onClose, title, children, side = 'right', width = 'w-[480px]' }: DrawerProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!open) return null;

  const slideClass = side === 'right'
    ? 'right-0 translate-x-0'
    : 'left-0 -translate-x-0';

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-surface-400/60 backdrop-blur-sm" onClick={onClose} />
      <div className={`absolute top-0 bottom-0 ${slideClass} ${width} bg-surface-200 border-l border-border flex flex-col shadow-2xl animate-slide-in`}>
        {title && (
          <div className="flex items-center justify-between px-5 py-4 border-b border-border flex-shrink-0">
            <h2 className="text-sm font-semibold text-text-primary">{title}</h2>
            <button onClick={onClose} className="btn-ghost p-1.5 -mr-1.5">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  );
}

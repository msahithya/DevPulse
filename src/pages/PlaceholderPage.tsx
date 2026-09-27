import { useNavigate } from 'react-router-dom';

interface PlaceholderPageProps {
  title: string;
  message: string;
  icon: string;
}

export default function PlaceholderPage({ title, message, icon: _icon }: PlaceholderPageProps) {
  const navigate = useNavigate();

  return (
    <div className="p-8 flex flex-col items-center justify-center min-h-[60vh] gap-6">
      {/* Icon */}
      <div className="w-14 h-14 rounded-xl bg-surface-100 border border-border flex items-center justify-center">
        <svg className="w-7 h-7 text-text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <rect x="3" y="3" width="18" height="18" rx="3" />
          <path d="M3 9h18M9 21V9" />
        </svg>
      </div>

      {/* Text */}
      <div className="text-center max-w-md">
        <h2 className="text-lg font-semibold text-text-primary mb-2">{title}</h2>
        <p className="text-sm text-text-secondary leading-relaxed">{message}</p>
      </div>

      {/* CTA */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/simulator')}
          className="btn-primary"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <polygon points="5,3 19,12 5,21" />
          </svg>
          Open Change Simulator
        </button>
        <button onClick={() => navigate('/')} className="btn-secondary">
          Back to Overview
        </button>
      </div>

      {/* Coming soon hint */}
      <div className="mt-4 px-4 py-2.5 rounded-md bg-surface-100 border border-border">
        <p className="text-xs text-text-muted text-center">
          This section will be populated after the first simulation is run.
        </p>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MetricCard from '../components/ui/MetricCard';
import StatusBadge from '../components/ui/StatusBadge';
import RiskBadge from '../components/ui/RiskBadge';
import { TimelineStep } from '../components/ui/DevComponents';
import { LoadingState } from '../components/ui/States';
import { DEMO_REPOSITORY, DEMO_PROPOSED_CHANGE, DEMO_SIMULATION_RESULT } from '../data/demoData';

const WORKFLOW_STEPS = [
  { label: 'Repository',        description: 'Acme Payment Service — 32 files, 8 modules' },
  { label: 'Analyze Codebase',  description: 'Dependency graph built, complexity scored' },
  { label: 'Select File',       description: 'payment_service.py' },
  { label: 'Describe Change',   description: 'Increase payment timeout from 30s to 60s' },
  { label: 'Simulate Change',   description: 'DEMO ANALYSIS — blast radius computed' },
  { label: 'Blast Radius',      description: '7 files · 5 modules affected' },
  { label: 'Risk Analysis',     description: 'HIGH risk · score 68/100' },
  { label: 'Recommended Tests', description: '6 tests identified · 2 require updates' },
];

export default function OverviewPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  if (loading) return <LoadingState message="Loading workspace…" />;

  const repo = DEMO_REPOSITORY;
  const change = DEMO_PROPOSED_CHANGE;
  const sim = DEMO_SIMULATION_RESULT;

  return (
    <div className="p-6 space-y-6 animate-fade-in">

      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-text-primary">Workspace Overview</h2>
          <p className="text-sm text-text-secondary mt-0.5">
            Acme Payment Service · Last analyzed {new Date(repo.analyzedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <StatusBadge status="complete" label="Analyzed" />
          <button
            onClick={() => navigate('/simulator')}
            className="btn-primary"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <polygon points="5,3 19,12 5,21" />
            </svg>
            Simulate Change
          </button>
        </div>
      </div>

      {/* Metrics row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <MetricCard
          label="Repository"
          value="Acme Payment"
          subValue="Python · Active"
          accent="emerald"
          icon={<svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" /></svg>}
        />
        <MetricCard
          label="Files"
          value={repo.stats.totalFiles}
          subValue="Source + tests"
          icon={<svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z" /><polyline points="13 2 13 9 20 9" /></svg>}
        />
        <MetricCard
          label="Modules"
          value={repo.stats.totalModules}
          subValue="Logical groups"
          accent="cyan"
          icon={<svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>}
        />
        <MetricCard
          label="Dependencies"
          value={repo.stats.totalDependencies}
          subValue="Import edges"
          icon={<svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><circle cx="6" cy="12" r="3" /><circle cx="18" cy="5" r="3" /><circle cx="18" cy="19" r="3" /><line x1="9" y1="11" x2="15" y2="6.5" /><line x1="9" y1="13" x2="15" y2="17.5" /></svg>}
        />
        <MetricCard
          label="Tests"
          value={repo.stats.totalTests}
          subValue="Test files"
          icon={<svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M9 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-4" /><path d="M13 3h8v8" /><path d="M21 3l-9 9" /></svg>}
        />
      </div>

      {/* Main two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Workflow timeline */}
        <div className="card lg:col-span-1">
          <div className="card-header">
            <p className="text-sm font-semibold text-text-primary">Core Workflow</p>
            <p className="text-xs text-text-muted mt-0.5">DevPulse change intelligence pipeline</p>
          </div>
          <div className="card-body">
            {WORKFLOW_STEPS.map((step, idx) => (
              <TimelineStep
                key={idx}
                step={idx + 1}
                label={step.label}
                description={step.description}
                status={idx < 5 ? 'complete' : idx === 5 ? 'active' : 'pending'}
                last={idx === WORKFLOW_STEPS.length - 1}
              />
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="lg:col-span-2 space-y-4">

          {/* Active change card */}
          <div className="card border-emerald-500/20 bg-gradient-to-b from-emerald-500/5 to-transparent">
            <div className="card-header flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="dot-pulse" />
                <p className="text-sm font-semibold text-text-primary">Active Proposed Change</p>
              </div>
              <button onClick={() => navigate('/simulator')} className="btn-ghost text-xs py-1 px-2">
                Edit →
              </button>
            </div>
            <div className="card-body space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <p className="text-sm font-medium text-emerald-400 font-mono">{change.title}</p>
                  <p className="text-xs text-text-secondary mt-1 leading-relaxed">{change.description}</p>
                </div>
                <RiskBadge level={sim.riskSummary.overall} />
              </div>
              <div className="flex items-center gap-4 pt-1 border-t border-border">
                <div className="text-center">
                  <p className="text-base font-mono font-semibold text-text-primary">{sim.blastRadius.totalFiles}</p>
                  <p className="text-2xs text-text-muted">Files affected</p>
                </div>
                <div className="text-center">
                  <p className="text-base font-mono font-semibold text-text-primary">{sim.blastRadius.totalModules}</p>
                  <p className="text-2xs text-text-muted">Modules</p>
                </div>
                <div className="text-center">
                  <p className="text-base font-mono font-semibold text-risk-high">{sim.riskSummary.score}</p>
                  <p className="text-2xs text-text-muted">Risk score</p>
                </div>
                <div className="text-center">
                  <p className="text-base font-mono font-semibold text-risk-medium">{sim.blastRadius.coverageGap}%</p>
                  <p className="text-2xs text-text-muted">Coverage gap</p>
                </div>
                <div className="ml-auto">
                  <StatusBadge status="fail" label="Not Release-Ready" />
                </div>
              </div>
            </div>
          </div>

          {/* Release gates summary */}
          <div className="card">
            <div className="card-header flex items-center justify-between">
              <p className="text-sm font-semibold text-text-primary">Release Gates</p>
              <button onClick={() => navigate('/release')} className="btn-ghost text-xs py-1 px-2">View all →</button>
            </div>
            <div className="divide-y divide-border">
              {sim.releaseReadiness.gates.map((gate, idx) => (
                <div key={idx} className="flex items-center justify-between px-5 py-3">
                  <span className="text-sm text-text-secondary">{gate.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-text-muted hidden sm:block">{gate.message}</span>
                    <StatusBadge status={gate.status} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Risk factors mini */}
          <div className="card">
            <div className="card-header flex items-center justify-between">
              <p className="text-sm font-semibold text-text-primary">Risk Factors</p>
              <button onClick={() => navigate('/risk')} className="btn-ghost text-xs py-1 px-2">Analyze →</button>
            </div>
            <div className="card-body space-y-3">
              {sim.riskSummary.factors.map((factor, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-text-secondary">{factor.name}</span>
                      <span className="text-xs font-mono text-text-muted">{factor.score}/100</span>
                    </div>
                    <div className="h-1 bg-surface-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          factor.level === 'critical' ? 'bg-risk-critical' :
                          factor.level === 'high'     ? 'bg-risk-high' :
                          factor.level === 'medium'   ? 'bg-risk-medium' :
                          'bg-risk-low'
                        }`}
                        style={{ width: `${factor.score}%` }}
                      />
                    </div>
                  </div>
                  <RiskBadge level={factor.level} showLabel={false} size="sm" />
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* DEMO ANALYSIS label */}
      <div className="flex items-center justify-center gap-2 py-2">
        <span className="w-16 h-px bg-border" />
        <span className="text-2xs font-semibold text-text-muted uppercase tracking-widest">Demo Analysis · Simulated Data</span>
        <span className="w-16 h-px bg-border" />
      </div>
    </div>
  );
}

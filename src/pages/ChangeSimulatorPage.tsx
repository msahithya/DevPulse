import { useState, useEffect } from 'react';
import type { ProposedChange, SimulationResult } from '../types';
import RiskBadge from '../components/ui/RiskBadge';
import StatusBadge from '../components/ui/StatusBadge';
import { ImpactNode } from '../components/ui/DevComponents';
import { LoadingState } from '../components/ui/States';
import { Modal } from '../components/ui/Overlays';
import { DEMO_REPOSITORY, DEMO_PROPOSED_CHANGE, FILE_MAP } from '../data/demoData';
import { impactAnalysisService } from '../services/ImpactAnalysisService';

type SimStep = 'idle' | 'running' | 'complete';

// ─── Sub-components ───────────────────────────────────────────────────────────

function DemoLabel() {
  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-cyan-500/8 border border-cyan-500/20">
      <svg className="w-3 h-3 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z" />
        <polyline points="13 2 13 9 20 9" />
      </svg>
      <span className="text-2xs font-bold text-cyan-400 uppercase tracking-wider">Demo Analysis</span>
    </div>
  );
}

function SimulationProgress({ step }: { step: number; total: number }) {
  const steps = [
    'Parsing dependency graph…',
    'Tracing call paths…',
    'Computing blast radius…',
    'Evaluating side effects…',
    'Scoring risk factors…',
    'Generating recommendations…',
    'Finalizing report…',
  ];
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs text-text-muted">
        <span className="text-text-secondary font-medium">DEMO ANALYSIS · Simulating change…</span>
        <span className="font-mono">{Math.round((step / steps.length) * 100)}%</span>
      </div>
      <div className="h-1 bg-surface-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full transition-all duration-500"
          style={{ width: `${(step / steps.length) * 100}%` }}
        />
      </div>
      <p className="text-xs text-text-muted animate-pulse">{steps[Math.min(step, steps.length - 1)]}</p>
    </div>
  );
}

function BlastRadiusGauge({ score }: { score: number }) {
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (score / 100) * circumference;
  const color = score >= 75 ? '#ef4444' : score >= 50 ? '#f97316' : score >= 30 ? '#eab308' : '#22c55e';

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width="120" height="120" viewBox="0 0 120 120">
        {/* Background circle */}
        <circle cx="60" cy="60" r={radius} fill="none" stroke="#1e2330" strokeWidth={8} />
        {/* Progress */}
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          transform="rotate(-90 60 60)"
          style={{ transition: 'stroke-dashoffset 1s ease, stroke 0.5s ease' }}
        />
        {/* Score text */}
        <text x="60" y="55" textAnchor="middle" fontSize="22" fontWeight="700" fill="#e8eaf0" fontFamily="JetBrains Mono, monospace">
          {score}
        </text>
        <text x="60" y="72" textAnchor="middle" fontSize="9" fill="#8b92a5" fontFamily="Inter, sans-serif">
          BLAST SCORE
        </text>
      </svg>
      <div className="text-center">
        <p className="text-xs text-text-muted">
          {score >= 75 ? 'High blast radius' : score >= 50 ? 'Moderate blast radius' : score >= 30 ? 'Limited blast radius' : 'Minimal blast radius'}
        </p>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ChangeSimulatorPage() {
  const [pageLoading, setPageLoading] = useState(true);
  const [changeTitle, setChangeTitle] = useState(DEMO_PROPOSED_CHANGE.title);
  const [changeDescription, setChangeDescription] = useState(DEMO_PROPOSED_CHANGE.description);
  const [changeType, setChangeType] = useState<ProposedChange['changeType']>(DEMO_PROPOSED_CHANGE.changeType);
  const [targetFileId, setTargetFileId] = useState<string>(DEMO_PROPOSED_CHANGE.targetFileId);
  const [simStep, setSimStep] = useState<SimStep>('idle');
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [explainModalFile, setExplainModalFile] = useState<string | null>(null);
  const [aiExplanation, setAiExplanation] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setPageLoading(false), 400);
    return () => clearTimeout(t);
  }, []);

  const sourceFiles = DEMO_REPOSITORY.files.filter(f => f.type !== 'test');

  async function handleSimulate() {
    if (!targetFileId || !changeDescription.trim()) return;

    setSimStep('running');
    setProgress(0);
    setResult(null);

    // Progress animation
    let step = 0;
    const interval = setInterval(() => {
      step += 1;
      setProgress(step);
      if (step >= 6) clearInterval(interval);
    }, 350);

    try {
      const change: ProposedChange = {
        id: 'change-sim-001',
        targetFileId,
        title: changeTitle,
        description: changeDescription,
        changeType,
        createdAt: new Date().toISOString(),
      };
      const res = await impactAnalysisService.simulate(change);
      clearInterval(interval);
      setProgress(7);
      setTimeout(() => {
        setResult(res);
        setSimStep('complete');
      }, 300);
    } catch {
      clearInterval(interval);
      setSimStep('idle');
    }
  }

  async function handleExplain(fileId: string) {
    setExplainModalFile(fileId);
    setAiLoading(true);
    setAiExplanation('');
    // Demo explanation inline
    const file = FILE_MAP[fileId];
    await new Promise(r => setTimeout(r, 1200));
    const explanations: Record<string, string> = {
      payment_api: 'The payment_api.py module acts as the primary interface between external consumers and the payment processing core. Because it directly proxies timeout-sensitive operations, increasing the timeout from 30s to 60s means any API client must be able to tolerate a 60s response time. Load balancers and API gateways with default 30s timeouts will begin returning 504 Gateway Timeout errors before the payment completes.',
      refund_service: 'refund_service.py has a direct dependency on process_payment() from payment_service.py and inherits its timeout behavior. The refund SLA is currently calculated assuming a maximum 30s payment resolution. Doubling this window will push refund resolution times out by up to 30 additional seconds, which may violate contractual SLA obligations.',
      checkout: 'checkout.py is transitively affected through payment_api.py. The checkout flow holds an open session while waiting for payment confirmation. Under slow payment gateway conditions, users will now see a "Processing payment..." state for up to 60 seconds instead of 30, which may cause users to abandon checkout or refresh the page.',
      order_service: 'order_service.py calls payment_service to verify payment before finalizing order creation. The extended timeout doubles the window where orders remain in PENDING state, which may cause downstream inventory hold conflicts and order expiry mismatches.',
      transaction: 'transaction.py is transitively affected as the state machine may receive delayed status transitions. Specifically, PENDING→PROCESSING transitions may be significantly delayed under the new 60s window.',
    };
    setAiExplanation(explanations[fileId] ?? `${file?.name ?? fileId} is affected by the timeout change in payment_service.py. The extended timeout window cascades to all callers through the dependency chain, requiring downstream timeout configurations to be reviewed.`);
    setAiLoading(false);
  }

  if (pageLoading) return <LoadingState message="Loading Change Simulator…" />;

  return (
    <div className="p-6 space-y-6 animate-fade-in">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-text-primary">Change Simulator</h2>
          <p className="text-sm text-text-secondary mt-0.5">
            Describe a proposed change and simulate its impact across the codebase.
          </p>
        </div>
        {result && <DemoLabel />}
      </div>

      {/* Main layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* Left: Change input form */}
        <div className="lg:col-span-2 space-y-4">
          <div className="card">
            <div className="card-header">
              <p className="text-sm font-semibold text-text-primary">Proposed Change</p>
              <p className="text-xs text-text-muted mt-0.5">Describe what you intend to change</p>
            </div>
            <div className="card-body space-y-4">

              {/* Target file */}
              <div>
                <label className="label block mb-1.5">Target File</label>
                <select
                  value={targetFileId}
                  onChange={e => setTargetFileId(e.target.value)}
                  className="input w-full font-mono text-xs"
                  disabled={simStep === 'running'}
                >
                  {sourceFiles.map(f => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                  ))}
                </select>
                {targetFileId && (
                  <p className="text-2xs text-text-muted mt-1 font-mono">
                    {FILE_MAP[targetFileId]?.path}
                  </p>
                )}
              </div>

              {/* Change type */}
              <div>
                <label className="label block mb-1.5">Change Type</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['config', 'logic', 'api', 'schema', 'refactor', 'dependency'] as const).map(type => (
                    <button
                      key={type}
                      onClick={() => setChangeType(type)}
                      disabled={simStep === 'running'}
                      className={`px-2 py-1.5 rounded text-xs font-medium capitalize border transition-colors ${
                        changeType === type
                          ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                          : 'bg-surface-100 border-border text-text-muted hover:text-text-secondary hover:border-border-bright'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="label block mb-1.5">Change Title</label>
                <input
                  type="text"
                  value={changeTitle}
                  onChange={e => setChangeTitle(e.target.value)}
                  placeholder="Short description of change"
                  className="input w-full"
                  disabled={simStep === 'running'}
                />
              </div>

              {/* Description */}
              <div>
                <label className="label block mb-1.5">Change Description</label>
                <textarea
                  value={changeDescription}
                  onChange={e => setChangeDescription(e.target.value)}
                  placeholder="Describe the proposed change in detail. Be specific about what will be modified and why."
                  rows={5}
                  className="input w-full resize-none text-sm leading-relaxed"
                  disabled={simStep === 'running'}
                />
                <p className="text-2xs text-text-muted mt-1">
                  {changeDescription.length} chars · More detail → better analysis
                </p>
              </div>

              {/* Simulate button */}
              <button
                onClick={handleSimulate}
                disabled={simStep === 'running' || !targetFileId || !changeDescription.trim()}
                className="btn-primary w-full justify-center disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {simStep === 'running' ? (
                  <>
                    <div className="w-4 h-4 border-2 border-surface-400 border-t-transparent rounded-full animate-spin" />
                    Simulating…
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <polygon points="5,3 19,12 5,21" />
                    </svg>
                    Run Simulation
                  </>
                )}
              </button>

              {/* Progress */}
              {simStep === 'running' && (
                <div className="pt-2">
                  <SimulationProgress step={progress} total={7} />
                </div>
              )}
            </div>
          </div>

          {/* File info */}
          {targetFileId && FILE_MAP[targetFileId] && (
            <div className="card animate-fade-in">
              <div className="card-header">
                <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Target File Info</p>
              </div>
              <div className="card-body space-y-2">
                {(() => {
                  const f = FILE_MAP[targetFileId]!;
                  return (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-text-muted">Module</span>
                        <span className="text-xs font-medium text-text-primary capitalize">{f.module}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-text-muted">Type</span>
                        <span className="text-xs font-medium text-text-primary capitalize">{f.type}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-text-muted">Imports</span>
                        <span className="text-xs font-mono text-text-primary">{f.dependencies.length}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-text-muted">Used by</span>
                        <span className="text-xs font-mono text-text-primary">{f.dependents.length} files</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-text-muted">Risk level</span>
                        <RiskBadge level={f.riskLevel} size="sm" />
                      </div>
                      <p className="text-xs text-text-muted leading-relaxed pt-1 border-t border-border">{f.description}</p>
                    </>
                  );
                })()}
              </div>
            </div>
          )}
        </div>

        {/* Right: Results */}
        <div className="lg:col-span-3 space-y-4">
          {simStep === 'idle' && !result && (
            <div className="card flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-14 h-14 rounded-xl bg-surface-100 border border-border flex items-center justify-center">
                <svg className="w-7 h-7 text-text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                  <circle cx="12" cy="12" r="9" />
                  <circle cx="12" cy="12" r="5" />
                  <circle cx="12" cy="12" r="1" fill="currentColor" />
                </svg>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-text-secondary">Ready to simulate</p>
                <p className="text-xs text-text-muted mt-1 max-w-xs">
                  Fill in a change description and click "Run Simulation" to compute blast radius, risk, and test recommendations.
                </p>
              </div>
              <div className="px-4 py-2.5 rounded-md bg-surface-100 border border-border max-w-sm">
                <p className="text-xs text-text-muted text-center">
                  Demo change pre-loaded: <span className="text-text-secondary font-medium">Payment timeout 30s → 60s</span>
                </p>
              </div>
            </div>
          )}

          {simStep === 'running' && (
            <div className="card flex flex-col items-center justify-center py-20 gap-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-full border-2 border-border animate-spin border-t-emerald-500" />
                <div className="absolute inset-2 rounded-full border border-emerald-500/20 animate-pulse" />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-text-primary">Running DEMO ANALYSIS</p>
                <p className="text-xs text-text-muted mt-1">Simulating impact on Acme Payment Service</p>
              </div>
            </div>
          )}

          {simStep === 'complete' && result && (
            <div className="space-y-4 animate-fade-in">

              {/* Demo analysis notice */}
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-md bg-cyan-500/8 border border-cyan-500/20">
                <svg className="w-4 h-4 text-cyan-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
                </svg>
                <p className="text-xs text-cyan-400">
                  <span className="font-bold uppercase tracking-wider">Demo Analysis</span>
                  {' '}· These are simulated results for demonstration purposes. Results are not based on real code execution.
                </p>
              </div>

              {/* Blast radius + summary */}
              <div className="card">
                <div className="card-header flex items-center justify-between">
                  <p className="text-sm font-semibold text-text-primary">Blast Radius</p>
                  <RiskBadge level={result.riskSummary.overall} />
                </div>
                <div className="card-body">
                  <div className="flex items-center gap-8">
                    <BlastRadiusGauge score={result.blastRadius.score} />
                    <div className="flex-1 grid grid-cols-2 gap-3">
                      {[
                        { label: 'Direct',       value: result.blastRadius.directlyAffected,    suffix: 'files' },
                        { label: 'Transitive',   value: result.blastRadius.transitivelyAffected, suffix: 'files' },
                        { label: 'Total Files',  value: result.blastRadius.totalFiles,           suffix: 'affected' },
                        { label: 'Modules',      value: result.blastRadius.totalModules,         suffix: 'affected' },
                        { label: 'Coverage Gap', value: `${result.blastRadius.coverageGap}%`,    suffix: 'untested' },
                        { label: 'Risk Score',   value: `${result.riskSummary.score}/100`,       suffix: '' },
                      ].map(({ label, value, suffix }) => (
                        <div key={label} className="px-3 py-2 rounded-md bg-surface-100 border border-border">
                          <p className="text-2xs text-text-muted">{label}</p>
                          <p className="text-lg font-mono font-semibold text-text-primary mt-0.5">{value}</p>
                          {suffix && <p className="text-2xs text-text-muted">{suffix}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 px-4 py-3 rounded-md bg-surface-100 border border-border">
                    <p className="text-xs text-text-secondary leading-relaxed">{result.riskSummary.verdict}</p>
                  </div>
                </div>
              </div>

              {/* Affected files */}
              <div className="card">
                <div className="card-header">
                  <p className="text-sm font-semibold text-text-primary">Affected Files</p>
                  <p className="text-xs text-text-muted mt-0.5">{result.affectedFiles.length} files impacted by this change</p>
                </div>
                <div className="card-body grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {result.affectedFiles.map((af) => {
                    const file = FILE_MAP[af.fileId];
                    return (
                      <div key={af.fileId} className="relative">
                        <ImpactNode
                          name={file?.name ?? af.fileId}
                          impactType={af.impactType}
                          riskLevel={af.riskLevel}
                          reason={af.impactReason}
                          onClick={() => handleExplain(af.fileId)}
                        />
                        <button
                          onClick={() => handleExplain(af.fileId)}
                          className="absolute top-2 right-2 text-2xs text-text-muted hover:text-cyan-400 transition-colors"
                        >
                          Explain →
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Side effects */}
              <div className="card">
                <div className="card-header">
                  <p className="text-sm font-semibold text-text-primary">Side Effects</p>
                </div>
                <div className="divide-y divide-border">
                  {result.sideEffects.map((se) => {
                    const file = FILE_MAP[se.fileId];
                    return (
                      <div key={se.id} className="px-5 py-3 flex items-start gap-3">
                        <RiskBadge level={se.severity} size="sm" showLabel={false} />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="font-mono text-xs text-text-primary">{file?.name ?? se.fileId}</span>
                            <span className="text-2xs text-text-muted capitalize bg-surface-100 border border-border px-1.5 py-0.5 rounded">
                              {se.category}
                            </span>
                          </div>
                          <p className="text-xs text-text-secondary leading-relaxed">{se.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Test recommendations */}
              <div className="card">
                <div className="card-header flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-text-primary">Recommended Tests</p>
                    <p className="text-xs text-text-muted mt-0.5">DEMO ANALYSIS · Based on affected files and call paths</p>
                  </div>
                </div>
                <div className="divide-y divide-border">
                  {result.recommendedTests.map((rt) => {
                    const priorityColor = rt.priority === 'required'    ? 'text-risk-high'
                                       : rt.priority === 'recommended'  ? 'text-risk-medium'
                                       : 'text-text-muted';
                    const statusColor = rt.status === 'update' ? 'text-risk-high'
                                      : rt.status === 'new'    ? 'text-cyan-400'
                                      : 'text-emerald-400';
                    return (
                      <div key={rt.id} className="px-5 py-3 flex items-start gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap mb-0.5">
                            <span className="font-mono text-xs text-text-primary">{rt.testFile}</span>
                            <span className="font-mono text-xs text-text-muted">::</span>
                            <span className="font-mono text-xs text-emerald-400">{rt.testCase}</span>
                            <span className={`text-2xs font-medium uppercase tracking-wider ml-auto ${statusColor}`}>
                              {rt.status}
                            </span>
                          </div>
                          <p className="text-xs text-text-muted leading-relaxed">{rt.reason}</p>
                        </div>
                        <span className={`text-2xs font-medium uppercase tracking-wider flex-shrink-0 mt-0.5 ${priorityColor}`}>
                          {rt.priority}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Release readiness */}
              <div className="card">
                <div className="card-header flex items-center justify-between">
                  <p className="text-sm font-semibold text-text-primary">Release Readiness</p>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-semibold text-text-primary">{result.releaseReadiness.score}/100</span>
                    <StatusBadge status={result.releaseReadiness.ready ? 'pass' : 'fail'} label={result.releaseReadiness.ready ? 'Release Ready' : 'Not Ready'} />
                  </div>
                </div>
                <div className="divide-y divide-border">
                  {result.releaseReadiness.gates.map((gate, idx) => (
                    <div key={idx} className="flex items-center justify-between px-5 py-3">
                      <span className="text-sm text-text-secondary">{gate.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-text-muted hidden sm:block">{gate.message}</span>
                        <StatusBadge status={gate.status} />
                      </div>
                    </div>
                  ))}
                </div>
                {result.releaseReadiness.blockers.length > 0 && (
                  <div className="px-5 py-4 bg-risk-critical/5 border-t border-risk-critical/20">
                    <p className="text-xs font-semibold text-risk-critical mb-2 uppercase tracking-wider">Blockers</p>
                    {result.releaseReadiness.blockers.map((b, i) => (
                      <div key={i} className="flex items-start gap-2 mb-1">
                        <span className="text-risk-critical mt-0.5">✗</span>
                        <p className="text-xs text-text-secondary">{b}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}
        </div>
      </div>

      {/* Explain modal */}
      <Modal open={!!explainModalFile} onClose={() => setExplainModalFile(null)} title="Why Is This File Affected?" width="lg">
        <div className="space-y-4">
          {explainModalFile && (
            <>
              <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-surface-300 border border-border">
                <span className="font-mono text-xs text-text-primary">{FILE_MAP[explainModalFile]?.name ?? explainModalFile}</span>
                <span className="ml-auto text-2xs text-text-muted">{FILE_MAP[explainModalFile]?.path}</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-cyan-500/8 border border-cyan-500/20 w-fit">
                <span className="text-2xs font-bold text-cyan-400 uppercase tracking-wider">Demo Analysis</span>
              </div>
              {aiLoading ? (
                <LoadingState message="Analyzing impact…" size="sm" />
              ) : (
                <p className="text-sm text-text-secondary leading-relaxed">{aiExplanation}</p>
              )}
            </>
          )}
        </div>
      </Modal>
    </div>
  );
}

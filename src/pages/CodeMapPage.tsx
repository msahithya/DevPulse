import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RiskBadge from '../components/ui/RiskBadge';
import { LoadingState } from '../components/ui/States';
import { Drawer } from '../components/ui/Overlays';
import { DEMO_REPOSITORY, DEMO_DEPENDENCY_GRAPH, FILE_MAP } from '../data/demoData';

// Simple SVG-based dependency graph visualization
function GraphCanvas({
  selectedId,
  onSelect,
}: {
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  // Layout: place nodes in a layered fashion
  const LAYERS: string[][] = [
    ['database'],
    ['auth_service', 'transaction'],
    ['payment_service'],
    ['payment_api', 'refund_service', 'order_service'],
    ['checkout'],
    ['test_payment', 'test_transaction', 'test_checkout', 'test_refund'],
  ];

  const NODE_W = 160;
  const NODE_H = 36;
  const H_GAP = 24;
  const V_GAP = 56;

  // Compute positions
  const positions: Record<string, { x: number; y: number }> = {};
  LAYERS.forEach((layer, layerIdx) => {
    const totalWidth = layer.length * NODE_W + (layer.length - 1) * H_GAP;
    const startX = Math.max(0, (900 - totalWidth) / 2);
    layer.forEach((nodeId, nodeIdx) => {
      positions[nodeId] = {
        x: startX + nodeIdx * (NODE_W + H_GAP),
        y: 30 + layerIdx * (NODE_H + V_GAP),
      };
    });
  });

  const totalHeight = LAYERS.length * (NODE_H + V_GAP) + 20;
  const edges = DEMO_DEPENDENCY_GRAPH.edges;

  const TYPE_COLORS: Record<string, string> = {
    service: '#22d3ee',
    api: '#34d399',
    model: '#60a5fa',
    test: '#c084fc',
    utility: '#fbbf24',
    config: '#94a3b8',
    database: '#fb923c',
  };

  return (
    <div className="overflow-auto rounded-md border border-border bg-surface-300">
      <svg width="900" height={totalHeight} viewBox={`0 0 900 ${totalHeight}`}>
        {/* Edges */}
        {edges.map((edge, idx) => {
          const from = positions[edge.from];
          const to = positions[edge.to];
          if (!from || !to) return null;
          const x1 = from.x + NODE_W / 2;
          const y1 = from.y + NODE_H;
          const x2 = to.x + NODE_W / 2;
          const y2 = to.y;
          const midY = (y1 + y2) / 2;
          const isHighlighted = selectedId === edge.from || selectedId === edge.to;
          return (
            <path
              key={idx}
              d={`M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`}
              fill="none"
              stroke={isHighlighted ? '#10b981' : '#1e2330'}
              strokeWidth={isHighlighted ? 2 : 1}
              strokeDasharray={edge.type === 'import' ? undefined : '4 2'}
              opacity={isHighlighted ? 0.9 : 0.5}
            />
          );
        })}

        {/* Nodes */}
        {Object.entries(positions).map(([nodeId, pos]) => {
          const file = FILE_MAP[nodeId];
          if (!file) return null;
          const isSelected = selectedId === nodeId;
          const color = TYPE_COLORS[file.type] ?? '#94a3b8';
          const isTest = file.type === 'test';
          return (
            <g
              key={nodeId}
              transform={`translate(${pos.x}, ${pos.y})`}
              onClick={() => onSelect(nodeId)}
              style={{ cursor: 'pointer' }}
            >
              {/* Node rect */}
              <rect
                width={NODE_W}
                height={NODE_H}
                rx={5}
                fill={isSelected ? '#0f2820' : isTest ? '#130d1e' : '#14171e'}
                stroke={isSelected ? '#10b981' : color + '44'}
                strokeWidth={isSelected ? 1.5 : 1}
              />
              {/* Left accent bar */}
              <rect width={3} height={NODE_H} rx={1} fill={color} opacity={isSelected ? 1 : 0.6} />
              {/* Label */}
              <text
                x={12}
                y={NODE_H / 2 + 1}
                fontSize={11}
                fontFamily="JetBrains Mono, monospace"
                fill={isSelected ? '#e8eaf0' : '#8b92a5'}
                dominantBaseline="middle"
              >
                {file.name}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export default function CodeMapPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>('payment_service');
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(t);
  }, []);

  const selectedFile = selectedId ? FILE_MAP[selectedId] : null;

  if (loading) return <LoadingState message="Building dependency graph…" subMessage="Analyzing import relationships" />;

  return (
    <div className="p-6 space-y-6 animate-fade-in">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-text-primary">Code Map</h2>
          <p className="text-sm text-text-secondary mt-0.5">
            Visual dependency graph · {DEMO_REPOSITORY.files.length} nodes · {DEMO_DEPENDENCY_GRAPH.edges.length} edges
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { if (selectedFile) setDrawerOpen(true); }}
            disabled={!selectedFile}
            className="btn-secondary disabled:opacity-40"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
            </svg>
            Inspect File
          </button>
          <button onClick={() => navigate('/simulator')} className="btn-primary">
            Simulate Change
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 px-4 py-3 card">
        {[
          { type: 'service',  color: '#22d3ee', label: 'Service' },
          { type: 'api',      color: '#34d399', label: 'API' },
          { type: 'model',    color: '#60a5fa', label: 'Model' },
          { type: 'database', color: '#fb923c', label: 'Database' },
          { type: 'test',     color: '#c084fc', label: 'Test' },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: color }} />
            <span className="text-xs text-text-muted">{label}</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5 ml-4">
          <span className="w-6 h-px border-t-2 border-emerald-500" />
          <span className="text-xs text-text-muted">Selected path</span>
        </div>
      </div>

      {/* Graph */}
      <GraphCanvas selectedId={selectedId} onSelect={(id) => { setSelectedId(id); setDrawerOpen(true); }} />

      {/* Selected file info strip */}
      {selectedFile && (
        <div className="card border-emerald-500/20 animate-fade-in">
          <div className="card-body">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-sm font-semibold text-text-primary">{selectedFile.name}</span>
                  <RiskBadge level={selectedFile.riskLevel} size="sm" />
                </div>
                <p className="text-xs text-text-secondary leading-relaxed max-w-2xl">{selectedFile.description}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => setDrawerOpen(true)} className="btn-secondary text-xs">
                  Details
                </button>
                <button onClick={() => navigate('/simulator')} className="btn-primary text-xs">
                  Simulate
                </button>
              </div>
            </div>
            <div className="flex gap-6 mt-3 pt-3 border-t border-border">
              <div>
                <p className="text-2xs text-text-muted">Imports</p>
                <p className="text-sm font-mono font-semibold text-text-primary">{selectedFile.dependencies.length}</p>
              </div>
              <div>
                <p className="text-2xs text-text-muted">Used by</p>
                <p className="text-sm font-mono font-semibold text-text-primary">{selectedFile.dependents.length}</p>
              </div>
              <div>
                <p className="text-2xs text-text-muted">Lines</p>
                <p className="text-sm font-mono font-semibold text-text-primary">{selectedFile.lines}</p>
              </div>
              <div>
                <p className="text-2xs text-text-muted">Exports</p>
                <p className="text-sm font-mono font-semibold text-text-primary">{selectedFile.exports.length}</p>
              </div>
              <div>
                <p className="text-2xs text-text-muted">Module</p>
                <p className="text-sm font-mono font-semibold text-text-primary capitalize">{selectedFile.module}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* File drawer */}
      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title={selectedFile?.name ?? ''}>
        {selectedFile && (
          <div className="space-y-4">
            <div className="px-3 py-2 rounded-md bg-surface-300 border border-border">
              <p className="font-mono text-xs text-text-muted">{selectedFile.path}</p>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed">{selectedFile.description}</p>
            <div>
              <p className="label mb-2">Exports</p>
              <div className="space-y-1">
                {selectedFile.exports.map(e => (
                  <div key={e} className="px-3 py-1.5 rounded-md bg-surface-300 border border-border">
                    <span className="font-mono text-xs text-emerald-400">{e}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="label mb-2">Dependencies</p>
              {selectedFile.dependencies.map(id => (
                <button
                  key={id}
                  onClick={() => setSelectedId(id)}
                  className="block w-full text-left px-3 py-1.5 mb-1 rounded-md bg-surface-300 border border-border hover:border-emerald-500/40 transition-colors"
                >
                  <span className="font-mono text-xs text-text-code">{FILE_MAP[id]?.name ?? id}</span>
                </button>
              ))}
            </div>
            <div>
              <p className="label mb-2">Used By</p>
              {selectedFile.dependents.map(id => (
                <button
                  key={id}
                  onClick={() => setSelectedId(id)}
                  className="block w-full text-left px-3 py-1.5 mb-1 rounded-md bg-surface-300 border border-border hover:border-emerald-500/40 transition-colors"
                >
                  <span className="font-mono text-xs text-text-code">{FILE_MAP[id]?.name ?? id}</span>
                </button>
              ))}
            </div>
            <div className="pt-2 border-t border-border">
              <button
                onClick={() => { setDrawerOpen(false); navigate('/simulator'); }}
                className="btn-primary w-full justify-center"
              >
                Simulate Change on This File
              </button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}

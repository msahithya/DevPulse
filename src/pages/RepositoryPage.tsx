import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { CodeFile } from '../types';
import CodeFileRow from '../components/ui/CodeFileRow';
import StatusBadge from '../components/ui/StatusBadge';
import RiskBadge from '../components/ui/RiskBadge';
import { LoadingState } from '../components/ui/States';
import { Drawer } from '../components/ui/Overlays';
import { DEMO_REPOSITORY, FILE_MAP } from '../data/demoData';

export default function RepositoryPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<CodeFile | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  if (loading) return <LoadingState message="Loading repository…" />;

  const repo = DEMO_REPOSITORY;
  const sourceFiles = repo.files.filter(f => f.type !== 'test');
  const testFiles = repo.files.filter(f => f.type === 'test');

  const allFiles = filter === 'tests' ? testFiles : filter === 'source' ? sourceFiles : repo.files;
  const filtered = search
    ? allFiles.filter(f => f.name.toLowerCase().includes(search.toLowerCase()) || f.module.toLowerCase().includes(search.toLowerCase()))
    : allFiles;

  return (
    <div className="p-6 space-y-6 animate-fade-in">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-text-primary">{repo.name}</h2>
          <p className="text-sm text-text-secondary mt-0.5">{repo.description}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <StatusBadge status="complete" label="Analyzed" />
          <button onClick={() => navigate('/simulator')} className="btn-primary">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <polygon points="5,3 19,12 5,21" />
            </svg>
            Simulate Change
          </button>
        </div>
      </div>

      {/* Stats strip */}
      <div className="flex flex-wrap gap-4 px-5 py-4 card">
        {[
          { label: 'Language', value: repo.language },
          { label: 'Total Files', value: repo.stats.totalFiles },
          { label: 'Modules', value: repo.stats.totalModules },
          { label: 'Dependencies', value: repo.stats.totalDependencies },
          { label: 'Tests', value: repo.stats.totalTests },
          { label: 'Lines of Code', value: repo.stats.linesOfCode.toLocaleString() },
          { label: 'Complexity', value: repo.stats.complexity },
        ].map(({ label, value }) => (
          <div key={label} className="text-center min-w-[72px]">
            <p className="text-lg font-mono font-semibold text-text-primary">{value}</p>
            <p className="text-2xs text-text-muted">{label}</p>
          </div>
        ))}
      </div>

      {/* Modules + Files */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Modules */}
        <div className="card">
          <div className="card-header">
            <p className="text-sm font-semibold text-text-primary">Modules</p>
          </div>
          <div className="divide-y divide-border">
            {repo.modules.map(mod => {
              const statusColor = mod.status === 'changed'  ? 'bg-risk-high'   :
                                  mod.status === 'affected' ? 'bg-risk-medium' :
                                  mod.status === 'stable'   ? 'bg-risk-low'    : 'bg-text-muted';
              return (
                <div key={mod.id} className="flex items-center gap-3 px-4 py-3">
                  <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${statusColor}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary">{mod.name}</p>
                    <p className="text-xs text-text-muted">{mod.files.length} files · {mod.description}</p>
                  </div>
                  {mod.riskLevel !== 'none' && <RiskBadge level={mod.riskLevel} size="sm" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* File list */}
        <div className="lg:col-span-2 card">
          <div className="card-header flex items-center gap-3">
            <p className="text-sm font-semibold text-text-primary flex-1">Files</p>
            {/* Filter pills */}
            <div className="flex gap-1">
              {[
                { id: 'all', label: 'All' },
                { id: 'source', label: 'Source' },
                { id: 'tests', label: 'Tests' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id)}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                    filter === tab.id
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : 'text-text-muted hover:text-text-secondary'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            {/* Search */}
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search files…"
              className="input text-xs py-1.5 w-40"
            />
          </div>
          <div className="divide-y divide-border overflow-y-auto max-h-[500px]">
            {filtered.length === 0 ? (
              <div className="p-8 text-center text-sm text-text-muted">No files match your filter.</div>
            ) : (
              filtered.map(file => (
                <CodeFileRow
                  key={file.id}
                  file={file}
                  selected={selectedFile?.id === file.id}
                  onClick={setSelectedFile}
                  showRisk
                  showMeta
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* File detail drawer */}
      <Drawer
        open={!!selectedFile}
        onClose={() => setSelectedFile(null)}
        title={selectedFile?.name ?? ''}
      >
        {selectedFile && (
          <div className="space-y-4">
            {/* Path */}
            <div className="px-3 py-2 rounded-md bg-surface-300 border border-border">
              <p className="font-mono text-xs text-text-muted">{selectedFile.path}</p>
            </div>

            {/* Meta grid */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Module', value: selectedFile.module },
                { label: 'Type', value: selectedFile.type },
                { label: 'Lines', value: selectedFile.lines },
                { label: 'Complexity', value: selectedFile.complexity },
              ].map(({ label, value }) => (
                <div key={label} className="px-3 py-2 rounded-md bg-surface-100 border border-border">
                  <p className="text-2xs text-text-muted">{label}</p>
                  <p className="text-sm font-medium text-text-primary capitalize mt-0.5">{value}</p>
                </div>
              ))}
            </div>

            {/* Risk */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">Risk Level</span>
              <RiskBadge level={selectedFile.riskLevel} />
            </div>

            {/* Description */}
            <div>
              <p className="label mb-2">Description</p>
              <p className="text-sm text-text-secondary leading-relaxed">{selectedFile.description}</p>
            </div>

            {/* Exports */}
            {selectedFile.exports.length > 0 && (
              <div>
                <p className="label mb-2">Exports</p>
                <div className="space-y-1">
                  {selectedFile.exports.map(exp => (
                    <div key={exp} className="px-3 py-1.5 rounded-md bg-surface-300 border border-border">
                      <span className="font-mono text-xs text-emerald-400">{exp}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Dependencies */}
            {selectedFile.dependencies.length > 0 && (
              <div>
                <p className="label mb-2">Imports ({selectedFile.dependencies.length})</p>
                <div className="space-y-1">
                  {selectedFile.dependencies.map(depId => {
                    const dep = FILE_MAP[depId];
                    return (
                      <div key={depId} className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-surface-300 border border-border">
                        <span className="font-mono text-xs text-text-code">{dep?.name ?? depId}</span>
                        {dep && <span className="ml-auto text-2xs text-text-muted capitalize">{dep.type}</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Dependents */}
            {selectedFile.dependents.length > 0 && (
              <div>
                <p className="label mb-2">Used By ({selectedFile.dependents.length})</p>
                <div className="space-y-1">
                  {selectedFile.dependents.map(depId => {
                    const dep = FILE_MAP[depId];
                    return (
                      <div key={depId} className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-surface-300 border border-border">
                        <span className="font-mono text-xs text-text-code">{dep?.name ?? depId}</span>
                        {dep && <span className="ml-auto text-2xs text-text-muted capitalize">{dep.type}</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Simulate CTA */}
            <div className="pt-2 border-t border-border">
              <button
                onClick={() => { setSelectedFile(null); navigate('/simulator'); }}
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

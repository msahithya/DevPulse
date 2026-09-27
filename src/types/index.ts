// ─── Core Domain Types ──────────────────────────────────────────────────────
export type RiskLevel = 'critical' | 'high' | 'medium' | 'low' | 'none';

export type FileType =
  | 'service'
  | 'api'
  | 'model'
  | 'test'
  | 'utility'
  | 'config'
  | 'database';

export type AnalysisStatus = 'pending' | 'analyzing' | 'complete' | 'error';

export type ModuleStatus = 'stable' | 'changed' | 'affected' | 'safe';

// ─── Repository ──────────────────────────────────────────────────────────────

export interface Repository {
  id: string;
  name: string;
  description: string;
  language: string;
  analyzedAt: string;
  status: AnalysisStatus;
  stats: RepositoryStats;
  modules: Module[];
  files: CodeFile[];
}

export interface RepositoryStats {
  totalFiles: number;
  totalModules: number;
  totalDependencies: number;
  totalTests: number;
  linesOfCode: number;
  complexity: number;
}

// ─── Code Files ──────────────────────────────────────────────────────────────

export interface CodeFile {
  id: string;
  name: string;
  path: string;
  type: FileType;
  module: string;
  lines: number;
  complexity: number;
  dependencies: string[];
  dependents: string[];
  tests: string[];
  exports: string[];
  riskLevel: RiskLevel;
  lastModified: string;
  description: string;
}

// ─── Modules ─────────────────────────────────────────────────────────────────

export interface Module {
  id: string;
  name: string;
  description: string;
  files: string[];
  status: ModuleStatus;
  riskLevel: RiskLevel;
}

// ─── Dependency Graph ────────────────────────────────────────────────────────

export interface DependencyEdge {
  from: string;
  to: string;
  type: 'import' | 'call' | 'inherit' | 'compose';
  weight: number;
}

export interface DependencyGraph {
  nodes: CodeFile[];
  edges: DependencyEdge[];
}

// ─── Change Simulation ───────────────────────────────────────────────────────

export interface ProposedChange {
  id: string;
  targetFileId: string;
  title: string;
  description: string;
  changeType:
    | 'config'
    | 'logic'
    | 'api'
    | 'schema'
    | 'refactor'
    | 'dependency';
  createdAt: string;
}

export interface SimulationResult {
  changeId: string;
  status: 'complete' | 'running' | 'error';
  blastRadius: BlastRadius;
  affectedFiles: AffectedFile[];
  affectedModules: string[];
  dependencyPaths: DependencyPath[];
  sideEffects: SideEffect[];
  riskSummary: RiskSummary;
  recommendedTests: TestRecommendation[];
  releaseReadiness: ReleaseReadiness;
  simulatedAt: string;
}

export interface BlastRadius {
  directlyAffected: number;
  transitivelyAffected: number;
  totalFiles: number;
  totalModules: number;
  coverageGap: number;
  score: number;
}

export interface AffectedFile {
  fileId: string;
  impactType: 'direct' | 'transitive' | 'test';
  impactReason: string;
  riskLevel: RiskLevel;
  changeRequired: boolean;
  callPath: string[];
}

// ─── NEW: Required Changes ───────────────────────────────────────────────────

export interface RequiredChange {
  fileId: string;
  action: 'update' | 'review' | 'test';
  title: string;
  reason: string;
}

export interface DependencyPath {
  from: string;
  to: string;
  path: string[];
  hops: number;
  critical: boolean;
}

export interface SideEffect {
  id: string;
  fileId: string;
  description: string;
  severity: RiskLevel;
  category:
    | 'performance'
    | 'correctness'
    | 'security'
    | 'reliability'
    | 'compatibility';
}

export interface RiskSummary {
  overall: RiskLevel;
  score: number;
  factors: RiskFactor[];
  verdict: string;
}

export interface RiskFactor {
  name: string;
  score: number;
  level: RiskLevel;
  explanation: string;
}

export interface TestRecommendation {
  id: string;
  testFile: string;
  testCase: string;
  priority: 'required' | 'recommended' | 'optional';
  reason: string;
  status: 'existing' | 'new' | 'update';
}

export interface ReleaseReadiness {
  ready: boolean;
  score: number;
  gates: ReleaseGate[];
  blockers: string[];
  warnings: string[];
}

export interface ReleaseGate {
  name: string;
  status: 'pass' | 'fail' | 'warn' | 'skip';
  message: string;
}

// ─── Navigation ──────────────────────────────────────────────────────────────

export interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: string;
  badge?: string | number;
  group?: string;
}
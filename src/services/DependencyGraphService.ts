import type { DependencyGraph, DependencyEdge } from '../types';
import { DEMO_DEPENDENCY_GRAPH } from '../data/demoData';

export interface IDependencyGraphService {
  getGraph(repositoryId: string): Promise<DependencyGraph>;
  getDependencies(repositoryId: string, fileId: string): Promise<string[]>;
  getDependents(repositoryId: string, fileId: string): Promise<string[]>;
  getTransitiveDependencies(repositoryId: string, fileId: string): Promise<string[]>;
  getEdges(repositoryId: string, fileId: string): Promise<DependencyEdge[]>;
}

export class DemoDependencyGraphService implements IDependencyGraphService {
  async getGraph(_repositoryId: string): Promise<DependencyGraph> {
    await delay(500);
    return DEMO_DEPENDENCY_GRAPH;
  }

  async getDependencies(_repositoryId: string, fileId: string): Promise<string[]> {
    await delay(150);
    return DEMO_DEPENDENCY_GRAPH.edges
      .filter(e => e.from === fileId)
      .map(e => e.to);
  }

  async getDependents(_repositoryId: string, fileId: string): Promise<string[]> {
    await delay(150);
    return DEMO_DEPENDENCY_GRAPH.edges
      .filter(e => e.to === fileId)
      .map(e => e.from);
  }

  async getTransitiveDependencies(_repositoryId: string, fileId: string): Promise<string[]> {
    await delay(300);
    // BFS traversal
    const visited = new Set<string>();
    const queue = [fileId];
    while (queue.length > 0) {
      const curr = queue.shift()!;
      if (visited.has(curr)) continue;
      visited.add(curr);
      const deps = DEMO_DEPENDENCY_GRAPH.edges
        .filter(e => e.from === curr)
        .map(e => e.to);
      queue.push(...deps);
    }
    visited.delete(fileId);
    return Array.from(visited);
  }

  async getEdges(_repositoryId: string, fileId: string): Promise<DependencyEdge[]> {
    await delay(100);
    return DEMO_DEPENDENCY_GRAPH.edges.filter(e => e.from === fileId || e.to === fileId);
  }
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const dependencyGraphService: IDependencyGraphService = new DemoDependencyGraphService();

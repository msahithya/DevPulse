import type { Repository, RepositoryStats } from '../types';
import { DEMO_REPOSITORY } from '../data/demoData';

export interface IRepositoryService {
  getRepository(id: string): Promise<Repository>;
  listRepositories(): Promise<Repository[]>;
  getStats(id: string): Promise<RepositoryStats>;
  refreshAnalysis(id: string): Promise<Repository>;
}

export class DemoRepositoryService implements IRepositoryService {
  async getRepository(_id: string): Promise<Repository> {
    await delay(400);
    return DEMO_REPOSITORY;
  }

  async listRepositories(): Promise<Repository[]> {
    await delay(300);
    return [DEMO_REPOSITORY];
  }

  async getStats(_id: string): Promise<RepositoryStats> {
    await delay(200);
    return DEMO_REPOSITORY.stats;
  }

  async refreshAnalysis(_id: string): Promise<Repository> {
    await delay(2000);
    return DEMO_REPOSITORY;
  }
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const repositoryService: IRepositoryService = new DemoRepositoryService();

import type { CodeFile, Repository } from '../types';
import { DEMO_REPOSITORY } from '../data/demoData';

export interface ICodeAnalysisService {
  getFiles(repositoryId: string): Promise<CodeFile[]>;
  getFile(repositoryId: string, fileId: string): Promise<CodeFile | null>;
  getFilesByModule(repositoryId: string, moduleId: string): Promise<CodeFile[]>;
  searchFiles(repositoryId: string, query: string): Promise<CodeFile[]>;
  analyzeRepository(repositoryId: string): Promise<Repository>;
}

export class DemoCodeAnalysisService implements ICodeAnalysisService {
  async getFiles(_repositoryId: string): Promise<CodeFile[]> {
    await delay(300);
    return DEMO_REPOSITORY.files;
  }

  async getFile(_repositoryId: string, fileId: string): Promise<CodeFile | null> {
    await delay(100);
    return DEMO_REPOSITORY.files.find(f => f.id === fileId) ?? null;
  }

  async getFilesByModule(_repositoryId: string, moduleId: string): Promise<CodeFile[]> {
    await delay(200);
    return DEMO_REPOSITORY.files.filter(f => f.module === moduleId);
  }

  async searchFiles(_repositoryId: string, query: string): Promise<CodeFile[]> {
    await delay(150);
    const q = query.toLowerCase();
    return DEMO_REPOSITORY.files.filter(
      f => f.name.toLowerCase().includes(q) || f.description.toLowerCase().includes(q)
    );
  }

  async analyzeRepository(_repositoryId: string): Promise<Repository> {
    await delay(3000);
    return DEMO_REPOSITORY;
  }
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const codeAnalysisService: ICodeAnalysisService = new DemoCodeAnalysisService();

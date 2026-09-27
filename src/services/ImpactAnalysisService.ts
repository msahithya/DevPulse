import type { ProposedChange, SimulationResult, AffectedFile } from '../types';
import { DEMO_SIMULATION_RESULT } from '../data/demoData';

export interface IImpactAnalysisService {
  simulate(change: ProposedChange): Promise<SimulationResult>;
  getAffectedFiles(changeId: string): Promise<AffectedFile[]>;
  getBlastRadius(changeId: string): Promise<SimulationResult['blastRadius']>;
}

export class DemoImpactAnalysisService implements IImpactAnalysisService {
  async simulate(_change: ProposedChange): Promise<SimulationResult> {
    // Simulate processing time for realism
    await delay(2500);
    return DEMO_SIMULATION_RESULT;
  }

  async getAffectedFiles(_changeId: string): Promise<AffectedFile[]> {
    await delay(300);
    return DEMO_SIMULATION_RESULT.affectedFiles;
  }

  async getBlastRadius(_changeId: string): Promise<SimulationResult['blastRadius']> {
    await delay(200);
    return DEMO_SIMULATION_RESULT.blastRadius;
  }
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const impactAnalysisService: IImpactAnalysisService = new DemoImpactAnalysisService();

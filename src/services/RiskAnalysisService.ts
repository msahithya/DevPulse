import type { RiskSummary, RiskFactor, RiskLevel } from '../types';
import { DEMO_SIMULATION_RESULT } from '../data/demoData';

export interface IRiskAnalysisService {
  getRiskSummary(changeId: string): Promise<RiskSummary>;
  getRiskFactors(changeId: string): Promise<RiskFactor[]>;
  getRiskLevel(changeId: string): Promise<RiskLevel>;
}

export class DemoRiskAnalysisService implements IRiskAnalysisService {
  async getRiskSummary(_changeId: string): Promise<RiskSummary> {
    await delay(400);
    return DEMO_SIMULATION_RESULT.riskSummary;
  }

  async getRiskFactors(_changeId: string): Promise<RiskFactor[]> {
    await delay(300);
    return DEMO_SIMULATION_RESULT.riskSummary.factors;
  }

  async getRiskLevel(_changeId: string): Promise<RiskLevel> {
    await delay(200);
    return DEMO_SIMULATION_RESULT.riskSummary.overall;
  }
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const riskAnalysisService: IRiskAnalysisService = new DemoRiskAnalysisService();

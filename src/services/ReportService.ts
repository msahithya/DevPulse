import type { SimulationResult } from '../types';
import { DEMO_SIMULATION_RESULT, DEMO_REPOSITORY, DEMO_PROPOSED_CHANGE } from '../data/demoData';

export interface IReportService {
  generateImpactReport(changeId: string): Promise<ImpactReport>;
  exportReport(report: ImpactReport, format: 'json' | 'markdown'): string;
}

export interface ImpactReport {
  id: string;
  title: string;
  repository: string;
  change: string;
  generatedAt: string;
  simulation: SimulationResult;
  summary: string;
}

export class DemoReportService implements IReportService {
  async generateImpactReport(_changeId: string): Promise<ImpactReport> {
    await delay(800);
    return {
      id: 'report-001',
      title: 'Impact Report: Payment Timeout Increase',
      repository: DEMO_REPOSITORY.name,
      change: DEMO_PROPOSED_CHANGE.description,
      generatedAt: new Date().toISOString(),
      simulation: DEMO_SIMULATION_RESULT,
      summary: `This change affects ${DEMO_SIMULATION_RESULT.blastRadius.totalFiles} files across ${DEMO_SIMULATION_RESULT.blastRadius.totalModules} modules with a ${DEMO_SIMULATION_RESULT.riskSummary.overall.toUpperCase()} risk level.`,
    };
  }

  exportReport(report: ImpactReport, format: 'json' | 'markdown'): string {
    if (format === 'json') {
      return JSON.stringify(report, null, 2);
    }
    return `# ${report.title}\n\n${report.summary}\n\nGenerated: ${report.generatedAt}`;
  }
}

export interface IAIAnalysisService {
  explainImpact(fileId: string, changeDescription: string): Promise<string>;
  suggestMitigation(riskFactorId: string): Promise<string>;
  generateTestCases(fileId: string): Promise<string[]>;
}

export class DemoAIAnalysisService implements IAIAnalysisService {
  async explainImpact(fileId: string, _changeDescription: string): Promise<string> {
    await delay(1200);
    const explanations: Record<string, string> = {
      payment_api: 'The payment_api.py module acts as the primary interface between external consumers and the payment processing core. Because it directly proxies timeout-sensitive operations, increasing the timeout from 30s to 60s means any API client must be able to tolerate a 60s response time. Load balancers and API gateways with default 30s timeouts will begin returning 504 Gateway Timeout errors before the payment completes.',
      refund_service: 'refund_service.py has a direct dependency on process_payment() from payment_service.py and inherits its timeout behavior. The refund SLA is currently calculated assuming a maximum 30s payment resolution. Doubling this window will push refund resolution times out by up to 30 additional seconds, which may violate contractual SLA obligations.',
      checkout: 'checkout.py is transitively affected through payment_api.py. The checkout flow holds an open session while waiting for payment confirmation. Under slow payment gateway conditions, users will now see a "Processing payment..." state for up to 60 seconds instead of 30, which may cause users to abandon checkout or refresh the page.',
    };
    return explanations[fileId] ?? `This file is transitively affected by the timeout change in payment_service.py through its import chain. The extended timeout window cascades to all callers, requiring downstream timeout configurations to be reviewed.`;
  }

  async suggestMitigation(_riskFactorId: string): Promise<string> {
    await delay(800);
    return 'Consider implementing a circuit breaker pattern to fail fast when the payment gateway is unresponsive, rather than blocking for the full timeout duration. Additionally, add async payment processing with webhook callbacks to decouple the timeout from the user-facing request cycle.';
  }

  async generateTestCases(_fileId: string): Promise<string[]> {
    await delay(1000);
    return [
      'test_payment_timeout_is_60_seconds()',
      'test_payment_succeeds_within_60_second_window()',
      'test_payment_fails_after_60_second_timeout()',
      'test_concurrent_payments_with_60s_timeout()',
      'test_refund_sla_within_new_timeout_window()',
    ];
  }
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const reportService: IReportService = new DemoReportService();
export const aiAnalysisService: IAIAnalysisService = new DemoAIAnalysisService();

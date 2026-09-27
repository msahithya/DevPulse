import type { TestRecommendation } from '../types';
import { DEMO_SIMULATION_RESULT } from '../data/demoData';

export interface ITestImpactService {
  getRecommendations(changeId: string): Promise<TestRecommendation[]>;
  getRequiredTests(changeId: string): Promise<TestRecommendation[]>;
  runTestSuite(testIds: string[]): Promise<TestRunResult>;
}

export interface TestRunResult {
  id: string;
  status: 'pass' | 'fail' | 'partial';
  passed: number;
  failed: number;
  skipped: number;
  duration: number;
  results: TestCaseResult[];
}

export interface TestCaseResult {
  testId: string;
  testCase: string;
  status: 'pass' | 'fail' | 'skip';
  duration: number;
  message?: string;
}

export class DemoTestImpactService implements ITestImpactService {
  async getRecommendations(_changeId: string): Promise<TestRecommendation[]> {
    await delay(300);
    return DEMO_SIMULATION_RESULT.recommendedTests;
  }

  async getRequiredTests(_changeId: string): Promise<TestRecommendation[]> {
    await delay(200);
    return DEMO_SIMULATION_RESULT.recommendedTests.filter(t => t.priority === 'required');
  }

  async runTestSuite(_testIds: string[]): Promise<TestRunResult> {
    await delay(3000);
    return {
      id: 'run-demo-001',
      status: 'partial',
      passed: 4,
      failed: 2,
      skipped: 0,
      duration: 12400,
      results: [
        { testId: 'rt-1', testCase: 'test_timeout_behavior', status: 'fail', duration: 340, message: 'AssertionError: expected timeout 30 but got 60' },
        { testId: 'rt-2', testCase: 'test_refund_after_timeout', status: 'fail', duration: 280, message: 'AssertionError: mock_timeout mismatch' },
        { testId: 'rt-3', testCase: 'test_payment_timeout_checkout', status: 'pass', duration: 890 },
        { testId: 'rt-4', testCase: 'test_high_concurrency_timeout', status: 'skip', duration: 0, message: 'Test not yet implemented' },
        { testId: 'rt-5', testCase: 'test_order_hold_window', status: 'skip', duration: 0, message: 'Test not yet implemented' },
        { testId: 'rt-6', testCase: 'test_state_transitions', status: 'pass', duration: 220 },
      ],
    };
  }
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const testImpactService: ITestImpactService = new DemoTestImpactService();

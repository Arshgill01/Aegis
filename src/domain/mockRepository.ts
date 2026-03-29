import type {
  AgentWorker,
  ApprovalRequest,
  AuditEvent,
  PolicyRule,
  SeededAegisData,
  WorkflowRun,
  WorkflowScenario,
} from "./contracts";
import { seededAegisData } from "./fixtures";

export function getSeededAegisData(): SeededAegisData {
  return seededAegisData;
}

export function listWorkers(): AgentWorker[] {
  return getSeededAegisData().workers;
}

export function listScenarios(): WorkflowScenario[] {
  return getSeededAegisData().scenarios;
}

export function listRuns(): WorkflowRun[] {
  return listScenarios().map((scenario) => scenario.run);
}

export function listApprovals(): ApprovalRequest[] {
  return listScenarios().flatMap((scenario) => scenario.approvals);
}

export function listPolicies(): PolicyRule[] {
  return listScenarios().flatMap((scenario) => scenario.policies);
}

export function listEvents(): AuditEvent[] {
  return listScenarios().flatMap((scenario) => scenario.events);
}

export function getWorkerById(workerId: string): AgentWorker | undefined {
  return listWorkers().find((worker) => worker.id === workerId);
}

export function getScenarioById(scenarioId: string): WorkflowScenario | undefined {
  return listScenarios().find((scenario) => scenario.id === scenarioId);
}

export function getScenarioByRunId(runId: string): WorkflowScenario | undefined {
  return listScenarios().find((scenario) => scenario.run.id === runId);
}

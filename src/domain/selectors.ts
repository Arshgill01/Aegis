import type {
  AgentWorker,
  ApprovalRequest,
  AuditEvent,
  PolicyRule,
  RiskLevel,
  WorkflowScenario,
} from "./contracts";
import {
  getScenarioById,
  listApprovals,
  listEvents,
  listPolicies,
  listScenarios,
  listWorkers,
} from "./mockRepository";
import { getRuntimeState } from "./runtimeStore";

const riskRank: Record<RiskLevel, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

function byRiskAndEta(left: WorkflowScenario, right: WorkflowScenario) {
  return (
    riskRank[left.run.riskLevel] - riskRank[right.run.riskLevel] ||
    left.run.etaMinutes - right.run.etaMinutes
  );
}

function byEventTimeDescending(left: AuditEvent, right: AuditEvent) {
  return right.timestamp.localeCompare(left.timestamp);
}

function byApprovalPriority(left: ApprovalRequest, right: ApprovalRequest) {
  return riskRank[left.riskLevel] - riskRank[right.riskLevel];
}

function byPolicyPriority(left: PolicyRule, right: PolicyRule) {
  return riskRank[left.severity] - riskRank[right.severity];
}

function isActiveScenario(scenario: WorkflowScenario) {
  return scenario.run.status !== "completed";
}

function isPendingApproval(approval: ApprovalRequest) {
  return approval.status === "pending";
}

export type ApprovalEntitySelection = {
  approval: ApprovalRequest;
  scenario: WorkflowScenario;
};

export function selectScenarioByRunId(runId: string): WorkflowScenario | undefined {
  return listScenarios().find((scenario) => scenario.run.id === runId);
}

export function selectRunScenario(preferredRunId?: string): WorkflowScenario | undefined {
  const runtimeState = getRuntimeState();
  const selectedByRunId = preferredRunId ?? runtimeState.selectedRunId;
  const selectedScenarioByRun = selectedByRunId
    ? selectScenarioByRunId(selectedByRunId)
    : undefined;
  const selectedScenarioById = runtimeState.selectedScenarioId
    ? getScenarioById(runtimeState.selectedScenarioId)
    : undefined;

  return (
    selectedScenarioByRun
    ?? selectedScenarioById
    ?? getScenarioById("scenario-northwind-mismatch")
    ?? listScenarios()[0]
  );
}

export function selectApprovalEntityById(
  approvalId: string,
): ApprovalEntitySelection | undefined {
  for (const scenario of listScenarios()) {
    const approval = scenario.approvals.find(
      (currentApproval) => currentApproval.id === approvalId,
    );

    if (approval) {
      return { approval, scenario };
    }
  }

  return undefined;
}

export function selectApprovalById(approvalId: string): ApprovalRequest | undefined {
  return selectApprovalEntityById(approvalId)?.approval;
}

export function selectApprovalEntity(
  preferredApprovalId?: string,
): ApprovalEntitySelection | undefined {
  const runtimeState = getRuntimeState();
  const selectionById = preferredApprovalId ?? runtimeState.selectedApprovalId;
  const selectedApprovalEntity = selectionById
    ? selectApprovalEntityById(selectionById)
    : undefined;

  if (selectedApprovalEntity) {
    return selectedApprovalEntity;
  }

  const fallbackApproval = listApprovals()
    .filter(isPendingApproval)
    .sort(byApprovalPriority)[0];

  if (!fallbackApproval) {
    return undefined;
  }

  return selectApprovalEntityById(fallbackApproval.id);
}

export type MissionControlSnapshot = {
  activeScenarios: WorkflowScenario[];
  flaggedScenarios: WorkflowScenario[];
  pendingApprovals: ApprovalRequest[];
  recentEvents: AuditEvent[];
  workers: AgentWorker[];
  spotlight: WorkflowScenario;
  activeRunCount: number;
  pendingApprovalCount: number;
  flaggedCount: number;
  protectedPaymentValueUsd: number;
  underReviewCount: number;
  blockedPolicyCount: number;
};

export function selectMissionControlSnapshot(): MissionControlSnapshot {
  const activeScenarios = listScenarios().filter(isActiveScenario).sort(byRiskAndEta);
  const pendingApprovals = listApprovals().filter(isPendingApproval).sort(byApprovalPriority);
  const flaggedScenarios = activeScenarios.filter((scenario) => scenario.run.riskLevel !== "low");
  const recentEvents = listEvents().sort(byEventTimeDescending).slice(0, 4);
  const protectedPaymentValueUsd = flaggedScenarios.reduce(
    (total, scenario) => total + scenario.paymentIntent.amountUsd,
    0,
  );
  const blockedPolicyCount = flaggedScenarios.reduce(
    (total, scenario) =>
      total + scenario.policies.filter((policy) => policy.outcome === "block").length,
    0,
  );

  return {
    activeScenarios,
    flaggedScenarios,
    pendingApprovals,
    recentEvents,
    workers: listWorkers(),
    spotlight: selectRunScenario() ?? activeScenarios[0],
    activeRunCount: activeScenarios.length,
    pendingApprovalCount: pendingApprovals.length,
    flaggedCount: flaggedScenarios.length,
    protectedPaymentValueUsd,
    underReviewCount: activeScenarios.filter((scenario) =>
      ["waiting_for_approval", "blocked"].includes(scenario.run.status),
    ).length,
    blockedPolicyCount,
  };
}

export type AgentsOverview = {
  workers: AgentWorker[];
  activeScenarios: WorkflowScenario[];
  recentEvents: AuditEvent[];
  activeRunCount: number;
  shadowRunCount: number;
  escalationOwnerCount: number;
};

export function selectAgentsOverview(): AgentsOverview {
  const activeScenarios = listScenarios().filter(isActiveScenario);

  return {
    workers: listWorkers(),
    activeScenarios,
    recentEvents: listEvents().sort(byEventTimeDescending),
    activeRunCount: activeScenarios.length,
    shadowRunCount: activeScenarios.filter((scenario) => scenario.run.mode === "shadow").length,
    escalationOwnerCount: listWorkers().filter((worker) =>
      activeScenarios.some(
        (scenario) =>
          scenario.run.ownerWorkerId === worker.id &&
          scenario.run.riskLevel !== "low" &&
          scenario.run.status !== "completed",
      ),
    ).length,
  };
}

export type RunsOverview = {
  activeScenarios: WorkflowScenario[];
  spotlight: WorkflowScenario;
  openRunCount: number;
  completedRunCount: number;
  executeReadyCount: number;
  waitingRunCount: number;
};

export function selectRunsOverview(preferredRunId?: string): RunsOverview {
  const scenarios = listScenarios();
  const activeScenarios = scenarios.filter(isActiveScenario).sort(byRiskAndEta);

  return {
    activeScenarios,
    spotlight: selectRunScenario(preferredRunId) ?? activeScenarios[0],
    openRunCount: activeScenarios.length,
    completedRunCount: scenarios.length - activeScenarios.length,
    executeReadyCount: activeScenarios.filter((scenario) => scenario.run.mode === "execute_ready")
      .length,
    waitingRunCount: activeScenarios.filter((scenario) =>
      ["waiting_for_approval", "blocked"].includes(scenario.run.status),
    ).length,
  };
}

export type ApprovalsOverview = {
  pendingApprovals: ApprovalRequest[];
  relatedScenarios: WorkflowScenario[];
  blockedPaymentValueUsd: number;
  urgentApprovalCount: number;
};

export function selectApprovalsOverview(): ApprovalsOverview {
  const pendingApprovals = listApprovals().filter(isPendingApproval).sort(byApprovalPriority);
  const relatedScenarios = pendingApprovals
    .map((approval) => listScenarios().find((scenario) => scenario.run.id === approval.runId))
    .filter((scenario): scenario is WorkflowScenario => Boolean(scenario));

  return {
    pendingApprovals,
    relatedScenarios,
    blockedPaymentValueUsd: relatedScenarios.reduce(
      (total, scenario) => total + scenario.paymentIntent.amountUsd,
      0,
    ),
    urgentApprovalCount: pendingApprovals.filter((approval) => approval.riskLevel === "high")
      .length,
  };
}

export type PolicyRuleReference = {
  policy: PolicyRule;
  scenarios: WorkflowScenario[];
};

export type PoliciesOverview = {
  rules: PolicyRuleReference[];
  allowCount: number;
  escalateCount: number;
  blockCount: number;
  activeTriggerCount: number;
};

export function selectPoliciesOverview(): PoliciesOverview {
  const scenarioMap = new Map(
    listScenarios().map((scenario) => [scenario.id, scenario] as const),
  );
  const policyMap = new Map<string, PolicyRuleReference>();

  for (const scenario of listScenarios()) {
    for (const policy of scenario.policies) {
      const existing = policyMap.get(policy.id);
      if (!existing) {
        policyMap.set(policy.id, { policy, scenarios: [scenario] });
        continue;
      }

      if (existing.scenarios.some((existingScenario) => existingScenario.id === scenario.id)) {
        continue;
      }

      const mappedScenario = scenarioMap.get(scenario.id);
      if (mappedScenario) {
        existing.scenarios.push(mappedScenario);
      }
    }
  }

  const rules = Array.from(policyMap.values()).sort((left, right) => byPolicyPriority(left.policy, right.policy));

  return {
    rules,
    allowCount: rules.filter((rule) => rule.policy.outcome === "allow").length,
    escalateCount: rules.filter((rule) => rule.policy.outcome === "escalate").length,
    blockCount: rules.filter((rule) => rule.policy.outcome === "block").length,
    activeTriggerCount: rules.filter((rule) =>
      rule.scenarios.some((scenario) => scenario.run.status !== "completed"),
    ).length,
  };
}

export type FinOpsOverview = {
  spotlight: WorkflowScenario;
  scenarios: WorkflowScenario[];
  activeScenarioCount: number;
  exceptionScenarioCount: number;
  completedScenarioCount: number;
};

export function selectFinOpsOverview(): FinOpsOverview {
  const scenarios = listScenarios();
  const activeScenarioCount = scenarios.filter(isActiveScenario).length;

  return {
    spotlight: selectRunScenario() ?? scenarios[0],
    scenarios,
    activeScenarioCount,
    exceptionScenarioCount: scenarios.filter((scenario) => scenario.run.riskLevel !== "low")
      .length,
    completedScenarioCount: scenarios.filter((scenario) => scenario.run.status === "completed")
      .length,
  };
}

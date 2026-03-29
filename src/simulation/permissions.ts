import {
  getWorkerDefinition,
} from "../contracts";
import type {
  ControlReference,
  ExecutionMode,
  PermissionCheck,
  PermissionCheckCode,
  PermissionEvaluation,
  PermissionOutcome,
  PermissionRiskLevel,
  PermissionSensitivityLevel,
  StepStatus,
  TaskStep,
  WorkerCapabilityScope,
  WorkerId,
  WorkerStageKey,
  WorkflowRun,
} from "../contracts";

type StepTransitionPermissionInput = {
  run: WorkflowRun;
  step: TaskStep;
  toStatus: StepStatus;
  workerId: WorkerId;
  occurredAt: string;
};

type WorkerHandoffPermissionInput = {
  run: WorkflowRun;
  step: TaskStep;
  fromWorkerId?: WorkerId;
  toWorkerId: WorkerId;
  occurredAt: string;
};

type ModeChangePermissionInput = {
  run: WorkflowRun;
  step?: TaskStep;
  fromMode: ExecutionMode;
  toMode: ExecutionMode;
  workerId?: WorkerId;
  occurredAt: string;
};

const executeModeSwitchWorkers = new Set<WorkerId>([
  "worker-approval-coordinator",
  "worker-execution",
]);

const stepKeyScopeMap: Record<string, WorkerCapabilityScope> = {
  intake: "intake",
  "document-review": "document",
  "vendor-review": "vendor",
  "vendor-resolution": "vendor",
  "po-match": "matching",
  "policy-evaluation": "policy",
  "risk-review": "risk",
  "risk-hold": "risk",
  "risk-assessment": "risk",
  "approval-coordination": "approval",
  "approval-routing": "approval",
  "controlled-execution": "execution",
  "audit-narration": "audit",
  "exception-resolution": "risk",
};

const stepKeyStageMap: Record<string, WorkerStageKey> = {
  intake: "intake",
  "document-review": "document-review",
  "vendor-review": "vendor-resolution",
  "vendor-resolution": "vendor-resolution",
  "po-match": "po-match",
  "policy-evaluation": "policy-evaluation",
  "risk-review": "risk-assessment",
  "risk-hold": "risk-assessment",
  "risk-assessment": "risk-assessment",
  "approval-coordination": "approval-routing",
  "approval-routing": "approval-routing",
  "controlled-execution": "controlled-execution",
  "audit-narration": "audit-narration",
  "exception-resolution": "risk-assessment",
};

function scopeForStepKey(stepKey: string): WorkerCapabilityScope {
  return stepKeyScopeMap[stepKey] ?? "policy";
}

function stageForStepKey(stepKey: string): WorkerStageKey {
  return stepKeyStageMap[stepKey] ?? "policy-evaluation";
}

function sensitivityForScope(
  scope: WorkerCapabilityScope,
  stepKey?: string,
): PermissionSensitivityLevel {
  if (stepKey === "controlled-execution") {
    return "restricted";
  }

  if (scope === "execution" || scope === "vendor") {
    return "sensitive";
  }

  return "standard";
}

function eventToken(timestamp: string) {
  return timestamp.replace(/[-:.TZ]/g, "");
}

function createEvaluationId(
  runId: string,
  actionKind: PermissionEvaluation["actionKind"],
  occurredAt: string,
  suffix: string,
) {
  return `PERM-${runId}-${actionKind.toUpperCase()}-${suffix.toUpperCase()}-${eventToken(occurredAt)}`;
}

function hasScopeCapability(workerId: WorkerId, scope: WorkerCapabilityScope) {
  const worker = getWorkerDefinition(workerId);
  if (!worker) {
    return false;
  }

  return worker.capabilities.some((capability) => capability.scope === scope);
}

function ownsStage(workerId: WorkerId, stageKey: WorkerStageKey) {
  const worker = getWorkerDefinition(workerId);
  if (!worker) {
    return false;
  }

  return (
    worker.stageOwnership.primaryStages.includes(stageKey)
    || worker.stageOwnership.supportingStages.includes(stageKey)
  );
}

function createCheck(
  code: PermissionCheckCode,
  status: PermissionCheck["status"],
  label: string,
  detail: string,
): PermissionCheck {
  return {
    code,
    status,
    label,
    detail,
  };
}

function summarizeOutcome(checks: PermissionCheck[]) {
  const failed = checks.filter((check) => check.status === "fail");
  if (failed.length > 0) {
    return {
      outcome: "block" as PermissionOutcome,
      riskLevel: "high" as PermissionRiskLevel,
      reason: failed[0].detail,
      triggerCodes: failed.map((check) => check.code),
    };
  }

  const warned = checks.filter((check) => check.status === "warn");
  if (warned.length > 0) {
    return {
      outcome: "escalate" as PermissionOutcome,
      riskLevel: "medium" as PermissionRiskLevel,
      reason: warned[0].detail,
      triggerCodes: warned.map((check) => check.code),
    };
  }

  return {
    outcome: "allow" as PermissionOutcome,
    riskLevel: "low" as PermissionRiskLevel,
    reason: "Action is within worker scope and execution controls.",
    triggerCodes: [] as PermissionCheckCode[],
  };
}

function uniqueTriggerCodes(codes: PermissionCheckCode[]) {
  return [...new Set(codes)];
}

function buildEvaluation(
  base: Omit<
    PermissionEvaluation,
    "outcome" | "riskLevel" | "requiresApproval" | "shouldGate" | "reason" | "triggerCodes" | "checks"
  >,
  checks: PermissionCheck[],
): PermissionEvaluation {
  const summary = summarizeOutcome(checks);

  return {
    ...base,
    checks,
    outcome: summary.outcome,
    riskLevel: summary.riskLevel,
    shouldGate: summary.outcome !== "allow",
    requiresApproval: summary.outcome === "escalate",
    reason: summary.reason,
    triggerCodes: uniqueTriggerCodes(summary.triggerCodes),
  };
}

function workerDisplayName(workerId: WorkerId) {
  return getWorkerDefinition(workerId)?.name ?? workerId;
}

function shouldEvaluateStepExecution(toStatus: StepStatus) {
  return toStatus === "in_progress" || toStatus === "completed";
}

export function evaluateStepTransitionPermission(
  input: StepTransitionPermissionInput,
): PermissionEvaluation {
  const scope = scopeForStepKey(input.step.key);
  const stageKey = stageForStepKey(input.step.key);
  const sensitivity = sensitivityForScope(scope, input.step.key);
  const checks: PermissionCheck[] = [];

  checks.push(
    createCheck(
      "step_assignment_match",
      input.workerId === input.step.assignedWorkerId ? "pass" : "fail",
      "Worker assignment alignment",
      input.workerId === input.step.assignedWorkerId
        ? `${workerDisplayName(input.workerId)} is assigned to this step.`
        : `${workerDisplayName(input.workerId)} is not assigned to ${input.step.title}.`,
    ),
  );

  checks.push(
    createCheck(
      "capability_scope_match",
      hasScopeCapability(input.workerId, scope) ? "pass" : "fail",
      "Capability scope match",
      hasScopeCapability(input.workerId, scope)
        ? `${workerDisplayName(input.workerId)} has ${scope} capabilities.`
        : `${workerDisplayName(input.workerId)} is outside the ${scope} capability scope.`,
    ),
  );

  checks.push(
    createCheck(
      "stage_scope_match",
      ownsStage(input.workerId, stageKey) ? "pass" : "fail",
      "Stage ownership alignment",
      ownsStage(input.workerId, stageKey)
        ? `${workerDisplayName(input.workerId)} can operate in ${stageKey}.`
        : `${workerDisplayName(input.workerId)} does not own or support ${stageKey}.`,
    ),
  );

  const touchesExecution = shouldEvaluateStepExecution(input.toStatus);

  if (touchesExecution && input.step.executionMode === "execute") {
    checks.push(
      createCheck(
        "execute_mode_worker_allowed",
        input.workerId === "worker-execution" ? "pass" : "fail",
        "Execute mode worker restriction",
        input.workerId === "worker-execution"
          ? "Execution Worker is authorized for execute-lane actions."
          : `${workerDisplayName(input.workerId)} cannot execute live actions in execute mode.`,
      ),
    );

    checks.push(
      createCheck(
        "run_mode_allows_execution",
        input.run.executionMode === "execute" ? "pass" : "fail",
        "Run execution mode alignment",
        input.run.executionMode === "execute"
          ? "Run is in execute mode for live action."
          : "Run is still shadowed, so execute-lane action is blocked.",
      ),
    );
  } else {
    checks.push(
      createCheck(
        "execute_mode_worker_allowed",
        "pass",
        "Execute mode worker restriction",
        "Step is not attempting a live execute-lane action.",
      ),
    );

    checks.push(
      createCheck(
        "run_mode_allows_execution",
        "pass",
        "Run execution mode alignment",
        "No execute-lane action is being attempted.",
      ),
    );
  }

  if (sensitivity === "restricted" && touchesExecution && input.step.executionMode !== "execute") {
    checks.push(
      createCheck(
        "sensitive_action_guardrail",
        "fail",
        "Sensitive action guardrail",
        "Restricted execution actions must remain in execute mode.",
      ),
    );
  } else {
    checks.push(
      createCheck(
        "sensitive_action_guardrail",
        "pass",
        "Sensitive action guardrail",
        sensitivity === "restricted"
          ? "Restricted action is routed through execute controls."
          : "Action sensitivity is within normal controls.",
      ),
    );
  }

  return buildEvaluation(
    {
      id: createEvaluationId(input.run.id, "step_transition", input.occurredAt, input.step.id),
      actionKind: "step_transition",
      actionLabel: `Transition ${input.step.title} to ${input.toStatus}`,
      actorWorkerId: input.workerId,
      stepId: input.step.id,
      stepKey: input.step.key,
      scope,
      sensitivity,
      attemptedExecutionMode: input.step.executionMode,
      runExecutionMode: input.run.executionMode,
      evaluatedAt: input.occurredAt,
    },
    checks,
  );
}

export function evaluateWorkerHandoffPermission(
  input: WorkerHandoffPermissionInput,
): PermissionEvaluation {
  const scope = scopeForStepKey(input.step.key);
  const stageKey = stageForStepKey(input.step.key);
  const sensitivity = sensitivityForScope(scope, input.step.key);
  const fromWorkerId = input.fromWorkerId ?? input.step.assignedWorkerId;
  const fromWorker = getWorkerDefinition(fromWorkerId);
  const checks: PermissionCheck[] = [];

  checks.push(
    createCheck(
      "handoff_target_allowed",
      fromWorker?.handoffTargets.includes(input.toWorkerId) ?? false ? "pass" : "fail",
      "Handoff target restriction",
      fromWorker?.handoffTargets.includes(input.toWorkerId)
        ? `${fromWorker?.name} can hand off to ${workerDisplayName(input.toWorkerId)}.`
        : `${workerDisplayName(input.toWorkerId)} is not an allowed handoff target for ${fromWorker?.name ?? fromWorkerId}.`,
    ),
  );

  checks.push(
    createCheck(
      "capability_scope_match",
      hasScopeCapability(input.toWorkerId, scope) ? "pass" : "fail",
      "Target capability scope",
      hasScopeCapability(input.toWorkerId, scope)
        ? `${workerDisplayName(input.toWorkerId)} has ${scope} capabilities.`
        : `${workerDisplayName(input.toWorkerId)} is outside the ${scope} capability scope.`,
    ),
  );

  checks.push(
    createCheck(
      "stage_scope_match",
      ownsStage(input.toWorkerId, stageKey) ? "pass" : "fail",
      "Target stage ownership",
      ownsStage(input.toWorkerId, stageKey)
        ? `${workerDisplayName(input.toWorkerId)} can own ${stageKey}.`
        : `${workerDisplayName(input.toWorkerId)} cannot own or support ${stageKey}.`,
    ),
  );

  if (input.step.executionMode === "execute") {
    checks.push(
      createCheck(
        "execute_mode_worker_allowed",
        input.toWorkerId === "worker-execution" ? "pass" : "fail",
        "Execute lane handoff restriction",
        input.toWorkerId === "worker-execution"
          ? "Execute handoff targets the Execution Worker."
          : "Only the Execution Worker can own execute-lane steps.",
      ),
    );

    checks.push(
      createCheck(
        "run_mode_allows_execution",
        input.run.executionMode === "execute" ? "pass" : "fail",
        "Run execution mode alignment",
        input.run.executionMode === "execute"
          ? "Run mode allows execute-lane handoff."
          : "Run is shadowed, so execute-lane handoff is blocked.",
      ),
    );
  } else {
    checks.push(
      createCheck(
        "execute_mode_worker_allowed",
        "pass",
        "Execute lane handoff restriction",
        "Step is in shadow mode; execute worker restriction not required.",
      ),
    );

    checks.push(
      createCheck(
        "run_mode_allows_execution",
        "pass",
        "Run execution mode alignment",
        "No execute-lane handoff is being attempted.",
      ),
    );
  }

  checks.push(
    createCheck(
      "sensitive_action_guardrail",
      sensitivity === "restricted" && input.toWorkerId !== "worker-execution" ? "fail" : "pass",
      "Sensitive action guardrail",
      sensitivity === "restricted" && input.toWorkerId !== "worker-execution"
        ? "Restricted step handoff must stay with the Execution Worker."
        : "Handoff satisfies sensitivity guardrails.",
    ),
  );

  return buildEvaluation(
    {
      id: createEvaluationId(input.run.id, "worker_handoff", input.occurredAt, input.step.id),
      actionKind: "worker_handoff",
      actionLabel: `Handoff ${input.step.title} to ${workerDisplayName(input.toWorkerId)}`,
      actorWorkerId: fromWorkerId,
      targetWorkerId: input.toWorkerId,
      stepId: input.step.id,
      stepKey: input.step.key,
      scope,
      sensitivity,
      attemptedExecutionMode: input.step.executionMode,
      runExecutionMode: input.run.executionMode,
      evaluatedAt: input.occurredAt,
    },
    checks,
  );
}

export function evaluateExecutionModePermission(
  input: ModeChangePermissionInput,
): PermissionEvaluation {
  const actorWorkerId = input.workerId ?? input.step?.assignedWorkerId ?? input.run.currentWorkerId;
  const scope = input.step ? scopeForStepKey(input.step.key) : "execution";
  const stageKey = input.step ? stageForStepKey(input.step.key) : "controlled-execution";
  const sensitivity: PermissionSensitivityLevel = input.toMode === "execute"
    ? "restricted"
    : sensitivityForScope(scope, input.step?.key);
  const checks: PermissionCheck[] = [];

  if (actorWorkerId) {
    checks.push(
      createCheck(
        "capability_scope_match",
        hasScopeCapability(actorWorkerId, scope) ? "pass" : "fail",
        "Actor capability scope",
        hasScopeCapability(actorWorkerId, scope)
          ? `${workerDisplayName(actorWorkerId)} has ${scope} capabilities.`
          : `${workerDisplayName(actorWorkerId)} is outside the ${scope} capability scope.`,
      ),
    );

    checks.push(
      createCheck(
        "stage_scope_match",
        ownsStage(actorWorkerId, stageKey) ? "pass" : "warn",
        "Actor stage ownership",
        ownsStage(actorWorkerId, stageKey)
          ? `${workerDisplayName(actorWorkerId)} can operate in ${stageKey}.`
          : `${workerDisplayName(actorWorkerId)} is switching mode outside their primary stage ownership.`,
      ),
    );
  } else {
    checks.push(
      createCheck(
        "capability_scope_match",
        "fail",
        "Actor capability scope",
        "Execution mode change requires a responsible worker identity.",
      ),
    );

    checks.push(
      createCheck(
        "stage_scope_match",
        "fail",
        "Actor stage ownership",
        "Execution mode change cannot be attributed to a worker stage owner.",
      ),
    );
  }

  if (input.toMode === "execute") {
    checks.push(
      createCheck(
        "mode_switch_authorized",
        actorWorkerId && executeModeSwitchWorkers.has(actorWorkerId) ? "pass" : "fail",
        "Execute mode switch authorization",
        actorWorkerId && executeModeSwitchWorkers.has(actorWorkerId)
          ? `${workerDisplayName(actorWorkerId)} is authorized to initiate execute mode.`
          : `${actorWorkerId ? workerDisplayName(actorWorkerId) : "Unknown worker"} is not authorized to initiate execute mode.`,
      ),
    );

    if (input.step) {
      checks.push(
        createCheck(
          "execute_mode_worker_allowed",
          scope === "execution" && actorWorkerId === "worker-execution"
            ? "pass"
            : scope === "execution" && actorWorkerId === "worker-approval-coordinator"
              ? "warn"
              : scope === "execution"
                ? "fail"
                : "warn",
          "Execute lane restriction",
          scope === "execution" && actorWorkerId === "worker-execution"
            ? "Execution Worker is switching the controlled execution step to execute mode."
            : scope === "execution" && actorWorkerId === "worker-approval-coordinator"
              ? "Approval Coordinator can stage execute mode, but reviewer sign-off is still required."
              : scope === "execution"
                ? "Only Execution Worker or Approval Coordinator can stage execute mode for this step."
                : "Switching non-execution scope into execute mode should be reviewed.",
        ),
      );
    } else {
      checks.push(
        createCheck(
          "execute_mode_worker_allowed",
          "warn",
          "Execute lane restriction",
          "Global execute-mode changes should be tied to a specific controlled-execution step.",
        ),
      );
    }
  } else {
    checks.push(
      createCheck(
        "mode_switch_authorized",
        "pass",
        "Execute mode switch authorization",
        "Switching into shadow mode remains available for containment.",
      ),
    );

    checks.push(
      createCheck(
        "execute_mode_worker_allowed",
        "pass",
        "Execute lane restriction",
        "No execute-lane action is being enabled.",
      ),
    );
  }

  checks.push(
    createCheck(
      "run_mode_allows_execution",
      input.fromMode === input.toMode ? "warn" : "pass",
      "Mode transition validity",
      input.fromMode === input.toMode
        ? "Requested mode matches the current mode; switch should be reviewed for necessity."
        : `Mode change from ${input.fromMode} to ${input.toMode} is valid.`,
    ),
  );

  checks.push(
    createCheck(
      "sensitive_action_guardrail",
      input.toMode === "execute" && actorWorkerId === "worker-approval-coordinator" ? "warn" : "pass",
      "Sensitive action guardrail",
      input.toMode === "execute" && actorWorkerId === "worker-approval-coordinator"
        ? "Approval Coordinator staged execute mode, which should be held for policy/risk review."
        : "Sensitive mode-change guardrails are satisfied.",
    ),
  );

  const actionLabel = input.step
    ? `Switch ${input.step.title} mode from ${input.fromMode} to ${input.toMode}`
    : `Switch run mode from ${input.fromMode} to ${input.toMode}`;
  const stepSuffix = input.step?.id ?? "run";

  return buildEvaluation(
    {
      id: createEvaluationId(input.run.id, "mode_change", input.occurredAt, stepSuffix),
      actionKind: "mode_change",
      actionLabel,
      actorWorkerId,
      stepId: input.step?.id,
      stepKey: input.step?.key,
      scope,
      sensitivity,
      attemptedExecutionMode: input.toMode,
      runExecutionMode: input.run.executionMode,
      evaluatedAt: input.occurredAt,
    },
    checks,
  );
}

function formatOutcome(outcome: PermissionOutcome) {
  return outcome.slice(0, 1).toUpperCase() + outcome.slice(1);
}

export function createPermissionControlRef(evaluation: PermissionEvaluation): ControlReference {
  return {
    kind: "policy",
    id: evaluation.id,
    label: `Permission ${formatOutcome(evaluation.outcome)} · ${evaluation.actionLabel}`,
    status: evaluation.outcome === "allow" ? "resolved" : "pending",
  };
}

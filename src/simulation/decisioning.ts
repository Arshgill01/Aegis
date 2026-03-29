import type {
  ActionDecisionPayload,
  DecisionAssemblyInput,
  DecisionEvidenceReference,
  DecisionRiskFactorInput,
  DecisionTrigger,
  PermissionSignalInput,
  PolicySignalInput,
  RiskLevel,
  ScenarioStepTemplate,
  ScenarioDecisionOutputs,
  WorkerCapabilityScope,
  WorkflowScenario,
} from "../contracts";
import { scoreRiskFactors } from "./riskScoring";

const outcomeRank = {
  blocked: 3,
  requires_approval: 2,
  allowed_with_attention: 1,
  allowed: 0,
} as const;

const policyOutcomeSeverityDefaults: Record<PolicySignalInput["outcome"], RiskLevel> = {
  allow: "low",
  escalate: "medium",
  block: "high",
};

const permissionOutcomeSeverityDefaults: Record<PermissionSignalInput["outcome"], RiskLevel> = {
  allow: "low",
  requires_approval: "medium",
  deny: "high",
};

const scopeByStepKey: Record<string, WorkerCapabilityScope> = {
  intake: "intake",
  "document-review": "document",
  "vendor-review": "vendor",
  "po-match": "matching",
  "risk-review": "risk",
  "risk-hold": "risk",
  "exception-resolution": "risk",
  "approval-coordination": "approval",
  "controlled-execution": "execution",
  "audit-narration": "audit",
};

function dedupeEvidence(references: DecisionEvidenceReference[]) {
  const uniqueById = new Map<string, DecisionEvidenceReference>();

  references.forEach((reference) => {
    uniqueById.set(reference.id, reference);
  });

  return [...uniqueById.values()];
}

function policySignalsToFactors(signals: PolicySignalInput[]): DecisionRiskFactorInput[] {
  return signals.map((signal) => {
    const severity = signal.severity ?? policyOutcomeSeverityDefaults[signal.outcome];
    const weight =
      signal.outcome === "block"
        ? 0.96
        : signal.outcome === "escalate"
          ? 0.72
          : 0.18;

    return {
      code: `policy:${signal.ruleId}`,
      label: signal.ruleName,
      detail: signal.rationale ?? signal.summary,
      severity,
      weight,
      source: "policy",
      hardStop: signal.outcome === "block",
    };
  });
}

function permissionSignalsToFactors(signals: PermissionSignalInput[]): DecisionRiskFactorInput[] {
  return signals.map((signal) => {
    const severity = signal.severity ?? permissionOutcomeSeverityDefaults[signal.outcome];
    const weight =
      signal.outcome === "deny"
        ? 1
        : signal.outcome === "requires_approval"
          ? 0.78
          : 0.14;

    return {
      code: `permission:${signal.signalId}`,
      label: signal.summary,
      detail: signal.detail ?? signal.summary,
      severity,
      weight,
      source: "permission",
      hardStop: signal.outcome === "deny",
    };
  });
}

function topReason(triggers: DecisionTrigger[], fallback: string) {
  const topTrigger = triggers
    .slice()
    .sort((left, right) => {
      const severityOrder =
        (left.severity === "high" ? 2 : left.severity === "medium" ? 1 : 0)
        - (right.severity === "high" ? 2 : right.severity === "medium" ? 1 : 0);

      if (severityOrder !== 0) {
        return -severityOrder;
      }

      const leftWeight = left.outcome === "block" || left.outcome === "deny" ? 2 : 1;
      const rightWeight = right.outcome === "block" || right.outcome === "deny" ? 2 : 1;
      return rightWeight - leftWeight;
    })[0];

  return topTrigger?.summary ?? fallback;
}

function decisionLabel(outcome: ActionDecisionPayload["outcome"]) {
  switch (outcome) {
    case "allowed":
      return "Allowed";
    case "allowed_with_attention":
      return "Allowed with attention";
    case "requires_approval":
      return "Requires approval";
    case "blocked":
      return "Blocked";
    default:
      return "Decision";
  }
}

function explainDecision(
  outcome: ActionDecisionPayload["outcome"],
  reason: string,
  evidenceCount: number,
) {
  const evidenceSuffix = evidenceCount > 0 ? ` Evidence references: ${evidenceCount}.` : "";

  switch (outcome) {
    case "blocked":
      return `Action is blocked because ${reason}.${evidenceSuffix}`;
    case "requires_approval":
      return `Action requires approval because ${reason}.${evidenceSuffix}`;
    case "allowed_with_attention":
      return `Action can proceed with attention because ${reason}.${evidenceSuffix}`;
    case "allowed":
      return `Action can proceed: ${reason}.${evidenceSuffix}`;
    default:
      return `Decision generated: ${reason}.${evidenceSuffix}`;
  }
}

function recommendation(outcome: ActionDecisionPayload["outcome"]) {
  switch (outcome) {
    case "blocked":
      return "Contain the action and attach missing evidence before retrying this lane.";
    case "requires_approval":
      return "Prepare an approval brief with cited policy and evidence context.";
    case "allowed_with_attention":
      return "Proceed with audit emphasis and monitor subsequent release-sensitive steps.";
    case "allowed":
      return "Proceed in the current lane with standard supervision.";
    default:
      return "Continue under supervised execution.";
  }
}

function severityRank(level: RiskLevel) {
  switch (level) {
    case "high":
      return 3;
    case "medium":
      return 2;
    case "low":
    default:
      return 1;
  }
}

function assembleTriggers(
  policies: PolicySignalInput[],
  permissions: PermissionSignalInput[],
): DecisionTrigger[] {
  const policyTriggers = policies.map<DecisionTrigger>((policy) => ({
    id: `policy:${policy.ruleId}`,
    source: "policy",
    title: policy.ruleName,
    summary: policy.rationale ?? policy.summary,
    outcome: policy.outcome,
    severity: policy.severity ?? policyOutcomeSeverityDefaults[policy.outcome],
  }));

  const permissionTriggers = permissions.map<DecisionTrigger>((permission) => ({
    id: `permission:${permission.signalId}`,
    source: "permission",
    title: permission.summary,
    summary: permission.detail ?? permission.summary,
    outcome: permission.outcome,
    severity: permission.severity ?? permissionOutcomeSeverityDefaults[permission.outcome],
  }));

  return [...policyTriggers, ...permissionTriggers];
}

export function assembleActionDecision(input: DecisionAssemblyInput): ActionDecisionPayload {
  const policyFactors = policySignalsToFactors(input.policies);
  const permissionFactors = permissionSignalsToFactors(input.permissions);
  const contextFactors = input.contextualFactors ?? [];
  const allFactors = [...policyFactors, ...permissionFactors, ...contextFactors];
  const scored = scoreRiskFactors(allFactors);
  const triggered = assembleTriggers(input.policies, input.permissions);

  const blockedByPolicy = input.policies.some((policy) => policy.outcome === "block");
  const blockedByPermission = input.permissions.some((permission) => permission.outcome === "deny");
  const requiresApproval =
    input.policies.some((policy) => policy.outcome === "escalate")
    || input.permissions.some((permission) => permission.outcome === "requires_approval");

  const outcome =
    blockedByPolicy || blockedByPermission
      ? "blocked"
      : requiresApproval
        ? "requires_approval"
        : scored.severity !== "low" || scored.score >= 30
          ? "allowed_with_attention"
          : "allowed";

  const evidence = dedupeEvidence([
    ...(input.evidence ?? []),
    ...input.policies.flatMap((policy) => policy.evidence ?? []),
    ...input.permissions.flatMap((permission) => permission.evidence ?? []),
  ]);

  const strongestFactorDetail =
    scored.factors[0]?.detail
    ?? scored.factors[0]?.label
    ?? "no material risk factors were detected";
  const reason = topReason(triggered, strongestFactorDetail);

  return {
    decisionId: `${input.action.runId}:${input.action.stepId}:decision`,
    action: input.action,
    outcome,
    score: scored.score,
    severity: scored.severity,
    requiresApproval: outcome === "requires_approval",
    auditEmphasis: outcomeRank[outcome] > outcomeRank.allowed || scored.score >= 40,
    summary: `${decisionLabel(outcome)} (${scored.severity}, score ${scored.score})`,
    explanation: explainDecision(outcome, reason, evidence.length),
    recommendedAction: recommendation(outcome),
    triggered,
    riskFactors: scored.factors,
    evidence,
  };
}

function resolveStepScope(stepKey: string): WorkerCapabilityScope | undefined {
  return scopeByStepKey[stepKey];
}

function toEvidence(
  id: string,
  kind: DecisionEvidenceReference["kind"],
  label: string,
  detail?: string,
): DecisionEvidenceReference {
  return { id, kind, label, detail };
}

function mapRiskNarrativeToFactor(statement: string, index: number): DecisionRiskFactorInput {
  const normalized = statement.toLowerCase();

  if (normalized.includes("missing") || normalized.includes("blocked") || normalized.includes("failed")) {
    return {
      code: `context-${index}`,
      label: "Missing or blocking condition",
      detail: statement,
      severity: "high",
      weight: 0.82,
      source: "context",
    };
  }

  if (
    normalized.includes("variance")
    || normalized.includes("exceeds")
    || normalized.includes("changed")
    || normalized.includes("drift")
    || normalized.includes("unresolved")
  ) {
    return {
      code: `context-${index}`,
      label: "Material control variance",
      detail: statement,
      severity: "medium",
      weight: 0.62,
      source: "context",
    };
  }

  return {
    code: `context-${index}`,
    label: "Operational context",
    detail: statement,
    severity: "low",
    weight: 0.36,
    source: "context",
  };
}

function policySignalsForStep(
  scenario: WorkflowScenario,
  step: ScenarioStepTemplate,
): PolicySignalInput[] {
  const matchingRules = scenario.policyRules.filter(
    (rule) => !rule.appliesToStepKeys || rule.appliesToStepKeys.includes(step.key),
  );

  return matchingRules.map((rule) => ({
    ruleId: rule.id,
    ruleName: rule.name,
    outcome: rule.outcome,
    severity: rule.severity,
    summary: rule.description,
    rationale: rule.rationale ?? rule.description,
    evidence: (rule.evidenceArtifactIds ?? [])
      .map((artifactId) => scenario.artifacts.find((artifact) => artifact.id === artifactId))
      .filter((artifact): artifact is NonNullable<typeof artifact> => Boolean(artifact))
      .map((artifact) =>
        toEvidence(
          artifact.id,
          "artifact",
          artifact.title,
          artifact.summary,
        )),
  }));
}

function permissionSignalsForStep(
  scenario: WorkflowScenario,
  step: ScenarioStepTemplate,
): PermissionSignalInput[] {
  const worker = scenario.workers.find((candidate) => candidate.id === step.assignedWorkerId);
  const requiredScope = resolveStepScope(step.key);
  const signals: PermissionSignalInput[] = [];

  if (requiredScope && worker) {
    const hasScope = worker.capabilities.some((capability) => capability.scope === requiredScope);

    signals.push(
      hasScope
        ? {
            signalId: `${step.id}:scope-ok`,
            outcome: "allow",
            severity: "low",
            summary: `${worker.name} has ${requiredScope} scope`,
            detail: `Assigned worker capability scope includes ${requiredScope}.`,
          }
        : {
            signalId: `${step.id}:scope-missing`,
            outcome: "deny",
            severity: "high",
            summary: `${worker.name} lacks ${requiredScope} scope`,
            detail: `Assigned worker cannot execute ${step.key} without ${requiredScope} permission scope.`,
          },
    );
  }

  if (step.executionMode === "execute" && worker?.defaultExecutionMode !== "execute") {
    signals.push({
      signalId: `${step.id}:mode-gate`,
      outcome: "requires_approval",
      severity: "medium",
      summary: "Execute lane requires explicit release",
      detail: `${worker?.name ?? "Assigned worker"} defaults to shadow mode and needs explicit execute clearance.`,
    });
  }

  if (scenario.approvalRequests.some((request) => request.status === "pending") && step.executionMode === "execute") {
    signals.push({
      signalId: `${step.id}:pending-approval`,
      outcome: "requires_approval",
      severity: "high",
      summary: "Pending human gate is active",
      detail: "A named approval request is still open for this run.",
      evidence: scenario.approvalRequests
        .filter((request) => request.status === "pending")
        .map((request) =>
          toEvidence(request.id, "permission", request.title, request.reason)),
    });
  }

  if (signals.length === 0) {
    signals.push({
      signalId: `${step.id}:default-allow`,
      outcome: "allow",
      severity: "low",
      summary: "No permission constraints detected",
      detail: "The action remains within current worker and lane constraints.",
    });
  }

  return signals;
}

function stepEvidenceReferences(scenario: WorkflowScenario, step: ScenarioStepTemplate) {
  return step.artifactIds
    .map((artifactId) => scenario.artifacts.find((artifact) => artifact.id === artifactId))
    .filter((artifact): artifact is NonNullable<typeof artifact> => Boolean(artifact))
    .map((artifact) =>
      toEvidence(
        artifact.id,
        "artifact",
        artifact.title,
        artifact.summary,
      ));
}

function buildStepDecision(
  scenario: WorkflowScenario,
  step: ScenarioStepTemplate,
): ActionDecisionPayload {
  const contextualFactor = scenario.riskAssessment.factors[0]
    ? [mapRiskNarrativeToFactor(scenario.riskAssessment.factors[0], 0)]
    : [];

  return assembleActionDecision({
    action: {
      scenarioId: scenario.id,
      runId: scenario.runId,
      stepId: step.id,
      stepKey: step.key,
      stepTitle: step.title,
      workerId: step.assignedWorkerId,
      executionMode: step.executionMode,
    },
    policies: policySignalsForStep(scenario, step),
    permissions: permissionSignalsForStep(scenario, step),
    contextualFactors: contextualFactor,
    evidence: stepEvidenceReferences(scenario, step),
  });
}

function finalDecisionActionContext(scenario: WorkflowScenario) {
  const finalStep = [...scenario.stepTemplates].sort((left, right) => right.sequence - left.sequence)[0];

  return {
    scenarioId: scenario.id,
    runId: scenario.runId,
    stepId: finalStep?.id ?? `${scenario.runId}:final`,
    stepKey: finalStep?.key ?? "final-decision",
    stepTitle: finalStep?.title ?? "Final control decision",
    workerId: finalStep?.assignedWorkerId ?? scenario.workers[0].id,
    executionMode: finalStep?.executionMode ?? scenario.executionMode,
  } as const;
}

function finalPermissionSignals(scenario: WorkflowScenario): PermissionSignalInput[] {
  const finalStep = [...scenario.stepTemplates].sort((left, right) => right.sequence - left.sequence)[0];
  const stepSignals = finalStep ? permissionSignalsForStep(scenario, finalStep) : [];

  const pendingApprovalSignals = scenario.approvalRequests
    .filter((request) => request.status === "pending")
    .map<PermissionSignalInput>((request) => ({
      signalId: `${scenario.runId}:${request.id}:pending`,
      outcome: "requires_approval",
      severity: "high",
      summary: "Pending human approval gate remains unresolved",
      detail: request.reason,
      evidence: [toEvidence(request.id, "permission", request.title, request.reason)],
    }));

  return [...stepSignals, ...pendingApprovalSignals];
}

function pickHighestOutcome(decisions: ActionDecisionPayload[]): ActionDecisionPayload["outcome"] {
  return decisions.reduce<ActionDecisionPayload["outcome"]>(
    (selected, current) =>
      outcomeRank[current.outcome] > outcomeRank[selected] ? current.outcome : selected,
    "allowed",
  );
}

export function buildScenarioDecisionOutputs(scenario: WorkflowScenario): ScenarioDecisionOutputs {
  const stepDecisions = [...scenario.stepTemplates]
    .sort((left, right) => left.sequence - right.sequence)
    .map((step) => buildStepDecision(scenario, step));

  const contextualFactors = scenario.riskAssessment.factors.map((statement, index) =>
    mapRiskNarrativeToFactor(statement, index),
  );
  const finalDecision = assembleActionDecision({
    action: finalDecisionActionContext(scenario),
    policies: scenario.policyRules.map((rule) => ({
      ruleId: rule.id,
      ruleName: rule.name,
      outcome: rule.outcome,
      severity: rule.severity,
      summary: rule.description,
      rationale: rule.rationale ?? rule.description,
    })),
    permissions: finalPermissionSignals(scenario),
    contextualFactors,
    evidence: scenario.artifacts.map((artifact) =>
      toEvidence(artifact.id, "artifact", artifact.title, artifact.summary)),
  });

  const strongestStepOutcome = pickHighestOutcome(stepDecisions);

  if (outcomeRank[strongestStepOutcome] > outcomeRank[finalDecision.outcome]) {
    const strongestSummary = `${decisionLabel(strongestStepOutcome)} (${finalDecision.severity}, score ${finalDecision.score})`;
    const strongestExplanation =
      strongestStepOutcome === "blocked"
        ? `Action is blocked because one or more workflow steps are blocked or denied. Evidence references: ${finalDecision.evidence.length}.`
        : strongestStepOutcome === "requires_approval"
          ? `Action requires approval because one or more workflow steps opened a named control gate. Evidence references: ${finalDecision.evidence.length}.`
          : finalDecision.explanation;

    return {
      stepDecisions,
      finalDecision: {
        ...finalDecision,
        outcome: strongestStepOutcome,
        summary: strongestSummary,
        explanation: strongestExplanation,
        recommendedAction: recommendation(strongestStepOutcome),
        requiresApproval: strongestStepOutcome === "requires_approval",
        auditEmphasis: true,
      },
    };
  }

  return {
    finalDecision,
    stepDecisions,
  };
}

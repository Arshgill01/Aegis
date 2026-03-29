import type { ExecutionMode, RiskLevel } from "./action";
import type { WorkerId } from "./workers";

export const decisionFactorSources = [
  "policy",
  "permission",
  "evidence",
  "context",
] as const;

export type DecisionFactorSource = (typeof decisionFactorSources)[number];

export type DecisionRiskFactorInput = {
  code: string;
  label: string;
  detail: string;
  severity: RiskLevel;
  weight: number;
  source: DecisionFactorSource;
  hardStop?: boolean;
};

export type ScoredDecisionRiskFactor = DecisionRiskFactorInput & {
  normalizedWeight: number;
  severityMultiplier: number;
  sourceMultiplier: number;
  contribution: number;
};

export type RiskScoringOptions = {
  sourceMultipliers?: Partial<Record<DecisionFactorSource, number>>;
  severityMultipliers?: Partial<Record<RiskLevel, number>>;
  mediumThreshold?: number;
  highThreshold?: number;
};

export type RiskScoreSummary = {
  score: number;
  severity: RiskLevel;
  factors: ScoredDecisionRiskFactor[];
  rawContribution: number;
  maxContribution: number;
  factorCount: number;
  hardStopTriggered: boolean;
};

export const decisionOutcomes = [
  "allowed",
  "allowed_with_attention",
  "requires_approval",
  "blocked",
] as const;

export type DecisionOutcome = (typeof decisionOutcomes)[number];

export const policySignalOutcomes = ["allow", "escalate", "block"] as const;

export type PolicySignalOutcome = (typeof policySignalOutcomes)[number];

export const permissionSignalOutcomes = ["allow", "requires_approval", "deny"] as const;

export type PermissionSignalOutcome = (typeof permissionSignalOutcomes)[number];

export const decisionEvidenceKinds = ["artifact", "policy", "permission", "history"] as const;

export type DecisionEvidenceKind = (typeof decisionEvidenceKinds)[number];

export type DecisionEvidenceReference = {
  id: string;
  kind: DecisionEvidenceKind;
  label: string;
  detail?: string;
};

export type PolicySignalInput = {
  ruleId: string;
  ruleName: string;
  outcome: PolicySignalOutcome;
  severity?: RiskLevel;
  summary: string;
  rationale?: string;
  evidence?: DecisionEvidenceReference[];
};

export type PermissionSignalInput = {
  signalId: string;
  outcome: PermissionSignalOutcome;
  severity?: RiskLevel;
  summary: string;
  detail?: string;
  evidence?: DecisionEvidenceReference[];
};

export type DecisionActionContext = {
  scenarioId: string;
  runId: string;
  stepId: string;
  stepKey: string;
  stepTitle: string;
  workerId: WorkerId;
  executionMode: ExecutionMode;
};

export type DecisionTrigger = {
  id: string;
  source: "policy" | "permission";
  title: string;
  summary: string;
  outcome: PolicySignalOutcome | PermissionSignalOutcome;
  severity: RiskLevel;
};

export type ActionDecisionPayload = {
  decisionId: string;
  action: DecisionActionContext;
  outcome: DecisionOutcome;
  score: number;
  severity: RiskLevel;
  requiresApproval: boolean;
  auditEmphasis: boolean;
  summary: string;
  explanation: string;
  recommendedAction: string;
  triggered: DecisionTrigger[];
  riskFactors: ScoredDecisionRiskFactor[];
  evidence: DecisionEvidenceReference[];
};

export type DecisionAssemblyInput = {
  action: DecisionActionContext;
  policies: PolicySignalInput[];
  permissions: PermissionSignalInput[];
  contextualFactors?: DecisionRiskFactorInput[];
  evidence?: DecisionEvidenceReference[];
};

export type ScenarioDecisionOutputs = {
  finalDecision: ActionDecisionPayload;
  stepDecisions: ActionDecisionPayload[];
};

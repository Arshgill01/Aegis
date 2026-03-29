import type { WorkerCapabilityScope, WorkerId } from "./workers";

export const permissionActionKinds = [
  "step_transition",
  "worker_handoff",
  "mode_change",
] as const;

export type PermissionActionKind = (typeof permissionActionKinds)[number];

export const permissionOutcomes = ["allow", "escalate", "block"] as const;

export type PermissionOutcome = (typeof permissionOutcomes)[number];

export const permissionCheckStatuses = ["pass", "warn", "fail"] as const;

export type PermissionCheckStatus = (typeof permissionCheckStatuses)[number];

export const permissionSensitivityLevels = ["standard", "sensitive", "restricted"] as const;

export type PermissionSensitivityLevel = (typeof permissionSensitivityLevels)[number];

export const permissionRiskLevels = ["low", "medium", "high"] as const;

export type PermissionRiskLevel = (typeof permissionRiskLevels)[number];

export const permissionCheckCodes = [
  "step_assignment_match",
  "capability_scope_match",
  "stage_scope_match",
  "handoff_target_allowed",
  "execute_mode_worker_allowed",
  "run_mode_allows_execution",
  "mode_switch_authorized",
  "sensitive_action_guardrail",
] as const;

export type PermissionCheckCode = (typeof permissionCheckCodes)[number];

export type PermissionCheck = {
  code: PermissionCheckCode;
  status: PermissionCheckStatus;
  label: string;
  detail: string;
};

export type PermissionEvaluation = {
  id: string;
  actionKind: PermissionActionKind;
  actionLabel: string;
  actorWorkerId?: WorkerId;
  targetWorkerId?: WorkerId;
  stepId?: string;
  stepKey?: string;
  scope: WorkerCapabilityScope;
  sensitivity: PermissionSensitivityLevel;
  attemptedExecutionMode: "shadow" | "execute";
  runExecutionMode: "shadow" | "execute";
  outcome: PermissionOutcome;
  riskLevel: PermissionRiskLevel;
  shouldGate: boolean;
  requiresApproval: boolean;
  reason: string;
  triggerCodes: PermissionCheckCode[];
  checks: PermissionCheck[];
  evaluatedAt: string;
};

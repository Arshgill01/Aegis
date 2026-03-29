import type { ScenarioKey } from "./scenarios";
import type { EntityId, EntityReference, IsoTimestamp } from "./shared";
import type { WorkerId } from "./workers";

export const executionModes = ["shadow", "execute"] as const;

export type ExecutionMode = (typeof executionModes)[number];

export const runStatuses = [
  "queued",
  "planning",
  "running",
  "waiting-for-approval",
  "blocked",
  "completed",
  "failed",
  "cancelled",
] as const;

export type RunStatus = (typeof runStatuses)[number];

export const stepStatuses = [
  "pending",
  "ready",
  "running",
  "waiting-for-approval",
  "blocked",
  "completed",
  "failed",
  "cancelled",
  "skipped",
] as const;

export type StepStatus = (typeof stepStatuses)[number];

export const toolInvocationStatuses = [
  "planned",
  "running",
  "succeeded",
  "failed",
  "blocked",
  "skipped",
] as const;

export type ToolInvocationStatus = (typeof toolInvocationStatuses)[number];

export const workflowKinds = [
  "invoice-reconciliation",
  "vendor-onboarding-review",
  "vendor-change-review",
  "payment-release-review",
  "accrual-exception-triage",
] as const;

export type WorkflowKind = (typeof workflowKinds)[number];

export const taskStepKinds = [
  "intake",
  "document-review",
  "vendor-match",
  "po-match",
  "policy-check",
  "risk-review",
  "approval-gate",
  "execution",
  "receipt",
] as const;

export type TaskStepKind = (typeof taskStepKinds)[number];

export const terminalRunStatuses: readonly RunStatus[] = ["completed", "failed", "cancelled"];

export const terminalStepStatuses: readonly StepStatus[] = [
  "completed",
  "failed",
  "cancelled",
  "skipped",
];

export interface LifecycleTransition<TStatus extends string> {
  from?: TStatus;
  to: TStatus;
  changedAt: IsoTimestamp;
  reason: string;
  actorId?: WorkerId;
}

export interface RunStatusChange extends LifecycleTransition<RunStatus> {}

export interface StepStatusChange extends LifecycleTransition<StepStatus> {
  stepId: EntityId;
}

export interface ToolInvocation {
  id: EntityId;
  toolName: string;
  displayName: string;
  status: ToolInvocationStatus;
  executionMode: ExecutionMode;
  workerId: WorkerId;
  argumentsSummary: string;
  targetLabel?: string;
  resultSummary?: string;
  blockedReason?: string;
  startedAt?: IsoTimestamp;
  completedAt?: IsoTimestamp;
  relatedArtifactIds?: EntityId[];
}

export interface TaskStep {
  id: EntityId;
  runId: EntityId;
  kind: TaskStepKind;
  title: string;
  summary: string;
  status: StepStatus;
  sequence: number;
  workerId: WorkerId;
  executionMode: ExecutionMode;
  dependsOnStepIds?: EntityId[];
  startedAt?: IsoTimestamp;
  completedAt?: IsoTimestamp;
  blockedReason?: string;
  statusHistory?: StepStatusChange[];
  toolInvocations?: ToolInvocation[];
  inputArtifactIds?: EntityId[];
  outputArtifactIds?: EntityId[];
  riskAssessmentIds?: EntityId[];
  approvalRequestId?: EntityId;
  exceptionCaseIds?: EntityId[];
}

export interface WorkflowRunContext {
  companyName: string;
  invoiceId?: EntityId;
  vendorId?: EntityId;
  purchaseOrderId?: EntityId;
  paymentIntentId?: EntityId;
  exceptionCaseIds?: EntityId[];
  artifactIds: EntityId[];
}

export interface WorkflowRun {
  id: EntityId;
  title: string;
  workflowKind: WorkflowKind;
  scenarioKey: ScenarioKey;
  subject: EntityReference;
  status: RunStatus;
  executionMode: ExecutionMode;
  currentWorkerId?: WorkerId;
  currentStepId?: EntityId;
  createdAt: IsoTimestamp;
  startedAt?: IsoTimestamp;
  completedAt?: IsoTimestamp;
  statusHistory?: RunStatusChange[];
  steps: TaskStep[];
  context: WorkflowRunContext;
  tags?: string[];
}

export function isTerminalRunStatus(status: RunStatus) {
  return terminalRunStatuses.includes(status);
}

export function isTerminalStepStatus(status: StepStatus) {
  return terminalStepStatuses.includes(status);
}

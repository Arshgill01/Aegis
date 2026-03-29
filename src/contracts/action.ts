import type {
  WorkerId,
  WorkerRole,
  WorkerStageOwnership,
} from "./workers";

export const executionModes = ["shadow", "execute"] as const;
export type ExecutionMode = (typeof executionModes)[number];

export const riskLevels = ["low", "medium", "high"] as const;
export type RiskLevel = (typeof riskLevels)[number];

export const runStatuses = [
  "queued",
  "planning",
  "in_progress",
  "waiting",
  "blocked",
  "completed",
  "failed",
  "cancelled",
] as const;
export type RunStatus = (typeof runStatuses)[number];

export const stepStatuses = [
  "queued",
  "ready",
  "in_progress",
  "waiting",
  "blocked",
  "completed",
  "failed",
  "skipped",
  "cancelled",
] as const;
export type StepStatus = (typeof stepStatuses)[number];

export const controlRefKinds = ["policy", "approval", "replay"] as const;
export type ControlRefKind = (typeof controlRefKinds)[number];

export type ControlReferenceStatus = "pending" | "resolved" | "linked";

export type ControlReference = {
  kind: ControlRefKind;
  id: string;
  label: string;
  status: ControlReferenceStatus;
};

export type AgentWorker = {
  id: WorkerId;
  name: string;
  role: WorkerRole;
  roleLabel: string;
  responsibility: string;
  stageOwnership: WorkerStageOwnership;
  handoffTargets: WorkerId[];
  defaultExecutionMode: ExecutionMode;
};

export const toolInvocationStatuses = [
  "queued",
  "in_progress",
  "completed",
  "failed",
  "cancelled",
] as const;
export type ToolInvocationStatus = (typeof toolInvocationStatuses)[number];

export type ToolInvocation = {
  id: string;
  toolName: string;
  summary: string;
  status: ToolInvocationStatus;
  executionMode: ExecutionMode;
  requestedAt?: string;
  completedAt?: string;
  outcomeSummary?: string;
};

export type TaskStep = {
  id: string;
  key: string;
  title: string;
  description: string;
  sequence: number;
  status: StepStatus;
  executionMode: ExecutionMode;
  assignedWorkerId: WorkerId;
  dependsOnStepIds: string[];
  artifactIds: string[];
  toolInvocations: ToolInvocation[];
  controlRefs: ControlReference[];
  startedAt?: string;
  completedAt?: string;
  updatedAt: string;
  outcomeSummary?: string;
  blockedReason?: string;
};

export type WorkflowRun = {
  id: string;
  scenarioId: string;
  workflowKey: string;
  workflowLabel: string;
  companyName: string;
  status: RunStatus;
  executionMode: ExecutionMode;
  riskLevel: RiskLevel;
  currentStepId?: string;
  currentWorkerId?: WorkerId;
  artifactIds: string[];
  controlRefs: ControlReference[];
  eventIds: string[];
  steps: TaskStep[];
  createdAt: string;
  startedAt?: string;
  updatedAt: string;
  completedAt?: string;
};

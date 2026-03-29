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

export const workerRoles = [
  "intake",
  "document_review",
  "vendor_review",
  "risk",
  "approval",
  "execution",
  "audit",
] as const;
export type AgentWorkerRole = (typeof workerRoles)[number];

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
  id: string;
  name: string;
  role: AgentWorkerRole;
  lane: string;
  description: string;
  defaultExecutionMode: ExecutionMode;
  capabilities: string[];
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
  assignedWorkerId: string;
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

export type WorkflowStage = {
  id: string;
  stepId: string;
  key: string;
  title: string;
  sequence: number;
  status: StepStatus;
  ownerWorkerId: string;
  executionMode: ExecutionMode;
  dependsOnStageIds: string[];
  startedAt?: string;
  completedAt?: string;
  updatedAt: string;
};

export type StageStatusTransition = {
  id: string;
  sequence: number;
  stageId: string;
  stepId: string;
  fromStatus?: StepStatus;
  toStatus: StepStatus;
  workerId: string;
  executionMode: ExecutionMode;
  occurredAt: string;
};

export type WorkerHandoff = {
  id: string;
  sequence: number;
  stageId: string;
  stepId: string;
  fromWorkerId?: string;
  toWorkerId: string;
  executionMode: ExecutionMode;
  occurredAt: string;
};

export type ExecutionModeTransition = {
  id: string;
  sequence: number;
  fromMode: ExecutionMode;
  toMode: ExecutionMode;
  occurredAt: string;
  stageId?: string;
  stepId?: string;
  workerId?: string;
};

export type WorkflowRunOrchestration = {
  stages: WorkflowStage[];
  currentStageId?: string;
  stageHistory: StageStatusTransition[];
  handoffs: WorkerHandoff[];
  modeHistory: ExecutionModeTransition[];
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
  currentWorkerId?: string;
  currentStageId?: string;
  artifactIds: string[];
  controlRefs: ControlReference[];
  eventIds: string[];
  steps: TaskStep[];
  orchestration: WorkflowRunOrchestration;
  createdAt: string;
  startedAt?: string;
  updatedAt: string;
  completedAt?: string;
};

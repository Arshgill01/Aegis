import type {
  ControlReference,
  ExecutionMode,
  RunStatus,
  StepStatus,
} from "./action";

export const artifactKinds = [
  "invoice",
  "purchase_order",
  "vendor_profile",
  "payment_intent",
  "receipt",
  "exception_note",
  "email",
] as const;
export type ArtifactKind = (typeof artifactKinds)[number];

export type ArtifactSource = "simulation" | "email" | "erp" | "vendor_portal";

export type ArtifactStatus = "captured" | "reviewed" | "derived" | "produced";

export type Artifact = {
  id: string;
  kind: ArtifactKind;
  title: string;
  summary: string;
  source: ArtifactSource;
  status: ArtifactStatus;
  createdAt: string;
  linkedEntityId?: string;
};

export const auditEventKinds = [
  "run.created",
  "run.status_changed",
  "step.status_changed",
  "step.handoff",
  "artifact.attached",
  "mode.changed",
] as const;
export type AuditEventKind = (typeof auditEventKinds)[number];

export type AuditActor =
  | {
      type: "system";
      label: string;
    }
  | {
      type: "worker";
      workerId: string;
      label: string;
    };

export type AuditStateChange = {
  entity: "run" | "step" | "mode";
  from?: string;
  to: string;
};

export type AuditMetadataValue = string | number | boolean;

export type AuditEvent = {
  id: string;
  sequence: number;
  runId: string;
  stepId?: string;
  kind: AuditEventKind;
  title: string;
  detail: string;
  actor: AuditActor;
  executionMode: ExecutionMode;
  occurredAt: string;
  stateChange?: AuditStateChange;
  runStatus?: RunStatus;
  stepStatus?: StepStatus;
  artifactIds: string[];
  controlRefs: ControlReference[];
  metadata?: Record<string, AuditMetadataValue>;
};

export type ReplayFrame = {
  id: string;
  eventId: string;
  runId: string;
  stepId?: string;
  sequence: number;
  occurredAt: string;
  title: string;
  summary: string;
  actorLabel: string;
  executionMode: ExecutionMode;
  artifactIds: string[];
};

export type ExecutionReceipt = {
  id: string;
  runId: string;
  scenarioId: string;
  outcome: RunStatus;
  generatedAt: string;
  executionMode: ExecutionMode;
  eventCount: number;
  completedStepCount: number;
  waitingStepCount: number;
  blockedStepCount: number;
  failedStepCount: number;
  finalWorkerId?: string;
  finalStepId?: string;
};

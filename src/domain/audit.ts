import type { ApprovalStatus } from "./approval";
import type { EntityId, EntityReference, IsoTimestamp, Metadata } from "./shared";
import type { RiskLevel } from "./policy";
import type {
  ExecutionMode,
  RunStatus,
  RunStatusChange,
  StepStatus,
  StepStatusChange,
} from "./workflow";
import type { WorkerId } from "./workers";

export const auditActorTypes = ["worker", "human", "system"] as const;

export type AuditActorType = (typeof auditActorTypes)[number];

export const auditEventTypes = [
  "run-created",
  "run-status-changed",
  "step-status-changed",
  "tool-invoked",
  "risk-assessed",
  "approval-requested",
  "approval-decided",
  "artifact-attached",
  "worker-handed-off",
  "execution-receipt-issued",
] as const;

export type AuditEventType = (typeof auditEventTypes)[number];

export interface AuditActor {
  actorType: AuditActorType;
  actorId: string;
  label: string;
  role?: string;
}

export interface AuditEvent {
  id: EntityId;
  runId: EntityId;
  stepId?: EntityId;
  type: AuditEventType;
  title: string;
  summary: string;
  occurredAt: IsoTimestamp;
  actor: AuditActor;
  executionMode: ExecutionMode;
  relatedArtifactIds?: EntityId[];
  highlightedEntities?: EntityReference[];
  riskAssessmentId?: EntityId;
  approvalRequestId?: EntityId;
  policyRuleIds?: EntityId[];
  runStatusChange?: RunStatusChange;
  stepStatusChange?: StepStatusChange;
  metadata?: Metadata;
}

export interface ReplayFrame {
  id: EntityId;
  runId: EntityId;
  eventId: EntityId;
  order: number;
  occurredAt: IsoTimestamp;
  title: string;
  narrative: string;
  snapshot: {
    runStatus: RunStatus;
    stepStatus?: StepStatus;
    currentWorkerId?: WorkerId;
    executionMode: ExecutionMode;
    riskLevel?: RiskLevel;
    approvalStatus?: ApprovalStatus;
  };
  focusArtifactIds?: EntityId[];
  highlightedEntities?: EntityReference[];
}

export const executionReceiptDispositions = [
  "executed",
  "held",
  "failed",
  "cancelled",
] as const;

export type ExecutionReceiptDisposition =
  (typeof executionReceiptDispositions)[number];

export interface ExecutionReceipt {
  id: EntityId;
  runId: EntityId;
  finalStatus: RunStatus;
  disposition: ExecutionReceiptDisposition;
  issuedAt: IsoTimestamp;
  executionMode: ExecutionMode;
  summary: string;
  finalWorkerId?: WorkerId;
  auditEventIds: EntityId[];
  artifactIds: EntityId[];
  policyRuleIds: EntityId[];
  approvalRequestIds: EntityId[];
  riskAssessmentIds: EntityId[];
  stepCount: number;
  executedStepCount: number;
  blockedStepCount: number;
}

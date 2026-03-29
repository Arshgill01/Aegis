import type { PolicyOutcome } from "./policy";
import type { EntityId, EntityReference, IsoTimestamp } from "./shared";
import type { ExecutionMode, RunStatus } from "./workflow";
import type { WorkerId } from "./workers";

export const approvalStatuses = [
  "pending",
  "approved",
  "rejected",
  "expired",
  "cancelled",
] as const;

export type ApprovalStatus = (typeof approvalStatuses)[number];

export const approvalActionTypes = [
  "payment-release",
  "erp-post",
  "vendor-change",
  "tolerance-override",
  "exception-release",
] as const;

export type ApprovalActionType = (typeof approvalActionTypes)[number];

export interface ApprovalDecision {
  id: EntityId;
  requestId: EntityId;
  status: Exclude<ApprovalStatus, "pending">;
  decidedAt: IsoTimestamp;
  decidedBy: string;
  rationale: string;
  conditions?: string[];
  resumeRunStatus?: RunStatus;
}

export interface ApprovalActionContext {
  type: ApprovalActionType;
  label: string;
  description: string;
  executionMode: ExecutionMode;
  target: EntityReference;
  expectedOutcome: PolicyOutcome;
}

export interface ApprovalRequest {
  id: EntityId;
  runId: EntityId;
  stepId: EntityId;
  status: ApprovalStatus;
  title: string;
  summary: string;
  requestedByWorkerId: WorkerId;
  reviewerRole: string;
  reviewerLabel?: string;
  requestedAt: IsoTimestamp;
  dueAt?: IsoTimestamp;
  action: ApprovalActionContext;
  riskAssessmentId?: EntityId;
  policyRuleIds?: EntityId[];
  supportingArtifactIds?: EntityId[];
  decision?: ApprovalDecision;
}

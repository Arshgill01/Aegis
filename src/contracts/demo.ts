import type {
  AgentWorker,
  ControlReference,
  ExecutionMode,
  RiskLevel,
  RunStatus,
  StepStatus,
  ToolInvocation,
} from "./action";
import type { WorkerId } from "./workers";
import type { Artifact } from "./audit";

export type PolicyOutcome = "allow" | "escalate" | "block";

export type PolicyRule = {
  id: string;
  name: string;
  description: string;
  outcome: PolicyOutcome;
  scope: string;
  severity?: RiskLevel;
  rationale?: string;
  appliesToStepKeys?: string[];
  evidenceArtifactIds?: string[];
};

export type RiskAssessment = {
  id: string;
  severity: RiskLevel;
  score: number;
  summary: string;
  factors: string[];
};

export type ApprovalRequestStatus = "pending" | "approved" | "rejected" | "not_requested";

export type ApprovalRequest = {
  id: string;
  title: string;
  actionLabel: string;
  status: ApprovalRequestStatus;
  requestedAt: string;
  assigneeLabel: string;
  reason: string;
};

export type ApprovalDecision = {
  id: string;
  requestId: string;
  outcome: "approved" | "rejected";
  decidedAt: string;
  decidedBy: string;
  note?: string;
};

export type Invoice = {
  id: string;
  invoiceNumber: string;
  vendorId: string;
  amountUsd: number;
  submittedAt: string;
  dueDate: string;
};

export type Vendor = {
  id: string;
  name: string;
  trustTier: "trusted" | "monitored" | "unverified";
  lastVerifiedAt: string;
};

export type PurchaseOrder = {
  id: string;
  poNumber: string;
  amountUsd: number;
  issuedAt: string;
};

export type PaymentIntent = {
  id: string;
  amountUsd: number;
  beneficiary: string;
  method: "ach" | "wire";
  scheduledFor: string;
};

export type ExceptionCase = {
  id: string;
  code: string;
  summary: string;
  severity: RiskLevel;
};

export type PlannedToolInvocation = Pick<
  ToolInvocation,
  "id" | "toolName" | "summary" | "executionMode"
>;

export type ScenarioStepTemplate = {
  id: string;
  key: string;
  title: string;
  description: string;
  sequence: number;
  assignedWorkerId: WorkerId;
  executionMode: ExecutionMode;
  dependsOnStepIds: string[];
  artifactIds: string[];
  toolInvocations: PlannedToolInvocation[];
  controlRefs: ControlReference[];
};

type SimulationDirectiveBase = {
  atMinute: number;
  title: string;
  detail: string;
  workerId?: WorkerId;
  controlRefs?: ControlReference[];
  metadata?: Record<string, string | number | boolean>;
};

export type ScenarioRunStatusDirective = SimulationDirectiveBase & {
  kind: "run_status";
  toStatus: RunStatus;
};

export type ScenarioStepStatusDirective = SimulationDirectiveBase & {
  kind: "step_status";
  stepId: string;
  toStatus: StepStatus;
  outcomeSummary?: string;
  blockedReason?: string;
};

export type ScenarioHandoffDirective = SimulationDirectiveBase & {
  kind: "handoff";
  stepId: string;
  nextWorkerId: WorkerId;
};

export type ScenarioArtifactDirective = SimulationDirectiveBase & {
  kind: "artifact";
  stepId?: string;
  artifactIds: string[];
};

export type ScenarioModeDirective = SimulationDirectiveBase & {
  kind: "mode";
  mode: ExecutionMode;
  stepId?: string;
};

export type SimulationDirective =
  | ScenarioRunStatusDirective
  | ScenarioStepStatusDirective
  | ScenarioHandoffDirective
  | ScenarioArtifactDirective
  | ScenarioModeDirective;

export type WorkflowScenario = {
  id: string;
  runId: string;
  workflowKey: string;
  workflowLabel: string;
  companyName: string;
  title: string;
  narrative: string;
  seedTime: string;
  executionMode: ExecutionMode;
  workers: AgentWorker[];
  riskAssessment: RiskAssessment;
  policyRules: PolicyRule[];
  approvalRequests: ApprovalRequest[];
  approvalDecisions: ApprovalDecision[];
  artifacts: Artifact[];
  invoice?: Invoice;
  vendor?: Vendor;
  purchaseOrder?: PurchaseOrder;
  paymentIntent?: PaymentIntent;
  exceptionCase?: ExceptionCase;
  stepTemplates: ScenarioStepTemplate[];
  directives: SimulationDirective[];
};

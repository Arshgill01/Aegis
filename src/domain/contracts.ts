export type RiskLevel = "low" | "medium" | "high";

export type ExecutionMode = "shadow" | "execute_ready";

export type RunStatus =
  | "queued"
  | "planning"
  | "running"
  | "waiting_for_approval"
  | "blocked"
  | "completed";

export type StepStatus =
  | "queued"
  | "running"
  | "completed"
  | "waiting_for_approval"
  | "blocked";

export type PolicyOutcome = "allow" | "escalate" | "block";

export type ApprovalStatus = "pending" | "approved" | "rejected";

export type ArtifactKind =
  | "invoice"
  | "purchase_order"
  | "bank_change_request"
  | "dock_receipt"
  | "mismatch_receipt"
  | "payment_packet";

export type AgentWorker = {
  id: string;
  name: string;
  role: string;
  focus: string;
  posture: string;
  queueDepth: number;
  loadPercent: number;
};

export type Vendor = {
  id: string;
  name: string;
  trustTier: "trusted" | "watch" | "restricted";
  region: string;
};

export type Invoice = {
  id: string;
  invoiceNumber: string;
  amountUsd: number;
  currency: string;
  receivedAt: string;
};

export type PurchaseOrder = {
  id: string;
  poNumber: string;
  amountUsd: number;
  status: "matched" | "variance" | "missing_receipt";
};

export type PaymentIntent = {
  id: string;
  amountUsd: number;
  beneficiary: string;
  scheduledDate: string;
  status: "prepared" | "paused" | "ready" | "released";
};

export type Artifact = {
  id: string;
  kind: ArtifactKind;
  title: string;
  summary: string;
};

export type WorkflowRun = {
  id: string;
  workflow: string;
  accountName: string;
  status: RunStatus;
  mode: ExecutionMode;
  riskLevel: RiskLevel;
  currentStage: string;
  ownerWorkerId: string;
  nextAction: string;
  etaMinutes: number;
};

export type TaskStep = {
  id: string;
  runId: string;
  title: string;
  summary: string;
  status: StepStatus;
  workerId: string;
  mode: ExecutionMode;
};

export type PolicyRule = {
  id: string;
  name: string;
  scope: string;
  summary: string;
  trigger: string;
  outcome: PolicyOutcome;
  severity: RiskLevel;
};

export type ApprovalRequest = {
  id: string;
  runId: string;
  title: string;
  requestedAction: string;
  reason: string;
  assignee: string;
  dueLabel: string;
  status: ApprovalStatus;
  riskLevel: RiskLevel;
  triggerLabel: string;
};

export type AuditEvent = {
  id: string;
  runId: string;
  timestamp: string;
  title: string;
  detail: string;
  actorName: string;
  category: string;
  riskLevel: RiskLevel;
};

export type WorkflowScenario = {
  id: string;
  title: string;
  phase: string;
  narrative: string;
  watchpoints: string[];
  run: WorkflowRun;
  vendor: Vendor;
  invoice: Invoice;
  purchaseOrder?: PurchaseOrder;
  paymentIntent: PaymentIntent;
  artifacts: Artifact[];
  steps: TaskStep[];
  policies: PolicyRule[];
  approvals: ApprovalRequest[];
  events: AuditEvent[];
};

export type SeededAegisData = {
  workers: AgentWorker[];
  scenarios: WorkflowScenario[];
};

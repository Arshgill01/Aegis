export type WorkerId =
  | "worker-intake"
  | "worker-document-review"
  | "worker-vendor-review"
  | "worker-po-match"
  | "worker-policy-review"
  | "worker-risk"
  | "worker-approval-coordinator"
  | "worker-execution"
  | "worker-audit-narrator";

export type WorkerSupervisionModel =
  | "shadow-first"
  | "approval-gated"
  | "controlled-execution";

export type VendorTrustTier = "trusted" | "monitored" | "restricted";

export type VendorOnboardingStatus = "active" | "pending_review";

export type ArtifactKind =
  | "invoice_pdf"
  | "purchase_order_pdf"
  | "statement_of_work"
  | "goods_receipt"
  | "vendor_master_snapshot"
  | "bank_change_request"
  | "remittance_comparison"
  | "tax_document"
  | "completion_note"
  | "consumption_report"
  | "master_services_agreement"
  | "email_thread"
  | "intake_note";

export type ArtifactStatus = "available" | "missing" | "flagged";

export type InvoiceStatus =
  | "received"
  | "matched"
  | "exception"
  | "blocked"
  | "ready_for_payment";

export type PurchaseOrderStatus = "open" | "matched" | "disputed";

export type PaymentIntentStatus =
  | "draft"
  | "pending_review"
  | "on_hold"
  | "ready";

export type PaymentMethod = "ach" | "wire";

export type AgentWorker = {
  id: WorkerId;
  name: string;
  role: string;
  team: string;
  summary: string;
  supervisionModel: WorkerSupervisionModel;
  defaultQueue: string;
  specialties: string[];
  handoffTargets: WorkerId[];
};

export type VendorBankAccount = {
  id: string;
  bankName: string;
  maskedAccountNumber: string;
  routingLast4: string;
  country: string;
  currency: string;
  isPrimary: boolean;
  lastChangedAt: string;
  changeSource: string;
};

export type Vendor = {
  id: string;
  vendorCode: string;
  name: string;
  legalName: string;
  category: string;
  operatingRegion: string;
  owner: string;
  trustTier: VendorTrustTier;
  onboardingStatus: VendorOnboardingStatus;
  paymentTerms: string;
  currency: string;
  lastReviewedAt: string;
  bankAccounts: VendorBankAccount[];
  artifactIds: string[];
  notes: string[];
};

export type InvoiceLineItem = {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  costCenter: string;
};

export type Invoice = {
  id: string;
  invoiceNumber: string;
  operatingEntity: string;
  businessUnit: string;
  vendorId?: string;
  submittedVendorName: string;
  submittedRemittanceEmail: string;
  issueDate: string;
  receivedAt: string;
  dueDate: string;
  currency: string;
  subtotalAmount: number;
  taxAmount: number;
  totalAmount: number;
  paymentTerms: string;
  purchaseOrderId?: string;
  lineItems: InvoiceLineItem[];
  artifactIds: string[];
  status: InvoiceStatus;
};

export type PurchaseOrderLineItem = {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  department: string;
};

export type PurchaseOrder = {
  id: string;
  poNumber: string;
  operatingEntity: string;
  vendorId: string;
  requester: string;
  department: string;
  issuedAt: string;
  currency: string;
  subtotalAmount: number;
  taxAmount: number;
  totalAmount: number;
  remainingAmount: number;
  status: PurchaseOrderStatus;
  lineItems: PurchaseOrderLineItem[];
  artifactIds: string[];
};

export type PaymentIntent = {
  id: string;
  invoiceId: string;
  vendorId: string;
  operatingEntity: string;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  destinationBankAccountId: string;
  scheduledExecutionDate: string;
  status: PaymentIntentStatus;
  approvalThresholdAmount: number;
  artifactIds: string[];
};

export type Artifact = {
  id: string;
  kind: ArtifactKind;
  title: string;
  fileName?: string;
  status: ArtifactStatus;
  sourceSystem: string;
  capturedAt: string;
  relatedEntityIds: string[];
  summary: string;
};

export type ScenarioKey =
  | "safe-invoice-trusted-vendor"
  | "unknown-vendor-escalation"
  | "invoice-po-mismatch"
  | "vendor-bank-change-hold"
  | "missing-documentation-block"
  | "threshold-exceeded-review";

export type ScenarioDisposition =
  | "autonomous"
  | "escalate"
  | "block"
  | "review";

export type ScenarioRiskLevel = "low" | "medium" | "high" | "critical";

export type ExceptionCase = {
  id: string;
  scenarioKey: ScenarioKey;
  type: string;
  severity: ScenarioRiskLevel;
  headline: string;
  summary: string;
  detectedAtStage: string;
  ownerRole: string;
  recommendedAction: string;
  affectedRecordIds: string[];
  artifactIds: string[];
};

export type ScenarioCatalogEntry = {
  key: ScenarioKey;
  title: string;
  summary: string;
  disposition: ScenarioDisposition;
  riskLevel: ScenarioRiskLevel;
  primaryWorkerId: WorkerId;
  tags: string[];
  watchpoints: string[];
};

export type ScenarioStoryBeat = {
  title: string;
  detail: string;
  ownerWorkerId: WorkerId;
};

export type ScenarioRecordSet = {
  invoiceId: string;
  vendorId?: string;
  purchaseOrderId?: string;
  paymentIntentId?: string;
  artifactIds: string[];
};

export type FinOpsScenarioPack = {
  key: ScenarioKey;
  catalog: ScenarioCatalogEntry;
  workerIds: WorkerId[];
  records: ScenarioRecordSet;
  currentStage: string;
  nextAction: string;
  controlObjective: string;
  amountAtRisk: number;
  exceptionCaseIds: string[];
  storyBeats: ScenarioStoryBeat[];
};

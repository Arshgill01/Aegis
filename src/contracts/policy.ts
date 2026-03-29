import type {
  ExecutionMode,
  RiskLevel,
} from "./action";

export const policyDecisionOutcomes = [
  "allowed",
  "allowed_with_attention",
  "requires_approval",
  "blocked",
] as const;

export type PolicyDecisionOutcome = (typeof policyDecisionOutcomes)[number];

export const policyDecisionOutcomeLabels: Record<PolicyDecisionOutcome, string> = {
  allowed: "Allowed",
  allowed_with_attention: "Allowed with attention",
  requires_approval: "Requires approval",
  blocked: "Blocked",
};

export const policyDecisionPriority: Record<PolicyDecisionOutcome, number> = {
  blocked: 0,
  requires_approval: 1,
  allowed_with_attention: 2,
  allowed: 3,
};

export const policyRuleScopes = [
  "vendor_validation",
  "invoice_match",
  "payment_release",
  "exception_triage",
  "execution_lane",
] as const;

export type PolicyRuleScope = (typeof policyRuleScopes)[number];

export const policyCategories = [
  "vendor_identity",
  "amount_and_thresholds",
  "invoice_po_integrity",
  "bank_change_controls",
  "documentation_controls",
  "action_sensitivity",
  "execution_mode_controls",
] as const;

export type PolicyCategory = (typeof policyCategories)[number];

export type PolicyCategoryMetadata = {
  label: string;
  summary: string;
  defaultOwner: string;
};

export const policyCategoryMetadata: Record<PolicyCategory, PolicyCategoryMetadata> = {
  vendor_identity: {
    label: "Vendor identity",
    summary: "Controls tied to vendor trust posture and onboarding certainty.",
    defaultOwner: "Vendor Review Worker",
  },
  amount_and_thresholds: {
    label: "Amount thresholds",
    summary: "Controls that gate autonomous progression based on spend limits.",
    defaultOwner: "Policy Review Worker",
  },
  invoice_po_integrity: {
    label: "Invoice/PO integrity",
    summary: "Controls for three-way match quality and mismatch containment.",
    defaultOwner: "PO Match Worker",
  },
  bank_change_controls: {
    label: "Bank detail changes",
    summary: "Controls that contain remittance drift and payment-destination changes.",
    defaultOwner: "Vendor Review Worker",
  },
  documentation_controls: {
    label: "Documentation completeness",
    summary: "Controls requiring complete evidence packets before exceptions continue.",
    defaultOwner: "Document Review Worker",
  },
  action_sensitivity: {
    label: "Action sensitivity",
    summary: "Controls that elevate observability for payment-sensitive actions.",
    defaultOwner: "Risk Worker",
  },
  execution_mode_controls: {
    label: "Execution mode gates",
    summary: "Controls that keep execute lane transitions explicit and auditable.",
    defaultOwner: "Execution Worker",
  },
};

export const policyThresholdUnits = ["usd", "percent", "days", "count", "score"] as const;

export type PolicyThresholdUnit = (typeof policyThresholdUnits)[number];

export const policyThresholdComparators = [">", ">=", "<", "<=", "==", "!="] as const;

export type PolicyThresholdComparator = (typeof policyThresholdComparators)[number];

export const policyThresholdIds = [
  "THR-PAYMENT-AMOUNT-USD-APPROVAL",
  "THR-INVOICE-PO-VARIANCE-PCT",
  "THR-VENDOR-BANK-CHANGE-DAYS",
  "THR-MISSING-DOCUMENT-COUNT",
  "THR-VENDOR-IDENTITY-CONFIDENCE",
  "THR-ACTION-SENSITIVITY-SCORE",
] as const;

export type PolicyThresholdId = (typeof policyThresholdIds)[number];

export type PolicyThresholdDefinition = {
  id: PolicyThresholdId;
  label: string;
  description: string;
  unit: PolicyThresholdUnit;
  comparator: PolicyThresholdComparator;
  value: number;
};

export const policyThresholdCatalog: Record<PolicyThresholdId, PolicyThresholdDefinition> = {
  "THR-PAYMENT-AMOUNT-USD-APPROVAL": {
    id: "THR-PAYMENT-AMOUNT-USD-APPROVAL",
    label: "Autonomous payment ceiling",
    description: "Payment intent amounts above this value require named human approval.",
    unit: "usd",
    comparator: ">",
    value: 150_000,
  },
  "THR-INVOICE-PO-VARIANCE-PCT": {
    id: "THR-INVOICE-PO-VARIANCE-PCT",
    label: "Invoice to PO variance tolerance",
    description: "Invoice amount variance above this percentage is routed to approval.",
    unit: "percent",
    comparator: ">",
    value: 5,
  },
  "THR-VENDOR-BANK-CHANGE-DAYS": {
    id: "THR-VENDOR-BANK-CHANGE-DAYS",
    label: "Bank detail recency window",
    description: "Recent vendor bank-detail changes inside this window are blocked pending verification.",
    unit: "days",
    comparator: "<=",
    value: 14,
  },
  "THR-MISSING-DOCUMENT-COUNT": {
    id: "THR-MISSING-DOCUMENT-COUNT",
    label: "Missing required document count",
    description: "Any missing required document blocks exception progression.",
    unit: "count",
    comparator: ">",
    value: 0,
  },
  "THR-VENDOR-IDENTITY-CONFIDENCE": {
    id: "THR-VENDOR-IDENTITY-CONFIDENCE",
    label: "Vendor identity confidence floor",
    description: "Identity confidence below this score requires human review.",
    unit: "score",
    comparator: "<",
    value: 0.9,
  },
  "THR-ACTION-SENSITIVITY-SCORE": {
    id: "THR-ACTION-SENSITIVITY-SCORE",
    label: "Action sensitivity watch threshold",
    description: "Actions above this sensitivity score need attention even when allowed.",
    unit: "score",
    comparator: ">=",
    value: 70,
  },
};

export const policyTriggerKinds = [
  "status_check",
  "threshold_breach",
  "mismatch_detected",
  "change_window",
  "missing_evidence",
  "action_guard",
  "mode_guard",
] as const;

export type PolicyTriggerKind = (typeof policyTriggerKinds)[number];

export type PolicyRuleTrigger = {
  kind: PolicyTriggerKind;
  summary: string;
  signal: string;
  thresholdIds: PolicyThresholdId[];
  executionModes?: ExecutionMode[];
};

export const policyReasonCodes = [
  "VENDOR_TRUSTED_MATCH",
  "VENDOR_IDENTITY_UNCERTAIN",
  "INVOICE_PO_MISMATCH",
  "AMOUNT_THRESHOLD_EXCEEDED",
  "BANK_DETAIL_RECENT_CHANGE",
  "MISSING_DOCUMENTATION",
  "SENSITIVE_ACTION",
  "EXECUTION_MODE_RESTRICTED",
] as const;

export type PolicyReasonCode = (typeof policyReasonCodes)[number];

export type PolicyDecisionReason = {
  code: PolicyReasonCode;
  summary: string;
  detail: string;
  nextStep?: string;
};

export const policyRuleIds = [
  "POL-VENDOR-TRUSTED-MATCH",
  "POL-VENDOR-IDENTITY-UNCERTAIN",
  "POL-INVOICE-PO-MISMATCH",
  "POL-AMOUNT-THRESHOLD",
  "POL-BANK-DETAIL-RECENT-CHANGE",
  "POL-MISSING-DOCUMENTATION",
  "POL-SENSITIVE-ACTION",
  "POL-EXECUTION-MODE-SENSITIVITY",
] as const;

export type PolicyRuleId = (typeof policyRuleIds)[number];

export type PolicyRuleDefinition = {
  id: PolicyRuleId;
  key: string;
  name: string;
  category: PolicyCategory;
  description: string;
  scope: PolicyRuleScope;
  severity: RiskLevel;
  decision: PolicyDecisionOutcome;
  trigger: PolicyRuleTrigger;
  reason: PolicyDecisionReason;
};

export const policyRuleCatalog: PolicyRuleDefinition[] = [
  {
    id: "POL-VENDOR-TRUSTED-MATCH",
    key: "vendor_trusted_match",
    name: "Trusted vendor match",
    category: "vendor_identity",
    description: "Trusted vendors with unchanged remittance details can stay in the supervised low-risk path.",
    scope: "vendor_validation",
    severity: "low",
    decision: "allowed",
    trigger: {
      kind: "status_check",
      summary: "Vendor identity and remittance profile remain stable.",
      signal: "vendor_master_match=trusted && bank_change_age_days > 14",
      thresholdIds: ["THR-VENDOR-IDENTITY-CONFIDENCE", "THR-VENDOR-BANK-CHANGE-DAYS"],
      executionModes: ["shadow", "execute"],
    },
    reason: {
      code: "VENDOR_TRUSTED_MATCH",
      summary: "Vendor profile is trusted and stable.",
      detail: "A trusted vendor record with unchanged payment details supports controlled progression.",
      nextStep: "Continue to the next supervised workflow stage.",
    },
  },
  {
    id: "POL-VENDOR-IDENTITY-UNCERTAIN",
    key: "vendor_identity_uncertain",
    name: "Vendor identity uncertainty",
    category: "vendor_identity",
    description: "Unresolved or ambiguous vendor identity cannot proceed without explicit reviewer confirmation.",
    scope: "vendor_validation",
    severity: "high",
    decision: "requires_approval",
    trigger: {
      kind: "threshold_breach",
      summary: "Vendor identity confidence is below required threshold.",
      signal: "vendor_identity_confidence < 0.9",
      thresholdIds: ["THR-VENDOR-IDENTITY-CONFIDENCE"],
      executionModes: ["shadow", "execute"],
    },
    reason: {
      code: "VENDOR_IDENTITY_UNCERTAIN",
      summary: "Vendor identity could not be verified.",
      detail: "Missing or conflicting vendor master data prevents autonomous progression.",
      nextStep: "Route to named reviewer for identity confirmation.",
    },
  },
  {
    id: "POL-INVOICE-PO-MISMATCH",
    key: "invoice_po_mismatch",
    name: "Invoice to PO mismatch",
    category: "invoice_po_integrity",
    description: "Material invoice and PO mismatches must pause payment-sensitive actions until reviewed.",
    scope: "invoice_match",
    severity: "high",
    decision: "requires_approval",
    trigger: {
      kind: "mismatch_detected",
      summary: "Invoice to PO variance exceeds tolerance.",
      signal: "invoice_po_variance_percent > 5",
      thresholdIds: ["THR-INVOICE-PO-VARIANCE-PCT"],
      executionModes: ["shadow"],
    },
    reason: {
      code: "INVOICE_PO_MISMATCH",
      summary: "Invoice and PO values diverge beyond tolerance.",
      detail: "The mismatch is business-significant and requires human confirmation before release.",
      nextStep: "Package mismatch evidence for approval review.",
    },
  },
  {
    id: "POL-AMOUNT-THRESHOLD",
    key: "amount_threshold",
    name: "Amount threshold review",
    category: "amount_and_thresholds",
    description: "High-value payment actions above threshold must receive named approval.",
    scope: "payment_release",
    severity: "medium",
    decision: "requires_approval",
    trigger: {
      kind: "threshold_breach",
      summary: "Payment amount crosses autonomous threshold.",
      signal: "payment_amount_usd > 150000",
      thresholdIds: ["THR-PAYMENT-AMOUNT-USD-APPROVAL"],
      executionModes: ["shadow", "execute"],
    },
    reason: {
      code: "AMOUNT_THRESHOLD_EXCEEDED",
      summary: "Payment amount exceeds autonomous threshold.",
      detail: "The action is allowed only after explicit threshold sign-off.",
      nextStep: "Open approval request for designated financial reviewer.",
    },
  },
  {
    id: "POL-BANK-DETAIL-RECENT-CHANGE",
    key: "bank_detail_recent_change",
    name: "Recent bank-detail change hold",
    category: "bank_change_controls",
    description: "Recent remittance account changes remain blocked until out-of-band evidence clears risk.",
    scope: "vendor_validation",
    severity: "high",
    decision: "blocked",
    trigger: {
      kind: "change_window",
      summary: "Destination bank details changed inside protected recency window.",
      signal: "days_since_bank_change <= 14",
      thresholdIds: ["THR-VENDOR-BANK-CHANGE-DAYS"],
      executionModes: ["shadow", "execute"],
    },
    reason: {
      code: "BANK_DETAIL_RECENT_CHANGE",
      summary: "Recent bank-detail change detected.",
      detail: "Payment progression is blocked until remittance drift is independently validated.",
      nextStep: "Collect and attach remittance verification evidence.",
    },
  },
  {
    id: "POL-MISSING-DOCUMENTATION",
    key: "missing_documentation",
    name: "Missing documentation block",
    category: "documentation_controls",
    description: "Required support evidence must be present before exceptions can proceed.",
    scope: "exception_triage",
    severity: "medium",
    decision: "blocked",
    trigger: {
      kind: "missing_evidence",
      summary: "Required supporting artifacts are missing.",
      signal: "missing_required_documents > 0",
      thresholdIds: ["THR-MISSING-DOCUMENT-COUNT"],
      executionModes: ["shadow", "execute"],
    },
    reason: {
      code: "MISSING_DOCUMENTATION",
      summary: "Required support documentation is missing.",
      detail: "The action is blocked because evidence completeness cannot be established.",
      nextStep: "Attach required documents or route for manual exception handling.",
    },
  },
  {
    id: "POL-SENSITIVE-ACTION",
    key: "sensitive_action",
    name: "Sensitive action guardrail",
    category: "action_sensitivity",
    description: "Sensitive actions can proceed only with elevated observability and explicit context capture.",
    scope: "payment_release",
    severity: "medium",
    decision: "allowed_with_attention",
    trigger: {
      kind: "action_guard",
      summary: "Action sensitivity is elevated but not disallowed.",
      signal: "action_sensitivity_score >= 70",
      thresholdIds: ["THR-ACTION-SENSITIVITY-SCORE"],
      executionModes: ["shadow", "execute"],
    },
    reason: {
      code: "SENSITIVE_ACTION",
      summary: "Action is sensitive and requires extra operator visibility.",
      detail: "The action may proceed while preserving higher-signal policy and evidence context.",
      nextStep: "Proceed with attention flag and retained decision context.",
    },
  },
  {
    id: "POL-EXECUTION-MODE-SENSITIVITY",
    key: "execution_mode_sensitivity",
    name: "Execution-mode sensitivity gate",
    category: "execution_mode_controls",
    description: "Execute-lane actions remain blocked until policy and approval prerequisites are fully satisfied.",
    scope: "execution_lane",
    severity: "high",
    decision: "blocked",
    trigger: {
      kind: "mode_guard",
      summary: "Run attempts execute mode without cleared control posture.",
      signal: "execution_mode=execute && approval_state!=cleared",
      thresholdIds: [],
      executionModes: ["execute"],
    },
    reason: {
      code: "EXECUTION_MODE_RESTRICTED",
      summary: "Execution mode cannot be entered yet.",
      detail: "Required control checkpoints are incomplete for live execution.",
      nextStep: "Resolve outstanding policy/approval controls before switching to execute mode.",
    },
  },
];

export type PolicyThresholdObservation = {
  thresholdId: PolicyThresholdId;
  observedValue: number;
};

export type PolicyThresholdEvaluation = PolicyThresholdObservation & {
  breached: boolean;
};

export type PolicyRuleDecision = {
  ruleId: PolicyRuleId;
  decision: PolicyDecisionOutcome;
  triggered: boolean;
  reason: PolicyDecisionReason;
  thresholds: PolicyThresholdEvaluation[];
};

export type PolicyDecision = {
  outcome: PolicyDecisionOutcome;
  matchedRuleIds: PolicyRuleId[];
  reasons: PolicyDecisionReason[];
  ruleDecisions: PolicyRuleDecision[];
};

export const policyRuleCatalogById: Record<PolicyRuleId, PolicyRuleDefinition> =
  policyRuleCatalog.reduce((catalog, rule) => {
    catalog[rule.id] = rule;
    return catalog;
  }, {} as Record<PolicyRuleId, PolicyRuleDefinition>);

export function getPolicyRuleDefinition(ruleId: PolicyRuleId): PolicyRuleDefinition {
  return policyRuleCatalogById[ruleId];
}

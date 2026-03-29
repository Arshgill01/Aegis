import type { RiskLevel } from "./action";

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

export type PolicyDecisionReason = {
  code: string;
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
  description: string;
  scope: PolicyRuleScope;
  severity: RiskLevel;
  decision: PolicyDecisionOutcome;
  trigger: string;
  reason: PolicyDecisionReason;
};

export const policyRuleCatalog: PolicyRuleDefinition[] = [
  {
    id: "POL-VENDOR-TRUSTED-MATCH",
    key: "vendor_trusted_match",
    name: "Trusted vendor match",
    description: "Trusted vendors with unchanged remittance details can stay in the supervised low-risk path.",
    scope: "vendor_validation",
    severity: "low",
    decision: "allowed",
    trigger: "Vendor identity is verified and remittance details have no recent drift.",
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
    description: "Unresolved or ambiguous vendor identity cannot proceed without explicit reviewer confirmation.",
    scope: "vendor_validation",
    severity: "high",
    decision: "requires_approval",
    trigger: "Submitted vendor details cannot be matched to a trusted master-data profile.",
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
    description: "Material invoice and PO mismatches must pause payment-sensitive actions until reviewed.",
    scope: "invoice_match",
    severity: "high",
    decision: "requires_approval",
    trigger: "Invoice total or quantity variance breaches configured matching tolerance.",
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
    description: "High-value payment actions above threshold must receive named approval.",
    scope: "payment_release",
    severity: "medium",
    decision: "requires_approval",
    trigger: "Payment amount exceeds the configured autonomous execution ceiling.",
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
    description: "Recent remittance account changes remain blocked until out-of-band evidence clears risk.",
    scope: "vendor_validation",
    severity: "high",
    decision: "blocked",
    trigger: "Destination bank details changed inside the protected recency window.",
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
    description: "Required support evidence must be present before exceptions can proceed.",
    scope: "exception_triage",
    severity: "medium",
    decision: "blocked",
    trigger: "One or more required supporting artifacts are missing.",
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
    description: "Sensitive actions can proceed only with elevated observability and explicit context capture.",
    scope: "payment_release",
    severity: "medium",
    decision: "allowed_with_attention",
    trigger: "Action type is operationally sensitive but currently in policy scope.",
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
    description: "Execute-lane actions remain blocked until policy and approval prerequisites are fully satisfied.",
    scope: "execution_lane",
    severity: "high",
    decision: "blocked",
    trigger: "Run attempts execute mode before required policy outcomes and approvals are satisfied.",
    reason: {
      code: "EXECUTION_MODE_RESTRICTED",
      summary: "Execution mode cannot be entered yet.",
      detail: "Required control checkpoints are incomplete for live execution.",
      nextStep: "Resolve outstanding policy/approval controls before switching to execute mode.",
    },
  },
];

export const policyRuleCatalogById: Record<PolicyRuleId, PolicyRuleDefinition> =
  policyRuleCatalog.reduce((catalog, rule) => {
    catalog[rule.id] = rule;
    return catalog;
  }, {} as Record<PolicyRuleId, PolicyRuleDefinition>);

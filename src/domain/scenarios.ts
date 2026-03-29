export const scenarioKeys = [
  "safe-invoice-trusted-vendor",
  "unknown-vendor-escalation",
  "invoice-po-mismatch",
  "vendor-bank-change-hold",
  "missing-documentation-block",
  "threshold-exceeded-review",
] as const;

export type ScenarioKey = (typeof scenarioKeys)[number];

export const scenarioPostures = ["safe", "review", "exception"] as const;

export type ScenarioPosture = (typeof scenarioPostures)[number];

export interface ScenarioDefinition {
  key: ScenarioKey;
  title: string;
  posture: ScenarioPosture;
  summary: string;
  workflowTemplate: string;
}

export const scenarioCatalog: Record<ScenarioKey, ScenarioDefinition> = {
  "safe-invoice-trusted-vendor": {
    key: "safe-invoice-trusted-vendor",
    title: "Trusted vendor straight-through invoice",
    posture: "safe",
    summary:
      "A known vendor invoice aligns to the approved purchase order and can advance into controlled execution.",
    workflowTemplate: "invoice-reconciliation",
  },
  "unknown-vendor-escalation": {
    key: "unknown-vendor-escalation",
    title: "Unknown vendor escalation",
    posture: "exception",
    summary:
      "The inbound invoice cannot be resolved to an approved vendor record, so the run stays supervised and escalates early.",
    workflowTemplate: "vendor-onboarding-review",
  },
  "invoice-po-mismatch": {
    key: "invoice-po-mismatch",
    title: "Invoice and PO mismatch",
    posture: "exception",
    summary:
      "A three-way mismatch is detected before ERP posting, forcing the workflow into review and containment.",
    workflowTemplate: "invoice-reconciliation",
  },
  "vendor-bank-change-hold": {
    key: "vendor-bank-change-hold",
    title: "Vendor bank change hold",
    posture: "exception",
    summary:
      "Remittance details changed immediately before release, so the payment path is blocked pending verification.",
    workflowTemplate: "payment-release-review",
  },
  "missing-documentation-block": {
    key: "missing-documentation-block",
    title: "Missing documentation block",
    posture: "exception",
    summary:
      "Required supporting documentation is missing, so the workflow is blocked before payment packet assembly.",
    workflowTemplate: "invoice-reconciliation",
  },
  "threshold-exceeded-review": {
    key: "threshold-exceeded-review",
    title: "Threshold exceeded review",
    posture: "review",
    summary:
      "The invoice packet is otherwise clean, but the release amount crosses the supervised payment threshold.",
    workflowTemplate: "payment-release-review",
  },
};

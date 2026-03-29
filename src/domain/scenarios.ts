export const scenarioKeys = [
  "trusted-invoice-straight-through",
  "invoice-po-mismatch",
  "vendor-bank-detail-drift",
  "missing-receiving-evidence",
  "unknown-vendor",
] as const;

export type ScenarioKey = (typeof scenarioKeys)[number];

export type ScenarioPosture = "safe" | "review" | "exception";

export interface ScenarioDefinition {
  key: ScenarioKey;
  title: string;
  posture: ScenarioPosture;
  summary: string;
  workflowTemplate: string;
}

export const scenarioCatalog: Record<ScenarioKey, ScenarioDefinition> = {
  "trusted-invoice-straight-through": {
    key: "trusted-invoice-straight-through",
    title: "Trusted invoice straight-through",
    posture: "safe",
    summary:
      "A known vendor invoice aligns to the matched PO and can progress into controlled execution.",
    workflowTemplate: "invoice-reconciliation",
  },
  "invoice-po-mismatch": {
    key: "invoice-po-mismatch",
    title: "Invoice and PO mismatch",
    posture: "exception",
    summary:
      "A three-way mismatch is detected before ERP posting, forcing the run into review.",
    workflowTemplate: "invoice-reconciliation",
  },
  "vendor-bank-detail-drift": {
    key: "vendor-bank-detail-drift",
    title: "Vendor bank detail drift",
    posture: "review",
    summary:
      "Remittance details shift inside the billing cycle and require supervised validation.",
    workflowTemplate: "vendor-change-review",
  },
  "missing-receiving-evidence": {
    key: "missing-receiving-evidence",
    title: "Missing receiving evidence",
    posture: "review",
    summary:
      "The workflow cannot complete three-way matching until missing supporting evidence arrives.",
    workflowTemplate: "accrual-exception-triage",
  },
  "unknown-vendor": {
    key: "unknown-vendor",
    title: "Unknown vendor intake",
    posture: "exception",
    summary:
      "The run starts with incomplete vendor trust context and must remain supervised.",
    workflowTemplate: "vendor-onboarding-review",
  },
};

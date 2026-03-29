export type PolicySurfaceTone = "neutral" | "attention" | "positive";

export type PolicyRuleRow = {
  id: string;
  name: string;
  scope: string;
  summary: string;
  trigger: string;
  outcomeLabel: string;
  severityLabel: string;
  coverageLabel: string;
  tone: PolicySurfaceTone;
};

export type PolicyDecisionRow = {
  id: string;
  runId: string;
  workflow: string;
  policyName: string;
  postureLabel: string;
  riskLabel: string;
  reason: string;
  nextAction: string;
  evidence: string;
  tone: PolicySurfaceTone;
};

export type PolicyExplanationPanel = {
  title: string;
  postureLabel: string;
  riskLabel: string;
  why: string;
  requiredAction: string;
  evidence: string[];
};

export type PolicyOutcomeGuide = {
  label: string;
  detail: string;
  tone: PolicySurfaceTone;
};

export type PoliciesPageData = {
  eyebrow: string;
  title: string;
  description: string;
  summaryCards: {
    label: string;
    value: string;
    tone?: PolicySurfaceTone;
  }[];
  signals: {
    label: string;
    detail: string;
    emphasis?: string;
  }[];
  policyRules: PolicyRuleRow[];
  activeDecisions: PolicyDecisionRow[];
  explanation: PolicyExplanationPanel;
  outcomeGuide: PolicyOutcomeGuide[];
};

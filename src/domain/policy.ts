import type { EntityId, IsoTimestamp } from "./shared";
import type { WorkerId } from "./workers";

export const riskLevels = ["low", "medium", "high", "critical"] as const;

export type RiskLevel = (typeof riskLevels)[number];

export const policyOutcomes = ["allow", "escalate", "block"] as const;

export type PolicyOutcome = (typeof policyOutcomes)[number];

export const policyScopes = [
  "run",
  "step",
  "tool",
  "invoice",
  "vendor",
  "purchase-order",
  "payment-intent",
] as const;

export type PolicyScope = (typeof policyScopes)[number];

export const evidenceSourceTypes = ["artifact", "history", "policy", "tool", "human"] as const;

export type EvidenceSourceType = (typeof evidenceSourceTypes)[number];

export interface PolicyRule {
  id: EntityId;
  key: string;
  name: string;
  description: string;
  scope: PolicyScope;
  severity: RiskLevel;
  defaultOutcome: PolicyOutcome;
  rationale: string;
  reviewerRole?: string;
  active: boolean;
}

export interface RiskFactor {
  code: string;
  label: string;
  detail: string;
  weight: number;
  sourceType: EvidenceSourceType;
}

export interface RiskAssessment {
  id: EntityId;
  subjectId: EntityId;
  subjectType: PolicyScope;
  level: RiskLevel;
  score: number;
  summary: string;
  recommendedOutcome: PolicyOutcome;
  requiresApproval: boolean;
  assessedAt: IsoTimestamp;
  assessedByWorkerId?: WorkerId;
  matchedRuleIds: EntityId[];
  supportingArtifactIds?: EntityId[];
  factors: RiskFactor[];
}

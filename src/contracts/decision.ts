import type { RiskLevel } from "./action";

export const decisionFactorSources = [
  "policy",
  "permission",
  "evidence",
  "context",
] as const;

export type DecisionFactorSource = (typeof decisionFactorSources)[number];

export type DecisionRiskFactorInput = {
  code: string;
  label: string;
  detail: string;
  severity: RiskLevel;
  weight: number;
  source: DecisionFactorSource;
  hardStop?: boolean;
};

export type ScoredDecisionRiskFactor = DecisionRiskFactorInput & {
  normalizedWeight: number;
  severityMultiplier: number;
  sourceMultiplier: number;
  contribution: number;
};

export type RiskScoringOptions = {
  sourceMultipliers?: Partial<Record<DecisionFactorSource, number>>;
  severityMultipliers?: Partial<Record<RiskLevel, number>>;
  mediumThreshold?: number;
  highThreshold?: number;
};

export type RiskScoreSummary = {
  score: number;
  severity: RiskLevel;
  factors: ScoredDecisionRiskFactor[];
  rawContribution: number;
  maxContribution: number;
  factorCount: number;
  hardStopTriggered: boolean;
};


import type {
  DecisionRiskFactorInput,
  DecisionFactorSource,
  RiskScoringOptions,
  RiskScoreSummary,
} from "../contracts/decision";
import type { RiskLevel } from "../contracts";

const defaultSourceMultipliers: Record<DecisionFactorSource, number> = {
  policy: 1,
  permission: 1.1,
  evidence: 0.9,
  context: 0.8,
};

const defaultSeverityMultipliers: Record<RiskLevel, number> = {
  low: 0.45,
  medium: 0.72,
  high: 1,
};

const defaultMediumThreshold = 35;
const defaultHighThreshold = 70;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function normalizeWeight(weight: number) {
  if (!Number.isFinite(weight)) {
    return 0;
  }

  return clamp(weight, 0, 1);
}

export function severityFromRiskScore(score: number, options: RiskScoringOptions = {}): RiskLevel {
  const mediumThreshold = options.mediumThreshold ?? defaultMediumThreshold;
  const highThreshold = options.highThreshold ?? defaultHighThreshold;

  if (score >= highThreshold) {
    return "high";
  }

  if (score >= mediumThreshold) {
    return "medium";
  }

  return "low";
}

export function scoreRiskFactors(
  factors: DecisionRiskFactorInput[],
  options: RiskScoringOptions = {},
): RiskScoreSummary {
  if (factors.length === 0) {
    return {
      score: 0,
      severity: "low",
      factors: [],
      rawContribution: 0,
      maxContribution: 0,
      factorCount: 0,
      hardStopTriggered: false,
    };
  }

  const sourceMultipliers = {
    ...defaultSourceMultipliers,
    ...options.sourceMultipliers,
  };
  const severityMultipliers = {
    ...defaultSeverityMultipliers,
    ...options.severityMultipliers,
  };

  const scoredFactors = factors.map((factor) => {
    const normalizedWeight = normalizeWeight(factor.weight);
    const severityMultiplier = severityMultipliers[factor.severity];
    const sourceMultiplier = sourceMultipliers[factor.source];
    const contribution = normalizedWeight * severityMultiplier * sourceMultiplier;

    return {
      ...factor,
      normalizedWeight,
      severityMultiplier,
      sourceMultiplier,
      contribution,
    };
  });

  const rawContribution = scoredFactors.reduce((sum, factor) => sum + factor.contribution, 0);
  const maxContribution = scoredFactors.reduce(
    (sum, factor) => sum + factor.sourceMultiplier,
    0,
  );
  const normalizedScore =
    maxContribution === 0 ? 0 : Math.round(clamp((rawContribution / maxContribution) * 100, 0, 100));

  const hardStopTriggered = scoredFactors.some((factor) => factor.hardStop);
  const score = hardStopTriggered ? Math.max(normalizedScore, 85) : normalizedScore;

  return {
    score,
    severity: hardStopTriggered ? "high" : severityFromRiskScore(score, options),
    factors: scoredFactors.sort((left, right) => right.contribution - left.contribution),
    rawContribution,
    maxContribution,
    factorCount: factors.length,
    hardStopTriggered,
  };
}


import { SurfaceCard } from "../../components/shell/SurfaceCard";
import type {
  PolicyDecisionRow,
  PolicyExplanationPanel,
  PolicyOutcomeGuide,
  PolicyRuleRow,
  PolicySurfaceTone,
} from "./policiesData";

function chipClass(tone: PolicySurfaceTone) {
  return `mission-chip mission-chip--${tone}`;
}

export function PolicyCatalogCard({ rules }: { rules: PolicyRuleRow[] }) {
  return (
    <SurfaceCard
      eyebrow="Rule catalog"
      title="Policy rules and thresholds"
      footer="Rules remain concrete with explicit trigger language and visible run coverage."
    >
      <div className="policy-list">
        {rules.map((rule) => (
          <article className="policy-item" key={rule.id}>
            <div className="policy-item__header">
              <div>
                <strong>{rule.name}</strong>
                <p>{rule.scope}</p>
              </div>
              <div className="mission-chip-row">
                <span className={chipClass(rule.tone)}>{rule.outcomeLabel}</span>
                <span className={chipClass(rule.tone)}>{rule.severityLabel}</span>
              </div>
            </div>
            <p>{rule.summary}</p>
            <p>{rule.trigger}</p>
            <div className="policy-item__footer">
              <span>{rule.coverageLabel}</span>
            </div>
          </article>
        ))}
      </div>
    </SurfaceCard>
  );
}

export function ActivePolicyDecisionsCard({ decisions }: { decisions: PolicyDecisionRow[] }) {
  return (
    <SurfaceCard
      eyebrow="Live posture"
      title="Active run-level policy outcomes"
      footer="Run posture is linked to the exact policy reason and next supervised control step."
    >
      <div className="policy-list">
        {decisions.map((decision) => (
          <article className="policy-item" key={decision.id}>
            <div className="policy-item__header">
              <div>
                <strong>{decision.runId}</strong>
                <p>{decision.workflow}</p>
              </div>
              <div className="mission-chip-row">
                <span className={chipClass(decision.tone)}>{decision.postureLabel}</span>
                <span className={chipClass(decision.tone)}>{decision.riskLabel}</span>
              </div>
            </div>
            <p>{decision.policyName}</p>
            <p>{decision.reason}</p>
            <div className="policy-item__footer">
              <span>{decision.evidence}</span>
              <strong>{decision.nextAction}</strong>
            </div>
          </article>
        ))}
      </div>
    </SurfaceCard>
  );
}

export function PolicyExplanationCard({ explanation }: { explanation: PolicyExplanationPanel }) {
  return (
    <SurfaceCard
      eyebrow="Explanation panel"
      title="Why the current posture was reached"
      footer="Policy posture is tied to explicit trigger language and clear operator next action."
    >
      <div className="policy-explain">
        <div className="policy-explain__header">
          <strong>{explanation.title}</strong>
          <div className="mission-chip-row">
            <span className={chipClass("attention")}>{explanation.postureLabel}</span>
            <span className={chipClass("attention")}>{explanation.riskLabel}</span>
          </div>
        </div>
        <p>{explanation.why}</p>
        <div className="policy-explain__section">
          <span>Required control action</span>
          <strong>{explanation.requiredAction}</strong>
        </div>
        <div className="policy-explain__section">
          <span>Evidence references</span>
          <ul>
            {explanation.evidence.map((artifact) => (
              <li key={artifact}>{artifact}</li>
            ))}
          </ul>
        </div>
      </div>
    </SurfaceCard>
  );
}

export function PolicyOutcomeGuideCard({ guide }: { guide: PolicyOutcomeGuide[] }) {
  return (
    <SurfaceCard
      eyebrow="Outcome model"
      title="Decision outcomes in this wave"
      footer="Wave 4 keeps policy outcomes explicit before full approval workflow controls land."
    >
      <div className="policy-list">
        {guide.map((item) => (
          <article className="policy-item" key={item.label}>
            <div className="policy-item__header">
              <strong>{item.label}</strong>
              <span className={chipClass(item.tone)}>{item.label}</span>
            </div>
            <p>{item.detail}</p>
          </article>
        ))}
      </div>
    </SurfaceCard>
  );
}

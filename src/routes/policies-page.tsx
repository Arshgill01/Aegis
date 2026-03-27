import { PageScaffold } from "../components/page-scaffold";

export function PoliciesPage() {
  return (
    <PageScaffold
      eyebrow="Guardrails"
      title="Policies"
      description="Explain how the platform will express rules, risk thresholds, and escalation posture without pretending the engine is already implemented."
      stats={[
        { label: "Rule posture", value: "visible controls", tone: "neutral" },
        { label: "Sensitive actions", value: "escalate or block", tone: "critical" },
        { label: "Engine depth", value: "future wave", tone: "warning" },
      ]}
      focus={[
        {
          title: "Policy clarity",
          description: "This route is structured for human-readable rules, outcome tiers, and concrete triggers rather than vague AI safety text.",
        },
        {
          title: "Risk vocabulary",
          description: "Later work can connect thresholds, escalation paths, and allowed actions directly to runs and approvals.",
        },
      ]}
      sections={[
        {
          title: "Policy catalog",
          description: "Future rules should render here with scope, severity, and intended outcome in a stable format.",
        },
        {
          title: "Decision outcomes",
          description: "Reserve this panel for examples of allow, escalate, and block behavior tied to real workflow steps.",
        },
      ]}
      placeholder={{
        label: "Route shell",
        title: "Guardrails are defined but not simulated yet",
        description: "The page is ready for inspectable rules and risk thresholds once the policy engine surfaces deterministic results.",
        helper: "Policy language should stay concrete and legible to operators.",
      }}
    />
  );
}

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
          items: [
            {
              label: "Allow",
              title: "Low-risk extraction can continue in shadow mode",
              description: "Safe document parsing and metadata normalization should read as explicitly permitted under supervision.",
            },
            {
              label: "Escalate",
              title: "Payment intent above threshold requires review",
              description: "Sensitive steps should describe the monetary trigger and the reason a human must authorize continuation.",
            },
            {
              label: "Block",
              title: "Untrusted vendor changes stop execution",
              description: "Hard-stop rules need plain language so operators understand what the system will not allow.",
            },
          ],
          footer: "Rules should stay concrete enough that an operator can predict the outcome before opening a run.",
        },
        {
          title: "Decision outcomes",
          description: "Reserve this panel for examples of allow, escalate, and block behavior tied to real workflow steps.",
          items: [
            {
              label: "Outcome",
              title: "Operators need an outcome ladder",
              description: "This panel is shaped for clear result tiers, risk levels, and linked approval posture once policy evaluation is live.",
            },
            {
              label: "Traceability",
              title: "Policies should connect directly to replay",
              description: "A future decision view can point to the exact rule, evidence, and run step that caused an escalation.",
            },
          ],
          footer: "Keep policy language inspectable and avoid abstract governance phrasing.",
        },
      ]}
      placeholder={{
        label: "Route shell",
        title: "Guardrails are defined but not simulated yet",
        description: "The page is ready for inspectable rules and risk thresholds once the policy engine surfaces deterministic results.",
        helper: "Policy language should stay concrete and legible to operators.",
        notes: [
          "Rules should declare scope, threshold, and outcome in one view.",
          "Risk cannot be communicated by color alone; text must stay explicit.",
          "This route should explain the system, not merely list configuration.",
        ],
      }}
    />
  );
}

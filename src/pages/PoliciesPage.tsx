import { buildPageContent } from "./pageContent";

export function PoliciesPage() {
  return buildPageContent({
    eyebrow: "Guardrail Surface",
    title: "Policies, thresholds, and control posture",
    description:
      "Explain how the platform will express rules, risk thresholds, and escalation posture without pretending the policy engine already exists.",
    summaryCards: [
      { label: "Rule Posture", value: "Visible controls" },
      { label: "Sensitive Actions", value: "Escalate or block", tone: "attention" },
      { label: "Risk Bands", value: "Low, medium, high" },
      { label: "Platform Fit", value: "Domain-agnostic by design", tone: "positive" },
    ],
    signals: [
      { label: "Architectural guardrail", detail: "Platform first" },
      { label: "Policy tone", detail: "Specific, not vague" },
    ],
    primaryTitle: "Policy route scaffolding",
    primaryEyebrow: "Future modules",
    primaryItems: [
      {
        title: "Allow: low-risk extraction continues in shadow mode",
        detail: "Safe parsing and normalization should read as explicitly permitted under supervision.",
        tag: "Allow",
      },
      {
        title: "Escalate: payment intent above threshold requires review",
        detail: "Sensitive steps should name the monetary or operational trigger and the reason a human must authorize continuation.",
        tag: "Escalate",
      },
      {
        title: "Block: untrusted vendor changes stop execution",
        detail: "Hard-stop rules need plain language so operators understand what the system will not allow.",
        tag: "Block",
      },
    ],
    secondaryTitle: "Decision outcome posture",
    secondaryEyebrow: "Placeholder state",
    secondaryItems: [
      {
        title: "Operators need an outcome ladder",
        detail: "The route is shaped for clear result tiers, risk levels, and linked approval posture once policy evaluation is live.",
      },
      {
        title: "Traceability must stay intact",
        detail: "Later policy outcomes should point directly to the exact rule, evidence, and run step that caused an escalation.",
      },
      {
        title: "No vague governance language",
        detail: "The page should explain the system in concrete operational terms rather than abstract compliance phrasing.",
      },
    ],
    footerNote:
      "Wave 1 keeps policy visible and legible while deferring actual rule evaluation to later work.",
  });
}

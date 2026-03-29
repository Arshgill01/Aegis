import { buildPageContent } from "./pageContent";

export function PoliciesPage() {
  return buildPageContent({
    eyebrow: "Guardrail Surface",
    title: "Policies, thresholds, and control posture",
    description:
      "A route scaffold for concrete rules, permission boundaries, and explainable risk outcomes once policy logic lands.",
    summaryCards: [
      { label: "Rulesets", value: "Reserved for central registry" },
      { label: "Risk Bands", value: "Low, medium, high" },
      { label: "Decision Tone", value: "Concrete and inspectable" },
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
        title: "Rule registry",
        detail: "A clear home for policy definitions without scattering risk logic across pages.",
        tag: "Wave 4",
      },
      {
        title: "Outcome explainability",
        detail: "This route is positioned to show why work was allowed, blocked, or escalated.",
        tag: "Wave 4",
      },
      {
        title: "Threshold management",
        detail: "Settings-level posture can stay separate from the core policy inventory.",
        tag: "Reserved",
      },
    ],
    secondaryTitle: "Current shell intent",
    secondaryEyebrow: "Wave 1 boundary",
    secondaryItems: [
      {
        title: "No real engine yet",
        detail: "The route exists without leaking fake decision logic into the UI.",
      },
      {
        title: "Future-proof placement",
        detail: "Policies sit adjacent to approvals and replay, which matches the product story.",
      },
      {
        title: "Visible control layer",
        detail: "Users can already see policy as a first-class product area.",
      },
    ],
    footerNote: "This route keeps policy visible in Wave 1 while deferring actual rule evaluation to later work.",
  });
}

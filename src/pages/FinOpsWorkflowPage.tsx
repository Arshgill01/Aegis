import { buildPageContent } from "./pageContent";

export function FinOpsWorkflowPage() {
  return buildPageContent({
    eyebrow: "Showcase Domain",
    title: "FinOps workflow landing surface",
    description:
      "Ground the platform in a believable back-office workflow while keeping the architecture open for broader enterprise AI operations.",
    summaryCards: [
      { label: "Scenario Type", value: "Invoice operations" },
      { label: "Outcome Model", value: "Review before payment", tone: "positive" },
      { label: "Scenario Depth", value: "Deterministic placeholders" },
      { label: "Platform Boundary", value: "FinOps is a layer, not the core" },
    ],
    signals: [
      { label: "Narrative role", detail: "Concrete but not trapping" },
      { label: "Next wave", detail: "Scenario fixtures and workflow intelligence" },
    ],
    primaryTitle: "FinOps path scaffolding",
    primaryEyebrow: "Showcase structure",
    primaryItems: [
      {
        title: "Stage 1: invoice intake and normalization",
        detail: "The route starts with document receipt, field extraction, and baseline validation before any payment-sensitive action exists.",
        tag: "Stage 1",
      },
      {
        title: "Stage 2: vendor and PO reconciliation",
        detail: "Matching work stays legible as a concrete checkpoint rather than disappearing into a generic background process.",
        tag: "Stage 2",
      },
      {
        title: "Stage 3: exception or approval path",
        detail: "The workflow map already reserves a visible branch where risky steps trigger policy and human review.",
        tag: "Stage 3",
      },
    ],
    secondaryTitle: "Exception workspace posture",
    secondaryEyebrow: "Placeholder state",
    secondaryItems: [
      {
        title: "Mismatch workspace",
        detail: "Quantity, pricing, or vendor identity conflicts should show up here as a first-class branch of the workflow.",
      },
      {
        title: "Artifacts stay close to the exception",
        detail: "Supporting documents, summary notes, and approval rationale should sit here instead of in detached modal flows.",
      },
      {
        title: "No finance lock-in",
        detail: "This route stays a showcase layer so the rest of Aegis remains a reusable control plane rather than a finance-only app.",
      },
    ],
    footerNote:
      "Wave 1 introduces the showcase lane without adding domain-specific intelligence prematurely.",
  });
}

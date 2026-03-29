import { buildPageContent } from "./pageContent";

export function FinOpsWorkflowPage() {
  return buildPageContent({
    eyebrow: "Showcase Domain",
    title: "FinOps workflow landing surface",
    description:
      "A dedicated entry point for the first domain showcase without collapsing the rest of Aegis into a finance-only product.",
    summaryCards: [
      { label: "Domain Status", value: "First showcase lane" },
      { label: "Scenarios", value: "Reserved for deterministic seeds" },
      { label: "Workflow Breadth", value: "Invoices to payment intent" },
      { label: "Platform Boundary", value: "FinOps is a layer, not the core", tone: "positive" },
    ],
    signals: [
      { label: "Narrative role", detail: "Concrete but not trapping" },
      { label: "Next wave", detail: "Scenario fixtures and workflow intelligence" },
    ],
    primaryTitle: "FinOps path scaffolding",
    primaryEyebrow: "Showcase structure",
    primaryItems: [
      {
        title: "Invoice intake",
        detail: "Route space is reserved for the initial high-stakes workflow entry point.",
        tag: "Wave 7",
      },
      {
        title: "Vendor and PO verification",
        detail: "The shell leaves room for evidence-rich operational views rather than finance CRUD.",
        tag: "Wave 7",
      },
      {
        title: "Exception handling",
        detail: "Risk, approvals, and replay stay connected to the domain story through navigation.",
        tag: "Reserved",
      },
    ],
    secondaryTitle: "Platform boundaries",
    secondaryEyebrow: "Architectural posture",
    secondaryItems: [
      {
        title: "Dedicated route, shared shell",
        detail: "FinOps has a clear home without splintering the navigation model.",
      },
      {
        title: "No finance lock-in",
        detail: "Labels and layout keep the rest of the product generic and reusable.",
      },
      {
        title: "Demo-safe expansion path",
        detail: "Scenario launchers and seeded runs can be added later without reworking app structure.",
      },
    ],
    footerNote: "Wave 1 introduces the showcase lane without adding domain-specific intelligence prematurely.",
  });
}

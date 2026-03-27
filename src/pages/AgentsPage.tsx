import { buildPageContent } from "./pageContent";

export function AgentsPage() {
  return buildPageContent({
    eyebrow: "Worker Surface",
    title: "Agent roles and operating lanes",
    description:
      "A dedicated route for distinct AI workers, their responsibilities, and runtime state once orchestration is layered in.",
    summaryCards: [
      { label: "Registered Roles", value: "06 worker slots" },
      { label: "Shadow-Only", value: "04 currently constrained", tone: "attention" },
      { label: "Healthy", value: "All worker surfaces online", tone: "positive" },
      { label: "Contracts", value: "Ready for runtime attachment" },
    ],
    signals: [
      { label: "Focus", detail: "Role clarity over settings sprawl" },
      { label: "Next wave", detail: "Orchestration registry" },
    ],
    primaryTitle: "Planned worker lanes",
    primaryEyebrow: "Future modules",
    primaryItems: [
      {
        title: "Intake worker",
        detail: "Document intake and workflow initialization live here when seeded runs arrive.",
        tag: "Reserved",
      },
      {
        title: "Review and policy workers",
        detail: "Specialized roles remain visible rather than collapsing into one opaque agent.",
        tag: "Reserved",
      },
      {
        title: "Execution worker",
        detail: "Sensitive actions gain a clear surface for shadow versus execute posture.",
        tag: "Reserved",
      },
    ],
    secondaryTitle: "Why this route exists",
    secondaryEyebrow: "Shell rationale",
    secondaryItems: [
      {
        title: "Distinct ownership",
        detail: "Workers stay legible as first-class product objects.",
      },
      {
        title: "Consistent drill-down path",
        detail: "Mission Control can point into dedicated agent views without route churn later.",
      },
      {
        title: "Demo-safe placeholder state",
        detail: "The page already reads as part of the product, even before runtime logic lands.",
      },
    ],
    footerNote: "Wave 1 keeps agent internals shallow and reserves the route for orchestration work.",
  });
}

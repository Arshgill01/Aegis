export const overviewStats = [
  {
    eyebrow: "Live workload",
    label: "Runs visible in mission control",
    value: "12",
    meta: "3 newly surfaced in the last 15 minutes",
    accent: "var(--signal-blue)",
  },
  {
    eyebrow: "Shadow traffic",
    label: "Workflows exercising policy gates",
    value: "68%",
    meta: "Healthy baseline coverage across seeded scenarios",
    accent: "var(--signal-cyan)",
  },
  {
    eyebrow: "Review load",
    label: "Decisions awaiting human confirmation",
    value: "04",
    meta: "Approval queue intentionally separated from low-risk flow",
    accent: "var(--signal-amber)",
  },
  {
    eyebrow: "Operational health",
    label: "Visible worker surfaces online",
    value: "99.2%",
    meta: "Presentation-safe placeholder telemetry for Wave 1",
    accent: "var(--signal-green)",
  },
];

export const overviewHighlights = [
  ["Shell posture", "Mission-control layout with stable route hierarchy"],
  ["Surface language", "Shared cards, panels, insets, and metric rhythm"],
  ["Page readiness", "Every primary route can render coherently on day one"],
  ["Downstream usage", "Future branches can swap in real data without restyling"],
] as const;

export const routeScaffoldMetrics = [
  ["Shared shell", "Ready"],
  ["Placeholder states", "Aligned"],
  ["Primary nav", "Mapped"],
  ["Surface density", "Balanced"],
] as const;

export const activityFeed = [
  {
    title: "Invoice intake worker opened batch 24-031",
    description:
      "The shadow path resolved vendor candidates and generated an initial evidence bundle for review surfaces.",
    meta: "2 minutes ago",
    tone: "info",
  },
  {
    title: "Policy review paused a payment release",
    description:
      "A seeded threshold mismatch kept the run in review instead of allowing execution to continue silently.",
    meta: "7 minutes ago",
    tone: "warning",
  },
  {
    title: "Execution receipt preserved the run outcome",
    description:
      "The product shell is already prepared for replay and audit details even before runtime logic lands.",
    meta: "13 minutes ago",
    tone: "success",
  },
] as const;

export const artifacts = [
  {
    title: "Vendor profile snapshot",
    description: "Entity metadata, routing details, and verification notes.",
    meta: "Artifact / profile",
  },
  {
    title: "Purchase order summary",
    description: "Structured comparison surface for PO, invoice, and execution intent.",
    meta: "Artifact / comparison",
  },
  {
    title: "Approval evidence packet",
    description: "Supporting records that justify a human intervention point.",
    meta: "Artifact / approval",
  },
] as const;

export const decisionInfo = [
  {
    label: "Primary objective",
    value: "Establish a reusable mission-control UI layer for all Wave 1 routes.",
  },
  {
    label: "Visual posture",
    value: "Dark operational shell with restrained depth, sharp typography, and semantic state accents.",
  },
  {
    label: "Downstream contract",
    value: "Future branches should compose from shared primitives rather than route-local card variants.",
  },
] as const;

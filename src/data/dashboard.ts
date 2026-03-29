export const overviewStats = [
  {
    eyebrow: "Live workload",
    label: "Runs visible in mission control",
    value: "12",
    meta: "3 new runs surfaced in the last 15 minutes",
    accent: "var(--signal-blue)",
  },
  {
    eyebrow: "Shadow traffic",
    label: "Workflows exercising policy gates",
    value: "68%",
    meta: "Seeded scenarios are consistently hitting policy checks",
    accent: "var(--signal-cyan)",
  },
  {
    eyebrow: "Review load",
    label: "Decisions awaiting human confirmation",
    value: "04",
    meta: "Only exception paths are waiting on human review",
    accent: "var(--signal-amber)",
  },
  {
    eyebrow: "Operational health",
    label: "Visible worker surfaces online",
    value: "99.2%",
    meta: "Shell telemetry reserved for later runtime layers",
    accent: "var(--signal-green)",
  },
];

export const overviewHighlights = [
  ["Shell posture", "Mission-control framing with a stable route hierarchy"],
  ["Surface language", "Shared cards, panels, insets, and metric rhythm"],
  ["Page readiness", "Every primary route already resolves coherently"],
  ["Downstream usage", "Future branches can swap in data without restyling"],
] as const;

export const routeScaffoldMetrics = [
  ["Shared shell", "Locked"],
  ["Placeholder states", "Aligned"],
  ["Primary nav", "Mapped"],
  ["Surface density", "Tuned"],
] as const;

export const activityFeed = [
  {
    title: "Invoice intake worker opened batch 24-031",
    description:
      "The shadow path resolved vendor candidates and assembled the first evidence bundle for review.",
    meta: "2 minutes ago",
    tone: "info",
  },
  {
    title: "Policy review paused a payment release",
    description:
      "A seeded threshold mismatch kept the run in review instead of allowing silent execution.",
    meta: "7 minutes ago",
    tone: "warning",
  },
  {
    title: "Execution receipt preserved the run outcome",
    description:
      "Replay and audit surfaces are already ready to hold the final execution record.",
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
    description: "Structured comparison for PO, invoice, and execution intent.",
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
    value: "Establish a reusable mission-control UI layer for every Wave 1 route.",
  },
  {
    label: "Visual posture",
    value: "Dark operational shell with restrained depth, sharper typography, and semantic state accents.",
  },
  {
    label: "Downstream contract",
    value: "Future branches should compose from shared primitives instead of route-local card variants.",
  },
] as const;

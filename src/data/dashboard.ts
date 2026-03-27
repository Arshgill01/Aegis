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

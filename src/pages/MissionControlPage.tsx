import { buildPageContent } from "./pageContent";

export function MissionControlPage() {
  return buildPageContent({
    eyebrow: "Operational Overview",
    title: "Mission control for governed AI work",
    description:
      "A stable command surface for active runs, escalation posture, and the state of the overall control plane.",
    summaryCards: [
      { label: "Active Runs", value: "12 live workflows", tone: "positive" },
      { label: "Escalations", value: "03 awaiting review", tone: "attention" },
      { label: "Workers", value: "06 registered roles" },
      { label: "Audit Coverage", value: "Seeded for all critical paths" },
    ],
    signals: [
      { label: "System posture", detail: "Shadow-first", emphasis: "Trusted execution is gated." },
      { label: "Today", detail: "2 policy exceptions surfaced" },
      { label: "Demo path", detail: "FinOps showcase ready" },
    ],
    primaryTitle: "Control lanes",
    primaryEyebrow: "Primary view",
    primaryItems: [
      {
        title: "Run supervision",
        detail: "Overview will host active workflow lists, lane status, and handoff visibility.",
        tag: "Wave 3",
      },
      {
        title: "Risk posture",
        detail: "A consistent home for surfaced anomalies, policy friction, and blocked work.",
        tag: "Wave 4",
      },
      {
        title: "Approval awareness",
        detail: "Queue previews and intervention cues stay visible from the shell.",
        tag: "Wave 5",
      },
    ],
    secondaryTitle: "Shell guarantees",
    secondaryEyebrow: "Downstream contract",
    secondaryItems: [
      {
        title: "Persistent navigation",
        detail: "All primary areas remain reachable from a single stable layout.",
      },
      {
        title: "Consistent page frame",
        detail: "Each route already renders with summary, context, and operational side rail.",
      },
      {
        title: "Mission-control tone",
        detail: "Placeholder states read as product surfaces, not empty prototypes.",
      },
    ],
    footerNote: "Wave 1 keeps this page intentionally shallow while preserving the control-tower posture.",
  });
}

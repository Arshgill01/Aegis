import { buildPageContent } from "./pageContent";

export function RunsTasksPage() {
  return buildPageContent({
    eyebrow: "Execution Surface",
    title: "Runs, tasks, and workflow progression",
    description:
      "Expose run progression, task sequencing, and handoff structure so the product already feels operational before deeper runtime logic lands.",
    summaryCards: [
      { label: "Run States", value: "Queued to closed" },
      { label: "Execution Mode", value: "Supervised by default" },
      { label: "Step Detail", value: "Reserved for task drill-in" },
      { label: "Lifecycle Fit", value: "Ready for seeded runs", tone: "positive" },
    ],
    signals: [
      { label: "Primary outcome", detail: "Stable route hierarchy" },
      { label: "Next integration", detail: "Seeded workflow records" },
    ],
    primaryTitle: "Run queue posture",
    primaryEyebrow: "Page scaffolding",
    primaryItems: [
      {
        title: "Queued vendor onboarding review",
        detail: "A low-risk shadow-mode run can land here without the route needing to change shape.",
        tag: "Queued",
      },
      {
        title: "Mismatch escalation on approval hold",
        detail: "The queue already anticipates paused runs that stop for policy or approval, not just happy-path completion.",
        tag: "Paused",
      },
      {
        title: "Receipt-ready completion state",
        detail: "Closed runs should eventually bridge directly into replay with clear outcome and timing context.",
        tag: "Closed",
      },
    ],
    secondaryTitle: "Task detail posture",
    secondaryEyebrow: "Placeholder state",
    secondaryItems: [
      {
        title: "Selected run context stays nearby",
        detail: "Evidence, current worker, and blocked actions belong beside the queue rather than behind a detached modal or drawer.",
      },
      {
        title: "Handoffs remain legible",
        detail: "The detail surface is shaped for worker transitions, review points, and step-level summaries tied to one run.",
      },
      {
        title: "No fake workflow engine",
        detail: "The page hints at future runtime depth without pretending seeded lifecycle logic already exists in Wave 1.",
      },
    ],
    footerNote:
      "Wave 1 establishes the queue-to-detail posture so later execution work can deepen the route without architectural churn.",
  });
}

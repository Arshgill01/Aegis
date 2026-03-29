import { buildPageContent } from "./pageContent";

export function RunsTasksPage() {
  return buildPageContent({
    eyebrow: "Execution Surface",
    title: "Runs, tasks, and workflow progression",
    description:
      "A route scaffold for lifecycle visibility, task status, worker handoffs, and execution posture across active workflows.",
    summaryCards: [
      { label: "Run States", value: "Queued to completed" },
      { label: "Task Visibility", value: "Step-level scaffolding ready" },
      { label: "Handoffs", value: "Route reserved for timeline detail" },
      { label: "Operational Density", value: "Optimized for summary + drill-in" },
    ],
    signals: [
      { label: "Primary outcome", detail: "Stable route hierarchy" },
      { label: "Next integration", detail: "Seeded workflow records" },
    ],
    primaryTitle: "Execution lenses",
    primaryEyebrow: "Page scaffolding",
    primaryItems: [
      {
        title: "Run list",
        detail: "A coherent home for active and historical workflow rows without redesigning the shell later.",
        tag: "Wave 2",
      },
      {
        title: "Task breakdown",
        detail: "Step-level visibility can plug into the existing card and stack patterns.",
        tag: "Wave 3",
      },
      {
        title: "Lifecycle controls",
        detail: "Pause, escalate, and execution state will fit inside this route without reshaping navigation.",
        tag: "Wave 5",
      },
    ],
    secondaryTitle: "Route contract",
    secondaryEyebrow: "Downstream fit",
    secondaryItems: [
      {
        title: "Single source of execution truth",
        detail: "Runs stay separate from approvals, replay, and policies while remaining adjacent.",
      },
      {
        title: "Extendable layout",
        detail: "The current shell supports tables, timelines, or split-detail views later.",
      },
      {
        title: "Intentional placeholder",
        detail: "No fake workflow logic is introduced during shell work.",
      },
    ],
    footerNote: "This route is intentionally structured for later execution detail without adding placeholder business logic now.",
  });
}

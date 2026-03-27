import { PageScaffold } from "../components/page-scaffold";

export function RunsPage() {
  return (
    <PageScaffold
      eyebrow="Execution"
      title="Runs / Tasks"
      description="Expose run progression, task sequencing, and handoff structure so the product feels operational before real runtime logic lands."
      stats={[
        { label: "Run states", value: "queued to closed", tone: "neutral" },
        { label: "Default mode", value: "supervised", tone: "success" },
        { label: "Blocked steps", value: "none seeded yet", tone: "warning" },
      ]}
      focus={[
        {
          title: "Lifecycle visibility",
          description: "This page is built for active runs, task progression, and future worker ownership changes.",
        },
        {
          title: "Step detail",
          description: "The structure leaves room for step rows, evidence, and policy checkpoints without shipping fake logic.",
        },
      ]}
      sections={[
        {
          title: "Run queue",
          description: "Future seeded scenarios should render here as a prioritized list of active, paused, and completed runs.",
          items: [
            {
              label: "Queued",
              title: "Vendor onboarding invoice review",
              description: "A static queue slot signals where low-risk, shadow-mode work will first appear once deterministic fixtures land.",
            },
            {
              label: "Paused",
              title: "Mismatch escalation with approval hold",
              description: "This route already anticipates runs pausing for policy or approval rather than only showing happy-path progress.",
            },
            {
              label: "Closed",
              title: "Receipt-ready completion state",
              description: "Completed runs can eventually bridge directly into replay with clear outcome badges and timestamps.",
            },
          ],
          footer: "Use the list posture for lifecycle visibility first; deep per-step logic belongs to later waves.",
        },
        {
          title: "Task detail panel",
          description: "Reserve this area for step-level detail, tool activity, and policy gates tied to the selected run.",
          items: [
            {
              label: "Step detail",
              title: "Selected run context stays nearby",
              description: "Evidence, current worker, and blocked actions should appear here without losing sight of the surrounding queue.",
            },
            {
              label: "Handoffs",
              title: "Execution transitions remain legible",
              description: "The panel is structured for worker changeovers, review points, and outcome summaries tied to specific steps.",
            },
          ],
          footer: "This split layout gives later waves a stable home for queue scanning and drill-down detail.",
        },
      ]}
      placeholder={{
        label: "Route shell",
        title: "No workflow runs seeded yet",
        description: "The layout already distinguishes the run list from the task-detail surface so later waves can plug in real execution records cleanly.",
        helper: "Wave 2 should attach deterministic run fixtures and lifecycle states.",
        notes: [
          "Runs should read as supervised work, not as a raw jobs table.",
          "Task steps belong beside the run, not hidden in a detached drawer.",
          "Lifecycle states need to stay consistent with replay and approvals later.",
        ],
      }}
    />
  );
}

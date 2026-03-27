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
        },
        {
          title: "Task detail panel",
          description: "Reserve this area for step-level detail, tool activity, and policy gates tied to the selected run.",
        },
      ]}
      placeholder={{
        label: "Route shell",
        title: "No workflow runs seeded yet",
        description: "The layout already distinguishes the run list from the task-detail surface so later waves can plug in real execution records cleanly.",
        helper: "Wave 2 should attach deterministic run fixtures and lifecycle states.",
      }}
    />
  );
}

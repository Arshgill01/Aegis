import { PageScaffold } from "../components/page-scaffold";

export function AgentsPage() {
  return (
    <PageScaffold
      eyebrow="Workers"
      title="Agents"
      description="Clarify who is operating, which role they hold, and where future worker telemetry will surface without turning the page into a settings graveyard."
      stats={[
        { label: "Worker lanes", value: "3 planned", tone: "neutral" },
        { label: "Execution mode", value: "shadow-first", tone: "success" },
        { label: "Coverage gaps", value: "runtime pending", tone: "warning" },
      ]}
      focus={[
        {
          title: "Role clarity",
          description: "Each worker slot is reserved for a distinct operational role rather than generic agent cards.",
        },
        {
          title: "Inspectable activity",
          description: "This screen is structured for future handoffs, tool traces, and run participation summaries.",
        },
      ]}
      sections={[
        {
          title: "Worker roster",
          description: "Use this region for the durable identity layer: worker names, role briefs, trust posture, and owned workflow segments.",
        },
        {
          title: "Activity rail",
          description: "This second panel is reserved for recent work, exceptions, and step-level involvement once seeded execution data exists.",
        },
      ]}
      placeholder={{
        label: "Route shell",
        title: "Worker cards will land here",
        description: "The initial shell establishes a clear destination for worker role cards, execution summaries, and supervision context.",
        helper: "Later waves should attach deterministic role metadata and recent activity lists here.",
      }}
    />
  );
}

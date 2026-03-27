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
          items: [
            {
              label: "Intake lane",
              title: "Document Intake Worker",
              description: "Receives inbound artifacts, normalizes invoice payloads, and passes candidate records into supervised flow.",
            },
            {
              label: "Control lane",
              title: "Policy Sentinel",
              description: "Applies guardrail checks, flags sensitive operations, and decides whether human review should interrupt the run.",
            },
            {
              label: "Execution lane",
              title: "Resolution Steward",
              description: "Owns final step completion after approvals or risk clearance, preserving a clear handoff story.",
            },
          ],
          footer: "Worker identities are static in Wave 1 so later runtime work can attach telemetry without changing the page posture.",
        },
        {
          title: "Activity rail",
          description: "This second panel is reserved for recent work, exceptions, and step-level involvement once seeded execution data exists.",
          items: [
            {
              label: "Next up",
              title: "Recent run participation",
              description: "This rail is sized for step snippets, tool traces, and recent interventions grouped by worker.",
            },
            {
              label: "Escalations",
              title: "High-risk moments remain visible",
              description: "The page can show where a worker triggered policy or requested approval without collapsing into raw logs.",
            },
          ],
          footer: "Keep worker activity concise and inspectable instead of turning this route into generic settings.",
        },
      ]}
      placeholder={{
        label: "Route shell",
        title: "Worker cards will land here",
        description: "The initial shell establishes a clear destination for worker role cards, execution summaries, and supervision context.",
        helper: "Later waves should attach deterministic role metadata and recent activity lists here.",
        notes: [
          "Distinct worker roles are defined before runtime logic exists.",
          "Shadow mode and supervision posture should remain obvious at a glance.",
          "Future cards should show ownership, trust mode, and current involvement.",
        ],
      }}
    />
  );
}

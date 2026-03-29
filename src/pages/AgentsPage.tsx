import { buildPageContent } from "./pageContent";

export function AgentsPage() {
  return buildPageContent({
    eyebrow: "Worker Surface",
    title: "Agent roles and supervision lanes",
    description:
      "Clarify who is operating, what each worker owns, and where future activity telemetry will surface without turning the route into a settings graveyard.",
    summaryCards: [
      { label: "Worker Lanes", value: "03 defined roles" },
      { label: "Execution Mode", value: "Shadow-first posture", tone: "attention" },
      { label: "Runtime Depth", value: "Telemetry pending" },
      { label: "Shell Health", value: "Ready for orchestration", tone: "positive" },
    ],
    signals: [
      { label: "Focus", detail: "Role clarity over settings sprawl" },
      { label: "Next wave", detail: "Orchestration registry" },
    ],
    primaryTitle: "Planned worker lanes",
    primaryEyebrow: "Future modules",
    primaryItems: [
      {
        title: "Document Intake Worker",
        detail: "Receives inbound artifacts, normalizes invoice payloads, and prepares the run for supervised progression.",
        tag: "Intake lane",
      },
      {
        title: "Policy Sentinel",
        detail: "Applies guardrail checks, flags sensitive operations, and creates the clearest route into approvals when risk appears.",
        tag: "Control lane",
      },
      {
        title: "Resolution Steward",
        detail: "Owns final completion after risk is cleared so human-gated execution still has a visible operational owner.",
        tag: "Execution lane",
      },
    ],
    secondaryTitle: "Activity posture",
    secondaryEyebrow: "Placeholder state",
    secondaryItems: [
      {
        title: "Recent run participation",
        detail: "This column is reserved for worker-level step snippets, tool traces, and escalation moments once seeded runs exist.",
      },
      {
        title: "Trust mode remains visible",
        detail: "Shadow versus execute posture should stay obvious on every worker summary rather than hiding inside a run detail.",
      },
      {
        title: "No generic agent cards",
        detail: "Each worker slot already implies a distinct role so later orchestration work can attach telemetry without redesigning the route.",
      },
    ],
    footerNote:
      "Wave 1 defines the worker posture early so later runtime work can attach real activity without changing the route contract.",
  });
}

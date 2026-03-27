import { PageScaffold } from "../components/page-scaffold";

export function ReplayPage() {
  return (
    <PageScaffold
      eyebrow="Audit"
      title="Replay / Audit"
      description="Establish a screen for inspectable execution history so replay never feels bolted on like a raw debug log."
      stats={[
        { label: "Evidence format", value: "timeline-first", tone: "neutral" },
        { label: "Audit posture", value: "inspectable", tone: "success" },
        { label: "Replay data", value: "fixtures pending", tone: "warning" },
      ]}
      focus={[
        {
          title: "Replay narrative",
          description: "The route is shaped for chronological playback, event grouping, and future step receipts.",
        },
        {
          title: "Evidentiary detail",
          description: "A parallel panel is reserved for why a step happened, which policy influenced it, and what evidence existed.",
        },
      ]}
      sections={[
        {
          title: "Execution timeline",
          description: "Use this panel for event rows, state transitions, and playback controls once deterministic run history is available.",
          items: [
            {
              label: "Frame 01",
              title: "Artifact intake captured",
              description: "The replay rail should begin with document receipt, worker attribution, and initial mode before deeper reasoning appears.",
            },
            {
              label: "Frame 07",
              title: "Policy interruption recorded",
              description: "A later replay frame can show exactly when risk interrupted progress and which rule caused the pause.",
            },
            {
              label: "Frame 11",
              title: "Human decision resumed the run",
              description: "Approval outcomes should join the same chronology so replay tells one coherent story from start to finish.",
            },
          ],
          footer: "Replay is a product surface, not a transport log. The timeline should stay readable even as detail deepens.",
        },
        {
          title: "Evidence panel",
          description: "This area should hold artifacts, reasons, approvals, and worker/tool attribution tied to the selected replay frame.",
          items: [
            {
              label: "Evidence",
              title: "Artifacts and excerpts stay adjacent",
              description: "Receipts, document snippets, and policy notes should sit here so the user can inspect why the frame occurred.",
            },
            {
              label: "Attribution",
              title: "Worker and tool context stays explicit",
              description: "This panel is the place for actor identity, tool usage, and outcome details without scattering them across the route.",
            },
          ],
          footer: "Future replay detail should support auditability first and motion second.",
        },
      ]}
      placeholder={{
        label: "Route shell",
        title: "Replay frames will populate here",
        description: "The page already separates narrative timeline flow from evidence detail so later waves can plug in receipts without redesigning the route.",
        helper: "Replay should stay productized, not collapse into unstructured logs.",
        notes: [
          "Chronology, reason, and evidence should always travel together.",
          "Policy pauses and approvals belong inside the same narrative.",
          "Playback controls can stay lightweight if the evidence is clear.",
        ],
      }}
    />
  );
}

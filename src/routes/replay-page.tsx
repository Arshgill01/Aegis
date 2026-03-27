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
        },
        {
          title: "Evidence panel",
          description: "This area should hold artifacts, reasons, approvals, and worker/tool attribution tied to the selected replay frame.",
        },
      ]}
      placeholder={{
        label: "Route shell",
        title: "Replay frames will populate here",
        description: "The page already separates narrative timeline flow from evidence detail so later waves can plug in receipts without redesigning the route.",
        helper: "Replay should stay productized, not collapse into unstructured logs.",
      }}
    />
  );
}

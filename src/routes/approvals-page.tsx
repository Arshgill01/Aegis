import { PageScaffold } from "../components/page-scaffold";

export function ApprovalsPage() {
  return (
    <PageScaffold
      eyebrow="Intervention"
      title="Approvals"
      description="Keep this route action-oriented and high-signal so risky steps can pause here with enough context for human review."
      stats={[
        { label: "Approval model", value: "queue-first", tone: "neutral" },
        { label: "Risk posture", value: "human gate", tone: "critical" },
        { label: "Current backlog", value: "empty shell", tone: "warning" },
      ]}
      focus={[
        {
          title: "Decision context",
          description: "Pending actions should eventually show risk, requested operation, requester identity, and consequence of approval.",
        },
        {
          title: "Fast triage",
          description: "The route is split to support queue scanning on the left and decision context on the right.",
        },
      ]}
      sections={[
        {
          title: "Approval queue",
          description: "This panel is reserved for requests grouped by urgency and business impact once the approval system arrives.",
        },
        {
          title: "Decision brief",
          description: "Use this second surface for rationale, evidence, and resume-or-block outcomes tied to the selected request.",
        },
      ]}
      placeholder={{
        label: "Route shell",
        title: "No approvals are waiting",
        description: "The empty state is deliberate: it frames what the queue should look like before real approval requests are simulated.",
        helper: "Later waves should keep approvals specific, contextual, and visibly consequential.",
      }}
    />
  );
}

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
          items: [
            {
              label: "Urgent lane",
              title: "Payment release over threshold",
              description: "A future queue row here should state the action, risk trigger, and financial consequence in one scan.",
            },
            {
              label: "Standard lane",
              title: "Exception override request",
              description: "Lower-urgency reviews still need explicit rationale, requester identity, and expected next state.",
            },
          ],
          footer: "Queue ordering should stay operational and consequence-aware rather than generic inbox sorting.",
        },
        {
          title: "Decision brief",
          description: "Use this second surface for rationale, evidence, and resume-or-block outcomes tied to the selected request.",
          items: [
            {
              label: "Why now",
              title: "Approval context stays human-readable",
              description: "This panel is reserved for risk summary, policy reason, and what approving the action would permit next.",
            },
            {
              label: "What follows",
              title: "Resume path is part of the decision",
              description: "Approvers should understand whether the workflow resumes, remains blocked, or records a permanent exception.",
            },
          ],
          footer: "Approvals should feel specific and high-stakes, never like a generic confirm dialog.",
        },
      ]}
      placeholder={{
        label: "Route shell",
        title: "No approvals are waiting",
        description: "The empty state is deliberate: it frames what the queue should look like before real approval requests are simulated.",
        helper: "Later waves should keep approvals specific, contextual, and visibly consequential.",
        notes: [
          "Approval requests should always name the exact action being authorized.",
          "Risk rationale and policy trigger need to be adjacent to the decision.",
          "An empty queue should still reinforce trust, not look abandoned.",
        ],
      }}
    />
  );
}

import { buildPageContent } from "./pageContent";

export function ApprovalsPage() {
  return buildPageContent({
    eyebrow: "Human Gates",
    title: "Approval queue and intervention surface",
    description:
      "Keep this route action-oriented and high-signal so risky steps can pause here with enough context for meaningful human review.",
    summaryCards: [
      { label: "Approval Model", value: "Queue-first posture" },
      { label: "Risk Posture", value: "Human gate required", tone: "attention" },
      { label: "Current Queue", value: "Static preview only" },
      { label: "Decision Trail", value: "Replay linkage reserved", tone: "positive" },
    ],
    signals: [
      { label: "Design rule", detail: "Approval must feel meaningful" },
      { label: "Visibility", detail: "Action context stays nearby" },
    ],
    primaryTitle: "Decision queue scaffolding",
    primaryEyebrow: "Action-oriented layout",
    primaryItems: [
      {
        title: "Payment release over threshold",
        detail: "A future queue row here should state the requested action, risk trigger, and business consequence in one scan.",
        tag: "Urgent lane",
      },
      {
        title: "Exception override request",
        detail: "Lower-urgency approvals still need explicit rationale, requester identity, and next-state clarity.",
        tag: "Standard lane",
      },
      {
        title: "Cross-links into the control plane",
        detail: "Approvals should point cleanly back into runs, policies, and replay rather than behaving like isolated modal work.",
        tag: "Reserved",
      },
    ],
    secondaryTitle: "Decision brief posture",
    secondaryEyebrow: "Placeholder state",
    secondaryItems: [
      {
        title: "Why approval is needed",
        detail: "This panel is reserved for risk summary, policy reason, and the exact action continuation would authorize.",
      },
      {
        title: "What happens next",
        detail: "Approvers should see whether the workflow resumes, remains blocked, or records a durable exception.",
      },
      {
        title: "Static preview still signals trust",
        detail: "The current placeholder posture stays intentional instead of reading like a broken or abandoned approval inbox.",
      },
    ],
    footerNote:
      "Wave 1 keeps approvals specific and high-stakes in posture without simulating real decision logic yet.",
  });
}

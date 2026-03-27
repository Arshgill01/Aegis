import { buildPageContent } from "./pageContent";

export function ApprovalsPage() {
  return buildPageContent({
    eyebrow: "Human Gates",
    title: "Approval queue and intervention surface",
    description:
      "A high-signal route for pending authorizations, escalations, and resume decisions when risky work needs human review.",
    summaryCards: [
      { label: "Approval States", value: "Pending, approved, blocked" },
      { label: "Current Queue", value: "03 seeded placeholders", tone: "attention" },
      { label: "Risk Context", value: "Surface reserved for evidence" },
      { label: "Decision Trail", value: "Future replay linkage ready" },
    ],
    signals: [
      { label: "Design rule", detail: "Approval must feel meaningful" },
      { label: "Visibility", detail: "Action context stays nearby" },
    ],
    primaryTitle: "Decision queue scaffolding",
    primaryEyebrow: "Action-oriented layout",
    primaryItems: [
      {
        title: "Authorization cards",
        detail: "This route is prepared for high-stakes queue entries with rationale and blast-radius context.",
        tag: "Wave 5",
      },
      {
        title: "Decision outcomes",
        detail: "Resume, block, or request-more-context states can plug into the existing page shell cleanly.",
        tag: "Wave 5",
      },
      {
        title: "Cross-links",
        detail: "Approvals will point back into runs, policies, and replay without route churn.",
        tag: "Reserved",
      },
    ],
    secondaryTitle: "Interaction posture",
    secondaryEyebrow: "Mission-control constraints",
    secondaryItems: [
      {
        title: "Risk is textual, not color-only",
        detail: "The shell already leaves room for explicit rationale and evidence labels.",
      },
      {
        title: "Context remains visible",
        detail: "Approvals live near the rest of operational navigation, not inside a buried settings area.",
      },
      {
        title: "No premature workflow logic",
        detail: "The page avoids fake authorization behavior in Wave 1.",
      },
    ],
    footerNote: "Wave 1 establishes the approval route and tone without simulating decisions yet.",
  });
}

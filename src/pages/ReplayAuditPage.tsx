import { buildPageContent } from "./pageContent";

export function ReplayAuditPage() {
  return buildPageContent({
    eyebrow: "Evidence Surface",
    title: "Replay and audit visibility",
    description:
      "A route reserved for inspectable execution history, decision receipts, and replayable evidence across workflow runs.",
    summaryCards: [
      { label: "Traceability", value: "Route established" },
      { label: "Receipts", value: "Placeholder frame ready" },
      { label: "Evidence Panels", value: "Consistent shell support" },
      { label: "Audit Readiness", value: "Future-first structure", tone: "positive" },
    ],
    signals: [
      { label: "Product stance", detail: "Inspectability over magic" },
      { label: "Next wave", detail: "Replay models and events" },
    ],
    primaryTitle: "Replay entry points",
    primaryEyebrow: "Future surfaces",
    primaryItems: [
      {
        title: "Run playback",
        detail: "Timeline or frame-based inspection can plug into this route without layout churn.",
        tag: "Wave 6",
      },
      {
        title: "Decision evidence",
        detail: "Receipts, policy context, and action rationale have a reserved page home.",
        tag: "Wave 6",
      },
      {
        title: "Audit export posture",
        detail: "The shell keeps this area feeling evidentiary rather than debug-oriented.",
        tag: "Reserved",
      },
    ],
    secondaryTitle: "Shell value",
    secondaryEyebrow: "Why now",
    secondaryItems: [
      {
        title: "Stable IA",
        detail: "Replay and audit stay explicit in the product architecture from the start.",
      },
      {
        title: "No raw-log feel",
        detail: "Even the placeholder treatment reads as a product surface, not developer tooling.",
      },
      {
        title: "Supports downstream merging",
        detail: "Later replay work can land on a stable route and layout contract.",
      },
    ],
    footerNote: "Wave 1 reserves an evidence-first route without inventing replay logic before contracts exist.",
  });
}

import { buildPageContent } from "./pageContent";

export function ReplayAuditPage() {
  return buildPageContent({
    eyebrow: "Evidence Surface",
    title: "Replay and audit visibility",
    description:
      "Establish a screen for inspectable execution history so replay never feels bolted on like a raw debug log.",
    summaryCards: [
      { label: "Evidence Format", value: "Timeline-first" },
      { label: "Audit Posture", value: "Inspectable by design", tone: "positive" },
      { label: "Replay Data", value: "Fixtures pending" },
      { label: "Receipts", value: "Reserved for future frames" },
    ],
    signals: [
      { label: "Product stance", detail: "Inspectability over magic" },
      { label: "Next wave", detail: "Replay models and events" },
    ],
    primaryTitle: "Replay entry points",
    primaryEyebrow: "Future surfaces",
    primaryItems: [
      {
        title: "Frame 01: artifact intake captured",
        detail: "The replay rail should begin with document receipt, worker attribution, and initial mode before deeper reasoning appears.",
        tag: "Frame 01",
      },
      {
        title: "Frame 07: policy interruption recorded",
        detail: "A later frame can show exactly when risk interrupted progress and which rule caused the pause.",
        tag: "Frame 07",
      },
      {
        title: "Frame 11: human decision resumed the run",
        detail: "Approval outcomes should join the same chronology so replay tells one coherent story from start to finish.",
        tag: "Frame 11",
      },
    ],
    secondaryTitle: "Evidence detail posture",
    secondaryEyebrow: "Placeholder state",
    secondaryItems: [
      {
        title: "Artifacts and excerpts stay adjacent",
        detail: "Receipts, document snippets, and policy notes should sit beside the selected replay frame rather than in a separate tool view.",
      },
      {
        title: "Attribution remains explicit",
        detail: "Worker identity, tool usage, and outcome details belong in the evidence column so audit never turns into guesswork.",
      },
      {
        title: "No raw-log feel",
        detail: "Chronology, reason, and evidence should travel together so the route reads as a product surface instead of a developer console.",
      },
    ],
    footerNote:
      "Wave 1 reserves an evidence-first route without inventing replay logic before the event and receipt contracts exist.",
  });
}

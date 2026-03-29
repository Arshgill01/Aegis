import { buildPageContent } from "./pageContent";

export function SettingsDemoControlsPage() {
  return buildPageContent({
    eyebrow: "Environment Surface",
    title: "Settings and demo controls",
    description:
      "Keep the control surface lightweight: enough room for demo setup, seeded state toggles, and environment posture without becoming a generic admin area.",
    summaryCards: [
      { label: "Control Scope", value: "Demo-safe only" },
      { label: "Scenario Mode", value: "Seeded" },
      { label: "Environment", value: "Shell-level posture only" },
      { label: "Admin Sprawl", value: "Explicitly avoided", tone: "attention" },
    ],
    signals: [
      { label: "Boundary", detail: "No broad settings system" },
      { label: "Use case", detail: "Demo-safe control point" },
    ],
    primaryTitle: "Reserved controls",
    primaryEyebrow: "Wave-safe structure",
    primaryItems: [
      {
        title: "Launch a seeded safe or exception path",
        detail: "This route is positioned for one-click demo state setup, not for full product administration.",
        tag: "Scenario pack",
      },
      {
        title: "Return the shell to a known checkpoint",
        detail: "Deterministic resets should remain visible and lightweight so the showcase flow stays reliable.",
        tag: "Reset",
      },
      {
        title: "Compact scenario controls only",
        detail: "Keep launchers and resets focused on demo reliability instead of expanding into a broad infrastructure panel.",
        tag: "Reserved",
      },
    ],
    secondaryTitle: "System posture",
    secondaryEyebrow: "Placeholder state",
    secondaryItems: [
      {
        title: "Readiness indicators stay compact",
        detail: "Shell, fixtures, and route posture can be summarized here without implying a full admin product.",
      },
      {
        title: "Local-only simulation toggles",
        detail: "Any future controls here should adjust seeded demo behavior without introducing hidden operational complexity.",
      },
      {
        title: "Settings remain secondary",
        detail: "The route exists, but it stays narrow so mission control remains the product center of gravity.",
      },
    ],
    footerNote:
      "Wave 1 creates a safe destination for demo controls while keeping the area intentionally narrow.",
  });
}

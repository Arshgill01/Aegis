import { buildPageContent } from "./pageContent";

export function SettingsDemoControlsPage() {
  return buildPageContent({
    eyebrow: "Environment Surface",
    title: "Settings and demo controls",
    description:
      "A restrained route for environment posture, showcase toggles, and demo-safe controls without overbuilding infrastructure.",
    summaryCards: [
      { label: "Scope", value: "Deliberately minimal" },
      { label: "Demo Controls", value: "Reserved for scenario launchers" },
      { label: "Environment", value: "Shell-level posture only" },
      { label: "Risk", value: "No auth or infra expansion in Wave 1", tone: "attention" },
    ],
    signals: [
      { label: "Boundary", detail: "No broad settings system" },
      { label: "Use case", detail: "Demo-safe control point" },
    ],
    primaryTitle: "Reserved controls",
    primaryEyebrow: "Wave-safe structure",
    primaryItems: [
      {
        title: "Scenario launchers",
        detail: "This route is a natural home for seeded demo controls in later waves.",
        tag: "Wave 8",
      },
      {
        title: "Environment posture",
        detail: "Shell-level indicators can live here without implying a full admin product.",
        tag: "Reserved",
      },
      {
        title: "Reset and seed actions",
        detail: "Deterministic demo helpers can plug in here once fixtures exist.",
        tag: "Wave 8",
      },
    ],
    secondaryTitle: "Intentional restraint",
    secondaryEyebrow: "Why shallow",
    secondaryItems: [
      {
        title: "Avoids settings sprawl",
        detail: "The route exists, but the shell does not overcommit to auth, org, or infrastructure panels.",
      },
      {
        title: "Supports demoability",
        detail: "A future home for scenario controls is visible from day one.",
      },
      {
        title: "Keeps focus on mission control",
        detail: "Settings remain secondary within the navigation hierarchy.",
      },
    ],
    footerNote: "Wave 1 creates a safe destination for demo controls while keeping the area intentionally narrow.",
  });
}

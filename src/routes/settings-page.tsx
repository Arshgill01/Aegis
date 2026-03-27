import { PageScaffold } from "../components/page-scaffold";

export function SettingsPage() {
  return (
    <PageScaffold
      eyebrow="Demo Controls"
      title="Settings / Demo Controls"
      description="Keep the control surface lightweight: enough room for demo setup, seeded state toggles, and environment posture without becoming a generic admin area."
      stats={[
        { label: "Control scope", value: "demo-safe", tone: "neutral" },
        { label: "Scenario mode", value: "seeded", tone: "success" },
        { label: "Admin sprawl", value: "explicitly avoided", tone: "warning" },
      ]}
      focus={[
        {
          title: "Scenario setup",
          description: "This route is meant for launching or resetting deterministic demo states, not for deep tenant configuration.",
        },
        {
          title: "Environment clarity",
          description: "It can also host compact posture indicators for shell readiness, sample data, and future simulation toggles.",
        },
      ]}
      sections={[
        {
          title: "Demo controls",
          description: "Use this panel for scenario launchers, reset actions, and lightweight environment toggles.",
          items: [
            {
              label: "Scenario pack",
              title: "Launch a seeded safe or exception path",
              description: "This route is positioned for one-click demo state setup, not for full product administration.",
            },
            {
              label: "Reset",
              title: "Return the shell to a known checkpoint",
              description: "Deterministic resets should remain visible and lightweight so demo flow stays reliable.",
            },
          ],
          footer: "Controls should support showcase reliability first and avoid turning this page into a back-office admin console.",
        },
        {
          title: "System posture",
          description: "Reserve this second panel for seed status, data freshness, and future local simulation controls.",
          items: [
            {
              label: "Readiness",
              title: "Shell, fixtures, and route posture",
              description: "Compact indicators can confirm which demo capabilities are seeded and which remain static placeholders.",
            },
            {
              label: "Simulation",
              title: "Local-only toggles stay constrained",
              description: "Any future controls here should adjust seeded demo behavior without introducing hidden operational complexity.",
            },
          ],
          footer: "Keep this route small and trustworthy; operators should understand every control at a glance.",
        },
      ]}
      placeholder={{
        label: "Route shell",
        title: "No controls are wired yet",
        description: "The page is intentionally narrow so demo helpers can land without diluting the mission-control product posture.",
        helper: "Keep future controls focused on deterministic setup and showcase reliability.",
        notes: [
          "Scenario launchers belong here, not spread across every route.",
          "Environment posture should stay compact and explainable.",
          "Avoid broad settings sprawl; this is a demo surface, not tenant admin.",
        ],
      }}
    />
  );
}

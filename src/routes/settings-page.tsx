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
        },
        {
          title: "System posture",
          description: "Reserve this second panel for seed status, data freshness, and future local simulation controls.",
        },
      ]}
      placeholder={{
        label: "Route shell",
        title: "No controls are wired yet",
        description: "The page is intentionally narrow so demo helpers can land without diluting the mission-control product posture.",
        helper: "Keep future controls focused on deterministic setup and showcase reliability.",
      }}
    />
  );
}

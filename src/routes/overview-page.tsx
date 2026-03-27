import { PageScaffold } from "../components/page-scaffold";

export function OverviewPage() {
  return (
    <PageScaffold
      eyebrow="Mission Control"
      title="Overview"
      description="Wave 1 keeps the overview light while the surrounding product routes establish the operating model for agents, controls, and replay."
      stats={[
        { label: "Shell readiness", value: "8 routes", tone: "success" },
        { label: "Future plug-ins", value: "policy, approvals, replay", tone: "neutral" },
        { label: "Demo posture", value: "static and deterministic", tone: "warning" },
      ]}
      focus={[
        {
          title: "Product shell",
          description: "The navigation, route hierarchy, and visual system are in place for the rest of Wave 1.",
        },
        {
          title: "Future depth",
          description: "Later waves can now attach real orchestration, policy, and audit data to distinct screen areas.",
        },
      ]}
      sections={[
        {
          title: "Mission-control posture",
          description: "Overview remains intentionally restrained in this pass so the secondary routes can define their specific operating surfaces cleanly.",
          items: [
            {
              label: "Visibility",
              title: "Route shells now cover the full operating story",
              description: "Agents, runs, approvals, replay, policy, FinOps, and demo controls each have a clear destination in the product shell.",
            },
            {
              label: "Wave boundary",
              title: "No fake execution logic is simulated here",
              description: "The shell hints at future data without pretending runtime, approval, or audit systems already exist.",
            },
          ],
        },
        {
          title: "What lands next",
          description: "Seeded runs, worker activity, queue health, and risk posture can fill this shell once Wave 2 contracts arrive.",
          items: [
            {
              label: "Contracts",
              title: "Deterministic entities can plug into stable sections",
              description: "The current layout already reserves places for lifecycle state, evidence, and route-specific summaries.",
            },
            {
              label: "UX continuity",
              title: "Overview can deepen later without reshaping the secondary routes",
              description: "The route hierarchy and visual language are already coherent enough for later waves to extend safely.",
            },
          ],
        },
      ]}
      placeholder={{
        label: "Wave 1",
        title: "Overview composition stays lightweight",
        description: "This route exists so the app is coherent end-to-end, but deeper overview composition is intentionally deferred outside this pass.",
        helper: "Use the secondary routes to inspect the product posture for each capability area.",
        notes: [
          "Overview remains intentionally narrow in this branch.",
          "Secondary routes now carry the product posture for each core capability.",
        ],
      }}
    />
  );
}

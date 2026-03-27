import { createBrowserRouter } from "react-router-dom";
import { AppShell } from "./AppShell";
import { OverviewPage } from "../pages/OverviewPage";
import { ScaffoldPage } from "../pages/ScaffoldPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    children: [
      { index: true, element: <OverviewPage /> },
      {
        path: "agents",
        element: (
          <ScaffoldPage
            eyebrow="Worker Registry"
            title="Agents"
            description="Structured worker views, capability summaries, and role-level health surfaces will land here."
          />
        ),
      },
      {
        path: "runs",
        element: (
          <ScaffoldPage
            eyebrow="Execution Monitor"
            title="Runs"
            description="This route is reserved for lifecycle-driven execution lists, step summaries, and replay entry points."
          />
        ),
      },
      {
        path: "approvals",
        element: (
          <ScaffoldPage
            eyebrow="Human Review Gates"
            title="Approvals"
            description="Pending decisions, escalation context, and approval routing surfaces will compose on this scaffold."
          />
        ),
      },
      {
        path: "replay",
        element: (
          <ScaffoldPage
            eyebrow="Replay + Audit"
            title="Replay"
            description="Evidence panels, timeline detail, and execution receipts will attach to this route in later waves."
          />
        ),
      },
      {
        path: "policies",
        element: (
          <ScaffoldPage
            eyebrow="Controls"
            title="Policies"
            description="Policy catalogs, thresholds, and decision context will reuse the same surface language here."
          />
        ),
      },
      {
        path: "finops",
        element: (
          <ScaffoldPage
            eyebrow="Showcase Domain"
            title="FinOps Workflow"
            description="The first high-stakes scenario layer will slot into this page without redefining the mission-control shell."
          />
        ),
      },
      {
        path: "settings",
        element: (
          <ScaffoldPage
            eyebrow="Demo Controls"
            title="Settings"
            description="Scenario launchers, environment toggles, and showcase controls will use these same structural primitives."
          />
        ),
      },
    ],
  },
]);

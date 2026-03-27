import { NavLink, Navigate, Route, Routes } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
import type { ReactNode } from "react";

import { AgentsPage } from "./routes/agents-page";
import { ApprovalsPage } from "./routes/approvals-page";
import { FinopsPage } from "./routes/finops-page";
import { OverviewPage } from "./routes/overview-page";
import { PoliciesPage } from "./routes/policies-page";
import { ReplayPage } from "./routes/replay-page";
import { RunsPage } from "./routes/runs-page";
import { SettingsPage } from "./routes/settings-page";

type AppRoute = {
  path: string;
  label: string;
  eyebrow: string;
  element: ReactNode;
};

const appRoutes: AppRoute[] = [
  {
    path: "/overview",
    label: "Overview",
    eyebrow: "Mission Control",
    element: <OverviewPage />,
  },
  {
    path: "/agents",
    label: "Agents",
    eyebrow: "Workers",
    element: <AgentsPage />,
  },
  {
    path: "/runs",
    label: "Runs",
    eyebrow: "Execution",
    element: <RunsPage />,
  },
  {
    path: "/approvals",
    label: "Approvals",
    eyebrow: "Intervention",
    element: <ApprovalsPage />,
  },
  {
    path: "/replay",
    label: "Replay",
    eyebrow: "Audit",
    element: <ReplayPage />,
  },
  {
    path: "/policies",
    label: "Policies",
    eyebrow: "Guardrails",
    element: <PoliciesPage />,
  },
  {
    path: "/finops",
    label: "FinOps Workflow",
    eyebrow: "Showcase",
    element: <FinopsPage />,
  },
  {
    path: "/settings",
    label: "Settings",
    eyebrow: "Demo Controls",
    element: <SettingsPage />,
  },
];

function Shell() {
  return (
    <div className="app-shell">
      <aside className="side-nav">
        <div className="brand-block">
          <span className="eyebrow">Aegis</span>
          <h1>Digital labor control tower</h1>
          <p>
            Supervise AI workers with clear routes for execution, approvals,
            policy, and replay.
          </p>
        </div>

        <nav className="nav-list" aria-label="Primary">
          {appRoutes.map((route) => (
            <NavLink
              key={route.path}
              className={({ isActive }) =>
                isActive ? "nav-item nav-item-active" : "nav-item"
              }
              to={route.path}
            >
              <span className="nav-item-eyebrow">{route.eyebrow}</span>
              <span>{route.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="app-main">
        <Routes>
          <Route path="/" element={<Navigate to="/overview" replace />} />
          {appRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Routes>
      </main>
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <Shell />
    </BrowserRouter>
  );
}

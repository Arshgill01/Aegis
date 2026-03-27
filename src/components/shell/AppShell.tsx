import { Outlet, useLocation } from "react-router-dom";

import { navigationSections } from "../../app/routes";
import { ShellSidebar } from "./ShellSidebar";

const topbarMetrics = [
  { label: "Runtime Posture", value: "Shadow Mode" },
  { label: "Approval Queue", value: "3 pending" },
  { label: "Policy Coverage", value: "18 active rules" },
];

export function AppShell() {
  const location = useLocation();

  const activeRoute =
    navigationSections
      .flatMap((section) => section.items)
      .find((item) => item.path === location.pathname) ?? navigationSections[0].items[0];

  return (
    <div className="app-shell">
      <div className="app-shell__backdrop" />
      <ShellSidebar />
      <div className="app-shell__content">
        <header className="topbar">
          <div>
            <p className="eyebrow">Aegis Control Tower</p>
            <h1>{activeRoute.label}</h1>
            <p className="topbar__description">{activeRoute.description}</p>
          </div>
          <div className="topbar__metrics" aria-label="Global status">
            {topbarMetrics.map((metric) => (
              <div className="metric-pill" key={metric.label}>
                <span>{metric.label}</span>
                <strong>{metric.value}</strong>
              </div>
            ))}
          </div>
        </header>
        <main className="page-region">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

import { Outlet, useLocation } from "react-router-dom";

import { navigationSections } from "../../app/routes";
import { ShellSidebar } from "./ShellSidebar";

const topbarMetrics = [
  { label: "Shadow mode" },
  { label: "Active" },
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
          <div className="topbar__copy">
            <p className="eyebrow">Aegis Control Tower</p>
            <h1>{activeRoute.label}</h1>
            <p className="topbar__description">{activeRoute.description}</p>
          </div>
          <div className="topbar__metrics" aria-label="Global status">
            <div className="topbar__metric-row">
              {topbarMetrics.map((metric) => (
                <span className="status-pill" key={metric.label}>
                  {metric.label}
                </span>
              ))}
            </div>
            <span className="status-kpi">Shared UI layer online</span>
          </div>
        </header>
        <main className="page-region">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

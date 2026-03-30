import { Outlet, useLocation } from "react-router-dom";

import { normalizeNavigationPath } from "../../app/entityRoutes";
import { useShellOrchestrationSummary } from "../../app/data/hooks";
import { navigationSections } from "../../app/routes";
import { ShellSidebar } from "./ShellSidebar";

export function AppShell() {
  const location = useLocation();
  const shellSummary = useShellOrchestrationSummary(location.pathname);
  const normalizedPath = normalizeNavigationPath(location.pathname);

  const activeRoute =
    navigationSections
      .flatMap((section) => section.items)
      .find((item) => item.path === normalizedPath) ?? navigationSections[0].items[0];

  return (
    <div className="app-shell">
      <div className="app-shell__backdrop" />
      <ShellSidebar summary={shellSummary} />
      <div className="app-shell__content">
        <header className="topbar">
          <div className="topbar__copy">
            <p className="eyebrow">Aegis Control Tower</p>
            <h1>{activeRoute.label}</h1>
            <p className="topbar__description">
              {activeRoute.description} {shellSummary.routeNarrative}
            </p>
          </div>
          <div className="topbar__metrics" aria-label="Global status">
            <div className="topbar__metric-row">
              {shellSummary.topbarMetrics.map((metric) => (
                <span className="status-pill" key={metric}>
                  {metric}
                </span>
              ))}
            </div>
            <span className="status-kpi">{shellSummary.topbarKpi}</span>
          </div>
        </header>
        <main className="page-region">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

import { NavLink, Outlet } from "react-router-dom";
import { primaryNavigation } from "./navigation";
import { cn } from "../lib/cn";

export function AppShell() {
  return (
    <div className="app-shell">
      <aside className="app-sidebar">
        <div className="app-sidebar__inner">
          <div className="brand-lockup">
            <div className="brand-mark">AG</div>
            <div className="brand-label">
              <span className="eyebrow">Digital Labor Control Tower</span>
              <div className="brand-title">Aegis</div>
              <div className="brand-copy">
                Visible, gated AI operations for high-stakes workflow runs.
              </div>
            </div>

            <div className="sidebar-status">
              <div className="sidebar-status__item">
                <span>Mode</span>
                <strong>Shadow-first</strong>
              </div>
              <div className="sidebar-status__item">
                <span>Routes</span>
                <strong>8 online</strong>
              </div>
            </div>
          </div>

          <div className="app-sidebar__section">
            <span className="app-sidebar__section-label">Control surfaces</span>
            <nav className="nav-group" aria-label="Primary">
              {primaryNavigation.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/"}
                  className={({ isActive }) =>
                    cn("nav-link", isActive && "nav-link--active")
                  }
                >
                  <span className="nav-link__label">{item.title}</span>
                  <span className="nav-link__hint">{item.hint}</span>
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="app-sidebar__footer">
            <span className="app-sidebar__section-label">Internal</span>
            <strong>Wave 1 shell</strong>
            <p>
              Shared surfaces, route scaffolds, and semantic state treatment
              tuned for dense operational UI.
            </p>
            <NavLink to="/internal/primitives" className="sidebar-link">
              Open primitives lab
            </NavLink>
          </div>
        </div>
      </aside>

      <main className="app-main">
        <div className="app-main__inner">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

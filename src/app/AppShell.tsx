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
                Mission-control surfaces for visible, gated AI operations.
              </div>
            </div>
          </div>

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

          <div className="app-sidebar__footer">
            <strong>Wave 1 shell</strong>
            <p>
              Shared surfaces, spacing rhythm, and placeholder scaffolds for the
              first mission-control render.
            </p>
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

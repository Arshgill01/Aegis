import { NavLink, Outlet, useLocation } from "react-router-dom";

import { appRoutes, navigationSections } from "../../app/routes";
import { StatusBadge } from "../ui/StatusBadge";

const routeLookup = new Map(
  appRoutes.map((route) => [route.path, { label: route.label, description: route.description }]),
);

export function AppShell() {
  const location = useLocation();
  const routeMeta = routeLookup.get(location.pathname) ?? routeLookup.get("/");

  return (
    <div className="shell">
      <aside className="shell__sidebar">
        <div className="shell__brand">
          <p className="eyebrow">Aegis</p>
          <h1>Digital labor control tower</h1>
          <p className="shell__brand-copy">
            Supervise AI workers operating under workflow, risk, approval, and audit constraints.
          </p>
        </div>

        <nav className="shell__nav" aria-label="Primary navigation">
          {navigationSections.map((section) => (
            <div className="shell__nav-section" key={section.title}>
              <p className="shell__nav-title">{section.title}</p>
              <div className="shell__nav-list">
                {section.items.map((item) => (
                  <NavLink
                    key={item.path}
                    className={({ isActive }) =>
                      isActive ? "shell__nav-item shell__nav-item--active" : "shell__nav-item"
                    }
                    to={item.path}
                  >
                    <span>{item.shortLabel}</span>
                    <small>{item.label}</small>
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="shell__system-card">
          <div className="shell__system-head">
            <p>System posture</p>
            <StatusBadge tone="success">Seeded</StatusBadge>
          </div>
          <ul className="shell__system-list">
            <li>Wave 1 shell is rendering static control surfaces.</li>
            <li>Overview is the flagship route for operational storytelling.</li>
            <li>Downstream routes remain placeholder-ready for later waves.</li>
          </ul>
        </div>
      </aside>

      <main className="shell__main">
        <header className="shell__header">
          <div>
            <p className="eyebrow">Mission control shell</p>
            <h2>{routeMeta?.label}</h2>
            <p className="shell__page-copy">{routeMeta?.description}</p>
          </div>
          <div className="shell__header-status">
            <StatusBadge tone="info">Wave 1</StatusBadge>
            <StatusBadge tone="neutral">Shell only</StatusBadge>
          </div>
        </header>

        <div className="shell__content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

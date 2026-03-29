import { NavLink } from "react-router-dom";

import { navigationSections } from "../../app/routes";

export function ShellSidebar() {
  const routeCount = navigationSections.flatMap((section) => section.items).length;

  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <div className="sidebar__crest" aria-hidden="true">
          AG
        </div>
        <div className="sidebar__brand-copy">
          <p className="eyebrow">Digital Labor Control Tower</p>
          <h2>Aegis</h2>
          <p className="sidebar__mission">
            Visible, gated AI operations for high-stakes workflow runs.
          </p>
        </div>
      </div>

      <div className="sidebar__status" aria-label="Sidebar status">
        <div className="sidebar__status-card">
          <span>Mode</span>
          <strong>Shadow-first</strong>
        </div>
        <div className="sidebar__status-card">
          <span>Routes</span>
          <strong>{routeCount} online</strong>
        </div>
      </div>

      <nav className="sidebar__nav" aria-label="Primary navigation">
        {navigationSections.map((section) => (
          <section key={section.title} className="nav-section">
            <p className="nav-section__title">{section.title}</p>
            <div className="nav-section__items">
              {section.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    isActive ? "nav-link nav-link--active" : "nav-link"
                  }
                  end={item.path === "/"}
                >
                  <span className="nav-link__label">{item.label}</span>
                  <span className="nav-link__description">{item.description}</span>
                </NavLink>
              ))}
            </div>
          </section>
        ))}
      </nav>

      <div className="sidebar__footer">
        <strong>Wave 1 shell</strong>
        <span>Shared surfaces and route scaffolds tuned for dense operational UI.</span>
      </div>
    </aside>
  );
}

import { NavLink } from "react-router-dom";

import { navigationSections } from "../../app/routes";

export function ShellSidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <div className="sidebar__crest" aria-hidden="true">
          <span />
          <span />
        </div>
        <div>
          <p className="eyebrow">Wave 1 Skeleton</p>
          <h2>Aegis</h2>
        </div>
      </div>

      <div className="sidebar__mission">
        <p>Digital labor control tower for visible, governed AI work.</p>
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
                  <span className="nav-link__label">{item.shortLabel}</span>
                  <span className="nav-link__description">{item.description}</span>
                </NavLink>
              ))}
            </div>
          </section>
        ))}
      </nav>

      <div className="sidebar__footer">
        <span className="status-dot" />
        Stable shell for downstream wave branches
      </div>
    </aside>
  );
}

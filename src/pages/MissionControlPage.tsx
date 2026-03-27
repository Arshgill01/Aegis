import { MetricCard } from "../components/ui/MetricCard";
import { Panel } from "../components/ui/Panel";
import { StatusBadge } from "../components/ui/StatusBadge";

const placeholderRows = Array.from({ length: 4 }, (_, index) => index);

export function MissionControlPage() {
  return (
    <div className="mission-control">
      <section className="mission-control__briefing">
        <div>
          <p className="eyebrow">Overview</p>
          <h1>Supervise worker-led operations from one control surface.</h1>
          <p className="mission-control__copy">
            The flagship screen is structured around workflow posture, risk pressure, human gates,
            and evidence-rich operational context.
          </p>
        </div>
        <div className="mission-control__briefing-status">
          <StatusBadge tone="info">Mission control</StatusBadge>
          <StatusBadge tone="neutral">Seed data pending</StatusBadge>
        </div>
      </section>

      <section className="metric-grid" aria-label="Overview metrics">
        <MetricCard label="Active workflows" value="--" detail="Live run volume will render here." />
        <MetricCard
          label="Human gates"
          value="--"
          detail="Approval queue pressure will render here."
        />
        <MetricCard
          label="Flagged exceptions"
          value="--"
          detail="Risk hotspots will render here."
        />
        <MetricCard
          label="Audit capture"
          value="--"
          detail="Execution receipt coverage will render here."
        />
      </section>

      <div className="mission-layout">
        <div className="mission-layout__main">
          <Panel
            title="Active workflow runs"
            description="Primary run lanes occupy the largest space so the screen reads as an operational center, not a KPI dashboard."
          >
            <div className="placeholder-list">
              {placeholderRows.map((row) => (
                <article className="placeholder-row" key={row}>
                  <div className="placeholder-row__title" />
                  <div className="placeholder-row__meta" />
                </article>
              ))}
            </div>
          </Panel>

          <Panel
            title="Recent system activity"
            description="A timeline preview will surface worker actions, escalations, and guardrail events."
          >
            <div className="placeholder-list placeholder-list--timeline">
              {placeholderRows.map((row) => (
                <article className="placeholder-row placeholder-row--timeline" key={row}>
                  <span className="placeholder-row__dot" />
                  <div className="placeholder-row__content">
                    <div className="placeholder-row__title" />
                    <div className="placeholder-row__meta" />
                  </div>
                </article>
              ))}
            </div>
          </Panel>
        </div>

        <div className="mission-layout__rail">
          <Panel
            title="Pending approvals preview"
            description="Critical human authorization moments will be visible without opening a dedicated queue."
          >
            <div className="placeholder-list">
              {placeholderRows.slice(0, 3).map((row) => (
                <article className="placeholder-row" key={row}>
                  <div className="placeholder-row__title" />
                  <div className="placeholder-row__meta" />
                </article>
              ))}
            </div>
          </Panel>

          <Panel
            title="Risk posture"
            description="Flagged items and posture indicators will give reviewers a fast view of what needs attention."
          >
            <div className="placeholder-stack">
              <div className="placeholder-block" />
              <div className="placeholder-block" />
              <div className="placeholder-block" />
            </div>
          </Panel>
        </div>
      </div>

      <div className="mission-layout mission-layout--secondary">
        <Panel
          title="Worker activity"
          description="Distinct worker roles, queue pressure, and current focus areas will render here."
        >
          <div className="placeholder-grid">
            {placeholderRows.map((row) => (
              <div className="placeholder-card" key={row} />
            ))}
          </div>
        </Panel>

        <Panel
          title="Scenario spotlight"
          description="A deterministic showcase slice can sit here without turning the page into a marketing hero."
        >
          <div className="placeholder-block placeholder-block--hero" />
        </Panel>
      </div>
    </div>
  );
}

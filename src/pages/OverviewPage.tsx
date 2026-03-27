import {
  KPIBadge,
  MetricRow,
  PageHeader,
  PageShell,
  Panel,
  SectionHeader,
  SectionShell,
  SplitLayout,
  SummaryStatCard,
  SurfaceCard,
} from "../components/primitives";
import { overviewHighlights, overviewStats } from "../data/dashboard";

export function OverviewPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Wave 1 Foundation"
        title="Mission Control"
        description="Aegis starts with a stable command surface: visible routes, premium panels, and reusable layout primitives that downstream workflow branches can populate without fragmenting the product."
        actions={<KPIBadge label="Shared UI layer online" />}
      />

      <section className="summary-grid">
        {overviewStats.map((stat) => (
          <SummaryStatCard key={stat.label} {...stat} />
        ))}
      </section>

      <SectionShell>
        <SectionHeader
          title="Operational posture"
          caption="Wave 1 emphasizes composable shell quality before deeper runtime logic arrives."
        />
        <SplitLayout
          primary={
            <Panel
              title="Command surface baseline"
              description="These shared surfaces establish the visual language for the rest of the control tower."
            >
              <div className="stack">
                {overviewHighlights.map(([label, value]) => (
                  <MetricRow key={label} label={label} value={value} />
                ))}
              </div>
            </Panel>
          }
          secondary={
            <Panel
              inset
              title="Why this matters"
              description="Later waves should inherit this shell and spend time on trust, approval, risk, and replay instead of rebuilding cards."
            >
              <p className="surface-copy">
                The mission-control product feel has to be present from the first
                render. This pass hardens spacing, shell structure, and reusable
                surfaces so future pages can stay visually coherent under real
                workflow content.
              </p>
            </Panel>
          }
        />
      </SectionShell>

      <SectionShell>
        <SectionHeader
          title="Route scaffolds"
          caption="Every Wave 1 route already resolves into the same shell and surface rhythm."
        />
        <div className="surface-grid">
          <SurfaceCard
            title="Primary pages"
            description="Overview, agents, runs, approvals, replay, policies, FinOps, and settings routes all exist behind a shared shell."
          >
            <p className="surface-copy">
              The route tree is intentionally lean: page branches can focus on
              domain content, not layout scaffolding.
            </p>
          </SurfaceCard>
          <SurfaceCard
            title="Ready for composition"
            description="Panel and section primitives are tuned for dense but readable operational UI."
          >
            <p className="surface-copy">
              Summary cards, inset surfaces, split layouts, and metric rows already
              share the same radius, padding, depth, and typography posture.
            </p>
          </SurfaceCard>
        </div>
      </SectionShell>
    </PageShell>
  );
}

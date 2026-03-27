import {
  ActivityRow,
  ApprovalBadge,
  ArtifactRow,
  CalloutBlock,
  InfoList,
  KPIBadge,
  MetricRow,
  ModeBadge,
  PageHeader,
  PageShell,
  Panel,
  RiskBadge,
  SectionHeader,
  SectionShell,
  StatusBadge,
  SplitLayout,
  SummaryStatCard,
  SurfaceCard,
  WorkerBadge,
} from "../components/primitives";
import {
  activityFeed,
  artifacts,
  decisionInfo,
  overviewHighlights,
  overviewStats,
} from "../data/dashboard";

export function OverviewPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Wave 1 Foundation"
        title="Mission Control"
        description="Aegis starts with a stable command surface: visible routes, premium panels, and reusable layout primitives that downstream workflow branches can populate without fragmenting the product."
        actions={
          <div className="cluster">
            <ModeBadge mode="shadow" />
            <StatusBadge status="active" />
            <KPIBadge label="Shared UI layer online" tone="positive" />
          </div>
        }
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
              <div className="stack">
                <p className="surface-copy">
                  The mission-control product feel has to be present from the
                  first render. This pass hardens spacing, shell structure, and
                  reusable surfaces so future pages can stay visually coherent
                  under real workflow content.
                </p>
                <div className="badge-stack">
                  <RiskBadge risk="medium" />
                  <ApprovalBadge state="pending" />
                  <WorkerBadge worker="Policy Worker" />
                </div>
              </div>
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

      <SectionShell>
        <SectionHeader
          title="Visible control surfaces"
          caption="Semantic primitives already express the core trust states the product depends on."
        />
        <SplitLayout
          primary={
            <Panel
              title="Recent activity"
              description="Compact timeline rows for run feeds, replay previews, and workflow events."
            >
              <div className="activity-list">
                {activityFeed.map((item) => (
                  <ActivityRow
                    key={item.title}
                    title={item.title}
                    description={item.description}
                    meta={item.meta}
                    tone={item.tone}
                    badge={<ModeBadge mode="shadow" />}
                  />
                ))}
              </div>
            </Panel>
          }
          secondary={
            <div className="stack">
              <SurfaceCard
                title="Decision framing"
                description="Clear metadata blocks give later pages a stable detail presentation pattern."
              >
                <InfoList items={[...decisionInfo]} />
              </SurfaceCard>
              <CalloutBlock
                tone="warning"
                title="Risk, approval, and execution states are intentionally explicit"
                description="Downstream branches should use these shared badges and callouts rather than inventing one-off color logic inside pages."
              />
            </div>
          }
        />
      </SectionShell>

      <SectionShell>
        <SectionHeader
          title="Artifact-ready rows"
          caption="Shared record rows are ready for receipts, documents, or evidence panels."
        />
        <div className="surface-grid">
          <SurfaceCard
            title="Evidence surfaces"
            description="These rows are compact enough for high-signal side panels and detail pages."
          >
            <div className="record-list">
              {artifacts.map((artifact) => (
                <ArtifactRow
                  key={artifact.title}
                  title={artifact.title}
                  description={artifact.description}
                  meta={artifact.meta}
                  badge={<WorkerBadge worker="Audit Trail" />}
                />
              ))}
            </div>
          </SurfaceCard>
          <SurfaceCard
            title="State contrast"
            description="These pairings should read instantly across overview, approvals, replay, and workflow routes."
          >
            <div className="badge-stack">
              <StatusBadge status="completed" />
              <StatusBadge status="blocked" />
              <ApprovalBadge state="approved" />
              <ApprovalBadge state="rejected" />
              <RiskBadge risk="low" />
              <RiskBadge risk="high" />
              <ModeBadge mode="executed" />
              <WorkerBadge worker="Execution Worker" />
            </div>
          </SurfaceCard>
        </div>
      </SectionShell>
    </PageShell>
  );
}

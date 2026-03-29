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
  routeScaffoldMetrics,
} from "../data/dashboard";

export function OverviewPage() {
  return (
    <PageShell className="overview-page">
      <PageHeader
        eyebrow="Wave 1 Foundation"
        title="Mission Control"
        description="A stable command surface for visible AI operations, with denser shell framing, sharper panel rhythm, and reusable primitives that keep later workflow slices coherent."
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

      <SectionShell className="overview-cluster overview-board">
        <SectionHeader
          title="Operational lane"
          caption="Activity, decision framing, and trust states are grouped into one command board."
        />
        <div className="overview-command-grid">
          <Panel
            className="overview-command-card overview-command-card--activity"
            title="Recent workflow movement"
            description="Shadow traffic, gated decisions, and replay-safe outcomes stay visible in one compact stream."
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

          <Panel
            inset
            className="overview-command-card"
            title="Command surface baseline"
            description="Shared shell posture already visible across every primary route."
          >
            <div className="stack">
              {overviewHighlights.map(([label, value]) => (
                <MetricRow key={label} label={label} value={value} />
              ))}
            </div>
          </Panel>

          <SurfaceCard
            className="overview-command-card"
            title="Decision framing"
            description="Why the shell is built for clarity before deeper runtime logic arrives."
          >
            <InfoList items={[...decisionInfo]} />
          </SurfaceCard>

          <SurfaceCard
            className="overview-command-card overview-state-card"
            title="Trust language"
            description="Core states should read instantly without leaning on loud color or oversized visuals."
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

      <SectionShell className="overview-cluster">
        <SectionHeader
          title="Platform readiness"
          caption="Routes, evidence surfaces, and scaffold signals stay aligned under one shared system."
        />
        <div className="overview-support-grid">
          <SurfaceCard
            className="overview-support-grid__evidence"
            title="Artifact-ready evidence"
            description="Record rows are compact enough for receipts, documents, and approval packets."
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

          <div className="overview-support-grid__stack">
            <SurfaceCard
              title="Route scaffolds"
              description="Every primary route resolves into the same shell, spacing rhythm, and card discipline."
            >
              <div className="stack">
                {routeScaffoldMetrics.map(([label, value]) => (
                  <MetricRow key={label} label={label} value={value} />
                ))}
              </div>
            </SurfaceCard>

            <CalloutBlock
              tone="warning"
              title="Risk, approval, and execution states stay explicit"
              description="Future routes should reuse the shared badge and panel system instead of inventing local alert logic."
            />
          </div>
        </div>
      </SectionShell>
    </PageShell>
  );
}

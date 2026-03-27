import {
  ActivityRow,
  ApprovalBadge,
  ArtifactRow,
  Button,
  CalloutBlock,
  EmptyStateBlock,
  InfoList,
  KPIBadge,
  ModeBadge,
  PageHeader,
  PageShell,
  Panel,
  PlaceholderStateSection,
  PriorityBadge,
  RiskBadge,
  SectionHeader,
  SectionShell,
  SplitLayout,
  StateSectionCard,
  StatusBadge,
  SummaryStatCard,
  SurfaceCard,
  WorkerBadge,
} from "../components/primitives";
import {
  activityFeed,
  artifacts,
  decisionInfo,
  overviewStats,
} from "../data/dashboard";

export function PrimitivesShowcasePage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Internal UI Lab"
        title="Primitives Showcase"
        description="A single integration surface for checking that the Wave 1 primitive layer composes cleanly across layout, state, content, and placeholder scenarios."
        actions={
          <div className="cluster">
            <ModeBadge mode="shadow" />
            <StatusBadge status="active" />
            <KPIBadge label="Visual integration route" tone="info" />
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
          title="Semantic state system"
          caption="Badges must read instantly and stay coherent across approvals, policies, replay, and workflow pages."
        />
        <div className="showcase-matrix">
          <StateSectionCard
            title="Execution, approval, and risk"
            description="Primary state language for the platform."
          >
            <div className="badge-stack">
              <ModeBadge mode="shadow" />
              <ModeBadge mode="executed" />
              <StatusBadge status="waiting" />
              <StatusBadge status="completed" />
              <ApprovalBadge state="pending" />
              <ApprovalBadge state="approved" />
              <RiskBadge risk="medium" />
              <RiskBadge risk="high" />
            </div>
          </StateSectionCard>
          <StateSectionCard
            title="Actor and urgency language"
            description="Worker and priority chips share the same restrained badge framework."
          >
            <div className="badge-stack">
              <WorkerBadge worker="Intake Worker" />
              <WorkerBadge worker="Policy Worker" />
              <WorkerBadge worker="Execution Worker" />
              <PriorityBadge priority="low" />
              <PriorityBadge priority="medium" />
              <PriorityBadge priority="high" />
            </div>
          </StateSectionCard>
        </div>
      </SectionShell>

      <SectionShell>
        <SectionHeader
          title="Rows, detail blocks, and callouts"
          caption="These are the composable patterns for timelines, evidence panels, and sidecar detail surfaces."
        />
        <SplitLayout
          primary={
            <Panel
              title="Activity rows"
              description="Compact timeline rows suited for recent events, replay milestones, or workflow feeds."
            >
              <div className="activity-list">
                {activityFeed.map((item, index) => (
                  <ActivityRow
                    key={item.title}
                    title={item.title}
                    description={item.description}
                    meta={item.meta}
                    tone={item.tone}
                    badge={
                      index === 1 ? (
                        <ApprovalBadge state="pending" />
                      ) : (
                        <ModeBadge mode="shadow" />
                      )
                    }
                  />
                ))}
              </div>
            </Panel>
          }
          secondary={
            <div className="stack">
              <SurfaceCard
                title="Structured detail"
                description="Info lists work for decision context, artifacts, and workflow metadata."
              >
                <InfoList items={[...decisionInfo]} />
              </SurfaceCard>
              <CalloutBlock
                tone="danger"
                title="High-risk actions should never blend into the background"
                description="Use callouts for policy or approval moments that deserve immediate attention without turning the whole screen into an alert wall."
              />
            </div>
          }
        />
      </SectionShell>

      <SectionShell>
        <SectionHeader
          title="Records and placeholders"
          caption="Empty states and evidence rows share the same product-grade spacing and surface treatment."
        />
        <div className="showcase-matrix">
          <SurfaceCard
            title="Artifact rows"
            description="Reusable for documents, receipts, evidence packets, or source records."
          >
            <div className="record-list">
              {artifacts.map((artifact) => (
                <ArtifactRow
                  key={artifact.title}
                  title={artifact.title}
                  description={artifact.description}
                  meta={artifact.meta}
                  badge={<WorkerBadge worker="Artifact" />}
                />
              ))}
            </div>
          </SurfaceCard>
          <Panel
            title="Placeholder surfaces"
            description="Empty states still need to feel like intentional product UI."
          >
            <div className="stack">
              <EmptyStateBlock
                title="No workflow selected"
                description="Choose a seeded run or a future live execution to populate this side panel with trace detail."
                hint="Replay frames, evidence, and policy decisions will appear here later."
                icon="RF"
              />
              <PlaceholderStateSection
                title="Approval queue is clear"
                description="When there are no pending decisions, the screen still needs a stable visual anchor and guidance."
                hint="High-risk actions that require intervention will show up here automatically."
                icon="AP"
              />
            </div>
          </Panel>
        </div>
      </SectionShell>

      <SectionShell>
        <SectionHeader
          title="Action controls"
          caption="Buttons stay understated and operational so they can support later tabs, filters, and launch actions."
        />
        <Panel
          title="Interaction-light controls"
          description="Reusable button treatments for controlled UI actions."
        >
          <div className="cluster">
            <Button variant="primary">Launch scenario</Button>
            <Button variant="secondary">Open receipt</Button>
            <Button variant="ghost">Filter pending only</Button>
          </div>
        </Panel>
      </SectionShell>
    </PageShell>
  );
}

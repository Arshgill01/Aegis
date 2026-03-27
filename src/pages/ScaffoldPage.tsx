import {
  Button,
  CalloutBlock,
  KPIBadge,
  MetricRow,
  ModeBadge,
  PageHeader,
  PageShell,
  PlaceholderStateSection,
  Panel,
  PriorityBadge,
  SectionHeader,
  SectionShell,
  SplitLayout,
} from "../components/primitives";
import { routeScaffoldMetrics } from "../data/dashboard";

type ScaffoldPageProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function ScaffoldPage({
  eyebrow,
  title,
  description,
}: ScaffoldPageProps) {
  return (
    <PageShell>
      <PageHeader
        eyebrow={eyebrow}
        title={title}
        description={description}
        actions={
          <div className="cluster">
            <ModeBadge mode="shadow" />
            <PriorityBadge priority="medium" />
            <KPIBadge label="Shell scaffold" tone="neutral" />
          </div>
        }
      />

      <SectionShell>
        <SectionHeader
          title="Shared structure"
          caption="This page is intentionally light on business logic and heavy on composable surfaces."
        />
        <SplitLayout
          primary={
            <Panel
              title="Route placeholder"
              description="Downstream branches can replace this content while keeping the same shell, spacing, and panel language."
            >
              <div className="stack">
                {routeScaffoldMetrics.map(([label, value]) => (
                  <MetricRow key={label} label={label} value={value} />
                ))}
              </div>
            </Panel>
          }
          secondary={
            <div className="stack">
              <CalloutBlock
                tone="info"
                title="Reserved capacity"
                description="Empty space is deliberate here so future route slices can insert their own status cards, evidence panels, and lists."
              />
              <PlaceholderStateSection
                title="Placeholder section already productized"
                description="Later branches should compose real workflow content on top of this surface instead of shipping a blank or generic empty panel."
                hint="The shell, typography, spacing, and semantic badges are already aligned."
                icon="MC"
              />
            </div>
          }
        />
      </SectionShell>

      <SectionShell>
        <SectionHeader
          title="Scaffold actions"
          caption="Lightweight controls are available for later route-specific filters, tabs, or launch actions."
        />
        <Panel title="Interaction-light primitives" description="Buttons stay restrained and operational rather than marketing-styled.">
          <div className="cluster">
            <Button variant="primary">Primary action</Button>
            <Button variant="secondary">Secondary action</Button>
            <Button variant="ghost">Quiet control</Button>
          </div>
        </Panel>
      </SectionShell>
    </PageShell>
  );
}

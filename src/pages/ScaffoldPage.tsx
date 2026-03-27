import {
  KPIBadge,
  MetricRow,
  PageHeader,
  PageShell,
  Panel,
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
        actions={<KPIBadge label="Shell scaffold" />}
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
            <Panel
              inset
              title="Reserved capacity"
              description="Empty space is deliberate here so future route slices can insert their own status cards, evidence panels, and lists."
            >
              <div className="placeholder-block">
                <p>
                  This scaffold is already productized enough to avoid the blank
                  page look. Later branches should compose real content on top of
                  it rather than rebuilding the page frame.
                </p>
              </div>
            </Panel>
          }
        />
      </SectionShell>
    </PageShell>
  );
}

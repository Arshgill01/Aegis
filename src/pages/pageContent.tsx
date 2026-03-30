import { PageShell } from "../components/shell/PageShell";
import { StackList } from "../components/shell/StackList";
import { SurfaceCard } from "../components/shell/SurfaceCard";

export type PageContentConfig = {
  eyebrow: string;
  title: string;
  description: string;
  summaryCards: {
    label: string;
    value: string;
    tone?: "neutral" | "attention" | "positive";
  }[];
  signals: {
    label: string;
    detail: string;
    emphasis?: string;
  }[];
  primaryTitle: string;
  primaryEyebrow: string;
  primaryItems: {
    title: string;
    detail: string;
    tag?: string;
    href?: string;
  }[];
  secondaryTitle: string;
  secondaryEyebrow: string;
  secondaryItems: {
    title: string;
    detail: string;
    tag?: string;
    href?: string;
  }[];
  footerNote: string;
};

export function buildPageContent(config: PageContentConfig) {
  return (
    <PageShell
      eyebrow={config.eyebrow}
      title={config.title}
      description={config.description}
      summaryCards={config.summaryCards}
      signals={config.signals}
      primaryColumn={
        <SurfaceCard
          eyebrow={config.primaryEyebrow}
          title={config.primaryTitle}
          footer={config.footerNote}
        >
          <StackList items={config.primaryItems} />
        </SurfaceCard>
      }
      secondaryColumn={
        <SurfaceCard eyebrow={config.secondaryEyebrow} title={config.secondaryTitle}>
          <StackList items={config.secondaryItems} />
        </SurfaceCard>
      }
    />
  );
}

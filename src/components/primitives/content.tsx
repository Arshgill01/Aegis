import type { ReactNode } from "react";
import { Panel, SurfaceCard } from "./surfaces";
import { cn } from "../../lib/cn";

type InfoListProps = {
  items: Array<{
    label: string;
    value: ReactNode;
  }>;
};

type RecordRowProps = {
  title: string;
  description: string;
  meta?: string;
  badge?: ReactNode;
  value?: ReactNode;
};

type ActivityTone = "neutral" | "info" | "success" | "warning" | "danger";

type ActivityRowProps = {
  title: string;
  description: string;
  meta?: string;
  badge?: ReactNode;
  tone?: ActivityTone;
};

type EmptyStateBlockProps = {
  title: string;
  description: string;
  hint?: string;
  icon?: string;
  centered?: boolean;
  actions?: ReactNode;
};

type PlaceholderStateSectionProps = {
  title: string;
  description: string;
  hint?: string;
  icon?: string;
  className?: string;
};

type CalloutBlockProps = {
  title: string;
  description: string;
  tone?: ActivityTone;
  actions?: ReactNode;
};

export function InfoList({ items }: InfoListProps) {
  return (
    <div className="info-list">
      {items.map((item) => (
        <div key={item.label} className="info-list__item">
          <div className="info-list__label">{item.label}</div>
          <div className="info-list__value">{item.value}</div>
        </div>
      ))}
    </div>
  );
}

export function RecordRow({
  title,
  description,
  meta,
  badge,
  value,
}: RecordRowProps) {
  return (
    <article className="record-row">
      <div className="record-row__header">
        <div>
          <h3 className="record-row__title">{title}</h3>
          {meta ? <div className="record-row__meta">{meta}</div> : null}
        </div>
        {badge ?? null}
      </div>
      <p className="record-row__description">{description}</p>
      {value && !badge ? <div>{value}</div> : null}
    </article>
  );
}

export function ArtifactRow(props: RecordRowProps) {
  return <RecordRow {...props} />;
}

export function ActivityRow({
  title,
  description,
  meta,
  badge,
  tone = "neutral",
}: ActivityRowProps) {
  return (
    <article className="activity-row" data-tone={tone}>
      <div className="activity-row__header">
        <div>
          <h3 className="activity-row__title">{title}</h3>
          {meta ? <div className="activity-row__meta">{meta}</div> : null}
        </div>
        {badge ? <div>{badge}</div> : null}
      </div>
      <p className="activity-row__description">{description}</p>
    </article>
  );
}

export function EmptyStateBlock({
  title,
  description,
  hint,
  icon = "AE",
  centered,
  actions,
}: EmptyStateBlockProps) {
  return (
    <div className={cn("empty-state", centered && "empty-state--centered")}>
      <div className="empty-state__icon" aria-hidden="true">
        {icon}
      </div>
      <div className="stack">
        <div>
          <h3 className="empty-state__title">{title}</h3>
          <p className="empty-state__copy">{description}</p>
        </div>
        {hint ? <p className="empty-state__hint">{hint}</p> : null}
      </div>
      {actions ? <div>{actions}</div> : null}
    </div>
  );
}

export function PlaceholderStateSection({
  title,
  description,
  hint,
  icon,
  className,
}: PlaceholderStateSectionProps) {
  return (
    <Panel className={cn("placeholder-section", className)} inset>
      <EmptyStateBlock title={title} description={description} hint={hint} icon={icon} />
    </Panel>
  );
}

export function CalloutBlock({
  title,
  description,
  tone = "info",
  actions,
}: CalloutBlockProps) {
  return (
    <div className="callout" data-tone={tone}>
      <div>
        <h3 className="callout__title">{title}</h3>
        <p className="callout__copy">{description}</p>
      </div>
      {actions ? <div>{actions}</div> : null}
    </div>
  );
}

export function StateSectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <SurfaceCard title={title} description={description}>
      {children}
    </SurfaceCard>
  );
}

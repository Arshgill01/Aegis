import type { CSSProperties, ReactNode } from "react";
import { cn } from "../../lib/cn";

type SurfaceCardProps = {
  title?: string;
  description?: string;
  children: ReactNode;
  actions?: ReactNode;
  className?: string;
};

type PanelProps = SurfaceCardProps & {
  inset?: boolean;
};

type SummaryStatCardProps = {
  eyebrow: string;
  label: string;
  value: string;
  meta: string;
  accent?: string;
};

type MetricRowProps = {
  label: string;
  value: ReactNode;
};

type KPIBadgeProps = {
  label: string;
  tone?: "info" | "positive" | "attention" | "critical" | "neutral";
};

export function SurfaceCard({
  title,
  description,
  children,
  actions,
  className,
}: SurfaceCardProps) {
  return (
    <article className={cn("surface-card", className)}>
      {title || description || actions ? (
        <div className="surface-card__header">
          <div>
            {title ? <h3 className="surface-card__title">{title}</h3> : null}
            {description ? (
              <p className="surface-card__copy">{description}</p>
            ) : null}
          </div>
          {actions ? <div>{actions}</div> : null}
        </div>
      ) : null}
      {children}
    </article>
  );
}

export function DetailCard(props: SurfaceCardProps) {
  return <SurfaceCard {...props} className={cn("detail-card", props.className)} />;
}

export function Panel({
  inset,
  title,
  description,
  children,
  actions,
  className,
}: PanelProps) {
  return (
    <section className={cn("panel", inset && "panel--inset", className)}>
      {title || description || actions ? (
        <div className="panel__header">
          <div>
            {title ? <h3 className="panel__title">{title}</h3> : null}
            {description ? <p className="panel__copy">{description}</p> : null}
          </div>
          {actions ? <div>{actions}</div> : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}

export function InsetPanel(props: Omit<PanelProps, "inset">) {
  return <Panel {...props} inset />;
}

export function SummaryStatCard({
  eyebrow,
  label,
  value,
  meta,
  accent,
}: SummaryStatCardProps) {
  const style = accent
    ? ({ "--summary-accent": accent } as CSSProperties)
    : undefined;

  return (
    <article className="summary-stat-card" style={style}>
      <span className="summary-stat-card__signal">{eyebrow}</span>
      <p className="summary-stat-card__value">{value}</p>
      <p className="summary-stat-card__label">{label}</p>
      <div className="summary-stat-card__meta">{meta}</div>
    </article>
  );
}

export function MetricRow({ label, value }: MetricRowProps) {
  return (
    <div className="metric-row">
      <span className="metric-row__label">{label}</span>
      <span className="metric-row__value">{value}</span>
    </div>
  );
}

export function KPIBadge({ label, tone = "info" }: KPIBadgeProps) {
  return (
    <span className="signal-kpi" data-tone={tone}>
      {label}
    </span>
  );
}

import { StatusBadge, type StatusTone } from "./StatusBadge";

type MetricCardProps = {
  label: string;
  value: string;
  detail: string;
  tone?: StatusTone;
  badge?: string;
};

export function MetricCard({
  label,
  value,
  detail,
  tone = "neutral",
  badge,
}: MetricCardProps) {
  return (
    <article className="metric-card">
      <div className="metric-card__header">
        <p>{label}</p>
        {badge ? <StatusBadge tone={tone}>{badge}</StatusBadge> : null}
      </div>
      <strong>{value}</strong>
      <span>{detail}</span>
    </article>
  );
}

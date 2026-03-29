import type { ReactNode } from "react";

type SummaryCard = {
  label: string;
  value: string;
  detail?: string;
  tone?: "neutral" | "attention" | "positive";
};

type SignalItem = {
  label: string;
  detail: string;
  emphasis?: string;
};

type PageShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  summaryCards: SummaryCard[];
  primaryColumn: ReactNode;
  secondaryColumn: ReactNode;
  signals?: SignalItem[];
};

export function PageShell({
  eyebrow,
  title,
  description,
  summaryCards,
  primaryColumn,
  secondaryColumn,
  signals = [],
}: PageShellProps) {
  return (
    <div className="page-shell">
      <section className="hero-panel">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h2>{title}</h2>
          <p className="hero-panel__description">{description}</p>
        </div>
        {signals.length > 0 ? (
          <div className="signal-list" aria-label="Current signals">
            {signals.map((signal) => (
              <div key={signal.label} className="signal-item">
                <span>{signal.label}</span>
                <strong>{signal.detail}</strong>
                {signal.emphasis ? <em>{signal.emphasis}</em> : null}
              </div>
            ))}
          </div>
        ) : null}
      </section>

      <section className="summary-grid" aria-label="Page summary">
        {summaryCards.map((card) => (
          <article
            key={card.label}
            className={`summary-card summary-card--${card.tone ?? "neutral"}`}
          >
            <span>{card.label}</span>
            <strong>{card.value}</strong>
            {card.detail ? <p>{card.detail}</p> : null}
          </article>
        ))}
      </section>

      <section className="content-grid">
        <div className="content-grid__primary">{primaryColumn}</div>
        <aside className="content-grid__secondary">{secondaryColumn}</aside>
      </section>
    </div>
  );
}

import type { ReactNode } from "react";

type SurfaceCardProps = {
  title: string;
  eyebrow?: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function SurfaceCard({ title, eyebrow, children, footer }: SurfaceCardProps) {
  return (
    <section className="surface-card">
      <header className="surface-card__header">
        <div>
          {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
          <h3>{title}</h3>
        </div>
      </header>
      <div className="surface-card__body">{children}</div>
      {footer ? <footer className="surface-card__footer">{footer}</footer> : null}
    </section>
  );
}

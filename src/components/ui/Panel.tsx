import type { HTMLAttributes, ReactNode } from "react";

type PanelProps = HTMLAttributes<HTMLElement> & {
  title?: string;
  description?: string;
  actions?: ReactNode;
  compact?: boolean;
};

export function Panel({
  title,
  description,
  actions,
  compact = false,
  className,
  children,
  ...rest
}: PanelProps) {
  const classes = ["panel", compact ? "panel--compact" : "", className ?? ""]
    .filter(Boolean)
    .join(" ");

  return (
    <section className={classes} {...rest}>
      {title || description || actions ? (
        <header className="panel__header">
          <div>
            {title ? <h3>{title}</h3> : null}
            {description ? <p>{description}</p> : null}
          </div>
          {actions ? <div>{actions}</div> : null}
        </header>
      ) : null}
      {children}
    </section>
  );
}

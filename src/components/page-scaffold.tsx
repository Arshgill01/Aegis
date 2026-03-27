import type { ReactNode } from "react";

type Stat = {
  label: string;
  value: string;
  tone: "neutral" | "success" | "warning" | "critical";
};

type FocusItem = {
  title: string;
  description: string;
};

type PanelItem = {
  label: string;
  title: string;
  description: string;
};

type PanelProps = {
  title: string;
  description: string;
  items?: PanelItem[];
  footer?: string;
  children?: ReactNode;
};

type PlaceholderProps = {
  label: string;
  title: string;
  description: string;
  helper: string;
  notes?: string[];
};

type PageScaffoldProps = {
  eyebrow: string;
  title: string;
  description: string;
  stats: Stat[];
  focus: FocusItem[];
  sections: [PanelProps, PanelProps];
  placeholder: PlaceholderProps;
};

export function PageScaffold(props: PageScaffoldProps) {
  const [primarySection, secondarySection] = props.sections;

  return (
    <section className="page">
      <header className="page-hero">
        <div>
          <span className="eyebrow">{props.eyebrow}</span>
          <h2>{props.title}</h2>
          <p className="page-description">{props.description}</p>
        </div>

        <div className="focus-strip">
          {props.focus.map((item) => (
            <article className="focus-item" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </header>

      <div className="stat-grid">
        {props.stats.map((stat) => (
          <article className="stat-card" data-tone={stat.tone} key={stat.label}>
            <span>{stat.label}</span>
            <strong>{stat.value}</strong>
          </article>
        ))}
      </div>

      <div className="page-grid">
        <Panel {...primarySection} />
        <Panel {...secondarySection} />
        <PlaceholderState {...props.placeholder} />
      </div>
    </section>
  );
}

function Panel({ title, description, items, footer, children }: PanelProps) {
  return (
    <article className="panel">
      <div className="panel-header">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      {items?.length ? (
        <div className="panel-list">
          {items.map((item) => (
            <section className="panel-item" key={`${title}-${item.label}-${item.title}`}>
              <span className="panel-item-label">{item.label}</span>
              <h4>{item.title}</h4>
              <p>{item.description}</p>
            </section>
          ))}
        </div>
      ) : null}
      {footer ? <small className="panel-footer">{footer}</small> : null}
      {children}
    </article>
  );
}

function PlaceholderState({
  label,
  title,
  description,
  helper,
  notes,
}: PlaceholderProps) {
  return (
    <article className="panel placeholder-panel">
      <span className="pill">{label}</span>
      <h3>{title}</h3>
      <p>{description}</p>
      {notes?.length ? (
        <div className="placeholder-notes">
          {notes.map((note) => (
            <div className="placeholder-note" key={note}>
              {note}
            </div>
          ))}
        </div>
      ) : null}
      <div className="placeholder-frame">
        <div />
        <div />
        <div />
      </div>
      <small>{helper}</small>
    </article>
  );
}

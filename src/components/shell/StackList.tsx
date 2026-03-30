import { Link } from "react-router-dom";

type StackListItem = {
  title: string;
  detail: string;
  tag?: string;
  href?: string;
};

type StackListProps = {
  items: StackListItem[];
};

export function StackList({ items }: StackListProps) {
  return (
    <div className="stack-list" role="list">
      {items.map((item) => (
        <article key={item.title} className="stack-list__item" role="listitem">
          <div>
            {item.href ? (
              <strong>
                <Link className="entity-link entity-link--title" to={item.href}>
                  {item.title}
                </Link>
              </strong>
            ) : (
              <strong>{item.title}</strong>
            )}
            <p>{item.detail}</p>
          </div>
          {item.tag ? <span className="stack-list__tag">{item.tag}</span> : null}
        </article>
      ))}
    </div>
  );
}

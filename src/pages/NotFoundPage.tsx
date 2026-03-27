import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="not-found">
      <p className="eyebrow">Route not found</p>
      <h2>The requested surface is not registered in this shell.</h2>
      <p>
        Return to the primary control surface and continue from the stable Aegis
        route hierarchy.
      </p>
      <Link className="not-found__link" to="/">
        Go to Mission Control
      </Link>
    </div>
  );
}

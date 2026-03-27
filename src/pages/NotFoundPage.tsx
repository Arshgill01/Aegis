import { Link } from "react-router-dom";

import { Panel } from "../components/ui/Panel";

export function NotFoundPage() {
  return (
    <div className="centered-state">
      <Panel
        title="Route not found"
        description="This shell only exposes the Wave 1 mission-control route map."
      >
        <p className="placeholder-message">
          Return to the tracked overview route to continue reviewing the current product shell.
        </p>
        <Link className="text-link" to="/">
          Back to Mission Control
        </Link>
      </Panel>
    </div>
  );
}

import { Panel } from "../components/ui/Panel";
import { StatusBadge } from "../components/ui/StatusBadge";

type PagePlaceholderProps = {
  label: string;
  description: string;
};

export function PagePlaceholder({ label, description }: PagePlaceholderProps) {
  return (
    <div className="placeholder-page">
      <Panel
        title={label}
        description={description}
        actions={<StatusBadge tone="neutral">Wave 1 placeholder</StatusBadge>}
      >
        <p className="placeholder-message">
          This route is intentionally present so the shell reads like a coherent product while the
          Overview route carries the main implementation depth for this pass.
        </p>
      </Panel>
    </div>
  );
}

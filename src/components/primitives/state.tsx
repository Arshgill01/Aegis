import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

type BadgeTone = "neutral" | "info" | "success" | "warning" | "danger" | "worker";

type BaseBadgeProps = {
  label: string;
  tone: BadgeTone;
  className?: string;
};

type StatusValue = "active" | "completed" | "waiting" | "blocked" | "flagged";
type RiskValue = "low" | "medium" | "high";
type ApprovalValue = "pending" | "approved" | "rejected" | "resumed";
type ModeValue = "shadow" | "executed";
type PriorityValue = "low" | "medium" | "high";

type WorkerBadgeProps = {
  worker: string;
  detail?: ReactNode;
  className?: string;
};

function Badge({ label, tone, className }: BaseBadgeProps) {
  return (
    <span className={cn("badge", className)} data-tone={tone}>
      {label}
    </span>
  );
}

const statusLabels: Record<StatusValue, BaseBadgeProps> = {
  active: { label: "Active", tone: "info" },
  completed: { label: "Completed", tone: "success" },
  waiting: { label: "Waiting", tone: "neutral" },
  blocked: { label: "Blocked", tone: "danger" },
  flagged: { label: "Flagged", tone: "warning" },
};

const riskLabels: Record<RiskValue, BaseBadgeProps> = {
  low: { label: "Low risk", tone: "success" },
  medium: { label: "Medium risk", tone: "warning" },
  high: { label: "High risk", tone: "danger" },
};

const approvalLabels: Record<ApprovalValue, BaseBadgeProps> = {
  pending: { label: "Pending approval", tone: "warning" },
  approved: { label: "Approved", tone: "success" },
  rejected: { label: "Rejected", tone: "danger" },
  resumed: { label: "Resumed", tone: "info" },
};

const modeLabels: Record<ModeValue, BaseBadgeProps> = {
  shadow: { label: "Shadow mode", tone: "neutral" },
  executed: { label: "Executed", tone: "info" },
};

const priorityLabels: Record<PriorityValue, BaseBadgeProps> = {
  low: { label: "Low priority", tone: "neutral" },
  medium: { label: "Medium priority", tone: "warning" },
  high: { label: "High priority", tone: "danger" },
};

export function StatusBadge({
  status,
  className,
}: {
  status: StatusValue;
  className?: string;
}) {
  const config = statusLabels[status];
  return <Badge {...config} className={className} />;
}

export function RiskBadge({
  risk,
  className,
}: {
  risk: RiskValue;
  className?: string;
}) {
  const config = riskLabels[risk];
  return <Badge {...config} className={className} />;
}

export function ApprovalBadge({
  state,
  className,
}: {
  state: ApprovalValue;
  className?: string;
}) {
  const config = approvalLabels[state];
  return <Badge {...config} className={className} />;
}

export function ModeBadge({
  mode,
  className,
}: {
  mode: ModeValue;
  className?: string;
}) {
  const config = modeLabels[mode];
  return <Badge {...config} className={className} />;
}

export function PriorityBadge({
  priority,
  className,
}: {
  priority: PriorityValue;
  className?: string;
}) {
  const config = priorityLabels[priority];
  return <Badge {...config} className={className} />;
}

export function WorkerBadge({
  worker,
  detail,
  className,
}: WorkerBadgeProps) {
  return (
    <span className={cn("badge", className)} data-tone="worker">
      {worker}
      {detail ? <span>{detail}</span> : null}
    </span>
  );
}

import { PagePlaceholder } from "./PagePlaceholder";

export function AgentsPage() {
  return (
    <PagePlaceholder
      label="Agents"
      description="Worker roles, assignments, and runtime posture will land here in later Wave 1 slices."
    />
  );
}

export function RunsTasksPage() {
  return (
    <PagePlaceholder
      label="Runs"
      description="Workflow runs, task lanes, and handoffs will be fleshed out once the shell stabilizes."
    />
  );
}

export function ApprovalsPage() {
  return (
    <PagePlaceholder
      label="Approvals"
      description="Approval queues and reviewer context are reserved for a later control-surface pass."
    />
  );
}

export function ReplayAuditPage() {
  return (
    <PagePlaceholder
      label="Replay & Audit"
      description="Replayable event history and evidence views are deferred until later waves."
    />
  );
}

export function PoliciesPage() {
  return (
    <PagePlaceholder
      label="Policies"
      description="Policy posture and rule explainability are intentionally represented as placeholders for now."
    />
  );
}

export function FinOpsWorkflowPage() {
  return (
    <PagePlaceholder
      label="FinOps Workflow"
      description="The first high-stakes showcase domain will attach here once deeper scenario work lands."
    />
  );
}

export function SettingsDemoControlsPage() {
  return (
    <PagePlaceholder
      label="Settings & Demo Controls"
      description="Scenario launchers, demo mode, and environment controls will be layered in after the shell."
    />
  );
}

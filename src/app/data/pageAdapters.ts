import type {
  ApprovalRequest,
  ExecutionMode,
  PolicyOutcome,
  RiskLevel,
  StepStatus,
  WorkflowScenario,
} from "../../domain/contracts";
import {
  getScenarioByRunId,
  getWorkerById,
} from "../../domain/mockRepository";
import {
  selectAgentsOverview,
  selectApprovalsOverview,
  selectFinOpsOverview,
  selectMissionControlSnapshot,
  selectPoliciesOverview,
  selectRunsOverview,
} from "../../domain/selectors";
import type { PageContentConfig } from "../../pages/pageContent";
import type {
  MissionControlPageData,
  MissionTone,
  SummaryCardItem,
} from "../../pages/overview/missionControlData";

function formatCompactCurrency(amountUsd: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(amountUsd);
}

function formatCurrency(amountUsd: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amountUsd);
}

function formatRiskLabel(riskLevel: RiskLevel) {
  return `${riskLevel.slice(0, 1).toUpperCase()}${riskLevel.slice(1)}`;
}

function formatMode(mode: ExecutionMode): "Shadow" | "Execute-ready" {
  return mode === "shadow" ? "Shadow" : "Execute-ready";
}

function formatStepStatus(status: StepStatus) {
  switch (status) {
    case "waiting_for_approval":
      return "Approval hold";
    case "blocked":
      return "Blocked";
    case "running":
      return "Running";
    case "completed":
      return "Completed";
    default:
      return "Queued";
  }
}

function formatRunStatus(status: WorkflowScenario["run"]["status"]) {
  switch (status) {
    case "waiting_for_approval":
      return "Approval hold";
    case "blocked":
      return "Blocked";
    case "running":
      return "Running";
    case "planning":
      return "Planning";
    case "queued":
      return "Queued";
    default:
      return "Completed";
  }
}

function formatOutcome(outcome: PolicyOutcome) {
  return `${outcome.slice(0, 1).toUpperCase()}${outcome.slice(1)}`;
}

function formatEventTime(timestamp: string) {
  return timestamp.slice(11, 16);
}

function etaLabel(etaMinutes: number) {
  return etaMinutes === 0 ? "Complete" : `${etaMinutes} min`;
}

function toneFromRisk(riskLevel: RiskLevel): MissionTone {
  return riskLevel === "low" ? "positive" : "attention";
}

function workerName(workerId: string) {
  return getWorkerById(workerId)?.name ?? "Unknown worker";
}

function buildPostureSignal(
  label: string,
  value: string,
  badge: string,
  tone: MissionTone,
): SummaryCardItem {
  return {
    label,
    value,
    detail: "",
    badge,
    tone,
  };
}

function approvalScenario(approval: ApprovalRequest) {
  return getScenarioByRunId(approval.runId);
}

export function buildMissionControlPageData(): MissionControlPageData {
  const snapshot = selectMissionControlSnapshot();

  return {
    summaryCards: [
      {
        label: "Active workflows",
        value: `${snapshot.activeRunCount}`,
        detail: `${snapshot.activeScenarios.filter((scenario) => scenario.run.mode === "shadow").length} runs are still shadowing while ${snapshot.activeScenarios.filter((scenario) => scenario.run.mode === "execute_ready").length} are cleared for controlled execution.`,
        badge: "Live",
        tone: "neutral",
      },
      {
        label: "Human gates",
        value: `${snapshot.pendingApprovalCount}`,
        detail: "Named approvers are holding payment-sensitive actions before execution can resume.",
        badge: "Queued",
        tone: "attention",
      },
      {
        label: "Flagged exceptions",
        value: `${snapshot.flaggedCount}`,
        detail: "Mismatch, remittance drift, and evidence gaps stay visible instead of disappearing into the queue.",
        badge: "Attention",
        tone: "attention",
      },
      {
        label: "Audit capture",
        value: "100%",
        detail: "Every seeded run retains events, artifacts, and receipt-ready context for later replay work.",
        badge: "Retained",
        tone: "positive",
      },
    ],
    postureSignals: [
      buildPostureSignal(
        "Protected payment value",
        formatCompactCurrency(snapshot.protectedPaymentValueUsd),
        "Guarded",
        "attention",
      ),
      buildPostureSignal(
        "Runs under review",
        `${snapshot.underReviewCount}`,
        "Escalated",
        "neutral",
      ),
      buildPostureSignal(
        "Blocked tool actions",
        `${snapshot.blockedPolicyCount}`,
        "Contained",
        "attention",
      ),
    ],
    activeRuns: snapshot.activeScenarios.slice(0, 4).map((scenario) => ({
      id: scenario.run.id,
      workflow: scenario.run.workflow,
      company: scenario.run.accountName,
      stage: scenario.run.currentStage,
      mode: formatMode(scenario.run.mode),
      owner: workerName(scenario.run.ownerWorkerId),
      risk: formatRiskLabel(scenario.run.riskLevel) as "Low" | "Medium" | "High",
      nextAction: scenario.run.nextAction,
      eta: etaLabel(scenario.run.etaMinutes),
    })),
    approvals: snapshot.pendingApprovals.map((approval) => ({
      id: approval.id,
      title: approval.title,
      runId: approval.runId,
      reason: approval.reason,
      owner: approval.assignee,
      dueBy: approval.dueLabel,
      riskLabel: approval.triggerLabel,
      tone: toneFromRisk(approval.riskLevel),
    })),
    activity: snapshot.recentEvents.map((event) => ({
      time: formatEventTime(event.timestamp),
      title: event.title,
      detail: event.detail,
      actor: event.actorName,
      category: event.category,
      tone: toneFromRisk(event.riskLevel),
    })),
    flaggedItems: snapshot.flaggedScenarios.slice(0, 3).map((scenario) => ({
      title: scenario.title,
      runId: scenario.run.id,
      severity: `${formatRiskLabel(scenario.run.riskLevel)} severity`,
      summary: scenario.policies[0]?.trigger ?? scenario.narrative,
      nextAction: scenario.run.nextAction,
      tone: toneFromRisk(scenario.run.riskLevel),
    })),
    workers: snapshot.workers.map((worker) => ({
      name: worker.name,
      role: worker.role,
      queue: `${worker.queueDepth} queued`,
      focus: worker.focus,
      posture: worker.posture,
      load: `${worker.loadPercent}%`,
      tone:
        worker.loadPercent >= 80 || worker.posture === "Escalated" ? "attention" : "neutral",
    })),
    spotlight: {
      title: snapshot.spotlight.title,
      phase: snapshot.spotlight.phase,
      narrative: snapshot.spotlight.narrative,
      watchpoints: snapshot.spotlight.watchpoints,
    },
  };
}

export function buildAgentsPageContent(): PageContentConfig {
  const overview = selectAgentsOverview();
  const highestLoadWorker = overview.workers.reduce((highest, worker) =>
    worker.loadPercent > highest.loadPercent ? worker : highest,
  );
  const approvalWorker = overview.workers.find((worker) => worker.id === "worker-approval");

  return {
    eyebrow: "Worker Surface",
    title: "Agent roles and supervision lanes",
    description:
      "Seeded worker lanes now show real queue pressure, ownership, and recent participation without coupling the page to fixture internals.",
    summaryCards: [
      { label: "Worker lanes", value: `${overview.workers.length} active roles` },
      { label: "Live assignments", value: `${overview.activeRunCount} runs in motion` },
      {
        label: "Escalation owners",
        value: `${overview.escalationOwnerCount} lanes on exception duty`,
        tone: "attention",
      },
      {
        label: "Execution posture",
        value: `${overview.shadowRunCount} shadow / ${overview.activeRunCount - overview.shadowRunCount} execute-ready`,
        tone: "positive",
      },
    ],
    signals: [
      {
        label: "Highest load",
        detail: `${highestLoadWorker.name} at ${highestLoadWorker.loadPercent}%`,
      },
      {
        label: "Approval routing",
        detail: approvalWorker
          ? `${approvalWorker.queueDepth} gates held by ${approvalWorker.name}`
          : "Approval queue is stable",
      },
    ],
    primaryTitle: "Active worker lanes",
    primaryEyebrow: "Seeded operations",
    primaryItems: overview.workers.map((worker) => ({
      title: worker.name,
      detail: `${worker.role}. ${worker.focus}`,
      tag: `${worker.queueDepth} queued · ${worker.posture} · ${worker.loadPercent}%`,
    })),
    secondaryTitle: "Recent worker participation",
    secondaryEyebrow: "Seeded telemetry",
    secondaryItems: overview.recentEvents.slice(0, 4).map((event) => {
      const scenario = getScenarioByRunId(event.runId);

      return {
        title: event.title,
        detail: `${event.detail}${scenario ? ` Run ${scenario.run.id} · ${scenario.run.accountName}.` : ""}`,
        tag: event.actorName,
      };
    }),
    footerNote:
      "The route now reads from seeded worker, run, and event data so later orchestration work can deepen behavior without replacing the page contract.",
  };
}

export function buildRunsPageContent(): PageContentConfig {
  const overview = selectRunsOverview();
  const executeReadyScenario = overview.activeScenarios.find(
    (scenario) => scenario.run.mode === "execute_ready",
  );

  return {
    eyebrow: "Execution Surface",
    title: "Runs, tasks, and workflow progression",
    description:
      "The queue and detail column now reflect seeded workflow runs, step states, and worker handoffs instead of generic placeholder posture.",
    summaryCards: [
      { label: "Active runs", value: `${overview.openRunCount} in motion` },
      {
        label: "Gated runs",
        value: `${overview.waitingRunCount} waiting on review`,
        tone: "attention",
      },
      { label: "Execute-ready", value: `${overview.executeReadyCount} prepared` },
      {
        label: "Completed receipts",
        value: `${overview.completedRunCount} retained`,
        tone: "positive",
      },
    ],
    signals: [
      { label: "Showcase run", detail: overview.spotlight.run.id },
      {
        label: "Next release lane",
        detail: executeReadyScenario
          ? `${executeReadyScenario.run.workflow} in ${etaLabel(executeReadyScenario.run.etaMinutes)}`
          : "No execute-ready run staged",
      },
    ],
    primaryTitle: "Seeded run queue",
    primaryEyebrow: "Route-facing queue",
    primaryItems: overview.activeScenarios.map((scenario) => ({
      title: `${scenario.run.id} · ${scenario.run.workflow}`,
      detail: `${scenario.run.accountName}. ${scenario.run.currentStage}. Owner: ${workerName(scenario.run.ownerWorkerId)}. Next: ${scenario.run.nextAction}`,
      tag: `${formatRiskLabel(scenario.run.riskLevel)} · ${formatRunStatus(scenario.run.status)}`,
    })),
    secondaryTitle: "Selected run step detail",
    secondaryEyebrow: overview.spotlight.run.id,
    secondaryItems: overview.spotlight.steps.map((step) => ({
      title: step.title,
      detail: `${step.summary} ${workerName(step.workerId)} owns this step in ${formatMode(step.mode).toLowerCase()} mode.`,
      tag: formatStepStatus(step.status),
    })),
    footerNote:
      "Run and step data come from deterministic scenarios, keeping the route legible now while leaving room for later runtime progression.",
  };
}

export function buildApprovalsPageContent(): PageContentConfig {
  const overview = selectApprovalsOverview();
  const primaryApproval = overview.pendingApprovals[0];
  const primaryScenario = primaryApproval ? approvalScenario(primaryApproval) : undefined;
  const primaryPolicy = primaryScenario?.policies[0];

  return {
    eyebrow: "Human Gates",
    title: "Approval queue and intervention surface",
    description:
      "Pending approvals now carry real seeded action context, named approvers, and resume paths so the route reads like a working control surface.",
    summaryCards: [
      { label: "Pending approvals", value: `${overview.pendingApprovals.length} queue items` },
      {
        label: "Protected payment value",
        value: formatCompactCurrency(overview.blockedPaymentValueUsd),
        tone: "attention",
      },
      {
        label: "Urgent decisions",
        value: `${overview.urgentApprovalCount} high-risk gates`,
        tone: "attention",
      },
      {
        label: "Linked runs",
        value: `${overview.relatedScenarios.length} supervised paths`,
        tone: "positive",
      },
    ],
    signals: [
      {
        label: "Next human action",
        detail: primaryApproval ? primaryApproval.assignee : "No approval queue backlog",
      },
      {
        label: "Resume path",
        detail: primaryApproval ? primaryApproval.requestedAction : "No pending approvals",
      },
    ],
    primaryTitle: "Pending decision queue",
    primaryEyebrow: "Seeded approvals",
    primaryItems: overview.pendingApprovals.map((approval) => ({
      title: approval.title,
      detail: `${approval.reason} Requested action: ${approval.requestedAction}`,
      tag: `${approval.dueLabel} · ${formatRiskLabel(approval.riskLevel)}`,
    })),
    secondaryTitle: "Decision brief",
    secondaryEyebrow: primaryScenario?.run.id ?? "No active gate",
    secondaryItems: primaryScenario
      ? [
          {
            title: "Why the run paused",
            detail: `${primaryScenario.run.currentStage}. ${primaryPolicy?.trigger ?? "A seeded approval trigger is attached to this run."}`,
            tag: primaryApproval?.triggerLabel,
          },
          {
            title: "What approval authorizes",
            detail: `${primaryApproval?.requestedAction ?? "Resume the blocked action."} Next system step: ${primaryScenario.run.nextAction}`,
          },
          {
            title: "Evidence attached",
            detail: primaryScenario.artifacts.map((artifact) => artifact.title).join(", "),
          },
        ]
      : [
          {
            title: "Queue is clear",
            detail: "Seeded approvals will populate this surface when a risky action opens a human gate.",
          },
        ],
    footerNote:
      "The page now uses seeded approval objects and linked scenario context instead of local placeholder prose.",
  };
}

export function buildPoliciesPageContent(): PageContentConfig {
  const overview = selectPoliciesOverview();
  const activeTriggers = overview.rules.filter((rule) =>
    rule.scenarios.some((scenario) => scenario.run.status !== "completed"),
  );

  return {
    eyebrow: "Guardrail Surface",
    title: "Policies, thresholds, and control posture",
    description:
      "The policies preview is now backed by seeded rules and concrete triggers, keeping the language operational instead of abstract governance filler.",
    summaryCards: [
      { label: "Rule set", value: `${overview.rules.length} seeded rules` },
      {
        label: "Escalate rules",
        value: `${overview.escalateCount} active`,
        tone: "attention",
      },
      {
        label: "Block rules",
        value: `${overview.blockCount} hard stops`,
        tone: "attention",
      },
      {
        label: "Allow rules",
        value: `${overview.allowCount} supervised allows`,
        tone: "positive",
      },
    ],
    signals: [
      { label: "Active triggers", detail: `${overview.activeTriggerCount} scenarios in play` },
      { label: "Policy tone", detail: "Concrete triggers and named outcomes" },
    ],
    primaryTitle: "Seeded rule catalog",
    primaryEyebrow: "Shared control contracts",
    primaryItems: overview.rules.map(({ policy, scenarios }) => ({
      title: policy.name,
      detail: `${policy.summary} Trigger: ${policy.trigger}${scenarios[0] ? ` Impacted run: ${scenarios[0].run.id}.` : ""}`,
      tag: formatOutcome(policy.outcome),
    })),
    secondaryTitle: "Triggered policy outcomes",
    secondaryEyebrow: "Scenario-linked decisions",
    secondaryItems: activeTriggers.slice(0, 4).map(({ policy, scenarios }) => ({
      title: `${scenarios[0]?.run.id ?? "Run"} · ${policy.scope}`,
      detail: `${policy.trigger} Next visible action: ${scenarios[0]?.run.nextAction ?? "Await operator review."}`,
      tag: `${formatOutcome(policy.outcome)} · ${formatRiskLabel(policy.severity)}`,
    })),
    footerNote:
      "Rules stay domain-readable and reusable: routes consume adapted view models, while fixtures and policy contracts remain separate.",
  };
}

export function buildFinOpsWorkflowPageContent(): PageContentConfig {
  const overview = selectFinOpsOverview();
  const spotlightApproval = overview.spotlight.approvals[0];

  return {
    eyebrow: "Showcase Domain",
    title: "FinOps workflow landing surface",
    description:
      "The FinOps route now binds to seeded scenarios, showing a real workflow path and exception workspace without collapsing the broader platform into finance-only assumptions.",
    summaryCards: [
      { label: "Seeded scenarios", value: `${overview.scenarios.length} curated paths` },
      { label: "Active cases", value: `${overview.activeScenarioCount} in motion` },
      {
        label: "Exception lanes",
        value: `${overview.exceptionScenarioCount} exception-heavy`,
        tone: "attention",
      },
      {
        label: "Completed receipts",
        value: `${overview.completedScenarioCount} retained`,
        tone: "positive",
      },
    ],
    signals: [
      { label: "Primary showcase", detail: overview.spotlight.title },
      { label: "Current hold", detail: overview.spotlight.run.currentStage },
    ],
    primaryTitle: "Seeded workflow path",
    primaryEyebrow: overview.spotlight.run.id,
    primaryItems: overview.spotlight.steps.map((step, index) => ({
      title: `Stage ${index + 1}: ${step.title}`,
      detail: `${step.summary} ${workerName(step.workerId)} currently owns this stage.`,
      tag: `${formatMode(step.mode)} · ${formatStepStatus(step.status)}`,
    })),
    secondaryTitle: "Exception workspace",
    secondaryEyebrow: "Scenario context",
    secondaryItems: [
      {
        title: `Invoice ${overview.spotlight.invoice.invoiceNumber}`,
        detail: `${overview.spotlight.vendor.name} submitted ${formatCurrency(overview.spotlight.invoice.amountUsd)} on ${overview.spotlight.invoice.receivedAt.slice(0, 10)}.`,
        tag: overview.spotlight.vendor.trustTier,
      },
      {
        title: `PO ${overview.spotlight.purchaseOrder?.poNumber ?? "Not attached"}`,
        detail: overview.spotlight.purchaseOrder
          ? `Baseline value ${formatCurrency(overview.spotlight.purchaseOrder.amountUsd)} with status ${overview.spotlight.purchaseOrder.status.replace("_", " ")}.`
          : "No purchase order is attached to this scenario.",
      },
      {
        title: spotlightApproval?.title ?? "No approval gate attached",
        detail: spotlightApproval
          ? `${spotlightApproval.reason} Assignee: ${spotlightApproval.assignee}.`
          : "This scenario currently has no named approval gate.",
        tag: spotlightApproval?.dueLabel,
      },
      {
        title: "Evidence bundle",
        detail: overview.spotlight.artifacts.map((artifact) => artifact.title).join(", "),
      },
    ],
    footerNote:
      "The route now consumes seeded workflow scenarios through adapters, preserving a clean boundary between fixtures, contracts, and UI rendering.",
  };
}

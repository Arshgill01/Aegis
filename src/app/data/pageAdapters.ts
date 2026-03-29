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
import type { RunsPageData, StepGroup, StepItem } from "../../pages/runs/runPageData";
import type {
  AgentsPageData,
  AgentSurfaceTone,
  WorkerHandoffSummary,
} from "../../pages/agents/agentsData";
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

function toneForStepStatus(status: StepStatus): "neutral" | "attention" | "positive" {
  if (status === "completed") {
    return "positive";
  }

  if (status === "waiting_for_approval" || status === "blocked") {
    return "attention";
  }

  return "neutral";
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

const riskPriority: Record<RiskLevel, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

function byRiskAndEta(left: WorkflowScenario, right: WorkflowScenario) {
  return (
    riskPriority[left.run.riskLevel] - riskPriority[right.run.riskLevel] ||
    left.run.etaMinutes - right.run.etaMinutes
  );
}

function toneFromRunRisk(riskLevel: RiskLevel, mode: ExecutionMode): AgentSurfaceTone {
  if (riskLevel === "high") {
    return "attention";
  }

  if (mode === "execute_ready" && riskLevel === "low") {
    return "positive";
  }

  return riskLevel === "medium" ? "attention" : "neutral";
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

type StepGroupKey = StepGroup["key"];

function groupForStepStatus(status: StepStatus): StepGroupKey {
  if (status === "completed") {
    return "completed";
  }

  if (status === "running") {
    return "in_flight";
  }

  if (status === "waiting_for_approval" || status === "blocked") {
    return "gated";
  }

  return "queued";
}

const stepGroupOrder: StepGroupKey[] = ["completed", "in_flight", "gated", "queued"];

const stepGroupLabels: Record<StepGroupKey, { label: string; detail: string }> = {
  completed: {
    label: "Completed stages",
    detail: "Ownership and outputs already captured",
  },
  in_flight: {
    label: "In-flight stages",
    detail: "Current worker actively advancing the run",
  },
  gated: {
    label: "Gated stages",
    detail: "Waiting on approval or unresolved exception",
  },
  queued: {
    label: "Queued next stages",
    detail: "Prepared but not yet owned by an active worker",
  },
};

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

export function buildAgentsPageData(): AgentsPageData {
  const overview = selectAgentsOverview();
  const activeScenarios = overview.activeScenarios.slice().sort(byRiskAndEta);
  const allActiveSteps = activeScenarios.flatMap((scenario) => scenario.steps);
  const allHandoffs = activeScenarios.flatMap<WorkerHandoffSummary>((scenario) =>
    scenario.steps.flatMap((step, index) => {
      if (index === 0) {
        return [];
      }

      const previousStep = scenario.steps[index - 1];
      if (previousStep.workerId === step.workerId) {
        return [];
      }

      return [
        {
          id: `${scenario.id}-${previousStep.id}-${step.id}`,
          runId: scenario.run.id,
          accountName: scenario.run.accountName,
          fromWorker: workerName(previousStep.workerId),
          toWorker: workerName(step.workerId),
          stepTitle: step.title,
          mode: formatMode(step.mode),
          risk: formatRiskLabel(scenario.run.riskLevel) as "Low" | "Medium" | "High",
          tone: toneFromRunRisk(scenario.run.riskLevel, step.mode),
        },
      ];
    }),
  );

  const workerLanes = overview.workers
    .map((worker) => {
      const ownedRuns = activeScenarios.filter((scenario) => scenario.run.ownerWorkerId === worker.id);
      const workerSteps = allActiveSteps.filter((step) => step.workerId === worker.id);
      const inFlightSteps = workerSteps.filter((step) =>
        ["running", "queued", "waiting_for_approval", "blocked"].includes(step.status),
      ).length;
      const blockedSteps = workerSteps.filter((step) =>
        ["waiting_for_approval", "blocked"].includes(step.status),
      ).length;
      const executeReadySteps = workerSteps.filter((step) => step.mode === "execute_ready").length;
      const latestEvent = overview.recentEvents.find((event) => event.actorName === worker.name);
      const tone: AgentSurfaceTone =
        worker.loadPercent >= 85 || blockedSteps > 0 || worker.posture === "Escalated"
          ? "attention"
          : executeReadySteps > 0
            ? "positive"
            : "neutral";

      return {
        id: worker.id,
        name: worker.name,
        role: worker.role,
        focus: worker.focus,
        posture: worker.posture,
        queueDepth: worker.queueDepth,
        loadPercent: worker.loadPercent,
        ownedRuns: ownedRuns.length,
        inFlightSteps,
        blockedSteps,
        executeReadySteps,
        latestActivity: latestEvent ? `${formatEventTime(latestEvent.timestamp)} · ${latestEvent.title}` : undefined,
        tone,
      };
    })
    .sort((left, right) => right.loadPercent - left.loadPercent);

  const highestLoadWorker = workerLanes[0];
  const executeReadyCoverage = workerLanes.filter((worker) => worker.executeReadySteps > 0).length;
  const priorityScenario = activeScenarios[0];

  return {
    eyebrow: "Worker Operations",
    title: "Agents supervising live workflow lanes",
    description:
      "Worker lanes, ownership, and handoff visibility stay explicit so reviewers can supervise orchestration without dropping into run-level internals.",
    summaryCards: [
      { label: "Worker lanes", value: `${workerLanes.length} active roles` },
      {
        label: "Live run ownership",
        value: `${new Set(activeScenarios.map((scenario) => scenario.run.ownerWorkerId)).size} lanes owning ${activeScenarios.length} runs`,
      },
      {
        label: "Visible handoffs",
        value: `${allHandoffs.length} cross-worker transitions`,
        tone: "positive",
      },
      {
        label: "Escalation pressure",
        value: `${workerLanes.filter((worker) => worker.tone === "attention").length} lanes on gated work`,
        tone: "attention",
      },
    ],
    signals: [
      {
        label: "Highest load",
        detail: highestLoadWorker
          ? `${highestLoadWorker.name} at ${highestLoadWorker.loadPercent}%`
          : "No active worker lane",
      },
      {
        label: "Execute-ready coverage",
        detail: `${executeReadyCoverage} lane(s) currently touching execute-ready steps`,
      },
      {
        label: "Priority run owner",
        detail: priorityScenario
          ? `${workerName(priorityScenario.run.ownerWorkerId)} on ${priorityScenario.run.id}`
          : "No active run ownership",
      },
    ],
    workerLanes,
    assignments: activeScenarios.map((scenario) => {
      const owner = workerName(scenario.run.ownerWorkerId);
      const supportLane = Array.from(
        new Set(
          scenario.steps
            .map((step) => workerName(step.workerId))
            .filter((worker) => worker !== owner),
        ),
      );
      const gateCount = scenario.steps.filter((step) =>
        ["waiting_for_approval", "blocked"].includes(step.status),
      ).length;
      const handoffCount = scenario.steps.reduce((count, step, index) => {
        if (index === 0 || scenario.steps[index - 1].workerId === step.workerId) {
          return count;
        }

        return count + 1;
      }, 0);

      return {
        runId: scenario.run.id,
        workflow: scenario.run.workflow,
        accountName: scenario.run.accountName,
        owner,
        stage: scenario.run.currentStage,
        nextAction: scenario.run.nextAction,
        mode: formatMode(scenario.run.mode),
        risk: formatRiskLabel(scenario.run.riskLevel) as "Low" | "Medium" | "High",
        handoffCount,
        supportLane: supportLane.length > 0 ? supportLane.join(", ") : "No supporting lane",
        gateLabel: gateCount > 0 ? `${gateCount} gated step(s)` : "Flowing",
        tone: toneFromRunRisk(scenario.run.riskLevel, scenario.run.mode),
      };
    }),
    handoffs: allHandoffs.slice(0, 6),
    recentActivity: overview.recentEvents.slice(0, 6).map((event) => {
      const scenario = getScenarioByRunId(event.runId);
      return {
        id: event.id,
        title: event.title,
        detail: event.detail,
        actor: event.actorName,
        runLabel: scenario ? `${scenario.run.id} · ${scenario.run.accountName}` : event.runId,
        time: formatEventTime(event.timestamp),
        tone: toneFromRisk(event.riskLevel),
      };
    }),
  };
}

export type ShellOrchestrationSummary = {
  routeNarrative: string;
  topbarMetrics: string[];
  topbarKpi: string;
  sidebarMode: string;
  sidebarWorkers: string;
  sidebarApprovals: string;
};

function countHandoffs(scenario: WorkflowScenario) {
  return scenario.steps.reduce((count, step, index) => {
    if (index === 0 || scenario.steps[index - 1].workerId === step.workerId) {
      return count;
    }

    return count + 1;
  }, 0);
}

function buildRouteNarrative(
  pathname: string,
  params: {
    activeRuns: number;
    activeWorkers: number;
    handoffCount: number;
    executeReadyRuns: number;
    pendingApprovals: number;
    blockedPolicies: number;
    exceptionScenarios: number;
    workerCount: number;
    scenarioCount: number;
  },
) {
  switch (pathname) {
    case "/agents":
      return `${params.activeWorkers} worker lanes are assigned across ${params.handoffCount} visible handoffs.`;
    case "/runs":
      return `${params.activeRuns} runs stay active with ${params.executeReadyRuns} execute-ready lanes in motion.`;
    case "/approvals":
      return `${params.pendingApprovals} human gate(s) are currently pausing worker execution.`;
    case "/replay":
      return `${params.handoffCount} worker handoffs are already preserved for replay-facing inspection.`;
    case "/policies":
      return `${params.blockedPolicies} blocking policy outcome(s) are actively containing risky actions.`;
    case "/finops":
      return `${params.exceptionScenarios} FinOps exception scenario(s) remain visible under worker supervision.`;
    case "/settings":
      return `${params.workerCount} worker lanes and ${params.scenarioCount} seeded scenarios are loaded for deterministic demos.`;
    default:
      return `${params.activeWorkers} worker lanes supervise ${params.activeRuns} live runs with ${params.pendingApprovals} pending approvals.`;
  }
}

export function buildShellOrchestrationSummary(pathname: string): ShellOrchestrationSummary {
  const missionSnapshot = selectMissionControlSnapshot();
  const agentsOverview = selectAgentsOverview();
  const finOpsOverview = selectFinOpsOverview();
  const activeWorkers = agentsOverview.workers.filter((worker) =>
    missionSnapshot.activeScenarios.some((scenario) =>
      scenario.steps.some((step) => step.workerId === worker.id),
    ),
  ).length;
  const handoffCount = missionSnapshot.activeScenarios.reduce(
    (total, scenario) => total + countHandoffs(scenario),
    0,
  );
  const executeReadyRuns = missionSnapshot.activeScenarios.filter(
    (scenario) => scenario.run.mode === "execute_ready",
  ).length;
  const shadowRuns = missionSnapshot.activeRunCount - executeReadyRuns;

  return {
    routeNarrative: buildRouteNarrative(pathname, {
      activeRuns: missionSnapshot.activeRunCount,
      activeWorkers,
      handoffCount,
      executeReadyRuns,
      pendingApprovals: missionSnapshot.pendingApprovalCount,
      blockedPolicies: missionSnapshot.blockedPolicyCount,
      exceptionScenarios: finOpsOverview.exceptionScenarioCount,
      workerCount: agentsOverview.workers.length,
      scenarioCount: finOpsOverview.scenarios.length,
    }),
    topbarMetrics: [
      `${shadowRuns} shadow`,
      `${executeReadyRuns} execute-ready`,
      `${missionSnapshot.pendingApprovalCount} approvals`,
    ],
    topbarKpi: `${activeWorkers}/${agentsOverview.workers.length} worker lanes assigned · ${handoffCount} visible handoff(s)`,
    sidebarMode: `${shadowRuns} shadow · ${executeReadyRuns} execute-ready`,
    sidebarWorkers: `${activeWorkers} of ${agentsOverview.workers.length} lanes assigned`,
    sidebarApprovals: `${missionSnapshot.pendingApprovalCount} active human gates`,
  };
}

export function buildRunsPageData(): RunsPageData {
  const overview = selectRunsOverview();
  const spotlightSteps: StepItem[] = overview.spotlight.steps.map((step, index) => {
    const worker = getWorkerById(step.workerId);
    const previousStep = overview.spotlight.steps[index - 1];
    const previousWorker = previousStep ? getWorkerById(previousStep.workerId) : undefined;
    const handoffFrom =
      previousStep && previousStep.workerId !== step.workerId
        ? previousWorker?.name ?? "Previous worker"
        : undefined;

    return {
      id: step.id,
      title: step.title,
      summary: step.summary,
      statusLabel: formatStepStatus(step.status),
      modeLabel: formatMode(step.mode),
      workerName: worker?.name ?? "Unknown worker",
      workerRole: worker?.role ?? "Unassigned role",
      handoffFrom,
    };
  });
  const groupedSteps: StepGroup[] = stepGroupOrder
    .map((key) => ({
      key,
      ...stepGroupLabels[key],
      items: spotlightSteps.filter((_, index) => groupForStepStatus(overview.spotlight.steps[index].status) === key),
    }))
    .filter((group) => group.items.length > 0);
  const activeStep =
    spotlightSteps.find(
      (step, index) => toneForStepStatus(overview.spotlight.steps[index].status) !== "positive",
    ) ?? spotlightSteps[spotlightSteps.length - 1];
  const spotlightOwner = getWorkerById(overview.spotlight.run.ownerWorkerId);
  const completedSpotlightSteps = overview.spotlight.steps.filter(
    (step) => step.status === "completed",
  ).length;
  const shadowSpotlightStepCount = overview.spotlight.steps.filter(
    (step) => step.mode === "shadow",
  ).length;
  const executeReadySpotlightStepCount = overview.spotlight.steps.filter(
    (step) => step.mode === "execute_ready",
  ).length;
  const shadowRunCount = overview.activeScenarios.filter((scenario) => scenario.run.mode === "shadow")
    .length;
  const workerModeMap = new Map(
    overview.spotlight.steps.map((step) => [workerName(step.workerId), formatMode(step.mode)]),
  );
  const eventTimeline = overview.spotlight.events
    .slice()
    .sort((left, right) => left.timestamp.localeCompare(right.timestamp))
    .map((event) => ({
      id: event.id,
      lane: "event" as const,
      timeLabel: formatEventTime(event.timestamp),
      title: event.title,
      detail: event.detail,
      actorName: event.actorName,
      category: event.category,
      modeLabel: workerModeMap.get(event.actorName) ?? formatMode(overview.spotlight.run.mode),
      tone: toneFromRisk(event.riskLevel),
    }));
  const handoffTimeline = spotlightSteps
    .filter((step) => Boolean(step.handoffFrom))
    .map((step) => ({
      id: `handoff-${step.id}`,
      lane: "handoff" as const,
      timeLabel: "Handoff",
      title: `${step.handoffFrom ?? "Previous worker"} handed off to ${step.workerName}`,
      detail: step.title,
      actorName: step.workerName,
      category: "Ownership shift",
      modeLabel: step.modeLabel,
      tone: "neutral" as const,
    }));
  const nextExecuteStep = spotlightSteps.find(
    (step, index) =>
      overview.spotlight.steps[index].mode === "execute_ready" &&
      overview.spotlight.steps[index].status !== "completed",
  );

  return {
    eyebrow: "Execution Surface",
    title: "Run detail and worker orchestration",
    description:
      "Run surfaces now expose worker ownership, stage progression, and explicit handoffs so orchestration remains visible while runs move or pause.",
    summaryCards: [
      { label: "Active runs", value: `${overview.openRunCount} in motion` },
      {
        label: "Gated runs",
        value: `${overview.waitingRunCount} waiting on review`,
        tone: "attention",
      },
      {
        label: "Mode split",
        value: `${shadowRunCount} shadow / ${overview.executeReadyCount} execute-ready`,
      },
      {
        label: "Completed receipts",
        value: `${overview.completedRunCount} retained`,
        tone: "positive",
      },
    ],
    signals: [
      { label: "Spotlight run", detail: overview.spotlight.run.id },
      {
        label: "Current owner",
        detail: spotlightOwner?.name ?? "Unknown worker",
      },
      {
        label: "Active stage",
        detail: activeStep.title,
      },
      {
        label: "Spotlight mode",
        detail: formatMode(overview.spotlight.run.mode),
      },
    ],
    runQueue: overview.activeScenarios.map((scenario) => {
      const completedSteps = scenario.steps.filter((step) => step.status === "completed").length;
      const owner = getWorkerById(scenario.run.ownerWorkerId);

      return {
        id: scenario.run.id,
        workflow: scenario.run.workflow,
        accountName: scenario.run.accountName,
        currentStage: scenario.run.currentStage,
        nextAction: scenario.run.nextAction,
        statusLabel: formatRunStatus(scenario.run.status),
        riskLabel: `${formatRiskLabel(scenario.run.riskLevel)} risk`,
        modeLabel: formatMode(scenario.run.mode),
        ownerName: owner?.name ?? "Unknown worker",
        ownerRole: owner?.role ?? "Unassigned role",
        etaLabel: etaLabel(scenario.run.etaMinutes),
        completedSteps,
        totalSteps: scenario.steps.length,
      };
    }),
    spotlight: {
      id: overview.spotlight.run.id,
      workflow: overview.spotlight.run.workflow,
      accountName: overview.spotlight.run.accountName,
      statusLabel: formatRunStatus(overview.spotlight.run.status),
      riskLabel: `${formatRiskLabel(overview.spotlight.run.riskLevel)} risk`,
      modeLabel: formatMode(overview.spotlight.run.mode),
      currentStage: overview.spotlight.run.currentStage,
      nextAction: overview.spotlight.run.nextAction,
      ownerName: spotlightOwner?.name ?? "Unknown worker",
      ownerRole: spotlightOwner?.role ?? "Unassigned role",
      ownerPosture: spotlightOwner?.posture ?? "Unknown posture",
      completionLabel: `${completedSpotlightSteps}/${overview.spotlight.steps.length} stages complete`,
      activeStepTitle: activeStep.title,
      handoffs: spotlightSteps
        .filter((step) => Boolean(step.handoffFrom))
        .map((step) => ({
          fromWorkerName: step.handoffFrom ?? "Previous worker",
          toWorkerName: step.workerName,
          stepTitle: step.title,
        })),
      shadowStepCount: shadowSpotlightStepCount,
      executeReadyStepCount: executeReadySpotlightStepCount,
      watchpoints: overview.spotlight.watchpoints,
    },
    stepGroups: groupedSteps,
    timeline: [...eventTimeline, ...handoffTimeline],
    executionMode: {
      runModeLabel: formatMode(overview.spotlight.run.mode),
      shadowRunCount,
      executeReadyRunCount: overview.executeReadyCount,
      shadowStepCount: shadowSpotlightStepCount,
      executeReadyStepCount: executeReadySpotlightStepCount,
      nextExecuteWorker: nextExecuteStep?.workerName ?? spotlightOwner?.name ?? "No pending worker",
    },
    footerNote:
      "Run progression stays deterministic and inspectable so later policy, approval, and replay waves can layer in without replacing the orchestration story.",
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

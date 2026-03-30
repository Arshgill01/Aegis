import type {
  ActionDecisionPayload,
  AuditActor,
  AuditEvent,
  AuditEventKind,
  ControlReference,
  ExecutionReceipt,
  ReplayFrame,
  ScenarioArtifactDirective,
  ScenarioHandoffDirective,
  ScenarioModeDirective,
  ScenarioRunStatusDirective,
  ScenarioStepStatusDirective,
  SimulationDirective,
  TaskStep,
  WorkerId,
  WorkflowRun,
  WorkflowScenario,
} from "../contracts";
import { seededScenarios, seededWorkerRegistry } from "../demo-fixtures";
import { buildScenarioDecisionOutputs } from "./decisioning";
import {
  assignWorkerToStep,
  attachArtifacts,
  setExecutionMode,
  transitionRunStatus,
  transitionStepStatus,
} from "./transitions";
import { createRunOrchestration } from "./orchestration";

type SimulationState = {
  scenario: WorkflowScenario;
  run: WorkflowRun;
  events: AuditEvent[];
  nextSequence: number;
};

export type SimulatedWorkflowRun = {
  scenario: WorkflowScenario;
  run: WorkflowRun;
  events: AuditEvent[];
  replayFrames: ReplayFrame[];
  receipt: ExecutionReceipt;
  stepDecisions: ActionDecisionPayload[];
  finalDecision: ActionDecisionPayload;
};

function uniq(values: string[]) {
  return [...new Set(values)];
}

function addMinutes(timestamp: string, minutes: number) {
  return new Date(Date.parse(timestamp) + minutes * 60_000).toISOString();
}

function findWorkerActor(scenario: WorkflowScenario, workerId?: WorkerId): AuditActor {
  if (!workerId) {
    return {
      type: "system",
      label: "Simulation Backbone",
    };
  }

  const worker = scenario.workers.find((currentWorker) => currentWorker.id === workerId) ?? seededWorkerRegistry[workerId];

  if (!worker) {
    return {
      type: "system",
      label: "Simulation Backbone",
    };
  }

  return {
    type: "worker",
    workerId: worker.id,
    label: worker.name,
  };
}

function createToolInvocations(step: WorkflowScenario["stepTemplates"][number]["toolInvocations"]) {
  return step.map((toolInvocation) => ({
    ...toolInvocation,
    status: "queued" as const,
  }));
}

function createRunSteps(scenario: WorkflowScenario): TaskStep[] {
  return [...scenario.stepTemplates]
    .sort((left, right) => left.sequence - right.sequence)
    .map((stepTemplate) => ({
      id: stepTemplate.id,
      key: stepTemplate.key,
      title: stepTemplate.title,
      description: stepTemplate.description,
      sequence: stepTemplate.sequence,
      status: "queued" as const,
      executionMode: stepTemplate.executionMode,
      assignedWorkerId: stepTemplate.assignedWorkerId,
      dependsOnStepIds: [...stepTemplate.dependsOnStepIds],
      artifactIds: [...stepTemplate.artifactIds],
      toolInvocations: createToolInvocations(stepTemplate.toolInvocations),
      controlRefs: [...stepTemplate.controlRefs],
      permissionEvaluations: [],
      updatedAt: scenario.seedTime,
    }));
}

export function createWorkflowRunFromScenario(scenario: WorkflowScenario): WorkflowRun {
  const steps = createRunSteps(scenario);
  const orchestration = createRunOrchestration(steps, scenario.seedTime);

  return {
    id: scenario.runId,
    scenarioId: scenario.id,
    workflowKey: scenario.workflowKey,
    workflowLabel: scenario.workflowLabel,
    companyName: scenario.companyName,
    status: "queued",
    executionMode: scenario.executionMode,
    riskLevel: scenario.riskAssessment.severity,
    currentStepId: steps[0]?.id,
    currentWorkerId: steps[0]?.assignedWorkerId,
    currentStageId: orchestration.currentStageId,
    artifactIds: steps[0] ? [...steps[0].artifactIds] : [],
    controlRefs: [],
    eventIds: [],
    steps,
    permissionEvaluations: [],
    orchestration,
    createdAt: scenario.seedTime,
    updatedAt: scenario.seedTime,
  };
}

function findStageByStepId(run: WorkflowRun, stepId?: string) {
  if (!stepId) {
    return undefined;
  }

  return run.orchestration.stages.find((stage) => stage.stepId === stepId);
}

function appendEvent(
  state: SimulationState,
  event: Omit<AuditEvent, "id" | "sequence" | "runId">,
): SimulationState {
  const nextEvent: AuditEvent = {
    id: `${state.run.id}-EVT-${String(state.nextSequence).padStart(3, "0")}`,
    sequence: state.nextSequence,
    runId: state.run.id,
    ...event,
  };

  return {
    ...state,
    run: {
      ...state.run,
      eventIds: [...state.run.eventIds, nextEvent.id],
    },
    events: [...state.events, nextEvent],
    nextSequence: state.nextSequence + 1,
  };
}

function initializeSimulationState(scenario: WorkflowScenario): SimulationState {
  const initialRun = createWorkflowRunFromScenario(scenario);

  return appendEvent(
    {
      scenario,
      run: initialRun,
      events: [],
      nextSequence: 1,
    },
    {
      kind: "run.created",
      title: `Run ${initialRun.id} created from seeded scenario`,
      detail: scenario.narrative,
      actor: {
        type: "system",
        label: "Simulation Backbone",
      },
      executionMode: initialRun.executionMode,
      occurredAt: scenario.seedTime,
      runStatus: initialRun.status,
      artifactIds: [...initialRun.artifactIds],
      controlRefs: [],
      metadata: {
        scenarioId: scenario.id,
        workflowKey: scenario.workflowKey,
        currentStageId: initialRun.currentStageId ?? "none",
        currentWorkerId: initialRun.currentWorkerId ?? "none",
      },
    },
  );
}

function createReplayFrames(events: AuditEvent[]): ReplayFrame[] {
  return events.map((event) => ({
    id: `${event.id}-FRAME`,
    eventId: event.id,
    runId: event.runId,
    stepId: event.stepId,
    sequence: event.sequence,
    occurredAt: event.occurredAt,
    title: event.title,
    summary: event.detail,
    actorLabel: event.actor.label,
    executionMode: event.executionMode,
    artifactIds: [...event.artifactIds],
  }));
}

function createExecutionReceipt(run: WorkflowRun, scenario: WorkflowScenario, events: AuditEvent[]): ExecutionReceipt {
  const stepStatusCounts = run.steps.reduce(
    (counts, step) => {
      if (step.status === "completed") {
        counts.completed += 1;
      } else if (step.status === "waiting") {
        counts.waiting += 1;
      } else if (step.status === "blocked") {
        counts.blocked += 1;
      } else if (step.status === "failed") {
        counts.failed += 1;
      }

      return counts;
    },
    { completed: 0, waiting: 0, blocked: 0, failed: 0 },
  );

  return {
    id: `${run.id}-RECEIPT`,
    runId: run.id,
    scenarioId: scenario.id,
    outcome: run.status,
    generatedAt: run.completedAt ?? run.updatedAt,
    executionMode: run.executionMode,
    eventCount: events.length,
    completedStepCount: stepStatusCounts.completed,
    waitingStepCount: stepStatusCounts.waiting,
    blockedStepCount: stepStatusCounts.blocked,
    failedStepCount: stepStatusCounts.failed,
    finalWorkerId: run.currentWorkerId,
    finalStepId: run.currentStepId,
  };
}

function applyRunStatusDirective(state: SimulationState, directive: ScenarioRunStatusDirective): SimulationState {
  const occurredAt = addMinutes(state.scenario.seedTime, directive.atMinute);
  const transition = transitionRunStatus(state.run, {
    toStatus: directive.toStatus,
    occurredAt,
    currentWorkerId: directive.workerId,
    controlRefs: directive.controlRefs,
  });

  return appendEvent(
    {
      ...state,
      run: transition.run,
    },
    {
      kind: "run.status_changed",
      title: directive.title,
      detail: directive.detail,
      actor: findWorkerActor(state.scenario, directive.workerId ?? transition.run.currentWorkerId),
      executionMode: transition.run.executionMode,
      occurredAt,
      stateChange: {
        entity: "run",
        from: transition.previousStatus,
        to: directive.toStatus,
      },
      runStatus: directive.toStatus,
      artifactIds: [],
      controlRefs: directive.controlRefs ?? [],
      metadata: {
        currentStepId: transition.run.currentStepId ?? "none",
        currentStageId: transition.run.currentStageId ?? "none",
        currentWorkerId: transition.run.currentWorkerId ?? "none",
        ...directive.metadata,
      },
    },
  );
}

function applyStepStatusDirective(state: SimulationState, directive: ScenarioStepStatusDirective): SimulationState {
  const occurredAt = addMinutes(state.scenario.seedTime, directive.atMinute);
  const transition = transitionStepStatus(state.run, {
    stepId: directive.stepId,
    toStatus: directive.toStatus,
    occurredAt,
    workerId: directive.workerId,
    outcomeSummary: directive.outcomeSummary,
    blockedReason: directive.blockedReason,
    controlRefs: directive.controlRefs,
  });

  return appendEvent(
    {
      ...state,
      run: transition.run,
    },
    {
      kind: "step.status_changed",
      stepId: directive.stepId,
      title: transition.gated
        ? `${directive.title} (permission gated)`
        : directive.title,
      detail: transition.gated
        ? `${directive.detail} Gate reason: ${transition.permissionEvaluation.reason}`
        : directive.detail,
      actor: findWorkerActor(state.scenario, directive.workerId ?? transition.step.assignedWorkerId),
      executionMode: transition.step.executionMode,
      occurredAt,
      stateChange: {
        entity: "step",
        from: transition.previousStatus,
        to: transition.effectiveStatus,
      },
      stepStatus: transition.effectiveStatus,
      artifactIds: [...transition.step.artifactIds],
      controlRefs: directive.controlRefs ?? transition.step.controlRefs,
      metadata: {
        stageId: transition.stage.id,
        stageStatus: transition.stage.status,
        stageTransitionId: transition.stageTransition?.id ?? "unchanged",
        permissionEvaluationId: transition.permissionEvaluation.id,
        permissionOutcome: transition.permissionEvaluation.outcome,
        permissionGated: transition.gated,
        requestedStatus: transition.requestedStatus,
        effectiveStatus: transition.effectiveStatus,
        currentStageId: transition.run.currentStageId ?? "none",
        currentWorkerId: transition.run.currentWorkerId ?? "none",
        ...directive.metadata,
      },
    },
  );
}

function applyHandoffDirective(state: SimulationState, directive: ScenarioHandoffDirective): SimulationState {
  const occurredAt = addMinutes(state.scenario.seedTime, directive.atMinute);
  const transition = assignWorkerToStep(state.run, {
    stepId: directive.stepId,
    workerId: directive.nextWorkerId,
    occurredAt,
  });

  return appendEvent(
    {
      ...state,
      run: transition.run,
    },
    {
      kind: "step.handoff",
      stepId: directive.stepId,
      title: transition.gated
        ? `${directive.title} (permission gated)`
        : directive.title,
      detail: transition.gated
        ? `${directive.detail} Gate reason: ${transition.permissionEvaluation.reason}`
        : directive.detail,
      actor: findWorkerActor(
        state.scenario,
        directive.workerId ?? transition.previousWorkerId ?? directive.nextWorkerId,
      ),
      executionMode: transition.step.executionMode,
      occurredAt,
      artifactIds: [...transition.step.artifactIds],
      controlRefs: directive.controlRefs ?? transition.step.controlRefs,
      metadata: {
        handoffId: transition.handoff?.id ?? "gated",
        handoffSequence: transition.handoff?.sequence ?? -1,
        stageId: transition.handoff?.stageId ?? transition.stage.id,
        previousWorkerId: transition.previousWorkerId ?? "none",
        nextWorkerId: directive.nextWorkerId,
        permissionEvaluationId: transition.permissionEvaluation.id,
        permissionOutcome: transition.permissionEvaluation.outcome,
        permissionGated: transition.gated,
        currentStageId: transition.run.currentStageId ?? "none",
        ...directive.metadata,
      },
    },
  );
}

function resolveArtifactWorkerId(run: WorkflowRun, directive: ScenarioArtifactDirective): WorkerId | undefined {
  if (!directive.stepId) {
    return run.currentWorkerId;
  }

  return run.steps.find((step) => step.id === directive.stepId)?.assignedWorkerId;
}

function applyArtifactDirective(state: SimulationState, directive: ScenarioArtifactDirective): SimulationState {
  const occurredAt = addMinutes(state.scenario.seedTime, directive.atMinute);
  const transition = attachArtifacts(state.run, {
    stepId: directive.stepId,
    artifactIds: directive.artifactIds,
    occurredAt,
  });

  return appendEvent(
    {
      ...state,
      run: transition.run,
    },
    {
      kind: "artifact.attached",
      stepId: directive.stepId,
      title: directive.title,
      detail: directive.detail,
      actor: findWorkerActor(state.scenario, directive.workerId ?? resolveArtifactWorkerId(transition.run, directive)),
      executionMode:
        directive.stepId !== undefined
          ? transition.run.steps.find((step) => step.id === directive.stepId)?.executionMode ?? transition.run.executionMode
          : transition.run.executionMode,
      occurredAt,
      artifactIds: directive.artifactIds,
      controlRefs: directive.controlRefs ?? [],
      metadata: {
        stageId:
          directive.stepId !== undefined
            ? findStageByStepId(transition.run, directive.stepId)?.id ?? "unknown"
            : transition.run.currentStageId ?? "none",
        currentWorkerId: transition.run.currentWorkerId ?? "none",
        ...directive.metadata,
      },
    },
  );
}

function applyModeDirective(state: SimulationState, directive: ScenarioModeDirective): SimulationState {
  const occurredAt = addMinutes(state.scenario.seedTime, directive.atMinute);
  const transition = setExecutionMode(state.run, {
    executionMode: directive.mode,
    occurredAt,
    stepId: directive.stepId,
  });

  return appendEvent(
    {
      ...state,
      run: transition.run,
    },
    {
      kind: "mode.changed",
      stepId: directive.stepId,
      title: transition.gated
        ? `${directive.title} (permission gated)`
        : directive.title,
      detail: transition.gated
        ? `${directive.detail} Gate reason: ${transition.permissionEvaluation.reason}`
        : directive.detail,
      actor: findWorkerActor(state.scenario, directive.workerId ?? transition.run.currentWorkerId),
      executionMode: transition.run.executionMode,
      occurredAt,
      stateChange: {
        entity: "mode",
        from: transition.previousExecutionMode,
        to: transition.run.executionMode,
      },
      artifactIds:
        directive.stepId !== undefined
          ? transition.run.steps.find((step) => step.id === directive.stepId)?.artifactIds ?? []
          : [],
      controlRefs: directive.controlRefs ?? transition.run.controlRefs,
      metadata: {
        modeTransitionId: transition.modeTransition?.id ?? "unchanged",
        permissionEvaluationId: transition.permissionEvaluation.id,
        permissionOutcome: transition.permissionEvaluation.outcome,
        permissionGated: transition.gated,
        stageId:
          directive.stepId !== undefined
            ? findStageByStepId(transition.run, directive.stepId)?.id ?? "unknown"
            : transition.run.currentStageId ?? "none",
        currentWorkerId: transition.run.currentWorkerId ?? "none",
        ...directive.metadata,
      },
    },
  );
}

function applyDirective(state: SimulationState, directive: SimulationDirective): SimulationState {
  switch (directive.kind) {
    case "run_status":
      return applyRunStatusDirective(state, directive);
    case "step_status":
      return applyStepStatusDirective(state, directive);
    case "handoff":
      return applyHandoffDirective(state, directive);
    case "artifact":
      return applyArtifactDirective(state, directive);
    case "mode":
      return applyModeDirective(state, directive);
    default: {
      const exhaustiveCheck: never = directive;
      return exhaustiveCheck;
    }
  }
}

function sortDirectives(directives: SimulationDirective[]) {
  return directives
    .map((directive, index) => ({ directive, index }))
    .sort((left, right) => {
      if (left.directive.atMinute === right.directive.atMinute) {
        return left.index - right.index;
      }

      return left.directive.atMinute - right.directive.atMinute;
    })
    .map((entry) => entry.directive);
}

export function simulateWorkflowRun(scenario: WorkflowScenario): SimulatedWorkflowRun {
  const initialState = initializeSimulationState(scenario);
  const finalState = sortDirectives(scenario.directives).reduce(applyDirective, initialState);

  const run = {
    ...finalState.run,
    artifactIds: uniq(finalState.run.artifactIds),
  };
  const replayFrames = createReplayFrames(finalState.events);
  const receipt = createExecutionReceipt(run, scenario, finalState.events);
  const decisionOutputs = buildScenarioDecisionOutputs(scenario);

  return {
    scenario,
    run,
    events: finalState.events,
    replayFrames,
    receipt,
    stepDecisions: decisionOutputs.stepDecisions,
    finalDecision: decisionOutputs.finalDecision,
  };
}

export function simulateSeededRuns(scenarios: WorkflowScenario[] = seededScenarios) {
  return scenarios.map((scenario) => simulateWorkflowRun(scenario));
}

export const seededSimulatedRuns = simulateSeededRuns();

import type {
  ExecutionMode,
  ExecutionModeTransition,
  StepStatus,
  TaskStep,
  StageStatusTransition,
  WorkerHandoff,
  WorkflowRunOrchestration,
  WorkflowStage,
} from "../contracts";

const terminalStepStatuses: readonly StepStatus[] = [
  "completed",
  "failed",
  "cancelled",
  "skipped",
];

function isTerminalStepStatus(status: StepStatus) {
  return terminalStepStatuses.includes(status);
}

function sortedSteps(steps: TaskStep[]) {
  return [...steps].sort((left, right) => left.sequence - right.sequence);
}

function stageTransitionId(stageId: string, sequence: number) {
  return `${stageId}-STATUS-${String(sequence).padStart(3, "0")}`;
}

function handoffId(stageId: string, sequence: number) {
  return `${stageId}-HANDOFF-${String(sequence).padStart(3, "0")}`;
}

function modeTransitionId(sequence: number) {
  return `RUN-MODE-${String(sequence).padStart(3, "0")}`;
}

function cloneStages(stages: WorkflowStage[]) {
  return stages.map((stage) => ({
    ...stage,
    dependsOnStageIds: [...stage.dependsOnStageIds],
  }));
}

function findStageIndexByStepId(stages: WorkflowStage[], stepId: string) {
  return stages.findIndex((stage) => stage.stepId === stepId);
}

export function stageIdForStep(stepId: string) {
  return `${stepId}-STAGE`;
}

export function createRunOrchestration(
  steps: TaskStep[],
  createdAt: string,
): WorkflowRunOrchestration {
  const orderedSteps = sortedSteps(steps);
  const stages = orderedSteps.map((step) => ({
    id: stageIdForStep(step.id),
    stepId: step.id,
    key: step.key,
    title: step.title,
    sequence: step.sequence,
    status: step.status,
    ownerWorkerId: step.assignedWorkerId,
    executionMode: step.executionMode,
    dependsOnStageIds: step.dependsOnStepIds.map(stageIdForStep),
    updatedAt: createdAt,
  }));

  const stageHistory = stages.map((stage, index) => ({
    id: stageTransitionId(stage.id, index + 1),
    sequence: index + 1,
    stageId: stage.id,
    stepId: stage.stepId,
    fromStatus: undefined,
    toStatus: stage.status,
    workerId: stage.ownerWorkerId,
    executionMode: stage.executionMode,
    occurredAt: createdAt,
  }));

  return {
    stages,
    currentStageId: stages[0]?.id,
    stageHistory,
    handoffs: [],
    modeHistory: [],
  };
}

export function resolveCurrentStageId(
  orchestration: WorkflowRunOrchestration,
  currentStepId: string | undefined,
) {
  if (!currentStepId) {
    return orchestration.currentStageId;
  }

  return orchestration.stages.find((stage) => stage.stepId === currentStepId)?.id
    ?? orchestration.currentStageId;
}

export function transitionStageForStep(
  orchestration: WorkflowRunOrchestration,
  input: {
    stepId: string;
    toStatus: StepStatus;
    workerId: string;
    executionMode: ExecutionMode;
    occurredAt: string;
  },
) {
  const stageIndex = findStageIndexByStepId(orchestration.stages, input.stepId);

  if (stageIndex < 0) {
    throw new Error(`Unknown stage for step: ${input.stepId}`);
  }

  const stages = cloneStages(orchestration.stages);
  const previousStage = stages[stageIndex];
  const updatedStage: WorkflowStage = {
    ...previousStage,
    status: input.toStatus,
    ownerWorkerId: input.workerId,
    executionMode: input.executionMode,
    startedAt:
      previousStage.startedAt
      ?? (input.toStatus === "in_progress" ? input.occurredAt : previousStage.startedAt),
    completedAt:
      isTerminalStepStatus(input.toStatus) ? input.occurredAt : previousStage.completedAt,
    updatedAt: input.occurredAt,
  };

  stages[stageIndex] = updatedStage;

  const statusChanged = previousStage.status !== input.toStatus;
  const transition: StageStatusTransition | undefined = statusChanged
    ? {
        id: stageTransitionId(updatedStage.id, orchestration.stageHistory.length + 1),
        sequence: orchestration.stageHistory.length + 1,
        stageId: updatedStage.id,
        stepId: input.stepId,
        fromStatus: previousStage.status,
        toStatus: input.toStatus,
        workerId: input.workerId,
        executionMode: input.executionMode,
        occurredAt: input.occurredAt,
      }
    : undefined;

  return {
    orchestration: {
      ...orchestration,
      stages,
      currentStageId: updatedStage.id,
      stageHistory: transition
        ? [...orchestration.stageHistory, transition]
        : orchestration.stageHistory,
    },
    stage: updatedStage,
    transition,
  };
}

export function handoffStageOwner(
  orchestration: WorkflowRunOrchestration,
  input: {
    stepId: string;
    nextWorkerId: string;
    executionMode: ExecutionMode;
    occurredAt: string;
  },
) {
  const stageIndex = findStageIndexByStepId(orchestration.stages, input.stepId);

  if (stageIndex < 0) {
    throw new Error(`Unknown stage for step: ${input.stepId}`);
  }

  const stages = cloneStages(orchestration.stages);
  const previousStage = stages[stageIndex];
  const updatedStage: WorkflowStage = {
    ...previousStage,
    ownerWorkerId: input.nextWorkerId,
    executionMode: input.executionMode,
    updatedAt: input.occurredAt,
  };

  stages[stageIndex] = updatedStage;

  const nextSequence = orchestration.handoffs.length + 1;
  const handoff: WorkerHandoff = {
    id: handoffId(updatedStage.id, nextSequence),
    sequence: nextSequence,
    stageId: updatedStage.id,
    stepId: input.stepId,
    fromWorkerId: previousStage.ownerWorkerId,
    toWorkerId: input.nextWorkerId,
    executionMode: input.executionMode,
    occurredAt: input.occurredAt,
  };

  return {
    orchestration: {
      ...orchestration,
      stages,
      currentStageId: updatedStage.id,
      handoffs: [...orchestration.handoffs, handoff],
    },
    stage: updatedStage,
    handoff,
    previousWorkerId: previousStage.ownerWorkerId,
  };
}

export function applyExecutionModeToOrchestration(
  orchestration: WorkflowRunOrchestration,
  input: {
    fromMode: ExecutionMode;
    toMode: ExecutionMode;
    occurredAt: string;
    stepId?: string;
    workerId?: string;
  },
) {
  const stages = cloneStages(orchestration.stages);
  const targetStageIndex =
    input.stepId !== undefined
      ? findStageIndexByStepId(stages, input.stepId)
      : stages.findIndex((stage) => stage.id === orchestration.currentStageId);

  let stageId: string | undefined;

  if (targetStageIndex >= 0) {
    const targetStage = stages[targetStageIndex];
    stageId = targetStage.id;
    stages[targetStageIndex] = {
      ...targetStage,
      executionMode: input.toMode,
      updatedAt: input.occurredAt,
    };
  }

  let modeTransition: ExecutionModeTransition | undefined;

  if (input.fromMode !== input.toMode) {
    const sequence = orchestration.modeHistory.length + 1;
    modeTransition = {
      id: modeTransitionId(sequence),
      sequence,
      fromMode: input.fromMode,
      toMode: input.toMode,
      occurredAt: input.occurredAt,
      stageId,
      stepId: input.stepId,
      workerId: input.workerId,
    };
  }

  return {
    orchestration: {
      ...orchestration,
      stages,
      currentStageId: stageId ?? orchestration.currentStageId,
      modeHistory: modeTransition
        ? [...orchestration.modeHistory, modeTransition]
        : orchestration.modeHistory,
    },
    modeTransition,
    stageId,
  };
}

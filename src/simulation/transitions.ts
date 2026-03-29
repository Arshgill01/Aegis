import type {
  ControlReference,
  ExecutionMode,
  RunStatus,
  StepStatus,
  TaskStep,
  ToolInvocation,
  WorkerId,
  WorkflowRun,
} from "../contracts";
import {
  applyExecutionModeToOrchestration,
  handoffStageOwner,
  resolveCurrentStageId,
  transitionStageForStep,
} from "./orchestration";

export const allowedRunTransitions: Record<RunStatus, readonly RunStatus[]> = {
  queued: ["planning", "cancelled"],
  planning: ["in_progress", "blocked", "failed", "cancelled"],
  in_progress: ["waiting", "blocked", "completed", "failed", "cancelled"],
  waiting: ["in_progress", "blocked", "completed", "failed", "cancelled"],
  blocked: ["waiting", "in_progress", "failed", "cancelled"],
  completed: [],
  failed: [],
  cancelled: [],
};

export const allowedStepTransitions: Record<StepStatus, readonly StepStatus[]> = {
  queued: ["ready", "cancelled", "skipped"],
  ready: ["in_progress", "waiting", "blocked", "cancelled", "skipped"],
  in_progress: ["waiting", "blocked", "completed", "failed", "cancelled"],
  waiting: ["ready", "in_progress", "blocked", "completed", "failed", "cancelled"],
  blocked: ["ready", "waiting", "failed", "cancelled"],
  completed: [],
  failed: [],
  skipped: [],
  cancelled: [],
};

type RunTransitionInput = {
  toStatus: RunStatus;
  occurredAt: string;
  currentWorkerId?: WorkerId;
  currentStepId?: string;
  controlRefs?: ControlReference[];
};

type StepTransitionInput = {
  stepId: string;
  toStatus: StepStatus;
  occurredAt: string;
  workerId?: WorkerId;
  outcomeSummary?: string;
  blockedReason?: string;
  controlRefs?: ControlReference[];
};

type AssignWorkerInput = {
  stepId: string;
  workerId: WorkerId;
  occurredAt: string;
};

type AttachArtifactsInput = {
  artifactIds: string[];
  occurredAt: string;
  stepId?: string;
};

type ModeChangeInput = {
  executionMode: ExecutionMode;
  occurredAt: string;
  stepId?: string;
};

type StepUpdateResult = {
  run: WorkflowRun;
  step: TaskStep;
};

function assertRunTransitionAllowed(from: RunStatus, to: RunStatus) {
  if (from === to) {
    return;
  }

  if (!allowedRunTransitions[from].includes(to)) {
    throw new Error(`Invalid run status transition: ${from} -> ${to}`);
  }
}

function assertStepTransitionAllowed(from: StepStatus, to: StepStatus) {
  if (from === to) {
    return;
  }

  if (!allowedStepTransitions[from].includes(to)) {
    throw new Error(`Invalid step status transition: ${from} -> ${to}`);
  }
}

function uniq(values: string[]) {
  return [...new Set(values)];
}

function mergeControlRefs(
  current: ControlReference[],
  next: ControlReference[] | undefined,
) {
  if (!next || next.length === 0) {
    return current;
  }

  const merged = new Map(current.map((ref) => [ref.id, ref]));

  next.forEach((ref) => {
    merged.set(ref.id, ref);
  });

  return [...merged.values()];
}

function syncToolInvocationsForStatus(
  toolInvocations: ToolInvocation[],
  toStatus: StepStatus,
  occurredAt: string,
) {
  return toolInvocations.map((toolInvocation) => {
    if (toStatus === "in_progress") {
      return {
        ...toolInvocation,
        status: "in_progress" as const,
        requestedAt: toolInvocation.requestedAt ?? occurredAt,
      };
    }

    if (toStatus === "completed") {
      return {
        ...toolInvocation,
        status: "completed" as const,
        requestedAt: toolInvocation.requestedAt ?? occurredAt,
        completedAt: occurredAt,
        outcomeSummary: toolInvocation.outcomeSummary ?? "Simulation completed successfully.",
      };
    }

    if (toStatus === "failed") {
      return {
        ...toolInvocation,
        status: "failed" as const,
        requestedAt: toolInvocation.requestedAt ?? occurredAt,
        completedAt: occurredAt,
        outcomeSummary: toolInvocation.outcomeSummary ?? "Simulation failed before completion.",
      };
    }

    if (toStatus === "cancelled" || toStatus === "skipped") {
      return {
        ...toolInvocation,
        status: "cancelled" as const,
        completedAt: occurredAt,
      };
    }

    return toolInvocation;
  });
}

function updateStep(
  run: WorkflowRun,
  stepId: string,
  update: (step: TaskStep) => TaskStep,
): StepUpdateResult {
  let updatedStep: TaskStep | undefined;

  const steps = run.steps.map((step) => {
    if (step.id !== stepId) {
      return step;
    }

    updatedStep = update(step);
    return updatedStep;
  });

  if (!updatedStep) {
    throw new Error(`Unknown step: ${stepId}`);
  }

  return {
    run: {
      ...run,
      steps,
    },
    step: updatedStep,
  };
}

export function transitionRunStatus(
  run: WorkflowRun,
  { toStatus, occurredAt, currentWorkerId, currentStepId, controlRefs }: RunTransitionInput,
) {
  assertRunTransitionAllowed(run.status, toStatus);

  const nextCurrentStepId = currentStepId ?? run.currentStepId;
  const nextCurrentStageId = resolveCurrentStageId(run.orchestration, nextCurrentStepId);
  const nextCurrentWorkerId = currentWorkerId ?? run.currentWorkerId;
  const nextOrchestration = nextCurrentStageId
    ? {
        ...run.orchestration,
        stages: run.orchestration.stages.map((stage) =>
          stage.id === nextCurrentStageId && nextCurrentWorkerId
            ? {
                ...stage,
                ownerWorkerId: nextCurrentWorkerId,
                updatedAt: occurredAt,
              }
            : stage,
        ),
        currentStageId: nextCurrentStageId,
      }
    : run.orchestration;

  return {
    run: {
      ...run,
      status: toStatus,
      currentWorkerId: nextCurrentWorkerId,
      currentStepId: nextCurrentStepId,
      currentStageId: nextCurrentStageId,
      startedAt: run.startedAt ?? (toStatus === "in_progress" ? occurredAt : undefined),
      updatedAt: occurredAt,
      completedAt:
        toStatus === "completed" || toStatus === "failed" || toStatus === "cancelled"
          ? occurredAt
          : run.completedAt,
      controlRefs: mergeControlRefs(run.controlRefs, controlRefs),
      orchestration: nextOrchestration,
    },
    previousStatus: run.status,
  };
}

export function transitionStepStatus(
  run: WorkflowRun,
  { stepId, toStatus, occurredAt, workerId, outcomeSummary, blockedReason, controlRefs }: StepTransitionInput,
) {
  const previousStep = run.steps.find((step) => step.id === stepId);

  if (!previousStep) {
    throw new Error(`Unknown step: ${stepId}`);
  }

  const { run: updatedRun, step } = updateStep(run, stepId, (currentStep) => {
    assertStepTransitionAllowed(currentStep.status, toStatus);

    return {
      ...currentStep,
      status: toStatus,
      assignedWorkerId: workerId ?? currentStep.assignedWorkerId,
      startedAt:
        currentStep.startedAt ?? (toStatus === "in_progress" ? occurredAt : currentStep.startedAt),
      completedAt:
        toStatus === "completed" || toStatus === "failed" || toStatus === "cancelled"
          ? occurredAt
          : currentStep.completedAt,
      updatedAt: occurredAt,
      outcomeSummary: outcomeSummary ?? currentStep.outcomeSummary,
      blockedReason: blockedReason ?? currentStep.blockedReason,
      controlRefs: mergeControlRefs(currentStep.controlRefs, controlRefs),
      toolInvocations: syncToolInvocationsForStatus(currentStep.toolInvocations, toStatus, occurredAt),
    };
  });

  const nextWorkerId = workerId ?? step.assignedWorkerId;
  const stageTransition = transitionStageForStep(updatedRun.orchestration, {
    stepId,
    toStatus,
    workerId: nextWorkerId,
    executionMode: step.executionMode,
    occurredAt,
  });

  return {
    run: {
      ...updatedRun,
      currentStepId: stepId,
      currentWorkerId: nextWorkerId,
      currentStageId: stageTransition.orchestration.currentStageId,
      startedAt: updatedRun.startedAt ?? (toStatus === "in_progress" ? occurredAt : updatedRun.startedAt),
      updatedAt: occurredAt,
      controlRefs: mergeControlRefs(updatedRun.controlRefs, controlRefs),
      orchestration: stageTransition.orchestration,
    },
    step,
    stage: stageTransition.stage,
    stageTransition: stageTransition.transition,
    previousStatus: previousStep.status,
  };
}

export function assignWorkerToStep(run: WorkflowRun, { stepId, workerId, occurredAt }: AssignWorkerInput) {
  const previousStep = run.steps.find((step) => step.id === stepId);

  if (!previousStep) {
    throw new Error(`Unknown step: ${stepId}`);
  }

  const { run: updatedRun, step } = updateStep(run, stepId, (currentStep) => ({
    ...currentStep,
    assignedWorkerId: workerId,
    updatedAt: occurredAt,
  }));

  const handoffTransition = handoffStageOwner(updatedRun.orchestration, {
    stepId,
    nextWorkerId: workerId,
    executionMode: step.executionMode,
    occurredAt,
  });

  return {
    run: {
      ...updatedRun,
      currentStepId: stepId,
      currentWorkerId: workerId,
      currentStageId: handoffTransition.orchestration.currentStageId,
      updatedAt: occurredAt,
      orchestration: handoffTransition.orchestration,
    },
    step,
    stage: handoffTransition.stage,
    handoff: handoffTransition.handoff,
    previousWorkerId: handoffTransition.previousWorkerId ?? previousStep.assignedWorkerId,
  };
}

export function attachArtifacts(run: WorkflowRun, { artifactIds, occurredAt, stepId }: AttachArtifactsInput) {
  if (!stepId) {
    return {
      run: {
        ...run,
        artifactIds: uniq([...run.artifactIds, ...artifactIds]),
        updatedAt: occurredAt,
      },
      attachedArtifactIds: artifactIds,
    };
  }

  const { run: updatedRun } = updateStep(run, stepId, (step) => ({
    ...step,
    artifactIds: uniq([...step.artifactIds, ...artifactIds]),
    updatedAt: occurredAt,
  }));

  return {
    run: {
      ...updatedRun,
      artifactIds: uniq([...updatedRun.artifactIds, ...artifactIds]),
      currentStepId: stepId,
      currentStageId: resolveCurrentStageId(updatedRun.orchestration, stepId),
      updatedAt: occurredAt,
    },
    attachedArtifactIds: artifactIds,
  };
}

export function setExecutionMode(
  run: WorkflowRun,
  { executionMode, occurredAt, stepId }: ModeChangeInput,
) {
  const previousExecutionMode = run.executionMode;

  if (!stepId) {
    const modeUpdate = applyExecutionModeToOrchestration(run.orchestration, {
      fromMode: previousExecutionMode,
      toMode: executionMode,
      occurredAt,
      workerId: run.currentWorkerId,
    });

    return {
      run: {
        ...run,
        executionMode,
        currentStageId: modeUpdate.orchestration.currentStageId,
        updatedAt: occurredAt,
        orchestration: modeUpdate.orchestration,
      },
      previousExecutionMode,
      modeTransition: modeUpdate.modeTransition,
    };
  }

  const { run: updatedRun, step } = updateStep(run, stepId, (currentStep) => ({
    ...currentStep,
    executionMode,
    updatedAt: occurredAt,
    toolInvocations: currentStep.toolInvocations.map((toolInvocation) => ({
      ...toolInvocation,
      executionMode,
    })),
  }));

  const modeUpdate = applyExecutionModeToOrchestration(updatedRun.orchestration, {
    fromMode: previousExecutionMode,
    toMode: executionMode,
    occurredAt,
    stepId,
    workerId: step.assignedWorkerId,
  });

  return {
    run: {
      ...updatedRun,
      executionMode,
      currentStepId: stepId,
      currentWorkerId: step.assignedWorkerId,
      currentStageId: modeUpdate.orchestration.currentStageId,
      updatedAt: occurredAt,
      orchestration: modeUpdate.orchestration,
    },
    step,
    previousExecutionMode,
    modeTransition: modeUpdate.modeTransition,
  };
}

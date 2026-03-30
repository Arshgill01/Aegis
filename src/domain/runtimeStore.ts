import type {
  ApprovalRequest,
  ApprovalStatus,
  RunStatus,
  SeededAegisData,
  StepStatus,
  TaskStep,
  WorkflowRun,
  WorkflowScenario,
} from "./contracts";
import { seededAegisData } from "./fixtures";

export type RuntimeState = SeededAegisData & {
  selectedRunId?: string;
  selectedApprovalId?: string;
  selectedScenarioId?: string;
};

type RuntimeListener = () => void;

function cloneSeededData(): SeededAegisData {
  return structuredClone(seededAegisData);
}

function buildInitialRuntimeState(): RuntimeState {
  const clonedData = cloneSeededData();
  const firstScenario = clonedData.scenarios[0];
  const firstPendingApproval = clonedData.scenarios
    .flatMap((scenario) => scenario.approvals)
    .find((approval) => approval.status === "pending");

  return {
    ...clonedData,
    selectedRunId: firstScenario?.run.id,
    selectedApprovalId: firstPendingApproval?.id,
    selectedScenarioId: firstScenario?.id,
  };
}

let runtimeState = buildInitialRuntimeState();
const listeners = new Set<RuntimeListener>();

function emitRuntimeUpdate() {
  listeners.forEach((listener) => listener());
}

function setRuntimeState(nextState: RuntimeState) {
  runtimeState = nextState;
  emitRuntimeUpdate();
}

function updateRuntimeState(updater: (currentState: RuntimeState) => RuntimeState) {
  const nextState = updater(runtimeState);
  if (nextState !== runtimeState) {
    setRuntimeState(nextState);
  }
}

export function subscribeRuntimeState(listener: RuntimeListener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getRuntimeState(): RuntimeState {
  return runtimeState;
}

export function resetRuntimeState() {
  setRuntimeState(buildInitialRuntimeState());
}

export function setSelectedRunId(runId?: string) {
  if (runtimeState.selectedRunId === runId) {
    return;
  }

  setRuntimeState({
    ...runtimeState,
    selectedRunId: runId,
  });
}

export function setSelectedApprovalId(approvalId?: string) {
  if (runtimeState.selectedApprovalId === approvalId) {
    return;
  }

  setRuntimeState({
    ...runtimeState,
    selectedApprovalId: approvalId,
  });
}

export function setSelectedScenarioId(scenarioId?: string) {
  if (runtimeState.selectedScenarioId === scenarioId) {
    return;
  }

  setRuntimeState({
    ...runtimeState,
    selectedScenarioId: scenarioId,
  });
}

type RunPatch = Partial<WorkflowRun>;
type StepPatch = Partial<TaskStep>;
type ApprovalPatch = Partial<ApprovalRequest>;

export function patchRun(runId: string, patch: RunPatch): boolean {
  let didUpdate = false;

  updateRuntimeState((currentState) => {
    const scenarios = currentState.scenarios.map((scenario) => {
      if (scenario.run.id !== runId) {
        return scenario;
      }

      didUpdate = true;
      return {
        ...scenario,
        run: {
          ...scenario.run,
          ...patch,
        },
      };
    });

    if (!didUpdate) {
      return currentState;
    }

    return {
      ...currentState,
      scenarios,
    };
  });

  return didUpdate;
}

export function setRunStatus(runId: string, status: RunStatus): boolean {
  return patchRun(runId, { status });
}

export function patchStep(runId: string, stepId: string, patch: StepPatch): boolean {
  let didUpdate = false;

  updateRuntimeState((currentState) => {
    const scenarios = currentState.scenarios.map((scenario) => {
      if (scenario.run.id !== runId) {
        return scenario;
      }

      let didUpdateStep = false;
      const steps = scenario.steps.map((step) => {
        if (step.id !== stepId) {
          return step;
        }

        didUpdateStep = true;
        return {
          ...step,
          ...patch,
        };
      });

      if (!didUpdateStep) {
        return scenario;
      }

      didUpdate = true;
      return {
        ...scenario,
        steps,
      };
    });

    if (!didUpdate) {
      return currentState;
    }

    return {
      ...currentState,
      scenarios,
    };
  });

  return didUpdate;
}

export function setStepStatus(runId: string, stepId: string, status: StepStatus): boolean {
  return patchStep(runId, stepId, { status });
}

export function patchApproval(approvalId: string, patch: ApprovalPatch): boolean {
  let didUpdate = false;

  updateRuntimeState((currentState) => {
    const scenarios = currentState.scenarios.map((scenario) => {
      let didUpdateApproval = false;
      const approvals = scenario.approvals.map((approval) => {
        if (approval.id !== approvalId) {
          return approval;
        }

        didUpdateApproval = true;
        return {
          ...approval,
          ...patch,
        };
      });

      if (!didUpdateApproval) {
        return scenario;
      }

      didUpdate = true;
      return {
        ...scenario,
        approvals,
      };
    });

    if (!didUpdate) {
      return currentState;
    }

    return {
      ...currentState,
      scenarios,
    };
  });

  return didUpdate;
}

export function setApprovalStatus(approvalId: string, status: ApprovalStatus): boolean {
  return patchApproval(approvalId, { status });
}

export function addApprovalToRun(runId: string, approval: ApprovalRequest): boolean {
  let didUpdate = false;

  updateRuntimeState((currentState) => {
    const scenarios = currentState.scenarios.map((scenario) => {
      if (scenario.run.id !== runId) {
        return scenario;
      }

      const existingApprovalIndex = scenario.approvals.findIndex(
        (currentApproval) => currentApproval.id === approval.id,
      );

      didUpdate = true;

      if (existingApprovalIndex < 0) {
        return {
          ...scenario,
          approvals: [...scenario.approvals, approval],
        };
      }

      const nextApprovals = scenario.approvals.slice();
      nextApprovals[existingApprovalIndex] = approval;

      return {
        ...scenario,
        approvals: nextApprovals,
      };
    });

    if (!didUpdate) {
      return currentState;
    }

    return {
      ...currentState,
      scenarios,
      selectedApprovalId: approval.id,
    };
  });

  return didUpdate;
}

export function patchScenario(
  scenarioId: string,
  patch: Partial<WorkflowScenario>,
): boolean {
  let didUpdate = false;

  updateRuntimeState((currentState) => {
    const scenarios = currentState.scenarios.map((scenario) => {
      if (scenario.id !== scenarioId) {
        return scenario;
      }

      didUpdate = true;
      return {
        ...scenario,
        ...patch,
      };
    });

    if (!didUpdate) {
      return currentState;
    }

    return {
      ...currentState,
      scenarios,
    };
  });

  return didUpdate;
}

export const runtimeMutations = {
  resetRuntimeState,
  setSelectedRunId,
  setSelectedApprovalId,
  setSelectedScenarioId,
  patchRun,
  setRunStatus,
  patchStep,
  setStepStatus,
  patchApproval,
  setApprovalStatus,
  addApprovalToRun,
  patchScenario,
};

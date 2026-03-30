import { useEffect, useSyncExternalStore } from "react";

import {
  getRuntimeState,
  setSelectedApprovalId,
  setSelectedRunId,
  setSelectedScenarioId,
  subscribeRuntimeState,
} from "../../domain/runtimeStore";
import {
  buildApprovalDetailPageData,
  buildAgentsPageData,
  buildApprovalsPageContent,
  buildFinOpsWorkflowPageContent,
  buildMissionControlPageData,
  buildPoliciesPageData,
  buildRunDetailPageData,
  buildRunsPageData,
  buildShellOrchestrationSummary,
} from "./pageAdapters";

function useRuntimeSubscription() {
  useSyncExternalStore(subscribeRuntimeState, getRuntimeState, getRuntimeState);
}

export function useMissionControlPageData() {
  useRuntimeSubscription();
  return buildMissionControlPageData();
}

export function useShellOrchestrationSummary(pathname: string) {
  useRuntimeSubscription();
  return buildShellOrchestrationSummary(pathname);
}

export function useAgentsPageData() {
  useRuntimeSubscription();
  return buildAgentsPageData();
}

export function useRunsPageData(preferredRunId?: string) {
  useRuntimeSubscription();
  return buildRunsPageData(preferredRunId);
}

export function useRunDetailPageData(runId?: string) {
  useRuntimeSubscription();

  const detail = runId ? buildRunDetailPageData(runId) : undefined;

  useEffect(() => {
    if (runId) {
      setSelectedRunId(runId);
    }
  }, [runId]);

  useEffect(() => {
    if (detail?.scenario.id) {
      setSelectedScenarioId(detail.scenario.id);
    }
  }, [detail?.scenario.id]);

  return detail;
}

export function useApprovalsPageContent() {
  useRuntimeSubscription();
  return buildApprovalsPageContent();
}

export function useApprovalDetailPageData(approvalId?: string) {
  useRuntimeSubscription();

  useEffect(() => {
    if (approvalId) {
      setSelectedApprovalId(approvalId);
    }
  }, [approvalId]);

  if (!approvalId) {
    return undefined;
  }

  return buildApprovalDetailPageData(approvalId);
}

export function usePoliciesPageData() {
  useRuntimeSubscription();
  return buildPoliciesPageData();
}

export function useFinOpsWorkflowPageContent() {
  useRuntimeSubscription();
  return buildFinOpsWorkflowPageContent();
}

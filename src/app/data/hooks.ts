import { useSyncExternalStore } from "react";

import { getRuntimeState, subscribeRuntimeState } from "../../domain/runtimeStore";
import {
  buildAgentsPageData,
  buildApprovalsPageContent,
  buildFinOpsWorkflowPageContent,
  buildMissionControlPageData,
  buildPoliciesPageData,
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

export function useRunsPageData() {
  useRuntimeSubscription();
  return buildRunsPageData();
}

export function useApprovalsPageContent() {
  useRuntimeSubscription();
  return buildApprovalsPageContent();
}

export function usePoliciesPageData() {
  useRuntimeSubscription();
  return buildPoliciesPageData();
}

export function useFinOpsWorkflowPageContent() {
  useRuntimeSubscription();
  return buildFinOpsWorkflowPageContent();
}

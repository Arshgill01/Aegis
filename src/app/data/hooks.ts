import {
  buildAgentsPageData,
  buildApprovalsPageContent,
  buildFinOpsWorkflowPageContent,
  buildMissionControlPageData,
  buildPoliciesPageData,
  buildRunsPageData,
  buildShellOrchestrationSummary,
} from "./pageAdapters";

export function useMissionControlPageData() {
  return buildMissionControlPageData();
}

export function useShellOrchestrationSummary(pathname: string) {
  return buildShellOrchestrationSummary(pathname);
}

export function useAgentsPageData() {
  return buildAgentsPageData();
}

export function useRunsPageData() {
  return buildRunsPageData();
}

export function useApprovalsPageContent() {
  return buildApprovalsPageContent();
}

export function usePoliciesPageData() {
  return buildPoliciesPageData();
}

export function useFinOpsWorkflowPageContent() {
  return buildFinOpsWorkflowPageContent();
}

import {
  buildAgentsPageData,
  buildApprovalsPageContent,
  buildFinOpsWorkflowPageContent,
  buildMissionControlPageData,
  buildPoliciesPageContent,
  buildRunsPageContent,
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

export function useRunsPageContent() {
  return buildRunsPageContent();
}

export function useApprovalsPageContent() {
  return buildApprovalsPageContent();
}

export function usePoliciesPageContent() {
  return buildPoliciesPageContent();
}

export function useFinOpsWorkflowPageContent() {
  return buildFinOpsWorkflowPageContent();
}

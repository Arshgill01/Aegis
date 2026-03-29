import {
  buildAgentsPageContent,
  buildApprovalsPageContent,
  buildFinOpsWorkflowPageContent,
  buildMissionControlPageData,
  buildPoliciesPageContent,
  buildRunsPageData,
} from "./pageAdapters";

export function useMissionControlPageData() {
  return buildMissionControlPageData();
}

export function useAgentsPageContent() {
  return buildAgentsPageContent();
}

export function useRunsPageData() {
  return buildRunsPageData();
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

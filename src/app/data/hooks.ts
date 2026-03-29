import {
  buildAgentsPageContent,
  buildApprovalsPageContent,
  buildFinOpsWorkflowPageContent,
  buildMissionControlPageData,
  buildPoliciesPageContent,
  buildRunsPageContent,
} from "./pageAdapters";

export function useMissionControlPageData() {
  return buildMissionControlPageData();
}

export function useAgentsPageContent() {
  return buildAgentsPageContent();
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

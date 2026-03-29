import { useFinOpsWorkflowPageContent } from "../app/data/hooks";
import { buildPageContent } from "./pageContent";

export function FinOpsWorkflowPage() {
  return buildPageContent(useFinOpsWorkflowPageContent());
}

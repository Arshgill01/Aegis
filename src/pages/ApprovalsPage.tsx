import { useApprovalsPageContent } from "../app/data/hooks";
import { buildPageContent } from "./pageContent";

export function ApprovalsPage() {
  return buildPageContent(useApprovalsPageContent());
}

import { usePoliciesPageContent } from "../app/data/hooks";
import { buildPageContent } from "./pageContent";

export function PoliciesPage() {
  return buildPageContent(usePoliciesPageContent());
}

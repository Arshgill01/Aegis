import { useAgentsPageContent } from "../app/data/hooks";
import { buildPageContent } from "./pageContent";

export function AgentsPage() {
  return buildPageContent(useAgentsPageContent());
}

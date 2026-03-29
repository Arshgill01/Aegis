import { useRunsPageContent } from "../app/data/hooks";
import { buildPageContent } from "./pageContent";

export function RunsTasksPage() {
  return buildPageContent(useRunsPageContent());
}

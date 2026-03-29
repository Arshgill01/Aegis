import { useRunsPageData } from "../app/data/hooks";
import { PageShell } from "../components/shell/PageShell";
import {
  CurrentStageCard,
  ExecutionModeCard,
  OrchestrationTimelineCard,
  RunQueueCard,
  StepProgressionCard,
} from "./runs/RunOrchestrationSections";

export function RunsTasksPage() {
  const runsPage = useRunsPageData();

  return (
    <PageShell
      eyebrow={runsPage.eyebrow}
      title={runsPage.title}
      description={runsPage.description}
      summaryCards={runsPage.summaryCards}
      signals={runsPage.signals}
      primaryColumn={
        <>
          <RunQueueCard runs={runsPage.runQueue} />
          <StepProgressionCard groups={runsPage.stepGroups} />
          <OrchestrationTimelineCard timeline={runsPage.timeline} />
        </>
      }
      secondaryColumn={
        <>
          <CurrentStageCard run={runsPage.spotlight} />
          <ExecutionModeCard executionMode={runsPage.executionMode} />
        </>
      }
    />
  );
}

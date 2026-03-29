import { useAgentsPageData } from "../app/data/hooks";
import { PageShell } from "../components/shell/PageShell";
import {
  WorkerActivityCard,
  WorkerAssignmentsCard,
  WorkerHandoffsCard,
  WorkerLanesCard,
} from "./agents/AgentsSections";

export function AgentsPage() {
  const pageData = useAgentsPageData();

  return (
    <PageShell
      eyebrow={pageData.eyebrow}
      title={pageData.title}
      description={pageData.description}
      summaryCards={pageData.summaryCards}
      signals={pageData.signals}
      primaryColumn={
        <>
          <WorkerLanesCard workers={pageData.workerLanes} />
          <WorkerAssignmentsCard assignments={pageData.assignments} />
        </>
      }
      secondaryColumn={
        <>
          <WorkerHandoffsCard handoffs={pageData.handoffs} />
          <WorkerActivityCard events={pageData.recentActivity} />
        </>
      }
    />
  );
}

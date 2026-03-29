import { useMissionControlPageData } from "../app/data/hooks";
import { PageShell } from "../components/shell/PageShell";
import {
  ActiveRunsCard,
  ActivityCard,
  ApprovalsCard,
  RiskPostureCard,
  ScenarioSpotlightCard,
  WorkerActivityCard,
} from "./overview/MissionControlSections";

export function MissionControlPage() {
  const missionControlData = useMissionControlPageData();
  const {
    activeRuns,
    activity,
    approvals,
    decisionPosture,
    flaggedItems,
    postureSignals,
    spotlight,
    summaryCards,
    workers,
  } = missionControlData;

  return (
    <PageShell
      eyebrow="Operational Overview"
      title="Mission control for governed AI work"
      description="Supervise AI workers handling business workflows under visible risk, approval, and audit constraints from a single flagship surface."
      summaryCards={summaryCards}
      signals={postureSignals.map((signal) => ({
        label: signal.label,
        detail: signal.value,
        emphasis: signal.badge,
      }))}
      primaryColumn={
        <>
          <ActivityCard entries={activity} />
          <ActiveRunsCard runs={activeRuns} />
          <WorkerActivityCard workers={workers} />
        </>
      }
      secondaryColumn={
        <>
          <RiskPostureCard
            flaggedItems={flaggedItems}
            postureSignals={postureSignals}
            decisionPosture={decisionPosture}
          />
          <ApprovalsCard approvals={approvals} />
          <ScenarioSpotlightCard spotlight={spotlight} />
        </>
      }
    />
  );
}

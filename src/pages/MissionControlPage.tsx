import { PageShell } from "../components/shell/PageShell";
import {
  ActiveRunsCard,
  ActivityCard,
  ApprovalsCard,
  RiskPostureCard,
  ScenarioSpotlightCard,
  WorkerActivityCard,
} from "./overview/MissionControlSections";
import { missionControlSeed } from "./overview/missionControlData";

export function MissionControlPage() {
  const {
    activeRuns,
    activity,
    approvals,
    flaggedItems,
    postureSignals,
    spotlight,
    summaryCards,
    workers,
  } = missionControlSeed;

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
          <RiskPostureCard flaggedItems={flaggedItems} postureSignals={postureSignals} />
          <ApprovalsCard approvals={approvals} />
          <ScenarioSpotlightCard spotlight={spotlight} />
        </>
      }
    />
  );
}

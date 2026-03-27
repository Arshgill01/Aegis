import { StatusBadge } from "../components/ui/StatusBadge";
import {
  ActiveRunsPanel,
  ActivityPanel,
  ApprovalsPreviewPanel,
  RiskPosturePanel,
  ScenarioSpotlightPanel,
  SummaryStrip,
  WorkerActivityPanel,
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
    <div className="mission-control">
      <section className="mission-control__briefing">
        <div className="mission-control__briefing-copy">
          <p className="eyebrow">Overview</p>
          <h1>Supervise worker-led operations from one control surface.</h1>
          <p className="mission-control__copy">
            Aegis supervises AI workers handling business workflows under visible risk, approval,
            and audit constraints. This surface prioritizes the runs, intervention points, and
            evidence trails that matter right now.
          </p>
          <div className="mission-control__briefing-status">
            <StatusBadge tone="info">14 supervised runs</StatusBadge>
            <StatusBadge tone="warning">3 human gates queued</StatusBadge>
            <StatusBadge tone="danger">2 flagged exceptions</StatusBadge>
          </div>
        </div>
        <div className="mission-control__briefing-signals">
          {postureSignals.map((signal) => (
            <article className="mission-control__signal-card" key={signal.label}>
              <span>{signal.label}</span>
              <strong>{signal.value}</strong>
              <StatusBadge tone={signal.tone}>{signal.badge}</StatusBadge>
            </article>
          ))}
        </div>
      </section>

      <SummaryStrip items={summaryCards} />

      <div className="mission-layout">
        <div className="mission-layout__main">
          <ActiveRunsPanel runs={activeRuns} />
          <ActivityPanel entries={activity} />
        </div>

        <div className="mission-layout__rail">
          <ApprovalsPreviewPanel approvals={approvals} />
          <RiskPosturePanel flaggedItems={flaggedItems} postureSignals={postureSignals} />
        </div>
      </div>

      <div className="mission-layout mission-layout--secondary">
        <WorkerActivityPanel workers={workers} />
        <ScenarioSpotlightPanel spotlight={spotlight} />
      </div>
    </div>
  );
}

import { SurfaceCard } from "../../components/shell/SurfaceCard";
import type {
  ActivityEvent,
  ApprovalPreview,
  FlaggedItem,
  MissionTone,
  RunLane,
  ScenarioSpotlight,
  SummaryCardItem,
  WorkerLane,
} from "./missionControlData";

const riskToneMap: Record<RunLane["risk"], MissionTone> = {
  Low: "positive",
  Medium: "attention",
  High: "attention",
};

const modeToneMap: Record<RunLane["mode"], MissionTone> = {
  Shadow: "neutral",
  "Execute-ready": "positive",
};

function chipClass(tone: MissionTone) {
  return `mission-chip mission-chip--${tone}`;
}

export function ActiveRunsCard({ runs }: { runs: RunLane[] }) {
  return (
    <SurfaceCard
      eyebrow="Run supervision"
      title="Active workflow runs"
      footer="Runs are ordered to keep current intervention pressure visible at a glance."
    >
      <div className="mission-list mission-list--runs">
        {runs.map((run) => (
          <article className="mission-run" key={run.id}>
            <div className="mission-run__header">
              <div>
                <div className="mission-run__identity">
                  <strong>{run.id}</strong>
                  <span>{run.workflow}</span>
                </div>
                <p>{run.company}</p>
              </div>
              <div className="mission-chip-row">
                <span className={chipClass(modeToneMap[run.mode])}>{run.mode}</span>
                <span className={chipClass(riskToneMap[run.risk])}>{run.risk} risk</span>
              </div>
            </div>

            <div className="mission-run__grid">
              <div>
                <span>Current stage</span>
                <strong>{run.stage}</strong>
              </div>
              <div>
                <span>Owning worker</span>
                <strong>{run.owner}</strong>
              </div>
              <div>
                <span>Next step</span>
                <strong>{run.nextAction}</strong>
              </div>
              <div>
                <span>ETA</span>
                <strong>{run.eta}</strong>
              </div>
            </div>
          </article>
        ))}
      </div>
    </SurfaceCard>
  );
}

export function ApprovalsCard({ approvals }: { approvals: ApprovalPreview[] }) {
  return (
    <SurfaceCard
      eyebrow="Approvals"
      title="Pending approvals preview"
      footer="Each approval card names the action, why it paused, and who resumes it next."
    >
      <div className="mission-list">
        {approvals.map((approval) => (
          <article className="mission-approval" key={approval.id}>
            <div className="mission-approval__header">
              <div>
                <strong>{approval.title}</strong>
                <p>{approval.runId}</p>
              </div>
              <span className={chipClass("attention")}>{approval.dueBy}</span>
            </div>
            <p className="mission-approval__reason">{approval.reason}</p>
            <div className="mission-approval__footer">
              <span>{approval.owner}</span>
              <span className={chipClass(approval.tone)}>{approval.riskLabel}</span>
            </div>
          </article>
        ))}
      </div>
    </SurfaceCard>
  );
}

export function ActivityCard({ entries }: { entries: ActivityEvent[] }) {
  return (
    <SurfaceCard
      eyebrow="System activity"
      title="Recent system activity"
      footer="System activity stays operational and explainable instead of collapsing into generic audit noise."
    >
      <div className="mission-activity">
        {entries.map((entry) => (
          <article className="mission-activity__row" key={`${entry.time}-${entry.title}`}>
            <div className={`mission-activity__dot mission-activity__dot--${entry.tone}`} />
            <div className="mission-activity__body">
              <div className="mission-activity__meta">
                <strong>{entry.title}</strong>
                <span>{entry.time}</span>
              </div>
              <p>{entry.detail}</p>
              <div className="mission-activity__footer">
                <span>{entry.actor}</span>
                <span className={chipClass(entry.tone)}>{entry.category}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </SurfaceCard>
  );
}

export function RiskPostureCard({
  flaggedItems,
  postureSignals,
}: {
  flaggedItems: FlaggedItem[];
  postureSignals: SummaryCardItem[];
}) {
  return (
    <SurfaceCard
      eyebrow="Risk posture"
      title="Flagged items and control posture"
      footer="Risk stays concrete: visible affected run, surfaced reason, and the next human or worker step."
    >
      <div className="mission-posture">
        {postureSignals.map((signal) => (
          <div className="mission-posture__item" key={signal.label}>
            <span>{signal.label}</span>
            <strong>{signal.value}</strong>
            <em>{signal.badge}</em>
          </div>
        ))}
      </div>

      <div className="mission-list">
        {flaggedItems.map((item) => (
          <article className="mission-flag" key={item.title}>
            <div className="mission-flag__header">
              <strong>{item.title}</strong>
              <span className={chipClass(item.tone)}>{item.severity}</span>
            </div>
            <p>{item.summary}</p>
            <div className="mission-flag__footer">
              <span>{item.runId}</span>
              <strong>{item.nextAction}</strong>
            </div>
          </article>
        ))}
      </div>
    </SurfaceCard>
  );
}

export function WorkerActivityCard({ workers }: { workers: WorkerLane[] }) {
  return (
    <SurfaceCard
      eyebrow="Worker lanes"
      title="Worker activity"
      footer="Workers stay distinct by role, queue pressure, and current focus instead of reading as identical labels."
    >
      <div className="mission-workers">
        {workers.map((worker) => (
          <article className="mission-worker" key={worker.name}>
            <div className="mission-worker__header">
              <div>
                <strong>{worker.name}</strong>
                <p>{worker.role}</p>
              </div>
              <span className={chipClass(worker.tone)}>{worker.posture}</span>
            </div>
            <div className="mission-worker__meta">
              <span>Load {worker.load}</span>
              <span>{worker.queue}</span>
            </div>
            <p className="mission-worker__focus">{worker.focus}</p>
          </article>
        ))}
      </div>
    </SurfaceCard>
  );
}

export function ScenarioSpotlightCard({ spotlight }: { spotlight: ScenarioSpotlight }) {
  return (
    <SurfaceCard
      eyebrow="Scenario spotlight"
      title="Deterministic demo anchor"
      footer="The Overview stays demo-ready without claiming deeper orchestration or approval mechanics than Wave 1 owns."
    >
      <div className="mission-spotlight">
        <div className="mission-spotlight__header">
          <span>Current showcase focus</span>
          <span className={chipClass("neutral")}>{spotlight.phase}</span>
        </div>
        <h3>{spotlight.title}</h3>
        <p>{spotlight.narrative}</p>
        <ul className="mission-spotlight__list">
          {spotlight.watchpoints.map((watchpoint) => (
            <li key={watchpoint}>{watchpoint}</li>
          ))}
        </ul>
      </div>
    </SurfaceCard>
  );
}

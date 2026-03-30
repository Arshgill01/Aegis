import { Link } from "react-router-dom";

import { SurfaceCard } from "../../components/shell/SurfaceCard";
import type {
  ActivityEvent,
  ApprovalPreview,
  FlaggedItem,
  MissionTone,
  PolicyDecisionItem,
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
      footer="Ordered by current intervention pressure."
    >
      <div className="mission-list mission-list--runs">
        {runs.map((run) => (
          <article className="mission-run" key={run.id}>
            <div className="mission-run__header">
              <div>
                <div className="mission-run__identity">
                  <strong>
                    <Link className="entity-link" to={run.runHref}>
                      {run.id}
                    </Link>
                  </strong>
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
      footer="Action, reason, owner, and resume path stay visible."
    >
      <div className="mission-list">
        {approvals.map((approval) => (
          <article className="mission-approval" key={approval.id}>
            <div className="mission-approval__header">
              <div>
                <strong>
                  <Link className="entity-link" to={approval.approvalHref}>
                    {approval.title}
                  </Link>
                </strong>
                <p>
                  <Link className="entity-link entity-link--subtle" to={approval.runHref}>
                    {approval.runId}
                  </Link>
                </p>
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
      footer="Activity stays operational and explainable, not log-like."
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
  decisionPosture,
}: {
  flaggedItems: FlaggedItem[];
  postureSignals: SummaryCardItem[];
  decisionPosture: PolicyDecisionItem[];
}) {
  return (
    <SurfaceCard
      eyebrow="Risk posture"
      title="Flagged items and control posture"
      footer="Affected run, triggered posture, and next control step stay explicit."
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
              <div className="mission-chip-row">
                <span className={chipClass(item.tone)}>{item.severity}</span>
                <span className={chipClass(item.tone)}>{item.decision}</span>
              </div>
            </div>
            <p>{item.summary}</p>
            <div className="mission-flag__footer">
              <span>
                <Link className="entity-link entity-link--subtle" to={item.runHref}>
                  {item.runId}
                </Link>
              </span>
              <span>{item.evidence}</span>
              <strong>{item.nextAction}</strong>
            </div>
          </article>
        ))}
      </div>

      <div className="mission-policy">
        {decisionPosture.map((entry) => (
          <article className="mission-policy__item" key={`${entry.runId}-${entry.posture}`}>
            <div className="mission-policy__header">
              <div>
                <strong>
                  <Link className="entity-link" to={entry.runHref}>
                    {entry.runId}
                  </Link>
                </strong>
                <p>{entry.workflow}</p>
              </div>
              <div className="mission-chip-row">
                <span className={chipClass(entry.tone)}>{entry.posture}</span>
                <span className={chipClass(entry.tone)}>{entry.risk}</span>
              </div>
            </div>
            <p>{entry.reason}</p>
            <div className="mission-policy__footer">
              <span>Next control</span>
              <strong>{entry.nextControl}</strong>
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
      footer="Role, load, and focus stay distinct across worker lanes."
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
      footer="Demo-safe without implying deeper runtime mechanics than Wave 1 owns."
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

import { MetricCard } from "../../components/ui/MetricCard";
import { Panel } from "../../components/ui/Panel";
import { StatusBadge, type StatusTone } from "../../components/ui/StatusBadge";
import type {
  ActivityEvent,
  ApprovalPreview,
  FlaggedItem,
  RunLane,
  ScenarioSpotlight,
  SummaryCardItem,
  WorkerLane,
} from "./missionControlData";

const riskToneMap: Record<RunLane["risk"], StatusTone> = {
  Low: "success",
  Medium: "warning",
  High: "danger",
};

const modeToneMap: Record<RunLane["mode"], StatusTone> = {
  Shadow: "info",
  "Execute-ready": "success",
};

export function SummaryStrip({ items }: { items: SummaryCardItem[] }) {
  return (
    <section className="metric-grid" aria-label="Overview metrics">
      {items.map((item) => (
        <MetricCard
          key={item.label}
          badge={item.badge}
          detail={item.detail}
          label={item.label}
          tone={item.tone}
          value={item.value}
        />
      ))}
    </section>
  );
}

export function ActiveRunsPanel({ runs }: { runs: RunLane[] }) {
  return (
    <Panel
      title="Active workflow runs"
      description="Runs are ordered to show where supervision, escalation, and controlled execution are currently concentrated."
      actions={<StatusBadge tone="info">{runs.length} tracked</StatusBadge>}
    >
      <div className="run-list">
        {runs.map((run) => (
          <article className="run-card" key={run.id}>
            <div className="run-card__header">
              <div>
                <div className="run-card__identity">
                  <strong>{run.id}</strong>
                  <span>{run.workflow}</span>
                </div>
                <p>{run.company}</p>
              </div>
              <div className="run-card__badges">
                <StatusBadge tone={modeToneMap[run.mode]}>{run.mode}</StatusBadge>
                <StatusBadge tone={riskToneMap[run.risk]}>{run.risk} risk</StatusBadge>
              </div>
            </div>

            <div className="run-card__grid">
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
    </Panel>
  );
}

export function ApprovalsPreviewPanel({ approvals }: { approvals: ApprovalPreview[] }) {
  return (
    <Panel
      title="Pending approvals preview"
      description="Human gates surface with enough context to understand the action, the risk, and what resumes next."
      actions={<StatusBadge tone="warning">{approvals.length} queued</StatusBadge>}
    >
      <div className="approval-list">
        {approvals.map((approval) => (
          <article className="approval-card" key={approval.id}>
            <div className="approval-card__header">
              <div>
                <strong>{approval.title}</strong>
                <p>{approval.runId}</p>
              </div>
              <StatusBadge tone="warning">{approval.dueBy}</StatusBadge>
            </div>
            <p className="approval-card__reason">{approval.reason}</p>
            <div className="approval-card__footer">
              <span>{approval.owner}</span>
              <StatusBadge tone={approval.tone}>{approval.riskLabel}</StatusBadge>
            </div>
          </article>
        ))}
      </div>
    </Panel>
  );
}

export function ActivityPanel({ entries }: { entries: ActivityEvent[] }) {
  return (
    <Panel
      title="Recent system activity"
      description="The activity rail emphasizes explainable system actions instead of generic dashboard events."
    >
      <div className="activity-feed">
        {entries.map((entry) => (
          <article className="activity-row" key={`${entry.time}-${entry.title}`}>
            <div className={`activity-row__dot activity-row__dot--${entry.tone}`} />
            <div className="activity-row__body">
              <div className="activity-row__meta">
                <strong>{entry.title}</strong>
                <span>{entry.time}</span>
              </div>
              <p>{entry.detail}</p>
              <div className="activity-row__footer">
                <span>{entry.actor}</span>
                <StatusBadge tone={entry.tone}>{entry.category}</StatusBadge>
              </div>
            </div>
          </article>
        ))}
      </div>
    </Panel>
  );
}

export function RiskPosturePanel({
  flaggedItems,
  postureSignals,
}: {
  flaggedItems: FlaggedItem[];
  postureSignals: SummaryCardItem[];
}) {
  return (
    <Panel
      title="Risk posture"
      description="Fast posture indicators and specific flagged items keep risk legible without pretending the policy engine exists yet."
    >
      <div className="posture-grid">
        {postureSignals.map((signal) => (
          <div className="posture-card" key={signal.label}>
            <span>{signal.label}</span>
            <strong>{signal.value}</strong>
            <StatusBadge tone={signal.tone}>{signal.badge}</StatusBadge>
          </div>
        ))}
      </div>

      <div className="flagged-list">
        {flaggedItems.map((item) => (
          <article className="flagged-card" key={item.title}>
            <div className="flagged-card__header">
              <strong>{item.title}</strong>
              <StatusBadge tone={item.tone}>{item.severity}</StatusBadge>
            </div>
            <p>{item.summary}</p>
            <div className="flagged-card__footer">
              <span>{item.runId}</span>
              <strong>{item.nextAction}</strong>
            </div>
          </article>
        ))}
      </div>
    </Panel>
  );
}

export function WorkerActivityPanel({ workers }: { workers: WorkerLane[] }) {
  return (
    <Panel
      title="Worker activity"
      description="Each worker lane is framed by role, current load, and what the system expects from it next."
      actions={<StatusBadge tone="success">{workers.length} active lanes</StatusBadge>}
    >
      <div className="worker-grid">
        {workers.map((worker) => (
          <article className="worker-card" key={worker.name}>
            <div className="worker-card__header">
              <div>
                <strong>{worker.name}</strong>
                <p>{worker.role}</p>
              </div>
              <StatusBadge tone={worker.tone}>{worker.posture}</StatusBadge>
            </div>
            <div className="worker-card__meta">
              <span>Load {worker.load}</span>
              <span>{worker.queue}</span>
            </div>
            <p className="worker-card__focus">{worker.focus}</p>
          </article>
        ))}
      </div>
    </Panel>
  );
}

export function ScenarioSpotlightPanel({ spotlight }: { spotlight: ScenarioSpotlight }) {
  return (
    <Panel
      title="Scenario spotlight"
      description="A deterministic scenario anchor keeps the flagship screen tied to the product story without forcing later-wave mechanics."
      actions={<StatusBadge tone="info">{spotlight.phase}</StatusBadge>}
    >
      <div className="spotlight-card">
        <div className="spotlight-card__eyebrow">
          <span>Current showcase focus</span>
          <StatusBadge tone="neutral">Demo-safe</StatusBadge>
        </div>
        <h3>{spotlight.title}</h3>
        <p>{spotlight.narrative}</p>
        <ul className="spotlight-list">
          {spotlight.watchpoints.map((watchpoint) => (
            <li key={watchpoint}>{watchpoint}</li>
          ))}
        </ul>
      </div>
    </Panel>
  );
}

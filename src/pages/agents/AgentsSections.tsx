import { SurfaceCard } from "../../components/shell/SurfaceCard";
import type {
  AgentSurfaceTone,
  WorkerActivitySummary,
  WorkerAssignmentSummary,
  WorkerHandoffSummary,
  WorkerLaneSummary,
} from "./agentsData";

function chipClass(tone: AgentSurfaceTone) {
  return `mission-chip mission-chip--${tone}`;
}

export function WorkerLanesCard({ workers }: { workers: WorkerLaneSummary[] }) {
  return (
    <SurfaceCard
      eyebrow="Worker roster"
      title="Operational worker lanes"
      footer="Each lane keeps role, load, and current pressure visible for supervision."
    >
      <div className="agents-lanes">
        {workers.map((worker) => (
          <article className="agents-lane" key={worker.id}>
            <div className="agents-lane__header">
              <div>
                <strong>{worker.name}</strong>
                <p>{worker.role}</p>
              </div>
              <span className={chipClass(worker.tone)}>{worker.posture}</span>
            </div>

            <div className="agents-lane__metrics">
              <div>
                <span>Queue</span>
                <strong>{worker.queueDepth}</strong>
              </div>
              <div>
                <span>Load</span>
                <strong>{worker.loadPercent}%</strong>
              </div>
              <div>
                <span>Owned runs</span>
                <strong>{worker.ownedRuns}</strong>
              </div>
              <div>
                <span>In-flight steps</span>
                <strong>{worker.inFlightSteps}</strong>
              </div>
            </div>

            <p className="agents-lane__focus">{worker.focus}</p>
            <div className="agents-lane__footer">
              <span>{worker.blockedSteps} gated step(s)</span>
              <span>{worker.executeReadySteps} execute-ready touchpoint(s)</span>
            </div>
            {worker.latestActivity ? (
              <p className="agents-lane__activity">Latest: {worker.latestActivity}</p>
            ) : null}
          </article>
        ))}
      </div>
    </SurfaceCard>
  );
}

export function WorkerAssignmentsCard({ assignments }: { assignments: WorkerAssignmentSummary[] }) {
  return (
    <SurfaceCard
      eyebrow="Run ownership"
      title="Active assignment board"
      footer="Assignment view stays summary-level so detailed step execution remains on Runs."
    >
      <div className="agents-assignment-list">
        {assignments.map((assignment) => (
          <article className="agents-assignment" key={assignment.runId}>
            <div className="agents-assignment__header">
              <div className="agents-assignment__identity">
                <strong>{assignment.runId}</strong>
                <span>{assignment.workflow}</span>
              </div>
              <div className="mission-chip-row">
                <span className={chipClass(assignment.mode === "Execute-ready" ? "positive" : "neutral")}>
                  {assignment.mode}
                </span>
                <span className={chipClass(assignment.tone)}>{assignment.risk} risk</span>
              </div>
            </div>

            <p className="agents-assignment__account">{assignment.accountName}</p>
            <div className="agents-assignment__grid">
              <div>
                <span>Owner</span>
                <strong>{assignment.owner}</strong>
              </div>
              <div>
                <span>Current stage</span>
                <strong>{assignment.stage}</strong>
              </div>
              <div>
                <span>Handoffs</span>
                <strong>{assignment.handoffCount}</strong>
              </div>
              <div>
                <span>Current gate</span>
                <strong>{assignment.gateLabel}</strong>
              </div>
            </div>
            <div className="agents-assignment__footer">
              <span>Support lanes: {assignment.supportLane}</span>
              <strong>Next: {assignment.nextAction}</strong>
            </div>
          </article>
        ))}
      </div>
    </SurfaceCard>
  );
}

export function WorkerHandoffsCard({ handoffs }: { handoffs: WorkerHandoffSummary[] }) {
  return (
    <SurfaceCard
      eyebrow="Orchestration"
      title="Recent worker handoffs"
      footer="Handoff rows show exactly where ownership moved between worker lanes."
    >
      <div className="agents-handoff-list">
        {handoffs.length === 0 ? (
          <p className="agents-empty">No active handoffs captured.</p>
        ) : (
          handoffs.map((handoff) => (
            <article className="agents-handoff" key={handoff.id}>
              <div className="agents-handoff__header">
                <strong>{handoff.runId}</strong>
                <span className={chipClass(handoff.tone)}>{handoff.risk} risk</span>
              </div>
              <p>{handoff.accountName}</p>
              <p className="agents-handoff__route">
                {handoff.fromWorker} {"->"} {handoff.toWorker}
              </p>
              <div className="agents-handoff__footer">
                <span>{handoff.stepTitle}</span>
                <span>{handoff.mode}</span>
              </div>
            </article>
          ))
        )}
      </div>
    </SurfaceCard>
  );
}

export function WorkerActivityCard({ events }: { events: WorkerActivitySummary[] }) {
  return (
    <SurfaceCard
      eyebrow="Worker telemetry"
      title="Latest worker activity"
      footer="Activity remains actor-first so reviewers can trace who moved each run forward."
    >
      <div className="agents-activity-list">
        {events.map((event) => (
          <article className="agents-activity" key={event.id}>
            <div className={`mission-activity__dot mission-activity__dot--${event.tone}`} />
            <div className="agents-activity__body">
              <div className="agents-activity__meta">
                <strong>{event.title}</strong>
                <span>{event.time}</span>
              </div>
              <p>{event.detail}</p>
              <div className="agents-activity__footer">
                <span>{event.actor}</span>
                <span>{event.runLabel}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </SurfaceCard>
  );
}

import { SurfaceCard } from "../../components/shell/SurfaceCard";
import type { RunQueueItem, SpotlightRun, StepGroup } from "./runPageData";

function toneForStatus(statusLabel: string) {
  if (statusLabel === "Blocked" || statusLabel === "Approval hold") {
    return "attention";
  }

  if (statusLabel === "Completed") {
    return "positive";
  }

  return "neutral";
}

function chipClass(tone: "neutral" | "attention" | "positive") {
  return `mission-chip mission-chip--${tone}`;
}

export function RunQueueCard({ runs }: { runs: RunQueueItem[] }) {
  return (
    <SurfaceCard
      eyebrow="Run queue"
      title="Worker-owned workflow runs"
      footer="Run ownership and next-stage context stay visible for every in-flight lane."
    >
      <div className="run-orch__queue">
        {runs.map((run) => (
          <article className="run-orch__queue-item" key={run.id}>
            <div className="run-orch__queue-header">
              <div>
                <div className="run-orch__identity">
                  <strong>{run.id}</strong>
                  <span>{run.workflow}</span>
                </div>
                <p>{run.accountName}</p>
              </div>
              <div className="mission-chip-row">
                <span className={chipClass(toneForStatus(run.statusLabel))}>{run.statusLabel}</span>
                <span className={chipClass("attention")}>{run.riskLabel}</span>
              </div>
            </div>

            <div className="run-orch__meta-grid">
              <div>
                <span>Current stage</span>
                <strong>{run.currentStage}</strong>
              </div>
              <div>
                <span>Owning worker</span>
                <strong>{run.ownerName}</strong>
                <p>{run.ownerRole}</p>
              </div>
              <div>
                <span>Progress</span>
                <strong>
                  {run.completedSteps}/{run.totalSteps} steps closed
                </strong>
              </div>
              <div>
                <span>ETA</span>
                <strong>{run.etaLabel}</strong>
              </div>
            </div>

            <p className="run-orch__next-action">
              <span>Next action</span>
              <strong>{run.nextAction}</strong>
            </p>
          </article>
        ))}
      </div>
    </SurfaceCard>
  );
}

export function CurrentStageCard({ run }: { run: SpotlightRun }) {
  return (
    <SurfaceCard
      eyebrow={run.id}
      title="Current stage ownership"
      footer="Handoffs stay explicit so stage progression is inspectable instead of implicit."
    >
      <div className="run-orch__spotlight">
        <div className="run-orch__spotlight-header">
          <div>
            <strong>{run.workflow}</strong>
            <p>{run.accountName}</p>
          </div>
          <span className={chipClass(toneForStatus(run.statusLabel))}>{run.statusLabel}</span>
        </div>

        <div className="run-orch__spotlight-stage">
          <span>Current stage</span>
          <strong>{run.currentStage}</strong>
          <p>{run.nextAction}</p>
        </div>

        <div className="run-orch__spotlight-owner">
          <span>Current owner</span>
          <strong>{run.ownerName}</strong>
          <p>
            {run.ownerRole} · {run.ownerPosture}
          </p>
        </div>

        <div className="run-orch__spotlight-summary">
          <span>Run completion</span>
          <strong>{run.completionLabel}</strong>
          <p>Active step: {run.activeStepTitle}</p>
        </div>

        <div className="run-orch__spotlight-section">
          <span>Worker handoffs</span>
          {run.handoffs.length > 0 ? (
            <div className="run-orch__handoffs">
              {run.handoffs.map((handoff) => (
                <article className="run-orch__handoff" key={`${handoff.stepTitle}-${handoff.toWorkerName}`}>
                  <p>
                    <strong>{handoff.fromWorkerName}</strong> to <strong>{handoff.toWorkerName}</strong>
                  </p>
                  <span>{handoff.stepTitle}</span>
                </article>
              ))}
            </div>
          ) : (
            <p className="run-orch__empty">No worker handoffs recorded for this run.</p>
          )}
        </div>

        <div className="run-orch__spotlight-section">
          <span>Stage watchpoints</span>
          <ul className="run-orch__watchpoints">
            {run.watchpoints.map((watchpoint) => (
              <li key={watchpoint}>{watchpoint}</li>
            ))}
          </ul>
        </div>
      </div>
    </SurfaceCard>
  );
}

export function StepProgressionCard({ groups }: { groups: StepGroup[] }) {
  return (
    <SurfaceCard
      eyebrow="Step progression"
      title="Stage progression by ownership"
      footer="Completed, active, and gated steps keep one progression model across run states."
    >
      <div className="run-orch__groups">
        {groups.map((group) => (
          <section className="run-orch__group" key={group.key}>
            <header className="run-orch__group-header">
              <strong>{group.label}</strong>
              <p>{group.detail}</p>
            </header>
            <div className="run-orch__steps">
              {group.items.map((step) => (
                <article className="run-orch__step" key={step.id}>
                  <div className="run-orch__step-header">
                    <div>
                      <strong>{step.title}</strong>
                      <p>{step.summary}</p>
                    </div>
                    <span className={chipClass(toneForStatus(step.statusLabel))}>{step.statusLabel}</span>
                  </div>
                  <div className="run-orch__step-owner">
                    <span>{step.workerName}</span>
                    <p>{step.workerRole}</p>
                  </div>
                  {step.handoffFrom ? (
                    <p className="run-orch__step-handoff">Handoff from {step.handoffFrom}</p>
                  ) : null}
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </SurfaceCard>
  );
}

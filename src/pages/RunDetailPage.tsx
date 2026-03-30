import { Link, useParams } from "react-router-dom";

import { approvalDetailPath } from "../app/entityRoutes";
import { useRunDetailPageData } from "../app/data/hooks";
import { SurfaceCard } from "../components/shell/SurfaceCard";
import type { RunStatus, StepStatus, WorkflowScenario } from "../domain/contracts";
import {
  patchScenario,
  setRunStatus,
  setStepStatus,
} from "../domain/runtimeStore";
import { PageShell } from "../components/shell/PageShell";
import {
  CurrentStageCard,
  ExecutionModeCard,
  OrchestrationTimelineCard,
  PolicyPostureCard,
  StepProgressionCard,
} from "./runs/RunOrchestrationSections";

const runStatusOptions: RunStatus[] = [
  "queued",
  "planning",
  "running",
  "waiting_for_approval",
  "blocked",
  "completed",
];

const stepStatusOptions: StepStatus[] = [
  "queued",
  "running",
  "waiting_for_approval",
  "blocked",
  "completed",
];

const scenarioPhaseOptions = [
  "Seeded scenario",
  "Live run supervision",
  "Post-review follow-up",
];

function labelizeStatus(status: string) {
  return status.replace(/_/g, " ");
}

function RunStateControlsCard({ scenario }: { scenario: WorkflowScenario }) {
  return (
    <SurfaceCard
      eyebrow="Mutable controls"
      title="Run and step mutation controls"
      footer="These controls mutate central runtime state directly so downstream branches can bind real behavior."
    >
      <div className="entity-controls">
        <section className="entity-controls__section">
          <span>Run status</span>
          <div className="entity-controls__actions">
            {runStatusOptions.map((status) => (
              <button
                key={status}
                className={`entity-control-btn${scenario.run.status === status ? " entity-control-btn--active" : ""}`}
                onClick={() => setRunStatus(scenario.run.id, status)}
                type="button"
              >
                {labelizeStatus(status)}
              </button>
            ))}
          </div>
        </section>

        <section className="entity-controls__section">
          <span>Scenario phase</span>
          <div className="entity-controls__actions">
            {scenarioPhaseOptions.map((phase) => (
              <button
                key={phase}
                className={`entity-control-btn${scenario.phase === phase ? " entity-control-btn--active" : ""}`}
                onClick={() => patchScenario(scenario.id, { phase })}
                type="button"
              >
                {phase}
              </button>
            ))}
          </div>
        </section>

        <section className="entity-controls__section">
          <span>Step statuses</span>
          <div className="entity-controls__steps">
            {scenario.steps.map((step) => (
              <article className="entity-controls__step" key={step.id}>
                <strong>{step.title}</strong>
                <p>{step.summary}</p>
                <div className="entity-controls__actions">
                  {stepStatusOptions.map((status) => (
                    <button
                      key={`${step.id}-${status}`}
                      className={`entity-control-btn${step.status === status ? " entity-control-btn--active" : ""}`}
                      onClick={() => setStepStatus(scenario.run.id, step.id, status)}
                      type="button"
                    >
                      {labelizeStatus(status)}
                    </button>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </SurfaceCard>
  );
}

export function RunDetailPage() {
  const params = useParams();
  const detail = useRunDetailPageData(params.runId);

  if (!params.runId || !detail) {
    return (
      <div className="not-found">
        <p className="eyebrow">Run not found</p>
        <h2>The requested run ID is not present in seeded runtime state.</h2>
        <p>Select an active run from the queue and reopen the detail route.</p>
        <Link className="not-found__link" to="/runs">
          Back to Runs
        </Link>
      </div>
    );
  }

  const { relatedApprovals, runsPage, scenario } = detail;

  return (
    <PageShell
      eyebrow={`Run ${scenario.run.id}`}
      title={`${scenario.run.workflow} detail`}
      description="Run detail is now parameterized by route entity and backed by mutable runtime state for status and step updates."
      summaryCards={[
        { label: "Run status", value: labelizeStatus(scenario.run.status) },
        { label: "Execution mode", value: scenario.run.mode.replace(/_/g, " ") },
        {
          label: "Risk posture",
          value: scenario.run.riskLevel,
          tone: scenario.run.riskLevel === "low" ? "positive" : "attention",
        },
        {
          label: "Related approvals",
          value: `${relatedApprovals.length}`,
          tone: relatedApprovals.length > 0 ? "attention" : "positive",
        },
      ]}
      signals={[
        { label: "Current owner", detail: runsPage.spotlight.ownerName },
        { label: "Active stage", detail: scenario.run.currentStage },
        { label: "Next action", detail: scenario.run.nextAction },
        {
          label: "Approval links",
          detail:
            relatedApprovals.length > 0
              ? relatedApprovals.map((approval) => approval.id).join(", ")
              : "No linked approvals",
        },
      ]}
      primaryColumn={
        <>
          <CurrentStageCard run={runsPage.spotlight} />
          <StepProgressionCard groups={runsPage.stepGroups} />
          <OrchestrationTimelineCard timeline={runsPage.timeline} />
        </>
      }
      secondaryColumn={
        <>
          {relatedApprovals.length > 0 ? (
            <SurfaceCard
              eyebrow="Linked approvals"
              title="Approval entities for this run"
              footer="Approval detail routes are now first-class entities with writable state."
            >
              <div className="entity-controls__list">
                {relatedApprovals.map((approval) => (
                  <Link
                    className="entity-link entity-link--list"
                    key={approval.id}
                    to={approvalDetailPath(approval.id)}
                  >
                    {approval.id} · {approval.title}
                  </Link>
                ))}
              </div>
            </SurfaceCard>
          ) : null}
          <RunStateControlsCard scenario={scenario} />
          <PolicyPostureCard posture={runsPage.policyPosture} />
          <ExecutionModeCard executionMode={runsPage.executionMode} />
        </>
      }
    />
  );
}

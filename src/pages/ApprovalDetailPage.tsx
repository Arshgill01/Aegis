import { Link, useParams } from "react-router-dom";

import { runDetailPath } from "../app/entityRoutes";
import { useApprovalDetailPageData } from "../app/data/hooks";
import { PageShell } from "../components/shell/PageShell";
import { SurfaceCard } from "../components/shell/SurfaceCard";
import {
  patchApproval,
  patchRun,
  setApprovalStatus,
  setRunStatus,
  setStepStatus,
} from "../domain/runtimeStore";

function applyApprovalDecision(approvalId: string, runId: string, decision: "approved" | "rejected" | "pending") {
  const approvalStepStatus =
    decision === "approved"
      ? "completed"
      : decision === "rejected"
        ? "blocked"
        : "waiting_for_approval";
  const runStatus =
    decision === "approved"
      ? "running"
      : decision === "rejected"
        ? "blocked"
        : "waiting_for_approval";

  setApprovalStatus(approvalId, decision);
  setRunStatus(runId, runStatus);

  patchRun(runId, {
    nextAction:
      decision === "approved"
        ? "Resume controlled execution path from the human gate."
        : decision === "rejected"
          ? "Keep execution blocked and route to manual exception handling."
          : "Await named reviewer decision before progression.",
  });

  patchApproval(approvalId, {
    dueLabel: decision === "pending" ? "Due in 18 min" : "Decision recorded",
  });

  return approvalStepStatus;
}

export function ApprovalDetailPage() {
  const params = useParams();
  const detail = useApprovalDetailPageData(params.approvalId);

  if (!params.approvalId || !detail) {
    return (
      <div className="not-found">
        <p className="eyebrow">Approval not found</p>
        <h2>The requested approval ID is not present in seeded runtime state.</h2>
        <p>Open a known approval from the queue and retry the detail route.</p>
        <Link className="not-found__link" to="/approvals">
          Back to Approvals
        </Link>
      </div>
    );
  }

  const { approval, relatedApprovals, scenario } = detail;
  const runHref = runDetailPath(scenario.run.id);
  const approvalStep = scenario.steps.find((step) =>
    step.status === "waiting_for_approval" || step.status === "blocked",
  );
  const executeStep = scenario.steps.find((step) => step.mode === "execute_ready");

  return (
    <PageShell
      eyebrow={`Approval ${approval.id}`}
      title={approval.title}
      description="Approval detail now resolves by route param and mutates the shared runtime store for approve, reject, and reset actions."
      summaryCards={[
        {
          label: "Approval status",
          value: approval.status.replace(/_/g, " "),
          tone: approval.status === "approved" ? "positive" : approval.status === "rejected" ? "attention" : "neutral",
        },
        {
          label: "Risk level",
          value: approval.riskLevel,
          tone: approval.riskLevel === "low" ? "positive" : "attention",
        },
        { label: "Assignee", value: approval.assignee },
        { label: "Run", value: scenario.run.id },
      ]}
      signals={[
        { label: "Requested action", detail: approval.requestedAction },
        { label: "Reason", detail: approval.reason },
        { label: "Current run status", detail: scenario.run.status.replace(/_/g, " ") },
        { label: "Run route", detail: scenario.run.id, emphasis: "Open linked run entity below" },
      ]}
      primaryColumn={
        <>
          <SurfaceCard
            eyebrow="Decision controls"
            title="Mutate approval and linked run state"
            footer="These controls intentionally keep mutation entry points explicit for downstream run-progression and policy branches."
          >
            <div className="entity-controls">
              <section className="entity-controls__section">
                <span>Approval decision</span>
                <div className="entity-controls__actions">
                  <button
                    className={`entity-control-btn${approval.status === "approved" ? " entity-control-btn--active" : ""}`}
                    onClick={() => {
                      const nextStepStatus = applyApprovalDecision(
                        approval.id,
                        scenario.run.id,
                        "approved",
                      );
                      if (approvalStep) {
                        setStepStatus(scenario.run.id, approvalStep.id, nextStepStatus);
                      }
                      if (executeStep) {
                        setStepStatus(scenario.run.id, executeStep.id, "running");
                      }
                    }}
                    type="button"
                  >
                    Approve
                  </button>
                  <button
                    className={`entity-control-btn${approval.status === "rejected" ? " entity-control-btn--active" : ""}`}
                    onClick={() => {
                      const nextStepStatus = applyApprovalDecision(
                        approval.id,
                        scenario.run.id,
                        "rejected",
                      );
                      if (approvalStep) {
                        setStepStatus(scenario.run.id, approvalStep.id, nextStepStatus);
                      }
                      if (executeStep) {
                        setStepStatus(scenario.run.id, executeStep.id, "blocked");
                      }
                    }}
                    type="button"
                  >
                    Reject
                  </button>
                  <button
                    className={`entity-control-btn${approval.status === "pending" ? " entity-control-btn--active" : ""}`}
                    onClick={() => {
                      const nextStepStatus = applyApprovalDecision(
                        approval.id,
                        scenario.run.id,
                        "pending",
                      );
                      if (approvalStep) {
                        setStepStatus(scenario.run.id, approvalStep.id, nextStepStatus);
                      }
                      if (executeStep) {
                        setStepStatus(scenario.run.id, executeStep.id, "blocked");
                      }
                    }}
                    type="button"
                  >
                    Reset to pending
                  </button>
                </div>
              </section>

              <section className="entity-controls__section">
                <span>Linked run</span>
                <Link className="entity-link entity-link--list" to={runHref}>
                  {scenario.run.id} · {scenario.run.workflow}
                </Link>
              </section>
            </div>
          </SurfaceCard>

          <SurfaceCard
            eyebrow="Approval context"
            title="Why this gate exists"
            footer="Approval detail keeps decision rationale and evidence close to the action being authorized."
          >
            <div className="entity-controls">
              <section className="entity-controls__section">
                <span>Trigger label</span>
                <strong>{approval.triggerLabel}</strong>
              </section>
              <section className="entity-controls__section">
                <span>Requested action</span>
                <strong>{approval.requestedAction}</strong>
              </section>
              <section className="entity-controls__section">
                <span>Evidence artifacts</span>
                <div className="entity-controls__list">
                  {scenario.artifacts.map((artifact) => (
                    <span key={artifact.id}>{artifact.title}</span>
                  ))}
                </div>
              </section>
            </div>
          </SurfaceCard>
        </>
      }
      secondaryColumn={
        <>
          <SurfaceCard
            eyebrow="Run posture"
            title="Linked run and policy posture"
            footer="Approval decisions feed directly into run state and the controlled execution path."
          >
            <div className="entity-controls">
              <section className="entity-controls__section">
                <span>Run ID</span>
                <strong>
                  <Link className="entity-link" to={runHref}>
                    {scenario.run.id}
                  </Link>
                </strong>
              </section>
              <section className="entity-controls__section">
                <span>Current stage</span>
                <strong>{scenario.run.currentStage}</strong>
              </section>
              <section className="entity-controls__section">
                <span>Policy outcomes</span>
                <div className="entity-controls__list">
                  {scenario.policies.map((policy) => (
                    <span key={policy.id}>
                      {policy.name} · {policy.outcome}
                    </span>
                  ))}
                </div>
              </section>
            </div>
          </SurfaceCard>

          <SurfaceCard
            eyebrow="Related approvals"
            title="Sibling approvals in this run"
            footer="Approval route handling is now entity-based, not static placeholder content."
          >
            <div className="entity-controls__list">
              {relatedApprovals.map((relatedApproval) => (
                <span key={relatedApproval.id}>
                  {relatedApproval.id} · {relatedApproval.status}
                </span>
              ))}
            </div>
          </SurfaceCard>
        </>
      }
    />
  );
}

import {
  workerIds,
  workerOperationalSummaryDefaults,
  workerRegistry,
} from "../contracts";
import type {
  AgentWorker,
  WorkerOperationalSummary,
} from "../contracts";

export const seededWorkerOperationalSummaries: Record<AgentWorker["id"], WorkerOperationalSummary> = {
  "worker-intake": {
    posture: "stable",
    queueDepth: 6,
    activeRunCount: 4,
    loadPercent: 74,
    headline: "Inbound AP packets are flowing through normalized intake without backlog risk.",
  },
  "worker-document-review": {
    posture: "stable",
    queueDepth: 4,
    activeRunCount: 3,
    loadPercent: 68,
    headline: "Document validation remains steady with complete evidence linkage in most runs.",
  },
  "worker-vendor-review": {
    posture: "watching",
    queueDepth: 3,
    activeRunCount: 2,
    loadPercent: 66,
    headline: "Vendor remittance checks are watching two change-sensitive packets.",
  },
  "worker-po-match": {
    posture: "watching",
    queueDepth: 3,
    activeRunCount: 2,
    loadPercent: 71,
    headline: "PO variance lane holds a small set of mismatch-heavy review packets.",
  },
  "worker-policy-review": {
    posture: "watching",
    queueDepth: 2,
    activeRunCount: 2,
    loadPercent: 63,
    headline: "Policy review is evaluating exception paths before they reach human gates.",
  },
  "worker-risk": {
    posture: "escalated",
    queueDepth: 4,
    activeRunCount: 3,
    loadPercent: 86,
    headline: "Risk lane is elevated due to active mismatch and remittance-drift exceptions.",
  },
  "worker-approval-coordinator": {
    posture: "coordinating",
    queueDepth: 3,
    activeRunCount: 2,
    loadPercent: 58,
    headline: "Named approval gates are being coordinated with clear resume paths.",
  },
  "worker-execution": {
    posture: "ready",
    queueDepth: 1,
    activeRunCount: 1,
    loadPercent: 41,
    headline: "Execute lane remains ready with one controlled posting package staged.",
  },
  "worker-audit-narrator": {
    posture: "narrating",
    queueDepth: 2,
    activeRunCount: 2,
    loadPercent: 52,
    headline: "Audit narration is drafting replay summaries for active exception runs.",
  },
};

export const seededWorkers: AgentWorker[] = workerIds.map((workerId) => ({
  ...workerRegistry[workerId],
  operationalSummary:
    seededWorkerOperationalSummaries[workerId] ?? workerOperationalSummaryDefaults[workerId],
}));

export const seededWorkerRegistry = Object.fromEntries(
  seededWorkers.map((worker) => [worker.id, worker]),
) as Record<AgentWorker["id"], AgentWorker>;

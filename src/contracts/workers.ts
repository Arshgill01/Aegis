export const workerRoles = [
  "intake",
  "document-review",
  "vendor-review",
  "po-match",
  "policy-review",
  "risk-review",
  "approval-coordination",
  "execution",
  "audit-narration",
] as const;

export type WorkerRole = (typeof workerRoles)[number];

export const workerIds = [
  "worker-intake",
  "worker-document-review",
  "worker-vendor-review",
  "worker-po-match",
  "worker-policy-review",
  "worker-risk",
  "worker-approval-coordinator",
  "worker-execution",
  "worker-audit-narrator",
] as const;

export type WorkerId = (typeof workerIds)[number];

export const workerStageKeys = [
  "intake",
  "document-review",
  "vendor-resolution",
  "po-match",
  "policy-evaluation",
  "risk-assessment",
  "approval-routing",
  "controlled-execution",
  "audit-narration",
] as const;

export type WorkerStageKey = (typeof workerStageKeys)[number];

export type WorkerExecutionMode = "shadow" | "execute";

export type WorkerRoleMetadata = {
  role: WorkerRole;
  label: string;
  summary: string;
};

export type WorkerStageOwnership = {
  primaryStages: WorkerStageKey[];
  supportingStages: WorkerStageKey[];
};

export type WorkerDefinition = {
  id: WorkerId;
  name: string;
  role: WorkerRole;
  roleLabel: string;
  responsibility: string;
  stageOwnership: WorkerStageOwnership;
  handoffTargets: WorkerId[];
  defaultExecutionMode: WorkerExecutionMode;
};

export const workerRoleMetadata: Record<WorkerRole, WorkerRoleMetadata> = {
  intake: {
    role: "intake",
    label: "Intake",
    summary: "Normalizes inbound workflow packets and opens the first supervised lane.",
  },
  "document-review": {
    role: "document-review",
    label: "Document Review",
    summary: "Validates extracted document fields and preserves evidence quality.",
  },
  "vendor-review": {
    role: "vendor-review",
    label: "Vendor Review",
    summary: "Checks supplier identity, remittance posture, and onboarding integrity.",
  },
  "po-match": {
    role: "po-match",
    label: "PO Match",
    summary: "Performs three-way matching and quantifies invoice-to-PO variance.",
  },
  "policy-review": {
    role: "policy-review",
    label: "Policy Review",
    summary: "Interprets policy posture and names the control lane required next.",
  },
  "risk-review": {
    role: "risk-review",
    label: "Risk Review",
    summary: "Frames risk severity with concrete factors and containment recommendations.",
  },
  "approval-coordination": {
    role: "approval-coordination",
    label: "Approval Coordination",
    summary: "Packages human gates and manages safe resume paths after review.",
  },
  execution: {
    role: "execution",
    label: "Execution",
    summary: "Performs controlled downstream actions only after explicit clearance.",
  },
  "audit-narration": {
    role: "audit-narration",
    label: "Audit Narration",
    summary: "Builds replay-ready narrative context from worker actions and evidence.",
  },
};

export const workerRegistry: Record<WorkerId, WorkerDefinition> = {
  "worker-intake": {
    id: "worker-intake",
    name: "Intake Worker",
    role: "intake",
    roleLabel: "Intake",
    responsibility:
      "Receives inbound workflow submissions, normalizes artifacts, and opens supervised run context.",
    stageOwnership: {
      primaryStages: ["intake"],
      supportingStages: ["document-review", "vendor-resolution"],
    },
    handoffTargets: ["worker-document-review", "worker-vendor-review", "worker-po-match"],
    defaultExecutionMode: "shadow",
  },
  "worker-document-review": {
    id: "worker-document-review",
    name: "Document Review Worker",
    role: "document-review",
    roleLabel: "Document Review",
    responsibility:
      "Checks document completeness, extracted fields, and evidence linkage before deeper control steps run.",
    stageOwnership: {
      primaryStages: ["document-review"],
      supportingStages: ["po-match", "policy-evaluation"],
    },
    handoffTargets: ["worker-po-match", "worker-policy-review", "worker-risk"],
    defaultExecutionMode: "shadow",
  },
  "worker-vendor-review": {
    id: "worker-vendor-review",
    name: "Vendor Review Worker",
    role: "vendor-review",
    roleLabel: "Vendor Review",
    responsibility:
      "Validates vendor identity and remittance integrity so payment-sensitive steps do not run on untrusted profiles.",
    stageOwnership: {
      primaryStages: ["vendor-resolution"],
      supportingStages: ["risk-assessment", "approval-routing"],
    },
    handoffTargets: ["worker-policy-review", "worker-risk", "worker-approval-coordinator"],
    defaultExecutionMode: "shadow",
  },
  "worker-po-match": {
    id: "worker-po-match",
    name: "PO Match Worker",
    role: "po-match",
    roleLabel: "PO Match",
    responsibility:
      "Performs three-way matching and quantifies invoice variance before release-oriented work can continue.",
    stageOwnership: {
      primaryStages: ["po-match"],
      supportingStages: ["risk-assessment", "policy-evaluation"],
    },
    handoffTargets: ["worker-policy-review", "worker-risk", "worker-approval-coordinator"],
    defaultExecutionMode: "shadow",
  },
  "worker-policy-review": {
    id: "worker-policy-review",
    name: "Policy Review Worker",
    role: "policy-review",
    roleLabel: "Policy Review",
    responsibility:
      "Translates rule posture into allow/escalate/block guidance before execution decisions are finalized.",
    stageOwnership: {
      primaryStages: ["policy-evaluation"],
      supportingStages: ["risk-assessment", "approval-routing"],
    },
    handoffTargets: ["worker-risk", "worker-approval-coordinator"],
    defaultExecutionMode: "shadow",
  },
  "worker-risk": {
    id: "worker-risk",
    name: "Risk Worker",
    role: "risk-review",
    roleLabel: "Risk Review",
    responsibility:
      "Names risk severity, attaches supporting factors, and routes exceptions into the correct containment lane.",
    stageOwnership: {
      primaryStages: ["risk-assessment"],
      supportingStages: ["approval-routing", "controlled-execution"],
    },
    handoffTargets: ["worker-approval-coordinator", "worker-execution"],
    defaultExecutionMode: "shadow",
  },
  "worker-approval-coordinator": {
    id: "worker-approval-coordinator",
    name: "Approval Coordinator",
    role: "approval-coordination",
    roleLabel: "Approval Coordination",
    responsibility:
      "Creates explicit human approval gates, tracks review ownership, and coordinates controlled resume after decisions.",
    stageOwnership: {
      primaryStages: ["approval-routing"],
      supportingStages: ["risk-assessment", "controlled-execution"],
    },
    handoffTargets: ["worker-risk", "worker-execution", "worker-audit-narrator"],
    defaultExecutionMode: "shadow",
  },
  "worker-execution": {
    id: "worker-execution",
    name: "Execution Worker",
    role: "execution",
    roleLabel: "Execution",
    responsibility:
      "Performs controlled posting and payment actions only after policy, risk, and approval conditions are satisfied.",
    stageOwnership: {
      primaryStages: ["controlled-execution"],
      supportingStages: ["risk-assessment", "audit-narration"],
    },
    handoffTargets: ["worker-audit-narrator", "worker-risk"],
    defaultExecutionMode: "execute",
  },
  "worker-audit-narrator": {
    id: "worker-audit-narrator",
    name: "Audit Narrator",
    role: "audit-narration",
    roleLabel: "Audit Narration",
    responsibility:
      "Builds operator-facing run narratives and receipt-ready summaries from the recorded worker timeline.",
    stageOwnership: {
      primaryStages: ["audit-narration"],
      supportingStages: ["approval-routing", "controlled-execution"],
    },
    handoffTargets: ["worker-risk", "worker-approval-coordinator"],
    defaultExecutionMode: "shadow",
  },
};

export const workerRegistryList: WorkerDefinition[] = workerIds.map((workerId) => workerRegistry[workerId]);

export function getWorkerDefinition(workerId: WorkerId) {
  return workerRegistry[workerId];
}

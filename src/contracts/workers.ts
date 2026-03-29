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

export const workerCapabilityScopes = [
  "intake",
  "document",
  "vendor",
  "matching",
  "policy",
  "risk",
  "approval",
  "execution",
  "audit",
] as const;

export type WorkerCapabilityScope = (typeof workerCapabilityScopes)[number];

export type WorkerCapabilityPlaceholder = {
  key: string;
  label: string;
  summary: string;
  scope: WorkerCapabilityScope;
  status: "placeholder";
};

export const workerPostures = [
  "stable",
  "watching",
  "escalated",
  "coordinating",
  "ready",
  "narrating",
] as const;

export type WorkerPosture = (typeof workerPostures)[number];

export type WorkerOperationalSummary = {
  posture: WorkerPosture;
  queueDepth: number;
  activeRunCount: number;
  loadPercent: number;
  headline: string;
};

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
  capabilities: WorkerCapabilityPlaceholder[];
};

function capability(
  key: string,
  label: string,
  summary: string,
  scope: WorkerCapabilityScope,
): WorkerCapabilityPlaceholder {
  return {
    key,
    label,
    summary,
    scope,
    status: "placeholder",
  };
}

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
    capabilities: [
      capability(
        "normalize-packet",
        "Normalize packet",
        "Parse inbound invoice, attachment, and sender context into a deterministic run packet.",
        "intake",
      ),
      capability(
        "artifact-provenance",
        "Artifact provenance capture",
        "Attach source and receipt metadata so downstream reviewers can trust packet origin.",
        "intake",
      ),
      capability(
        "incomplete-routing",
        "Incomplete packet routing",
        "Route partial packets into document or vendor review lanes without losing context.",
        "intake",
      ),
    ],
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
    capabilities: [
      capability(
        "field-validation",
        "Structured field validation",
        "Confirm extracted document fields and key totals before matching or policy checks.",
        "document",
      ),
      capability(
        "evidence-linkage",
        "Evidence linkage",
        "Maintain traceable links between extracted values and source artifacts.",
        "document",
      ),
      capability(
        "document-gap-detection",
        "Document gap detection",
        "Identify missing support docs that should pause progression before execution lanes.",
        "document",
      ),
    ],
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
    capabilities: [
      capability(
        "vendor-identity-resolution",
        "Vendor identity resolution",
        "Map submitted vendor details to a trusted master-data profile or mark as unresolved.",
        "vendor",
      ),
      capability(
        "remittance-drift-check",
        "Remittance drift check",
        "Compare destination bank and beneficiary details against recent settled history.",
        "vendor",
      ),
      capability(
        "onboarding-posture-check",
        "Onboarding posture check",
        "Verify vendor onboarding status before payment-sensitive paths continue.",
        "vendor",
      ),
    ],
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
    capabilities: [
      capability(
        "three-way-match",
        "Three-way match",
        "Compare invoice, PO, and receiving artifacts for quantity and amount consistency.",
        "matching",
      ),
      capability(
        "variance-quantification",
        "Variance quantification",
        "Calculate mismatch percentage and amount delta for risk and approval context.",
        "matching",
      ),
      capability(
        "receiving-proof-check",
        "Receiving proof check",
        "Confirm goods receipt or completion evidence before controlled release.",
        "matching",
      ),
    ],
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
    capabilities: [
      capability(
        "policy-scope-resolution",
        "Policy scope resolution",
        "Determine which policy bundles apply to the current step and action lane.",
        "policy",
      ),
      capability(
        "decision-path-marking",
        "Decision path marking",
        "Mark the step outcome path as allow, escalate, or block with explicit rationale hooks.",
        "policy",
      ),
      capability(
        "control-reference-packing",
        "Control reference packing",
        "Attach policy references so approvals and replay can cite concrete controls.",
        "policy",
      ),
    ],
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
    capabilities: [
      capability(
        "risk-factor-evaluation",
        "Risk factor evaluation",
        "Assess severity from mismatches, vendor drift, and missing evidence indicators.",
        "risk",
      ),
      capability(
        "exception-framing",
        "Exception framing",
        "Produce reviewer-legible exception summaries tied to affected records and artifacts.",
        "risk",
      ),
      capability(
        "containment-routing",
        "Containment routing",
        "Route risky actions into approval or block lanes before execution can proceed.",
        "risk",
      ),
    ],
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
    capabilities: [
      capability(
        "approval-packet-assembly",
        "Approval packet assembly",
        "Package the action request, evidence bundle, and risk context for named reviewers.",
        "approval",
      ),
      capability(
        "review-ownership-tracking",
        "Review ownership tracking",
        "Track assignee and queue posture so pending gates remain visible in operations.",
        "approval",
      ),
      capability(
        "resume-path-coordination",
        "Resume path coordination",
        "Apply decision outcomes and hand off safely into execute or re-triage lanes.",
        "approval",
      ),
    ],
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
    capabilities: [
      capability(
        "controlled-posting",
        "Controlled posting",
        "Execute approved downstream system actions in the supervised execute lane.",
        "execution",
      ),
      capability(
        "release-gate-check",
        "Release gate check",
        "Verify approvals, policy refs, and artifacts are satisfied before action release.",
        "execution",
      ),
      capability(
        "execution-receipt-capture",
        "Execution receipt capture",
        "Attach output references required by replay and audit surfaces after completion.",
        "execution",
      ),
    ],
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
    capabilities: [
      capability(
        "timeline-narration",
        "Timeline narration",
        "Convert raw worker events into operator-legible timeline moments.",
        "audit",
      ),
      capability(
        "receipt-synthesis",
        "Receipt synthesis",
        "Build receipt-level summaries that preserve worker decisions and control references.",
        "audit",
      ),
      capability(
        "replay-framing",
        "Replay framing",
        "Prepare concise replay frame text so post-run inspection remains high signal.",
        "audit",
      ),
    ],
  },
};

export const workerRegistryList: WorkerDefinition[] = workerIds.map((workerId) => workerRegistry[workerId]);

export const workerOperationalSummaryDefaults: Record<WorkerId, WorkerOperationalSummary> = {
  "worker-intake": {
    posture: "stable",
    queueDepth: 0,
    activeRunCount: 0,
    loadPercent: 0,
    headline: "No queued intake packets.",
  },
  "worker-document-review": {
    posture: "stable",
    queueDepth: 0,
    activeRunCount: 0,
    loadPercent: 0,
    headline: "No active document validation runs.",
  },
  "worker-vendor-review": {
    posture: "watching",
    queueDepth: 0,
    activeRunCount: 0,
    loadPercent: 0,
    headline: "No unresolved vendor checks.",
  },
  "worker-po-match": {
    posture: "stable",
    queueDepth: 0,
    activeRunCount: 0,
    loadPercent: 0,
    headline: "No pending PO variance reviews.",
  },
  "worker-policy-review": {
    posture: "watching",
    queueDepth: 0,
    activeRunCount: 0,
    loadPercent: 0,
    headline: "No policy checkpoints in queue.",
  },
  "worker-risk": {
    posture: "watching",
    queueDepth: 0,
    activeRunCount: 0,
    loadPercent: 0,
    headline: "No escalated risk items.",
  },
  "worker-approval-coordinator": {
    posture: "coordinating",
    queueDepth: 0,
    activeRunCount: 0,
    loadPercent: 0,
    headline: "No pending approvals are currently held.",
  },
  "worker-execution": {
    posture: "ready",
    queueDepth: 0,
    activeRunCount: 0,
    loadPercent: 0,
    headline: "No execute-lane packets are staged.",
  },
  "worker-audit-narrator": {
    posture: "narrating",
    queueDepth: 0,
    activeRunCount: 0,
    loadPercent: 0,
    headline: "No replay summary drafting in progress.",
  },
};

export function getWorkerDefinition(workerId: WorkerId) {
  return workerRegistry[workerId];
}

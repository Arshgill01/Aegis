export const workerRoles = [
  "intake",
  "document-review",
  "vendor-review",
  "policy-review",
  "risk-review",
  "approval-coordination",
  "execution",
] as const;

export type WorkerRole = (typeof workerRoles)[number];

export const workerIds = [
  "intake-worker",
  "document-review-worker",
  "vendor-review-worker",
  "policy-review-worker",
  "risk-worker",
  "approval-coordinator",
  "execution-worker",
] as const;

export type WorkerId = (typeof workerIds)[number];

export interface AgentWorker {
  id: WorkerId;
  name: string;
  role: WorkerRole;
  summary: string;
  responsibilities: string[];
  escalationTargets?: WorkerId[];
}

export const agentWorkers: Record<WorkerId, AgentWorker> = {
  "intake-worker": {
    id: "intake-worker",
    name: "Intake Worker",
    role: "intake",
    summary: "Receives inbound workflow artifacts and assembles the initial supervised case.",
    responsibilities: [
      "Normalize submitted documents",
      "Open workflow runs with the right scenario context",
      "Route incomplete packets into the correct review lane",
    ],
    escalationTargets: ["document-review-worker", "risk-worker"],
  },
  "document-review-worker": {
    id: "document-review-worker",
    name: "Document Review Worker",
    role: "document-review",
    summary: "Checks extracted document fields and confirms the evidence bundle is usable.",
    responsibilities: [
      "Validate document completeness",
      "Summarize invoice and attachment findings",
      "Flag missing or conflicting supporting evidence",
    ],
    escalationTargets: ["policy-review-worker", "risk-worker"],
  },
  "vendor-review-worker": {
    id: "vendor-review-worker",
    name: "Vendor Review Worker",
    role: "vendor-review",
    summary: "Verifies vendor trust posture, remittance details, and onboarding state.",
    responsibilities: [
      "Cross-check vendor identity",
      "Review remittance detail changes",
      "Surface supplier trust exceptions before execution",
    ],
    escalationTargets: ["risk-worker", "approval-coordinator"],
  },
  "policy-review-worker": {
    id: "policy-review-worker",
    name: "Policy Review Worker",
    role: "policy-review",
    summary: "Maps planned actions against the applicable control and permissions posture.",
    responsibilities: [
      "Evaluate policy-sensitive actions",
      "Attach rule context to supervised steps",
      "Recommend allow, escalate, or block posture",
    ],
    escalationTargets: ["risk-worker", "approval-coordinator"],
  },
  "risk-worker": {
    id: "risk-worker",
    name: "Risk Worker",
    role: "risk-review",
    summary: "Assesses mismatch, fraud, and exception signals before sensitive work proceeds.",
    responsibilities: [
      "Assess operational risk factors",
      "Bundle evidence for reviewers",
      "Hold or reroute risky actions",
    ],
    escalationTargets: ["approval-coordinator", "execution-worker"],
  },
  "approval-coordinator": {
    id: "approval-coordinator",
    name: "Approval Coordinator",
    role: "approval-coordination",
    summary: "Packages human approval context and manages the handoff back into controlled work.",
    responsibilities: [
      "Open human approval gates",
      "Track reviewer ownership and due windows",
      "Resume or stop runs after a decision",
    ],
    escalationTargets: ["execution-worker"],
  },
  "execution-worker": {
    id: "execution-worker",
    name: "Execution Worker",
    role: "execution",
    summary: "Performs controlled downstream actions once the run is cleared to execute.",
    responsibilities: [
      "Carry out approved system actions",
      "Record execution-ready outputs",
      "Close the run with a receipt-ready outcome",
    ],
  },
};

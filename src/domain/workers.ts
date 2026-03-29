export const workerRoles = [
  "intake",
  "vendor-review",
  "po-match",
  "risk-review",
  "approval-coordination",
  "execution",
] as const;

export type WorkerRole = (typeof workerRoles)[number];

export const workerIds = [
  "worker-intake",
  "worker-vendor-review",
  "worker-po-match",
  "worker-risk",
  "worker-approval-coordinator",
  "worker-execution",
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
  "worker-intake": {
    id: "worker-intake",
    name: "Intake Worker",
    role: "intake",
    summary:
      "Receives inbound workflow artifacts, normalizes the packet, and opens the first supervised workflow lane.",
    responsibilities: [
      "Normalize submitted documents",
      "Open workflow runs with deterministic scenario context",
      "Route incomplete packets into the correct review lane",
    ],
    escalationTargets: ["worker-vendor-review", "worker-po-match"],
  },
  "worker-vendor-review": {
    id: "worker-vendor-review",
    name: "Vendor Review Worker",
    role: "vendor-review",
    summary:
      "Verifies vendor trust posture, onboarding state, and remittance drift before payment-sensitive work can continue.",
    responsibilities: [
      "Cross-check vendor identity against master data",
      "Review remittance detail changes",
      "Surface supplier trust exceptions before execution",
    ],
    escalationTargets: ["worker-risk", "worker-approval-coordinator"],
  },
  "worker-po-match": {
    id: "worker-po-match",
    name: "PO Match Worker",
    role: "po-match",
    summary:
      "Performs three-way matching, quantifies invoice variance, and keeps amount drift visible before posting or payment.",
    responsibilities: [
      "Compare invoice packets to approved purchase orders",
      "Review receiving or completion evidence",
      "Hold mismatched packets before execution",
    ],
    escalationTargets: ["worker-risk", "worker-execution"],
  },
  "worker-risk": {
    id: "worker-risk",
    name: "Risk Worker",
    role: "risk-review",
    summary:
      "Assesses exception severity, packages evidence, and recommends the correct containment or escalation path.",
    responsibilities: [
      "Assess operational risk factors",
      "Bundle evidence for reviewers",
      "Hold or reroute risky actions",
    ],
    escalationTargets: ["worker-approval-coordinator", "worker-execution"],
  },
  "worker-approval-coordinator": {
    id: "worker-approval-coordinator",
    name: "Approval Coordinator",
    role: "approval-coordination",
    summary:
      "Packages human approval context and manages the handoff back into controlled execution when review is complete.",
    responsibilities: [
      "Open human approval gates",
      "Track reviewer ownership and due windows",
      "Resume or stop runs after a decision",
    ],
    escalationTargets: ["worker-execution", "worker-risk"],
  },
  "worker-execution": {
    id: "worker-execution",
    name: "Execution Worker",
    role: "execution",
    summary:
      "Performs controlled downstream actions once the run is explicitly cleared to execute.",
    responsibilities: [
      "Carry out approved system actions",
      "Record execution-ready outputs",
      "Close the run with a receipt-ready outcome",
    ],
    escalationTargets: ["worker-risk"],
  },
};

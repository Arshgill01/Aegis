import type { AgentWorker } from "../contracts";

export const seededWorkers: AgentWorker[] = [
  {
    id: "intake-worker",
    name: "Intake Worker",
    role: "intake",
    lane: "Intake lane",
    description: "Normalizes inbound artifacts and assembles the initial supervised run context.",
    defaultExecutionMode: "shadow",
    capabilities: ["document capture", "artifact normalization", "case assembly"],
  },
  {
    id: "document-review-worker",
    name: "Document Review Worker",
    role: "document_review",
    lane: "Review lane",
    description: "Checks document completeness, extracts structured fields, and keeps evidence attached.",
    defaultExecutionMode: "shadow",
    capabilities: ["invoice extraction", "document validation", "evidence bundling"],
  },
  {
    id: "vendor-review-worker",
    name: "Vendor Review Worker",
    role: "vendor_review",
    lane: "Vendor lane",
    description: "Validates supplier posture, profile changes, and remittance history before release steps continue.",
    defaultExecutionMode: "shadow",
    capabilities: ["vendor profile review", "bank detail comparison", "supplier evidence review"],
  },
  {
    id: "risk-worker",
    name: "Risk Worker",
    role: "risk",
    lane: "Control lane",
    description: "Flags mismatches, tolerance breaches, and exception paths that need supervised handling.",
    defaultExecutionMode: "shadow",
    capabilities: ["risk review", "mismatch analysis", "exception triage"],
  },
  {
    id: "approval-coordinator",
    name: "Approval Coordinator",
    role: "approval",
    lane: "Human gate lane",
    description: "Packages risky actions into named human gates and holds the run in a visible waiting state.",
    defaultExecutionMode: "shadow",
    capabilities: ["approval packaging", "escalation routing", "decision tracking"],
  },
  {
    id: "execution-worker",
    name: "Execution Worker",
    role: "execution",
    lane: "Execution lane",
    description: "Owns controlled live actions after supervised review has cleared the path.",
    defaultExecutionMode: "execute",
    capabilities: ["controlled posting", "payment release staging", "completion capture"],
  },
  {
    id: "audit-narrator",
    name: "Audit Narrator",
    role: "audit",
    lane: "Evidence lane",
    description: "Packages the simulated run history into replay-friendly receipts and narrative summaries.",
    defaultExecutionMode: "shadow",
    capabilities: ["event narration", "receipt summary", "replay framing"],
  },
];

export const seededWorkerRegistry = Object.fromEntries(
  seededWorkers.map((worker) => [worker.id, worker]),
) as Record<string, AgentWorker>;

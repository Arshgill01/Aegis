import type { StatusTone } from "../../components/ui/StatusBadge";

export type SummaryCardItem = {
  label: string;
  value: string;
  detail: string;
  badge: string;
  tone: StatusTone;
};

export type RunLane = {
  id: string;
  workflow: string;
  company: string;
  stage: string;
  mode: "Shadow" | "Execute-ready";
  owner: string;
  risk: "Low" | "Medium" | "High";
  nextAction: string;
  eta: string;
};

export type ApprovalPreview = {
  id: string;
  title: string;
  runId: string;
  reason: string;
  owner: string;
  dueBy: string;
  riskLabel: string;
  tone: StatusTone;
};

export type ActivityEvent = {
  time: string;
  title: string;
  detail: string;
  actor: string;
  category: string;
  tone: StatusTone;
};

export type FlaggedItem = {
  title: string;
  runId: string;
  severity: string;
  summary: string;
  nextAction: string;
  tone: StatusTone;
};

export type WorkerLane = {
  name: string;
  role: string;
  queue: string;
  focus: string;
  posture: string;
  load: string;
  tone: StatusTone;
};

export type ScenarioSpotlight = {
  title: string;
  phase: string;
  narrative: string;
  watchpoints: string[];
};

export const missionControlSeed = {
  summaryCards: [
    {
      label: "Active workflows",
      value: "14",
      detail: "11 runs are shadowing live work while 3 are cleared for controlled execution.",
      badge: "Live",
      tone: "info",
    },
    {
      label: "Human gates",
      value: "3",
      detail: "Two payment releases and one vendor exception are waiting on named approvers.",
      badge: "Queued",
      tone: "warning",
    },
    {
      label: "Flagged exceptions",
      value: "2",
      detail: "One three-way mismatch and one bank-detail drift case need immediate review.",
      badge: "Attention",
      tone: "danger",
    },
    {
      label: "Audit capture",
      value: "100%",
      detail: "Every surfaced run retains an evidence trail and receipt placeholder for replay.",
      badge: "Retained",
      tone: "success",
    },
  ] satisfies SummaryCardItem[],
  postureSignals: [
    {
      label: "Protected payment value",
      value: "$482K",
      detail: "",
      badge: "Guarded",
      tone: "warning",
    },
    {
      label: "Runs under review",
      value: "5",
      detail: "",
      badge: "Escalated",
      tone: "info",
    },
    {
      label: "Blocked tool actions",
      value: "2",
      detail: "",
      badge: "Contained",
      tone: "danger",
    },
  ] satisfies SummaryCardItem[],
  activeRuns: [
    {
      id: "FIN-4471",
      workflow: "Northwind invoice reconciliation",
      company: "Northwind Distribution",
      stage: "Awaiting controller sign-off on payment release",
      mode: "Shadow",
      owner: "Approval Coordinator",
      risk: "High",
      nextAction: "Escalate payment release with mismatch evidence bundle",
      eta: "6 min",
    },
    {
      id: "FIN-4468",
      workflow: "Aperture vendor onboarding check",
      company: "Aperture Logistics",
      stage: "Vendor bank detail revision under cross-check",
      mode: "Shadow",
      owner: "Vendor Review Worker",
      risk: "Medium",
      nextAction: "Confirm account update against historic remittance profile",
      eta: "11 min",
    },
    {
      id: "FIN-4464",
      workflow: "Helios monthly media invoice",
      company: "Helios Retail Group",
      stage: "PO match cleared and posting draft prepared",
      mode: "Execute-ready",
      owner: "Execution Worker",
      risk: "Low",
      nextAction: "Open controlled ERP posting window for review",
      eta: "3 min",
    },
    {
      id: "OPS-1182",
      workflow: "Freight accrual exception triage",
      company: "Beacon Freight Services",
      stage: "Mismatch analysis waiting on receiving evidence",
      mode: "Shadow",
      owner: "Risk Worker",
      risk: "Medium",
      nextAction: "Request dock receipt artifact before variance recommendation",
      eta: "14 min",
    },
  ] satisfies RunLane[],
  approvals: [
    {
      id: "APR-203",
      title: "Authorize Northwind payment release",
      runId: "FIN-4471",
      reason: "Invoice total exceeds PO by 7.8% and the worker paused before ERP posting.",
      owner: "AP Controller · Priya Shah",
      dueBy: "Due in 18 min",
      riskLabel: "Mismatch hold",
      tone: "danger",
    },
    {
      id: "APR-204",
      title: "Approve vendor bank-detail change",
      runId: "FIN-4468",
      reason: "Supplier requested an account swap inside the same billing cycle.",
      owner: "Vendor Risk Lead · Marcus Hale",
      dueBy: "Due in 42 min",
      riskLabel: "Account drift",
      tone: "warning",
    },
    {
      id: "APR-205",
      title: "Release freight accrual exception path",
      runId: "OPS-1182",
      reason: "Receiving evidence is incomplete, so the run is holding for manual tolerance approval.",
      owner: "Operations Finance · Elena Ruiz",
      dueBy: "Due in 55 min",
      riskLabel: "Tolerance override",
      tone: "warning",
    },
  ] satisfies ApprovalPreview[],
  activity: [
    {
      time: "09:41",
      title: "Approval Coordinator paused payment release",
      detail: "Northwind payment release halted after the worker attached a three-way mismatch receipt.",
      actor: "Approval Coordinator",
      category: "Escalation",
      tone: "danger",
    },
    {
      time: "09:36",
      title: "Risk Worker attached vendor drift evidence",
      detail: "Historical remittance patterns were bundled before the account-change approval request opened.",
      actor: "Risk Worker",
      category: "Evidence",
      tone: "warning",
    },
    {
      time: "09:28",
      title: "Execution Worker cleared Helios posting draft",
      detail: "PO match and invoice metadata aligned, so the posting package moved into execute-ready state.",
      actor: "Execution Worker",
      category: "Advance",
      tone: "success",
    },
    {
      time: "09:22",
      title: "Intake Worker routed freight accrual exception",
      detail: "Missing receiving proof triggered a handoff into the risk lane instead of automatic posting.",
      actor: "Intake Worker",
      category: "Handoff",
      tone: "info",
    },
  ] satisfies ActivityEvent[],
  flaggedItems: [
    {
      title: "Northwind amount variance above tolerance",
      runId: "FIN-4471",
      severity: "High severity",
      summary: "Invoice total exceeds the matched purchase order and the worker correctly refused execution.",
      nextAction: "Controller review required",
      tone: "danger",
    },
    {
      title: "Aperture remittance profile changed mid-cycle",
      runId: "FIN-4468",
      severity: "Medium severity",
      summary: "Bank details shifted before the prior invoice batch fully settled, so vendor validation remains shadow-only.",
      nextAction: "Risk lead validation required",
      tone: "warning",
    },
  ] satisfies FlaggedItem[],
  workers: [
    {
      name: "Intake Worker",
      role: "Document intake and case assembly",
      queue: "4 queued",
      focus: "Normalizing inbound invoice packets and assigning them into workflow lanes.",
      posture: "Stable",
      load: "72%",
      tone: "success",
    },
    {
      name: "Vendor Review Worker",
      role: "Vendor identity and remittance verification",
      queue: "2 queued",
      focus: "Cross-checking bank detail updates before any payment release can resume.",
      posture: "Watching",
      load: "64%",
      tone: "warning",
    },
    {
      name: "Risk Worker",
      role: "Exception scoring and evidence capture",
      queue: "3 queued",
      focus: "Building explainable mismatch packets for controller review.",
      posture: "Escalated",
      load: "88%",
      tone: "danger",
    },
    {
      name: "Execution Worker",
      role: "Controlled ERP posting preparation",
      queue: "1 queued",
      focus: "Holding execute-ready runs until the queue clears or human approval resumes them.",
      posture: "Ready",
      load: "39%",
      tone: "info",
    },
  ] satisfies WorkerLane[],
  spotlight: {
    title: "Three-way mismatch hold",
    phase: "Seeded scenario",
    narrative:
      "The current demo anchor shows a payment release moving smoothly until invoice and PO totals diverge. The worker pauses, surfaces evidence, routes a human gate, and keeps the execution path visible.",
    watchpoints: [
      "Mismatch evidence is visible before any manual approval is taken.",
      "The risky step is contained without making the rest of the workflow disappear.",
      "A reviewer can understand what resumes next once approval is granted.",
    ],
  } satisfies ScenarioSpotlight,
};

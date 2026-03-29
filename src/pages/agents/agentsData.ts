export type AgentSurfaceTone = "neutral" | "attention" | "positive";

export type AgentSummaryCard = {
  label: string;
  value: string;
  tone?: AgentSurfaceTone;
};

export type AgentSignal = {
  label: string;
  detail: string;
  emphasis?: string;
};

export type WorkerLaneSummary = {
  id: string;
  name: string;
  role: string;
  focus: string;
  posture: string;
  queueDepth: number;
  loadPercent: number;
  ownedRuns: number;
  inFlightSteps: number;
  blockedSteps: number;
  executeReadySteps: number;
  latestActivity?: string;
  tone: AgentSurfaceTone;
};

export type WorkerAssignmentSummary = {
  runId: string;
  workflow: string;
  accountName: string;
  owner: string;
  stage: string;
  nextAction: string;
  mode: "Shadow" | "Execute-ready";
  risk: "Low" | "Medium" | "High";
  handoffCount: number;
  supportLane: string;
  gateLabel: string;
  tone: AgentSurfaceTone;
};

export type WorkerHandoffSummary = {
  id: string;
  runId: string;
  accountName: string;
  fromWorker: string;
  toWorker: string;
  stepTitle: string;
  mode: "Shadow" | "Execute-ready";
  risk: "Low" | "Medium" | "High";
  tone: AgentSurfaceTone;
};

export type WorkerActivitySummary = {
  id: string;
  title: string;
  detail: string;
  actor: string;
  runLabel: string;
  time: string;
  tone: AgentSurfaceTone;
};

export type AgentsPageData = {
  eyebrow: string;
  title: string;
  description: string;
  summaryCards: AgentSummaryCard[];
  signals: AgentSignal[];
  workerLanes: WorkerLaneSummary[];
  assignments: WorkerAssignmentSummary[];
  handoffs: WorkerHandoffSummary[];
  recentActivity: WorkerActivitySummary[];
};

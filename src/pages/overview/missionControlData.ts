export type MissionTone = "neutral" | "attention" | "positive";

export type SummaryCardItem = {
  label: string;
  value: string;
  detail: string;
  badge: string;
  tone: MissionTone;
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
  tone: MissionTone;
};

export type ActivityEvent = {
  time: string;
  title: string;
  detail: string;
  actor: string;
  category: string;
  tone: MissionTone;
};

export type FlaggedItem = {
  title: string;
  runId: string;
  severity: string;
  summary: string;
  nextAction: string;
  tone: MissionTone;
};

export type WorkerLane = {
  name: string;
  role: string;
  queue: string;
  focus: string;
  posture: string;
  load: string;
  tone: MissionTone;
};

export type ScenarioSpotlight = {
  title: string;
  phase: string;
  narrative: string;
  watchpoints: string[];
};

export type MissionControlPageData = {
  summaryCards: SummaryCardItem[];
  postureSignals: SummaryCardItem[];
  activeRuns: RunLane[];
  approvals: ApprovalPreview[];
  activity: ActivityEvent[];
  flaggedItems: FlaggedItem[];
  workers: WorkerLane[];
  spotlight: ScenarioSpotlight;
};

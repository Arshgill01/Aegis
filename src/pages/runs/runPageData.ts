export type RunsPageData = {
  eyebrow: string;
  title: string;
  description: string;
  summaryCards: {
    label: string;
    value: string;
    tone?: "neutral" | "attention" | "positive";
  }[];
  signals: {
    label: string;
    detail: string;
    emphasis?: string;
  }[];
  runQueue: RunQueueItem[];
  spotlight: SpotlightRun;
  stepGroups: StepGroup[];
  timeline: TimelineItem[];
  executionMode: ExecutionModePanel;
  footerNote: string;
};

export type RunQueueItem = {
  id: string;
  workflow: string;
  accountName: string;
  currentStage: string;
  nextAction: string;
  statusLabel: string;
  riskLabel: string;
  modeLabel: "Shadow" | "Execute-ready";
  ownerName: string;
  ownerRole: string;
  etaLabel: string;
  completedSteps: number;
  totalSteps: number;
};

export type SpotlightRun = {
  id: string;
  workflow: string;
  accountName: string;
  statusLabel: string;
  riskLabel: string;
  modeLabel: "Shadow" | "Execute-ready";
  currentStage: string;
  nextAction: string;
  ownerName: string;
  ownerRole: string;
  ownerPosture: string;
  completionLabel: string;
  activeStepTitle: string;
  handoffs: {
    fromWorkerName: string;
    toWorkerName: string;
    stepTitle: string;
  }[];
  shadowStepCount: number;
  executeReadyStepCount: number;
  watchpoints: string[];
};

export type StepGroup = {
  key: "completed" | "in_flight" | "gated" | "queued";
  label: string;
  detail: string;
  items: StepItem[];
};

export type StepItem = {
  id: string;
  title: string;
  summary: string;
  statusLabel: string;
  modeLabel: "Shadow" | "Execute-ready";
  workerName: string;
  workerRole: string;
  handoffFrom?: string;
};

export type TimelineItem = {
  id: string;
  lane: "event" | "handoff";
  timeLabel: string;
  title: string;
  detail: string;
  actorName: string;
  category: string;
  modeLabel: "Shadow" | "Execute-ready";
  tone: "neutral" | "attention" | "positive";
};

export type ExecutionModePanel = {
  runModeLabel: "Shadow" | "Execute-ready";
  shadowRunCount: number;
  executeReadyRunCount: number;
  shadowStepCount: number;
  executeReadyStepCount: number;
  nextExecuteWorker: string;
};

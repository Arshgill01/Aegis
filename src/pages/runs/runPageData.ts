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
  workerName: string;
  workerRole: string;
  handoffFrom?: string;
};

import type { ReactNode } from "react";

import { MissionControlPage } from "../pages/MissionControlPage";
import {
  AgentsPage,
  ApprovalsPage,
  FinOpsWorkflowPage,
  PoliciesPage,
  ReplayAuditPage,
  RunsTasksPage,
  SettingsDemoControlsPage,
} from "../pages/RoutePlaceholders";

type NavItem = {
  label: string;
  description: string;
  path: string;
  shortLabel: string;
};

type NavSection = {
  title: string;
  items: NavItem[];
};

export type AppRoute = NavItem & {
  element: ReactNode;
};

export const navigationSections: NavSection[] = [
  {
    title: "Control Surface",
    items: [
      {
        label: "Mission Control",
        shortLabel: "Overview",
        description: "Operational overview for supervised AI worker workflows.",
        path: "/",
      },
      {
        label: "Agents",
        shortLabel: "Agents",
        description: "Worker roles, assignments, and runtime posture.",
        path: "/agents",
      },
      {
        label: "Runs",
        shortLabel: "Runs",
        description: "Workflow lanes, handoffs, and execution visibility.",
        path: "/runs",
      },
    ],
  },
  {
    title: "Controls",
    items: [
      {
        label: "Approvals",
        shortLabel: "Approvals",
        description: "Human gates, escalations, and intervention queues.",
        path: "/approvals",
      },
      {
        label: "Replay & Audit",
        shortLabel: "Replay",
        description: "Receipts, evidence, and inspectable execution history.",
        path: "/replay",
      },
      {
        label: "Policies",
        shortLabel: "Policies",
        description: "Rule posture, guardrails, and control thresholds.",
        path: "/policies",
      },
    ],
  },
  {
    title: "Showcase",
    items: [
      {
        label: "FinOps Workflow",
        shortLabel: "FinOps",
        description: "High-stakes back-office showcase for the first domain.",
        path: "/finops",
      },
      {
        label: "Settings & Demo Controls",
        shortLabel: "Settings",
        description: "Scenario launchers, environment posture, and demo toggles.",
        path: "/settings",
      },
    ],
  },
];

export const appRoutes: AppRoute[] = [
  {
    ...navigationSections[0].items[0],
    element: <MissionControlPage />,
  },
  {
    ...navigationSections[0].items[1],
    element: <AgentsPage />,
  },
  {
    ...navigationSections[0].items[2],
    element: <RunsTasksPage />,
  },
  {
    ...navigationSections[1].items[0],
    element: <ApprovalsPage />,
  },
  {
    ...navigationSections[1].items[1],
    element: <ReplayAuditPage />,
  },
  {
    ...navigationSections[1].items[2],
    element: <PoliciesPage />,
  },
  {
    ...navigationSections[2].items[0],
    element: <FinOpsWorkflowPage />,
  },
  {
    ...navigationSections[2].items[1],
    element: <SettingsDemoControlsPage />,
  },
];

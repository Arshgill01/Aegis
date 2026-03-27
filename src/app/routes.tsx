import type { ReactNode } from "react";

import { AgentsPage } from "../pages/AgentsPage";
import { ApprovalsPage } from "../pages/ApprovalsPage";
import { FinOpsWorkflowPage } from "../pages/FinOpsWorkflowPage";
import { MissionControlPage } from "../pages/MissionControlPage";
import { PoliciesPage } from "../pages/PoliciesPage";
import { ReplayAuditPage } from "../pages/ReplayAuditPage";
import { RunsTasksPage } from "../pages/RunsTasksPage";
import { SettingsDemoControlsPage } from "../pages/SettingsDemoControlsPage";

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
        description: "Operational summary for AI worker activity and system posture.",
        path: "/",
      },
      {
        label: "Agents",
        shortLabel: "Agents",
        description: "Worker roles, current assignments, and runtime posture.",
        path: "/agents",
      },
      {
        label: "Runs",
        shortLabel: "Runs",
        description: "Workflow execution lanes, tasks, and handoff visibility.",
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
        description: "Pending interventions, authorizations, and escalations.",
        path: "/approvals",
      },
      {
        label: "Replay & Audit",
        shortLabel: "Replay",
        description: "Execution history, evidence trails, and receipts.",
        path: "/replay",
      },
      {
        label: "Policies",
        shortLabel: "Policies",
        description: "Rules, guardrails, and risk posture configuration surfaces.",
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
        description: "High-stakes back-office workflow surface for the first domain.",
        path: "/finops",
      },
      {
        label: "Settings & Demo Controls",
        shortLabel: "Settings",
        description: "Environment posture, scenarios, and demo-safe controls.",
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

import type { ReactNode } from "react";

import { RoutePlaceholderPage } from "../pages/RoutePlaceholderPage";

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
    element: (
      <RoutePlaceholderPage
        title="Mission Control"
        category="Operational center"
        summary="Stable overview route for active AI work, system posture, and command visibility."
      />
    ),
  },
  {
    ...navigationSections[0].items[1],
    element: (
      <RoutePlaceholderPage
        title="Agents"
        category="Worker surface"
        summary="Dedicated route for worker roles, responsibilities, and runtime posture."
      />
    ),
  },
  {
    ...navigationSections[0].items[2],
    element: (
      <RoutePlaceholderPage
        title="Runs"
        category="Execution surface"
        summary="Stable route for workflow lists, tasks, and handoff visibility."
      />
    ),
  },
  {
    ...navigationSections[1].items[0],
    element: (
      <RoutePlaceholderPage
        title="Approvals"
        category="Human gate"
        summary="Reserved action surface for escalations, review, and controlled execution decisions."
      />
    ),
  },
  {
    ...navigationSections[1].items[1],
    element: (
      <RoutePlaceholderPage
        title="Replay & Audit"
        category="Evidence surface"
        summary="Reserved space for inspectable replay, receipts, and audit evidence."
      />
    ),
  },
  {
    ...navigationSections[1].items[2],
    element: (
      <RoutePlaceholderPage
        title="Policies"
        category="Control surface"
        summary="Stable home for rules, thresholds, and explainable risk posture."
      />
    ),
  },
  {
    ...navigationSections[2].items[0],
    element: (
      <RoutePlaceholderPage
        title="FinOps Workflow"
        category="Showcase domain"
        summary="Entry point for the first back-office workflow domain without locking the platform to finance."
      />
    ),
  },
  {
    ...navigationSections[2].items[1],
    element: (
      <RoutePlaceholderPage
        title="Settings & Demo Controls"
        category="Environment surface"
        summary="Reserved route for demo-safe controls and shell-level environment posture."
      />
    ),
  },
];

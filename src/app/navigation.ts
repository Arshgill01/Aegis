export type NavigationItem = {
  title: string;
  path: string;
  hint: string;
};

export const primaryNavigation: NavigationItem[] = [
  { title: "Overview", path: "/", hint: "Mission Control" },
  { title: "Agents", path: "/agents", hint: "Workers" },
  { title: "Runs", path: "/runs", hint: "Execution" },
  { title: "Approvals", path: "/approvals", hint: "Gates" },
  { title: "Replay", path: "/replay", hint: "Audit" },
  { title: "Policies", path: "/policies", hint: "Controls" },
  { title: "FinOps", path: "/finops", hint: "Scenario" },
  { title: "Settings", path: "/settings", hint: "Demo" },
];

import { createBrowserRouter } from "react-router-dom";

import { AppShell } from "../components/shell/AppShell";
import { ApprovalDetailPage } from "../pages/ApprovalDetailPage";
import { NotFoundPage } from "../pages/NotFoundPage";
import { RunDetailPage } from "../pages/RunDetailPage";
import { appRoutes } from "./routes";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    children: appRoutes.map((route) => ({
      index: route.path === "/",
      path: route.path === "/" ? undefined : route.path.slice(1),
      element: route.element,
    })).concat([
      {
        index: false,
        path: "runs/:runId",
        element: <RunDetailPage />,
      },
      {
        index: false,
        path: "approvals/:approvalId",
        element: <ApprovalDetailPage />,
      },
    ]),
    errorElement: <NotFoundPage />,
  },
]);

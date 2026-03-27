import { createBrowserRouter } from "react-router-dom";

import { AppShell } from "../components/shell/AppShell";
import { NotFoundPage } from "../pages/NotFoundPage";
import { appRoutes } from "./routes";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    children: appRoutes.map((route) => ({
      index: route.path === "/",
      path: route.path === "/" ? undefined : route.path.slice(1),
      element: route.element,
    })),
    errorElement: <NotFoundPage />,
  },
]);

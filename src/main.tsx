import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import LoginPage from "@/pages/loginPage.tsx";
import RegisterPage from "@/pages/registerPage.tsx";
import ForgotPasswordPage from "@/pages/forgotPasswordPage.tsx";
import ResetPassword from "@/pages/resetPassword.tsx";
import DashboardPage from "@/pages/dashboardPage.tsx";
import FocusModePage from "./pages/focusModePage.tsx";

import MyTaskPage from "./pages/myTaskPage.tsx";
import ProjectDashboardPage from "./pages/projectDashboardPage.tsx";
import TaskDetailPage from "./pages/taskDetailPage.tsx";
import VerifyPage from "./pages/verifyPage.tsx";
import ProjectReportPage from "./pages/projectReportPage.tsx";
import ErrorPage from "./pages/errorPage.tsx";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <App />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/login",
      element: <LoginPage />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/register",
      element: <RegisterPage />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/forgot-password",
      element: <ForgotPasswordPage />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/reset-password",
      element: <ResetPassword />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/dashboard",
      element: <DashboardPage />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/my-task",
      element: <MyTaskPage />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/focus-mode",
      element: <FocusModePage />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/project/:id",
      element: <ProjectDashboardPage />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/project/report/:id",
      element: <ProjectReportPage />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/project/task/:id",
      element: <TaskDetailPage />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/verify",
      element: <VerifyPage />,
      errorElement: <ErrorPage />,
    },
  ],
  {
    future: {
      v7_relativeSplatPath: true,
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_skipActionErrorRevalidation: true,
    },
  }
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} future={{ v7_startTransition: true }} />
  </StrictMode>
);

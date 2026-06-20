import { createBrowserRouter } from "react-router-dom";

import { PublicLayout } from "../layouts/PublicLayout";
import { AppLayout } from "../layouts/AppLayout";
import { LandingPage } from "../pages/LandingPage";
import { LoginPage } from "../pages/LoginPage";
import { RegisterPage } from "../pages/RegisterPage";
import { DashboardPage } from "../pages/DashboardPage";
import { FoldersPage } from "../pages/FoldersPage";
import { ProfilePage } from "../pages/ProfilePage";
import { SettingsPage } from "../pages/SettingsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/app",
    element: <AppLayout />,
    children: [
      {
        index: true, // Isso faz o /app renderizar o Dashboard por padrão
        element: <DashboardPage />,
      },
      {
        path: "dashboard", // Acessível via /app/dashboard
        element: <DashboardPage />,
      },
      {
        path: "folders", // Acessível via /app/folders
        element: <FoldersPage />,
      },
      {
        path: "profile", // Acessível via /app/profile
        element: <ProfilePage />,
      },
      {
        path: "settings", // Acessível via /app/settings
        element: <SettingsPage />,
      },
    ],
  },
]);

import { createBrowserRouter } from "react-router-dom";

import { PublicLayout } from "../layouts/PublicLayout";
import { AppLayout } from "../layouts/AppLayout";
import { Button } from "../components/Button";
import { Input } from "../components/Input";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: (
          <>
            <Button>Home</Button>,
            <Input placeholder="Digite seu e-mail" />
          </>
        ),
      },
    ],
  },
  {
    path: "/app",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <h1>DashBoard</h1>,
      },
    ],
  },
]);

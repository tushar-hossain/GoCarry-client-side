import { createBrowserRouter } from "react-router";
import RootLayout from "@/Layouts/RootLayout";
import Home from "@/Pages/LandingPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
    ],
  },
]);

export default router;

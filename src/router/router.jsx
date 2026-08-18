import { createBrowserRouter } from "react-router";
import RootLayout from "@/Layouts/RootLayout";
import Home from "@/Pages/LandingPage";
import AuthLauout from "@/layouts/AuthLayout/AuthLauout";
import Login from "@/Pages/Authentication/Longin";
import Register from "@/Pages/Authentication/Register";
import Coverage from "@/Pages/CoverageDistrict";

const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "coverage",
        Component: Coverage,
        loader: async () => {
          const response = await fetch("/public/warehouses.json");
          const data = await response.json();
          return data;
        },
      },
    ],
  },
  {
    path: "/",
    Component: AuthLauout,
    children: [
      {
        path: "login",
        Component: Login,
      },
      {
        path: "register",
        Component: Register,
      },
    ],
  },
]);

export default router;

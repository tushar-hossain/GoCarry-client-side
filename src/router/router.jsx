import { createBrowserRouter } from "react-router";
import RootLayout from "@/Layouts/RootLayout";
import Home from "@/Pages/LandingPage";
import AuthLauout from "@/layouts/AuthLayout/AuthLauout";
import Login from "@/Pages/Authentication/Longin";
import Register from "@/Pages/Authentication/Register";
import Coverage from "@/Pages/CoverageDistrict";
import PrivateRoutes from "@/routes/PrivateRoute";
import SendParcel from "@/Pages/SendParcel";
import AboutUs from "@/Pages/AboutUs";
import DashboardLayout from "@/layouts/DashboardLayout";
import UserDashboardHome from "@/Pages/Dashboard/UserDashboardHome";
import MyParcel from "@/Pages/Dashboard/MyParcel";
import Payments from "@/Payments";
import ParcelToPay from "@/Pages/Dashboard/ParcelToPay";
import PaymentHistory from "@/Pages/Dashboard/PaymentHistory";
import TrackingPackage from "@/Pages/Dashboard/TrackingPackage";
import ManageParcel from "@/Pages/Dashboard/ManageParcel";
import BeARider from "@/Pages/BeARider";
import ManageUsers from "@/Pages/Admin/ManageUsers";
import AdminRoute from "../routes/AdminRoute";
import RiderRoute from "@/routes/RiderRoute";
import ManageRiders from "@/Pages/Admin/ManageRiders";
import Unauthorized from "@/Pages/Error/Unauthorized";
import ErrorPage from "@/Pages/Error/ErrorPage";
import AssignRider from "@/Pages/Rider/AssignRider";
import PendingDeliveries from "@/Pages/Rider/PendingDeliveries";
import DeliveryManagement from "@/Pages/Admin/DeliveryManagement";
import CompletedDeliveries from "@/Pages/Rider/CompletedDeliveries";
import CashoutHistory from "@/Pages/Admin/CashoutHistory";
import MyEarnings from "@/Pages/Rider/Earnings";
import Settings from "@/Pages/Settings/Settings";
import Notifications from "@/Pages/components/Notifications";
import Pricing from "@/Pages/Pricing";
import Services from "@/Pages/Services";
import Blogs from "@/Pages/Blogs/indes";
import Contact from "@/Pages/Contact";
import FAQS from "@/Pages/FAQ";
import Warehouses from "@/Pages/Admin/Warehouses";

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
      },
      {
        path: "about",
        Component: AboutUs,
      },
      {
        path: "sendParcel",
        element: (
          <PrivateRoutes>
            <SendParcel />
          </PrivateRoutes>
        ),
      },
      {
        path: "rider",
        element: (
          <PrivateRoutes>
            <BeARider />
          </PrivateRoutes>
        ),
      },
      {
        path: "unauthorized",
        Component: Unauthorized,
      },
      {
        path: "notifications",
        Component: Notifications,
      },
      {
        path: "pricing",
        Component: Pricing,
      },
      {
        path: "services",
        Component: Services,
      },
      {
        path: "blog",
        Component: Blogs,
      },
      {
        path: "contact",
        Component: Contact,
      },
      {
        path: "faq",
        Component: FAQS,
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
  {
    path: "/dashboard",
    element: (
      <PrivateRoutes>
        <DashboardLayout />
      </PrivateRoutes>
    ),

    children: [
      {
        index: true,
        Component: UserDashboardHome,
      },
      {
        path: "send-parcel",
        Component: SendParcel,
      },
      {
        path: "myParcel",
        Component: MyParcel,
      },
      {
        path: "payments/:id",
        Component: Payments,
      },

      {
        path: "tracking",
        Component: TrackingPackage,
      },
      {
        path: "parcel-to-pay",
        Component: ParcelToPay,
      },

      {
        path: "manage-parcel",
        Component: ManageParcel,
      },

      {
        path: "payment-history",
        Component: PaymentHistory,
      },
      {
        path: "settings",
        Component: Settings,
      },

      // admin route
      {
        path: "manage-users",
        element: (
          <AdminRoute>
            <ManageUsers />
          </AdminRoute>
        ),
      },
      {
        path: "manage-riders",
        element: (
          <AdminRoute>
            <ManageRiders />
          </AdminRoute>
        ),
      },
      {
        path: "assign-riders",
        element: (
          <AdminRoute>
            <AssignRider />
          </AdminRoute>
        ),
      },
      {
        path: "delivery-management",
        element: (
          <AdminRoute>
            {" "}
            <DeliveryManagement />
          </AdminRoute>
        ),
      },
      {
        path: "cashout-request",
        element: (
          <AdminRoute>
            <CashoutHistory />
          </AdminRoute>
        ),
      },
      {
        path: "warehouses",
        element: (
          <AdminRoute>
            <Warehouses />
          </AdminRoute>
        ),
      },

      // rider route
      {
        path: "my-delivery-tasks",
        element: (
          <RiderRoute>
            <PendingDeliveries />
          </RiderRoute>
        ),
      },
      {
        path: "completed-deliveries",
        element: (
          <RiderRoute>
            <CompletedDeliveries />
          </RiderRoute>
        ),
      },
      {
        path: "my-earnings",
        element: (
          <RiderRoute>
            <MyEarnings />
          </RiderRoute>
        ),
      },
    ],
  },
  {
    path: "*",
    Component: ErrorPage,
  },
]);

export default router;

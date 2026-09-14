import useUserRole from "@/hooks/useUserRol";
import LoadingSpinner from "@/Pages/Shared/Loading";
import UserDashboard from "../UserDashboard";
import RiderDashboard from "@/Pages/Rider/RiderDashboard";
import AdminDashboard from "@/Pages/Admin/AdminDashboard";
import Unauthorized from "@/Pages/Error/Unauthorized";

export default function UserDashboardHome() {
  const { role, roleLoading } = useUserRole();

  if (roleLoading) {
    return <LoadingSpinner />;
  }

  if (role === "user") {
    return <UserDashboard />;
  } else if (role === "rider") {
    return <RiderDashboard />;
  } else if (role === "admin") {
    return <AdminDashboard />;
  } else {
    <Unauthorized />;
  }
}

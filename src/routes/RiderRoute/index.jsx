import { Navigate, useLocation } from "react-router";
import useAuth from "@/hooks/useAuth";
import useUserRole from "@/hooks/useUserRol";
import LoadingSpinner from "@/Pages/Shared/Loading";

export default function RiderRoute({ children }) {
  const { user, loading } = useAuth();
  const { role, roleLoading } = useUserRole();
  const location = useLocation();

  // Auth or role is still loading
  if (loading || roleLoading) {
    return <LoadingSpinner />;
  }

  // User is not logged in
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // User is logged in but is not a rider
  if (role !== "rider") {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

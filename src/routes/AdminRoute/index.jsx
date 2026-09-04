import useAuth from "@/hooks/useAuth";
import useUserRole from "@/hooks/useUserRol";
import LoadingSpinner from "@/Pages/Shared/Loading";
import { Navigate, useLocation } from "react-router";

export default function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  const { role, roleLoading } = useUserRole();
  const location = useLocation();

  if (loading || roleLoading) {
    return <LoadingSpinner />;
  }

  // user is not logged in
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // User is logged in but is not a admin
  if (role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

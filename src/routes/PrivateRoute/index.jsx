import useAuth from "@/hooks/useAuth";
import LoadingSpinner from "@/Pages/Shared/Loading";
import { Navigate, useLocation } from "react-router";

export default function PrivateRoutes({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate state={location?.pathname} to={"/login"} />;
  }

  return children;
}

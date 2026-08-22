import useAuth from "@/hooks/useAuth";
import { Navigate, useLocation } from "react-router";

export default function PrivateRoutes({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#CAEB66] border-t-[#03373D]" />
          <span className="text-sm text-[#03373D]">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate state={location?.pathname} to={"/login"} />;
  }

  return children;
}

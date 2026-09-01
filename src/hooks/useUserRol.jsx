import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";

export default function useUserRole() {
  const { user, loading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: role, isPending } = useQuery({
    queryKey: ["user-role", user?.email],
    enabled: !!user?.email && !loading,

    queryFn: async () => {
      const response = await axiosSecure.get(`/users/${user?.email}`);

      return response?.data?.user?.role;
    },
  });

  return {
    role,
    roleLoading: loading || isPending,
  };
}

import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";
import useAuth from "./useAuth";

const useNotifications = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const {
    data: notifications = [],
    isPending,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["notifications", user?.uid],
    enabled: !!user?.uid,
    queryFn: async () => {
      const response = await axiosSecure.get("/notifications");
      return response.data?.data || [];
    },
  });

  return {
    notifications,
    isPending,
    isError,
    error,
    refetch,
  };
};

export default useNotifications;

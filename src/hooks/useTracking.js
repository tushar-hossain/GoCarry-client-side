import { useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "./useAxiosSecure";

export default function useTracking() {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const {
    mutate: addTracking,
    mutateAsync: addTrackingAsync,
    isPending,
    isError,
    error,
    isSuccess,
    data,
  } = useMutation({
    mutationFn: async (trackingData) => {
      const response = await axiosSecure.post("/tracking", trackingData);

      return response.data;
    },

    // Refresh tracking data if it is already displayed
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["tracking", variables.trackingId],
      });
    },

    onError: (error) => {
      Swal.fire({
        icon: "error",
        title: "Tracking Update Failed",
        text:
          error?.response?.data?.message || "Failed to create tracking update.",
      });
    },
  });

  // helper function automatic success alert
  const createTracking = (trackingData) => {
    addTracking(trackingData, {
      onSuccess: (data) => {
        Swal.fire({
          icon: "success",
          title: "Tracking Updated",
          text: data?.message || "Tracking information added successfully.",
          timer: 1800,
          showConfirmButton: false,
        });
      },
    });
  };

  return {
    addTracking,
    addTrackingAsync,
    createTracking,
    isPending,
    isError,
    error,
    isSuccess,
    data,
  };
}

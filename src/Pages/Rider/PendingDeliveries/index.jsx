import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PackageCheck, Truck, Phone, Loader2 } from "lucide-react";
import Swal from "sweetalert2";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import useAuth from "@/hooks/useAuth";
import LoadingSpinner from "@/Pages/Shared/Loading";

const PendingDeliveries = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Get rider's assigned delivery tasks
  const {
    data: deliveries = [],
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["rider-delivery-tasks", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const response = await axiosSecure.get("/riders/delivery-tasks");
      return response.data?.data || [];
    },
  });

  // Update delivery status
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      const response = await axiosSecure.patch(
        `/riders/delivery-tasks/status/${id}`,
        {
          status,
        },
      );

      return response.data;
    },

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["rider-delivery-tasks", user?.email],
      });

      if (variables.status === "in-transit") {
        Swal.fire({
          icon: "success",
          title: "Parcel Picked Up",
          text: "The parcel is now in transit.",
          timer: 1500,
          showConfirmButton: false,
        });
      }

      if (variables.status === "delivered") {
        Swal.fire({
          icon: "success",
          title: "Parcel Delivered",
          text: "The parcel has been marked as delivered.",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    },

    onError: (error) => {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text:
          error?.response?.data?.message || "Failed to update parcel status.",
      });
    },
  });

  const handleStatusUpdate = async (parcel) => {
    const isPickup = parcel.delivery_Status === "assign_rider";
    const nextStatus = isPickup ? "in-transit" : "delivered";
    const actionText = isPickup
      ? "mark this parcel as picked up?"
      : "mark this parcel as delivered?";

    const result = await Swal.fire({
      icon: "question",
      title: isPickup ? "Pick Up Parcel?" : "Deliver Parcel?",
      text: `Are you sure you want to ${actionText}`,
      showCancelButton: true,
      confirmButtonText: isPickup ? "Yes, Pick Up" : "Yes, Delivered",
      cancelButtonText: "Cancel",
      cancelButtonColor: "#CAEB66",
      confirmButtonColor: "#CAEB66",
    });

    if (!result.isConfirmed) return;

    updateStatusMutation.mutate({
      id: parcel._id,
      status: nextStatus,
    });
  };

  if (isPending) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
        <p className="font-medium text-red-600">
          Failed to load delivery tasks.
        </p>

        <p className="mt-1 text-sm text-red-500">
          {error?.response?.data?.message || error?.message}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#03373D]">
          Pending Deliveries
        </h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#eef8e0]">
              <PackageCheck className="h-5 w-5 text-[#03373D]" />
            </div>

            <div>
              <p className="text-sm text-[#71717A]">Pending Deliveries</p>
              <p className="text-2xl font-bold text-[#03373D]">
                {deliveries?.length}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#eef8e0]">
              <Truck className="h-5 w-5 text-[#03373D]" />
            </div>

            <div>
              <p className="text-sm text-[#71717A]">In Transit</p>
              <p className="text-2xl font-bold text-[#03373D]">
                {
                  deliveries?.filter(
                    (parcel) => parcel.delivery_Status === "in-transit",
                  )?.length
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <div className="border-b px-5 py-4">
          <h2 className="font-semibold text-[#03373D]">Delivery Tasks</h2>

          <p className="text-sm text-[#71717A]">
            Pick up assigned parcels and mark them as delivered.
          </p>
        </div>

        {deliveries?.length === 0 ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center px-5 text-center">
            <PackageCheck className="mb-3 h-12 w-12 text-gray-300" />

            <h3 className="font-semibold text-[#03373D]">
              No pending deliveries
            </h3>

            <p className="mt-1 text-sm text-[#71717A]">
              You don't have any assigned delivery tasks right now.
            </p>
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>Parcel</TableHead>
                  <TableHead>Tracking ID</TableHead>
                  <TableHead>Pickup</TableHead>
                  <TableHead>Receiver</TableHead>
                  <TableHead>Delivery To</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned At</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {deliveries?.map((parcel) => {
                  const isAssigned = parcel.delivery_Status === "assign_rider";
                  const isInTransit = parcel.delivery_Status === "in-transit";

                  return (
                    <TableRow key={parcel._id}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-[#03373D]">
                            {parcel.parcelName}
                          </p>

                          <p className="text-xs capitalize text-[#71717A]">
                            {parcel.parcelType} · {parcel.parcelWeight} kg
                          </p>
                        </div>
                      </TableCell>

                      <TableCell>
                        <span className="font-mono text-xs font-medium">
                          {parcel.trackingId}
                        </span>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-start gap-2">
                          <div>
                            <p className="text-sm font-medium">
                              {parcel.senderServiceCenter}
                            </p>
                            <p className="text-xs text-[#71717A]">
                              {parcel.senderDistrict}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div>
                          <p className="font-medium">{parcel.receiverName}</p>

                          <div className="mt-1 flex items-center gap-1 text-xs text-[#71717A]">
                            <Phone className="h-3 w-3" />
                            {parcel.receiverPhone}
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {parcel.receiverServiceCenter}
                          </p>

                          <p className="text-xs text-[#71717A]">
                            {parcel.receiverDistrict}
                          </p>
                        </div>
                      </TableCell>

                      <TableCell>
                        {isAssigned && (
                          <Badge className="border-0 bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
                            Rider Assigned
                          </Badge>
                        )}

                        {isInTransit && (
                          <Badge className="border-0 bg-blue-100 text-blue-700 hover:bg-blue-100">
                            In Transit
                          </Badge>
                        )}
                      </TableCell>

                      <TableCell>
                        <span className="text-xs text-[#71717A]">
                          {parcel.assignedAt
                            ? new Date(parcel.assignedAt).toLocaleDateString()
                            : "-"}
                        </span>
                      </TableCell>

                      <TableCell className="text-right">
                        {isAssigned && (
                          <Button
                            size="sm"
                            className="cursor-pointer bg-[#03373D] text-white hover:bg-[#05515A]"
                            disabled={updateStatusMutation.isPending}
                            onClick={() => handleStatusUpdate(parcel)}
                          >
                            {updateStatusMutation.isPending ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Updating...
                              </>
                            ) : (
                              <>
                                <PackageCheck className="h-4 w-4" />
                                Pick Up
                              </>
                            )}
                          </Button>
                        )}

                        {isInTransit && (
                          <Button
                            size="sm"
                            className="cursor-pointer bg-[#CAEB66] text-[#03373D] hover:bg-[#b9da55]"
                            disabled={updateStatusMutation.isPending}
                            onClick={() => handleStatusUpdate(parcel)}
                          >
                            {updateStatusMutation.isPending ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Updating...
                              </>
                            ) : (
                              <>
                                <Truck className="h-4 w-4" />
                                Mark Delivered
                              </>
                            )}
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PendingDeliveries;

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import { Search, UserRoundPlus, X } from "lucide-react";
import LoadingSpinner from "@/Pages/Shared/Loading";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Swal from "sweetalert2";

export default function AssignRider() {
  const axiosSecure = useAxiosSecure();
  const [searchValue, setSearchValue] = useState("");
  const [selectedParcel, setSelectedParcel] = useState(null);
  const queryClient = useQueryClient();
  const {
    data: parcels = [],
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["assign-rider-parcels"],
    queryFn: async () => {
      const response = await axiosSecure.get("/parcels");
      const allParcels = response?.data?.parcels || [];

      // Only show parcels that are: delivery_Status = not_collected & Payment_Status = succeeded
      return allParcels?.filter(
        (parcel) =>
          parcel.delivery_Status === "not_collected" &&
          parcel.paymentStatus === "succeeded",
      );
    },
  });

  const {
    data: riderData = [],
    isPending: ridersLoading,
    isError: ridersError,
  } = useQuery({
    queryKey: ["available-riders", selectedParcel?.senderDistrict],
    enabled: !!selectedParcel?.senderDistrict,
    queryFn: async () => {
      const district = selectedParcel.senderDistrict;

      const response = await axiosSecure.get(
        `/riders/available?district=${district}`,
      );
      return response?.data?.data;
    },
  });

  const filteredParcels = useMemo(() => {
    const search = searchValue.trim()?.toLowerCase();

    if (!search) {
      return parcels;
    }

    return parcels?.filter((parcel) => {
      const parcelName = String(parcel.parcelName || "")?.toLowerCase();
      const trackingId = String(parcel.trackingId || "")?.toLowerCase();
      const senderPhone = String(parcel.senderPhone || "")?.toLowerCase();

      return (
        parcelName?.includes(search) ||
        trackingId?.includes(search) ||
        senderPhone?.includes(search)
      );
    });
  }, [parcels, searchValue]);

  const assignRiderMutation = useMutation({
    mutationFn: async ({ parcelId, riderId }) => {
      const response = await axiosSecure.patch(
        `/riders/assign-rider/${parcelId}`,
        {
          riderId,
        },
      );
      console.log("data: ", response.data);
      return response.data;
    },

    onSuccess: (data) => {
      Swal.fire({
        icon: "success",
        title: "Rider Assigned",
        text: data.message || "Rider assigned successfully!",
        timer: 1500,
        showConfirmButton: false,
      });

      // Refresh parcel list
      queryClient.invalidateQueries({
        queryKey: ["assign-riders"],
      });

      // Refresh riders
      queryClient.invalidateQueries({
        queryKey: ["riders"],
      });

      setSelectedParcel(null);
    },

    onError: (error) => {
      Swal.fire({
        icon: "error",
        title: "Assignment Failed",
        text: error?.response?.data?.message || "Failed to assign rider.",
      });
    },
  });

  if (isPending) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-center">
        <p className="text-sm font-medium text-red-600">
          Failed to load parcels
        </p>

        <p className="mt-1 text-xs text-red-500">
          {error?.response?.data?.message || error?.message}
        </p>
      </div>
    );
  }

  const handleAssignRider = (parcel) => {
    setSelectedParcel(parcel);
  };

  return (
    <>
      <div className="space-y-5">
        <div>
          <h1 className="text-xl font-bold text-[#03373D]">Assign Rider</h1>
        </div>

        <div className="flex flex-col gap-4 rounded-xl border border-[#E5E7EB] bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs text-[#71717A]">Parcels Waiting for Rider</p>
            <p className="mt-1 text-2xl font-bold text-[#03373D]">
              {filteredParcels?.length}
            </p>
          </div>

          <div className="flex w-full max-w-sm items-center gap-2">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A1A1AA]" />

              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search parcelName, trackingId, senderPhone..."
                className="h-9 w-full rounded-md border border-[#D9E0E5] bg-white pl-9 pr-9 text-xs outline-none placeholder:text-[#A1A1AA] focus:border-[#067A87]"
              />

              {searchValue && (
                <button
                  type="button"
                  onClick={() => setSearchValue("")}
                  className="absolute right-2 top-1/2 flex h-5 w-5 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-[#71717A] hover:bg-[#F1F5F5] hover:text-[#03373D]"
                  title="Clear search"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-[#E5E7EB] bg-white">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#F8FAFA]">
                <TableHead className="whitespace-nowrap text-xs font-semibold text-[#03373D]">
                  Parcel
                </TableHead>

                <TableHead className="whitespace-nowrap text-xs font-semibold text-[#03373D]">
                  Sender
                </TableHead>

                <TableHead className="whitespace-nowrap text-xs font-semibold text-[#03373D]">
                  Pickup Location
                </TableHead>

                <TableHead className="whitespace-nowrap text-xs font-semibold text-[#03373D]">
                  Receiver
                </TableHead>

                <TableHead className="whitespace-nowrap text-xs font-semibold text-[#03373D]">
                  Destination
                </TableHead>

                <TableHead className="whitespace-nowrap text-xs font-semibold text-[#03373D]">
                  Tracking ID
                </TableHead>

                <TableHead className="whitespace-nowrap text-xs font-semibold text-[#03373D]">
                  Cost
                </TableHead>

                <TableHead className="whitespace-nowrap text-xs font-semibold text-[#03373D]">
                  Status
                </TableHead>

                <TableHead className="whitespace-nowrap text-xs font-semibold text-[#03373D]">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredParcels?.length > 0 ? (
                filteredParcels?.map((parcel) => (
                  <TableRow key={parcel._id} className="hover:bg-[#F8FAFA]">
                    <TableCell>
                      <div>
                        <p className="max-w-[150px] truncate text-xs font-semibold text-[#03373D]">
                          {parcel.parcelName || "N/A"}
                        </p>

                        <p className="text-[10px] capitalize text-[#71717A]">
                          {parcel.parcelType || "N/A"}
                        </p>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="whitespace-nowrap">
                        <p className="text-xs font-medium text-[#03373D]">
                          {parcel.senderName || "N/A"}
                        </p>

                        <p className="text-[10px] text-[#71717A]">
                          {parcel.senderPhone || "N/A"}
                        </p>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="whitespace-nowrap">
                        <p className="text-xs font-medium text-[#52525B]">
                          {parcel.senderServiceCenter || "N/A"}
                        </p>

                        <p className="text-[10px] text-[#71717A]">
                          {parcel.senderDistrict || "N/A"}
                        </p>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="whitespace-nowrap">
                        <p className="text-xs font-medium text-[#03373D]">
                          {parcel.receiverName || "N/A"}
                        </p>

                        <p className="text-[10px] text-[#71717A]">
                          {parcel.receiverPhone || "N/A"}
                        </p>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="whitespace-nowrap">
                        <p className="text-xs font-medium text-[#52525B]">
                          {parcel.receiverServiceCenter || "N/A"}
                        </p>

                        <p className="text-[10px] text-[#71717A]">
                          {parcel.receiverDistrict || "N/A"}
                        </p>
                      </div>
                    </TableCell>

                    <TableCell className="whitespace-nowrap font-mono text-[10px] text-[#067A87]">
                      {parcel.trackingId || "N/A"}
                    </TableCell>

                    <TableCell className="whitespace-nowrap text-xs font-semibold text-[#03373D]">
                      ৳{parcel.deliveryCost || 0}
                    </TableCell>

                    <TableCell>
                      <Badge className="border-yellow-200 bg-yellow-100 text-[10px] text-yellow-700 hover:bg-yellow-100">
                        {parcel.delivery_Status}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => handleAssignRider(parcel)}
                        className="h-8 cursor-pointer bg-[#03373D] text-xs text-white hover:bg-[#03373D]"
                      >
                        <UserRoundPlus className="mr-1.5 h-3.5 w-3.5" />
                        Assign Rider
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="h-32 text-center text-sm text-[#71717A]"
                  >
                    No parcels are waiting for rider assignment.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* assign rider dialog */}
      <div>
        <Dialog
          open={!!selectedParcel}
          onOpenChange={(open) => {
            if (!open) {
              setSelectedParcel(null);
            }
          }}
          className="overflow-hidden"
        >
          <DialogContent className="w-[95vw] !max-w-[1000px] overflow-hidden">
            <DialogHeader>
              <DialogTitle className="text-[#03373D]">Assign Rider</DialogTitle>
            </DialogHeader>

            {/* Parcel Information */}
            {selectedParcel && (
              <div className="mb-4 rounded-lg border border-[#E5E7EB] bg-[#F8FAFA] p-3">
                <div className="grid grid-cols-2 gap-3 text-xs sm:grid-cols-4">
                  <div>
                    <p className="text-[#71717A]">Parcel</p>
                    <p className="mt-1 font-semibold text-[#03373D]">
                      {selectedParcel.parcelName}
                    </p>
                  </div>

                  <div>
                    <p className="text-[#71717A]">Tracking ID</p>
                    <p className="mt-1 font-mono font-semibold text-[#067A87]">
                      {selectedParcel.trackingId}
                    </p>
                  </div>

                  <div>
                    <p className="text-[#71717A]">Service Center</p>
                    <p className="mt-1 font-semibold text-[#03373D]">
                      {selectedParcel.senderServiceCenter}
                    </p>
                  </div>

                  <div>
                    <p className="text-[#71717A]">District</p>
                    <p className="mt-1 font-semibold text-[#03373D]">
                      {selectedParcel.senderDistrict}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Riders */}
            <div className="max-h-[400px] overflow-y-auto rounded-lg border">
              {ridersLoading ? (
                <LoadingSpinner />
              ) : ridersError ? (
                <div className="flex h-40 items-center justify-center text-sm text-red-500">
                  Failed to load riders.
                </div>
              ) : riderData?.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow className="bg-[#F8FAFA]">
                      <TableHead className="text-xs font-semibold text-[#03373D]">
                        Rider
                      </TableHead>

                      <TableHead className="text-xs font-semibold text-[#03373D]">
                        Phone
                      </TableHead>

                      <TableHead className="text-xs font-semibold text-[#03373D]">
                        District
                      </TableHead>

                      <TableHead className="text-xs font-semibold text-[#03373D]">
                        Vehicle
                      </TableHead>

                      <TableHead className="text-right text-xs font-semibold text-[#03373D]">
                        Action
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {riderData?.map((rider) => (
                      <TableRow key={rider._id}>
                        <TableCell>
                          <div>
                            <p className="text-xs font-semibold text-[#03373D]">
                              {rider.name}
                            </p>

                            <p className="text-[10px] text-[#71717A]">
                              {rider.email}
                            </p>
                          </div>
                        </TableCell>

                        <TableCell className="text-xs text-[#52525B]">
                          {rider.phone || "N/A"}
                        </TableCell>

                        <TableCell className="text-xs text-[#52525B]">
                          {rider.district}
                        </TableCell>

                        <TableCell className="text-xs capitalize text-[#52525B]">
                          {rider.bikeBrandModel || "N/A"}
                        </TableCell>

                        <TableCell className="text-right">
                          <Button
                            type="button"
                            size="sm"
                            disabled={assignRiderMutation.isPending}
                            className="h-8 cursor-pointer bg-[#CAEB66] text-xs text-black hover:bg-[#CAEB66] hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
                            onClick={() => {
                              assignRiderMutation.mutate({
                                parcelId: selectedParcel._id,
                                riderId: rider._id,
                              });
                            }}
                          >
                            {assignRiderMutation.isPending
                              ? "Assigning..."
                              : "Assign"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex h-40 items-center justify-center text-sm text-[#71717A]">
                  No riders available for{" "}
                  <span className="ml-1 font-semibold">
                    {selectedParcel?.senderServiceCenter}
                  </span>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}

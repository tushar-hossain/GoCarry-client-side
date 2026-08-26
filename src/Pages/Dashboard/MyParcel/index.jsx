import { useState } from "react";
import { useNavigate } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAuth from "@/hooks/useAuth";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CreditCard, Eye, Pencil, Trash2 } from "lucide-react";
import Swal from "sweetalert2";

export default function MyParcel() {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedParcel, setSelectedParcel] = useState(null);

  // GET PARCELS
  const {
    isPending,
    isError,
    data: parcels = [],
    error,
  } = useQuery({
    queryKey: ["parcels", user?.email],

    queryFn: async () => {
      const result = await axiosSecure.get(`/parcels?email=${user?.email}`);

      return result.data;
    },

    enabled: !!user?.email,
  });

  // DELETE PARCEL
  const deleteParcelMutation = useMutation({
    mutationFn: async (id) => {
      const result = await axiosSecure.delete(`/parcels/${id}`);

      return result.data;
    },

    onSuccess: () => {
      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Parcel deleted successfully.",
        confirmButtonColor: "#03373D",
      });

      queryClient.invalidateQueries({
        queryKey: ["parcels", user?.email],
      });
    },

    onError: (error) => {
      Swal.fire({
        icon: "error",
        title: "Delete Failed",
        text: error?.response?.data?.message || "Failed to delete parcel.",
        confirmButtonColor: "#03373D",
      });
    },
  });

  // DELETE HANDLER
  const handleDelete = (parcel) => {
    Swal.fire({
      title: "Are you sure?",
      text: `You want to delete "${parcel.parcelName}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#CAEB66",
      cancelButtonColor: "#CAEB66",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteParcelMutation.mutate(parcel._id);
      }
    });
  };

  // LOADING
  if (isPending) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-sm text-[#71717A]">Loading parcels...</p>
      </div>
    );
  }

  // ERROR
  if (isError) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-sm text-red-500">
          {error?.message || "Failed to load parcels"}
        </p>
      </div>
    );
  }

  return (
    <section className="w-full">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#03373D]">My Parcels</h1>
      </div>

      {/* Total */}
      <div className="mb-4 rounded-xl border border-[#E5E7EB] bg-white p-4">
        <p className="text-xs text-[#71717A]">Total Parcels</p>

        <p className="mt-1 text-2xl font-bold text-[#03373D]">
          {parcels?.parcels?.length}
        </p>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-white">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#F8FAFA]">
                <TableHead className="whitespace-nowrap text-xs font-semibold text-[#03373D]">
                  Date
                </TableHead>

                <TableHead className="whitespace-nowrap text-xs font-semibold text-[#03373D]">
                  Parcel Name
                </TableHead>

                <TableHead className="whitespace-nowrap text-xs font-semibold text-[#03373D]">
                  Type
                </TableHead>

                <TableHead className="whitespace-nowrap text-xs font-semibold text-[#03373D]">
                  Tracking ID
                </TableHead>

                <TableHead className="whitespace-nowrap text-xs font-semibold text-[#03373D]">
                  Delivery Cost
                </TableHead>

                <TableHead className="whitespace-nowrap text-xs font-semibold text-[#03373D]">
                  Payment Status
                </TableHead>

                {/* NEW */}
                <TableHead className="whitespace-nowrap text-xs font-semibold text-[#03373D]">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {parcels?.parcels?.length > 0 ? (
                parcels?.parcels?.map((parcel) => (
                  <TableRow key={parcel._id} className="hover:bg-[#F8FAFA]">
                    {/* Date */}
                    <TableCell className="whitespace-nowrap text-xs text-[#52525B]">
                      {new Date(parcel.creation_date).toLocaleDateString(
                        "en-BD",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        },
                      )}
                    </TableCell>

                    {/* Name */}
                    <TableCell className="max-w-[180px] truncate text-xs font-medium text-[#03373D]">
                      {parcel.parcelName}
                    </TableCell>

                    {/* Type */}
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="text-[10px] capitalize"
                      >
                        {parcel.parcelType}
                      </Badge>
                    </TableCell>

                    {/* Tracking */}
                    <TableCell className="whitespace-nowrap font-mono text-[10px] text-[#067A87]">
                      {parcel.trackingId}
                    </TableCell>

                    {/* Cost */}
                    <TableCell className="whitespace-nowrap text-xs font-semibold text-[#03373D]">
                      ৳{parcel.deliveryCost}
                    </TableCell>

                    {/* Payment */}
                    <TableCell>
                      <TableCell>
                        <Badge
                          className={
                            parcel.paymentStatus === "succeeded"
                              ? "border-green-200 bg-green-100 text-green-700 hover:bg-green-100"
                              : "border-yellow-200 bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
                          }
                        >
                          {parcel.paymentStatus}
                        </Badge>
                      </TableCell>
                    </TableCell>

                    {/* ACTION */}
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        {/* PAY */}
                        <Button
                          type="button"
                          size="icon"
                          disabled={parcel.paymentStatus === "succeeded"}
                          onClick={() =>
                            navigate(`/dashboard/payments/${parcel._id}`)
                          }
                          className="h-7 w-7 cursor-pointer bg-[#CAEB66] text-black hover:bg-[#CAEB66] hover:brightness-95 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400 disabled:opacity-100"
                          title={
                            parcel.paymentStatus === "succeeded"
                              ? "Already Paid"
                              : "Pay"
                          }
                        >
                          <CreditCard
                            className={`h-3.5 w-3.5 ${
                              parcel.paymentStatus === "succeeded"
                                ? "text-gray-400"
                                : "text-black"
                            }`}
                          />
                        </Button>
                        {/* VIEW */}
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => setSelectedParcel(parcel)}
                          className="h-7 w-7 cursor-pointer"
                          title="View"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Button>

                        {/* EDIT */}
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            navigate("/dashboard/send-parcel", {
                              state: {
                                parcel,
                              },
                            })
                          }
                          className="h-7 w-7 cursor-pointer"
                          title="Edit"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>

                        {/* DELETE */}
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          disabled={deleteParcelMutation.isPending}
                          onClick={() => handleDelete(parcel)}
                          className="h-7 w-7 text-red-500 hover:text-red-600 cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="h-32 text-center text-sm text-[#71717A]"
                  >
                    No parcels found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* VIEW PARCEL MODAL */}

      <Dialog
        open={!!selectedParcel}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedParcel(null);
          }
        }}
      >
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[#03373D]">Parcel Details</DialogTitle>
          </DialogHeader>

          {selectedParcel && (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Detail label="Parcel Name" value={selectedParcel.parcelName} />

              <Detail label="Parcel Type" value={selectedParcel.parcelType} />

              <Detail
                label="Parcel Weight"
                value={
                  selectedParcel.parcelWeight
                    ? `${selectedParcel.parcelWeight} KG`
                    : "N/A"
                }
              />

              <Detail label="Tracking ID" value={selectedParcel.trackingId} />

              <Detail
                label="Delivery Cost"
                value={`৳${selectedParcel.deliveryCost}`}
              />

              <Detail
                label="Payment Status"
                value={selectedParcel.paymentStatus}
              />

              <Detail
                label="Delivery Status"
                value={selectedParcel.delivery_Status}
              />

              <Detail label="Payment" value={selectedParcel.Payment_Status} />

              <Detail label="Sender Name" value={selectedParcel.senderName} />

              <Detail label="Sender Phone" value={selectedParcel.senderPhone} />

              <Detail
                label="Sender District"
                value={selectedParcel.senderDistrict}
              />

              <Detail
                label="Sender Service Center"
                value={selectedParcel.senderServiceCenter}
              />

              <Detail
                label="Sender Address"
                value={selectedParcel.senderAddress}
              />

              <Detail
                label="Receiver Name"
                value={selectedParcel.receiverName}
              />

              <Detail
                label="Receiver Phone"
                value={selectedParcel.receiverPhone}
              />

              <Detail
                label="Receiver District"
                value={selectedParcel.receiverDistrict}
              />

              <Detail
                label="Receiver Service Center"
                value={selectedParcel.receiverServiceCenter}
              />

              <Detail
                label="Receiver Address"
                value={selectedParcel.receiverAddress}
              />

              <Detail label="Created By" value={selectedParcel.created_by} />

              <Detail
                label="Creation Date"
                value={new Date(selectedParcel.creation_date).toLocaleString(
                  "en-BD",
                )}
              />

              <div className="sm:col-span-2">
                <Detail
                  label="Pickup Instruction"
                  value={selectedParcel.pickupInstruction}
                />
              </div>

              <div className="sm:col-span-2">
                <Detail
                  label="Delivery Instruction"
                  value={selectedParcel.deliveryInstruction}
                />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}

// DETAIL COMPONENT
function Detail({ label, value }) {
  return (
    <div className="rounded-lg border border-[#E5E7EB] bg-[#F8FAFA] p-3">
      <p className="text-[10px] font-medium text-[#71717A]">{label}</p>

      <p className="mt-1 break-words text-xs font-semibold text-[#03373D]">
        {value || "N/A"}
      </p>
    </div>
  );
}

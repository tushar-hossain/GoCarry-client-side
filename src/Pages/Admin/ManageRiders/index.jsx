import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import Swal from "sweetalert2";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import LoadingSpinner from "@/Pages/Shared/Loading";

export default function ManageRiders() {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [updatingId, setUpdatingId] = useState(null);

  const {
    data: riders = [],
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["riders"],
    queryFn: async () => {
      const response = await axiosSecure.get("/riders");
      return response?.data?.data;
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      setUpdatingId(id);

      const response = await axiosSecure.patch(`/riders/status/${id}`, {
        status,
      });
      return response.data;
    },

    onSuccess: (data) => {
      Swal.fire({
        icon: "success",
        title: "Status Updated",
        text: data?.message || "Rider status updated successfully!",
        showConfirmButton: false,
        timer: 1500,
      });

      // Refetch riders
      queryClient.invalidateQueries({
        queryKey: ["riders"],
      });
    },

    onError: (error) => {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text:
          error?.response?.data?.message || "Failed to update rider status.",
      });
    },

    onSettled: () => {
      setUpdatingId(null);
    },
  });

  const handleStatusChange = async (rider, newStatus) => {
    if (rider.status === newStatus) return;

    const result = await Swal.fire({
      icon: "warning",
      title: "Change Rider Status?",
      html: `
        <div style="font-size: 14px;">
          <p>
            Change <strong>${rider.name || "this rider"}</strong>
          </p>
          <p style="margin-top: 8px;">
            Status:
            <strong>${rider.status}</strong>
            →
            <strong>${newStatus}</strong>
          </p>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Yes, change",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#CAEB66",
      cancelButtonColor: "#CAEB66",
    });

    if (!result.isConfirmed) return;

    updateStatusMutation.mutate({
      id: rider._id,
      status: newStatus,
    });
  };

  if (isPending) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-sm font-medium text-red-600">
          Failed to load riders.
        </p>

        <p className="mt-1 text-xs text-red-500">
          {error?.response?.data?.message || error?.message}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-[#03373D]">Manage Riders</h1>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-[#E5E7EB] bg-white p-4">
          <p className="text-xs text-[#71717A]">Total Riders</p>

          <p className="mt-1 text-2xl font-bold text-[#03373D]">
            {riders?.length}
          </p>
        </div>

        <div className="rounded-xl border border-[#E5E7EB] bg-white p-4">
          <p className="text-xs text-[#71717A]">Pending</p>

          <p className="mt-1 text-2xl font-bold text-yellow-600">
            {riders?.filter((rider) => rider.status === "pending")?.length}
          </p>
        </div>

        <div className="rounded-xl border border-[#E5E7EB] bg-white p-4">
          <p className="text-xs text-[#71717A]">Approved</p>

          <p className="mt-1 text-2xl font-bold text-green-600">
            {riders?.filter((rider) => rider.status === "approved")?.length}
          </p>
        </div>

        <div className="rounded-xl border border-[#E5E7EB] bg-white p-4">
          <p className="text-xs text-[#71717A]">Rejected</p>

          <p className="mt-1 text-2xl font-bold text-red-500">
            {riders?.filter((rider) => rider.status === "rejected")?.length}
          </p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-[#E5E7EB] bg-white">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#F8FAFA]">
              <TableHead className="whitespace-nowrap text-xs font-semibold text-[#03373D]">
                Rider
              </TableHead>

              <TableHead className="whitespace-nowrap text-xs font-semibold text-[#03373D]">
                Contact
              </TableHead>

              <TableHead className="whitespace-nowrap text-xs font-semibold text-[#03373D]">
                District
              </TableHead>

              <TableHead className="whitespace-nowrap text-xs font-semibold text-[#03373D]">
                Vehicle
              </TableHead>

              <TableHead className="whitespace-nowrap text-xs font-semibold text-[#03373D]">
                Vehicle Number
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
            {riders?.length > 0 ? (
              riders.map((rider) => (
                <TableRow key={rider._id} className="hover:bg-[#F8FAFA]">
                  <TableCell>
                    <div>
                      <p className="whitespace-nowrap text-xs font-semibold text-[#03373D]">
                        {rider?.name || "N/A"}
                      </p>
                      <p className="text-[10px] text-[#71717A]">
                        {rider?.email || "N/A"}
                      </p>
                    </div>
                  </TableCell>

                  <TableCell className="whitespace-nowrap text-xs text-[#52525B]">
                    {rider?.phone || "N/A"}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-xs text-[#52525B]">
                    {rider?.district || "N/A"}
                  </TableCell>

                  <TableCell className="whitespace-nowrap text-xs text-[#52525B]">
                    {rider?.bikeBrandModel || "N/A"}
                  </TableCell>

                  <TableCell className="whitespace-nowrap font-mono text-[10px] text-[#52525B]">
                    {rider?.bikeRegistrationNumber || "N/A"}
                  </TableCell>

                  <TableCell>
                    <Badge
                      className={
                        rider?.status === "approved"
                          ? "border-green-200 bg-green-100 text-green-700 hover:bg-green-100"
                          : rider?.status === "rejected"
                            ? "border-red-200 bg-red-100 text-red-700 hover:bg-red-100"
                            : "border-yellow-200 bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
                      }
                    >
                      {rider?.status}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <Select
                      value={rider?.status}
                      onValueChange={(value) =>
                        handleStatusChange(rider, value)
                      }
                      disabled={
                        updateStatusMutation.isPending &&
                        updatingId === rider?._id
                      }
                    >
                      <SelectTrigger className="h-8 w-[120px] cursor-pointer text-xs">
                        {updateStatusMutation.isPending &&
                        updatingId === rider?._id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <SelectValue />
                        )}
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-32 text-center text-sm text-[#71717A]"
                >
                  No rider applications found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

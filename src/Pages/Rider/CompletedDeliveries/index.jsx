import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CheckCircle2,
  Search,
  PackageCheck,
  MapPin,
  Phone,
  CalendarDays,
  X,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import useAuth from "@/hooks/useAuth";
import Swal from "sweetalert2";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/Pages/Shared/Loading";

const CompletedDeliveries = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchValue, setSearchValue] = useState("");
  const {
    data: completedDeliveries = [],
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["completed-deliveries", user?.email],
    enabled: !!user?.email,

    queryFn: async () => {
      const response = await axiosSecure.get(
        "/riders/delivery-tasks/completed",
      );

      return response.data?.data || [];
    },
  });

  const filteredDeliveries = useMemo(() => {
    const search = searchValue.trim()?.toLowerCase();

    if (!search) {
      return completedDeliveries;
    }

    return completedDeliveries?.filter((parcel) => {
      return (
        String(parcel.parcelName || "")
          ?.toLowerCase()
          ?.includes(search) ||
        String(parcel.trackingId || "")
          ?.toLowerCase()
          ?.includes(search) ||
        String(parcel.receiverName || "")
          ?.toLowerCase()
          ?.includes(search) ||
        String(parcel.receiverPhone || "")
          ?.toLowerCase()
          ?.includes(search) ||
        String(parcel.receiverDistrict || "")
          ?.toLowerCase()
          ?.includes(search) ||
        String(parcel.receiverServiceCenter || "")
          ?.toLowerCase()
          ?.includes(search)
      );
    });
  }, [completedDeliveries, searchValue]);

  const cashoutMutation = useMutation({
    mutationFn: async (parcelId) => {
      const response = await axiosSecure.post("/riders/cashouts", {
        parcelId,
      });

      return response.data;
    },

    onSuccess: (data) => {
      Swal.fire({
        icon: "success",
        title: "Cashout Requested",
        text: `Your cashout request of TK${data?.data?.amount} has been submitted.`,
        confirmButtonColor: "#CAEB66",
        cancelButtonColor: "#CAEB66",
        color: "#03373D",
      });

      queryClient.invalidateQueries({
        queryKey: ["completed-deliveries", user?.email],
      });
    },

    onError: (error) => {
      Swal.fire({
        icon: "error",
        title: "Cashout Failed",
        text:
          error?.response?.data?.message || "Failed to submit cashout request.",
      });
    },
  });

  const handleCashout = async (parcel) => {
    const result = await Swal.fire({
      title: "Request Cashout?",
      text: "Are you sure you want to request cashout for this delivery?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Cash Out",
      cancelButtonText: "Cancel",
      cancelButtonColor: "#CAEB66",
      confirmButtonColor: "#CAEB66",
      color: "#03373D",
    });

    if (!result.isConfirmed) return;

    cashoutMutation.mutate(parcel._id);
  };

  if (isPending) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return (
      <div className="flex min-h-100 items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <p className="font-medium text-red-500">
              Failed to load completed deliveries.
            </p>

            <p className="mt-2 text-sm text-[#71717A]">
              {error?.response?.data?.message ||
                error?.message ||
                "Something went wrong."}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#03373D]">
          Completed Deliveries
        </h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
              <PackageCheck className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-[#71717A]">Completed Deliveries</p>
              <h2 className="text-2xl font-bold text-[#03373D]">
                {completedDeliveries?.length}
              </h2>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-[#71717A]">Delivered</p>
              <h2 className="text-2xl font-bold text-[#03373D]">
                {
                  completedDeliveries?.filter(
                    (parcel) => parcel.delivery_Status === "delivered",
                  )?.length
                }
              </h2>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
              <MapPin className="h-6 w-6 text-blue-600" />
            </div>

            <div>
              <p className="text-sm text-[#71717A]">Service Center Delivered</p>
              <h2 className="text-2xl font-bold text-[#03373D]">
                {
                  completedDeliveries?.filter(
                    (parcel) =>
                      parcel.delivery_Status === "service_center_delivered",
                  )?.length
                }
              </h2>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="border-b">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="text-lg text-[#03373D]">
                Delivery History
              </CardTitle>
              <p className="mt-1 text-xs text-[#71717A]">
                {filteredDeliveries?.length} completed parcel
                {filteredDeliveries?.length !== 1 ? "s" : ""}
              </p>
            </div>

            <div className="relative w-full md:w-[320px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#71717A]" />
              <Input
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search parcel, receiver, tracking..."
                className="pl-9 pr-9"
              />

              {searchValue && (
                <button
                  type="button"
                  onClick={() => setSearchValue("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-[#71717A] hover:text-[#03373D]"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {filteredDeliveries?.length === 0 ? (
            <div className="flex min-h-62.5 flex-col items-center justify-center px-6 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                <PackageCheck className="h-7 w-7 text-[#71717A]" />
              </div>

              <h3 className="font-semibold text-[#03373D]">
                {searchValue
                  ? "No deliveries found"
                  : "No completed deliveries"}
              </h3>

              <p className="mt-1 text-sm text-[#71717A]">
                {searchValue
                  ? "Try searching with a different keyword."
                  : "Your completed deliveries will appear here."}
              </p>
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Parcel</TableHead>
                    <TableHead>Tracking ID</TableHead>
                    <TableHead>Receiver</TableHead>
                    <TableHead>Delivery To</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Completed At</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Cashout</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filteredDeliveries?.map((parcel) => (
                    <TableRow key={parcel._id}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-[#03373D]">
                            {parcel.parcelName || "N/A"}
                          </p>
                          <p className="text-xs text-[#71717A]">
                            {parcel.parcelType || "Parcel"}
                          </p>
                        </div>
                      </TableCell>

                      <TableCell>
                        <span className="font-mono text-xs text-[#03373D]">
                          {parcel.trackingId || "N/A"}
                        </span>
                      </TableCell>

                      <TableCell>
                        <p className="font-medium text-[#03373D]">
                          {parcel.receiverName || "N/A"}
                        </p>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-start gap-2">
                          <div>
                            <p className="text-sm text-[#03373D]">
                              {parcel.receiverDistrict || "N/A"}
                            </p>
                            <p className="text-xs text-[#71717A]">
                              {parcel.receiverServiceCenter || "N/A"}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-[#71717A]" />
                          <span className="text-sm">
                            {parcel?.receiverPhone || "N/A"}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell>
                        {parcel?.delivery_Status === "delivered" ? (
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                            <CheckCircle2 className="mr-1 h-3 w-3" />
                            Delivered
                          </Badge>
                        ) : (
                          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                            <MapPin className="mr-1 h-3 w-3" />
                            Service Center Delivered
                          </Badge>
                        )}
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2 text-xs text-[#71717A]">
                          <CalendarDays className="h-4 w-4" />

                          {parcel?.updatedAt
                            ? new Date(parcel.updatedAt).toLocaleDateString(
                                "en-BD",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                },
                              )
                            : "N/A"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-xs text-[#71717A]">
                          <CalendarDays className="h-4 w-4" />
                          <p className="font-semibold text-[#03373D]">
                            TK
                            {Number(parcel?.deliveryCost || 0).toLocaleString()}
                          </p>
                        </div>
                      </TableCell>

                      <TableCell>
                        {parcel?.cashout?.status === "pending" ? (
                          <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
                            Cashout Pending
                          </Badge>
                        ) : parcel?.cashout?.status === "approved" ? (
                          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                            Approved
                          </Badge>
                        ) : parcel?.cashout?.status === "paid" ? (
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                            Paid
                          </Badge>
                        ) : parcel?.cashout?.status === "rejected" ? (
                          <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
                            Rejected
                          </Badge>
                        ) : (
                          <Button
                            size="sm"
                            className="cursor-pointer bg-[#CAEB66] text-[#03373D] hover:bg-[#b9dc5b]"
                            onClick={() => handleCashout(parcel)}
                            disabled={cashoutMutation.isPending}
                          >
                            Cash Out
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CompletedDeliveries;

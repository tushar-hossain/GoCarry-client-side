import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CheckCircle2,
  Clock3,
  DollarSign,
  Search,
  X,
  XCircle,
  CreditCard,
  ArrowDown,
} from "lucide-react";
import Swal from "sweetalert2";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import LoadingSpinner from "@/Pages/Shared/Loading";
import { FaBangladeshiTakaSign } from "react-icons/fa6";

const CashoutHistory = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const {
    data: cashouts = [],
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["admin-cashouts"],

    queryFn: async () => {
      const response = await axiosSecure.get("/riders/cashouts");
      return response.data?.data;
    },
  });

  const filteredCashouts = useMemo(() => {
    const search = searchValue.trim()?.toLowerCase();

    return cashouts?.filter((cashout) => {
      const matchesSearch =
        !search ||
        String(cashout?.riderName || "")
          ?.toLowerCase()
          ?.includes(search) ||
        String(cashout?.riderEmail || "")
          ?.toLowerCase()
          ?.includes(search) ||
        String(cashout?.trackingId || "")
          ?.toLowerCase()
          ?.includes(search) ||
        String(cashout?.parcelId || "")
          ?.toLowerCase()
          ?.includes(search);

      const matchesStatus =
        statusFilter === "all" || cashout?.cashoutStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [cashouts, searchValue, statusFilter]);

  const statusMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      const response = await axiosSecure.patch(
        `/riders/cashouts/${id}/status`,
        {
          status,
        },
      );

      return response.data;
    },

    onSuccess: (data) => {
      Swal.fire({
        icon: "success",
        title: "Status Updated",
        text: data?.message || "Cashout status updated successfully.",
        confirmButtonColor: "#CAEB66",
        cancelButtonColor: "#CAEB66",
        color: "#03373D",
      });

      queryClient.invalidateQueries({
        queryKey: ["admin-cashouts"],
      });
    },

    onError: (error) => {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text:
          error?.response?.data?.message || "Failed to update cashout status.",
      });
    },
  });

  const handleStatusChange = async (cashout, status) => {
    let title = "";
    let text = "";
    let confirmText = "";

    if (status === "approved") {
      title = "Approve Cashout?";
      text = `Approve TK${cashout?.amount} cashout for ${cashout?.riderName}?`;
      confirmText = "Yes, Approve";
    }

    if (status === "paid") {
      title = "Mark Cashout as Paid?";
      text = `Confirm that TK${cashout?.amount} has been paid to ${cashout?.riderName}?`;
      confirmText = "Yes, Mark Paid";
    }

    if (status === "rejected") {
      title = "Reject Cashout?";
      text = `Reject this TK${cashout?.amount} cashout request?`;
      confirmText = "Yes, Reject";
    }

    const result = await Swal.fire({
      icon: status === "rejected" ? "warning" : "question",
      title,
      text,
      showCancelButton: true,
      confirmButtonText: confirmText,
      cancelButtonText: "Cancel",
      confirmButtonColor: status === "rejected" ? "#ef4444" : "#CAEB66",
      color: "#03373D",
    });

    if (!result.isConfirmed) return;

    statusMutation.mutate({
      id: cashout._id,
      status,
    });
  };

  const statistics = useMemo(() => {
    const total = cashouts?.length;

    const pending = cashouts?.filter(
      (item) => item.cashoutStatus === "pending",
    )?.length;

    const approved = cashouts?.filter(
      (item) => item.cashoutStatus === "approved",
    )?.length;

    const paid = cashouts?.filter(
      (item) => item.cashoutStatus === "paid",
    )?.length;

    const rejected = cashouts?.filter(
      (item) => item.cashoutStatus === "rejected",
    )?.length;

    const pendingAmount = cashouts
      ?.filter((item) => item.cashoutStatus === "pending")
      .reduce((total, item) => total + Number(item.amount || 0), 0);

    const paidAmount = cashouts
      ?.filter((item) => item.cashoutStatus === "paid")
      .reduce((total, item) => total + Number(item.amount || 0), 0);

    return {
      total,
      pending,
      approved,
      paid,
      rejected,
      pendingAmount,
      paidAmount,
    };
  }, [cashouts]);

  if (isPending) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return (
      <div className="rounded-xl border bg-white p-8 text-center">
        <XCircle className="mx-auto mb-3 h-10 w-10 text-red-500" />

        <h2 className="text-lg font-semibold">
          Failed to load cashout history
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          {error?.response?.data?.message ||
            error?.message ||
            "Something went wrong."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#03373D]">Cashout Request</h1>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-lg bg-gray-100 p-3">
              <CreditCard className="h-5 w-5 text-gray-600" />
            </div>

            <div>
              <p className="text-sm text-gray-500">Total Requests</p>

              <h3 className="text-2xl font-bold">{statistics?.total}</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-lg bg-yellow-100 p-3">
              <Clock3 className="h-5 w-5 text-yellow-600" />
            </div>

            <div>
              <p className="text-sm text-gray-500">Pending</p>

              <h3 className="text-2xl font-bold">{statistics?.pending}</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-lg bg-blue-100 p-3">
              <CheckCircle2 className="h-5 w-5 text-blue-600" />
            </div>

            <div>
              <p className="text-sm text-gray-500">Approved</p>

              <h3 className="text-2xl font-bold">{statistics?.approved}</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-lg bg-green-100 p-3">
              <FaBangladeshiTakaSign className="h-5 w-5 text-green-600" />
            </div>

            <div>
              <p className="text-sm text-gray-500">Paid</p>

              <h3 className="text-2xl font-bold">{statistics?.paid}</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-lg bg-red-100 p-3">
              <XCircle className="h-5 w-5 text-red-600" />
            </div>

            <div>
              <p className="text-sm text-gray-500">Rejected</p>

              <h3 className="text-2xl font-bold">{statistics?.rejected}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-gray-500">Pending Cashout Amount</p>

            <h2 className="mt-1 text-2xl font-bold text-yellow-600">
              TK{statistics.pendingAmount.toLocaleString()}
            </h2>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-gray-500">Total Paid Amount</p>

            <h2 className="mt-1 text-2xl font-bold text-green-600">
              TK{statistics.paidAmount.toLocaleString()}
            </h2>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Cashout Requests</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col gap-3 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

              <Input
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search rider, email, tracking ID..."
                className="pl-9 pr-9"
              />

              {searchValue && (
                <button
                  type="button"
                  onClick={() => setSearchValue("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-700"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-50">
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rider</TableHead>
                  <TableHead>Tracking ID</TableHead>
                  <TableHead>Service Center</TableHead>
                  <TableHead>Delivery Cost</TableHead>
                  <TableHead>Rate</TableHead>
                  <TableHead>Cashout</TableHead>
                  <TableHead>Requested At</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredCashouts?.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="h-32 text-center text-gray-500"
                    >
                      No cashout requests found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCashouts.map((cashout) => (
                    <TableRow key={cashout._id}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-[#03373D]">
                            {cashout?.riderName || "N/A"}
                          </p>

                          <p className="text-xs text-gray-500">
                            {cashout?.riderEmail || "N/A"}
                          </p>
                        </div>
                      </TableCell>

                      <TableCell>
                        <span className="font-mono text-xs">
                          {cashout?.trackingId || "N/A"}
                        </span>
                      </TableCell>

                      <TableCell>
                        <div className="text-sm">
                          <p>{cashout?.senderServiceCenter || "N/A"}</p>

                          <p className="text-xs text-gray-500">
                            <ArrowDown size={12} />{" "}
                            {cashout?.receiverServiceCenter || "N/A"}
                          </p>
                        </div>
                      </TableCell>

                      <TableCell>
                        TK{Number(cashout?.deliveryCost || 0).toLocaleString()}
                      </TableCell>

                      <TableCell>
                        <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">
                          {cashout?.percentage || 0}%
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-semibold text-[#03373D]">
                            TK{Number(cashout?.amount || 0).toLocaleString()}
                          </p>

                          {cashout?.cashoutStatus === "pending" ? (
                            <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
                              Pending
                            </Badge>
                          ) : cashout?.cashoutStatus === "approved" ? (
                            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                              Approved
                            </Badge>
                          ) : cashout?.cashoutStatus === "paid" ? (
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                              Paid
                            </Badge>
                          ) : (
                            <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
                              Rejected
                            </Badge>
                          )}
                        </div>
                      </TableCell>

                      <TableCell>
                        <span className="text-xs text-gray-500">
                          {cashout?.requestedAt
                            ? new Date(cashout.requestedAt).toLocaleDateString()
                            : "N/A"}
                        </span>
                      </TableCell>

                      <TableCell>
                        <div className="flex justify-end gap-2">
                          {cashout?.cashoutStatus === "pending" && (
                            <>
                              <Button
                                size="sm"
                                className="cursor-pointer bg-[#CAEB66] text-[#03373D] hover:bg-[#b9dc5b]"
                                disabled={statusMutation.isPending}
                                onClick={() =>
                                  handleStatusChange(cashout, "approved")
                                }
                              >
                                Approve
                              </Button>

                              <Button
                                size="sm"
                                variant="destructive"
                                className="cursor-pointer"
                                disabled={statusMutation.isPending}
                                onClick={() =>
                                  handleStatusChange(cashout, "rejected")
                                }
                              >
                                Reject
                              </Button>
                            </>
                          )}

                          {cashout?.cashoutStatus === "approved" && (
                            <Button
                              size="sm"
                              className="cursor-pointer bg-green-600 text-white hover:bg-green-700"
                              disabled={statusMutation.isPending}
                              onClick={() =>
                                handleStatusChange(cashout, "paid")
                              }
                            >
                              Mark Paid
                            </Button>
                          )}

                          {cashout?.cashoutStatus === "paid" && (
                            <Badge className="bg-green-100 px-3 py-2 text-green-700 hover:bg-green-100">
                              <CheckCircle2 className="mr-1 h-3 w-3" />
                              Completed
                            </Badge>
                          )}

                          {cashout?.cashoutStatus === "rejected" && (
                            <Badge className="bg-red-100 px-3 py-2 text-red-700 hover:bg-red-100">
                              <XCircle className="mr-1 h-3 w-3" />
                              Rejected
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CashoutHistory;

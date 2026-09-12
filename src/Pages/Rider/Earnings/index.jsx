import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Wallet,
  Banknote,
  Clock3,
  TrendingUp,
  CalendarDays,
  Search,
  X,
  PackageCheck,
  CheckCircle2,
  CircleDollarSign,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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
import LoadingSpinner from "@/Pages/Shared/Loading";

const MyEarnings = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const [searchValue, setSearchValue] = useState("");

  const {
    data: earningsData = [],
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["rider-earnings", user?.email],
    enabled: !!user?.email,

    queryFn: async () => {
      const response = await axiosSecure.get("/riders/earnings");

      return response.data?.data?.cashouts || [];
    },
  });

  const summary = useMemo(() => {
    let totalEarning = 0;
    let totalCashedOut = 0;
    let totalPending = 0;

    earningsData.forEach((cashout) => {
      const amount = Number(cashout?.amount || 0);
      const status = cashout?.cashoutStatus;

      if (status !== "rejected") {
        totalEarning += amount;
      }

      if (status === "paid") {
        totalCashedOut += amount;
      }

      if (status === "pending" || status === "approved") {
        totalPending += amount;
      }
    });

    return {
      totalEarning,
      totalCashedOut,
      totalPending,
    };
  }, [earningsData]);

  const earningsAnalysis = useMemo(() => {
    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );

    const startOfWeek = new Date(now);
    startOfWeek.setHours(0, 0, 0, 0);
    startOfWeek.setDate(now.getDate() - now.getDay());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    let today = 0;
    let week = 0;
    let month = 0;
    let year = 0;
    let overall = 0;

    earningsData.forEach((cashout) => {
      if (cashout?.cashoutStatus === "rejected") {
        return;
      }

      const amount = Number(cashout?.amount || 0);
      const dateValue =
        cashout?.processedAt || cashout?.requestedAt || cashout?.createdAt;

      if (!dateValue) return;

      const date = new Date(dateValue);

      overall += amount;

      if (date >= startOfToday) {
        today += amount;
      }

      if (date >= startOfWeek) {
        week += amount;
      }

      if (date >= startOfMonth) {
        month += amount;
      }

      if (date >= startOfYear) {
        year += amount;
      }
    });

    return {
      today,
      week,
      month,
      year,
      overall,
    };
  }, [earningsData]);

  const filteredCashouts = useMemo(() => {
    const search = searchValue.trim().toLowerCase();

    if (!search) {
      return earningsData;
    }

    return earningsData.filter(
      (cashout) =>
        String(cashout?.trackingId || "")
          .toLowerCase()
          .includes(search) ||
        String(cashout?.parcelId || "")
          .toLowerCase()
          .includes(search) ||
        String(cashout?.cashoutStatus || "")
          .toLowerCase()
          .includes(search) ||
        String(cashout?.serviceCenterType || "")
          .toLowerCase()
          .includes(search),
    );
  }, [earningsData, searchValue]);

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
            <Clock3 className="mr-1 h-3 w-3" />
            Pending
          </Badge>
        );

      case "approved":
        return (
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Approved
          </Badge>
        );

      case "paid":
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
            <Banknote className="mr-1 h-3 w-3" />
            Paid
          </Badge>
        );

      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
            Rejected
          </Badge>
        );

      default:
        return <Badge className="bg-gray-100 text-gray-700">Unknown</Badge>;
    }
  };

  if (isPending) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return (
      <div className="flex min-h-100 items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <p className="font-semibold text-red-600">
              Failed to load earnings
            </p>

            <p className="mt-2 text-sm text-gray-500">
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
        <h1 className="text-2xl font-bold text-[#03373D]">My Earnings</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-none shadow-sm">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-xl bg-[#03373D] p-3">
              <Wallet className="h-6 w-6 text-white" />
            </div>

            <div>
              <p className="text-sm text-gray-500">Total Earning</p>

              <h2 className="mt-1 text-2xl font-bold text-[#03373D]">
                ৳{summary?.totalEarning?.toLocaleString()}
              </h2>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-xl bg-green-100 p-3">
              <Banknote className="h-6 w-6 text-green-600" />
            </div>

            <div>
              <p className="text-sm text-gray-500">Total Cashed Out</p>

              <h2 className="mt-1 text-2xl font-bold text-green-600">
                ৳{summary?.totalCashedOut?.toLocaleString()}
              </h2>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-xl bg-yellow-100 p-3">
              <Clock3 className="h-6 w-6 text-yellow-600" />
            </div>

            <div>
              <p className="text-sm text-gray-500">Total Pending</p>

              <h2 className="mt-1 text-2xl font-bold text-yellow-600">
                ৳{summary?.totalPending?.toLocaleString()}
              </h2>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-[#03373D]">
            Earnings Analysis
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <Card className="border-none shadow-sm">
            <CardContent className="p-5">
              <div className="mb-3 flex items-center justify-between">
                <div className="rounded-lg bg-blue-100 p-2">
                  <CalendarDays className="h-5 w-5 text-blue-600" />
                </div>

                <span className="text-xs font-medium text-gray-400">TODAY</span>
              </div>

              <p className="text-sm text-gray-500">Earning Today</p>

              <h3 className="mt-1 text-xl font-bold text-[#03373D]">
                ৳{earningsAnalysis?.today?.toLocaleString()}
              </h3>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardContent className="p-5">
              <div className="mb-3 flex items-center justify-between">
                <div className="rounded-lg bg-purple-100 p-2">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                </div>

                <span className="text-xs font-medium text-gray-400">WEEK</span>
              </div>

              <p className="text-sm text-gray-500">This Week</p>

              <h3 className="mt-1 text-xl font-bold text-[#03373D]">
                ৳{earningsAnalysis?.week?.toLocaleString()}
              </h3>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardContent className="p-5">
              <div className="mb-3 flex items-center justify-between">
                <div className="rounded-lg bg-orange-100 p-2">
                  <CalendarDays className="h-5 w-5 text-orange-600" />
                </div>

                <span className="text-xs font-medium text-gray-400">MONTH</span>
              </div>

              <p className="text-sm text-gray-500">This Month</p>

              <h3 className="mt-1 text-xl font-bold text-[#03373D]">
                ৳{earningsAnalysis.month.toLocaleString()}
              </h3>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardContent className="p-5">
              <div className="mb-3 flex items-center justify-between">
                <div className="rounded-lg bg-green-100 p-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>

                <span className="text-xs font-medium text-gray-400">YEAR</span>
              </div>

              <p className="text-sm text-gray-500">This Year</p>

              <h3 className="mt-1 text-xl font-bold text-[#03373D]">
                ৳{earningsAnalysis.year.toLocaleString()}
              </h3>
            </CardContent>
          </Card>

          <Card className="border-none bg-[#03373D] shadow-sm">
            <CardContent className="p-5">
              <div className="mb-3 flex items-center justify-between">
                <div className="rounded-lg bg-white/10 p-2">
                  <CircleDollarSign className="h-5 w-5 text-[#CAEB66]" />
                </div>

                <span className="text-xs font-medium text-white/60">
                  ALL TIME
                </span>
              </div>

              <p className="text-sm text-white/70">Overall</p>

              <h3 className="mt-1 text-xl font-bold text-[#CAEB66]">
                ৳{earningsAnalysis.overall.toLocaleString()}
              </h3>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="border-none shadow-sm">
        <CardContent className="p-0">
          <div className="flex flex-col gap-4 border-b p-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-[#03373D]">
                Earnings History
              </h2>

              <p className="text-sm text-gray-500">
                View all your delivery earnings.
              </p>
            </div>

            <div className="relative w-full md:w-[300px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

              <Input
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search tracking ID..."
                className="pl-9 pr-9"
              />

              {searchValue && (
                <button
                  type="button"
                  onClick={() => setSearchValue("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {filteredCashouts?.length === 0 ? (
            <div className="flex min-h-[280px] flex-col items-center justify-center text-center">
              <div className="rounded-full bg-gray-100 p-4">
                <Wallet className="h-7 w-7 text-gray-400" />
              </div>

              <h3 className="mt-4 font-semibold text-gray-700">
                No earnings found
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                {searchValue
                  ? "No earnings match your search."
                  : "You don't have any earnings yet."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tracking ID</TableHead>
                    <TableHead>Delivery Type</TableHead>
                    <TableHead>Delivery Cost</TableHead>
                    <TableHead>Rate</TableHead>
                    <TableHead>Earning</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filteredCashouts.map((cashout) => (
                    <TableRow key={cashout?._id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <PackageCheck className="h-4 w-4 text-[#03373D]" />

                          <span className="font-medium text-[#03373D]">
                            {cashout?.trackingId || "N/A"}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell>
                        {cashout?.serviceCenterType ===
                        "same_service_center" ? (
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                            Same Service Center
                          </Badge>
                        ) : (
                          <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">
                            Different Service Center
                          </Badge>
                        )}
                      </TableCell>

                      <TableCell>
                        ৳{Number(cashout?.deliveryCost || 0).toLocaleString()}
                      </TableCell>

                      <TableCell>
                        <span className="font-semibold text-[#03373D]">
                          {cashout?.percentage || 0}%
                        </span>
                      </TableCell>

                      <TableCell>
                        <span className="font-bold text-[#03373D]">
                          ৳{Number(cashout?.amount || 0).toLocaleString()}
                        </span>
                      </TableCell>

                      <TableCell>
                        {getStatusBadge(cashout?.cashoutStatus)}
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <CalendarDays className="h-4 w-4" />

                          {cashout?.requestedAt
                            ? new Date(cashout.requestedAt)?.toLocaleDateString(
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

export default MyEarnings;

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Search,
  X,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  UserRound,
  Loader2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useAxiosSecure from "@/hooks/useAxiosSecure";

const DeliveryManagement = () => {
  const axiosSecure = useAxiosSecure();
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Get all parcels
  const {
    data: parcels = [],
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["delivery-management"],
    queryFn: async () => {
      const response = await axiosSecure.get("/parcels");
      return response.data.parcels || [];
    },
  });

  // Search + status filter
  const filteredParcels = useMemo(() => {
    const search = searchValue?.trim()?.toLowerCase();

    return parcels
      ?.filter((parcel) => parcel.paymentStatus === "succeeded")
      ?.filter((parcel) => {
        const matchesSearch =
          !search ||
          String(parcel.parcelName || "")
            ?.toLowerCase()
            ?.includes(search) ||
          String(parcel.trackingId || "")
            ?.toLowerCase()
            ?.includes(search) ||
          String(parcel.assignedRiderName || "")
            ?.toLowerCase()
            ?.includes(search) ||
          String(parcel.assignedRiderEmail || "")
            ?.toLowerCase()
            ?.includes(search) ||
          String(parcel.receiverName || "")
            ?.toLowerCase()
            ?.includes(search);

        const matchesStatus =
          statusFilter === "all" || parcel.delivery_Status === statusFilter;

        return matchesSearch && matchesStatus;
      });
  }, [parcels, searchValue, statusFilter]);

  const paidParcels = useMemo(() => {
    return parcels?.filter((parcel) => parcel.paymentStatus === "succeeded");
  }, [parcels]);

  const statistics = useMemo(() => {
    return {
      total: paidParcels?.length,

      assigned: paidParcels?.filter(
        (parcel) => parcel.delivery_Status === "assign_rider",
      )?.length,

      inTransit: paidParcels?.filter(
        (parcel) => parcel.delivery_Status === "in-transit",
      )?.length,

      delivered: paidParcels?.filter(
        (parcel) => parcel.delivery_Status === "delivered",
      )?.length,
    };
  }, [paidParcels]);

  const getStatusBadge = (status) => {
    switch (status) {
      case "assign_rider":
        return (
          <Badge className="border-0 bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
            Rider Assigned
          </Badge>
        );

      case "in-transit":
        return (
          <Badge className="border-0 bg-blue-100 text-blue-700 hover:bg-blue-100">
            In Transit
          </Badge>
        );

      case "delivered":
        return (
          <Badge className="border-0 bg-green-100 text-green-700 hover:bg-green-100">
            Delivered
          </Badge>
        );

      case "not_collected":
        return (
          <Badge className="border-0 bg-gray-100 text-gray-700 hover:bg-gray-100">
            Not Collected
          </Badge>
        );

      default:
        return <Badge variant="outline">{status || "Unknown"}</Badge>;
    }
  };

  if (isPending) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#03373D]" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
        <p className="font-medium text-red-600">
          Failed to load delivery information.
        </p>

        <p className="mt-1 text-sm text-red-500">
          {error?.response?.data?.message ||
            error?.message ||
            "Something went wrong"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#03373D]">
          Delivery Management
        </h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#71717A]">Total Parcels</p>
              <p className="mt-1 text-2xl font-bold text-[#03373D]">
                {statistics?.total}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gray-100">
              <Package className="h-5 w-5 text-[#03373D]" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#71717A]">Rider Assigned</p>

              <p className="mt-1 text-2xl font-bold text-yellow-600">
                {statistics?.assigned}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-yellow-50">
              <UserRound className="h-5 w-5 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#71717A]">In Transit</p>

              <p className="mt-1 text-2xl font-bold text-blue-600">
                {statistics?.inTransit}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50">
              <Truck className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#71717A]">Delivered</p>

              <p className="mt-1 text-2xl font-bold text-green-600">
                {statistics?.delivered}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-green-50">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-semibold text-[#03373D]">All Deliveries</h2>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#71717A]" />

              <Input
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search parcel, tracking, rider..."
                className="w-full pl-9 pr-9 sm:w-[280px]"
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

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="not_collected">Not Collected</SelectItem>
                <SelectItem value="assign_rider">Rider Assigned</SelectItem>
                <SelectItem value="in-transit">In Transit</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {filteredParcels?.length === 0 ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center text-center">
            <Package className="mb-3 h-12 w-12 text-gray-300" />

            <h3 className="font-semibold text-[#03373D]">
              No deliveries found
            </h3>

            <p className="mt-1 text-sm text-[#71717A]">
              Try changing your search or status filter.
            </p>
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>Parcel</TableHead>
                  <TableHead>Tracking ID</TableHead>
                  <TableHead>Sender</TableHead>
                  <TableHead>Receiver</TableHead>
                  <TableHead>Rider</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Cost</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredParcels?.map((parcel) => (
                  <TableRow key={parcel._id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-[#03373D]">
                          {parcel.parcelName}
                        </p>

                        <p className="text-xs capitalize text-[#71717A]">
                          {parcel.parcelType}
                          {parcel.parcelWeight
                            ? ` · ${parcel.parcelWeight} kg`
                            : ""}
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
                            {parcel.senderName}
                          </p>

                          <p className="text-xs text-[#71717A]">
                            {parcel.senderServiceCenter},{" "}
                            {parcel.senderDistrict}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div>
                        <p className="text-sm font-medium">
                          {parcel.receiverName}
                        </p>

                        <p className="text-xs text-[#71717A]">
                          {parcel.receiverServiceCenter},{" "}
                          {parcel.receiverDistrict}
                        </p>
                      </div>
                    </TableCell>

                    <TableCell>
                      {parcel?.assignedRiderName ? (
                        <div>
                          <p className="text-sm font-medium">
                            {parcel.assignedRiderName}
                          </p>

                          <p className="text-xs text-[#71717A]">
                            {parcel.assignedRiderEmail}
                          </p>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">
                          Not Assigned
                        </span>
                      )}
                    </TableCell>

                    <TableCell>
                      {getStatusBadge(parcel.delivery_Status)}
                    </TableCell>

                    <TableCell>
                      <span className="font-medium text-[#03373D]">
                        TK{parcel.deliveryCost}
                      </span>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-1 text-xs text-[#71717A]">
                        <Clock className="h-3.5 w-3.5" />

                        {parcel.creation_date
                          ? new Date(parcel.creation_date).toLocaleDateString()
                          : "-"}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {filteredParcels?.length > 0 && (
          <div className="border-t px-5 py-3">
            <p className="text-xs text-[#71717A]">
              Showing{" "}
              <span className="font-medium text-[#03373D]">
                {filteredParcels?.length}
              </span>{" "}
              of{" "}
              <span className="font-medium text-[#03373D]">
                {parcels?.length}
              </span>
              parcels
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryManagement;

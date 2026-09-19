import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Search,
  X,
  MapPin,
  Package,
  Clock3,
  CheckCircle2,
  CreditCard,
  Truck,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSearchParams } from "react-router";
import useAxiosSecure from "@/hooks/useAxiosSecure";

export default function TrackingPackage() {
  const axiosSecure = useAxiosSecure();
  const [searchParams, setSearchParams] = useSearchParams();
  const urlTrackingId = searchParams.get("trackingId") || "";
  const [searchValue, setSearchValue] = useState(urlTrackingId);
  const trackingId = urlTrackingId.trim();
  const {
    data: parcels = [],
    isPending: parcelsPending,
    isError: parcelsIsError,
    error: parcelsError,
  } = useQuery({
    queryKey: ["all-parcels"],
    queryFn: async () => {
      const response = await axiosSecure.get("/parcels");
      const responseData = response?.data;

      if (Array.isArray(responseData)) {
        return responseData;
      }

      if (Array.isArray(responseData?.parcels)) {
        return responseData.parcels;
      }

      if (Array.isArray(responseData?.data)) {
        return responseData.data;
      }

      return [];
    },
  });

  const {
    data: trackingData = {},
    isPending: trackingPending,
    isError: trackingIsError,
    error: trackingError,
  } = useQuery({
    queryKey: ["tracking", trackingId],

    enabled: Boolean(trackingId),

    queryFn: async () => {
      const response = await axiosSecure.get(`/tracking/${trackingId}`);

      console.log("Tracking response:", response.data.data);
      return response?.data?.data || {};
    },
  });

  const parcel = trackingData?.parcel || null;

  const handleSearch = () => {
    const value = searchValue.trim();

    if (!value) {
      return;
    }

    setSearchParams({
      trackingId: value,
    });
  };

  const handleClear = () => {
    setSearchValue("");
    setSearchParams({});
  };

  const tracking = useMemo(() => {
    return Array.isArray(trackingData?.tracking) ? trackingData.tracking : [];
  }, [trackingData.tracking]);

  const sortedTracking = useMemo(() => {
    return [...tracking].sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    );
  }, [tracking]);

  const getStatusLabel = (status) => {
    if (!status) {
      return "Unknown";
    }

    return status.replaceAll("_", " ");
  };

  const getPaymentStatusClass = (status) => {
    if (status === "succeeded") {
      return "bg-green-100 text-green-700 hover:bg-green-100";
    }

    return "bg-yellow-100 text-yellow-700 hover:bg-yellow-100";
  };

  const getDeliveryStatusClass = (status) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-700 hover:bg-green-100";

      case "in-transit":
        return "bg-blue-100 text-blue-700 hover:bg-blue-100";

      case "assign_rider":
        return "bg-yellow-100 text-yellow-700 hover:bg-yellow-100";

      case "not_collected":
        return "bg-gray-100 text-gray-700 hover:bg-gray-100";

      default:
        return "bg-[#F1F5F5] text-[#03373D] hover:bg-[#F1F5F5]";
    }
  };

  const getTrackingIcon = (status, isLast) => {
    if (isLast) {
      return <CheckCircle2 className="h-4 w-4" />;
    }

    if (status === "payment_completed") {
      return <CreditCard className="h-4 w-4" />;
    }

    if (status === "rider_assigned" || status === "picked_up") {
      return <Truck className="h-4 w-4" />;
    }

    return <Clock3 className="h-4 w-4" />;
  };

  const formatDate = (date) => {
    if (!date) {
      return "—";
    }

    return new Date(date).toLocaleString("en-BD", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#03373D]">Track Your Parcel</h1>
      </div>

      <Card className="border-[#E5E7EB] shadow-none">
        <CardContent className="p-5">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A1A1AA]" />

              <Input
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
                placeholder="Enter tracking ID..."
                className="h-10 pl-9 pr-9 text-sm"
              />

              {searchValue && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full hover:bg-[#F1F5F5]"
                >
                  <X className="h-4 w-4 text-[#71717A]" />
                </button>
              )}
            </div>

            <Button
              type="button"
              onClick={handleSearch}
              disabled={!searchValue.trim()}
              className="h-10 cursor-pointer bg-[#CAEB66] px-6 text-black hover:bg-[#CAEB66]"
            >
              Track Parcel
            </Button>
          </div>
        </CardContent>
      </Card>

      {!trackingId && (
        <Card className="border-[#E5E7EB] shadow-none">
          <CardContent className="p-5 sm:p-7">
            <div className="mb-5">
              <h2 className="text-lg font-semibold text-[#03373D]">
                All Parcels
              </h2>
            </div>

            {parcelsPending && (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F1F5F5]">
                  <Package className="h-6 w-6 animate-pulse text-[#067A87]" />
                </div>

                <p className="mt-4 text-sm text-[#71717A]">
                  Loading parcels...
                </p>
              </div>
            )}

            {parcelsIsError && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-5 py-8 text-center">
                <Package className="mx-auto h-8 w-8 text-red-500" />

                <p className="mt-3 font-semibold text-red-600">
                  Failed to load parcels
                </p>

                <p className="mt-1 text-sm text-red-500">
                  {parcelsError?.response?.data?.message ||
                    parcelsError?.message ||
                    "Something went wrong while loading parcels."}
                </p>
              </div>
            )}

            {!parcelsPending && !parcelsIsError && parcels.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F1F5F5]">
                  <Package className="h-6 w-6 text-[#067A87]" />
                </div>

                <p className="mt-3 font-semibold text-[#03373D]">
                  No parcels found
                </p>

                <p className="mt-1 text-sm text-[#71717A]">
                  There are currently no parcels available.
                </p>
              </div>
            )}

            {!parcelsPending && !parcelsIsError && parcels.length > 0 && (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Parcel</TableHead>
                      <TableHead>Tracking ID</TableHead>
                      <TableHead>Receiver</TableHead>
                      <TableHead>Delivery To</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Updated</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {parcels.map((item) => (
                      <TableRow key={item._id}>
                        <TableCell>
                          <div>
                            <p className="font-medium text-[#03373D]">
                              {item.parcelName || "Unnamed Parcel"}
                            </p>

                            <p className="text-xs capitalize text-[#71717A]">
                              {item.parcelType?.replaceAll("-", " ") ||
                                "Unknown"}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <button
                            type="button"
                            onClick={() => {
                              setSearchValue(item.trackingId || "");

                              if (item.trackingId) {
                                setSearchParams({
                                  trackingId: item.trackingId,
                                });
                              }
                            }}
                            className="cursor-pointer font-mono text-sm font-medium text-[#067A87] hover:underline"
                          >
                            {item.trackingId || "—"}
                          </button>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-[#03373D]">
                              {item.receiverName || "—"}
                            </p>

                            <p className="text-xs text-[#71717A]">
                              {item.receiverPhone || "—"}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-[#03373D]">
                            <p>{item.receiverDistrict || "—"}</p>

                            {item.receiverServiceCenter && (
                              <p className="text-xs text-[#71717A]">
                                {item.receiverServiceCenter}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`capitalize ${getPaymentStatusClass(
                              item.paymentStatus,
                            )}`}
                          >
                            {item.paymentStatus || "pending"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`capitalize ${getDeliveryStatusClass(
                              item.delivery_Status,
                            )}`}
                          >
                            {getStatusLabel(item.delivery_Status)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="whitespace-nowrap text-xs text-[#71717A]">
                            {formatDate(item.updatedAt || item.creation_date)}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {trackingId && trackingPending && (
        <Card className="border-[#E5E7EB] shadow-none">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F1F5F5]">
              <Package className="h-6 w-6 animate-pulse text-[#067A87]" />
            </div>

            <p className="mt-4 font-medium text-[#03373D]">
              Loading tracking information...
            </p>

            <p className="mt-1 text-sm text-[#71717A]">
              Please wait while we find your parcel.
            </p>
          </CardContent>
        </Card>
      )}

      {trackingId && trackingIsError && (
        <Card className="border-red-200 shadow-none">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
              <Package className="h-6 w-6 text-red-500" />
            </div>

            <p className="mt-4 font-semibold text-red-600">
              Tracking information not found
            </p>

            <p className="mt-1 max-w-md text-sm text-[#71717A]">
              {trackingError?.response?.data?.message ||
                trackingError?.message ||
                "Please check your tracking ID and try again."}
            </p>
          </CardContent>
        </Card>
      )}

      {trackingId &&
        !trackingPending &&
        !trackingIsError &&
        sortedTracking.length === 0 && (
          <Card className="border-dashed border-[#D9E0E5] shadow-none">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F1F5F5]">
                <Package className="h-6 w-6 text-[#03373D]" />
              </div>

              <p className="mt-4 font-semibold text-[#03373D]">
                No tracking updates found
              </p>

              <p className="mt-1 text-sm text-[#71717A]">
                Please check your tracking ID and try again.
              </p>
            </CardContent>
          </Card>
        )}

      {trackingId &&
        !trackingPending &&
        !trackingIsError &&
        sortedTracking.length > 0 && (
          <Card className="border-[#E5E7EB] shadow-none">
            <CardContent className="p-5 sm:p-7">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-medium text-[#71717A]">
                    Tracking ID
                  </p>

                  <p className="mt-1 font-mono text-sm font-semibold text-[#067A87]">
                    {trackingId}
                  </p>
                </div>

                <Badge className="w-fit bg-[#CAEB66] px-3 py-1 text-black capitalize hover:bg-[#CAEB66]">
                  {getStatusLabel(
                    parcel?.delivery_Status || sortedTracking.at(-1)?.status,
                  )}
                </Badge>
              </div>

              <Separator className="my-6" />

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-[#71717A]">Parcel Name</p>

                  <p className="mt-1 text-sm font-semibold text-[#03373D]">
                    {parcel?.parcelName || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#71717A]">Parcel Type</p>

                  <p className="mt-1 text-sm font-semibold capitalize text-[#03373D]">
                    {parcel?.parcelType?.replaceAll("-", " ") || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#71717A]">Pickup</p>

                  <div className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-[#03373D]">
                    <MapPin className="h-3.5 w-3.5 text-[#067A87]" />

                    <span>
                      {parcel?.senderDistrict || "—"}

                      {parcel?.senderServiceCenter &&
                        `, ${parcel.senderServiceCenter}`}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-[#71717A]">Delivery To</p>
                  <div className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-[#03373D]">
                    <MapPin className="h-3.5 w-3.5 text-[#067A87]" />
                    <span>
                      {parcel?.receiverDistrict || "—"}

                      {parcel?.receiverServiceCenter &&
                        `, ${parcel.receiverServiceCenter}`}
                    </span>
                  </div>
                </div>
              </div>

              <Separator className="my-7" />
              <div>
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-[#03373D]">
                    Delivery Timeline
                  </h2>

                  <p className="mt-1 text-sm text-[#71717A]">
                    Follow your parcel's delivery progress.
                  </p>
                </div>
                <div className="relative">
                  {sortedTracking.map((item, index) => {
                    const isLast = index === sortedTracking.length - 1;

                    return (
                      <div
                        key={`${item._id || item.createdAt}-${index}`}
                        className="relative flex gap-4 pb-8 last:pb-0"
                      >
                        {!isLast && (
                          <div className="absolute left-4 top-8 bottom-0 w-px bg-[#D9E0E5]" />
                        )}
                        <div
                          className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${
                            isLast
                              ? "border-[#CAEB66] bg-[#CAEB66] text-[#03373D]"
                              : "border-[#D9E0E5] bg-white text-[#067A87]"
                          }`}
                        >
                          {getTrackingIcon(item.status, isLast)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-sm font-semibold text-[#03373D]">
                              {item.title || getStatusLabel(item.status)}
                            </h3>

                            <Badge
                              variant="outline"
                              className="border-[#D9E0E5] text-[10px] capitalize text-[#067A87]"
                            >
                              {getStatusLabel(item.status)}
                            </Badge>
                          </div>
                          {item.description && (
                            <p className="mt-1 text-sm leading-6 text-[#71717A]">
                              {item.description}
                            </p>
                          )}

                          {item.location && (
                            <div className="mt-2 flex items-center gap-1.5 text-xs text-[#71717A]">
                              <MapPin className="h-3.5 w-3.5 text-[#067A87]" />

                              <span>
                                {item.location.district || "—"}

                                {item.location.serviceCenter &&
                                  `, ${item.location.serviceCenter}`}
                              </span>
                            </div>
                          )}
                          <p className="mt-2 text-[11px] text-[#A1A1AA]">
                            {formatDate(item.createdAt)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
    </div>
  );
}

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, X, Eye, MapPin, Package } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useAuth from "@/hooks/useAuth";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { useNavigate } from "react-router";

export default function ManageParcel() {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const {
    data: parcels = [],
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["manage-parcels", user?.email],
    enabled: !!user?.email,

    queryFn: async () => {
      const response = await axiosSecure.get(`/parcels?email=${user?.email}`);
      return response?.data?.parcels || [];
    },
  });

  const filteredParcels = useMemo(() => {
    const search = searchValue.trim()?.toLowerCase();

    if (!search) {
      return parcels;
    }

    return parcels?.filter((parcel) => {
      const parcelName = String(parcel?.parcelName || "")?.toLowerCase();
      const receiverPhone = String(parcel?.receiverPhone || "")?.toLowerCase();
      const trackingId = String(parcel?.trackingId || "")?.toLowerCase();

      return (
        parcelName?.includes(search) ||
        receiverPhone?.includes(search) ||
        trackingId?.includes(search)
      );
    });
  }, [parcels, searchValue]);

  const handleClearSearch = () => {
    setSearchValue("");
  };

  const handleTrack = (trackingId) => {
    navigate(`/dashboard/tracking?trackingId=${trackingId}`);
  };

  //   const handleView = (parcelId) => {
  //     navigate(`/dashboard/parcel/${parcelId}`);
  //   };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#03373D]">Manage Parcel</h1>
      </div>

      <Card className="border-[#E5E7EB] shadow-none">
        <CardContent className="p-4">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs text-[#71717A]">Total Parcels</p>
              <p className="mt-1 text-2xl font-bold text-[#03373D]">
                {parcels?.length}
              </p>
            </div>

            <div className="flex w-full max-w-md gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A1A1AA]" />
                <Input
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Search parcel, phone or tracking ID..."
                  className="h-9 pl-9 pr-9 text-xs"
                />

                {searchValue && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="absolute right-2 top-1/2 flex h-5 w-5 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-[#71717A] hover:bg-[#F1F5F5]"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error */}
      {isError && (
        <Card className="border-red-200 shadow-none">
          <CardContent className="py-8 text-center">
            <p className="font-semibold text-red-600">
              Failed to load parcels.
            </p>
            <p className="mt-1 text-sm text-[#71717A]">
              {error?.response?.data?.message || "Something went wrong."}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Table */}
      {!isError && (
        <Card className="border-[#E5E7EB] shadow-none">
          <CardHeader className="border-b border-[#E5E7EB] px-5 py-4">
            <CardTitle className="text-sm font-semibold text-[#03373D]">
              All Parcels
            </CardTitle>
          </CardHeader>

          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#F8FAFA]">
                    <TableHead className="whitespace-nowrap text-xs font-semibold text-[#03373D]">
                      Date
                    </TableHead>

                    <TableHead className="whitespace-nowrap text-xs font-semibold text-[#03373D]">
                      Parcel
                    </TableHead>

                    <TableHead className="whitespace-nowrap text-xs font-semibold text-[#03373D]">
                      Receiver
                    </TableHead>

                    <TableHead className="whitespace-nowrap text-xs font-semibold text-[#03373D]">
                      Tracking ID
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
                  {isPending ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="h-32 text-center text-sm text-[#71717A]"
                      >
                        Loading parcels...
                      </TableCell>
                    </TableRow>
                  ) : filteredParcels?.length > 0 ? (
                    filteredParcels?.map((parcel) => (
                      <TableRow key={parcel._id} className="hover:bg-[#F8FAFA]">
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

                        <TableCell>
                          <div>
                            <p className="max-w-[150px] truncate text-xs font-semibold text-[#03373D]">
                              {parcel.parcelName}
                            </p>
                            <Badge
                              variant="outline"
                              className="mt-1 text-[9px] capitalize"
                            >
                              {parcel.parcelType}
                            </Badge>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div>
                            <p className="text-xs font-medium text-[#03373D]">
                              {parcel.receiverName}
                            </p>
                            <p className="mt-1 text-[10px] text-[#71717A]">
                              {parcel.receiverPhone}
                            </p>
                          </div>
                        </TableCell>

                        <TableCell className="whitespace-nowrap font-mono text-[10px] text-[#067A87]">
                          {parcel.trackingId || "Not assigned"}
                        </TableCell>

                        <TableCell>
                          <Badge
                            className={
                              parcel.delivery_Status === "delivered"
                                ? "bg-green-100 text-green-700 hover:bg-green-100"
                                : "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
                            }
                          >
                            {(parcel.delivery_Status || "pending").replaceAll(
                              "_",
                              " ",
                            )}
                          </Badge>
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            <Button
                              type="button"
                              size="icon"
                              variant="outline"
                              disabled={!parcel.trackingId}
                              onClick={() => handleTrack(parcel.trackingId)}
                              className="h-7 w-7 cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
                              title="Track"
                            >
                              <MapPin className="h-3.5 w-3.5" />
                            </Button>

                            {/* <Button
                              type="button"
                              size="icon"
                              variant="outline"
                              onClick={() => handleView(parcel._id)}
                              className="h-7 w-7 cursor-pointer"
                              title="View"
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </Button> */}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-36 text-center">
                        <Package className="mx-auto h-7 w-7 text-[#A1A1AA]" />

                        <p className="mt-2 text-sm font-medium text-[#03373D]">
                          No parcels found
                        </p>

                        {searchValue && (
                          <p className="mt-1 text-xs text-[#71717A]">
                            Try another parcel name, phone number or tracking
                            ID.
                          </p>
                        )}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

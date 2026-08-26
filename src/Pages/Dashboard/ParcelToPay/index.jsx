import { useQuery } from "@tanstack/react-query";
import { CreditCard, Search, X } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
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
import useAuth from "@/hooks/useAuth";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { useMemo, useState } from "react";

export default function ParcelToPay() {
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
    queryKey: ["parcel-to-pay", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const response = await axiosSecure.get(`/parcels?email=${user.email}`);

      // Only pending parcels
      return response?.data?.parcels?.filter(
        (parcel) => parcel.paymentStatus === "pending",
      );
    },
  });

  // search logic
  const filteredParcels = useMemo(() => {
    const search = searchValue.trim()?.toLowerCase();

    if (!search) {
      return parcels;
    }

    return parcels?.filter((parcel) => {
      const parcelName = String(parcel.parcelName || "")?.toLowerCase();
      const receiverPhone = String(parcel.receiverPhone || "")?.toLowerCase();
      const trackingId = String(parcel.trackingId || "")?.toLowerCase();

      return (
        parcelName?.includes(search) ||
        receiverPhone?.includes(search) ||
        trackingId?.includes(search)
      );
    });
  }, [parcels, searchValue]);

  if (isPending) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-sm text-[#71717A]">Loading parcels...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-sm text-red-500">
          {error?.response?.data?.message || "Failed to load parcels"}
        </p>
      </div>
    );
  }

  return (
    <section className="w-full">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-[#03373D]">
          Parcel To Pay
        </h1>
      </div>

      {/* Summary + Search */}
      <div className="mb-5 flex flex-col justify-between gap-4 rounded-xl border border-[#E5E7EB] bg-white p-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs text-[#71717A]">Total Unpaid Parcels</p>

          <p className="mt-1 text-2xl font-bold text-[#03373D]">
            {parcels?.length}
          </p>
        </div>

        <div className="flex w-full max-w-sm items-center gap-2">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A1A1AA]" />

            <Input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search parcel name, receiver phone or tracking ID..."
              className="h-9 pl-9 pr-9 text-xs"
            />

            {searchValue && (
              <button
                type="button"
                onClick={() => setSearchValue("")}
                className="absolute right-2 top-1/2 flex h-5 w-5 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-[#71717A] hover:bg-[#F1F5F5] hover:text-[#03373D]"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-[#E5E7EB] bg-white">
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
                Receiver
              </TableHead>

              <TableHead className="whitespace-nowrap text-xs font-semibold text-[#03373D]">
                Tracking ID
              </TableHead>

              <TableHead className="whitespace-nowrap text-xs font-semibold text-[#03373D]">
                Cost
              </TableHead>

              <TableHead className="whitespace-nowrap text-xs font-semibold text-[#03373D]">
                Payment Status
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
                  {/* Date */}
                  <TableCell className="whitespace-nowrap text-xs text-[#52525B]">
                    {new Date(parcel.creation_date)?.toLocaleDateString(
                      "en-BD",
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      },
                    )}
                  </TableCell>

                  {/* Parcel Name */}
                  <TableCell className="max-w-[180px] truncate text-xs font-medium text-[#03373D]">
                    {parcel.parcelName}
                  </TableCell>

                  {/* Receiver */}
                  <TableCell>
                    <div>
                      <p className="whitespace-nowrap text-xs font-medium text-[#03373D]">
                        {parcel.receiverName}
                      </p>

                      <p className="whitespace-nowrap text-[10px] text-[#71717A]">
                        {parcel.receiverPhone}
                      </p>
                    </div>
                  </TableCell>

                  {/* Tracking */}
                  <TableCell className="whitespace-nowrap font-mono text-[10px] text-[#067A87]">
                    {parcel.trackingId}
                  </TableCell>

                  {/* Cost */}
                  <TableCell className="whitespace-nowrap text-xs font-bold text-[#03373D]">
                    ৳{parcel.deliveryCost}
                  </TableCell>

                  {/* Payment */}
                  <TableCell>
                    <Badge className="border-yellow-200 bg-yellow-100 text-[10px] text-yellow-700 hover:bg-yellow-100">
                      Unpaid
                    </Badge>
                  </TableCell>

                  {/* Actions */}
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      {/* Pay */}
                      <Button
                        type="button"
                        size="icon"
                        title="Pay Now"
                        onClick={() =>
                          navigate(`/dashboard/payments/${parcel._id}`)
                        }
                        className="h-7 w-7 cursor-pointer bg-[#CAEB66] text-black hover:bg-[#CAEB66] hover:brightness-95"
                      >
                        <CreditCard className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-40 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <CreditCard className="mb-2 h-8 w-8 text-[#A1A1AA]" />

                    <p className="text-sm font-medium text-[#03373D]">
                      No unpaid parcels
                    </p>

                    <p className="mt-1 text-xs text-[#71717A]">
                      You don't have any parcels waiting for payment.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}

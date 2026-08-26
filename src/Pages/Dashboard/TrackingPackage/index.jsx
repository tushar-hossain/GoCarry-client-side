import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, X, MapPin, Package, Clock3, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useSearchParams } from "react-router";
import useAxiosSecure from "@/hooks/useAxiosSecure";

export default function TrackingPackage() {
  const axiosSecure = useAxiosSecure();
  const [searchParams, setSearchParams] = useSearchParams();
  const urlTrackingId = searchParams.get("trackingId") || "";
  const [searchValue, setSearchValue] = useState(urlTrackingId);
  const trackingId = urlTrackingId.trim();

  const {
    data: trackingData = [],
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["tracking", trackingId],
    enabled: !!trackingId,
    queryFn: async () => {
      const response = await axiosSecure.get(`/tracking/${trackingId}`);
      return response?.data?.data || [];
    },
  });

  const handleSearch = () => {
    const value = searchValue.trim();

    if (!value) return;

    setSearchParams({
      trackingId: value,
    });
  };

  const handleClear = () => {
    setSearchValue("");
    setSearchParams({});
  };

  const sortedTracking = useMemo(() => {
    return [...trackingData].sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    );
  }, [trackingData]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#03373D]">Track Your Parcel</h1>
      </div>

      {/* Search */}
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
              className="h-10 cursor-pointer bg-[#CAEB66] text-black px-6 hover:bg-[#CAEB66]"
            >
              Track Parcel
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* No Tracking ID */}
      {!trackingId && (
        <Card className="border-dashed border-[#D9E0E5] shadow-none">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#F1F5F5]">
              <Package className="h-6 w-6 text-[#03373D]" />
            </div>

            <h3 className="text-base font-semibold text-[#03373D]">
              Track your parcel
            </h3>

            <p className="mt-1 max-w-md text-sm text-[#71717A]">
              Enter your tracking ID above to view your parcel's complete
              delivery timeline.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Loading */}
      {trackingId && isPending && (
        <Card className="shadow-none">
          <CardContent className="py-12 text-center text-sm text-[#71717A]">
            Loading tracking information...
          </CardContent>
        </Card>
      )}

      {/* Error */}
      {trackingId && isError && (
        <Card className="border-red-200 shadow-none">
          <CardContent className="py-10 text-center">
            <p className="font-semibold text-red-600">
              Failed to load tracking information.
            </p>
            <p className="mt-1 text-sm text-[#71717A]">
              {error?.response?.data?.message ||
                "Tracking information not found."}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Empty */}
      {trackingId && !isPending && !isError && sortedTracking.length === 0 && (
        <Card className="shadow-none">
          <CardContent className="py-12 text-center">
            <Package className="mx-auto h-8 w-8 text-[#A1A1AA]" />
            <p className="mt-3 font-semibold text-[#03373D]">
              No tracking updates found
            </p>
            <p className="mt-1 text-sm text-[#71717A]">
              Please check your tracking ID and try again.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Tracking Timeline */}
      {sortedTracking?.length > 0 && (
        <Card className="shadow-none">
          <CardContent className="p-5 sm:p-7">
            <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <p className="text-xs text-[#71717A]">Tracking ID</p>
                <p className="mt-1 font-mono text-sm font-semibold text-[#067A87]">
                  {trackingId}
                </p>
              </div>

              <Badge className="w-fit bg-[#CAEB66] text-black hover:bg-[#CAEB66]">
                {sortedTracking.at(-1)?.status?.replaceAll("_", " ")}
              </Badge>
            </div>

            <Separator />

            {/* Timeline */}
            <div className="mt-7 space-y-0">
              {sortedTracking?.map((item, index) => {
                const isLast = index === sortedTracking?.length - 1;

                return (
                  <div
                    key={`${item.createdAt}-${index}`}
                    className="relative flex gap-4"
                  >
                    {!isLast && (
                      <div className="absolute left-[15px] top-8 h-[calc(100%+8px)] w-px bg-[#D9E0E5]" />
                    )}
                    <div
                      className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                        isLast
                          ? "bg-[#CAEB66] text-[#03373D]"
                          : "bg-[#F1F5F5] text-[#067A87]"
                      }`}
                    >
                      {isLast ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <Clock3 className="h-4 w-4" />
                      )}
                    </div>

                    <div className="pb-8">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-semibold text-[#03373D]">
                          {item.title}
                        </h3>

                        <Badge
                          variant="outline"
                          className="text-[10px] capitalize"
                        >
                          {item.status?.replaceAll("_", " ")}
                        </Badge>
                      </div>

                      <p className="mt-1 text-sm leading-6 text-[#71717A]">
                        {item.description}
                      </p>

                      {item?.location && (
                        <div className="mt-2 flex items-center gap-1.5 text-xs text-[#71717A]">
                          <MapPin className="h-3.5 w-3.5" />

                          <span>
                            {item.location.district}
                            {item.location.serviceCenter &&
                              `, ${item.location.serviceCenter}`}
                          </span>
                        </div>
                      )}

                      <p className="mt-2 text-[11px] text-[#A1A1AA]">
                        {new Date(item.createdAt).toLocaleString("en-BD", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

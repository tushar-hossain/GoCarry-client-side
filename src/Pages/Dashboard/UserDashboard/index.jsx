import {
  Package,
  Clock3,
  Truck,
  CheckCircle2,
  ArrowRight,
  MapPin,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import useAuth from "@/hooks/useAuth";
import { Link } from "react-router";
import LoadingSpinner from "@/Pages/Shared/Loading";

const UserDashboard = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const { data: dashboard = {}, isPending } = useQuery({
    queryKey: ["user-dashboard", user?.email],
    enabled: !!user?.email,

    queryFn: async () => {
      const response = await axiosSecure.get("/dashboard/user");

      return response.data?.data || {};
    },
  });

  const statistics = dashboard?.statistics || {};
  const recentParcels = dashboard?.recentParcels || [];

  if (isPending) {
    return <LoadingSpinner />;
  }

  const cards = [
    {
      title: "Total Parcels",
      value: statistics.totalParcels || 0,
      icon: Package,
    },
    {
      title: "Pending",
      value: statistics.pendingParcels || 0,
      icon: Clock3,
    },
    {
      title: "In Transit",
      value: statistics.inTransit || 0,
      icon: Truck,
    },
    {
      title: "Delivered",
      value: statistics.delivered || 0,
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#03373D]">
          Welcome back, {user?.displayName || "User"} 👋
        </h1>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards?.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="rounded-2xl bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#71717A]">{card.title}</p>

                  <h2 className="mt-2 text-2xl font-bold text-[#03373D]">
                    {card.value}
                  </h2>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eef8d5]">
                  <Icon className="h-5 w-5 text-[#03373D]" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl bg-white p-5 shadow-sm lg:col-span-2">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-[#03373D]">Recent Parcels</h2>
            </div>

            <Link
              to={"/dashboard/myParcel"}
              className="flex cursor-pointer items-center gap-1 text-sm font-medium text-[#067A87]"
            >
              View All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="space-y-3">
            {recentParcels?.map((parcel) => (
              <div
                key={parcel._id}
                className="flex flex-col gap-3 rounded-xl border border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#eef8d5]">
                    <Package className="h-5 w-5 text-[#03373D]" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-[#03373D]">
                      {parcel.parcelName}
                    </p>

                    <p className="text-xs text-[#71717A]">
                      {parcel.trackingId}
                    </p>
                  </div>
                </div>

                <span className="w-fit rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                  {parcel.delivery_Status}
                </span>
              </div>
            ))}

            {recentParcels?.length === 0 && (
              <div className="py-10 text-center text-sm text-[#71717A]">
                No parcels found.
              </div>
            )}
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-[#03373D]">Account Overview</h2>
          <div className="mt-5 rounded-xl bg-[#03373D] p-5 text-white">
            <p className="text-sm text-gray-300">Total Spent</p>
            <h2 className="mt-2 text-3xl font-bold">
              ${dashboard?.totalSpent || 0}
            </h2>
          </div>

          <div className="mt-4 space-y-3">
            <Link
              to={"/sendParcel"}
              className="flex w-full cursor-pointer items-center justify-between rounded-xl bg-[#CAEB66] px-4 py-3 text-sm font-semibold text-[#03373D]"
            >
              Send New Parcel
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              to={"/dashboard/tracking"}
              className="flex w-full cursor-pointer items-center justify-between rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-[#03373D]"
            >
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Track Parcel
              </span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;

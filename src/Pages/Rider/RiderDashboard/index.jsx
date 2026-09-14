import {
  Package,
  PackageCheck,
  Truck,
  DollarSign,
  Clock3,
  CheckCircle2,
  ArrowRight,
  MapPin,
  Navigation,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import useAuth from "@/hooks/useAuth";
import LoadingSpinner from "@/Pages/Shared/Loading";

const RiderDashboard = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const {
    data: dashboard = {},
    isPending,
    isError,
  } = useQuery({
    queryKey: ["rider-dashboard", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const response = await axiosSecure.get("/dashboard/rider");
      return response.data?.data || {};
    },
  });

  if (isPending) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return (
      <div className="flex min-h-100 items-center justify-center">
        <div className="rounded-xl bg-white px-6 py-8 text-center shadow-sm">
          <p className="font-medium text-red-500">Failed to load dashboard.</p>
        </div>
      </div>
    );
  }

  const statistics = dashboard?.statistics || {};
  const earnings = dashboard?.earnings || {};
  const recentDeliveries = dashboard?.recentDeliveries || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="mt-1 text-2xl font-bold text-[#03373D] sm:text-3xl">
            Welcome back, {user?.displayName || "Rider"} 👋
          </h1>
        </div>

        <div className="flex w-fit items-center gap-2 rounded-full bg-[#eef8d5] px-4 py-2">
          <span className="h-2.5 w-2.5 rounded-full bg-green-500" />

          <span className="text-sm font-semibold text-[#03373D]">
            Rider Active
          </span>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Assigned Deliveries"
          value={statistics.assignedDeliveries || 0}
          icon={Package}
          description="Waiting for pickup"
        />

        <DashboardCard
          title="In Transit"
          value={statistics.inTransit || 0}
          icon={Truck}
          description="Currently delivering"
        />

        <DashboardCard
          title="Completed"
          value={statistics.completed || 0}
          icon={PackageCheck}
          description="Successfully completed"
        />

        <DashboardCard
          title="Total Earnings"
          value={`$${earnings.totalEarnings || 0}`}
          icon={DollarSign}
          description="All rider earnings"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl bg-white p-5 shadow-sm lg:col-span-2">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-[#03373D]">Delivery Tasks</h2>
            </div>

            <Link
              to="/dashboard/pending-deliveries"
              className="flex items-center gap-1 text-sm font-medium text-[#067A87]"
            >
              View All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="space-y-3">
            {recentDeliveries?.length > 0 ? (
              recentDeliveries?.map((parcel) => (
                <div
                  key={parcel._id}
                  className="rounded-xl border border-gray-100 p-4 transition hover:border-[#CAEB66]"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#eef8d5]">
                        <Package className="h-5 w-5 text-[#03373D]" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#03373D]">
                          {parcel?.parcelName}
                        </p>
                        <p className="mt-1 text-xs text-[#71717A]">
                          {parcel?.trackingId}
                        </p>
                        <div className="mt-2 flex items-center gap-1 text-xs text-[#71717A]">
                          <MapPin className="h-3.5 w-3.5" />
                          <span>
                            {parcel.receiverDistrict},{" "}
                            {parcel.receiverServiceCenter}
                          </span>
                        </div>
                      </div>
                    </div>

                    <StatusBadge status={parcel.delivery_Status} />
                  </div>

                  <div className="mt-4 flex flex-col gap-3 border-t border-gray-100 pt-3 text-xs text-[#71717A] sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-1">
                      <Navigation className="h-3.5 w-3.5" />
                      <span>Deliver to {parcel.receiverName}</span>
                    </div>

                    <div className="font-medium text-[#03373D]">
                      Delivery Cost: ${parcel.deliveryCost || 0}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center">
                <PackageCheck className="mx-auto h-10 w-10 text-gray-300" />
                <p className="mt-3 text-sm font-medium text-[#03373D]">
                  No delivery tasks
                </p>
                <p className="mt-1 text-xs text-[#71717A]">
                  You don't have any assigned deliveries right now.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-[#03373D]">Earnings</h2>

              <p className="mt-1 text-xs text-[#71717A]">
                Your cashout overview
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eef8d5]">
              <DollarSign className="h-5 w-5 text-[#03373D]" />
            </div>
          </div>

          <div className="mt-5 space-y-3">
            <EarningRow
              title="Pending"
              amount={earnings.pendingAmount}
              icon={Clock3}
              bg="bg-yellow-50"
              iconColor="text-yellow-600"
            />

            <EarningRow
              title="Approved"
              amount={earnings.approvedAmount}
              icon={CheckCircle2}
              bg="bg-blue-50"
              iconColor="text-blue-600"
            />

            <EarningRow
              title="Paid"
              amount={earnings.paidAmount}
              icon={CheckCircle2}
              bg="bg-green-50"
              iconColor="text-green-600"
            />
          </div>

          <div className="mt-5 border-t border-gray-100 pt-5">
            <p className="text-xs text-[#71717A]">Total Earnings</p>

            <p className="mt-1 text-2xl font-bold text-[#03373D]">
              ${earnings.totalEarnings || 0}
            </p>
          </div>

          <Link
            to="/dashboard/my-earnings"
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-[#CAEB66] px-4 py-2.5 text-sm font-semibold text-[#03373D] transition hover:bg-[#b9dc5b]"
          >
            View Earnings
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div>
        <h2 className="mb-4 font-semibold text-[#03373D]">Quick Actions</h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <QuickAction
            icon={Package}
            title="Pending Tasks"
            description="View your assigned parcels"
            to="/dashboard/pending-deliveries"
          />

          <QuickAction
            icon={PackageCheck}
            title="Completed Deliveries"
            description="View completed deliveries"
            to="/dashboard/completed-deliveries"
          />

          <QuickAction
            icon={DollarSign}
            title="My Earnings"
            description="View cashouts and earnings"
            to="/dashboard/my-earnings"
          />
        </div>
      </div>
    </div>
  );
};

const DashboardCard = ({ title, value, icon: Icon, description }) => {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-[#71717A]">{title}</p>

          <h2 className="mt-2 text-2xl font-bold text-[#03373D]">{value}</h2>

          <p className="mt-1 text-xs text-[#71717A]">{description}</p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eef8d5]">
          <Icon className="h-5 w-5 text-[#03373D]" />
        </div>
      </div>
    </div>
  );
};

const EarningRow = ({ title, amount, icon: Icon, bg, iconColor }) => {
  return (
    <div className="flex items-center justify-between rounded-xl border border-gray-100 p-3">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-lg ${bg}`}
        >
          <Icon className={`h-4 w-4 ${iconColor}`} />
        </div>

        <span className="text-sm font-medium text-[#03373D]">{title}</span>
      </div>

      <span className="text-sm font-bold text-[#03373D]">${amount || 0}</span>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  if (status === "assign_rider") {
    return (
      <span className="w-fit rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700">
        Assigned
      </span>
    );
  }

  if (status === "in-transit") {
    return (
      <span className="w-fit rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
        In Transit
      </span>
    );
  }

  if (status === "delivered" || status === "service_center_delivered") {
    return (
      <span className="w-fit rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
        Completed
      </span>
    );
  }

  return (
    <span className="w-fit rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
      {status || "Unknown"}
    </span>
  );
};

const QuickAction = ({ icon: Icon, title, description, to }) => {
  return (
    <Link
      to={to}
      className="group flex items-center justify-between rounded-2xl bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eef8d5]">
          <Icon className="h-5 w-5 text-[#03373D]" />
        </div>
        <div>
          <p className="text-sm font-semibold text-[#03373D]">{title}</p>
          <p className="mt-1 text-xs text-[#71717A]">{description}</p>
        </div>
      </div>
      <ArrowRight className="h-4 w-4 text-gray-400 transition group-hover:translate-x-1" />
    </Link>
  );
};

export default RiderDashboard;

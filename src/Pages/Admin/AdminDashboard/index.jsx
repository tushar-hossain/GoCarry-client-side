import {
  Users,
  Bike,
  Package,
  Clock3,
  Truck,
  CheckCircle2,
  UserPlus,
  ArrowRight,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import LoadingSpinner from "@/Pages/Shared/Loading";
import { Link } from "react-router";
import { FaBangladeshiTakaSign } from "react-icons/fa6";

const AdminDashboard = () => {
  const axiosSecure = useAxiosSecure();

  const { data: dashboard = {}, isPending } = useQuery({
    queryKey: ["admin-dashboard"],

    queryFn: async () => {
      const response = await axiosSecure.get("/dashboard/admin");

      return response.data?.data || {};
    },
  });

  if (isPending) {
    return <LoadingSpinner />;
  }

  const users = dashboard?.users || {};
  const riders = dashboard?.riders || {};
  const parcels = dashboard?.parcels || {};
  const payments = dashboard?.payments || {};
  const cashouts = dashboard?.cashouts || {};

  const cards = [
    {
      title: "Total Users",
      value: users.total || 0,
      icon: Users,
    },
    {
      title: "Approved Riders",
      value: riders.approved || 0,
      icon: Bike,
    },
    {
      title: "Total Parcels",
      value: parcels.total || 0,
      icon: Package,
    },
    {
      title: "Total Revenue",
      value: `TK${payments.totalRevenue || 0}`,
      icon: FaBangladeshiTakaSign,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-[#03373D] sm:text-2xl">
          Admin Dashboard
        </h1>
      </div>

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

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="mb-5">
            <h2 className="font-semibold text-[#03373D]">Parcel Overview</h2>
            <p className="mt-1 text-xs text-[#71717A]">
              Current delivery status
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Stat title="Pending" value={parcels.pending} icon={Clock3} />
            <Stat title="Assigned" value={parcels.assigned} icon={UserPlus} />
            <Stat title="In Transit" value={parcels.inTransit} icon={Truck} />
            <Stat
              title="Delivered"
              value={parcels.delivered}
              icon={CheckCircle2}
            />
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="mb-5">
            <h2 className="font-semibold text-[#03373D]">Rider Overview</h2>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Stat
              title="Approved"
              value={riders.approved}
              icon={CheckCircle2}
            />
            <Stat title="Pending" value={riders.pending} icon={Clock3} />
            <Stat title="Rejected" value={riders.rejected} icon={Users} />
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm">
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

        <div className="overflow-x-auto">
          <table className="w-full min-w-175 text-left">
            <thead>
              <tr className="border-b border-gray-100 text-xs text-[#71717A]">
                <th className="pb-3">Parcel</th>
                <th className="pb-3">Tracking ID</th>
                <th className="pb-3">Customer</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Amount</th>
              </tr>
            </thead>

            <tbody>
              {(dashboard?.recentParcels || [])?.map((parcel) => (
                <tr
                  key={parcel._id}
                  className="border-b border-gray-50 last:border-0"
                >
                  <td className="py-4 text-sm font-medium text-[#03373D]">
                    {parcel.parcelName}
                  </td>

                  <td className="py-4 text-xs text-[#71717A]">
                    {parcel.trackingId}
                  </td>

                  <td className="py-4 text-sm text-[#52525B]">
                    {parcel.created_by}
                  </td>

                  <td className="py-4">
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
                      {parcel.delivery_Status}
                    </span>
                  </td>

                  <td className="py-4 text-sm font-medium text-[#03373D]">
                    TK{parcel.deliveryCost}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-[#03373D]">Cashout Overview</h2>

          <div className="mt-5 grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-yellow-50 p-4">
              <p className="text-xs text-yellow-700">Pending</p>
              <p className="mt-1 font-bold text-yellow-800">
                TK{cashouts.pending || 0}
              </p>
            </div>

            <div className="rounded-xl bg-blue-50 p-4">
              <p className="text-xs text-blue-700">Approved</p>
              <p className="mt-1 font-bold text-blue-800">
                TK{cashouts.approved || 0}
              </p>
            </div>

            <div className="rounded-xl bg-green-50 p-4">
              <p className="text-xs text-green-700">Paid</p>
              <p className="mt-1 font-bold text-green-800">
                TK{cashouts.paid || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-[#03373D]">
            Recent Rider Applications
          </h2>

          <div className="mt-4 space-y-3">
            {(dashboard.recentRiders || [])?.map((rider) => (
              <div
                key={rider._id}
                className="flex items-center justify-between rounded-xl border border-gray-100 p-3"
              >
                <div>
                  <p className="text-sm font-medium text-[#03373D]">
                    {rider.name}
                  </p>
                  <p className="text-xs text-[#71717A]">{rider.district}</p>
                </div>
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs">
                  {rider.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const Stat = ({ title, value, icon: Icon }) => {
  return (
    <div className="rounded-xl border border-gray-100 p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-[#71717A]">{title}</p>
        <Icon className="h-4 w-4 text-[#067A87]" />
      </div>
      <p className="mt-2 text-xl font-bold text-[#03373D]">{value || 0}</p>
    </div>
  );
};

export default AdminDashboard;

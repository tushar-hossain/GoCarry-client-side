import { Users, Bike, Package, ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import LoadingSpinner from "@/Pages/Shared/Loading";
import { Link } from "react-router";
import { FaBangladeshiTakaSign } from "react-icons/fa6";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const CustomBar = (props) => {
  const { x, y, width, height } = props;

  return (
    <path
      d={`
        M ${x},${y + 12}
        Q ${x},${y} ${x + 12},${y}
        L ${x + width - 12},${y}
        Q ${x + width},${y} ${x + width},${y + 12}
        L ${x + width},${y + height}
        L ${x},${y + height}
        Z
      `}
      fill="#CAEB66"
    />
  );
};

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

  const parcelChartData = [
    {
      label: "Parcels",
      pending: parcels.pending || 0,
      assigned: parcels.assigned || 0,
      inTransit: parcels.inTransit || 0,
      delivered: parcels.delivered || 0,
    },
  ];

  const riderChartData = [
    {
      label: "Riders",
      approved: riders.approved || 0,
      pending: riders.pending || 0,
      rejected: riders.rejected || 0,
    },
  ];

  const cashoutData = [
    {
      name: "Pending",
      amount: cashouts.pending || 0,
    },
    {
      name: "Approved",
      amount: cashouts.approved || 0,
    },
    {
      name: "Paid",
      amount: cashouts.paid || 0,
    },
  ];

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
        {/* Parcel Overview */}
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="mb-5">
            <h2 className="font-semibold text-[#03373D]">Parcel Overview</h2>
          </div>

          <div className="w-full min-w-0">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={parcelChartData}
                margin={{
                  top: 10,
                  right: 10,
                  left: 0,
                  bottom: 10,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="label" tick={{ fontSize: 11 }} />

                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />

                <Tooltip />

                <Legend
                  wrapperStyle={{
                    fontSize: "11px",
                  }}
                />

                <Bar
                  dataKey="pending"
                  name="Pending"
                  fill="#FACC15"
                  radius={[6, 6, 0, 0]}
                />

                <Bar
                  dataKey="assigned"
                  name="Assigned"
                  fill="#60A5FA"
                  radius={[6, 6, 0, 0]}
                />

                <Bar
                  dataKey="inTransit"
                  name="In Transit"
                  fill="#A78BFA"
                  radius={[6, 6, 0, 0]}
                />

                <Bar
                  dataKey="delivered"
                  name="Delivered"
                  fill="#4ADE80"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Rider Applications */}
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="mb-5">
            <h2 className="font-semibold text-[#03373D]">Rider Applications</h2>
          </div>

          <div className="w-full min-w-0">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={riderChartData}
                margin={{
                  top: 5,
                  right: 10,
                  left: -20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="label" tick={{ fontSize: 11 }} />

                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />

                <Tooltip />

                <Legend
                  wrapperStyle={{
                    fontSize: "11px",
                  }}
                />

                <Bar
                  dataKey="approved"
                  name="Approved"
                  fill="#4ADE80"
                  radius={[10, 10, 0, 0]}
                  animationDuration={1200}
                  animationBegin={200}
                />

                <Bar
                  dataKey="pending"
                  name="Pending"
                  fill="#FACC15"
                  radius={[10, 10, 0, 0]}
                  animationDuration={1400}
                  animationBegin={400}
                />

                <Bar
                  dataKey="rejected"
                  name="Rejected"
                  fill="#F87171"
                  radius={[10, 10, 0, 0]}
                  animationDuration={1600}
                  animationBegin={600}
                />
              </BarChart>
            </ResponsiveContainer>
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
          <div className="mb-5">
            <h2 className="font-semibold text-[#03373D]">Cashout Overview</h2>
          </div>

          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={cashoutData}
                margin={{
                  top: 10,
                  right: 10,
                  left: 0,
                  bottom: 5,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#E5E7EB"
                />

                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 11,
                    fill: "#71717A",
                  }}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 11,
                    fill: "#71717A",
                  }}
                />

                <Tooltip
                  cursor={{ fill: "#f5f7f7" }}
                  formatter={(value) => [`TK ${value}`, "Amount"]}
                />

                <Bar dataKey="amount" shape={<CustomBar />} barSize={55} />
              </BarChart>
            </ResponsiveContainer>
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

export default AdminDashboard;

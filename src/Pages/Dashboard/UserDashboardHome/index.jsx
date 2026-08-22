import {
  Package,
  CreditCard,
  CheckCircle2,
  Clock3,
  MapPin,
  CircleDollarSign,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const parcelStats = [
  {
    title: "Unpaid",
    value: 4,
    icon: CreditCard,
  },
  {
    title: "Paid",
    value: 8,
    icon: CircleDollarSign,
  },
  {
    title: "Ready to Pickup",
    value: 3,
    icon: Package,
  },
  {
    title: "Service Center",
    value: 2,
    icon: MapPin,
  },
  {
    title: "Ready for Delivery",
    value: 1,
    icon: Clock3,
  },
  {
    title: "Delivered",
    value: 12,
    icon: CheckCircle2,
  },
];

const recentParcels = [
  {
    id: "GC123456",
    parcel: "Important Documents",
    receiver: "Rahim Ahmed",
    status: "Delivered",
    cost: "৳80",
    date: "Today",
  },
  {
    id: "GC123457",
    parcel: "Gift Package",
    receiver: "Karim Hasan",
    status: "In Transit",
    cost: "৳150",
    date: "Yesterday",
  },
  {
    id: "GC123458",
    parcel: "Books",
    receiver: "Nusrat Jahan",
    status: "Unpaid",
    cost: "৳110",
    date: "2 days ago",
  },
];

function getStatusClass(status) {
  switch (status) {
    case "Delivered":
      return "bg-green-100 text-green-700";

    case "In Transit":
      return "bg-blue-100 text-blue-700";

    case "Unpaid":
      return "bg-yellow-100 text-yellow-700";

    default:
      return "bg-gray-100 text-gray-600";
  }
}

export default function UserDashboardHome() {
  return (
    <div className="min-h-full bg-[#eef0f1] p-3 sm:p-4 md:p-5 lg:p-2">
      {/* HEADER */}
      <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#03373D] sm:text-2xl">
            Welcome Back!
          </h1>

          <p className="mt-1 text-xs text-[#71717A] sm:text-sm">
            Here's what's happening with your parcels today.
          </p>
        </div>

        <div className="rounded-lg bg-white px-4 py-2 shadow-sm">
          <p className="text-[10px] text-[#71717A]">Total Parcels</p>

          <p className="text-lg font-bold text-[#03373D]">39</p>
        </div>
      </div>

      {/* PARCEL STATUS */}
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {parcelStats?.map((stat) => {
          const Icon = stat.icon;

          return (
            <Card key={stat.title} className="rounded-xl border-0 shadow-sm">
              <CardContent className="flex flex-col items-center p-3 text-center sm:p-4">
                <div className="flex items-center justify-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EAF6F7]">
                    <Icon className="h-4 w-4 text-[#067A87]" />
                  </div>
                  <p className="text-[10px] leading-4 text-[#71717A]">
                    {stat.title}
                  </p>
                </div>

                <p className="mt-1 text-xl font-bold text-[#03373D]">
                  {stat.value}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* USER + CHART */}
      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* USER INFORMATION */}
        <Card className="rounded-xl border-0 shadow-sm lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-sm font-bold text-[#03373D]">
              My Profile
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="flex items-center gap-4">
              {/* Profile Image */}

              <div className="h-16 w-16 overflow-hidden rounded-full bg-[#E5E7EB]">
                <img
                  src="/assets/user.png"
                  alt="User"
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="min-w-0">
                <h3 className="truncate text-sm font-bold text-[#03373D]">
                  Tushar Hossain
                </h3>

                <p className="mt-1 truncate text-[11px] text-[#71717A]">
                  tushar@example.com
                </p>

                <span className="mt-2 inline-flex rounded-full bg-[#EAF6F7] px-2.5 py-1 text-[9px] font-medium text-[#067A87]">
                  User
                </span>
              </div>
            </div>

            <div className="mt-5 border-t border-[#E5E7EB] pt-4">
              <div className="flex justify-between">
                <span className="text-[11px] text-[#71717A]">
                  Total Parcels
                </span>

                <span className="text-[11px] font-semibold text-[#03373D]">
                  39
                </span>
              </div>

              <div className="mt-3 flex justify-between">
                <span className="text-[11px] text-[#71717A]">Delivered</span>

                <span className="text-[11px] font-semibold text-green-600">
                  12
                </span>
              </div>

              <button className="mt-5 w-full rounded-lg bg-[#CAEB66] py-2.5 text-xs font-semibold text-black transition hover:brightness-95">
                Edit Profile
              </button>
            </div>
          </CardContent>
        </Card>

        {/* PARCEL OVERVIEW */}
        <Card className="rounded-xl border-0 shadow-sm lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm font-bold text-[#03373D]">
              Parcel Overview
            </CardTitle>

            <p className="text-[11px] text-[#71717A]">
              Overview of your parcel statuses
            </p>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {parcelStats.map((stat) => {
                const Icon = stat.icon;

                return (
                  <div key={stat.title} className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#EAF6F7]">
                      <Icon className="h-4 w-4 text-[#067A87]" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between">
                        <span className="truncate text-[10px] text-[#71717A]">
                          {stat.title}
                        </span>

                        <span className="text-[10px] font-bold text-[#03373D]">
                          {stat.value}
                        </span>
                      </div>

                      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[#E5E7EB]">
                        <div
                          className="h-full rounded-full bg-[#067A87]"
                          style={{
                            width: `${Math.min(stat.value * 8, 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* RECENT PARCELS */}

      <Card className="mt-5 rounded-xl border-0 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-sm font-bold text-[#03373D]">
              Recent Parcels
            </CardTitle>

            <p className="mt-1 text-[11px] text-[#71717A]">
              Your latest parcel activity
            </p>
          </div>

          <button className="text-[10px] font-semibold text-[#067A87] hover:underline">
            View All
          </button>
        </CardHeader>

        <CardContent>
          {/* Desktop / Tablet */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[650px]">
              <thead>
                <tr className="border-b border-[#E5E7EB]">
                  <th className="px-3 py-3 text-left text-[10px] font-medium text-[#71717A]">
                    Tracking ID
                  </th>

                  <th className="px-3 py-3 text-left text-[10px] font-medium text-[#71717A]">
                    Parcel
                  </th>

                  <th className="px-3 py-3 text-left text-[10px] font-medium text-[#71717A]">
                    Receiver
                  </th>

                  <th className="px-3 py-3 text-left text-[10px] font-medium text-[#71717A]">
                    Cost
                  </th>

                  <th className="px-3 py-3 text-left text-[10px] font-medium text-[#71717A]">
                    Status
                  </th>

                  <th className="px-3 py-3 text-left text-[10px] font-medium text-[#71717A]">
                    Date
                  </th>
                </tr>
              </thead>

              <tbody>
                {recentParcels?.map((parcel) => (
                  <tr
                    key={parcel.id}
                    className="border-b border-[#F1F1F1] last:border-0"
                  >
                    <td className="px-3 py-4 text-[10px] font-semibold text-[#067A87]">
                      {parcel.id}
                    </td>

                    <td className="px-3 py-4 text-[10px] font-medium text-[#03373D]">
                      {parcel.parcel}
                    </td>

                    <td className="px-3 py-4 text-[10px] text-[#71717A]">
                      {parcel.receiver}
                    </td>

                    <td className="px-3 py-4 text-[10px] font-semibold text-[#03373D]">
                      {parcel.cost}
                    </td>

                    <td className="px-3 py-4">
                      <span
                        className={`rounded-full px-2 py-1 text-[8px] font-medium ${getStatusClass(
                          parcel.status,
                        )}`}
                      >
                        {parcel.status}
                      </span>
                    </td>

                    <td className="px-3 py-4 text-[10px] text-[#71717A]">
                      {parcel.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile */}
          <div className="space-y-3 md:hidden">
            {recentParcels.map((parcel) => (
              <div
                key={parcel.id}
                className="rounded-lg border border-[#E5E7EB] p-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[9px] text-[#71717A]">Tracking ID</p>

                    <p className="mt-1 text-[11px] font-semibold text-[#067A87]">
                      {parcel.id}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-2 py-1 text-[8px] font-medium ${getStatusClass(
                      parcel.status,
                    )}`}
                  >
                    {parcel.status}
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[9px] text-[#71717A]">Parcel</p>

                    <p className="mt-1 text-[10px] font-medium text-[#03373D]">
                      {parcel.parcel}
                    </p>
                  </div>

                  <div>
                    <p className="text-[9px] text-[#71717A]">Receiver</p>

                    <p className="mt-1 text-[10px] text-[#03373D]">
                      {parcel.receiver}
                    </p>
                  </div>

                  <div>
                    <p className="text-[9px] text-[#71717A]">Cost</p>

                    <p className="mt-1 text-[10px] font-semibold text-[#03373D]">
                      {parcel.cost}
                    </p>
                  </div>

                  <div>
                    <p className="text-[9px] text-[#71717A]">Date</p>

                    <p className="mt-1 text-[10px] text-[#03373D]">
                      {parcel.date}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

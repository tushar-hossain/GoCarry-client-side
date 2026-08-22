import { Link, Outlet, useLocation } from "react-router";
import {
  LayoutDashboard,
  Map,
  Package,
  Truck,
  CreditCard,
  History,
  Settings,
  Home,
  LogOut,
  Menu,
  UserRound,
  ClipboardList,
} from "lucide-react";

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const navigationItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Send Parcel",
    url: "/dashboard/send-parcel",
    icon: Package,
  },
  {
    title: "My Parcel",
    url: "/dashboard/myParcel",
    icon: ClipboardList,
  },
  {
    title: "Tracking",
    url: "/dashboard/tracking",
    icon: Map,
  },
  {
    title: "Parcel To Pay",
    url: "/dashboard/parcel-to-pay",
    icon: CreditCard,
  },
  {
    title: "Manage Parcel",
    url: "/dashboard/manage-parcel",
    icon: Truck,
  },
  {
    title: "Payment History",
    url: "/dashboard/payment-history",
    icon: History,
  },
];

const generalItems = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Coverage Area",
    url: "/coverage",
    icon: Map,
  },
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: Settings,
  },
];

export default function UserDashboardLayout() {
  const location = useLocation();
  const user = {
    name: "Zahid Hossain",
    email: "zahid@example.com",
    photoURL: "/assets/user.png",
    role: "User",
  };

  const isActive = (url) => {
    if (url === "/dashboard") {
      return location.pathname === "/dashboard";
    }

    return location.pathname.startsWith(url);
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-[#eef0f1]">
        {/* SIDEBAR */}
        <Sidebar
          collapsible="offcanvas"
          className="border-r border-[#E5E7EB] bg-white"
        >
          {/* Logo */}
          <SidebarHeader className="border-b border-[#E5E7EB] px-5 py-5">
            <Link to="/" className="flex items-center">
              <img
                src="/assets/favicon.svg"
                alt="GoCarry"
                className="h-9 w-auto"
              />
            </Link>
          </SidebarHeader>

          {/* SIDEBAR CONTENT */}
          <SidebarContent className="px-3 py-4">
            {/* Dashboard */}
            <SidebarGroup>
              <SidebarGroupLabel className="px-3 text-[10px] font-medium text-[#71717A]">
                MENU
              </SidebarGroupLabel>

              <SidebarMenu>
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.url);

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={active}
                        tooltip={item.title}
                        className={`
                          h-10 rounded-[10px] px-3
                          text-[13px]
                          ${
                            active
                              ? "bg-[#CAEB66] text-[#03373D] hover:bg-[#CAEB66]"
                              : "text-[#71717A] hover:bg-[#F5F5F5] hover:text-[#03373D]"
                          }
                        `}
                      >
                        <Link
                          to={item.url}
                          className="flex flex-row items-center gap-2"
                        >
                          <Icon className="h-[17px] w-[17px]" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroup>

            {/* General */}
            <SidebarGroup className="mt-5">
              <SidebarGroupLabel className="px-3 text-[10px] font-medium text-[#71717A]">
                GENERAL
              </SidebarGroupLabel>

              <SidebarMenu>
                {generalItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.url);

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={active}
                        tooltip={item.title}
                        className={`
                          h-10 rounded-[10px] px-3
                          text-[13px]
                          ${
                            active
                              ? "bg-[#CAEB66] text-[#03373D] hover:bg-[#CAEB66]"
                              : "text-[#71717A] hover:bg-[#F5F5F5] hover:text-[#03373D]"
                          }
                        `}
                      >
                        <Link
                          to={item.url}
                          className="flex flex-row items-center gap-2"
                        >
                          <Icon className="h-[17px] w-[17px]" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>

          {/* USER INFO + LOGOUT */}
          <SidebarFooter className="border-t border-[#E5E7EB] p-3">
            <div className="flex items-center gap-3 rounded-[10px] p-2">
              <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full bg-[#E5E7EB]">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <UserRound className="m-auto mt-2 h-5 w-5 text-[#71717A]" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-[12px] font-semibold text-[#03373D]">
                  {user.name}
                </p>

                <p className="truncate text-[9px] text-[#71717A]">
                  {user.email}
                </p>

                <p className="text-[8px] text-[#8FA748]">{user.role}</p>
              </div>

              <button
                type="button"
                className="rounded-md p-2 text-[#71717A] transition hover:bg-red-50 hover:text-red-500"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </SidebarFooter>
        </Sidebar>

        {/* MAIN CONTENT */}
        <SidebarInset className="min-w-0 bg-[#eef0f1]">
          {/* Mobile / Tablet Header */}
          <header className="sticky top-0 z-20 flex h-14 items-center border-b border-[#E5E7EB] bg-white px-4 md:px-6">
            <SidebarTrigger className="mr-3 cursor-pointer">
              <Menu className="h-5 w-5" />
            </SidebarTrigger>

            <div>
              <p className="text-[13px] font-semibold text-[#03373D]">
                Dashboard
              </p>
            </div>
          </header>

          {/* Page */}
          <main className="min-h-[calc(100vh-56px)] w-full p-3 sm:p-5 md:p-6">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

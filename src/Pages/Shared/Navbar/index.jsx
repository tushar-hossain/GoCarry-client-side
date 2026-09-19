import useAuth from "@/hooks/useAuth";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import useNotifications from "@/hooks/useNotifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Bell, Menu, UserRound, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import Swal from "sweetalert2";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Services", href: "services" },
  { label: "Coverage", href: "coverage" },
  { label: "About Us", href: "about" },
  { label: "Send Parcel", href: "sendParcel" },
  { label: "Pricing", href: "pricing" },
  { label: "Be a Rider", href: "rider" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOutUser } = useAuth();
  const [openProfile, setOpenProfile] = useState(false);
  const { notifications } = useNotifications();
  const queryClient = useQueryClient();
  const [openNotifications, setOpenNotifications] = useState(false);
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setOpenNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setOpenProfile(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId) => {
      const response = await axiosSecure.patch(
        `/notifications/read/${notificationId}`,
      );
      return response.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notifications", user?.uid],
      });
    },

    onError: (error) => {
      console.error("Mark notification as read error:", error);
    },
  });

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      markAsReadMutation.mutate(notification._id);
    }
  };

  const unreadCount = notifications?.filter(
    (notification) => !notification.isRead,
  )?.length;

  const handleSignOut = async () => {
    try {
      await signOutUser();

      localStorage.clear();
      sessionStorage.clear();

      await Swal.fire({
        icon: "success",
        title: "Signed out successfully!",
        timer: 1200,
        showConfirmButton: false,
      });

      navigate("/login");
    } catch (error) {
      console.error("Sign out failed:", error);

      Swal.fire({
        icon: "error",
        title: "Sign out failed",
        text: "Please try again.",
      });
    }
  };

  return (
    <header className="md:max-w-6xl mx-auto">
      <nav className="flex items-center justify-between lg:rounded-sm bg-white h-15 px-5 sm:px-7 lg:px-6">
        {/* Logo */}
        <Link
          to="/"
          className="flex shrink-0 items-center"
          aria-label="GoCarry Home"
        >
          <img className="w-30" src="/assets/favicon.svg" alt="logo" />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-7.5 lg:flex">
          {navItems?.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className="text-[12px] font-medium text-[#5d5d5d] transition-colors hover:text-[#171717]"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 lg:flex">
          {user ? (
            <>
              <div className="flex items-center gap-3">
                {/* Notifications */}
                <div ref={notificationRef} className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setOpenNotifications((prev) => !prev);
                      // setOpenProfile(false);
                    }}
                    className="relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-[#dedede] bg-white transition hover:bg-[#f5f5f5]"
                    aria-label="Notifications"
                  >
                    <Bell className="h-5 w-5 text-[#03373D]" />

                    {unreadCount > 0 && (
                      <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#CAEB66] px-1 text-[9px] font-bold text-[#03373D]">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notification Dropdown */}
                  {openNotifications && (
                    <div className="absolute right-0 top-12.5 z-50 w-85 overflow-hidden rounded-xl border border-[#e5e5e5] bg-white shadow-[0_4px_20px_rgba(0,0,0,0.10)]">
                      {/* Header */}
                      <div className="flex items-center justify-between border-b border-[#eeeeee] px-4 py-3">
                        <div>
                          <p className="text-sm font-semibold text-[#03373D]">
                            Notifications
                          </p>

                          <p className="text-[10px] text-[#71717A]">
                            {unreadCount > 0
                              ? `${unreadCount} unread notification${
                                  unreadCount > 1 ? "s" : ""
                                }`
                              : "You're all caught up"}
                          </p>
                        </div>

                        <Bell className="h-4 w-4 text-[#71717A]" />
                      </div>

                      {/* Notification List */}
                      <div className="max-h-87.5 overflow-y-auto">
                        {notifications?.length > 0 ? (
                          notifications?.map((notification) => (
                            <button
                              key={notification._id}
                              type="button"
                              onClick={() =>
                                handleNotificationClick(notification)
                              }
                              className={`w-full cursor-pointer border-b border-[#f1f1f1] px-4 py-3 text-left transition hover:bg-[#F8FAFA] ${
                                !notification.isRead
                                  ? "bg-[#F8FAFA]"
                                  : "bg-white"
                              }`}
                            >
                              <div className="flex gap-3">
                                {/* Status dot */}
                                <div className="pt-1.5">
                                  <span
                                    className={`block h-2 w-2 rounded-full ${
                                      notification.isRead
                                        ? "bg-[#D4D4D8]"
                                        : "bg-[#CAEB66]"
                                    }`}
                                  />
                                </div>

                                <div className="min-w-0 flex-1">
                                  <div className="flex items-start justify-between gap-2">
                                    <p className="text-xs font-semibold text-[#03373D]">
                                      {notification.title}
                                    </p>

                                    {!notification.isRead && (
                                      <span className="shrink-0 text-[9px] font-medium text-[#067A87]">
                                        New
                                      </span>
                                    )}
                                  </div>

                                  <p className="mt-1 line-clamp-2 text-[10px] leading-4 text-[#71717A]">
                                    {notification.message}
                                  </p>

                                  {notification?.createdAt && (
                                    <p className="mt-1 text-[9px] text-[#A1A1AA]">
                                      {new Date(
                                        notification.createdAt,
                                      )?.toLocaleString()}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </button>
                          ))
                        ) : (
                          <div className="flex flex-col items-center justify-center px-4 py-10">
                            <Bell className="mb-2 h-7 w-7 text-[#D4D4D8]" />

                            <p className="text-xs font-medium text-[#52525B]">
                              No notifications
                            </p>

                            <p className="mt-1 text-[10px] text-[#A1A1AA]">
                              You don't have any notifications yet.
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Footer */}
                      {notifications?.length > 0 && (
                        <div className="border-t border-[#eeeeee] px-4 py-2">
                          <Link
                            to="/notifications"
                            onClick={() => setOpenNotifications(false)}
                            className="block text-center text-[10px] font-semibold text-[#067A87] hover:underline"
                          >
                            View all notifications
                          </Link>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div ref={profileRef} className="relative">
                {/* Profile Avatar */}
                <button
                  type="button"
                  onClick={() => setOpenProfile((prev) => !prev)}
                  className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-[#dedede] bg-[#f3f4f6] focus:outline-none cursor-pointer"
                >
                  {user?.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <UserRound className="m-auto mt-2 h-5 w-5 text-[#71717A]" />
                  )}
                </button>

                {/* Dropdown */}
                {openProfile && (
                  <div className="absolute right-0 top-13.75 z-50 w-52.5 rounded-xl border border-[#e5e5e5] bg-white p-2 shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
                    {/* Profile */}
                    <div className="rounded-lg px-3 text-[#18181B] transition hover:bg-[#f5f5f5] cursor-pointer">
                      <p className="text-[13px] font-semibold">
                        {user?.displayName}
                      </p>
                      <p className=" text-[9px]">{user?.email}</p>
                    </div>
                    <Link
                      to="/dashboard"
                      onClick={() => setOpenProfile(false)}
                      className="flex h-10 items-center justify-between rounded-lg px-3 text-[13px] text-[#18181B] transition hover:bg-[#f5f5f5]"
                    >
                      <span>Dashboard</span>
                    </Link>

                    {/* Settings */}
                    {/* <Link
                    to="/settings"
                    onClick={() => setOpenProfile(false)}
                    className="flex h-10 items-center rounded-lg px-3 text-[13px] text-[#18181B] transition hover:bg-[#f5f5f5]"
                  >
                    Settings
                  </Link> */}

                    {/* Logout */}
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="flex h-10 w-full items-center rounded-lg px-3 text-left text-[13px] text-[#18181B] transition hover:bg-[#f5f5f5] cursor-pointer"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Link to="/login">
              <button className=" w-20 h-10 cursor-pointer rounded-sm border border-[#dedede] bg-[#CAEB66] text-sm font-semibold">
                Sign In
              </button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#202020] text-white lg:hidden"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="absolute left-4 right-4 top-24 z-50 rounded-[14px] bg-white p-5 shadow-lg lg:hidden">
            <div className="flex flex-col gap-1">
              {navItems?.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  className="text-[12px] font-medium text-[#5d5d5d] transition-colors hover:text-[#171717]"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="mt-4 flex gap-2 border-t border-[#eeeeee] pt-4">
              {user ? (
                <div className="relative">
                  {/* Profile Avatar */}
                  <button
                    type="button"
                    onClick={() => setOpenProfile((prev) => !prev)}
                    className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-[#dedede] bg-[#f3f4f6] focus:outline-none cursor-pointer"
                  >
                    {user?.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.displayName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <UserRound className="m-auto mt-2 h-5 w-5 text-[#71717A]" />
                    )}
                  </button>

                  {/* Dropdown */}
                  {openProfile && (
                    <div className="absolute right-0 top-13.75 z-50 w-52.5 rounded-xl border border-[#e5e5e5] bg-white p-2 shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
                      {/* Profile */}
                      {/* <Link
                        to="/profile"
                        onClick={() => setOpenProfile(false)}
                        className="flex h-10 items-center justify-between rounded-lg px-3 text-[13px] text-[#18181B] transition hover:bg-[#f5f5f5]"
                      >
                        <span>Profile</span>
                      </Link> */}

                      {/* Settings */}
                      {/* <Link
                        to="/settings"
                        onClick={() => setOpenProfile(false)}
                        className="flex h-10 items-center rounded-lg px-3 text-[13px] text-[#18181B] transition hover:bg-[#f5f5f5]"
                      >
                        Settings
                      </Link> */}

                      {/* Logout */}
                      <button
                        type="button"
                        onClick={handleSignOut}
                        className="flex h-10 w-full items-center rounded-lg px-3 text-left text-[13px] text-[#18181B] transition hover:bg-[#f5f5f5] cursor-pointer"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex h-11 flex-1 items-center justify-center rounded-[10px] border border-[#dedede] text-sm font-semibold"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;

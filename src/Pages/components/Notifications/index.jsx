import useAuth from "@/hooks/useAuth";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import useNotifications from "@/hooks/useNotifications";
import LoadingSpinner from "@/Pages/Shared/Loading";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Bell,
  Check,
  CheckCheck,
  Package,
  CreditCard,
  Bike,
  Truck,
  Megaphone,
  Loader2,
  Circle,
} from "lucide-react";
import { useState } from "react";

const Notifications = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const { notifications = [], isLoading } = useNotifications();
  const [activeTab, setActiveTab] = useState("today");

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

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      const unreadNotifications = notifications.filter(
        (notification) => !notification.isRead,
      );

      await Promise.all(
        unreadNotifications.map((notification) =>
          axiosSecure.patch(`/notifications/read/${notification._id}`),
        ),
      );

      return true;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notifications", user?.uid],
      });
    },

    onError: (error) => {
      console.error("Mark all notifications error:", error);
    },
  });

  const handleMarkAsRead = (notification) => {
    if (notification.isRead) return;

    markAsReadMutation.mutate(notification._id);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "parcel":
        return <Package className="h-4 w-4" />;

      case "payment":
        return <CreditCard className="h-4 w-4" />;

      case "rider":
        return <Bike className="h-4 w-4" />;

      case "delivery":
        return <Truck className="h-4 w-4" />;

      case "promotion":
        return <Megaphone className="h-4 w-4" />;

      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getIconStyle = (type) => {
    switch (type) {
      case "parcel":
        return "bg-[#EAF7F8] text-[#067A87]";

      case "payment":
        return "bg-green-50 text-green-600";

      case "rider":
        return "bg-blue-50 text-blue-600";

      case "delivery":
        return "bg-purple-50 text-purple-600";

      case "promotion":
        return "bg-yellow-50 text-yellow-600";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getTimeAgo = (date) => {
    if (!date) return "";

    const now = new Date();
    const notificationDate = new Date(date);
    const difference = now - notificationDate;
    const seconds = Math.floor(difference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) {
      return "Just now";
    }

    if (minutes < 60) {
      return `${minutes}m ago`;
    }

    if (hours < 24) {
      return `${hours}h ago`;
    }

    if (days === 1) {
      return "Yesterday";
    }

    if (days < 7) {
      return `${days}d ago`;
    }

    return notificationDate.toLocaleDateString();
  };

  const isToday = (date) => {
    if (!date) return false;

    const notificationDate = new Date(date);
    const today = new Date();

    return (
      notificationDate.getDate() === today.getDate() &&
      notificationDate.getMonth() === today.getMonth() &&
      notificationDate.getFullYear() === today.getFullYear()
    );
  };

  const todayNotifications = notifications.filter((notification) =>
    isToday(notification.createdAt),
  );

  const previousNotifications = notifications.filter(
    (notification) => !isToday(notification.createdAt),
  );

  const displayedNotifications =
    activeTab === "today" ? todayNotifications : previousNotifications;

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead,
  ).length;

  const todayUnreadCount = todayNotifications.filter(
    (notification) => !notification.isRead,
  ).length;

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="md:max-w-6xl mx-auto mb-6 mt-5">
      <div className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-white shadow-sm">
        <div className="border-b border-[#E5E7EB] px-4 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EAF7F8]">
                <Bell className="h-4 w-4 text-[#067A87]" />
              </div>

              <div>
                <h2 className="text-sm font-semibold text-[#03373D]">
                  Your Notifications
                </h2>
                <p className="text-[10px] text-[#A1A1AA]">
                  {notifications?.length} total notifications
                </p>
              </div>
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={() => markAllAsReadMutation.mutate()}
                disabled={markAllAsReadMutation.isPending}
                className="flex cursor-pointer items-center gap-1.5 text-[10px] font-medium text-[#067A87] transition hover:text-[#03373D] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {markAllAsReadMutation.isPending ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <CheckCheck className="h-3 w-3" />
                )}
                Mark all as read
              </button>
            )}
          </div>

          <div className="mt-4 flex items-center gap-5">
            <button
              type="button"
              onClick={() => setActiveTab("today")}
              className={`relative cursor-pointer pb-3 text-[11px] font-semibold transition ${
                activeTab === "today"
                  ? "text-[#067A87]"
                  : "text-[#71717A] hover:text-[#03373D]"
              }`}
            >
              Today
              {todayUnreadCount > 0 && (
                <span className="ml-1.5 rounded-full bg-[#EAF7F8] px-1.5 py-0.5 text-[8px] text-[#067A87]">
                  {todayUnreadCount}
                </span>
              )}
              {activeTab === "today" && (
                <span className="absolute bottom-0 left-0 h-[2px] w-full rounded-full bg-[#067A87]" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("previous")}
              className={`relative cursor-pointer pb-3 text-[11px] font-semibold transition ${
                activeTab === "previous"
                  ? "text-[#067A87]"
                  : "text-[#71717A] hover:text-[#03373D]"
              }`}
            >
              Previous
              {activeTab === "previous" && (
                <span className="absolute bottom-0 left-0 h-[2px] w-full rounded-full bg-[#067A87]" />
              )}
            </button>
          </div>
        </div>

        {displayedNotifications?.length > 0 ? (
          <div>
            {displayedNotifications?.map((notification) => {
              const isUnread = !notification.isRead;
              const isMarkingThis =
                markAsReadMutation.isPending &&
                markAsReadMutation.variables === notification._id;

              return (
                <div
                  key={notification._id}
                  className={`group relative flex gap-3 border-b border-[#F0F0F0] px-4 py-4 last:border-b-0 transition ${
                    isUnread ? "bg-[#FAFCFC]" : "bg-white hover:bg-[#FAFAFA]"
                  }`}
                >
                  {isUnread && (
                    <div className="absolute left-2.5 top-[27px]">
                      <Circle className="h-2 w-2 fill-[#2563EB] text-[#2563EB]" />
                    </div>
                  )}

                  <div
                    className={`ml-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${getIconStyle(
                      notification.type,
                    )}`}
                  >
                    {getNotificationIcon(notification.type)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3
                            className={`truncate text-xs ${
                              isUnread
                                ? "font-semibold text-[#18181B]"
                                : "font-medium text-[#52525B]"
                            }`}
                          >
                            {notification.title}
                          </h3>

                          {isUnread && (
                            <span className="shrink-0 rounded-full bg-[#EAF7F8] px-1.5 py-0.5 text-[7px] font-bold text-[#067A87]">
                              NEW
                            </span>
                          )}
                        </div>

                        <p className="mt-1 text-[10px] leading-4 text-[#71717A]">
                          {notification.message}
                        </p>
                      </div>

                      <span className="shrink-0 text-[9px] text-[#A1A1AA]">
                        {getTimeAgo(notification.createdAt)}
                      </span>
                    </div>

                    <div className="mt-2.5">
                      {isUnread ? (
                        <button
                          type="button"
                          onClick={() => handleMarkAsRead(notification)}
                          disabled={isMarkingThis}
                          className="flex cursor-pointer items-center gap-1 rounded-md text-[9px] font-medium text-[#067A87] transition hover:text-[#03373D] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {isMarkingThis ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <Check className="h-3 w-3" />
                          )}
                          Mark as read
                        </button>
                      ) : (
                        <div className="flex items-center gap-1 text-[9px] text-[#A1A1AA]">
                          <CheckCheck className="h-3 w-3" />
                          Read
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center px-5 py-5 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F4F4F5]">
              <Bell className="h-6 w-6 text-[#A1A1AA]" />
            </div>

            <h3 className="mt-4 text-sm font-semibold text-[#03373D]">
              {activeTab === "today"
                ? "No notifications today"
                : "No previous notifications"}
            </h3>

            <p className="mt-1 max-w-xs text-[10px] leading-5 text-[#71717A]">
              {activeTab === "today"
                ? "You're all caught up for today. New parcel and delivery updates will appear here."
                : "Your previous notifications will appear here."}
            </p>
          </div>
        )}
        {/* 
        {displayedNotifications.length > 0 && (
          <div className="border-t border-[#E5E7EB] bg-[#FAFAFA] px-4 py-3 text-center">
            <p className="text-[9px] text-[#A1A1AA]">
              Showing {displayedNotifications.length} notification
              {displayedNotifications.length !== 1 ? "s" : ""}
            </p>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default Notifications;

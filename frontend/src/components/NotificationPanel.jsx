import { useEffect, useRef, useState } from "react";

function BellIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-5 w-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14.8 17.1c1.9-.3 3.7-.7 5.2-1.3A9 9 0 0 1 18 9.8V9a6 6 0 1 0-12 0v.8a9 9 0 0 1-2 6c1.5.6 3.3 1 5.2 1.3m5.6 0a24 24 0 0 1-5.6 0m5.6 0a3 3 0 1 1-5.6 0"
      />
    </svg>
  );
}

function NotificationPanel() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const wrapperRef = useRef(null);

  const fetchNotifications = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        setNotifications([]);
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/notifications`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch notifications");
      }

      setNotifications(data.notifications || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/notifications/${notificationId}/read`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to mark notification as read");
      }

      setNotifications((previous) =>
        previous.map((notification) =>
          notification._id === notificationId
            ? {
                ...notification,
                isRead: true,
              }
            : notification,
        ),
      );
    } catch (error) {
      console.error(error);
    }
  };

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead,
  ).length;

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        aria-label="Notifications"
        onClick={() => {
          setOpen((previous) => !previous);

          if (!open) {
            fetchNotifications();
          }
        }}
        className={`relative flex h-10 w-10 items-center justify-center rounded-xl border transition ${
          open
            ? "border-violet-200 bg-violet-50 text-violet-700"
            : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-900"
        }`}
      >
        <BellIcon />

        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-violet-600 px-1 text-[9px] font-bold text-white ring-2 ring-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-[100] w-[370px] max-w-[calc(100vw-24px)] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_25px_80px_rgba(15,23,42,0.18)]">
          <div className="flex items-end justify-between border-b border-slate-100 px-5 py-4">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-violet-600">
                Updates
              </p>

              <h2 className="mt-1 text-base font-bold text-slate-950">
                Notifications
              </h2>
            </div>

            <span className="text-xs font-semibold text-slate-400">
              {unreadCount} unread
            </span>
          </div>

          {loading ? (
            <div className="divide-y divide-slate-100">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex gap-3 px-5 py-4">
                  <div className="h-8 w-8 animate-pulse rounded-lg bg-slate-200" />

                  <div className="flex-1">
                    <div className="h-3 w-4/5 animate-pulse rounded bg-slate-200" />
                    <div className="mt-2 h-2.5 w-2/5 animate-pulse rounded bg-slate-200" />
                  </div>
                </div>
              ))}
            </div>
          ) : notifications.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <BellIcon />
              </div>

              <p className="mt-4 text-sm font-semibold text-slate-900">
                Nothing new
              </p>

              <p className="mt-1 text-xs text-slate-500">
                You are completely up to date.
              </p>
            </div>
          ) : (
            <div className="max-h-[420px] overflow-y-auto">
              {notifications.map((notification) => (
                <button
                  key={notification._id}
                  type="button"
                  onClick={() => {
                    if (!notification.isRead) {
                      markAsRead(notification._id);
                    }
                  }}
                  className={`flex w-full gap-3 border-b border-slate-100 px-5 py-4 text-left transition last:border-b-0 ${
                    notification.isRead
                      ? "bg-white hover:bg-slate-50"
                      : "bg-violet-50/60 hover:bg-violet-50"
                  }`}
                >
                  <div
                    className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                      notification.isRead
                        ? "bg-slate-100 text-slate-400"
                        : "bg-violet-100 text-violet-600"
                    }`}
                  >
                    <BellIcon />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start gap-2">
                      <p
                        className={`text-sm leading-5 ${
                          notification.isRead
                            ? "font-medium text-slate-600"
                            : "font-bold text-slate-950"
                        }`}
                      >
                        {notification.message}
                      </p>

                      {!notification.isRead && (
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-600" />
                      )}
                    </div>

                    <p className="mt-1 text-[10px] text-slate-400">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default NotificationPanel;

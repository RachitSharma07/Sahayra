import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import NotificationPanel from "../components/NotificationPanel";

function ProviderBookingHistory() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Confirmation modal state
  const [confirmation, setConfirmation] = useState(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/provider/bookings`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch bookings");
      }

      setBookings(data.bookings || []);
    } catch (error) {
      console.error(error);
      setError(error.message || "Failed to fetch provider bookings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleBookingAction = async (bookingId, action) => {
    try {
      setActionLoading(`${action}-${bookingId}`);
      setError("");
      setSuccess("");

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/bookings/${bookingId}/${action}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Failed to ${action} booking`);
      }

      setSuccess(data.message || `Booking ${action} successfully`);

      await fetchBookings();
    } catch (error) {
      console.error(error);
      setError(error.message || `Failed to ${action} booking`);
    } finally {
      setActionLoading("");
    }
  };

  const openConfirmation = (bookingId, action) => {
    if (action === "reject") {
      setConfirmation({
        bookingId,
        action,
        title: "Reject booking?",
        message:
          "This booking request will be rejected and the customer will no longer be able to proceed with this request.",
        confirmText: "Reject Booking",
        confirmStyle: "danger",
      });

      return;
    }

    if (action === "complete") {
      setConfirmation({
        bookingId,
        action,
        title: "Complete booking?",
        message:
          "Mark this booking as completed only if the requested service has been finished successfully.",
        confirmText: "Complete Booking",
        confirmStyle: "success",
      });
    }
  };

  const closeConfirmation = () => {
    if (actionLoading !== "") {
      return;
    }

    setConfirmation(null);
  };

  const confirmBookingAction = async () => {
    if (!confirmation) {
      return;
    }

    const { bookingId, action } = confirmation;

    setConfirmation(null);

    await handleBookingAction(bookingId, action);
  };

  const pendingCount = bookings.filter(
    (booking) => booking.status === "pending",
  ).length;

  const acceptedCount = bookings.filter(
    (booking) => booking.status === "accepted",
  ).length;

  const completedCount = bookings.filter(
    (booking) => booking.status === "completed",
  ).length;

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";

      case "accepted":
        return "bg-cyan-50 text-cyan-700 border-cyan-100";

      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-100";

      case "rejected":
        return "bg-rose-50 text-rose-700 border-rose-100";

      default:
        return "bg-slate-50 text-slate-600 border-slate-200";
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString([], {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-[#f4f7f7] text-[#0d1b2a]">
      <main>
        <div className="mx-auto max-w-[1400px] px-5 py-6 sm:px-8 lg:px-10 lg:py-8">
          {/* Top bar */}
          <header className="flex items-center justify-between border-b border-slate-200 pb-5">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-teal-600">
                Provider Console
              </p>

              <p className="mt-1 text-sm font-semibold text-[#0d1b2a]">
                Bookings
              </p>
            </div>

            <NotificationPanel />
          </header>

          {/* Page heading */}
          <section className="mt-10">
            <div className="flex flex-col gap-7 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-600">
                  Work Queue
                </p>

                <h1 className="mt-3 text-4xl font-bold tracking-[-0.045em] text-[#08131f] sm:text-5xl">
                  Customer bookings
                </h1>

                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-500">
                  Review requests, manage customer work and keep every booking
                  moving.
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => navigate("/provider/dashboard")}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-[#0d1b2a] shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-teal-200 hover:bg-teal-50"
                >
                  <span className="text-lg text-teal-600">←</span>
                  Dashboard
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/provider/create-service")}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 px-5 py-3 text-sm font-bold text-[#08131f] shadow-[0_10px_28px_rgba(34,211,238,0.16)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(34,211,238,0.23)]"
                >
                  <span className="text-lg leading-none">+</span>
                  Create Service
                </button>
              </div>
            </div>
          </section>

          {/* Stats */}
          <section className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-amber-100 bg-amber-50/70 p-5">
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-amber-700">
                Pending
              </p>

              <p className="mt-3 text-3xl font-bold tracking-tight text-[#08131f]">
                {pendingCount}
              </p>

              <p className="mt-1 text-xs text-amber-700/70">
                Requests waiting for action
              </p>
            </div>

            <div className="rounded-2xl border border-cyan-100 bg-cyan-50/70 p-5">
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-cyan-700">
                Active
              </p>

              <p className="mt-3 text-3xl font-bold tracking-tight text-[#08131f]">
                {acceptedCount}
              </p>

              <p className="mt-1 text-xs text-cyan-700/70">
                Accepted customer work
              </p>
            </div>

            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-5">
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-emerald-700">
                Completed
              </p>

              <p className="mt-3 text-3xl font-bold tracking-tight text-[#08131f]">
                {completedCount}
              </p>

              <p className="mt-1 text-xs text-emerald-700/70">
                Finished bookings
              </p>
            </div>
          </section>

          {/* Messages */}
          {success && (
            <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50 px-5 py-4 text-sm font-semibold text-emerald-700">
              {success}
            </div>
          )}

          {error && (
            <div className="mt-6 rounded-2xl border border-rose-100 bg-rose-50 px-5 py-4 text-sm font-semibold text-rose-700">
              {error}
            </div>
          )}

          {/* Booking section */}
          <section className="mt-10 overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-[0_16px_50px_rgba(8,19,31,0.06)]">
            {/* Desktop heading */}
            <div className="hidden border-b border-slate-200 bg-[#f8fbfb] px-6 py-4 lg:grid lg:grid-cols-[1.5fr_1fr_1fr_0.8fr_1.5fr] lg:gap-6">
              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                Service
              </span>

              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                Customer
              </span>

              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                Date
              </span>

              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                Status
              </span>

              <span className="text-right text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                Actions
              </span>
            </div>

            {/* Loading */}
            {loading ? (
              <div className="divide-y divide-slate-100">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="animate-pulse px-6 py-7">
                    <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr_1fr_0.8fr_1.5fr]">
                      <div>
                        <div className="h-4 w-40 rounded bg-slate-200" />
                        <div className="mt-3 h-3 w-20 rounded bg-slate-100" />
                      </div>

                      <div className="h-4 w-28 rounded bg-slate-200" />

                      <div>
                        <div className="h-4 w-28 rounded bg-slate-200" />
                        <div className="mt-3 h-3 w-16 rounded bg-slate-100" />
                      </div>

                      <div className="h-7 w-20 rounded-full bg-slate-200" />

                      <div className="flex justify-end gap-2">
                        <div className="h-9 w-20 rounded-xl bg-slate-200" />
                        <div className="h-9 w-16 rounded-xl bg-slate-100" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : bookings.length === 0 ? (
              <div className="px-6 py-20 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-600">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    className="h-6 w-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 7h8M8 11h5M6 3h12a2 2 0 0 1 2 2v14l-4-2-4 2-4-2-4 2V5a2 2 0 0 1 2-2Z"
                    />
                  </svg>
                </div>

                <p className="mt-5 text-2xl font-bold tracking-tight text-[#08131f]">
                  No bookings yet
                </p>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                  New customer requests will appear here once customers book one
                  of your services.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {bookings.map((booking) => (
                  <div
                    key={booking._id}
                    className="px-6 py-7 transition duration-200 hover:bg-[#fbfdfd]"
                  >
                    {/* Desktop */}
                    <div className="hidden lg:grid lg:grid-cols-[1.5fr_1fr_1fr_0.8fr_1.5fr] lg:items-center lg:gap-6">
                      {/* Service */}
                      <div>
                        <p className="text-sm font-bold text-[#08131f]">
                          {booking.service?.name || "Service"}
                        </p>

                        <p className="mt-2 font-mono text-[10px] text-slate-400">
                          #{booking._id?.slice(-8)}
                        </p>
                      </div>

                      {/* Customer */}
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-[#0d1b2a]">
                          {booking.customer?.name || "Unknown Customer"}
                        </p>

                        <p className="mt-1 truncate text-xs text-slate-400">
                          {booking.customer?.email || "No email"}
                        </p>
                      </div>

                      {/* Date */}
                      <div>
                        <p className="text-sm font-semibold text-slate-700">
                          {formatDate(booking.bookingDate)}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {formatTime(booking.bookingDate)}
                        </p>
                      </div>

                      {/* Status */}
                      <div>
                        <span
                          className={`inline-flex items-center rounded-full border px-3 py-1.5 text-[11px] font-bold capitalize ${getStatusStyle(
                            booking.status,
                          )}`}
                        >
                          {booking.status}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="flex justify-end gap-2">
                        {booking.status === "pending" && (
                          <>
                            <button
                              type="button"
                              onClick={() =>
                                handleBookingAction(booking._id, "accept")
                              }
                              disabled={actionLoading !== ""}
                              className="rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 px-4 py-2.5 text-xs font-bold text-[#08131f] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {actionLoading === `accept-${booking._id}`
                                ? "Accepting..."
                                : "Accept"}
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                openConfirmation(booking._id, "reject")
                              }
                              disabled={actionLoading !== ""}
                              className="rounded-xl border border-rose-100 bg-white px-4 py-2.5 text-xs font-bold text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              Reject
                            </button>
                          </>
                        )}

                        {booking.status === "accepted" && (
                          <button
                            type="button"
                            onClick={() =>
                              openConfirmation(booking._id, "complete")
                            }
                            disabled={actionLoading !== ""}
                            className="rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white transition hover:-translate-y-0.5 hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {actionLoading === `complete-${booking._id}`
                              ? "Completing..."
                              : "Complete"}
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            if (booking.customer?._id) {
                              navigate(`/chat/${booking.customer._id}`);
                            }
                          }}
                          className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-[#0d1b2a] transition hover:border-teal-200 hover:bg-teal-50"
                        >
                          Chat
                        </button>
                      </div>
                    </div>

                    {/* Mobile */}
                    <div className="lg:hidden">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="truncate text-lg font-bold text-[#08131f]">
                            {booking.service?.name || "Service"}
                          </p>

                          <p className="mt-1 truncate text-sm text-slate-500">
                            {booking.customer?.name || "Unknown Customer"}
                          </p>
                        </div>

                        <span
                          className={`shrink-0 rounded-full border px-3 py-1.5 text-[10px] font-bold capitalize ${getStatusStyle(
                            booking.status,
                          )}`}
                        >
                          {booking.status}
                        </span>
                      </div>

                      <div className="mt-6 grid grid-cols-2 gap-5">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                            Date
                          </p>

                          <p className="mt-2 text-sm font-semibold text-slate-700">
                            {new Date(booking.bookingDate).toLocaleString([], {
                              dateStyle: "medium",
                              timeStyle: "short",
                            })}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                            Amount
                          </p>

                          <p className="mt-2 text-lg font-bold text-[#08131f]">
                            ₹{booking.amount ?? booking.service?.price ?? 0}
                          </p>
                        </div>
                      </div>

                      <div className="mt-6 flex flex-wrap gap-2">
                        {booking.status === "pending" && (
                          <>
                            <button
                              type="button"
                              onClick={() =>
                                handleBookingAction(booking._id, "accept")
                              }
                              disabled={actionLoading !== ""}
                              className="rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 px-4 py-2.5 text-xs font-bold text-[#08131f] disabled:opacity-50"
                            >
                              {actionLoading === `accept-${booking._id}`
                                ? "Accepting..."
                                : "Accept"}
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                openConfirmation(booking._id, "reject")
                              }
                              disabled={actionLoading !== ""}
                              className="rounded-xl border border-rose-100 bg-white px-4 py-2.5 text-xs font-bold text-rose-600 disabled:opacity-50"
                            >
                              Reject
                            </button>
                          </>
                        )}

                        {booking.status === "accepted" && (
                          <button
                            type="button"
                            onClick={() =>
                              openConfirmation(booking._id, "complete")
                            }
                            disabled={actionLoading !== ""}
                            className="rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white disabled:opacity-50"
                          >
                            {actionLoading === `complete-${booking._id}`
                              ? "Completing..."
                              : "Complete"}
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            if (booking.customer?._id) {
                              navigate(`/chat/${booking.customer._id}`);
                            }
                          }}
                          className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-[#0d1b2a] hover:border-teal-200 hover:bg-teal-50"
                        >
                          Chat
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Confirmation Modal */}
      {confirmation && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#08131f]/60 px-5 py-8 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeConfirmation();
            }
          }}
        >
          <div className="w-full max-w-md overflow-hidden rounded-[26px] border border-white/60 bg-white shadow-[0_30px_100px_rgba(8,19,31,0.28)]">
            {/* Modal header */}
            <div className="border-b border-slate-100 px-6 py-6 sm:px-7">
              <div className="flex items-start gap-4">
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                    confirmation.confirmStyle === "danger"
                      ? "bg-rose-50 text-rose-600"
                      : "bg-emerald-50 text-emerald-600"
                  }`}
                >
                  {confirmation.confirmStyle === "danger" ? (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      className="h-6 w-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v4M12 17h.01"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M10.3 4.7 3.9 16a2 2 0 0 0 1.7 3h12.8a2 2 0 0 0 1.7-3L13.7 4.7a2 2 0 0 0-3.4 0Z"
                      />
                    </svg>
                  ) : (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      className="h-6 w-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m5 12 4 4L19 6"
                      />
                    </svg>
                  )}
                </div>

                <div className="min-w-0">
                  <h2 className="text-xl font-bold tracking-tight text-[#08131f]">
                    {confirmation.title}
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {confirmation.message}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal actions */}
            <div className="flex flex-col-reverse gap-3 bg-[#f8fbfb] px-6 py-5 sm:flex-row sm:justify-end sm:px-7">
              <button
                type="button"
                onClick={closeConfirmation}
                className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-[#0d1b2a] transition hover:border-slate-300 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmBookingAction}
                className={`rounded-xl px-5 py-3 text-sm font-bold transition hover:-translate-y-0.5 ${
                  confirmation.confirmStyle === "danger"
                    ? "bg-rose-600 text-white shadow-[0_10px_25px_rgba(244,63,94,0.18)] hover:bg-rose-700"
                    : "bg-emerald-600 text-white shadow-[0_10px_25px_rgba(16,185,129,0.18)] hover:bg-emerald-700"
                }`}
              >
                {confirmation.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProviderBookingHistory;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function CalendarIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-5 w-5"
    >
      <rect x="3.5" y="5" width="17" height="16" rx="2.5" />
      <path strokeLinecap="round" d="M7.5 3.5v3M16.5 3.5v3M3.5 10h17" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-5 w-5"
    >
      <circle cx="12" cy="12" r="8.5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 2" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-4 w-4"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 6.5A2.5 2.5 0 0 1 7.5 4h9A2.5 2.5 0 0 1 19 6.5v6A2.5 2.5 0 0 1 16.5 15H11l-4.5 4v-4.8A2.5 2.5 0 0 1 5 11.5v-5Z"
      />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-4 w-4"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m12 3 2.3 5 5.4.6-4 3.7 1.1 5.4L12 14.8 7.2 17.7l1.1-5.4-4-.6L12 3Z"
      />
    </svg>
  );
}

function XIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-4 w-4"
    >
      <path strokeLinecap="round" d="m7 7 10 10M17 7 7 17" />
    </svg>
  );
}

function CreditCardIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-4 w-4"
    >
      <rect x="3.5" y="5.5" width="17" height="13" rx="2.2" />
      <path strokeLinecap="round" d="M3.5 10h17" />
      <path strokeLinecap="round" d="M7 14h3" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-4 w-4"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 12h13M13 7l5 5-5 5"
      />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-4 w-4"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20 11a8 8 0 0 0-14.9-4M4 5v4h4"
      />

      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 13a8 8 0 0 0 14.9 4M20 19v-4h-4"
      />
    </svg>
  );
}

function EmptyBookingIcon() {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-8 w-8"
    >
      <rect x="8" y="9" width="32" height="31" rx="5" />
      <path strokeLinecap="round" d="M15 6v7M33 6v7M8 17h32" />
      <path
        strokeLinecap="round"
        d="M16 24h.01M24 24h.01M32 24h.01M16 32h.01M24 32h.01"
      />
    </svg>
  );
}

function BookingHistory() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [cancellingId, setCancellingId] = useState(null);

  /*
   * --------------------------------------------------
   * Fetch customer bookings
   * --------------------------------------------------
   */
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
        `${import.meta.env.VITE_API_URL}/api/bookings`,
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
      console.error("Fetch customer bookings error:", error);

      setError(error.message || "Something went wrong while loading bookings.");
    } finally {
      setLoading(false);
    }
  };

  /*
   * --------------------------------------------------
   * Initial load
   * --------------------------------------------------
   */
  useEffect(() => {
    fetchBookings();
  }, []);

  /*
   * --------------------------------------------------
   * Cancel booking
   * --------------------------------------------------
   */
  const handleCancelBooking = async (bookingId) => {
    const shouldCancel = window.confirm(
      "Are you sure you want to cancel this booking?",
    );

    if (!shouldCancel) {
      return;
    }

    try {
      setCancellingId(bookingId);
      setError("");
      setSuccess("");

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/bookings/${bookingId}/cancel`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to cancel booking");
      }

      setSuccess("Booking cancelled successfully.");

      setBookings((previousBookings) =>
        previousBookings.map((booking) =>
          booking._id === bookingId
            ? {
                ...booking,
                status: "cancelled",
              }
            : booking,
        ),
      );
    } catch (error) {
      console.error("Cancel booking error:", error);

      setError(
        error.message || "Something went wrong while cancelling the booking.",
      );
    } finally {
      setCancellingId(null);
    }
  };

  /*
   * --------------------------------------------------
   * Status configuration
   * --------------------------------------------------
   */
  const getStatusConfig = (status) => {
    switch (status) {
      case "pending":
        return {
          label: "Pending",
          className: "border-amber-200 bg-amber-50 text-amber-700",
          dotClass: "bg-amber-500",
          description: "Waiting for the provider to accept your request.",
        };

      case "accepted":
        return {
          label: "Accepted",
          className: "border-cyan-200 bg-cyan-50 text-cyan-700",
          dotClass: "bg-cyan-500",
          description: "Your booking has been accepted by the provider.",
        };

      case "completed":
        return {
          label: "Completed",
          className: "border-emerald-200 bg-emerald-50 text-emerald-700",
          dotClass: "bg-emerald-500",
          description: "This service has been completed.",
        };

      case "rejected":
        return {
          label: "Rejected",
          className: "border-rose-200 bg-rose-50 text-rose-700",
          dotClass: "bg-rose-500",
          description: "The provider declined this booking request.",
        };

      case "cancelled":
        return {
          label: "Cancelled",
          className: "border-slate-200 bg-slate-100 text-slate-600",
          dotClass: "bg-slate-400",
          description: "This booking has been cancelled.",
        };

      default:
        return {
          label: "Unknown",
          className: "border-slate-200 bg-slate-100 text-slate-600",
          dotClass: "bg-slate-400",
          description: "Booking status is currently unavailable.",
        };
    }
  };

  /*
   * --------------------------------------------------
   * Date formatter
   * --------------------------------------------------
   */
  const formatBookingDate = (date) => {
    if (!date) {
      return "Date not available";
    }

    return new Date(date).toLocaleString([], {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  /*
   * --------------------------------------------------
   * Derived booking counts
   * --------------------------------------------------
   */
  const pendingCount = bookings.filter(
    (booking) => booking.status === "pending",
  ).length;

  const acceptedCount = bookings.filter(
    (booking) => booking.status === "accepted",
  ).length;

  const completedCount = bookings.filter(
    (booking) => booking.status === "completed",
  ).length;

  /*
   * --------------------------------------------------
   * Loading
   * --------------------------------------------------
   */
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f4f7f7] text-[#0d1b2a]">
        <section className="px-5 py-7 sm:px-8 sm:py-9">
          <div className="mx-auto max-w-[1450px] animate-pulse">
            <div className="h-3 w-28 rounded bg-slate-200" />

            <div className="mt-5 h-10 w-72 rounded-xl bg-slate-200" />

            <div className="mt-3 h-4 w-96 max-w-full rounded bg-slate-100" />

            <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="h-28 rounded-2xl border border-slate-200 bg-white"
                />
              ))}
            </div>

            <div className="mt-7 space-y-5">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="rounded-[26px] border border-slate-200 bg-white p-6"
                >
                  <div className="h-5 w-48 rounded bg-slate-200" />

                  <div className="mt-4 h-4 w-72 rounded bg-slate-100" />

                  <div className="mt-6 grid gap-4 sm:grid-cols-3">
                    <div className="h-16 rounded-xl bg-slate-100" />
                    <div className="h-16 rounded-xl bg-slate-100" />
                    <div className="h-16 rounded-xl bg-slate-100" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @keyframes bookingHistoryRise {
          from {
            opacity: 0;
            transform: translateY(14px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes bookingHistoryGlow {
          0%, 100% {
            transform: scale(1);
            opacity: 0.65;
          }
          50% {
            transform: scale(1.06);
            opacity: 0.95;
          }
        }

        .booking-history-item {
          animation: bookingHistoryRise 0.55s ease both;
        }

        .booking-history-glow {
          animation: bookingHistoryGlow 5s ease-in-out infinite;
        }
      `}</style>

      <div className="min-h-screen overflow-hidden bg-[#f4f7f7] text-[#0d1b2a]">
        <section className="relative px-5 py-7 sm:px-8 sm:py-9">
          <div className="pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full bg-cyan-200/20 blur-3xl booking-history-glow" />
          <div className="pointer-events-none absolute left-0 top-48 h-64 w-64 rounded-full bg-teal-200/20 blur-3xl booking-history-glow" />

          <div className="relative mx-auto max-w-[1450px]">
            {/* ------------------------------------ */}
            {/* Page heading */}
            {/* ------------------------------------ */}
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between booking-history-item">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-teal-600">
                  Your bookings
                </p>

                <h1 className="mt-3 text-3xl font-black tracking-[-0.04em] text-[#0b1825] sm:text-4xl">
                  Keep every appointment
                  <span className="text-teal-600"> in one place.</span>
                </h1>

                <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500 sm:text-[15px]">
                  Review your upcoming requests, completed services, payment
                  status and conversations with providers.
                </p>
              </div>

              <button
                type="button"
                onClick={fetchBookings}
                className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-bold text-slate-700 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700 lg:self-auto"
              >
                <RefreshIcon />
                Refresh
              </button>
            </div>

            {/* ------------------------------------ */}
            {/* Summary */}
            {/* ------------------------------------ */}
            <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div
                className="booking-history-item rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_10px_35px_rgba(8,19,31,0.04)]"
                style={{ animationDelay: "60ms" }}
              >
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-slate-400">
                    Total
                  </p>

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                    <CalendarIcon />
                  </div>
                </div>

                <p className="mt-5 text-3xl font-black tracking-tight text-[#0b1825]">
                  {bookings.length}
                </p>

                <p className="mt-1 text-xs text-slate-400">All bookings</p>
              </div>

              <div
                className="booking-history-item rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_10px_35px_rgba(8,19,31,0.04)]"
                style={{ animationDelay: "120ms" }}
              >
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-slate-400">
                    Pending
                  </p>

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                    <ClockIcon />
                  </div>
                </div>

                <p className="mt-5 text-3xl font-black tracking-tight text-[#0b1825]">
                  {pendingCount}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Awaiting provider response
                </p>
              </div>

              <div
                className="booking-history-item rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_10px_35px_rgba(8,19,31,0.04)]"
                style={{ animationDelay: "180ms" }}
              >
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-slate-400">
                    Accepted
                  </p>

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                    <CalendarIcon />
                  </div>
                </div>

                <p className="mt-5 text-3xl font-black tracking-tight text-[#0b1825]">
                  {acceptedCount}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Confirmed appointments
                </p>
              </div>

              <div
                className="booking-history-item rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_10px_35px_rgba(8,19,31,0.04)]"
                style={{ animationDelay: "240ms" }}
              >
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-slate-400">
                    Completed
                  </p>

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <StarIcon />
                  </div>
                </div>

                <p className="mt-5 text-3xl font-black tracking-tight text-[#0b1825]">
                  {completedCount}
                </p>

                <p className="mt-1 text-xs text-slate-400">Finished services</p>
              </div>
            </div>

            {/* ------------------------------------ */}
            {/* Messages */}
            {/* ------------------------------------ */}
            {success && (
              <div className="booking-history-item mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-sm font-black text-emerald-700">
                    ✓
                  </div>

                  <p className="text-sm font-semibold text-emerald-700">
                    {success}
                  </p>
                </div>
              </div>
            )}

            {error && (
              <div className="booking-history-item mt-5 rounded-2xl border border-rose-200 bg-white px-5 py-4 shadow-[0_10px_30px_rgba(244,63,94,0.04)]">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-bold text-rose-800">
                      Something went wrong
                    </p>

                    <p className="mt-1 text-xs text-rose-600">{error}</p>
                  </div>

                  <button
                    type="button"
                    onClick={fetchBookings}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#08131f] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-teal-600"
                  >
                    <RefreshIcon />
                    Try again
                  </button>
                </div>
              </div>
            )}

            {/* ------------------------------------ */}
            {/* Empty */}
            {/* ------------------------------------ */}
            {bookings.length === 0 && (
              <div className="booking-history-item relative mt-7 overflow-hidden rounded-[26px] border border-slate-200 bg-white px-6 py-16 text-center shadow-[0_12px_45px_rgba(8,19,31,0.05)] sm:px-10 sm:py-20">
                <div className="pointer-events-none absolute left-1/2 top-0 h-40 w-40 -translate-x-1/2 rounded-full bg-teal-100/30 blur-3xl" />

                <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-50 text-teal-500">
                  <EmptyBookingIcon />
                </div>

                <p className="relative mt-6 text-[10px] font-bold uppercase tracking-[0.2em] text-teal-600">
                  Your workspace is empty
                </p>

                <h2 className="relative mt-2 text-2xl font-black tracking-tight text-[#0b1825]">
                  No bookings yet
                </h2>

                <p className="relative mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                  Find a professional, choose a service and create your first
                  booking from ServiceHub.
                </p>

                <button
                  type="button"
                  onClick={() => navigate("/services")}
                  className="group relative mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-[#08131f] px-5 py-3 text-sm font-bold text-white shadow-[0_10px_25px_rgba(8,19,31,0.18)] transition duration-200 hover:-translate-y-0.5 hover:bg-teal-600"
                >
                  Find a service
                  <span className="transition-transform group-hover:translate-x-0.5">
                    <ArrowRightIcon />
                  </span>
                </button>
              </div>
            )}

            {/* ------------------------------------ */}
            {/* Bookings */}
            {/* ------------------------------------ */}
            {bookings.length > 0 && (
              <section className="mt-7">
                <div className="mb-4 booking-history-item">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-teal-600">
                    Activity
                  </p>

                  <h2 className="mt-1 text-xl font-black tracking-tight text-[#0b1825]">
                    Your booking history
                  </h2>
                </div>

                <div className="space-y-5">
                  {bookings.map((booking, index) => {
                    const provider = booking.provider;
                    const service = booking.service;

                    /*
                     * provider._id = Provider document ID
                     * provider.user._id = User document ID
                     *
                     * Chat requires provider.user._id.
                     */
                    const providerUserId =
                      provider?.user?._id || provider?.user?.id;

                    const status = getStatusConfig(booking.status);

                    return (
                      <article
                        key={booking._id}
                        className="booking-history-item group overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-[0_10px_40px_rgba(8,19,31,0.04)] transition duration-300 hover:-translate-y-0.5 hover:border-teal-100 hover:shadow-[0_18px_50px_rgba(8,19,31,0.07)]"
                        style={{
                          animationDelay: `${120 + index * 70}ms`,
                        }}
                      >
                        <div className="relative h-1.5 w-full overflow-hidden bg-slate-100">
                          <div
                            className={`h-full transition-all ${
                              booking.status === "completed"
                                ? "w-full bg-emerald-400"
                                : booking.status === "accepted"
                                  ? "w-3/4 bg-cyan-400"
                                  : booking.status === "pending"
                                    ? "w-1/2 bg-amber-400"
                                    : booking.status === "rejected"
                                      ? "w-1/2 bg-rose-400"
                                      : "w-1/3 bg-slate-300"
                            }`}
                          />
                        </div>

                        <div className="p-6 sm:p-7">
                          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-[10px] font-bold uppercase tracking-[0.17em] text-teal-600">
                                  Booking
                                </span>

                                <span className="text-[10px] font-semibold text-slate-300">
                                  #{booking._id.slice(-6).toUpperCase()}
                                </span>
                              </div>

                              <h3 className="mt-2 text-xl font-black tracking-tight text-[#0b1825] sm:text-2xl">
                                {service?.name || "Service unavailable"}
                              </h3>

                              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                                {service?.description ||
                                  "No description available."}
                              </p>
                            </div>

                            <div
                              className={`flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold ${status.className}`}
                            >
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${status.dotClass}`}
                              />

                              {status.label}
                            </div>
                          </div>

                          {/* Status explanation */}
                          <div className="mt-5 rounded-2xl border border-slate-100 bg-[#f7faf9] px-4 py-3">
                            <p className="text-xs leading-5 text-slate-500">
                              {status.description}
                            </p>
                          </div>

                          {/* Information */}
                          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                            <div className="rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-teal-100">
                              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                                Provider
                              </p>

                              <div className="mt-2 flex items-center gap-2.5">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-teal-500 text-xs font-bold text-white shadow-sm">
                                  {(provider?.user?.name || "P")
                                    .charAt(0)
                                    .toUpperCase()}
                                </div>

                                <p className="truncate text-sm font-bold text-slate-800">
                                  {provider?.user?.name || "Provider"}
                                </p>
                              </div>
                            </div>

                            <div className="rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-teal-100">
                              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                                Appointment
                              </p>

                              <div className="mt-2 flex items-center gap-2 text-sm font-bold text-slate-800">
                                <span className="text-teal-600">
                                  <CalendarIcon />
                                </span>

                                <span>
                                  {formatBookingDate(booking.bookingDate)}
                                </span>
                              </div>
                            </div>

                            <div className="rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-teal-100">
                              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                                Amount
                              </p>

                              <p className="mt-2 text-lg font-black text-[#0b1825]">
                                ₹{booking.amount ?? service?.price ?? 0}
                              </p>
                            </div>

                            <div className="rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-teal-100">
                              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                                Payment
                              </p>

                              <p className="mt-2 text-sm font-bold capitalize text-slate-800">
                                {booking.paymentStatus || "pending"}
                              </p>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="mt-6 flex flex-wrap gap-2.5 border-t border-slate-100 pt-5">
                            {/* Chat */}
                            {providerUserId ? (
                              <button
                                type="button"
                                onClick={() =>
                                  navigate(`/chat/${providerUserId}`)
                                }
                                className="inline-flex items-center gap-2 rounded-xl bg-[#08131f] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-teal-600"
                              >
                                <ChatIcon />
                                Chat provider
                              </button>
                            ) : (
                              <button
                                type="button"
                                disabled
                                className="inline-flex cursor-not-allowed items-center gap-2 rounded-xl bg-slate-100 px-4 py-2.5 text-xs font-bold text-slate-400"
                              >
                                <ChatIcon />
                                Chat unavailable
                              </button>
                            )}

                            {/* Cancel */}
                            {(booking.status === "pending" ||
                              booking.status === "accepted") && (
                              <button
                                type="button"
                                onClick={() => handleCancelBooking(booking._id)}
                                disabled={cancellingId === booking._id}
                                className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-xs font-bold text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                <XIcon />

                                {cancellingId === booking._id
                                  ? "Cancelling..."
                                  : "Cancel booking"}
                              </button>
                            )}

                            {/* Review */}
                            {booking.status === "completed" && (
                              <button
                                type="button"
                                onClick={() =>
                                  navigate(
                                    `/customer/review?bookingId=${booking._id}`,
                                  )
                                }
                                className="inline-flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-xs font-bold text-amber-700 transition hover:bg-amber-100"
                              >
                                <StarIcon />
                                Give review
                              </button>
                            )}

                            {/* Pay placeholder */}
                            {(booking.status === "pending" ||
                              booking.status === "accepted") &&
                              booking.paymentStatus !== "paid" && (
                                <button
                                  type="button"
                                  disabled
                                  title="Payment integration will be enabled in the payment module."
                                  className="inline-flex cursor-not-allowed items-center gap-2 rounded-xl border border-slate-200 bg-slate-100 px-4 py-2.5 text-xs font-bold text-slate-400"
                                >
                                  <CreditCardIcon />
                                  Pay now
                                </button>
                              )}
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            )}
          </div>
        </section>
      </div>
    </>
  );
}

export default BookingHistory;

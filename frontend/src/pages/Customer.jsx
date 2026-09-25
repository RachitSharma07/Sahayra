import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-5 w-5"
    >
      <circle cx="11" cy="11" r="6.5" />
      <path strokeLinecap="round" d="m16 16 4.5 4.5" />
    </svg>
  );
}

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

function StarIcon() {
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
        d="m12 3 2.3 5 5.4.6-4 3.7 1.1 5.4L12 14.8 7.2 17.7l1.1-5.4-4-.6L12 3Z"
      />
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

function ArrowIcon() {
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

function SparkIcon() {
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
        d="m12 3 1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7L12 3Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m19 15 .7 2.3L22 18l-2.3.7L19 21"
      />
    </svg>
  );
}

function Customer() {
  const { user, loading: authLoading } = useAuth();

  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [bookingsError, setBookingsError] = useState("");

  const userName = user?.name || "Customer";

  useEffect(() => {
    if (authLoading) {
      return;
    }

    const fetchBookings = async () => {
      try {
        setBookingsLoading(true);
        setBookingsError("");

        const token = localStorage.getItem("token");

        if (!token) {
          setBookings([]);
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
          throw new Error(data.message || "Failed to fetch customer bookings");
        }

        setBookings(data.bookings || []);
      } catch (error) {
        console.error("Customer dashboard bookings error:", error);

        setBookingsError(error.message || "Unable to load booking statistics.");
      } finally {
        setBookingsLoading(false);
      }
    };

    fetchBookings();
  }, [authLoading]);

  const totalBookings = bookings.length;

  const completedBookings = bookings.filter(
    (booking) => booking.status === "completed",
  ).length;

  const pendingBookings = bookings.filter(
    (booking) => booking.status === "pending",
  ).length;

  const acceptedBookings = bookings.filter(
    (booking) => booking.status === "accepted",
  ).length;

  const activeBookings = pendingBookings + acceptedBookings;

  const recentBookings = [...bookings]
    .sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate))
    .slice(0, 3);

  const greetingName =
    userName.length > 18 ? `${userName.slice(0, 18)}...` : userName;

  return (
    <div className="customer-dashboard min-h-screen overflow-x-hidden bg-[#f4f7f7] text-[#0d1b2a]">
      <style>{`
        @keyframes customerFloat {
          0%, 100% {
            transform: translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(0, -12px, 0);
          }
        }

        @keyframes customerFloatReverse {
          0%, 100% {
            transform: translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(0, 10px, 0);
          }
        }

        @keyframes customerGlow {
          0%, 100% {
            opacity: .25;
            transform: scale(1);
          }
          50% {
            opacity: .5;
            transform: scale(1.08);
          }
        }

        @keyframes customerReveal {
          from {
            opacity: 0;
            transform: translateY(18px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes customerShine {
          0% {
            transform: translateX(-120%);
          }
          100% {
            transform: translateX(140%);
          }
        }

        .customer-float {
          animation: customerFloat 7s ease-in-out infinite;
        }

        .customer-float-reverse {
          animation: customerFloatReverse 8s ease-in-out infinite;
        }

        .customer-glow {
          animation: customerGlow 5s ease-in-out infinite;
        }

        .customer-reveal {
          opacity: 0;
          animation: customerReveal .7s cubic-bezier(.2,.65,.25,1) forwards;
        }

        .customer-delay-1 {
          animation-delay: 80ms;
        }

        .customer-delay-2 {
          animation-delay: 160ms;
        }

        .customer-delay-3 {
          animation-delay: 240ms;
        }

        .customer-shine {
          position: relative;
          overflow: hidden;
        }

        .customer-shine::after {
          content: "";
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          width: 35%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255,255,255,.16),
            transparent
          );
          transform: translateX(-120%);
          animation: customerShine 4.5s ease-in-out infinite;
        }

        .customer-surface {
          transition:
            transform .3s ease,
            box-shadow .3s ease,
            border-color .3s ease;
        }

        .customer-surface:hover {
          transform: translateY(-3px);
        }

        @media (prefers-reduced-motion: reduce) {
          .customer-dashboard *,
          .customer-dashboard *::before,
          .customer-dashboard *::after {
            animation-duration: .001ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: .001ms !important;
          }
        }
      `}</style>

      <section className="relative px-5 py-6 sm:px-8 sm:py-8">
        <div className="pointer-events-none absolute left-[10%] top-10 h-44 w-44 rounded-full bg-teal-300/10 blur-[90px]" />
        <div className="pointer-events-none absolute right-[7%] top-40 h-52 w-52 rounded-full bg-amber-200/10 blur-[100px]" />

        <div className="relative mx-auto max-w-[1450px]">
          {/* HERO */}

          <section className="customer-reveal overflow-hidden rounded-[30px] bg-[#0d1b2a] shadow-[0_24px_70px_rgba(13,27,42,.16)]">
            <div className="relative px-6 py-8 sm:px-9 sm:py-10 lg:px-11 lg:py-12">
              <div className="customer-glow pointer-events-none absolute -right-20 -top-28 h-80 w-80 rounded-full bg-cyan-300/10 blur-[80px]" />

              <div className="customer-float-reverse pointer-events-none absolute -left-24 bottom-[-120px] h-72 w-72 rounded-full bg-teal-400/8 blur-[90px]" />

              <div
                className="pointer-events-none absolute inset-0 opacity-[0.10]"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(148,163,184,.25) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,.25) 1px, transparent 1px)",
                  backgroundSize: "54px 54px",
                  maskImage: "linear-gradient(to bottom, black, transparent)",
                }}
              />

              <div className="relative flex flex-col gap-9 xl:flex-row xl:items-end xl:justify-between">
                <div className="max-w-3xl">
                  <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200/10 bg-white/[0.05] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-200">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
                    Your workspace
                  </div>

                  <h1 className="mt-5 text-3xl font-semibold leading-tight tracking-[-0.04em] text-white sm:text-4xl lg:text-5xl">
                    What can we help you
                    <span className="block bg-gradient-to-r from-cyan-300 via-teal-200 to-amber-200 bg-clip-text text-transparent">
                      with, {greetingName}?
                    </span>
                  </h1>

                  <p className="mt-5 max-w-2xl text-sm leading-7 text-white/45 sm:text-base">
                    Find trusted professionals, book a service and keep your
                    appointments organised from one place.
                  </p>
                </div>

                <Link
                  to="/services"
                  className="customer-shine group inline-flex shrink-0 items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-cyan-400 to-teal-400 px-5 py-3.5 text-sm font-bold text-[#07212b] shadow-[0_16px_40px_rgba(45,212,191,.16)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_50px_rgba(45,212,191,.22)]"
                >
                  <SearchIcon />

                  <span>Explore services</span>

                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    <ArrowIcon />
                  </span>
                </Link>
              </div>

              <div className="relative mt-8 flex flex-wrap gap-x-6 gap-y-3 text-xs text-white/30">
                <span>Discover</span>
                <span className="h-1 w-1 self-center rounded-full bg-cyan-300/50" />
                <span>Connect</span>
                <span className="h-1 w-1 self-center rounded-full bg-teal-300/50" />
                <span>Book</span>
                <span className="h-1 w-1 self-center rounded-full bg-amber-300/40" />
                <span>Manage</span>
              </div>
            </div>
          </section>

          {/* STATS */}

          <section className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="customer-reveal customer-delay-1 customer-surface rounded-[24px] border border-slate-200/80 bg-white p-5 shadow-[0_10px_35px_rgba(13,27,42,.04)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                    Active
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Current bookings
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50 text-teal-600">
                  <CalendarIcon />
                </div>
              </div>

              <p className="mt-6 text-4xl font-semibold tracking-[-0.05em] text-[#0d1b2a]">
                {bookingsLoading ? (
                  <span className="inline-block h-10 w-10 animate-pulse rounded-lg bg-slate-100" />
                ) : (
                  activeBookings
                )}
              </p>

              <div className="mt-4 h-1 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-teal-400 transition-all duration-700"
                  style={{
                    width:
                      totalBookings > 0
                        ? `${Math.min(
                            (activeBookings / totalBookings) * 100,
                            100,
                          )}%`
                        : "0%",
                  }}
                />
              </div>
            </div>

            <div className="customer-reveal customer-delay-2 customer-surface rounded-[24px] border border-slate-200/80 bg-white p-5 shadow-[0_10px_35px_rgba(13,27,42,.04)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                    Completed
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Services completed
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                  <ClockIcon />
                </div>
              </div>

              <p className="mt-6 text-4xl font-semibold tracking-[-0.05em] text-[#0d1b2a]">
                {bookingsLoading ? (
                  <span className="inline-block h-10 w-10 animate-pulse rounded-lg bg-slate-100" />
                ) : (
                  completedBookings
                )}
              </p>

              <p className="mt-5 text-xs font-medium text-emerald-600">
                Finished services
              </p>
            </div>

            <div className="customer-reveal customer-delay-3 customer-surface rounded-[24px] border border-slate-200/80 bg-white p-5 shadow-[0_10px_35px_rgba(13,27,42,.04)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                    Reviews
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Reviews submitted
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                  <StarIcon />
                </div>
              </div>

              <p className="mt-6 text-4xl font-semibold tracking-[-0.05em] text-[#0d1b2a]">
                0
              </p>

              <p className="mt-5 text-xs font-medium text-amber-600">
                Keep sharing your experience
              </p>
            </div>

            <div className="customer-reveal customer-delay-3 customer-surface rounded-[24px] border border-slate-200/80 bg-white p-5 shadow-[0_10px_35px_rgba(13,27,42,.04)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                    History
                  </p>

                  <p className="mt-1 text-xs text-slate-400">Total bookings</p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-600">
                  <CalendarIcon />
                </div>
              </div>

              <p className="mt-6 text-4xl font-semibold tracking-[-0.05em] text-[#0d1b2a]">
                {bookingsLoading ? (
                  <span className="inline-block h-10 w-10 animate-pulse rounded-lg bg-slate-100" />
                ) : (
                  totalBookings
                )}
              </p>

              <p className="mt-5 text-xs font-medium text-slate-400">
                All service activity
              </p>
            </div>
          </section>

          {bookingsError && (
            <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4">
              <p className="text-sm font-medium text-amber-700">
                {bookingsError}
              </p>
            </div>
          )}

          {/* MAIN CONTENT */}

          <div className="mt-5 grid gap-5 xl:grid-cols-[1.25fr_0.9fr]">
            {/* DISCOVER */}

            <section className="customer-reveal overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-[0_12px_40px_rgba(13,27,42,.04)]">
              <div className="border-b border-slate-100 px-6 py-6 sm:px-7">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-teal-600">
                      Discover
                    </p>

                    <h2 className="mt-2 text-2xl font-semibold tracking-[-0.035em] text-[#0d1b2a]">
                      What do you need today?
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Start exploring services available through ServiceHub.
                    </p>
                  </div>

                  <Link
                    to="/services"
                    className="hidden items-center gap-1 text-xs font-bold text-teal-600 transition hover:text-teal-700 sm:flex"
                  >
                    View all
                    <ArrowIcon />
                  </Link>
                </div>
              </div>

              <div className="grid gap-px bg-slate-100 sm:grid-cols-2">
                <Link
                  to="/services"
                  className="group relative overflow-hidden bg-white p-7 transition hover:bg-[#f5fbfa]"
                >
                  <div className="customer-glow absolute -right-12 -top-12 h-32 w-32 rounded-full bg-teal-300/10 blur-2xl" />

                  <div className="relative">
                    <div className="flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-600 transition duration-300 group-hover:scale-110">
                        <SearchIcon />
                      </div>

                      <ArrowIcon />
                    </div>

                    <h3 className="mt-7 text-xl font-semibold tracking-tight text-[#0d1b2a]">
                      Find a service
                    </h3>

                    <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                      Browse available professionals and discover the right
                      service for your needs.
                    </p>

                    <div className="mt-6 inline-flex rounded-full bg-teal-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-teal-700">
                      Explore
                    </div>
                  </div>
                </Link>

                <Link
                  to="/customer/bookings"
                  className="group relative overflow-hidden bg-white p-7 transition hover:bg-[#fbfaf5]"
                >
                  <div className="customer-float pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-amber-200/15 blur-2xl" />

                  <div className="relative">
                    <div className="flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 transition duration-300 group-hover:scale-110">
                        <CalendarIcon />
                      </div>

                      <ArrowIcon />
                    </div>

                    <h3 className="mt-7 text-xl font-semibold tracking-tight text-[#0d1b2a]">
                      Manage bookings
                    </h3>

                    <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                      Check appointments, booking status and your complete
                      service history.
                    </p>

                    <div className="mt-6 inline-flex rounded-full bg-amber-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-amber-700">
                      Your activity
                    </div>
                  </div>
                </Link>
              </div>
            </section>

            {/* ACTIVITY */}

            <section className="customer-reveal rounded-[28px] border border-slate-200/80 bg-white shadow-[0_12px_40px_rgba(13,27,42,.04)]">
              <div className="border-b border-slate-100 px-6 py-6 sm:px-7">
                <div className="flex items-end justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-teal-600">
                      Activity
                    </p>

                    <h2 className="mt-2 text-2xl font-semibold tracking-[-0.035em] text-[#0d1b2a]">
                      Recent bookings
                    </h2>
                  </div>

                  {bookings.length > 0 && (
                    <Link
                      to="/customer/bookings"
                      className="text-xs font-bold text-teal-600 hover:text-teal-700"
                    >
                      View all
                    </Link>
                  )}
                </div>
              </div>

              {bookingsLoading ? (
                <div className="space-y-3 p-6 sm:p-7">
                  {[1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className="flex gap-3 rounded-2xl bg-slate-50 p-4"
                    >
                      <div className="h-11 w-11 animate-pulse rounded-xl bg-slate-200" />

                      <div className="flex-1">
                        <div className="h-3 w-3/4 animate-pulse rounded bg-slate-200" />
                        <div className="mt-2 h-2.5 w-1/2 animate-pulse rounded bg-slate-100" />
                        <div className="mt-3 h-2.5 w-1/3 animate-pulse rounded bg-slate-100" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : recentBookings.length === 0 ? (
                <div className="px-6 py-12 text-center sm:px-7">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                    <CalendarIcon />
                  </div>

                  <p className="mt-4 text-sm font-bold text-[#0d1b2a]">
                    No recent bookings
                  </p>

                  <p className="mx-auto mt-1 max-w-xs text-xs leading-5 text-slate-400">
                    Your booking activity will appear here after you schedule a
                    service.
                  </p>

                  <Link
                    to="/services"
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#0d1b2a] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#173044]"
                  >
                    Find a service
                    <ArrowIcon />
                  </Link>
                </div>
              ) : (
                <div className="space-y-2 p-4 sm:p-5">
                  {recentBookings.map((booking) => {
                    const status = booking.status || "pending";

                    const statusStyles = {
                      pending: "border-amber-200 bg-amber-50 text-amber-700",
                      accepted: "border-cyan-200 bg-cyan-50 text-cyan-700",
                      completed:
                        "border-emerald-200 bg-emerald-50 text-emerald-700",
                      cancelled: "border-slate-200 bg-slate-50 text-slate-500",
                      rejected: "border-rose-200 bg-rose-50 text-rose-700",
                    };

                    return (
                      <div
                        key={booking._id}
                        className="group rounded-2xl border border-slate-100 bg-[#fafbfb] p-4 transition duration-300 hover:border-slate-200 hover:bg-white hover:shadow-sm"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0d1b2a] text-cyan-300 transition duration-300 group-hover:scale-105">
                            <CalendarIcon />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-3">
                              <p className="truncate text-sm font-bold text-[#0d1b2a]">
                                {booking.service?.name || "Service"}
                              </p>

                              <span
                                className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-bold capitalize ${
                                  statusStyles[status] ||
                                  "border-slate-200 bg-slate-50 text-slate-500"
                                }`}
                              >
                                {status}
                              </span>
                            </div>

                            <p className="mt-1 text-xs text-slate-400">
                              {booking.bookingDate
                                ? new Date(booking.bookingDate).toLocaleString(
                                    [],
                                    {
                                      dateStyle: "medium",
                                      timeStyle: "short",
                                    },
                                  )
                                : "Date unavailable"}
                            </p>

                            <div className="mt-3 flex items-center justify-between">
                              <span className="text-[11px] font-medium text-slate-400">
                                {booking.amount !== undefined
                                  ? `₹${booking.amount}`
                                  : "Amount unavailable"}
                              </span>

                              <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 transition group-hover:text-teal-600">
                                Booking details
                                <ArrowIcon />
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </div>

          {/* QUICK INSIGHT */}

          <section className="customer-reveal mt-5 overflow-hidden rounded-[28px] bg-[#102536] shadow-[0_18px_55px_rgba(13,27,42,.10)]">
            <div className="relative px-6 py-7 sm:px-8 sm:py-8">
              <div className="customer-float absolute right-[-40px] top-[-60px] h-48 w-48 rounded-full bg-cyan-300/8 blur-3xl" />

              <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-300/10 text-cyan-300">
                    <SparkIcon />
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-300">
                      ServiceHub
                    </p>

                    <h2 className="mt-2 text-xl font-semibold tracking-tight text-white">
                      Need something else?
                    </h2>

                    <p className="mt-1 max-w-2xl text-sm leading-6 text-white/40">
                      Find a professional, book a service and keep everything
                      organised from one place.
                    </p>
                  </div>
                </div>

                <Link
                  to="/services"
                  className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-cyan-200/10 bg-white/[0.05] px-5 py-3 text-sm font-bold text-white transition hover:border-cyan-300/20 hover:bg-white/[0.09]"
                >
                  Browse services
                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    <ArrowIcon />
                  </span>
                </Link>
              </div>
            </div>
          </section>

          <div className="flex flex-col items-center justify-between gap-3 px-1 py-7 text-[11px] text-slate-400 sm:flex-row">
            <p>ServiceHub customer workspace</p>

            <div className="flex items-center gap-3">
              <span>Discover</span>
              <span className="h-1 w-1 rounded-full bg-slate-300" />
              <span>Book</span>
              <span className="h-1 w-1 rounded-full bg-slate-300" />
              <span>Manage</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Customer;

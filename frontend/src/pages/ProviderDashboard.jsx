import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import NotificationPanel from "../components/NotificationPanel";
import { useAuth } from "../context/AuthContext";

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-4 w-4"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.5 10h10.5M11 5.5 15.5 10 11 14.5"
      />
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
      <rect x="3.5" y="5" width="17" height="15" rx="2.5" />
      <path strokeLinecap="round" d="M7.5 3.5v4M16.5 3.5v4M3.5 10h17" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-4 w-4"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m5 12 4.5 4.5L19 7"
      />
    </svg>
  );
}

function ActivityIcon() {
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
        d="M4 17.5 9 12l3.5 3.5L20 8"
      />
      <path strokeLinecap="round" d="M16 8h4v4" />
    </svg>
  );
}

function ProviderDashboard() {
  const navigate = useNavigate();

  const { user } = useAuth();

  const [provider, setProvider] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [providerResponse, bookingsResponse] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/api/provider/dashboard`, {
            headers,
          }),

          fetch(`${import.meta.env.VITE_API_URL}/api/provider/bookings`, {
            headers,
          }),
        ]);

        const providerData = await providerResponse.json();
        const bookingData = await bookingsResponse.json();

        if (!providerResponse.ok) {
          throw new Error(
            providerData.message || "Failed to load provider profile",
          );
        }

        if (!bookingsResponse.ok) {
          throw new Error(bookingData.message || "Failed to load bookings");
        }

        setProvider(providerData.provider);
        setBookings(bookingData.bookings || []);
      } catch (error) {
        console.error("Provider dashboard error:", error);

        setError(error.message || "Failed to load provider dashboard.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [navigate]);

  const stats = useMemo(() => {
    return {
      total: bookings.length,

      pending: bookings.filter((booking) => booking.status === "pending")
        .length,

      accepted: bookings.filter((booking) => booking.status === "accepted")
        .length,

      completed: bookings.filter((booking) => booking.status === "completed")
        .length,
    };
  }, [bookings]);

  const recentBookings = bookings.slice(0, 5);

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

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return {
          dot: "bg-amber-500",
          text: "text-amber-700",
          bg: "bg-amber-50",
        };

      case "accepted":
        return {
          dot: "bg-cyan-500",
          text: "text-cyan-700",
          bg: "bg-cyan-50",
        };

      case "completed":
        return {
          dot: "bg-emerald-500",
          text: "text-emerald-700",
          bg: "bg-emerald-50",
        };

      case "rejected":
        return {
          dot: "bg-rose-500",
          text: "text-rose-700",
          bg: "bg-rose-50",
        };

      case "cancelled":
        return {
          dot: "bg-slate-400",
          text: "text-slate-500",
          bg: "bg-slate-50",
        };

      default:
        return {
          dot: "bg-slate-400",
          text: "text-slate-500",
          bg: "bg-slate-50",
        };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f4f7f7]">
        <div className="px-5 py-6 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-7xl animate-pulse">
            <div className="h-14 rounded-2xl bg-slate-200" />

            <div className="mt-10 h-64 rounded-[30px] bg-slate-200" />

            <div className="mt-8 h-28 rounded-[24px] bg-slate-200" />

            <div className="mt-8 grid gap-8 xl:grid-cols-[1.25fr_0.75fr]">
              <div className="h-[520px] rounded-[28px] bg-slate-200" />

              <div className="h-[520px] rounded-[28px] bg-slate-200" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f4f7f7] px-5 py-10">
        <div className="mx-auto max-w-xl pt-20 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-xl font-bold text-rose-600">
            !
          </div>

          <h1 className="mt-5 text-2xl font-bold text-[#0d1b2a]">
            Unable to load dashboard
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-500">{error}</p>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 rounded-xl bg-[#0d1b2a] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#102536]"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!provider) {
    return null;
  }

  const userName =
    user?.name || provider?.user?.name || provider?.name || "User";

  const skills = provider.skills || [];

  const verification = provider.verificationStatus?.toLowerCase() || "pending";

  const profileImage =
    typeof provider.profileImage === "string"
      ? provider.profileImage
      : provider.profileImage?.url;

  const initials =
    userName
      .trim()
      .split(/\s+/)
      .map((word) => word[0]?.toUpperCase())
      .join("")
      .slice(0, 2) || "U";

  const profileScore = Math.min(
    100,
    35 +
      (provider.experience ? 15 : 0) +
      (provider.location ? 15 : 0) +
      (skills.length > 0 ? 20 : 0) +
      (provider.availability ? 15 : 0),
  );

  return (
    <div className="min-h-screen bg-[#f4f7f7] text-[#0d1b2a]">
      <main>
        <div className="mx-auto max-w-7xl px-5 py-5 sm:px-8 lg:px-10">
          {/* HEADER */}

          <header className="flex h-14 items-center justify-between border-b border-slate-200/80">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-teal-600">
                Sahayra
              </p>

              <p className="mt-0.5 text-sm font-semibold text-[#0d1b2a]">
                Provider workspace
              </p>
            </div>

            <div className="flex items-center gap-2">
              <NotificationPanel />

              <Link
                to="/provider"
                className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-cyan-200 hover:bg-cyan-50/40 sm:flex"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-teal-500 text-[10px] font-bold text-[#08131f]">
                  {initials}
                </span>

                {userName}
              </Link>
            </div>
          </header>

          {/* WELCOME */}

          <section className="relative mt-10 overflow-hidden rounded-[30px] bg-[#08131f] px-6 py-10 shadow-[0_20px_60px_rgba(8,19,31,0.12)] sm:px-9 sm:py-12 lg:py-14">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />

            <div className="absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-teal-400/10 blur-3xl" />

            <div className="relative">
              {/* STATUS */}

              <div className="flex items-center gap-2">
                <span
                  className={`h-2 w-2 rounded-full ${
                    provider.availability
                      ? "bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]"
                      : "bg-slate-500"
                  }`}
                />

                <span className="text-xs font-semibold text-slate-300">
                  {provider.availability
                    ? "Available for new bookings"
                    : "Currently unavailable"}
                </span>
              </div>

              {/* TITLE */}

              <h1 className="mt-6 text-3xl font-bold tracking-[-0.04em] text-white sm:text-5xl">
                Good morning{" "}
                <span className="bg-gradient-to-r from-cyan-300 to-teal-300 bg-clip-text text-transparent">
                  {userName}.
                </span>
              </h1>

              {/* DESCRIPTION */}

              <p className="mt-6 max-w-2xl text-sm leading-7 text-slate-300">
                Here's what's happening with your Sahayra business. Keep your
                services fresh and stay on top of customer requests.
              </p>

              {/* ACTIONS */}

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  to="/provider/create-service"
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 px-5 py-3 text-sm font-bold text-[#08131f] shadow-[0_8px_24px_rgba(34,211,238,0.18)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(34,211,238,0.25)]"
                >
                  Create Service
                  <ArrowIcon />
                </Link>

                <Link
                  to="/provider/bookings"
                  className="inline-flex items-center rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/10"
                >
                  All Bookings
                </Link>
              </div>
            </div>
          </section>

          {/* STATS */}

          <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {/* TOTAL */}

            <div className="rounded-[22px] border border-slate-200 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                  Total bookings
                </p>

                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0d1b2a] text-cyan-300">
                  <ActivityIcon />
                </span>
              </div>

              <p className="mt-5 text-3xl font-bold tracking-tight text-[#0d1b2a]">
                {stats.total}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                All customer requests
              </p>
            </div>

            {/* PENDING */}

            <div className="rounded-[22px] border border-amber-100 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                  Pending
                </p>

                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                </span>
              </div>

              <p className="mt-5 text-3xl font-bold tracking-tight text-[#0d1b2a]">
                {stats.pending}
              </p>

              <p className="mt-1 text-xs text-slate-400">Need your attention</p>
            </div>

            {/* ACTIVE */}

            <div className="rounded-[22px] border border-cyan-100 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                  Active
                </p>

                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                  <span className="h-2.5 w-2.5 rounded-full bg-cyan-500" />
                </span>
              </div>

              <p className="mt-5 text-3xl font-bold tracking-tight text-[#0d1b2a]">
                {stats.accepted}
              </p>

              <p className="mt-1 text-xs text-slate-400">Accepted bookings</p>
            </div>

            {/* COMPLETED */}

            <div className="rounded-[22px] border border-emerald-100 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                  Completed
                </p>

                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <CheckIcon />
                </span>
              </div>

              <p className="mt-5 text-3xl font-bold tracking-tight text-[#0d1b2a]">
                {stats.completed}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Successfully delivered
              </p>
            </div>
          </section>

          {/* ACTIVITY + PROFILE */}

          <section className="mt-8 grid gap-8 xl:grid-cols-[1.25fr_0.75fr]">
            {/* ACTIVITY */}

            <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
              <div className="flex items-center justify-between border-b border-slate-100 px-6 py-6 sm:px-7">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                      <CalendarIcon />
                    </div>

                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-teal-600">
                      Activity
                    </p>
                  </div>

                  <h2 className="mt-3 text-xl font-bold tracking-tight text-[#0d1b2a]">
                    Recent bookings
                  </h2>

                  <p className="mt-1 text-xs text-slate-400">
                    Latest customer activity
                  </p>
                </div>

                <Link
                  to="/provider/bookings"
                  className="text-xs font-bold text-slate-500 transition hover:text-teal-600"
                >
                  See all →
                </Link>
              </div>

              {recentBookings.length === 0 ? (
                <div className="px-7 py-16">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                    <CalendarIcon />
                  </div>

                  <h3 className="mt-5 text-lg font-bold text-[#0d1b2a]">
                    No booking activity
                  </h3>

                  <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                    Customer requests will appear here once a service booking is
                    created.
                  </p>

                  <Link
                    to="/provider/create-service"
                    className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-teal-600 transition hover:text-cyan-600"
                  >
                    Create a service
                    <ArrowIcon />
                  </Link>
                </div>
              ) : (
                <div>
                  {recentBookings.map((booking, index) => {
                    const status = getStatusColor(booking.status);

                    return (
                      <div
                        key={booking._id}
                        className="px-6 py-5 transition hover:bg-[#f8fbfb] sm:px-7"
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex w-8 shrink-0 flex-col items-center self-stretch">
                            <div
                              className={`mt-1 flex h-8 w-8 items-center justify-center rounded-xl ${status.bg} ${status.text}`}
                            >
                              {booking.status === "completed" ? (
                                <CheckIcon />
                              ) : (
                                <span
                                  className={`h-2.5 w-2.5 rounded-full ${status.dot}`}
                                />
                              )}
                            </div>

                            {index < recentBookings.length - 1 && (
                              <span className="mt-2 h-full min-h-8 w-px bg-slate-200" />
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                              <div className="min-w-0">
                                <p className="truncate text-sm font-bold text-[#0d1b2a]">
                                  {booking.service?.name || "Service booking"}
                                </p>

                                <p className="mt-1 text-xs text-slate-500">
                                  {booking.customer?.name || "Unknown customer"}
                                </p>
                              </div>

                              <span
                                className={`w-fit shrink-0 text-[11px] font-bold capitalize ${status.text}`}
                              >
                                {booking.status}
                              </span>
                            </div>

                            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-400">
                              <span>{formatDate(booking.bookingDate)}</span>

                              <span>{formatTime(booking.bookingDate)}</span>

                              <span className="font-semibold text-slate-600">
                                ₹{booking.amount ?? booking.service?.price ?? 0}
                              </span>
                            </div>

                            <div className="mt-3 flex items-center justify-between">
                              <span className="font-mono text-[10px] text-slate-300">
                                #{booking._id?.slice(-8)}
                              </span>

                              <button
                                type="button"
                                onClick={() => {
                                  if (booking.customer?._id) {
                                    navigate(`/chat/${booking.customer._id}`);
                                  }
                                }}
                                className="text-[11px] font-bold text-slate-400 transition hover:text-teal-600"
                              >
                                Message customer →
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="border-t border-slate-100 bg-[#f8fbfb] px-6 py-4 sm:px-7">
                <Link
                  to="/provider/bookings"
                  className="text-xs font-bold text-slate-600 transition hover:text-teal-600"
                >
                  Open booking workspace →
                </Link>
              </div>
            </div>

            {/* PROFILE */}

            <aside className="overflow-hidden rounded-[28px] border border-teal-100 bg-gradient-to-b from-[#f0fdfa] to-white shadow-[0_8px_30px_rgba(20,184,166,0.06)]">
              <div className="border-b border-teal-100 px-6 py-6 sm:px-7">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-teal-600">
                      Your Profile
                    </p>

                    <h2 className="mt-2 text-xl font-bold tracking-tight text-[#0d1b2a]">
                      Professional profile
                    </h2>
                  </div>

                  <Link
                    to="/provider"
                    className="rounded-xl bg-white px-3 py-2 text-xs font-bold text-teal-700 ring-1 ring-teal-100 transition hover:bg-teal-50"
                  >
                    View
                  </Link>
                </div>
              </div>

              <div className="px-6 py-7 sm:px-7">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-[22px] bg-[#0d1b2a] text-lg font-bold text-cyan-300 shadow-sm">
                    {profileImage ? (
                      <img
                        src={profileImage}
                        alt={userName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      initials
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-base font-bold text-[#0d1b2a]">
                      {userName}
                    </p>

                    <p className="mt-1 truncate text-xs text-slate-500">
                      {provider.location || "Location not provided"}
                    </p>

                    <div className="mt-2 flex items-center gap-2">
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          provider.availability
                            ? "bg-emerald-500"
                            : "bg-slate-300"
                        }`}
                      />

                      <span
                        className={`text-[11px] font-semibold ${
                          provider.availability
                            ? "text-emerald-600"
                            : "text-slate-500"
                        }`}
                      >
                        {provider.availability ? "Available" : "Unavailable"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* PROFILE STRENGTH */}

                <div className="mt-8 rounded-2xl bg-white p-5 ring-1 ring-teal-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-[#0d1b2a]">
                        Profile strength
                      </p>

                      <p className="mt-1 text-[11px] text-slate-400">
                        Keep your information complete
                      </p>
                    </div>

                    <span className="text-lg font-bold text-teal-600">
                      {profileScore}%
                    </span>
                  </div>

                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-teal-500 transition-all"
                      style={{
                        width: `${profileScore}%`,
                      }}
                    />
                  </div>
                </div>

                {/* FACTS */}

                <div className="mt-7">
                  <div className="flex items-center justify-between border-b border-teal-100 py-4">
                    <span className="text-xs text-slate-500">Experience</span>

                    <span className="text-sm font-bold text-[#0d1b2a]">
                      {provider.experience ?? 0} years
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-b border-teal-100 py-4">
                    <span className="text-xs text-slate-500">Verification</span>

                    <span
                      className={`text-xs font-bold capitalize ${
                        verification === "verified"
                          ? "text-emerald-600"
                          : verification === "rejected"
                            ? "text-rose-600"
                            : "text-amber-600"
                      }`}
                    >
                      {verification}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-4">
                    <span className="text-xs text-slate-500">Skills</span>

                    <span className="text-sm font-bold text-[#0d1b2a]">
                      {skills.length}
                    </span>
                  </div>
                </div>

                {/* SKILLS */}

                <div className="mt-5 border-t border-teal-100 pt-6">
                  <p className="text-xs font-bold text-[#0d1b2a]">Expertise</p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {skills.length ? (
                      skills.slice(0, 6).map((skill, index) => (
                        <span
                          key={`${skill}-${index}`}
                          className="rounded-lg bg-white px-3 py-2 text-[11px] font-medium text-slate-600 ring-1 ring-slate-200 transition hover:border-teal-200 hover:bg-teal-50"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-400">
                        No skills added yet.
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </aside>
          </section>

          {/* QUICK ACTIONS */}

          <section className="mt-10 pb-8">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-teal-600">
                  Shortcuts
                </p>

                <h2 className="mt-2 text-xl font-bold text-[#0d1b2a]">
                  Quick actions
                </h2>
              </div>
            </div>

            <div className="grid divide-y divide-slate-200 overflow-hidden rounded-[24px] border border-slate-200 bg-white sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              <Link
                to="/provider/create-service"
                className="group flex items-center justify-between p-5 transition hover:bg-cyan-50/40 sm:p-6"
              >
                <div>
                  <p className="text-sm font-bold text-[#0d1b2a]">
                    Create Service
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Add a new offering
                  </p>
                </div>

                <span className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-teal-600">
                  →
                </span>
              </Link>

              <Link
                to="/provider/services"
                className="group flex items-center justify-between p-5 transition hover:bg-teal-50/40 sm:p-6"
              >
                <div>
                  <p className="text-sm font-bold text-[#0d1b2a]">
                    Manage Services
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Update your listings
                  </p>
                </div>

                <span className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-teal-600">
                  →
                </span>
              </Link>

              <Link
                to="/provider/bookings"
                className="group flex items-center justify-between p-5 transition hover:bg-amber-50/50 sm:p-6"
              >
                <div>
                  <p className="text-sm font-bold text-[#0d1b2a]">
                    Booking Workspace
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Handle customer requests
                  </p>
                </div>

                <span className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-amber-600">
                  →
                </span>
              </Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default ProviderDashboard;

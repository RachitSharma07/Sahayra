import { useEffect, useState } from "react";
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

function MapPinIcon() {
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
        d="M19 10.2c0 5-7 10.3-7 10.3S5 15.2 5 10.2a7 7 0 1 1 14 0Z"
      />
      <circle cx="12" cy="10" r="2.3" />
    </svg>
  );
}

function BriefcaseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-5 w-5"
    >
      <rect x="3.5" y="7" width="17" height="13" rx="2.5" />
      <path
        strokeLinecap="round"
        d="M8 7V5.5A1.5 1.5 0 0 1 9.5 4h5A1.5 1.5 0 0 1 16 5.5V7M3.5 11.5h17"
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
        d="m19 16 .7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7L19 16Z"
      />
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

function Provider() {
  const navigate = useNavigate();

  const { user, loading: authLoading } = useAuth();

  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProvider = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/provider/dashboard`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load provider profile");
        }

        setProvider(data.provider);
      } catch (error) {
        console.error("Provider profile error:", error);

        setError(error.message || "Failed to load provider profile.");
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchProvider();
    }
  }, [navigate, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#f4f7f7]">
        <div className="px-5 py-6 sm:px-8 lg:px-10 lg:py-8">
          <div className="mx-auto max-w-7xl animate-pulse">
            <div className="flex items-center justify-between border-b border-slate-200 pb-5">
              <div className="h-10 w-36 rounded-xl bg-slate-200" />

              <div className="h-10 w-28 rounded-xl bg-slate-200" />
            </div>

            <div className="mt-10 h-[360px] rounded-[30px] bg-slate-200" />

            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              <div className="h-80 rounded-[28px] bg-slate-200" />

              <div className="h-80 rounded-[28px] bg-slate-200" />
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
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-rose-100 bg-rose-50 text-xl font-bold text-rose-600">
            !
          </div>

          <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.2em] text-rose-500">
            Provider Console
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#08131f]">
            Profile unavailable
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-500">{error}</p>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-7 rounded-xl bg-[#08131f] px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#0d1b2a]"
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

  const skills = Array.isArray(provider.skills) ? provider.skills : [];

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
      <div className="mx-auto max-w-7xl px-5 py-6 sm:px-8 lg:px-10 lg:py-8">
        {/* HEADER */}
        <header className="flex min-h-14 items-center justify-between border-b border-slate-200 pb-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-teal-600">
              ServiceHub
            </p>

            <p className="mt-1 text-sm font-semibold text-[#08131f]">
              Professional Profile
            </p>
          </div>

          <div className="flex items-center gap-3">
            <NotificationPanel />

            <Link
              to="/provider/dashboard"
              className="hidden rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 px-5 py-2.5 text-sm font-bold text-[#08131f] shadow-[0_10px_28px_rgba(34,211,238,0.14)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_32px_rgba(34,211,238,0.22)] sm:inline-flex"
            >
              Dashboard
            </Link>
          </div>
        </header>

        {/* HERO */}
        <section className="relative mt-10 overflow-hidden rounded-[32px] border border-[#163247] bg-[#08131f] shadow-[0_25px_70px_rgba(8,19,31,0.14)]">
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-teal-400/10 blur-3xl" />

          <div className="relative grid lg:grid-cols-[1fr_380px]">
            {/* HERO CONTENT */}
            <div className="px-7 py-10 sm:px-10 sm:py-12 lg:px-12 lg:py-14">
              <div className="flex items-center gap-3">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    provider.availability
                      ? "bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,0.7)]"
                      : "bg-slate-500"
                  }`}
                />

                <span className="text-xs font-semibold text-slate-400">
                  {provider.availability
                    ? "Available for new bookings"
                    : "Currently unavailable"}
                </span>
              </div>

              <p className="mt-8 text-[10px] font-bold uppercase tracking-[0.22em] text-cyan-300">
                Professional profile
              </p>

              <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-[1.08] tracking-[-0.045em] text-white sm:text-5xl lg:text-[56px]">
                {userName}

                <span className="mt-2 block bg-gradient-to-r from-cyan-300 via-teal-300 to-emerald-300 bg-clip-text text-transparent">
                  Build trust. Get booked.
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
                Your professional presence on ServiceHub. Keep your skills,
                experience and service area accurate so customers know exactly
                what you offer.
              </p>

              <div className="mt-9 flex flex-wrap gap-3">
                <Link
                  to="/provider/services"
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 px-5 py-3 text-sm font-bold text-[#08131f] shadow-[0_12px_30px_rgba(34,211,238,0.16)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_38px_rgba(34,211,238,0.24)]"
                >
                  Manage Services
                  <ArrowIcon />
                </Link>

                <Link
                  to="/provider/bookings"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-bold text-white transition duration-200 hover:border-cyan-300/20 hover:bg-white/10"
                >
                  View Bookings
                  <ArrowIcon />
                </Link>
              </div>
            </div>

            {/* PROFILE SUMMARY */}
            <div className="border-t border-white/10 bg-white/[0.035] px-7 py-9 sm:px-10 lg:border-l lg:border-t-0 lg:px-9">
              <div className="flex h-full flex-col justify-center">
                <div className="flex items-center gap-4">
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-[24px] border border-cyan-300/10 bg-gradient-to-br from-cyan-400/20 to-teal-400/10 text-xl font-bold text-cyan-200 shadow-[0_0_35px_rgba(34,211,238,0.08)]">
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
                    <p className="truncate text-lg font-bold text-white">
                      {userName}
                    </p>

                    <div className="mt-1 flex items-center gap-2 text-sm text-slate-400">
                      <MapPinIcon />

                      <span className="truncate">
                        {provider.location || "Service provider"}
                      </span>
                    </div>

                    <div className="mt-2 flex items-center gap-2">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          provider.availability
                            ? "bg-emerald-400"
                            : "bg-slate-500"
                        }`}
                      />

                      <span
                        className={`text-xs font-semibold ${
                          provider.availability
                            ? "text-emerald-300"
                            : "text-slate-400"
                        }`}
                      >
                        {provider.availability ? "Available" : "Unavailable"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* PROFILE STRENGTH */}
                <div className="mt-9 border-t border-white/10 pt-6">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400">
                      Profile strength
                    </span>

                    <span className="text-sm font-bold text-cyan-300">
                      {profileScore}%
                    </span>
                  </div>

                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-teal-400 transition-all duration-700"
                      style={{
                        width: `${profileScore}%`,
                      }}
                    />
                  </div>

                  <p className="mt-3 text-xs leading-5 text-slate-500">
                    Complete more profile details to build customer confidence.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PROFESSIONAL INFORMATION */}
        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-[28px] border border-slate-200 bg-white p-7 shadow-[0_12px_40px_rgba(8,19,31,0.045)] sm:p-8">
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50 text-teal-600">
                <BriefcaseIcon />
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-teal-600">
                  Professional
                </p>

                <h2 className="mt-1 text-xl font-bold tracking-tight text-[#08131f]">
                  Work profile
                </h2>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2">
              <div className="border-b border-r border-slate-100 py-5 pr-5">
                <p className="text-xs font-medium text-slate-400">Experience</p>

                <p className="mt-2 text-2xl font-bold tracking-tight text-[#08131f]">
                  {provider.experience ?? 0}
                </p>

                <p className="mt-1 text-xs text-slate-500">years</p>
              </div>

              <div className="border-b border-slate-100 py-5 pl-5">
                <p className="text-xs font-medium text-slate-400">Expertise</p>

                <p className="mt-2 text-2xl font-bold tracking-tight text-[#08131f]">
                  {skills.length}
                </p>

                <p className="mt-1 text-xs text-slate-500">skill areas</p>
              </div>

              <div className="border-r border-slate-100 py-5 pr-5">
                <p className="text-xs font-medium text-slate-400">Location</p>

                <div className="mt-3 flex items-center gap-2">
                  <span className="text-teal-600">
                    <MapPinIcon />
                  </span>

                  <p className="truncate text-sm font-bold text-[#0d1b2a]">
                    {provider.location || "Not provided"}
                  </p>
                </div>
              </div>

              <div className="py-5 pl-5">
                <p className="text-xs font-medium text-slate-400">
                  Verification
                </p>

                <div className="mt-3 flex items-center gap-2">
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full ${
                      verification === "verified"
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-amber-50 text-amber-600"
                    }`}
                  >
                    <CheckIcon />
                  </span>

                  <p className="text-sm font-bold capitalize text-[#0d1b2a]">
                    {verification}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* SKILLS */}
          <div className="rounded-[28px] border border-slate-200 bg-white p-7 shadow-[0_12px_40px_rgba(8,19,31,0.045)] sm:p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600">
                  <SparkIcon />
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-600">
                    Expertise
                  </p>

                  <h2 className="mt-1 text-xl font-bold tracking-tight text-[#08131f]">
                    Skills
                  </h2>
                </div>
              </div>

              <span className="rounded-full border border-slate-200 bg-[#f8fbfb] px-3 py-1.5 text-[11px] font-bold text-slate-500">
                {skills.length}
              </span>
            </div>

            <div className="mt-7">
              {skills.length > 0 ? (
                <div className="grid gap-2 sm:grid-cols-2">
                  {skills.map((skill, index) => (
                    <div
                      key={`${skill}-${index}`}
                      className="group flex items-center gap-3 rounded-xl border border-slate-100 bg-[#f8fbfb] px-4 py-3 transition duration-200 hover:-translate-y-0.5 hover:border-teal-100 hover:bg-teal-50/50"
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white text-[10px] font-bold text-teal-600 shadow-sm">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <span className="truncate text-sm font-semibold text-slate-700">
                        {skill}
                      </span>

                      <span className="ml-auto text-slate-300 transition group-hover:text-teal-500">
                        <ArrowIcon />
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-[#f8fbfb] px-5 py-8 text-center">
                  <p className="text-sm font-semibold text-slate-500">
                    No skills added yet.
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Add your expertise to strengthen your profile.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* AVAILABILITY */}
        <section className="mt-8 overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_12px_40px_rgba(8,19,31,0.045)]">
          <div className="grid lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="p-7 sm:p-8">
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                    provider.availability
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  <span className="h-3 w-3 rounded-full bg-current" />
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                    Booking status
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-[#08131f]">
                    Booking availability
                  </h2>
                </div>
              </div>

              <p className="mt-5 max-w-2xl text-sm leading-6 text-slate-500">
                {provider.availability
                  ? "Customers can currently discover your services and send booking requests."
                  : "Booking requests are currently disabled."}
              </p>
            </div>

            <div className="border-t border-slate-100 bg-[#f8fbfb] px-7 py-6 lg:border-l lg:border-t-0 lg:px-9">
              <span
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold ${
                  provider.availability
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    provider.availability ? "bg-emerald-500" : "bg-slate-400"
                  }`}
                />

                {provider.availability ? "Available" : "Unavailable"}
              </span>
            </div>
          </div>
        </section>

        {/* FOOTER ACTIONS */}
        <section className="mt-10 overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_12px_40px_rgba(8,19,31,0.045)]">
          <div className="border-b border-slate-100 px-7 py-6 sm:px-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
              Provider workspace
            </p>

            <h2 className="mt-1 text-xl font-bold tracking-tight text-[#08131f]">
              Quick actions
            </h2>
          </div>

          <div className="grid md:grid-cols-3">
            <Link
              to="/provider/dashboard"
              className="group border-b border-slate-100 px-7 py-7 transition duration-200 hover:bg-[#f8fbfb] md:border-b-0 md:border-r"
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-teal-600">
                Workspace
              </p>

              <h3 className="mt-2 text-base font-bold text-[#08131f]">
                Dashboard
              </h3>

              <p className="mt-2 text-xs leading-5 text-slate-500">
                See business activity and booking performance.
              </p>

              <div className="mt-5 flex items-center gap-2 text-xs font-bold text-teal-600">
                Open dashboard
                <ArrowIcon />
              </div>
            </Link>

            <Link
              to="/provider/services"
              className="group border-b border-slate-100 px-7 py-7 transition duration-200 hover:bg-[#f8fbfb] md:border-b-0 md:border-r"
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-600">
                Listings
              </p>

              <h3 className="mt-2 text-base font-bold text-[#08131f]">
                Services
              </h3>

              <p className="mt-2 text-xs leading-5 text-slate-500">
                Create and keep your service offerings current.
              </p>

              <div className="mt-5 flex items-center gap-2 text-xs font-bold text-cyan-600">
                Manage services
                <ArrowIcon />
              </div>
            </Link>

            <Link
              to="/provider/bookings"
              className="group px-7 py-7 transition duration-200 hover:bg-[#f8fbfb]"
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-amber-600">
                Customers
              </p>

              <h3 className="mt-2 text-base font-bold text-[#08131f]">
                Bookings
              </h3>

              <p className="mt-2 text-xs leading-5 text-slate-500">
                Handle incoming customer requests and work.
              </p>

              <div className="mt-5 flex items-center gap-2 text-xs font-bold text-amber-600">
                Open bookings
                <ArrowIcon />
              </div>
            </Link>
          </div>
        </section>

        <div className="h-8" />
      </div>
    </div>
  );
}

export default Provider;

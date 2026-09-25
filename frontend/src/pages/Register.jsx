import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

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

function CheckIcon() {
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
        d="m5.5 12.5 4 4L18.5 7.5"
      />
    </svg>
  );
}

function ShieldIcon() {
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
        d="M12 3.5 19 6v5.4c0 4.2-2.8 7.9-7 9.1-4.2-1.2-7-4.9-7-9.1V6l7-2.5Z"
      />

      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m9.5 12 1.7 1.7 3.6-3.7"
      />
    </svg>
  );
}

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Registration failed");
        return;
      }

      setSuccess("Account created successfully!");

      setName("");
      setEmail("");
      setPassword("");

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (error) {
      console.error("Register error:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @keyframes registerFloat {
          0%, 100% {
            transform: translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(0, -14px, 0);
          }
        }

        @keyframes registerGlow {
          0%, 100% {
            opacity: 0.4;
            transform: scale(1);
          }
          50% {
            opacity: 0.78;
            transform: scale(1.08);
          }
        }

        @keyframes registerRise {
          from {
            opacity: 0;
            transform: translateY(14px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .register-rise {
          animation: registerRise 0.55s ease both;
        }

        .register-float {
          animation: registerFloat 7s ease-in-out infinite;
        }

        .register-glow {
          animation: registerGlow 6s ease-in-out infinite;
        }
      `}</style>

      <div className="min-h-screen bg-[#08131f] px-4 py-4 sm:px-6 sm:py-6">
        <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-6xl overflow-hidden rounded-[30px] border border-white/10 bg-white shadow-[0_30px_90px_rgba(0,0,0,0.28)] sm:min-h-[calc(100vh-3rem)] lg:grid-cols-[0.98fr_1.02fr]">
          {/* ---------------------------------------- */}
          {/* Left experience panel */}
          {/* ---------------------------------------- */}
          <div className="relative hidden overflow-hidden bg-[#08131f] p-10 lg:flex lg:flex-col lg:justify-between xl:p-12">
            <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-teal-400/15 blur-3xl register-glow" />

            <div
              className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-cyan-400/15 blur-3xl register-glow"
              style={{ animationDelay: "1.5s" }}
            />

            <div className="pointer-events-none absolute left-20 top-40 h-24 w-24 rounded-full border border-teal-300/10 register-float" />

            <div className="relative z-10">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="flex items-center gap-3"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-teal-400 text-xl font-black text-[#08131f] shadow-[0_8px_30px_rgba(34,211,238,0.22)]">
                  S
                </div>

                <span className="text-2xl font-black tracking-tight text-white">
                  Sahayra
                </span>
              </button>

              <div className="register-rise mt-24 max-w-lg">
                <div className="inline-flex items-center gap-2 rounded-full border border-teal-300/15 bg-teal-300/5 px-3 py-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-teal-300" />

                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-teal-200">
                    Join Sahayra
                  </span>
                </div>

                <h1 className="mt-6 text-5xl font-black leading-[1.04] tracking-[-0.045em] text-white xl:text-[56px]">
                  Start with a
                  <span className="block text-teal-300">
                    better service experience.
                  </span>
                </h1>

                <p className="mt-6 max-w-md text-base leading-7 text-slate-400">
                  Create your account and start discovering trusted
                  professionals, managing bookings and building better service
                  connections.
                </p>
              </div>

              <div className="register-rise mt-10 space-y-3">
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-300/10 text-cyan-300">
                    <CheckIcon />
                  </div>

                  <p className="text-sm font-semibold text-slate-300">
                    Discover useful local services
                  </p>
                </div>

                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-300/10 text-teal-300">
                    <CheckIcon />
                  </div>

                  <p className="text-sm font-semibold text-slate-300">
                    Manage appointments in one place
                  </p>
                </div>

                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-300/10 text-amber-300">
                    <CheckIcon />
                  </div>

                  <p className="text-sm font-semibold text-slate-300">
                    Connect directly with professionals
                  </p>
                </div>
              </div>
            </div>

            {/* Increased separation from last feature card */}
            <div className="relative z-10 mt-16 flex shrink-0 items-center gap-3 border-t border-white/5 pt-7 text-sm text-slate-500">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-300/10 bg-emerald-300/5 text-emerald-300">
                <ShieldIcon />
              </div>

              <div>
                <p className="font-semibold text-slate-300">
                  Simple and secure signup
                </p>

                <p className="text-xs text-slate-500">
                  Create your account in a few seconds.
                </p>
              </div>
            </div>
          </div>

          {/* ---------------------------------------- */}
          {/* Right form panel */}
          {/* ---------------------------------------- */}
          <div className="relative flex items-center justify-center overflow-hidden bg-[#f4f7f7] px-6 py-10 sm:px-10 lg:px-12">
            <div className="pointer-events-none absolute -right-24 top-12 h-64 w-64 rounded-full bg-teal-200/25 blur-3xl" />

            <div className="pointer-events-none absolute -left-20 bottom-12 h-64 w-64 rounded-full bg-cyan-200/20 blur-3xl" />

            <div className="relative w-full max-w-md">
              <div className="register-rise mb-10 flex items-center justify-between lg:hidden">
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="flex items-center gap-3"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-teal-400 text-lg font-black text-[#08131f]">
                    S
                  </div>

                  <span className="text-xl font-black tracking-tight text-[#0d1b2a]">
                    Sahayra
                  </span>
                </button>
              </div>

              <div className="register-rise">
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-teal-600">
                  Get started
                </p>

                <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-[#0b1825] sm:text-4xl">
                  Create your account.
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Join Sahayra and start using the platform today.
                </p>
              </div>

              {error && (
                <div className="register-rise mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-4">
                  <p className="text-sm font-semibold text-rose-700">{error}</p>
                </div>
              )}

              {success && (
                <div className="register-rise mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                      <CheckIcon />
                    </div>

                    <div>
                      <p className="text-sm font-black text-emerald-900">
                        Account created
                      </p>

                      <p className="mt-1 text-xs leading-5 text-emerald-700">
                        {success}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleRegister} className="mt-8 space-y-5">
                <div className="register-rise">
                  <label
                    htmlFor="name"
                    className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-slate-500"
                  >
                    Full name
                  </label>

                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    required
                    autoComplete="name"
                    className="h-13 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-[#0d1b2a] outline-none transition duration-200 placeholder:text-slate-400 focus:border-teal-300 focus:ring-4 focus:ring-teal-500/10"
                  />
                </div>

                <div
                  className="register-rise"
                  style={{ animationDelay: "70ms" }}
                >
                  <label
                    htmlFor="email"
                    className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-slate-500"
                  >
                    Email address
                  </label>

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    autoComplete="email"
                    className="h-13 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-[#0d1b2a] outline-none transition duration-200 placeholder:text-slate-400 focus:border-teal-300 focus:ring-4 focus:ring-teal-500/10"
                  />
                </div>

                <div
                  className="register-rise"
                  style={{ animationDelay: "140ms" }}
                >
                  <label
                    htmlFor="password"
                    className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-slate-500"
                  >
                    Password
                  </label>

                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create a password"
                      required
                      autoComplete="new-password"
                      className="h-13 w-full rounded-2xl border border-slate-200 bg-white px-4 pr-20 text-sm text-[#0d1b2a] outline-none transition duration-200 placeholder:text-slate-400 focus:border-teal-300 focus:ring-4 focus:ring-teal-500/10"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs font-bold text-slate-500 transition hover:bg-slate-100 hover:text-[#0d1b2a]"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                <div
                  className="register-rise flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3.5"
                  style={{ animationDelay: "210ms" }}
                >
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                    <ShieldIcon />
                  </div>

                  <p className="text-xs leading-5 text-amber-800">
                    Use an email address you can access so your account details
                    remain easy to manage.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="group register-rise flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-[#08131f] px-5 text-sm font-bold text-white shadow-[0_12px_28px_rgba(8,19,31,0.16)] transition duration-200 hover:-translate-y-0.5 hover:bg-teal-600 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:bg-[#08131f]"
                  style={{ animationDelay: "280ms" }}
                >
                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Creating account...
                    </>
                  ) : (
                    <>
                      Create account
                      <span className="transition-transform group-hover:translate-x-0.5">
                        <ArrowRightIcon />
                      </span>
                    </>
                  )}
                </button>
              </form>

              <div
                className="register-rise mt-7 rounded-2xl border border-slate-200 bg-white/75 px-4 py-4 text-center"
                style={{ animationDelay: "350ms" }}
              >
                <p className="text-sm text-slate-500">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="font-bold text-teal-600 transition hover:text-teal-700"
                  >
                    Sign in
                  </Link>
                </p>
              </div>

              <p
                className="register-rise mt-7 text-center text-[10px] leading-5 text-slate-400"
                style={{ animationDelay: "420ms" }}
              >
                By creating an account, you agree to our Terms of Service and
                Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;

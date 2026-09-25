import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

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

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        localStorage.setItem("token", data.token);

        if (data.user.role === "provider") {
          navigate("/provider/dashboard");
        } else if (data.user.role === "customer") {
          navigate("/customer");
        } else if (data.user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
      } else {
        setError(data.message || "Invalid email or password");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Unable to connect to the server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @keyframes authFloat {
          0%, 100% {
            transform: translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(0, -12px, 0);
          }
        }

        @keyframes authGlow {
          0%, 100% {
            opacity: 0.45;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.08);
          }
        }

        @keyframes authRise {
          from {
            opacity: 0;
            transform: translateY(14px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .auth-rise {
          animation: authRise 0.55s ease both;
        }

        .auth-float {
          animation: authFloat 7s ease-in-out infinite;
        }

        .auth-glow {
          animation: authGlow 6s ease-in-out infinite;
        }
      `}</style>

      <div className="min-h-screen bg-[#08131f] px-4 py-4 sm:px-6 sm:py-6">
        <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-6xl overflow-hidden rounded-[30px] border border-white/10 bg-white shadow-[0_30px_90px_rgba(0,0,0,0.28)] sm:min-h-[calc(100vh-3rem)] lg:grid-cols-[1.02fr_0.98fr]">
          {/* ---------------------------------------- */}
          {/* Left experience panel */}
          {/* ---------------------------------------- */}
          <div className="relative hidden overflow-hidden bg-[#08131f] p-10 lg:flex lg:flex-col lg:justify-between xl:p-12">
            <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-cyan-400/15 blur-3xl auth-glow" />

            <div
              className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-teal-400/15 blur-3xl auth-glow"
              style={{ animationDelay: "1.5s" }}
            />

            <div className="pointer-events-none absolute right-16 top-32 h-28 w-28 rounded-full border border-cyan-300/10 auth-float" />

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
                  ServiceHub
                </span>
              </button>

              <div className="auth-rise mt-24 max-w-lg">
                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/15 bg-cyan-300/5 px-3 py-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-200">
                    Welcome back
                  </span>
                </div>

                <h1 className="mt-6 text-5xl font-black leading-[1.04] tracking-[-0.045em] text-white xl:text-[56px]">
                  Your services.
                  <span className="block text-cyan-300">
                    One connected place.
                  </span>
                </h1>

                <p className="mt-6 max-w-md text-base leading-7 text-slate-400">
                  Discover professionals, manage bookings and stay connected
                  with the people delivering your services.
                </p>
              </div>

              <div className="auth-rise mt-10 grid max-w-md grid-cols-2 gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4 backdrop-blur-sm">
                  <p className="text-xs font-bold text-white">Discover</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Find services that fit your needs.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4 backdrop-blur-sm">
                  <p className="text-xs font-bold text-white">Connect</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Chat with professionals directly.
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
                  Secure service management
                </p>

                <p className="text-xs text-slate-500">
                  Built for customers and professionals.
                </p>
              </div>
            </div>
          </div>

          {/* ---------------------------------------- */}
          {/* Right form panel */}
          {/* ---------------------------------------- */}
          <div className="relative flex items-center justify-center overflow-hidden bg-[#f4f7f7] px-6 py-10 sm:px-10 lg:px-12">
            <div className="pointer-events-none absolute -right-20 top-10 h-56 w-56 rounded-full bg-cyan-200/25 blur-3xl" />

            <div className="pointer-events-none absolute -left-20 bottom-10 h-56 w-56 rounded-full bg-teal-200/20 blur-3xl" />

            <div className="relative w-full max-w-md">
              <div className="auth-rise mb-10 flex items-center justify-between lg:hidden">
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="flex items-center gap-3"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-teal-400 text-lg font-black text-[#08131f]">
                    S
                  </div>

                  <span className="text-xl font-black tracking-tight text-[#0d1b2a]">
                    ServiceHub
                  </span>
                </button>
              </div>

              <div className="auth-rise">
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-teal-600">
                  Welcome back
                </p>

                <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-[#0b1825] sm:text-4xl">
                  Sign in to ServiceHub.
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Continue managing your bookings, services and conversations.
                </p>
              </div>

              {error && (
                <div className="auth-rise mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-4">
                  <p className="text-sm font-semibold text-rose-700">{error}</p>
                </div>
              )}

              <form onSubmit={handleLogin} className="mt-8 space-y-5">
                <div className="auth-rise">
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

                <div className="auth-rise" style={{ animationDelay: "70ms" }}>
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="block text-xs font-bold uppercase tracking-[0.14em] text-slate-500"
                    >
                      Password
                    </label>

                    <button
                      type="button"
                      className="text-xs font-bold text-teal-600 transition hover:text-teal-700"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                      autoComplete="current-password"
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
                  className="auth-rise flex items-center justify-between gap-4"
                  style={{ animationDelay: "140ms" }}
                >
                  <label className="flex cursor-pointer items-center gap-2.5">
                    <input
                      id="remember"
                      type="checkbox"
                      className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                    />

                    <span className="text-xs font-medium text-slate-500">
                      Remember me
                    </span>
                  </label>

                  <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                    Secure sign in
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="group auth-rise flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-[#08131f] px-5 text-sm font-bold text-white shadow-[0_12px_28px_rgba(8,19,31,0.16)] transition duration-200 hover:-translate-y-0.5 hover:bg-teal-600 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:bg-[#08131f]"
                  style={{ animationDelay: "210ms" }}
                >
                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign in
                      <span className="transition-transform group-hover:translate-x-0.5">
                        <ArrowRightIcon />
                      </span>
                    </>
                  )}
                </button>
              </form>

              <div
                className="auth-rise mt-7 rounded-2xl border border-slate-200 bg-white/75 px-4 py-4 text-center"
                style={{ animationDelay: "280ms" }}
              >
                <p className="text-sm text-slate-500">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => navigate("/register")}
                    className="font-bold text-teal-600 transition hover:text-teal-700"
                  >
                    Create account
                  </button>
                </p>
              </div>

              <p className="auth-rise mt-7 text-center text-[10px] leading-5 text-slate-400">
                By continuing, you agree to our Terms of Service and Privacy
                Policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;

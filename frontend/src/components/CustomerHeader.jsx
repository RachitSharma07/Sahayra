import NotificationPanel from "./NotificationPanel";
import { useAuth } from "../context/AuthContext";

function MenuIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
    >
      <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function CustomerHeader({ onMenuClick, section, description }) {
  const { user, loading } = useAuth();

  const userName = user?.name || "Customer";

  return (
    <>
      <style>{`
        @keyframes customerHeaderIn {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes customerHeaderGlow {
          0%, 100% {
            opacity: .25;
          }
          50% {
            opacity: .55;
          }
        }

        .customer-header {
          animation: customerHeaderIn .55s ease-out;
        }

        .customer-header-glow {
          animation: customerHeaderGlow 4s ease-in-out infinite;
        }

        .customer-menu-button {
          transition:
            transform .25s ease,
            border-color .25s ease,
            background-color .25s ease,
            color .25s ease,
            box-shadow .25s ease;
        }

        .customer-menu-button:hover {
          transform: translateY(-2px);
          border-color: rgba(20,184,166,.35);
          color: #0f766e;
          box-shadow: 0 8px 24px rgba(13,27,42,.07);
        }

        .customer-avatar {
          transition:
            transform .25s ease,
            box-shadow .25s ease;
        }

        .customer-avatar:hover {
          transform: scale(1.05);
          box-shadow: 0 10px 25px rgba(45,212,191,.18);
        }

        @media (prefers-reduced-motion: reduce) {
          .customer-header,
          .customer-header-glow,
          .customer-menu-button,
          .customer-avatar {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>

      <header className="customer-header sticky top-0 z-30 border-b border-slate-200/70 bg-[#f4f7f7]/85 backdrop-blur-2xl">
        <div className="relative flex h-[76px] items-center justify-between px-5 sm:px-8">
          {/* Subtle ambient glow */}
          <div className="customer-header-glow pointer-events-none absolute left-[18%] top-1/2 h-24 w-40 -translate-y-1/2 rounded-full bg-teal-300/10 blur-3xl" />

          {/* Mobile menu */}
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Open navigation"
            className="customer-menu-button relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-[#0d1b2a] lg:hidden"
          >
            <MenuIcon />
          </button>

          {/* Section title */}
          <div className="relative hidden lg:block">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-teal-600">
              {section || "Customer workspace"}
            </p>

            <p className="mt-1 text-sm font-medium text-slate-500">
              {description || "Manage your Sahayra experience"}
            </p>
          </div>

          {/* Right side */}
          <div className="relative ml-auto flex items-center gap-3">
            <NotificationPanel />

            <div className="hidden items-center gap-3 border-l border-slate-200 pl-3 sm:flex">
              {loading ? (
                <>
                  <div className="h-10 w-10 animate-pulse rounded-full bg-slate-200" />

                  <div className="hidden xl:block">
                    <div className="h-3 w-24 animate-pulse rounded bg-slate-200" />

                    <div className="mt-2 h-2.5 w-14 animate-pulse rounded bg-slate-100" />
                  </div>
                </>
              ) : (
                <>
                  <div className="text-right">
                    <p className="text-sm font-semibold tracking-tight text-[#0d1b2a]">
                      {userName}
                    </p>

                    <p className="mt-0.5 text-[11px] text-slate-400">
                      Customer
                    </p>
                  </div>

                  <div className="customer-avatar relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-[#0d1b2a] text-sm font-bold text-white shadow-sm">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 via-teal-400 to-emerald-300 opacity-90" />

                    <span className="relative z-10 text-[#08232c]">
                      {userName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

export default CustomerHeader;

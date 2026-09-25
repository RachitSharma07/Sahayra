import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function HomeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-full w-full"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V10Z"
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-full w-full"
    >
      <circle cx="11" cy="11" r="6.5" />
      <path strokeLinecap="round" d="m16 16 4.5 4.5" />
    </svg>
  );
}

function BookingIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-full w-full"
    >
      <rect x="3.5" y="5" width="17" height="16" rx="2.5" />
      <path strokeLinecap="round" d="M7.5 3.5v3M16.5 3.5v3M3.5 10h17" />
    </svg>
  );
}

function ReviewIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-full w-full"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m12 3 2.3 5 5.4.6-4 3.7 1.1 5.4L12 14.8 7.2 17.7l1.1-5.4-4-3.7 5.4-.6L12 3Z"
      />
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
      <path strokeLinecap="round" d="M5 12h13" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m13 7 5 5-5 5" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
    >
      <path strokeLinecap="round" d="m7 7 10 10M17 7 7 17" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10 5H6.5A1.5 1.5 0 0 0 5 6.5v11A1.5 1.5 0 0 0 6.5 19H10"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 8l4 4-4 4" />
      <path strokeLinecap="round" d="M17 12H9" />
    </svg>
  );
}

function CustomerSidebar({ open, onClose }) {
  const location = useLocation();
  const { logout } = useAuth();

  const items = [
    {
      label: "Overview",
      to: "/customer",
      icon: <HomeIcon />,
    },
    {
      label: "Explore Services",
      to: "/services",
      icon: <SearchIcon />,
    },
    {
      label: "My Bookings",
      to: "/customer/bookings",
      icon: <BookingIcon />,
    },
    {
      label: "Reviews",
      to: "/customer/review",
      icon: <ReviewIcon />,
    },
  ];

  const isActive = (path) => {
    if (path === "/customer") {
      return location.pathname === "/customer";
    }

    return location.pathname === path;
  };

  const handleLogout = () => {
    onClose?.();
    logout();
  };

  return (
    <>
      <style>{`
        @keyframes sidebarIn {
          from {
            opacity: 0;
            transform: translateX(-12px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes logoGlow {
          0%, 100% {
            box-shadow: 0 8px 25px rgba(45,212,191,.16);
          }
          50% {
            box-shadow: 0 12px 35px rgba(45,212,191,.28);
          }
        }

        .customer-sidebar {
          animation: sidebarIn .55s ease-out;
        }

        .customer-logo-glow {
          animation: logoGlow 4s ease-in-out infinite;
        }

        .customer-nav-item {
          transition:
            transform .25s ease,
            background-color .25s ease,
            color .25s ease,
            border-color .25s ease,
            box-shadow .25s ease;
        }

        .customer-nav-item:hover {
          transform: translateX(3px);
        }

        .customer-nav-active {
          box-shadow: inset 3px 0 0 #2dd4bf;
        }

        .customer-bottom-cta {
          transition:
            transform .3s ease,
            border-color .3s ease,
            background-color .3s ease,
            box-shadow .3s ease;
        }

        .customer-bottom-cta:hover {
          transform: translateY(-3px);
          border-color: rgba(45,212,191,.25);
          background-color: rgba(255,255,255,.07);
          box-shadow: 0 18px 45px rgba(0,0,0,.16);
        }

        .customer-logout {
          transition:
            transform .2s ease,
            background-color .2s ease,
            border-color .2s ease,
            color .2s ease;
        }

        .customer-logout:hover {
          transform: translateX(3px);
        }

        @media (prefers-reduced-motion: reduce) {
          .customer-sidebar,
          .customer-logo-glow,
          .customer-nav-item,
          .customer-bottom-cta,
          .customer-logout {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>

      {/* Mobile backdrop */}
      {open && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-[#05111b]/65 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`customer-sidebar fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col overflow-hidden bg-[#08131f] text-white shadow-[18px_0_55px_rgba(5,17,27,.12)] transition-transform duration-300 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Ambient glow */}
        <div className="pointer-events-none absolute -right-24 top-24 h-64 w-64 rounded-full bg-cyan-400/6 blur-[90px]" />

        <div className="pointer-events-none absolute -left-20 bottom-24 h-56 w-56 rounded-full bg-teal-300/5 blur-[90px]" />

        {/* Brand */}
        <div className="relative flex h-20 shrink-0 items-center justify-between border-b border-white/[0.07] px-6">
          <Link
            to="/customer"
            onClick={onClose}
            className="group flex items-center gap-3"
          >
            <div className="customer-logo-glow relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-[14px] bg-gradient-to-br from-cyan-400 via-teal-400 to-emerald-300 text-sm font-black text-[#07202b]">
              <span className="relative z-10">S</span>

              <div className="absolute inset-0 rotate-45 bg-white/20 blur-md transition-transform duration-500 group-hover:translate-x-1" />
            </div>

            <div>
              <p className="text-sm font-bold tracking-tight text-white">
                Sahayra
              </p>

              <p className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.2em] text-white/30">
                Customer
              </p>
            </div>
          </Link>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
            className="flex h-9 w-9 items-center justify-center rounded-xl text-white/35 transition hover:bg-white/[0.06] hover:text-white lg:hidden"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Navigation */}
        <div className="relative flex-1 overflow-y-auto px-4 pt-7">
          <p className="px-3 text-[10px] font-bold uppercase tracking-[0.22em] text-white/25">
            Workspace
          </p>

          <nav className="mt-3 space-y-1.5">
            {items.map((item) => {
              const active = isActive(item.to);

              return (
                <Link
                  key={`${item.label}-${item.to}`}
                  to={item.to}
                  onClick={onClose}
                  className={`customer-nav-item customer-nav-${
                    active ? "active" : "idle"
                  } group flex items-center gap-3 rounded-xl border border-transparent px-3 py-3 text-sm font-medium ${
                    active
                      ? "bg-white/[0.075] text-white"
                      : "text-white/45 hover:bg-white/[0.045] hover:text-white"
                  }`}
                >
                  <span
                    className={`flex h-5 w-5 shrink-0 ${
                      active
                        ? "text-cyan-300"
                        : "text-white/30 group-hover:text-teal-200"
                    }`}
                  >
                    {item.icon}
                  </span>

                  <span>{item.label}</span>

                  {active && (
                    <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-md bg-cyan-300/10 text-cyan-300">
                      <ArrowIcon />
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom actions */}
        <div className="relative shrink-0 space-y-3 p-5">
          {/* Find a Service */}
          <Link
            to="/services"
            onClick={onClose}
            className="customer-bottom-cta group block rounded-[22px] border border-white/[0.08] bg-white/[0.035] p-4"
          >
            <div className="flex items-center gap-3">
              <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-cyan-400/15 to-teal-400/10 text-cyan-300">
                <span className="text-xl font-light">+</span>
              </div>

              <div className="min-w-0">
                <p className="text-xs font-bold text-white">Find a Service</p>

                <p className="mt-1 text-[10px] leading-4 text-white/30">
                  Discover local professionals
                </p>
              </div>

              <span className="ml-auto text-white/20 transition duration-300 group-hover:translate-x-1 group-hover:text-cyan-300">
                <ArrowIcon />
              </span>
            </div>
          </Link>

          {/* Logout */}
          <button
            type="button"
            onClick={handleLogout}
            className="customer-logout group flex w-full items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-3 text-sm font-medium text-white/50 hover:border-red-400/20 hover:bg-red-400/[0.06] hover:text-red-300"
          >
            <span className="flex h-5 w-5 shrink-0 items-center justify-center text-white/35 transition group-hover:text-red-300">
              <LogoutIcon />
            </span>

            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default CustomerSidebar;

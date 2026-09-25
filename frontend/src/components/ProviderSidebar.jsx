import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function HomeIcon() {
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
        d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V10Z"
      />
    </svg>
  );
}

function ServicesIcon() {
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
        d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 17.5v-11Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 8h8M8 12h8M8 16h5"
      />
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
      className="h-5 w-5"
    >
      <rect x="3.5" y="5" width="17" height="16" rx="2.5" />
      <path strokeLinecap="round" d="M7.5 3.5v3M16.5 3.5v3M3.5 10h17" />
    </svg>
  );
}

function ProfileIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-5 w-5"
    >
      <circle cx="12" cy="8" r="3.5" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5.5 20c.7-3.6 3-5.5 6.5-5.5s5.8 1.9 6.5 5.5"
      />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-5 w-5"
    >
      <path strokeLinecap="round" d="M10 4v12M4 10h12" />
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

function ProviderSidebar({ open, onClose }) {
  const location = useLocation();
  const { logout } = useAuth();

  const items = [
    {
      label: "Overview",
      to: "/provider/dashboard",
      icon: <HomeIcon />,
    },
    {
      label: "My Services",
      to: "/provider/services",
      icon: <ServicesIcon />,
    },
    {
      label: "Bookings",
      to: "/provider/bookings",
      icon: <BookingIcon />,
    },
    {
      label: "Profile",
      to: "/provider",
      icon: <ProfileIcon />,
    },
  ];

  const isActive = (path) => {
    if (path === "/provider/dashboard") {
      return location.pathname === "/provider/dashboard";
    }

    return location.pathname === path;
  };

  const handleLogout = () => {
    onClose?.();
    logout();
  };

  return (
    <>
      {/* MOBILE BACKDROP */}
      {open && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-[#08131f]/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col overflow-hidden bg-[#08131f] text-white shadow-[10px_0_40px_rgba(8,19,31,0.12)] transition-transform duration-300 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Background glows */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-28 -left-24 h-64 w-64 rounded-full bg-teal-400/10 blur-3xl" />

        {/* BRAND */}
        <div className="relative flex h-20 items-center justify-between border-b border-white/[0.07] px-6">
          <Link
            to="/provider/dashboard"
            onClick={onClose}
            className="flex items-center gap-3"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-teal-400 text-sm font-black text-[#08131f] shadow-[0_0_20px_rgba(34,211,238,0.16)]">
              S
            </div>

            <div>
              <p className="text-sm font-bold tracking-tight text-white">
                Sahayra
              </p>

              <p className="text-[10px] uppercase tracking-[0.18em] text-white/35">
                Provider
              </p>
            </div>
          </Link>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
            className="flex h-9 w-9 items-center justify-center rounded-xl text-white/35 transition hover:bg-white/5 hover:text-white lg:hidden"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-5 w-5"
            >
              <path strokeLinecap="round" d="m7 7 10 10M17 7 7 17" />
            </svg>
          </button>
        </div>

        {/* NAVIGATION */}
        <div className="relative flex-1 overflow-y-auto px-4 pt-7">
          <p className="px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
            Workspace
          </p>

          <nav className="mt-3 space-y-1.5">
            {items.map((item) => {
              const active = isActive(item.to);

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={`group relative flex items-center gap-3 overflow-hidden rounded-xl px-3 py-3 text-sm font-medium transition ${
                    active
                      ? "bg-white/[0.08] text-white"
                      : "text-white/45 hover:bg-white/[0.05] hover:text-white"
                  }`}
                >
                  {active && (
                    <span className="absolute inset-y-2 left-0 w-0.5 rounded-full bg-gradient-to-b from-cyan-300 to-teal-400" />
                  )}

                  <span
                    className={`relative flex h-5 w-5 shrink-0 items-center justify-center transition ${
                      active
                        ? "text-cyan-300"
                        : "text-white/35 group-hover:text-cyan-200"
                    }`}
                  >
                    {item.icon}
                  </span>

                  <span className="relative">{item.label}</span>

                  {active && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* BOTTOM ACTIONS */}
        <div className="relative shrink-0 space-y-3 p-5">
          {/* New Service */}
          <Link
            to="/provider/create-service"
            onClick={onClose}
            className="group relative flex items-center gap-3 overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.04] p-4 transition hover:border-cyan-400/20 hover:bg-white/[0.07]"
          >
            <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-cyan-400/10 blur-2xl transition group-hover:bg-cyan-400/20" />

            <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300 ring-1 ring-cyan-300/10">
              <PlusIcon />
            </div>

            <div className="relative min-w-0">
              <p className="text-xs font-bold text-white">New Service</p>

              <p className="mt-0.5 text-[11px] text-white/35">
                Add a service listing
              </p>
            </div>

            <span className="relative ml-auto text-white/20 transition group-hover:translate-x-1 group-hover:text-cyan-300">
              →
            </span>
          </Link>

          {/* Logout */}
          <button
            type="button"
            onClick={handleLogout}
            className="group flex w-full items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-3 text-sm font-medium text-white/50 transition duration-200 hover:border-red-400/20 hover:bg-red-400/[0.06] hover:text-red-300"
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

export default ProviderSidebar;

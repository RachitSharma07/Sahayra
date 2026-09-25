import { SearchIcon } from "./AdminIcons";

const AdminHeader = ({ activeSection, search, setSearch, onRefresh, user }) => {
  const titles = {
    dashboard: "Admin Dashboard",
    users: "User Management",
    providers: "Provider Management",
    services: "Service Management",
    categories: "Service Categories",
    bookings: "Booking Management",
    activity: "Activity Center",
    reports: "Reports & MIS",
  };

  const descriptions = {
    dashboard: "Monitor your ServiceHub platform from one place.",
    users: "Manage registered users and account access.",
    providers: "Review providers and verification status.",
    services: "Manage services available on the platform.",
    categories: "Create and manage service categories.",
    bookings: "Monitor and manage customer bookings.",
    activity: "Track important actions performed across ServiceHub.",
    reports: "Generate activity, user and booking reports.",
  };

  const showSearch =
    activeSection !== "dashboard" &&
    activeSection !== "activity" &&
    activeSection !== "reports";

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <div className="px-5 lg:px-8 py-4">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#08131f]">
              {titles[activeSection] || "Admin Center"}
            </h1>

            <p className="text-sm text-slate-500 mt-1">
              {descriptions[activeSection] || "Manage ServiceHub."}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {showSearch && (
              <div className="relative w-full sm:w-72">
                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search..."
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-[#22d3ee] focus:bg-white focus:ring-4 focus:ring-[#22d3ee]/10"
                />
              </div>
            )}

            <button
              onClick={onRefresh}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-[#22d3ee] hover:text-[#0f766e]"
            >
              Refresh
            </button>

            <div className="hidden md:flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2">
              <div className="w-9 h-9 rounded-xl bg-[#0d1b2a] text-[#67e8f9] flex items-center justify-center font-bold">
                {(user?.name || "A").charAt(0).toUpperCase()}
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-800">
                  {user?.name || "Admin"}
                </p>

                <p className="text-xs text-slate-500">Administrator</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;

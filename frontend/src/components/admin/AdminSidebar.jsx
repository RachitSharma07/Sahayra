import {
  DashboardIcon,
  UsersIcon,
  ProviderIcon,
  ServiceIcon,
  CategoryIcon,
  BookingIcon,
  ActivityIcon,
  LogoutIcon,
  ReportsIcon,
} from "./AdminIcons";

const AdminSidebar = ({ activeSection, onSectionChange, user, onLogout }) => {
  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: DashboardIcon,
    },
    {
      id: "users",
      label: "Users",
      icon: UsersIcon,
    },
    {
      id: "providers",
      label: "Providers",
      icon: ProviderIcon,
    },
    {
      id: "services",
      label: "Services",
      icon: ServiceIcon,
    },
    {
      id: "categories",
      label: "Categories",
      icon: CategoryIcon,
    },
    {
      id: "bookings",
      label: "Bookings",
      icon: BookingIcon,
    },
    {
      id: "activity",
      label: "Activity Center",
      icon: ActivityIcon,
    },
    {
      id: "reports",
      label: "Reports & MIS",
      icon: ReportsIcon,
    },
  ];

  return (
    <aside className="hidden lg:flex w-72 shrink-0 min-h-screen bg-[#08131f] text-white flex-col">
      <div className="px-7 py-7 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#22d3ee] to-[#14b8a6] flex items-center justify-center text-[#08131f] font-black text-lg shadow-lg shadow-cyan-500/20">
            S
          </div>

          <div>
            <h2 className="font-bold text-lg">ServiceHub</h2>

            <p className="text-xs text-slate-400">Admin Center</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 flex-1">
        <p className="px-3 mb-3 text-[11px] uppercase tracking-[0.18em] text-slate-500 font-semibold">
          Management
        </p>

        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = activeSection === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition ${
                  active
                    ? "bg-[#22d3ee]/10 text-[#67e8f9] border border-[#22d3ee]/20"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon size={19} />

                <span>{item.label}</span>

                {active && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#22d3ee]" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-white/10">
        <div className="rounded-2xl bg-white/5 border border-white/10 p-4 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#22d3ee] to-[#14b8a6] text-[#08131f] flex items-center justify-center font-bold">
              {(user?.name || "A").charAt(0).toUpperCase()}
            </div>

            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">
                {user?.name || "Administrator"}
              </p>

              <p className="text-xs text-slate-500 truncate">
                {user?.email || "Admin account"}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-300 transition"
        >
          <LogoutIcon size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;

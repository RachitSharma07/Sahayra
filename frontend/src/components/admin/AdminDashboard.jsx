import { StatCard, OverviewCard, OverviewRow } from "./AdminComponents";

import {
  UsersIcon,
  ProviderIcon,
  ServiceIcon,
  BookingIcon,
  RevenueIcon,
} from "./AdminIcons";
const AdminDashboard = ({ statistics }) => {
  const stats = statistics || {};

  const users = stats.users || {};
  const providers = stats.providers || {};
  const services = stats.services || {};
  const bookings = stats.bookings || {};
  const payments = stats.payments || {};

  return (
    <div className="space-y-7">
      <section className="relative overflow-hidden rounded-[30px] bg-[#0d1b2a] p-7 text-white lg:p-9">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#22d3ee]/10 blur-3xl" />
        <div className="absolute -bottom-24 left-1/3 h-72 w-72 rounded-full bg-[#14b8a6]/10 blur-3xl" />

        <div className="relative max-w-3xl">
          <p className="mb-3 text-sm font-semibold text-[#67e8f9]">
            ServiceHub Administration
          </p>

          <h2 className="text-3xl font-bold tracking-tight lg:text-4xl">
            Platform overview at a glance.
          </h2>

          <p className="mt-4 max-w-2xl leading-7 text-slate-300">
            Monitor users, providers, services, bookings and platform activity
            from one centralized administration workspace.
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard
          title="Total Users"
          value={users.total ?? 0}
          icon={<UsersIcon />}
        />

        <StatCard
          title="Providers"
          value={providers.total ?? 0}
          icon={<ProviderIcon />}
        />

        <StatCard
          title="Services"
          value={services.total ?? 0}
          icon={<ServiceIcon />}
        />

        <StatCard
          title="Bookings"
          value={bookings.total ?? 0}
          icon={<BookingIcon />}
        />

        <StatCard
          title="Revenue"
          value={`₹${Number(payments.totalRevenue || 0).toLocaleString("en-IN")}`}
          icon={<RevenueIcon />}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <OverviewCard title="Platform Overview">
          <OverviewRow label="Total Users" value={users.total ?? 0} />

          <OverviewRow
            label="Verified Providers"
            value={providers.verified ?? 0}
          />

          <OverviewRow
            label="Pending Providers"
            value={providers.pending ?? 0}
          />

          <OverviewRow label="Active Services" value={services.active ?? 0} />

          <OverviewRow
            label="Inactive Services"
            value={services.inactive ?? 0}
          />
        </OverviewCard>

        <OverviewCard title="Booking Overview">
          <OverviewRow label="Pending Bookings" value={bookings.pending ?? 0} />

          <OverviewRow
            label="Accepted Bookings"
            value={bookings.accepted ?? 0}
          />

          <OverviewRow
            label="Completed Bookings"
            value={bookings.completed ?? 0}
          />

          <OverviewRow
            label="Cancelled Bookings"
            value={bookings.cancelled ?? 0}
          />

          <OverviewRow
            label="Paid Bookings"
            value={payments.paidBookings ?? 0}
          />
        </OverviewCard>
      </div>
    </div>
  );
};

export default AdminDashboard;

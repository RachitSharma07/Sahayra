import { Link } from "react-router-dom";

function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
            Provider Portal
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Provider Dashboard
          </h1>

          <p className="mt-2 text-slate-500">
            Manage your services, bookings and business from one place.
          </p>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Welcome Hero */}
        <section className="overflow-hidden rounded-3xl bg-slate-950 p-8 shadow-xl sm:p-10">
          <div className="max-w-3xl">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-xl">
              👋
            </div>

            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Welcome to Sahayra
            </h2>

            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-400">
              Grow your service business, manage your listings and keep track of
              customer bookings from your dashboard.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/provider/services/create"
                className="rounded-xl bg-blue-600 px-6 py-3 text-center font-semibold text-white transition hover:bg-blue-700"
              >
                Create Service
              </Link>

              <Link
                to="/provider/bookings"
                className="rounded-xl border border-slate-700 px-6 py-3 text-center font-semibold text-white transition hover:bg-white/5"
              >
                View Bookings
              </Link>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Services</p>

                <p className="mt-2 text-3xl font-bold text-slate-900">—</p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-xl">
                🛠️
              </div>
            </div>

            <p className="mt-4 text-xs text-slate-400">Your active services</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Bookings</p>

                <p className="mt-2 text-3xl font-bold text-slate-900">—</p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-xl">
                📅
              </div>
            </div>

            <p className="mt-4 text-xs text-slate-400">
              Total customer bookings
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Rating</p>

                <p className="mt-2 text-3xl font-bold text-slate-900">—</p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-xl">
                ⭐
              </div>
            </div>

            <p className="mt-4 text-xs text-slate-400">
              Average customer rating
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Earnings</p>

                <p className="mt-2 text-3xl font-bold text-slate-900">—</p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-xl">
                ₹
              </div>
            </div>

            <p className="mt-4 text-xs text-slate-400">
              Total completed earnings
            </p>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mt-8">
          <div className="mb-5">
            <h2 className="text-xl font-bold text-slate-900">Quick Actions</h2>

            <p className="mt-1 text-sm text-slate-500">
              Manage your Sahayra business.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {/* Create Service */}
            <Link
              to="/provider/services/create"
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-2xl transition group-hover:bg-blue-100">
                ➕
              </div>

              <h3 className="mt-5 text-lg font-bold text-slate-900">
                Create Service
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Add a new service that customers can discover and book.
              </p>

              <span className="mt-5 inline-block text-sm font-semibold text-blue-600">
                Add service →
              </span>
            </Link>

            {/* Manage Services */}
            <Link
              to="/provider/services"
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-2xl transition group-hover:bg-indigo-100">
                🛠️
              </div>

              <h3 className="mt-5 text-lg font-bold text-slate-900">
                Manage Services
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Update your existing services, pricing and availability.
              </p>

              <span className="mt-5 inline-block text-sm font-semibold text-indigo-600">
                Manage services →
              </span>
            </Link>

            {/* Bookings */}
            <Link
              to="/provider/bookings"
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-2xl transition group-hover:bg-emerald-100">
                📅
              </div>

              <h3 className="mt-5 text-lg font-bold text-slate-900">
                Manage Bookings
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Review customer requests and manage your bookings.
              </p>

              <span className="mt-5 inline-block text-sm font-semibold text-emerald-600">
                View bookings →
              </span>
            </Link>
          </div>
        </section>

        {/* Getting Started */}
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
                Grow Your Business
              </p>

              <h2 className="mt-2 text-2xl font-bold text-slate-900">
                Make your services discoverable
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
                Keep your service information updated and respond quickly to
                customer bookings.
              </p>
            </div>

            <Link
              to="/provider/services/create"
              className="shrink-0 rounded-xl bg-blue-600 px-6 py-3 text-center font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
            >
              Add Service
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;

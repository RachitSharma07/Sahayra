import {
  SectionIntro,
  FilterSelect,
  ViewButton,
  EmptyState,
} from "./AdminComponents";

const AdminServices = ({
  services,
  statusFilter,
  setStatusFilter,
  onView,
  onUpdateStatus,
  pagination,
  onPageChange,
}) => {
  const currentPage = pagination?.currentPage || 1;
  const totalPages = pagination?.totalPages || 1;
  const totalServices = pagination?.totalServices || 0;
  const limit = pagination?.limit || 20;

  const startService = totalServices === 0 ? 0 : (currentPage - 1) * limit + 1;

  const endService = Math.min(currentPage * limit, totalServices);

  const handlePrevious = () => {
    if (currentPage <= 1 || typeof onPageChange !== "function") {
      return;
    }

    onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage >= totalPages || typeof onPageChange !== "function") {
      return;
    }

    onPageChange(currentPage + 1);
  };

  return (
    <div className="space-y-6">
      <SectionIntro
        title="Services"
        description="Manage services offered through Sahayra."
        count={totalServices}
      />

      <div className="flex justify-end">
        <FilterSelect
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            { value: "all", label: "All Statuses" },
            { value: "active", label: "Active" },
            { value: "inactive", label: "Inactive" },
          ]}
        />
      </div>

      {services.length === 0 ? (
        <EmptyState title="No services found" />
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => {
            const active = service.isActive !== false;

            return (
              <div
                key={service._id}
                className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-[#08131f]">
                      {service.name}
                    </h3>

                    <p className="mt-1 text-xs font-semibold text-[#0f766e]">
                      {service.category?.name || "Uncategorized"}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      active
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-red-50 text-red-700"
                    }`}
                  >
                    {active ? "Active" : "Inactive"}
                  </span>
                </div>

                <p className="mt-4 min-h-[60px] line-clamp-3 text-sm text-slate-500">
                  {service.description || "No description available."}
                </p>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-slate-50 p-3">
                    <p className="text-xs text-slate-400">Price</p>

                    <p className="mt-1 font-bold text-slate-800">
                      ₹{Number(service.price || 0).toLocaleString("en-IN")}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-3">
                    <p className="text-xs text-slate-400">Duration</p>

                    <p className="mt-1 font-bold text-slate-800">
                      {service.duration || 0} min
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex items-center gap-2">
                  <ViewButton onClick={() => onView(service, "service")} />

                  <button
                    onClick={() => onUpdateStatus(service._id, !active)}
                    className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-[#22d3ee] hover:text-[#0f766e]"
                  >
                    {active ? "Disable Service" : "Enable Service"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {totalServices > 0 && (
        <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-slate-500">
            Showing{" "}
            <span className="font-semibold text-slate-700">{startService}</span>{" "}
            to{" "}
            <span className="font-semibold text-slate-700">{endService}</span>{" "}
            of{" "}
            <span className="font-semibold text-slate-700">
              {totalServices}
            </span>{" "}
            services
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={currentPage <= 1}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-[#22d3ee] hover:text-[#0f766e] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>

            <div className="min-w-[110px] text-center text-sm font-semibold text-slate-700">
              Page {currentPage} of {totalPages}
            </div>

            <button
              type="button"
              onClick={handleNext}
              disabled={currentPage >= totalPages}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-[#22d3ee] hover:text-[#0f766e] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminServices;

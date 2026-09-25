import {
  SectionIntro,
  FilterSelect,
  ManagementTable,
  ViewButton,
  Avatar,
  EmptyState,
} from "./AdminComponents";

const AdminProviders = ({
  providers,
  statusFilter,
  setStatusFilter,
  onView,
  onUpdateVerification,
  pagination,
  onPageChange,
}) => {
  const currentPage = pagination?.currentPage || 1;
  const totalPages = pagination?.totalPages || 1;
  const totalProviders = pagination?.totalProviders || 0;
  const limit = pagination?.limit || 20;

  const startProvider =
    totalProviders === 0 ? 0 : (currentPage - 1) * limit + 1;

  const endProvider = Math.min(currentPage * limit, totalProviders);

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
        title="Providers"
        description="Review service providers and verification status."
        count={totalProviders}
      />

      <div className="flex justify-end">
        <FilterSelect
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            { value: "all", label: "All Statuses" },
            { value: "pending", label: "Pending" },
            { value: "verified", label: "Verified" },
            { value: "rejected", label: "Rejected" },
          ]}
        />
      </div>

      {providers.length === 0 ? (
        <EmptyState title="No providers found" />
      ) : (
        <ManagementTable
          headers={[
            "Provider",
            "Location",
            "Experience",
            "Verification",
            "Action",
          ]}
        >
          {providers.map((item) => {
            const status = item.verificationStatus || "pending";

            return (
              <tr key={item._id} className="border-t border-slate-100">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <Avatar name={item.user?.name} />

                    <div>
                      <p className="font-semibold text-slate-800">
                        {item.user?.name || "Unnamed"}
                      </p>

                      <p className="text-xs text-slate-500">
                        {item.user?.email || "No email"}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-5 py-4 text-slate-500">
                  {item.location || "Not specified"}
                </td>

                <td className="px-5 py-4 text-slate-600">
                  {item.experience ?? 0} years
                </td>

                <td className="px-5 py-4">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                      status === "verified"
                        ? "bg-emerald-50 text-emerald-700"
                        : status === "rejected"
                          ? "bg-red-50 text-red-700"
                          : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {status}
                  </span>
                </td>

                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <ViewButton onClick={() => onView(item, "provider")} />

                    {status !== "verified" && (
                      <button
                        onClick={() =>
                          onUpdateVerification(item._id, "verified")
                        }
                        className="rounded-xl bg-[#0d1b2a] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#12283a]"
                      >
                        Verify
                      </button>
                    )}

                    {status !== "rejected" && (
                      <button
                        onClick={() =>
                          onUpdateVerification(item._id, "rejected")
                        }
                        className="rounded-xl border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                      >
                        Reject
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </ManagementTable>
      )}

      {totalProviders > 0 && (
        <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-slate-500">
            Showing{" "}
            <span className="font-semibold text-slate-700">
              {startProvider}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-slate-700">{endProvider}</span>{" "}
            of{" "}
            <span className="font-semibold text-slate-700">
              {totalProviders}
            </span>{" "}
            providers
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

export default AdminProviders;

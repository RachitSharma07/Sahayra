import {
  SectionIntro,
  FilterSelect,
  ManagementTable,
  ViewButton,
  EmptyState,
} from "./AdminComponents";

const AdminBookings = ({
  bookings,
  statusFilter,
  setStatusFilter,
  onView,
  onUpdateStatus,
  pagination,
  onPageChange,
}) => {
  const currentPage = pagination?.currentPage || 1;
  const totalPages = pagination?.totalPages || 1;
  const totalBookings = pagination?.totalBookings || 0;
  const limit = pagination?.limit || 20;

  const startBooking = totalBookings === 0 ? 0 : (currentPage - 1) * limit + 1;

  const endBooking = Math.min(currentPage * limit, totalBookings);

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
        title="Bookings"
        description="Monitor customer bookings and booking status."
        count={totalBookings}
      />

      <div className="flex justify-end">
        <FilterSelect
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            { value: "all", label: "All Statuses" },
            { value: "pending", label: "Pending" },
            { value: "accepted", label: "Accepted" },
            { value: "rejected", label: "Rejected" },
            { value: "completed", label: "Completed" },
            { value: "cancelled", label: "Cancelled" },
          ]}
        />
      </div>

      {bookings.length === 0 ? (
        <EmptyState title="No bookings found" />
      ) : (
        <ManagementTable
          headers={[
            "Customer",
            "Service",
            "Provider",
            "Date",
            "Amount",
            "Status",
            "Action",
          ]}
        >
          {bookings.map((booking) => (
            <tr key={booking._id} className="border-t border-slate-100">
              <td className="px-5 py-4">
                <p className="font-semibold text-slate-800">
                  {booking.customer?.name || "Unknown"}
                </p>

                <p className="text-xs text-slate-500">
                  {booking.customer?.email || ""}
                </p>
              </td>

              <td className="px-5 py-4 text-slate-700">
                {booking.service?.name || "Unknown"}
              </td>

              <td className="px-5 py-4 text-slate-600">
                {booking.provider?.user?.name || "Unknown"}
              </td>

              <td className="px-5 py-4 text-slate-600">
                {booking.bookingDate
                  ? new Date(booking.bookingDate).toLocaleDateString("en-IN")
                  : "N/A"}
              </td>

              <td className="px-5 py-4 font-semibold text-slate-800">
                ₹{Number(booking.amount || 0).toLocaleString("en-IN")}
              </td>

              <td className="px-5 py-4">
                <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold capitalize text-slate-700">
                  {booking.status}
                </span>
              </td>

              <td className="px-5 py-4">
                <div className="flex items-center gap-2">
                  <ViewButton onClick={() => onView(booking, "booking")} />

                  {booking.status === "pending" && (
                    <>
                      <button
                        onClick={() => onUpdateStatus(booking._id, "accepted")}
                        className="rounded-xl bg-[#0d1b2a] px-3 py-2 text-xs font-semibold text-white"
                      >
                        Accept
                      </button>

                      <button
                        onClick={() => onUpdateStatus(booking._id, "rejected")}
                        className="rounded-xl border border-red-200 px-3 py-2 text-xs font-semibold text-red-600"
                      >
                        Reject
                      </button>
                    </>
                  )}

                  {booking.status === "accepted" && (
                    <button
                      onClick={() => onUpdateStatus(booking._id, "completed")}
                      className="rounded-xl bg-emerald-600 px-3 py-2 text-xs font-semibold text-white"
                    >
                      Complete
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </ManagementTable>
      )}

      {totalBookings > 0 && (
        <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-slate-500">
            Showing{" "}
            <span className="font-semibold text-slate-700">{startBooking}</span>{" "}
            to{" "}
            <span className="font-semibold text-slate-700">{endBooking}</span>{" "}
            of{" "}
            <span className="font-semibold text-slate-700">
              {totalBookings}
            </span>{" "}
            bookings
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

export default AdminBookings;

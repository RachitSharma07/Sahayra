import { useState } from "react";
import { SearchIcon } from "./AdminIcons";
import {
  Avatar,
  EmptyState,
  FilterSelect,
  LoadingRows,
} from "./AdminComponents";

function AuditActivity({
  logs,
  loading,
  pagination,
  actions,
  entities,
  users,
  action,
  entity,
  userId,
  startDate,
  endDate,
  setAction,
  setEntity,
  setUserId,
  setStartDate,
  setEndDate,
  onApply,
  onReset,
  onPageChange,
}) {
  const [selectedLog, setSelectedLog] = useState(null);

  const actionOptions = [
    ["all", "All Actions"],
    ...actions.map((item) => [item, item.replaceAll("_", " ")]),
  ];

  const entityOptions = [
    ["all", "All Entities"],
    ...entities.map((item) => [item, item]),
  ];

  const userOptions = [
    ["all", "All Users"],
    ...users.map((user) => [
      user._id,
      `${user.name || "Unknown"} · ${user.role || "user"}`,
    ]),
  ];

  const formatAction = (value) => {
    if (!value) return "Unknown";
    return value.replaceAll("_", " ");
  };

  const formatDate = (value) => {
    if (!value) return "Unknown";

    return new Date(value).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const actionStyle = (value) => {
    if (value?.startsWith("CREATE")) {
      return "border-emerald-100 bg-emerald-50 text-emerald-700";
    }

    if (value?.startsWith("DELETE")) {
      return "border-rose-100 bg-rose-50 text-rose-700";
    }

    if (value?.startsWith("UPDATE")) {
      return "border-cyan-100 bg-cyan-50 text-cyan-700";
    }

    if (value?.startsWith("LOGIN")) {
      return "border-teal-100 bg-teal-50 text-teal-700";
    }

    if (value?.startsWith("VERIFY")) {
      return "border-emerald-100 bg-emerald-50 text-emerald-700";
    }

    if (value?.startsWith("REJECT")) {
      return "border-amber-100 bg-amber-50 text-amber-700";
    }

    return "border-slate-200 bg-slate-100 text-slate-600";
  };

  const hasFilters =
    action !== "all" ||
    entity !== "all" ||
    userId !== "all" ||
    startDate ||
    endDate;

  return (
    <div>
      <div className="mb-7">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-teal-600">
          Security & Monitoring
        </p>

        <div className="mt-2 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-[-0.035em] text-[#08131f] sm:text-3xl">
              Activity Center
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Track authentication, service, booking, provider and
              administrative activity across Sahayra.
            </p>
          </div>

          <div className="rounded-2xl border border-teal-100 bg-teal-50 px-4 py-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-teal-600">
              Total Records
            </p>

            <p className="mt-1 text-xl font-black text-teal-800">
              {pagination?.totalLogs ?? 0}
            </p>
          </div>
        </div>
      </div>

      <div className="mb-6 rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_10px_35px_rgba(8,19,31,0.04)]">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
            <SearchIcon />
          </div>

          <div>
            <p className="text-sm font-bold text-[#08131f]">Activity Filters</p>

            <p className="text-xs text-slate-500">
              Narrow the audit trail to the records you need.
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-3 lg:grid-cols-3">
          <FilterSelect
            value={action}
            onChange={setAction}
            options={actionOptions}
          />

          <FilterSelect
            value={entity}
            onChange={setEntity}
            options={entityOptions}
          />

          <FilterSelect
            value={userId}
            onChange={setUserId}
            options={userOptions}
          />

          <input
            type="date"
            value={startDate}
            onChange={(event) => setStartDate(event.target.value)}
            className="rounded-xl border border-slate-200 bg-[#f8fbfb] px-4 py-3 text-sm font-semibold text-[#0d1b2a] outline-none transition focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-50"
          />

          <input
            type="date"
            value={endDate}
            onChange={(event) => setEndDate(event.target.value)}
            className="rounded-xl border border-slate-200 bg-[#f8fbfb] px-4 py-3 text-sm font-semibold text-[#0d1b2a] outline-none transition focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-50"
          />

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onApply}
              className="flex-1 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 px-4 py-3 text-sm font-bold text-[#08131f] transition hover:-translate-y-0.5"
            >
              Apply Filters
            </button>

            <button
              type="button"
              onClick={onReset}
              disabled={!hasFilters}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-600 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-[0_10px_35px_rgba(8,19,31,0.04)]">
        <div className="border-b border-slate-100 px-6 py-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-[#08131f]">Audit Trail</h3>

              <p className="mt-1 text-xs text-slate-500">
                Newest activity appears first.
              </p>
            </div>

            <span className="rounded-full bg-slate-100 px-3 py-1.5 text-[11px] font-bold text-slate-600">
              Page {pagination?.currentPage || 1} of{" "}
              {pagination?.totalPages || 1}
            </span>
          </div>
        </div>

        {loading ? (
          <LoadingRows count={6} />
        ) : logs.length === 0 ? (
          <EmptyState text="No audit activity found" />
        ) : (
          <div className="divide-y divide-slate-100">
            {logs.map((log) => (
              <button
                key={log._id}
                type="button"
                onClick={() => setSelectedLog(log)}
                className="group flex w-full items-start gap-4 px-6 py-5 text-left transition hover:bg-[#f8fbfb]"
              >
                <div className="relative pt-1">
                  <Avatar name={log.user?.name || "System"} variant="cyan" />

                  <span className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-white bg-teal-400" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-wide ${actionStyle(
                          log.action,
                        )}`}
                      >
                        {formatAction(log.action)}
                      </span>

                      <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-bold text-slate-500">
                        {log.entity}
                      </span>
                    </div>

                    <span className="text-[11px] font-medium text-slate-400">
                      {formatDate(log.createdAt)}
                    </span>
                  </div>

                  <p className="mt-3 text-sm font-bold text-[#08131f]">
                    {log.description}
                  </p>

                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                    <span>{log.user?.name || "Unknown user"}</span>

                    <span>{log.user?.role || "Unknown role"}</span>

                    {log.entityId && (
                      <span className="font-mono text-[10px]">
                        {String(log.entityId).slice(-8)}
                      </span>
                    )}
                  </div>
                </div>

                <span className="pt-2 text-slate-300 transition group-hover:translate-x-1 group-hover:text-teal-500">
                  →
                </span>
              </button>
            ))}
          </div>
        )}

        {!loading && logs.length > 0 && (
          <div className="flex flex-col gap-4 border-t border-slate-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs font-medium text-slate-500">
              Showing {logs.length} of {pagination.totalLogs} records
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={pagination.currentPage <= 1}
                onClick={() => onPageChange(pagination.currentPage - 1)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-600 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>

              <span className="rounded-xl bg-[#08131f] px-4 py-2.5 text-xs font-bold text-cyan-300">
                {pagination.currentPage}
              </span>

              <button
                type="button"
                disabled={pagination.currentPage >= pagination.totalPages}
                onClick={() => onPageChange(pagination.currentPage + 1)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-600 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {selectedLog && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-[#08131f]/75 p-4 backdrop-blur-sm"
          onClick={() => setSelectedLog(null)}
        >
          <div
            onClick={(event) => event.stopPropagation()}
            className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[28px] bg-white shadow-[0_30px_100px_rgba(0,0,0,0.3)]"
          >
            <div className="flex items-start justify-between border-b border-slate-200 px-6 py-6">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-teal-600">
                  Activity Details
                </p>

                <h2 className="mt-2 text-xl font-bold text-[#08131f]">
                  {formatAction(selectedLog.action)}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {formatDate(selectedLog.createdAt)}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-lg text-slate-500 transition hover:bg-slate-200"
              >
                ×
              </button>
            </div>

            <div className="space-y-6 p-6">
              <div className="flex items-center gap-4 rounded-2xl bg-[#f8fbfb] p-5">
                <Avatar
                  name={selectedLog.user?.name || "System"}
                  variant="cyan"
                  large
                />

                <div>
                  <p className="text-lg font-bold text-[#08131f]">
                    {selectedLog.user?.name || "Unknown User"}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    {selectedLog.user?.email || "No email"}
                  </p>

                  <p className="mt-1 text-xs font-semibold capitalize text-teal-600">
                    {selectedLog.user?.role || "Unknown role"}
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <DetailBox
                  label="Action"
                  value={formatAction(selectedLog.action)}
                />

                <DetailBox label="Entity" value={selectedLog.entity} />

                <DetailBox
                  label="Entity ID"
                  value={selectedLog.entityId || "Not available"}
                />

                <DetailBox
                  label="IP Address"
                  value={selectedLog.ipAddress || "Not available"}
                />

                <DetailBox
                  label="Timestamp"
                  value={formatDate(selectedLog.createdAt)}
                />

                <DetailBox
                  label="User ID"
                  value={selectedLog.user?._id || selectedLog.user}
                />
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                  Description
                </p>

                <p className="mt-3 text-sm leading-7 text-slate-700">
                  {selectedLog.description}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-[#08131f] p-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-cyan-300">
                  Metadata
                </p>

                <pre className="mt-4 overflow-x-auto rounded-xl bg-black/20 p-4 text-xs leading-6 text-slate-300">
                  {JSON.stringify(selectedLog.metadata || {}, null, 2)}
                </pre>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-[#f8fbfb] p-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                  User Agent
                </p>

                <p className="mt-3 break-words text-xs leading-6 text-slate-600">
                  {selectedLog.userAgent || "Not available"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AuditActivity;

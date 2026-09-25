import { useEffect, useMemo, useState } from "react";
const API_URL = import.meta.env.VITE_API_URL;
const ACTIONS = [
  "LOGIN",
  "CREATE_SERVICE",
  "UPDATE_SERVICE",
  "DELETE_SERVICE",
  "CREATE_BOOKING",
  "UPDATE_BOOKING",
  "CANCEL_BOOKING",
  "CREATE_PROVIDER_PROFILE",
  "UPDATE_PROVIDER_PROFILE",
  "UPDATE_PROVIDER_AVAILABILITY",
  "VERIFY_PROVIDER",
  "REJECT_PROVIDER",
  "UPLOAD_PROVIDER_PROFILE_IMAGE",
  "DELETE_PROVIDER_PROFILE_IMAGE",
  "UPDATE_USER_STATUS",
  "UPDATE_PROVIDER_VERIFICATION",
  "UPDATE_BOOKING_STATUS",
  "UPDATE_SERVICE_STATUS",
];
const ENTITIES = ["User", "Provider", "Service", "Booking"];
const getToken = () => localStorage.getItem("token");
const getHeaders = () => ({
  Authorization: `Bearer ${getToken()}`,
  "Content-Type": "application/json",
});
const formatAction = (action) => {
  if (!action) return "Unknown";
  return action
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};
const formatDate = (date) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};
const getActionClass = (action) => {
  if (action?.includes("DELETE") || action?.includes("REJECT")) {
    return "bg-red-50 text-red-600 border-red-200";
  }
  if (action?.includes("CREATE")) {
    return "bg-emerald-50 text-emerald-600 border-emerald-200";
  }
  if (action?.includes("UPDATE") || action?.includes("VERIFY")) {
    return "bg-cyan-50 text-cyan-700 border-cyan-200";
  }
  if (action === "LOGIN") {
    return "bg-amber-50 text-amber-700 border-amber-200";
  }
  return "bg-slate-50 text-slate-600 border-slate-200";
};
const getEntityClass = (entity) => {
  if (entity === "User") {
    return "bg-blue-50 text-blue-600 border-blue-200";
  }
  if (entity === "Provider") {
    return "bg-teal-50 text-teal-600 border-teal-200";
  }
  if (entity === "Service") {
    return "bg-cyan-50 text-cyan-700 border-cyan-200";
  }
  if (entity === "Booking") {
    return "bg-amber-50 text-amber-700 border-amber-200";
  }
  return "bg-slate-50 text-slate-600 border-slate-200";
};
const ActivityDetailsModal = ({ log, onClose }) => {
  if (!log) return null;
  const metadata = log.metadata || {};
  const user = log.user || {};
  const entries = Object.entries(metadata);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      {" "}
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-slate-200 bg-white shadow-2xl">
        {" "}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-5">
          {" "}
          <div>
            {" "}
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-600">
              {" "}
              Activity Details{" "}
            </p>{" "}
            <h2 className="mt-1 text-xl font-bold text-slate-900">
              {" "}
              {formatAction(log.action)}{" "}
            </h2>{" "}
          </div>{" "}
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-lg text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800"
          >
            {" "}
            ×{" "}
          </button>{" "}
        </div>{" "}
        <div className="space-y-6 p-6">
          {" "}
          <div className="grid gap-4 sm:grid-cols-2">
            {" "}
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              {" "}
              <p className="text-xs font-medium text-slate-500">
                Performed By
              </p>{" "}
              <p className="mt-1 font-semibold text-slate-900">
                {" "}
                {user.name || "Unknown user"}{" "}
              </p>{" "}
              <p className="mt-1 text-sm text-slate-500">
                {" "}
                {user.email || "No email"}{" "}
              </p>{" "}
              <p className="mt-2 inline-flex rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium capitalize text-slate-600">
                {" "}
                {user.role || "Unknown role"}{" "}
              </p>{" "}
            </div>{" "}
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              {" "}
              <p className="text-xs font-medium text-slate-500">
                Date & Time
              </p>{" "}
              <p className="mt-1 font-semibold text-slate-900">
                {" "}
                {formatDate(log.createdAt)}{" "}
              </p>{" "}
            </div>{" "}
          </div>{" "}
          <div>
            {" "}
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
              {" "}
              Action{" "}
            </p>{" "}
            <div className="flex flex-wrap gap-2">
              {" "}
              <span
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${getActionClass(log.action)}`}
              >
                {" "}
                {formatAction(log.action)}{" "}
              </span>{" "}
              <span
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${getEntityClass(log.entity)}`}
              >
                {" "}
                {log.entity}{" "}
              </span>{" "}
            </div>{" "}
          </div>{" "}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            {" "}
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {" "}
              Description{" "}
            </p>{" "}
            <p className="mt-2 text-sm leading-6 text-slate-700">
              {" "}
              {log.description || "No description available"}{" "}
            </p>{" "}
          </div>{" "}
          {(metadata.previousName ||
            metadata.newName ||
            metadata.previousPrice !== undefined ||
            metadata.newPrice !== undefined ||
            metadata.previousDuration !== undefined ||
            metadata.newDuration !== undefined ||
            metadata.previousCategory ||
            metadata.newCategory) && (
            <div>
              {" "}
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                {" "}
                Changes{" "}
              </p>{" "}
              <div className="overflow-hidden rounded-2xl border border-slate-200">
                {" "}
                {metadata.previousName !== undefined ||
                metadata.newName !== undefined ? (
                  <div className="grid grid-cols-3 border-b border-slate-200 bg-white px-4 py-4 text-sm">
                    {" "}
                    <span className="font-medium text-slate-500">
                      {" "}
                      Service Name{" "}
                    </span>{" "}
                    <span className="text-slate-600">
                      {" "}
                      {metadata.previousName || "N/A"}{" "}
                    </span>{" "}
                    <span className="font-semibold text-emerald-600">
                      {" "}
                      → {metadata.newName || "N/A"}{" "}
                    </span>{" "}
                  </div>
                ) : null}{" "}
                {metadata.previousPrice !== undefined ||
                metadata.newPrice !== undefined ? (
                  <div className="grid grid-cols-3 border-b border-slate-200 bg-slate-50 px-4 py-4 text-sm">
                    {" "}
                    <span className="font-medium text-slate-500">
                      Price
                    </span>{" "}
                    <span className="text-slate-600">
                      {" "}
                      ₹{metadata.previousPrice ?? "N/A"}{" "}
                    </span>{" "}
                    <span className="font-semibold text-emerald-600">
                      {" "}
                      → ₹{metadata.newPrice ?? "N/A"}{" "}
                    </span>{" "}
                  </div>
                ) : null}{" "}
                {metadata.previousDuration !== undefined ||
                metadata.newDuration !== undefined ? (
                  <div className="grid grid-cols-3 border-b border-slate-200 bg-white px-4 py-4 text-sm">
                    {" "}
                    <span className="font-medium text-slate-500">
                      {" "}
                      Duration{" "}
                    </span>{" "}
                    <span className="text-slate-600">
                      {" "}
                      {metadata.previousDuration ?? "N/A"} min{" "}
                    </span>{" "}
                    <span className="font-semibold text-emerald-600">
                      {" "}
                      → {metadata.newDuration ?? "N/A"} min{" "}
                    </span>{" "}
                  </div>
                ) : null}{" "}
                {metadata.previousCategory !== undefined ||
                metadata.newCategory !== undefined ? (
                  <div className="grid grid-cols-3 bg-slate-50 px-4 py-4 text-sm">
                    {" "}
                    <span className="font-medium text-slate-500">
                      {" "}
                      Category{" "}
                    </span>{" "}
                    <span className="text-slate-600">
                      {" "}
                      {metadata.previousCategory || "N/A"}{" "}
                    </span>{" "}
                    <span className="font-semibold text-emerald-600">
                      {" "}
                      → {metadata.newCategory || "N/A"}{" "}
                    </span>{" "}
                  </div>
                ) : null}{" "}
              </div>{" "}
            </div>
          )}{" "}
          {(metadata.previousStatus || metadata.newStatus) && (
            <div>
              {" "}
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                {" "}
                Status Change{" "}
              </p>{" "}
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                {" "}
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium capitalize text-slate-600">
                  {" "}
                  {metadata.previousStatus || "N/A"}{" "}
                </span>{" "}
                <span className="text-slate-400">→</span>{" "}
                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-semibold capitalize text-emerald-600">
                  {" "}
                  {metadata.newStatus || "N/A"}{" "}
                </span>{" "}
              </div>{" "}
            </div>
          )}{" "}
          <div>
            {" "}
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
              {" "}
              Activity Information{" "}
            </p>{" "}
            <div className="grid gap-3 sm:grid-cols-2">
              {" "}
              <div className="rounded-2xl border border-slate-200 p-4">
                {" "}
                <p className="text-xs text-slate-500">Entity ID</p>{" "}
                <p className="mt-1 break-all text-sm font-medium text-slate-800">
                  {" "}
                  {log.entityId || "N/A"}{" "}
                </p>{" "}
              </div>{" "}
              <div className="rounded-2xl border border-slate-200 p-4">
                {" "}
                <p className="text-xs text-slate-500">IP Address</p>{" "}
                <p className="mt-1 break-all text-sm font-medium text-slate-800">
                  {" "}
                  {log.ipAddress || "N/A"}{" "}
                </p>{" "}
              </div>{" "}
              <div className="rounded-2xl border border-slate-200 p-4 sm:col-span-2">
                {" "}
                <p className="text-xs text-slate-500">User Agent</p>{" "}
                <p className="mt-1 break-all text-sm leading-6 text-slate-700">
                  {" "}
                  {log.userAgent || "N/A"}{" "}
                </p>{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
          {entries.length > 0 && (
            <div>
              {" "}
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                {" "}
                Metadata{" "}
              </p>{" "}
              <div className="overflow-hidden rounded-2xl border border-slate-200">
                {" "}
                {entries.map(([key, value], index) => (
                  <div
                    key={key}
                    className={`grid grid-cols-2 gap-4 px-4 py-3 text-sm ${index % 2 === 0 ? "bg-white" : "bg-slate-50"}`}
                  >
                    {" "}
                    <span className="font-medium text-slate-500">
                      {key}
                    </span>{" "}
                    <span className="break-all text-right text-slate-800">
                      {" "}
                      {typeof value === "object"
                        ? JSON.stringify(value)
                        : String(value)}{" "}
                    </span>{" "}
                  </div>
                ))}{" "}
              </div>{" "}
            </div>
          )}{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
};
const AdminActivity = () => {
  const [logs, setLogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedLog, setSelectedLog] = useState(null);
  const [filters, setFilters] = useState({
    action: "",
    entity: "",
    userId: "",
    startDate: "",
    endDate: "",
  });
  const [appliedFilters, setAppliedFilters] = useState({
    action: "",
    entity: "",
    userId: "",
    startDate: "",
    endDate: "",
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    limit: 20,
    totalLogs: 0,
    totalPages: 0,
  });
  const fetchUsers = async () => {
    try {
      setUsersLoading(true);
      const response = await fetch(`${API_URL}/admin/users`, {
        headers: getHeaders(),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch users");
      }
      setUsers(data.users || []);
    } catch (err) {
      setUsers([]);
    } finally {
      setUsersLoading(false);
    }
  };
  const fetchLogs = async (page = 1, filterValues = appliedFilters) => {
    try {
      setLoading(true);
      setError("");
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", String(pagination.limit));
      if (filterValues.action) {
        params.set("action", filterValues.action);
      }
      if (filterValues.entity) {
        params.set("entity", filterValues.entity);
      }
      if (filterValues.userId) {
        params.set("userId", filterValues.userId);
      }
      if (filterValues.startDate) {
        params.set("startDate", filterValues.startDate);
      }
      if (filterValues.endDate) {
        params.set("endDate", filterValues.endDate);
      }
      const response = await fetch(
        `${API_URL}/admin/audit-logs?${params.toString()}`,
        { headers: getHeaders() },
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch activity logs");
      }
      setLogs(data.logs || []);
      setPagination({
        currentPage: data.pagination?.currentPage || page,
        limit: data.pagination?.limit || 20,
        totalLogs: data.pagination?.totalLogs || 0,
        totalPages: data.pagination?.totalPages || 0,
      });
    } catch (err) {
      setError(err.message || "Failed to fetch activity logs");
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUsers();
    fetchLogs(1, {
      action: "",
      entity: "",
      userId: "",
      startDate: "",
      endDate: "",
    });
  }, []);
  const activeFilterCount = useMemo(() => {
    return Object.values(filters).filter(Boolean).length;
  }, [filters]);
  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((current) => ({ ...current, [name]: value }));
  };
  const handleApplyFilters = () => {
    setAppliedFilters(filters);
    fetchLogs(1, filters);
  };
  const handleResetFilters = () => {
    const emptyFilters = {
      action: "",
      entity: "",
      userId: "",
      startDate: "",
      endDate: "",
    };
    setFilters(emptyFilters);
    setAppliedFilters(emptyFilters);
    fetchLogs(1, emptyFilters);
  };
  const handlePageChange = (page) => {
    if (page < 1 || page > pagination.totalPages) {
      return;
    }
    fetchLogs(page, appliedFilters);
  };
  const pageNumbers = useMemo(() => {
    const totalPages = pagination.totalPages;
    const currentPage = pagination.currentPage;
    if (totalPages <= 1) {
      return [];
    }
    const pages = [];
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, currentPage + 2);
    for (let page = start; page <= end; page += 1) {
      pages.push(page);
    }
    return pages;
  }, [pagination.currentPage, pagination.totalPages]);
  return (
    <>
      {" "}
      <div className="space-y-6">
        {" "}
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          {" "}
          <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
            {" "}
            <div>
              {" "}
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-600">
                {" "}
                Security & Monitoring{" "}
              </p>{" "}
              <h2 className="mt-1 text-xl font-bold text-slate-900">
                {" "}
                Activity Center{" "}
              </h2>{" "}
              <p className="mt-1 text-sm text-slate-500">
                {" "}
                Track administrative and system activity across ServiceHub.{" "}
              </p>{" "}
            </div>{" "}
            <div className="rounded-full border border-cyan-100 bg-cyan-50 px-3 py-1.5 text-xs font-semibold text-cyan-700">
              {" "}
              {pagination.totalLogs} total activities{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          {" "}
          <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            {" "}
            <div>
              {" "}
              <h3 className="font-bold text-slate-900">Filters</h3>{" "}
              <p className="mt-1 text-sm text-slate-500">
                {" "}
                Narrow activity by action, entity, user, or date.{" "}
              </p>{" "}
            </div>{" "}
            {activeFilterCount > 0 && (
              <span className="w-fit rounded-full border border-cyan-100 bg-cyan-50 px-3 py-1.5 text-xs font-semibold text-cyan-700">
                {" "}
                {activeFilterCount} active filter{" "}
                {activeFilterCount > 1 ? "s" : ""}{" "}
              </span>
            )}{" "}
          </div>{" "}
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {" "}
            <div>
              {" "}
              <label className="mb-2 block text-xs font-semibold text-slate-600">
                {" "}
                Action{" "}
              </label>{" "}
              <select
                name="action"
                value={filters.action}
                onChange={handleFilterChange}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
              >
                {" "}
                <option value="">All Actions</option>{" "}
                {ACTIONS.map((action) => (
                  <option key={action} value={action}>
                    {" "}
                    {formatAction(action)}{" "}
                  </option>
                ))}{" "}
              </select>{" "}
            </div>{" "}
            <div>
              {" "}
              <label className="mb-2 block text-xs font-semibold text-slate-600">
                {" "}
                Entity{" "}
              </label>{" "}
              <select
                name="entity"
                value={filters.entity}
                onChange={handleFilterChange}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
              >
                {" "}
                <option value="">All Entities</option>{" "}
                {ENTITIES.map((entity) => (
                  <option key={entity} value={entity}>
                    {" "}
                    {entity}{" "}
                  </option>
                ))}{" "}
              </select>{" "}
            </div>{" "}
            <div>
              {" "}
              <label className="mb-2 block text-xs font-semibold text-slate-600">
                {" "}
                User{" "}
              </label>{" "}
              <select
                name="userId"
                value={filters.userId}
                onChange={handleFilterChange}
                disabled={usersLoading}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 disabled:cursor-not-allowed disabled:bg-slate-50"
              >
                {" "}
                <option value="">All Users</option>{" "}
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {" "}
                    {user.name} — {user.email}{" "}
                  </option>
                ))}{" "}
              </select>{" "}
            </div>{" "}
            <div>
              {" "}
              <label className="mb-2 block text-xs font-semibold text-slate-600">
                {" "}
                From{" "}
              </label>{" "}
              <input
                type="date"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
              />{" "}
            </div>{" "}
            <div>
              {" "}
              <label className="mb-2 block text-xs font-semibold text-slate-600">
                {" "}
                To{" "}
              </label>{" "}
              <input
                type="date"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
              />{" "}
            </div>{" "}
          </div>{" "}
          <div className="mt-5 flex flex-wrap gap-3">
            {" "}
            <button
              onClick={handleApplyFilters}
              className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              {" "}
              Apply Filters{" "}
            </button>{" "}
            <button
              onClick={handleResetFilters}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              {" "}
              Reset{" "}
            </button>{" "}
            <button
              onClick={() => fetchLogs(pagination.currentPage, appliedFilters)}
              className="rounded-xl border border-cyan-200 bg-cyan-50 px-4 py-2.5 text-sm font-semibold text-cyan-700 transition hover:bg-cyan-100"
            >
              {" "}
              Refresh{" "}
            </button>{" "}
          </div>{" "}
        </div>{" "}
        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            {" "}
            {error}{" "}
          </div>
        )}{" "}
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          {" "}
          <div className="border-b border-slate-200 px-5 py-4">
            {" "}
            <div className="flex items-center justify-between">
              {" "}
              <div>
                {" "}
                <h3 className="font-bold text-slate-900">
                  {" "}
                  Activity History{" "}
                </h3>{" "}
                <p className="mt-1 text-sm text-slate-500">
                  {" "}
                  Showing page {pagination.currentPage} of{" "}
                  {pagination.totalPages || 1}{" "}
                </p>{" "}
              </div>{" "}
              <span className="text-sm font-medium text-slate-500">
                {" "}
                {logs.length} records{" "}
              </span>{" "}
            </div>{" "}
          </div>{" "}
          {loading ? (
            <div className="space-y-3 p-5">
              {" "}
              {[1, 2, 3, 4, 5].map((item) => (
                <div
                  key={item}
                  className="h-20 animate-pulse rounded-2xl bg-slate-100"
                />
              ))}{" "}
            </div>
          ) : logs.length === 0 ? (
            <div className="px-5 py-16 text-center">
              {" "}
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-xl text-slate-400">
                {" "}
                —{" "}
              </div>{" "}
              <h3 className="mt-4 font-bold text-slate-800">
                {" "}
                No activity found{" "}
              </h3>{" "}
              <p className="mt-1 text-sm text-slate-500">
                {" "}
                Try changing or clearing your filters.{" "}
              </p>{" "}
            </div>
          ) : (
            <>
              {" "}
              <div className="divide-y divide-slate-100">
                {" "}
                {logs.map((log) => (
                  <button
                    key={log._id}
                    onClick={() => setSelectedLog(log)}
                    className="group flex w-full flex-col gap-4 px-5 py-5 text-left transition hover:bg-slate-50 lg:flex-row lg:items-center lg:justify-between"
                  >
                    {" "}
                    <div className="flex min-w-0 items-start gap-4">
                      {" "}
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-sm font-bold text-cyan-300">
                        {" "}
                        {(log.user?.name || "U").charAt(0).toUpperCase()}{" "}
                      </div>{" "}
                      <div className="min-w-0">
                        {" "}
                        <div className="flex flex-wrap items-center gap-2">
                          {" "}
                          <span
                            className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${getActionClass(log.action)}`}
                          >
                            {" "}
                            {formatAction(log.action)}{" "}
                          </span>{" "}
                          <span
                            className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${getEntityClass(log.entity)}`}
                          >
                            {" "}
                            {log.entity}{" "}
                          </span>{" "}
                        </div>{" "}
                        <p className="mt-2 line-clamp-2 text-sm font-medium text-slate-800">
                          {" "}
                          {log.description}{" "}
                        </p>{" "}
                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                          {" "}
                          <span> {log.user?.name || "Unknown user"} </span>{" "}
                          <span> {log.user?.role || "Unknown role"} </span>{" "}
                          <span>{formatDate(log.createdAt)}</span>{" "}
                        </div>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className="flex shrink-0 items-center gap-2 text-sm font-semibold text-cyan-600">
                      {" "}
                      View Details{" "}
                      <span className="transition group-hover:translate-x-1">
                        {" "}
                        →{" "}
                      </span>{" "}
                    </div>{" "}
                  </button>
                ))}{" "}
              </div>{" "}
              {pagination.totalPages > 1 && (
                <div className="flex flex-col gap-4 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                  {" "}
                  <p className="text-sm text-slate-500">
                    {" "}
                    {pagination.totalLogs} total records{" "}
                  </p>{" "}
                  <div className="flex items-center gap-2">
                    {" "}
                    <button
                      onClick={() =>
                        handlePageChange(pagination.currentPage - 1)
                      }
                      disabled={pagination.currentPage === 1}
                      className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {" "}
                      Previous{" "}
                    </button>{" "}
                    {pageNumbers.map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`h-9 min-w-9 rounded-xl px-3 text-sm font-semibold transition ${page === pagination.currentPage ? "bg-slate-900 text-white" : "border border-slate-200 text-slate-600 hover:bg-slate-50"}`}
                      >
                        {" "}
                        {page}{" "}
                      </button>
                    ))}{" "}
                    <button
                      onClick={() =>
                        handlePageChange(pagination.currentPage + 1)
                      }
                      disabled={
                        pagination.currentPage === pagination.totalPages
                      }
                      className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {" "}
                      Next{" "}
                    </button>{" "}
                  </div>{" "}
                </div>
              )}{" "}
            </>
          )}{" "}
        </div>{" "}
      </div>{" "}
      {selectedLog && (
        <ActivityDetailsModal
          log={selectedLog}
          onClose={() => setSelectedLog(null)}
        />
      )}{" "}
    </>
  );
};
export default AdminActivity;

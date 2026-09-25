import { useEffect, useMemo, useState } from "react";
import * as XLSX from "xlsx";
const API_URL = import.meta.env.VITE_API_URL;
const ACTIVITY_COLUMNS = [
  ["activityId", "Activity ID"],
  ["date", "Date"],
  ["userName", "User Name"],
  ["userEmail", "User Email"],
  ["userRole", "User Role"],
  ["action", "Action"],
  ["entity", "Entity"],
  ["entityId", "Entity ID"],
  ["description", "Description"],
  ["ipAddress", "IP Address"],
  ["userAgent", "User Agent"],
  ["metadata", "Metadata"],
];
const USER_COLUMNS = [
  ["userId", "User ID"],
  ["name", "Name"],
  ["email", "Email"],
  ["role", "Role"],
  ["status", "Status"],
  ["createdAt", "Created At"],
  ["activityCount", "Activity Count"],
  ["totalBookings", "Total Bookings"],
  ["completedBookings", "Completed Bookings"],
  ["cancelledBookings", "Cancelled Bookings"],
  ["rejectedBookings", "Rejected Bookings"],
  ["totalBookingAmount", "Total Booking Amount"],
  ["providerVerificationStatus", "Provider Verification"],
  ["providerExperience", "Provider Experience"],
  ["providerLocation", "Provider Location"],
  ["providerAvailability", "Provider Availability"],
  ["providerTotalBookings", "Provider Total Bookings"],
  ["providerCompletedBookings", "Provider Completed Bookings"],
  ["providerRevenue", "Provider Revenue"],
  ["providerTotalServices", "Provider Total Services"],
  ["providerActiveServices", "Provider Active Services"],
];
const BOOKING_COLUMNS = [
  ["bookingId", "Booking ID"],
  ["customerName", "Customer Name"],
  ["customerEmail", "Customer Email"],
  ["providerName", "Provider Name"],
  ["providerEmail", "Provider Email"],
  ["serviceName", "Service Name"],
  ["categoryName", "Category"],
  ["bookingDate", "Booking Date"],
  ["status", "Status"],
  ["amount", "Amount"],
  ["paymentStatus", "Payment Status"],
  ["createdAt", "Created At"],
  ["updatedAt", "Updated At"],
];
const getToken = () => localStorage.getItem("token");
const getHeaders = () => ({
  Authorization: `Bearer ${getToken()}`,
  "Content-Type": "application/json",
});
const formatDate = (value) => {
  if (!value) {
    return "";
  }
  return new Date(value).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};
const getReportTypeLabel = (type) => {
  const labels = {
    ACTIVITY: "Activity Report",
    USER: "User Report",
    PERSONALIZED_BOOKING: "Personalized Booking Report",
    STANDARD_MIS: "Standard Booking MIS",
  };
  return labels[type] || type;
};
const getFileName = (type) => {
  const date = new Date().toISOString().slice(0, 10);
  const names = {
    ACTIVITY: `ServiceHub_Activity_Report_${date}.xlsx`,
    USER: `ServiceHub_User_Report_${date}.xlsx`,
    PERSONALIZED_BOOKING: `ServiceHub_Personalized_Booking_Report_${date}.xlsx`,
    STANDARD_MIS: `ServiceHub_Standard_MIS_Report_${date}.xlsx`,
  };
  return names[type];
};
const AdminReports = () => {
  const [activeReport, setActiveReport] = useState("ACTIVITY");
  const [activityReport, setActivityReport] = useState([]);
  const [userReport, setUserReport] = useState([]);
  const [bookingReport, setBookingReport] = useState([]);
  const [downloadHistory, setDownloadHistory] = useState([]);
  const [users, setUsers] = useState([]);
  const [providers, setProviders] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    action: "",
    entity: "",
    userId: "",
    status: "",
    paymentStatus: "",
    providerId: "",
    customerId: "",
    serviceId: "",
    startDate: "",
    endDate: "",
  });
  const [selectedBookingColumns, setSelectedBookingColumns] = useState(
    BOOKING_COLUMNS.map(([key]) => key),
  );
  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/api/admin/users`, {
        headers: getHeaders(),
      });
      const data = await response.json();
      if (response.ok) {
        setUsers(data.users || []);
      }
    } catch (error) {
      setUsers([]);
    }
  };
  const fetchProviders = async () => {
    try {
      const response = await fetch(`${API_URL}/api/admin/providers`, {
        headers: getHeaders(),
      });
      const data = await response.json();
      if (response.ok) {
        setProviders(data.providers || []);
      }
    } catch (error) {
      setProviders([]);
    }
  };
  const fetchServices = async () => {
    try {
      const response = await fetch(`${API_URL}/api/admin/services`, {
        headers: getHeaders(),
      });
      const data = await response.json();
      if (response.ok) {
        setServices(data.services || []);
      }
    } catch (error) {
      setServices([]);
    }
  };
  const fetchHistory = async () => {
    try {
      setHistoryLoading(true);
      const response = await fetch(`${API_URL}/api/admin/reports/downloads`, {
        headers: getHeaders(),
      });
      const data = await response.json();
      if (response.ok) {
        setDownloadHistory(data.downloads || []);
      }
    } catch (error) {
      setDownloadHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  };
  useEffect(() => {
    fetchUsers();
    fetchProviders();
    fetchServices();
    fetchHistory();
  }, []);
  const buildQuery = () => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      }
    });
    return params.toString();
  };
  const generateReport = async () => {
    try {
      setLoading(true);
      setError("");
      const query = buildQuery();
      let endpoint = "";
      if (activeReport === "ACTIVITY") {
        endpoint = `${API_URL}/api/admin/reports/activity?${query}`;
      }
      if (activeReport === "USER") {
        endpoint = `${API_URL}/api/admin/reports/users`;
      }
      if (
        activeReport === "PERSONALIZED_BOOKING" ||
        activeReport === "STANDARD_MIS"
      ) {
        endpoint = `${API_URL}/api/admin/reports/bookings?${query}`;
      }
      const response = await fetch(endpoint, { headers: getHeaders() });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to generate report");
      }
      if (activeReport === "ACTIVITY") {
        setActivityReport(data.report || []);
      }
      if (activeReport === "USER") {
        setUserReport(data.report || []);
      }
      if (
        activeReport === "PERSONALIZED_BOOKING" ||
        activeReport === "STANDARD_MIS"
      ) {
        setBookingReport(data.report || []);
      }
    } catch (error) {
      setError(error.message || "Failed to generate report");
    } finally {
      setLoading(false);
    }
  };
  const prepareExcelData = () => {
    let data = [];
    let columns = [];
    if (activeReport === "ACTIVITY") {
      data = activityReport;
      columns = ACTIVITY_COLUMNS;
    }
    if (activeReport === "USER") {
      data = userReport;
      columns = USER_COLUMNS;
    }
    if (activeReport === "STANDARD_MIS") {
      data = bookingReport;
      columns = BOOKING_COLUMNS;
    }
    if (activeReport === "PERSONALIZED_BOOKING") {
      data = bookingReport;
      columns = BOOKING_COLUMNS.filter(([key]) =>
        selectedBookingColumns.includes(key),
      );
    }
    return data.map((row) => {
      const formattedRow = {};
      columns.forEach(([key, label]) => {
        let value = row[key];
        if (
          key === "date" ||
          key === "createdAt" ||
          key === "updatedAt" ||
          key === "bookingDate"
        ) {
          value = formatDate(value);
        }
        formattedRow[label] = value ?? "";
      });
      return formattedRow;
    });
  };
  const downloadReport = async () => {
    const data = prepareExcelData();
    if (!data.length) {
      setError("Generate the report first and make sure it contains records.");
      return;
    }
    if (
      activeReport === "PERSONALIZED_BOOKING" &&
      selectedBookingColumns.length === 0
    ) {
      setError("Select at least one booking field.");
      return;
    }
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
    const fileName = getFileName(activeReport);
    XLSX.writeFile(workbook, fileName);
    try {
      await fetch(`${API_URL}/api/admin/reports/downloads`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          reportType: activeReport,
          fileName,
          filters,
          columns:
            activeReport === "PERSONALIZED_BOOKING"
              ? selectedBookingColumns
              : [],
          recordCount: data.length,
        }),
      });
      fetchHistory();
    } catch (error) {}
  };
  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((current) => ({ ...current, [name]: value }));
  };
  const toggleBookingColumn = (key) => {
    setSelectedBookingColumns((current) => {
      if (current.includes(key)) {
        return current.filter((item) => item !== key);
      }
      return [...current, key];
    });
  };
  const selectAllBookingColumns = () => {
    setSelectedBookingColumns(BOOKING_COLUMNS.map(([key]) => key));
  };
  const clearBookingColumns = () => {
    setSelectedBookingColumns([]);
  };
  const currentData = useMemo(() => {
    if (activeReport === "ACTIVITY") {
      return activityReport;
    }
    if (activeReport === "USER") {
      return userReport;
    }
    return bookingReport;
  }, [activeReport, activityReport, userReport, bookingReport]);
  const reportCards = [
    {
      type: "ACTIVITY",
      title: "Activity Report",
      description: "Export complete portal activity and audit history.",
      icon: "◉",
    },
    {
      type: "USER",
      title: "User Report",
      description:
        "Export users with booking, provider and activity statistics.",
      icon: "◎",
    },
    {
      type: "PERSONALIZED_BOOKING",
      title: "Personalized Booking",
      description: "Choose the exact booking columns required in your Excel.",
      icon: "◇",
    },
    {
      type: "STANDARD_MIS",
      title: "Standard Booking MIS",
      description: "Export the complete booking MIS with all standard fields.",
      icon: "▦",
    },
  ];
  return (
    <div className="space-y-6">
      {" "}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        {" "}
        <div>
          {" "}
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-600">
            {" "}
            Reporting & MIS{" "}
          </p>{" "}
          <h1 className="mt-2 text-2xl font-bold text-slate-900">
            {" "}
            Reports Center{" "}
          </h1>{" "}
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
            {" "}
            Generate operational reports, user analytics and booking MIS exports
            without exposing authentication secrets or passwords.{" "}
          </p>{" "}
        </div>{" "}
      </div>{" "}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {" "}
        {reportCards.map((card) => (
          <button
            key={card.type}
            onClick={() => {
              setActiveReport(card.type);
              setError("");
            }}
            className={`rounded-3xl border p-5 text-left transition ${activeReport === card.type ? "border-cyan-300 bg-cyan-50 shadow-md" : "border-slate-200 bg-white hover:border-cyan-200 hover:shadow-sm"}`}
          >
            {" "}
            <div className="flex items-center justify-between">
              {" "}
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-lg text-cyan-300">
                {" "}
                {card.icon}{" "}
              </div>{" "}
              {activeReport === card.type && (
                <span className="rounded-full bg-cyan-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                  {" "}
                  Selected{" "}
                </span>
              )}{" "}
            </div>{" "}
            <h3 className="mt-5 font-bold text-slate-900">
              {" "}
              {card.title}{" "}
            </h3>{" "}
            <p className="mt-2 text-sm leading-5 text-slate-500">
              {" "}
              {card.description}{" "}
            </p>{" "}
          </button>
        ))}{" "}
      </div>{" "}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        {" "}
        <div className="mb-5">
          {" "}
          <h2 className="font-bold text-slate-900"> Report Filters </h2>{" "}
          <p className="mt-1 text-sm text-slate-500">
            {" "}
            Configure the data before generating your report.{" "}
          </p>{" "}
        </div>{" "}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {" "}
          {activeReport === "ACTIVITY" && (
            <>
              {" "}
              <select
                name="action"
                value={filters.action}
                onChange={handleFilterChange}
                className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-cyan-400"
              >
                {" "}
                <option value="">All Actions</option>{" "}
                <option value="LOGIN">Login</option>{" "}
                <option value="CREATE_SERVICE"> Create Service </option>{" "}
                <option value="UPDATE_SERVICE"> Update Service </option>{" "}
                <option value="DELETE_SERVICE"> Delete Service </option>{" "}
                <option value="CREATE_BOOKING"> Create Booking </option>{" "}
                <option value="UPDATE_BOOKING"> Update Booking </option>{" "}
                <option value="CANCEL_BOOKING"> Cancel Booking </option>{" "}
                <option value="VERIFY_PROVIDER"> Verify Provider </option>{" "}
                <option value="REJECT_PROVIDER"> Reject Provider </option>{" "}
                <option value="UPDATE_USER_STATUS"> Update User Status </option>{" "}
                <option value="UPDATE_PROVIDER_VERIFICATION">
                  {" "}
                  Update Provider Verification{" "}
                </option>{" "}
                <option value="UPDATE_BOOKING_STATUS">
                  {" "}
                  Update Booking Status{" "}
                </option>{" "}
                <option value="UPDATE_SERVICE_STATUS">
                  {" "}
                  Update Service Status{" "}
                </option>{" "}
              </select>{" "}
              <select
                name="entity"
                value={filters.entity}
                onChange={handleFilterChange}
                className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-cyan-400"
              >
                {" "}
                <option value="">All Entities</option>{" "}
                <option value="User">User</option>{" "}
                <option value="Provider">Provider</option>{" "}
                <option value="Service">Service</option>{" "}
                <option value="Booking">Booking</option>{" "}
              </select>{" "}
              <select
                name="userId"
                value={filters.userId}
                onChange={handleFilterChange}
                className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-cyan-400"
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
            </>
          )}{" "}
          {activeReport === "USER" && (
            <select
              name="userId"
              value={filters.userId}
              onChange={handleFilterChange}
              className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-cyan-400"
            >
              {" "}
              <option value="">All Users</option>{" "}
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {" "}
                  {user.name} — {user.email}{" "}
                </option>
              ))}{" "}
            </select>
          )}{" "}
          {(activeReport === "PERSONALIZED_BOOKING" ||
            activeReport === "STANDARD_MIS") && (
            <>
              {" "}
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-cyan-400"
              >
                {" "}
                <option value="">All Booking Status</option>{" "}
                <option value="pending">Pending</option>{" "}
                <option value="accepted">Accepted</option>{" "}
                <option value="rejected">Rejected</option>{" "}
                <option value="cancelled">Cancelled</option>{" "}
                <option value="completed">Completed</option>{" "}
              </select>{" "}
              <select
                name="paymentStatus"
                value={filters.paymentStatus}
                onChange={handleFilterChange}
                className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-cyan-400"
              >
                {" "}
                <option value="">All Payment Status</option>{" "}
                <option value="pending">Pending</option>{" "}
                <option value="paid">Paid</option>{" "}
                <option value="failed">Failed</option>{" "}
                <option value="refunded">Refunded</option>{" "}
              </select>{" "}
              <select
                name="providerId"
                value={filters.providerId}
                onChange={handleFilterChange}
                className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-cyan-400"
              >
                {" "}
                <option value="">All Providers</option>{" "}
                {providers.map((provider) => (
                  <option key={provider._id} value={provider._id}>
                    {" "}
                    {provider.user?.name || provider.name || provider._id}{" "}
                  </option>
                ))}{" "}
              </select>{" "}
              <select
                name="customerId"
                value={filters.customerId}
                onChange={handleFilterChange}
                className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-cyan-400"
              >
                {" "}
                <option value="">All Customers</option>{" "}
                {users
                  .filter((user) => user.role === "customer")
                  .map((user) => (
                    <option key={user._id} value={user._id}>
                      {" "}
                      {user.name} — {user.email}{" "}
                    </option>
                  ))}{" "}
              </select>{" "}
              <select
                name="serviceId"
                value={filters.serviceId}
                onChange={handleFilterChange}
                className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-cyan-400"
              >
                {" "}
                <option value="">All Services</option>{" "}
                {services.map((service) => (
                  <option key={service._id} value={service._id}>
                    {" "}
                    {service.name}{" "}
                  </option>
                ))}{" "}
              </select>{" "}
            </>
          )}{" "}
          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleFilterChange}
            className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-cyan-400"
          />{" "}
          <input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleFilterChange}
            className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-cyan-400"
          />{" "}
        </div>{" "}
        <div className="mt-5 flex flex-wrap gap-3">
          {" "}
          <button
            onClick={generateReport}
            className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            {" "}
            {loading ? "Generating..." : "Generate Report"}{" "}
          </button>{" "}
          <button
            onClick={downloadReport}
            className="rounded-xl bg-cyan-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-700"
          >
            {" "}
            Download Excel{" "}
          </button>{" "}
          <button
            onClick={() => {
              setFilters({
                action: "",
                entity: "",
                userId: "",
                status: "",
                paymentStatus: "",
                providerId: "",
                customerId: "",
                serviceId: "",
                startDate: "",
                endDate: "",
              });
              setActivityReport([]);
              setUserReport([]);
              setBookingReport([]);
            }}
            className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            {" "}
            Reset{" "}
          </button>{" "}
        </div>{" "}
        {error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            {" "}
            {error}{" "}
          </div>
        )}{" "}
      </div>{" "}
      {activeReport === "PERSONALIZED_BOOKING" && (
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          {" "}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {" "}
            <div>
              {" "}
              <h2 className="font-bold text-slate-900">
                {" "}
                Select Booking Columns{" "}
              </h2>{" "}
              <p className="mt-1 text-sm text-slate-500">
                {" "}
                Only selected columns will appear in your Excel file.{" "}
              </p>{" "}
            </div>{" "}
            <div className="flex gap-2">
              {" "}
              <button
                onClick={selectAllBookingColumns}
                className="rounded-lg border border-cyan-200 bg-cyan-50 px-3 py-2 text-xs font-semibold text-cyan-700"
              >
                {" "}
                Select All{" "}
              </button>{" "}
              <button
                onClick={clearBookingColumns}
                className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600"
              >
                {" "}
                Clear{" "}
              </button>{" "}
            </div>{" "}
          </div>{" "}
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {" "}
            {BOOKING_COLUMNS.map(([key, label]) => (
              <label
                key={key}
                className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-3 transition hover:border-cyan-200 hover:bg-cyan-50"
              >
                {" "}
                <input
                  type="checkbox"
                  checked={selectedBookingColumns.includes(key)}
                  onChange={() => toggleBookingColumn(key)}
                  className="h-4 w-4 accent-cyan-600"
                />{" "}
                <span className="text-sm font-medium text-slate-700">
                  {" "}
                  {label}{" "}
                </span>{" "}
              </label>
            ))}{" "}
          </div>{" "}
          <div className="mt-4 text-xs font-medium text-slate-500">
            {" "}
            {selectedBookingColumns.length} of {BOOKING_COLUMNS.length} fields
            selected{" "}
          </div>{" "}
        </div>
      )}{" "}
      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
        {" "}
        <div className="flex flex-col gap-2 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          {" "}
          <div>
            {" "}
            <h2 className="font-bold text-slate-900"> Report Preview </h2>{" "}
            <p className="mt-1 text-sm text-slate-500">
              {" "}
              {getReportTypeLabel(activeReport)}{" "}
            </p>{" "}
          </div>{" "}
          <span className="rounded-full border border-cyan-100 bg-cyan-50 px-3 py-1.5 text-xs font-semibold text-cyan-700">
            {" "}
            {currentData.length} records{" "}
          </span>{" "}
        </div>{" "}
        {currentData.length === 0 ? (
          <div className="px-5 py-16 text-center">
            {" "}
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-xl text-slate-400">
              {" "}
              ▦{" "}
            </div>{" "}
            <h3 className="mt-4 font-bold text-slate-800">
              {" "}
              No report generated{" "}
            </h3>{" "}
            <p className="mt-1 text-sm text-slate-500">
              {" "}
              Configure your filters and click Generate Report.{" "}
            </p>{" "}
          </div>
        ) : (
          <div className="overflow-x-auto">
            {" "}
            <table className="min-w-full text-left text-sm">
              {" "}
              <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                {" "}
                <tr>
                  {" "}
                  {(activeReport === "ACTIVITY"
                    ? ACTIVITY_COLUMNS
                    : activeReport === "USER"
                      ? USER_COLUMNS
                      : activeReport === "PERSONALIZED_BOOKING"
                        ? BOOKING_COLUMNS.filter(([key]) =>
                            selectedBookingColumns.includes(key),
                          )
                        : BOOKING_COLUMNS
                  )
                    .slice(0, 8)
                    .map(([key, label]) => (
                      <th
                        key={key}
                        className="whitespace-nowrap px-5 py-4 font-semibold"
                      >
                        {" "}
                        {label}{" "}
                      </th>
                    ))}{" "}
                </tr>{" "}
              </thead>{" "}
              <tbody className="divide-y divide-slate-100">
                {" "}
                {currentData.slice(0, 20).map((row, index) => {
                  const columns =
                    activeReport === "ACTIVITY"
                      ? ACTIVITY_COLUMNS
                      : activeReport === "USER"
                        ? USER_COLUMNS
                        : activeReport === "PERSONALIZED_BOOKING"
                          ? BOOKING_COLUMNS.filter(([key]) =>
                              selectedBookingColumns.includes(key),
                            )
                          : BOOKING_COLUMNS;
                  return (
                    <tr
                      key={
                        row.bookingId || row.userId || row.activityId || index
                      }
                      className="hover:bg-slate-50"
                    >
                      {" "}
                      {columns.slice(0, 8).map(([key]) => {
                        let value = row[key];
                        if (
                          key === "date" ||
                          key === "createdAt" ||
                          key === "updatedAt" ||
                          key === "bookingDate"
                        ) {
                          value = formatDate(value);
                        }
                        return (
                          <td
                            key={key}
                            className="max-w-xs whitespace-nowrap px-5 py-4 text-slate-700"
                          >
                            {" "}
                            {String(value ?? "").slice(0, 80)}{" "}
                          </td>
                        );
                      })}{" "}
                    </tr>
                  );
                })}{" "}
              </tbody>{" "}
            </table>{" "}
          </div>
        )}{" "}
        {currentData.length > 20 && (
          <div className="border-t border-slate-200 px-5 py-4 text-sm text-slate-500">
            {" "}
            Previewing first 20 records. The Excel download contains all{" "}
            {currentData.length} records.{" "}
          </div>
        )}{" "}
      </div>{" "}
      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
        {" "}
        <div className="border-b border-slate-200 px-5 py-4">
          {" "}
          <h2 className="font-bold text-slate-900"> Download History </h2>{" "}
          <p className="mt-1 text-sm text-slate-500">
            {" "}
            Recent reports generated by administrators.{" "}
          </p>{" "}
        </div>{" "}
        {historyLoading ? (
          <div className="p-5">
            {" "}
            <div className="h-16 animate-pulse rounded-2xl bg-slate-100" />{" "}
          </div>
        ) : downloadHistory.length === 0 ? (
          <div className="px-5 py-10 text-center text-sm text-slate-500">
            {" "}
            No reports downloaded yet.{" "}
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {" "}
            {downloadHistory.map((item) => (
              <div
                key={item._id}
                className="flex flex-col gap-3 px-5 py-4 lg:flex-row lg:items-center lg:justify-between"
              >
                {" "}
                <div>
                  {" "}
                  <p className="font-semibold text-slate-800">
                    {" "}
                    {item.fileName}{" "}
                  </p>{" "}
                  <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                    {" "}
                    <span> {getReportTypeLabel(item.reportType)} </span>{" "}
                    <span> {item.recordCount} records </span>{" "}
                    <span> {item.user?.name || "Unknown user"} </span>{" "}
                    <span> {formatDate(item.createdAt)} </span>{" "}
                  </div>{" "}
                </div>{" "}
                {item.reportType === "PERSONALIZED_BOOKING" &&
                  item.columns?.length > 0 && (
                    <span className="text-xs font-medium text-cyan-700">
                      {" "}
                      {item.columns.length} custom fields{" "}
                    </span>
                  )}{" "}
              </div>
            ))}{" "}
          </div>
        )}{" "}
      </div>{" "}
    </div>
  );
};
export default AdminReports;

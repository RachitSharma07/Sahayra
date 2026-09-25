import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AdminHeader from "../components/admin/AdminHeader";
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminDashboard from "../components/admin/AdminDashboard";
import AdminUsers from "../components/admin/AdminUsers";
import AdminProviders from "../components/admin/AdminProviders";
import AdminServices from "../components/admin/AdminServices";
import AdminCategories from "../components/admin/AdminCategories";
import AdminBookings from "../components/admin/AdminBookings";
import AdminActivity from "../components/admin/AdminActivity";
import AdminReports from "../components/admin/AdminReports";
import AdminDetailsModal from "../components/admin/AdminDetailsModal";
import { EmptyState } from "../components/admin/AdminComponents";

const API_URL = import.meta.env.VITE_API_URL;

const Admin = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [statistics, setStatistics] = useState(null);
  const [users, setUsers] = useState([]);
  const [providers, setProviders] = useState([]);
  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [categories, setCategories] = useState([]);

  const [usersPagination, setUsersPagination] = useState({
    currentPage: 1,
    limit: 20,
    totalUsers: 0,
    totalPages: 0,
  });

  const [providersPagination, setProvidersPagination] = useState({
    currentPage: 1,
    limit: 20,
    totalProviders: 0,
    totalPages: 0,
  });

  const [servicesPagination, setServicesPagination] = useState({
    currentPage: 1,
    limit: 20,
    totalServices: 0,
    totalPages: 0,
  });

  const [bookingsPagination, setBookingsPagination] = useState({
    currentPage: 1,
    limit: 20,
    totalBookings: 0,
    totalPages: 0,
  });

  const [loading, setLoading] = useState(true);
  const [sectionLoading, setSectionLoading] = useState(false);

  const [activeSection, setActiveSection] = useState("dashboard");

  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedType, setSelectedType] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [creatingCategory, setCreatingCategory] = useState(false);

  const getToken = () => localStorage.getItem("token");

  const getHeaders = () => ({
    Authorization: `Bearer ${getToken()}`,
    "Content-Type": "application/json",
  });

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const fetchStatistics = async () => {
    const response = await fetch(`${API_URL}/admin/statistics`, {
      headers: getHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch statistics");
    }

    setStatistics(data.statistics);
  };

  const fetchUsers = async (
    page = 1,
    searchValue = search,
    statusValue = statusFilter,
  ) => {
    const params = new URLSearchParams({
      page,
      limit: 20,
    });

    if (searchValue.trim()) {
      params.set("search", searchValue.trim());
    }

    if (statusValue !== "all") {
      params.set("status", statusValue);
    }

    const response = await fetch(
      `${API_URL}/admin/users?${params.toString()}`,
      {
        headers: getHeaders(),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch users");
    }

    setUsers(data.users || []);

    setUsersPagination(
      data.pagination || {
        currentPage: page,
        limit: 20,
        totalUsers: 0,
        totalPages: 0,
      },
    );
  };

  const fetchProviders = async (
    page = 1,
    searchValue = search,
    statusValue = statusFilter,
  ) => {
    const params = new URLSearchParams({
      page,
      limit: 20,
    });

    if (searchValue.trim()) {
      params.set("search", searchValue.trim());
    }

    if (statusValue !== "all") {
      params.set("status", statusValue);
    }

    const response = await fetch(
      `${API_URL}/admin/providers?${params.toString()}`,
      {
        headers: getHeaders(),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch providers");
    }

    setProviders(data.providers || []);

    setProvidersPagination(
      data.pagination || {
        currentPage: page,
        limit: 20,
        totalProviders: 0,
        totalPages: 0,
      },
    );
  };
  const fetchServices = async (page = 1) => {
    const response = await fetch(
      `${API_URL}/admin/services?page=${page}&limit=20`,
      {
        headers: getHeaders(),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch services");
    }

    setServices(data.services || []);

    setServicesPagination(
      data.pagination || {
        currentPage: page,
        limit: 20,
        totalServices: 0,
        totalPages: 0,
      },
    );
  };

  const fetchBookings = async (page = 1) => {
    const response = await fetch(
      `${API_URL}/admin/bookings?page=${page}&limit=20`,
      {
        headers: getHeaders(),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch bookings");
    }

    setBookings(data.bookings || []);

    setBookingsPagination(
      data.pagination || {
        currentPage: page,
        limit: 20,
        totalBookings: 0,
        totalPages: 0,
      },
    );
  };

  const fetchCategories = async () => {
    const response = await fetch(`${API_URL}/api/categories`, {
      headers: getHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch categories");
    }

    setCategories(data.categories || []);
  };

  useEffect(() => {
    const loadAdmin = async () => {
      try {
        setLoading(true);
        setError("");

        await fetchStatistics();
      } catch (err) {
        setError(err.message || "Failed to load admin dashboard");
      } finally {
        setLoading(false);
      }
    };

    loadAdmin();
  }, []);

  useEffect(() => {
    if (activeSection !== "users") {
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setSectionLoading(true);
        setError("");

        await fetchUsers(1, search, statusFilter);
      } catch (err) {
        setError(err.message || "Failed to load users");
      } finally {
        setSectionLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [activeSection, search, statusFilter]);

  useEffect(() => {
    if (activeSection !== "providers") {
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setSectionLoading(true);
        setError("");

        await fetchProviders(1, search, statusFilter);
      } catch (err) {
        setError(err.message || "Failed to load providers");
      } finally {
        setSectionLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [activeSection, search, statusFilter]);

  const changeSection = async (section) => {
    setActiveSection(section);
    setSelectedItem(null);
    setSelectedType(null);
    setSearch("");
    setStatusFilter("all");
    setError("");
    setSuccess("");

    if (section === "reports" || section === "activity") {
      return;
    }

    if (section === "dashboard") {
      try {
        setSectionLoading(true);
        await fetchStatistics();
      } catch (err) {
        setError(err.message);
      } finally {
        setSectionLoading(false);
      }

      return;
    }

    if (section === "users") {
      return;
    }

    try {
      setSectionLoading(true);

      if (section === "services") {
        await fetchServices(1);
      }

      if (section === "categories") {
        await fetchCategories();
      }

      if (section === "bookings") {
        await fetchBookings(1);
      }
    } catch (err) {
      setError(err.message || "Failed to load section");
    } finally {
      setSectionLoading(false);
    }
  };

  const createUser = async (userData) => {
    try {
      setError("");
      setSuccess("");

      const response = await fetch(`${API_URL}/admin/users`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create user");
      }

      await fetchUsers(usersPagination.currentPage, search, statusFilter);

      setSuccess("User created successfully");
    } catch (err) {
      setError(err.message || "Failed to create user");
      throw err;
    }
  };

  const updateUserStatus = async (userId, status) => {
    try {
      setError("");
      setSuccess("");

      const response = await fetch(`${API_URL}/admin/users/${userId}/status`, {
        method: "PATCH",
        headers: getHeaders(),
        body: JSON.stringify({
          isActive: status === "active",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update user status");
      }

      setSuccess("User status updated successfully");

      await fetchUsers(usersPagination.currentPage, search, statusFilter);

      if (selectedItem?._id === userId) {
        setSelectedItem((current) =>
          current
            ? {
                ...current,
                isActive: status === "active",
              }
            : current,
        );
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const updateProviderVerification = async (providerId, verificationStatus) => {
    try {
      setError("");
      setSuccess("");

      const response = await fetch(
        `${API_URL}/admin/providers/${providerId}/verification`,
        {
          method: "PATCH",
          headers: getHeaders(),
          body: JSON.stringify({ verificationStatus }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update provider verification",
        );
      }

      setSuccess("Provider verification updated successfully");

      await fetchProviders(providersPagination.currentPage);
    } catch (err) {
      setError(err.message);
    }
  };

  const updateServiceStatus = async (serviceId, isActive) => {
    try {
      setError("");
      setSuccess("");

      const response = await fetch(
        `${API_URL}/admin/services/${serviceId}/status`,
        {
          method: "PATCH",
          headers: getHeaders(),
          body: JSON.stringify({ isActive }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update service status");
      }

      setSuccess("Service status updated successfully");

      await fetchServices(servicesPagination.currentPage);
    } catch (err) {
      setError(err.message);
    }
  };

  const updateBookingStatus = async (bookingId, status) => {
    try {
      setError("");
      setSuccess("");

      const response = await fetch(
        `${API_URL}/admin/bookings/${bookingId}/status`,
        {
          method: "PATCH",
          headers: getHeaders(),
          body: JSON.stringify({ status }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update booking status");
      }

      setSuccess("Booking status updated successfully");

      await fetchBookings(bookingsPagination.currentPage);
    } catch (err) {
      setError(err.message);
    }
  };

  const createCategory = async (event) => {
    event.preventDefault();

    if (!categoryName.trim()) {
      setError("Category name is required");
      return;
    }

    try {
      setCreatingCategory(true);
      setError("");
      setSuccess("");

      const response = await fetch(`${API_URL}/api/categories`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          name: categoryName.trim(),
          description: categoryDescription.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create category");
      }

      setCategoryName("");
      setCategoryDescription("");
      setSuccess("Category created successfully");

      await fetchCategories();
    } catch (err) {
      setError(err.message);
    } finally {
      setCreatingCategory(false);
    }
  };

  const openDetails = (item, type) => {
    setSelectedItem(item);
    setSelectedType(type);
  };

  const closeDetails = () => {
    setSelectedItem(null);
    setSelectedType(null);
  };

  const filteredServices = useMemo(() => {
    const query = search.toLowerCase();

    return services.filter((item) => {
      const matchesSearch =
        item.name?.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query) ||
        item.category?.name?.toLowerCase().includes(query);

      const activeStatus = item.isActive ? "active" : "inactive";

      const matchesStatus =
        statusFilter === "all" || activeStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [services, search, statusFilter]);

  const filteredBookings = useMemo(() => {
    const query = search.toLowerCase();

    return bookings.filter((item) => {
      const matchesSearch =
        item.customer?.name?.toLowerCase().includes(query) ||
        item.customer?.email?.toLowerCase().includes(query) ||
        item.provider?.user?.name?.toLowerCase().includes(query) ||
        item.service?.name?.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "all" || item.status?.toLowerCase() === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [bookings, search, statusFilter]);

  const filteredCategories = useMemo(() => {
    const query = search.toLowerCase();

    return categories.filter((item) => {
      return (
        item.name?.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query)
      );
    });
  }, [categories, search]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#08131f]">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-[#22d3ee]/20 border-t-[#22d3ee]" />
          <p className="mt-4 text-slate-300">Loading Admin Center...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f4f7f7]">
      <AdminSidebar
        activeSection={activeSection}
        onSectionChange={changeSection}
        user={user}
        onLogout={handleLogout}
      />

      <div className="min-w-0 flex-1">
        <AdminHeader
          activeSection={activeSection}
          search={search}
          setSearch={setSearch}
          onRefresh={() => changeSection(activeSection)}
          user={user}
        />

        <main className="p-5 lg:p-8">
          {error && (
            <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-700">
              {success}
            </div>
          )}

          {sectionLoading ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#22d3ee]/20 border-t-[#22d3ee]" />
              <p className="mt-4 text-slate-500">Loading...</p>
            </div>
          ) : (
            <>
              {activeSection === "dashboard" && (
                <AdminDashboard statistics={statistics} />
              )}

              {activeSection === "users" && (
                <AdminUsers
                  users={users}
                  statusFilter={statusFilter}
                  setStatusFilter={setStatusFilter}
                  onView={openDetails}
                  onUpdateStatus={updateUserStatus}
                  onCreateUser={createUser}
                  pagination={usersPagination}
                  onPageChange={fetchUsers}
                />
              )}

              {activeSection === "providers" && (
                <AdminProviders
                  providers={providers}
                  statusFilter={statusFilter}
                  setStatusFilter={setStatusFilter}
                  onView={openDetails}
                  onUpdateVerification={updateProviderVerification}
                  pagination={providersPagination}
                  onPageChange={fetchProviders}
                />
              )}

              {activeSection === "services" && (
                <AdminServices
                  services={filteredServices}
                  statusFilter={statusFilter}
                  setStatusFilter={setStatusFilter}
                  onView={openDetails}
                  onUpdateStatus={updateServiceStatus}
                  pagination={servicesPagination}
                  onPageChange={fetchServices}
                />
              )}

              {activeSection === "categories" && (
                <AdminCategories
                  categories={filteredCategories}
                  categoryName={categoryName}
                  setCategoryName={setCategoryName}
                  categoryDescription={categoryDescription}
                  setCategoryDescription={setCategoryDescription}
                  creatingCategory={creatingCategory}
                  onCreate={createCategory}
                />
              )}

              {activeSection === "bookings" && (
                <AdminBookings
                  bookings={filteredBookings}
                  statusFilter={statusFilter}
                  setStatusFilter={setStatusFilter}
                  onView={openDetails}
                  onUpdateStatus={updateBookingStatus}
                  pagination={bookingsPagination}
                  onPageChange={fetchBookings}
                />
              )}

              {activeSection === "activity" && <AdminActivity />}

              {activeSection === "reports" && <AdminReports />}

              {![
                "dashboard",
                "users",
                "providers",
                "services",
                "categories",
                "bookings",
                "activity",
                "reports",
              ].includes(activeSection) && (
                <EmptyState title="Section not found" />
              )}
            </>
          )}
        </main>
      </div>

      {selectedItem && selectedType && (
        <AdminDetailsModal
          item={selectedItem}
          type={selectedType}
          onClose={closeDetails}
        />
      )}
    </div>
  );
};

export default Admin;

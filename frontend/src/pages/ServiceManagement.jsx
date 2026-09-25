import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ServiceManagement() {
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);

  const [deleteLoading, setDeleteLoading] = useState("");
  const [editLoading, setEditLoading] = useState(false);

  const [editingService, setEditingService] = useState(null);

  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    price: "",
    duration: "",
    category: "",
  });

  // -----------------------------------------
  // Fetch Services
  // -----------------------------------------

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/services`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch services");
      }

      setServices(data.services || []);
    } catch (error) {
      console.error("Fetch services error:", error);

      setError(error.message || "Something went wrong while fetching services");
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------------------
  // Fetch Categories
  // -----------------------------------------

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/categories`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch categories");
      }

      setCategories(data.categories || []);
    } catch (error) {
      console.error("Fetch categories error:", error);
    }
  };

  // -----------------------------------------
  // Initial Load
  // -----------------------------------------

  useEffect(() => {
    fetchServices();
    fetchCategories();
  }, []);

  // -----------------------------------------
  // Open Edit Modal
  // -----------------------------------------

  const handleEditClick = (service) => {
    setError("");
    setSuccess("");

    setEditingService(service);

    setEditForm({
      name: service.name || "",
      description: service.description || "",
      price: service.price ?? "",
      duration: service.duration ?? "",
      category: service.category?._id || service.category || "",
    });
  };

  // -----------------------------------------
  // Edit Input Change
  // -----------------------------------------

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    setEditForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // -----------------------------------------
  // Update Service
  // -----------------------------------------

  const handleUpdateService = async (e) => {
    e.preventDefault();

    try {
      setEditLoading(true);
      setError("");
      setSuccess("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/services/${editingService._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: editForm.name,
            description: editForm.description,
            price: Number(editForm.price),
            duration: Number(editForm.duration),
            category: editForm.category,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update service");
      }

      setServices((previousServices) =>
        previousServices.map((service) =>
          service._id === editingService._id ? data.service : service,
        ),
      );

      setEditingService(null);

      setSuccess("Service updated successfully.");

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (error) {
      console.error("Update service error:", error);

      setError(error.message || "Failed to update service");
    } finally {
      setEditLoading(false);
    }
  };

  // -----------------------------------------
  // Delete Service
  // -----------------------------------------

  const handleDeleteService = async (serviceId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this service?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleteLoading(serviceId);
      setError("");
      setSuccess("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/services/${serviceId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete service");
      }

      setServices((previousServices) =>
        previousServices.filter((service) => service._id !== serviceId),
      );

      setSuccess("Service deleted successfully.");

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (error) {
      console.error("Delete service error:", error);

      setError(error.message || "Failed to delete service");
    } finally {
      setDeleteLoading("");
    }
  };

  return (
    <>
      <style>{`
        @keyframes serviceManagementFade {
          from {
            opacity: 0;
            transform: translateY(12px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes serviceManagementGlow {
          0%, 100% {
            opacity: 0.25;
            transform: scale(1);
          }

          50% {
            opacity: 0.5;
            transform: scale(1.08);
          }
        }

        .service-management-page {
          animation: serviceManagementFade 0.45s ease-out;
        }

        .service-management-glow {
          animation: serviceManagementGlow 7s ease-in-out infinite;
        }
      `}</style>

      <div className="service-management-page min-h-screen bg-[#f4f7f7] text-[#0d1b2a]">
        {/* PAGE HEADER */}
        <header className="border-b border-slate-200/70 bg-[#f4f7f7]/90 backdrop-blur-xl">
          <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.7)]" />

                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-600">
                    Provider Portal
                  </p>
                </div>

                <h1 className="mt-4 text-3xl font-bold tracking-[-0.04em] text-[#08131f] sm:text-4xl">
                  My Services
                </h1>

                <p className="mt-3 text-sm leading-7 text-slate-500">
                  Manage the services you offer to customers.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => navigate("/provider/dashboard")}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-[#0d1b2a] shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-teal-200 hover:bg-teal-50"
                >
                  <span className="text-teal-600">←</span>
                  Dashboard
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/provider/create-service")}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 px-5 py-3 text-sm font-bold text-[#08131f] shadow-[0_10px_28px_rgba(34,211,238,0.16)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(34,211,238,0.23)]"
                >
                  <span className="text-lg leading-none">+</span>
                  Create Service
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10 lg:py-12">
          {/* ERROR */}
          {error && (
            <div className="mb-8 flex items-start justify-between gap-4 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-100 text-sm font-bold text-red-600">
                  !
                </div>

                <p className="pt-1 text-sm font-medium leading-6 text-red-700">
                  {error}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setError("")}
                className="text-lg font-medium text-red-400 transition hover:text-red-700"
              >
                ×
              </button>
            </div>
          )}

          {/* SUCCESS */}
          {success && (
            <div className="mb-8 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 shadow-sm">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
                ✓
              </div>

              <p className="text-sm font-semibold text-emerald-700">
                {success}
              </p>
            </div>
          )}

          {/* LOADING */}
          {loading ? (
            <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="rounded-[26px] border border-slate-200/80 bg-white p-7 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="h-12 w-12 animate-pulse rounded-2xl bg-slate-200" />

                    <div className="h-6 w-16 animate-pulse rounded-full bg-slate-200" />
                  </div>

                  <div className="mt-6 h-6 w-2/3 animate-pulse rounded bg-slate-200" />

                  <div className="mt-4 h-4 w-24 animate-pulse rounded bg-slate-200" />

                  <div className="mt-4 space-y-2">
                    <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
                    <div className="h-4 w-4/5 animate-pulse rounded bg-slate-200" />
                  </div>

                  <div className="mt-7 grid grid-cols-2 gap-3">
                    <div className="h-20 animate-pulse rounded-xl bg-slate-100" />
                    <div className="h-20 animate-pulse rounded-xl bg-slate-100" />
                  </div>

                  <div className="mt-6 flex gap-3">
                    <div className="h-11 flex-1 animate-pulse rounded-xl bg-slate-200" />
                    <div className="h-11 flex-1 animate-pulse rounded-xl bg-slate-200" />
                  </div>
                </div>
              ))}
            </div>
          ) : services.length === 0 ? (
            /* EMPTY STATE */
            <div className="relative overflow-hidden rounded-[30px] border border-dashed border-slate-300 bg-white px-6 py-20 text-center shadow-sm">
              <div className="service-management-glow absolute left-1/2 top-0 h-48 w-48 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl" />

              <div className="relative">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-teal-100 bg-teal-50">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-7 w-7 text-teal-600"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14.7 6.3a4.2 4.2 0 0 0-5.6 5.6L4 17v3h3l5.1-5.1a4.2 4.2 0 0 0 5.6-5.6l-2.2 2.2-2.7-.4-.4-2.7 2.3-2.1Z"
                    />
                  </svg>
                </div>

                <h2 className="mt-6 text-2xl font-bold tracking-[-0.03em] text-[#08131f]">
                  No services yet
                </h2>

                <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-slate-500">
                  You haven't created any services yet. Add your first service
                  to start receiving customer bookings.
                </p>

                <button
                  type="button"
                  onClick={() => navigate("/provider/create-service")}
                  className="mt-8 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 px-6 py-3.5 text-sm font-bold text-[#08131f] shadow-[0_10px_28px_rgba(34,211,238,0.16)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(34,211,238,0.23)]"
                >
                  Create Your First Service
                </button>
              </div>
            </div>
          ) : (
            /* SERVICES */
            <div>
              <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-600">
                    Your catalogue
                  </p>

                  <h2 className="mt-2 text-2xl font-bold tracking-[-0.03em] text-[#08131f]">
                    Your Services
                  </h2>

                  <p className="mt-2 text-sm text-slate-500">
                    {services.length}{" "}
                    {services.length === 1 ? "service" : "services"} currently
                    listed
                  </p>
                </div>
              </div>

              <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
                {services.map((service) => (
                  <div
                    key={service._id}
                    className="group flex flex-col overflow-hidden rounded-[26px] border border-slate-200/80 bg-white shadow-[0_12px_40px_rgba(8,19,31,0.05)] transition duration-300 hover:-translate-y-1 hover:border-teal-100 hover:shadow-[0_20px_55px_rgba(8,19,31,0.09)]"
                  >
                    {/* CARD TOP */}
                    <div className="relative px-6 pt-6">
                      <div className="service-management-glow absolute -right-10 -top-10 h-32 w-32 rounded-full bg-cyan-400/10 blur-3xl" />

                      <div className="relative flex items-start justify-between gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-100 bg-cyan-50">
                          <svg
                            viewBox="0 0 24 24"
                            className="h-6 w-6 text-teal-600"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.7"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M14.7 6.3a4.2 4.2 0 0 0-5.6 5.6L4 17v3h3l5.1-5.1a4.2 4.2 0 0 0 5.6-5.6l-2.2 2.2-2.7-.4-.4-2.7 2.3-2.1Z"
                            />
                          </svg>
                        </div>

                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-bold ${
                            service.isActive
                              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                              : "border-slate-200 bg-slate-100 text-slate-500"
                          }`}
                        >
                          {service.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>

                    {/* SERVICE INFO */}
                    <div className="flex flex-1 flex-col px-6 pb-6 pt-6">
                      <h3 className="text-xl font-bold tracking-[-0.02em] text-[#08131f]">
                        {service.name}
                      </h3>

                      {service.category?.name && (
                        <span className="mt-3 w-fit rounded-full border border-teal-100 bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
                          {service.category.name}
                        </span>
                      )}

                      <p className="mt-4 min-h-[72px] text-sm leading-6 text-slate-500">
                        {service.description || "No description provided."}
                      </p>

                      {/* PRICE / DURATION */}
                      <div className="mt-6 grid grid-cols-2 gap-3">
                        <div className="rounded-2xl border border-slate-100 bg-[#f7faf9] p-4">
                          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                            Price
                          </p>

                          <p className="mt-2 text-lg font-bold text-[#08131f]">
                            ₹{service.price}
                          </p>
                        </div>

                        <div className="rounded-2xl border border-slate-100 bg-[#f7faf9] p-4">
                          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                            Duration
                          </p>

                          <p className="mt-2 text-lg font-bold text-[#08131f]">
                            {service.duration}
                            <span className="ml-1 text-xs font-semibold text-slate-500">
                              min
                            </span>
                          </p>
                        </div>
                      </div>

                      {/* ACTIONS */}
                      <div className="mt-6 flex gap-3">
                        <button
                          type="button"
                          onClick={() => handleEditClick(service)}
                          className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-[#0d1b2a] transition duration-200 hover:border-cyan-200 hover:bg-cyan-50 hover:text-teal-700"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteService(service._id)}
                          disabled={deleteLoading === service._id}
                          className="flex-1 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-600 transition duration-200 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {deleteLoading === service._id
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>

        {/* EDIT MODAL */}
        {editingService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#08131f]/70 px-4 py-6 backdrop-blur-sm">
            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[28px] border border-slate-200 bg-white shadow-[0_30px_100px_rgba(8,19,31,0.25)]">
              {/* MODAL HEADER */}
              <div className="flex items-start justify-between gap-6 border-b border-slate-100 px-6 py-6 sm:px-8">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-600">
                    Edit Service
                  </p>

                  <h2 className="mt-2 text-2xl font-bold tracking-[-0.03em] text-[#08131f]">
                    Update your service
                  </h2>

                  <p className="mt-2 text-sm text-slate-500">
                    Keep your service information accurate and up to date.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-xl text-slate-400 transition hover:border-slate-300 hover:bg-slate-100 hover:text-[#0d1b2a]"
                >
                  ×
                </button>
              </div>

              {/* FORM */}
              <form
                onSubmit={handleUpdateService}
                className="px-6 py-7 sm:px-8"
              >
                {/* NAME */}
                <div>
                  <label
                    htmlFor="edit-name"
                    className="mb-2.5 block text-sm font-bold text-[#0d1b2a]"
                  >
                    Service Name
                  </label>

                  <input
                    id="edit-name"
                    name="name"
                    type="text"
                    value={editForm.name}
                    onChange={handleEditChange}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-[#f8faf9] px-4 py-3.5 text-sm text-[#0d1b2a] outline-none transition focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-400/10"
                  />
                </div>

                {/* DESCRIPTION */}
                <div className="mt-7">
                  <label
                    htmlFor="edit-description"
                    className="mb-2.5 block text-sm font-bold text-[#0d1b2a]"
                  >
                    Description
                  </label>

                  <textarea
                    id="edit-description"
                    name="description"
                    rows="5"
                    value={editForm.description}
                    onChange={handleEditChange}
                    className="w-full resize-none rounded-xl border border-slate-200 bg-[#f8faf9] px-4 py-3.5 text-sm leading-6 text-[#0d1b2a] outline-none transition focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-400/10"
                  />
                </div>

                {/* PRICE / DURATION */}
                <div className="mt-7 grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="edit-price"
                      className="mb-2.5 block text-sm font-bold text-[#0d1b2a]"
                    >
                      Price
                    </label>

                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 font-semibold text-teal-600">
                        ₹
                      </span>

                      <input
                        id="edit-price"
                        name="price"
                        type="number"
                        min="0"
                        value={editForm.price}
                        onChange={handleEditChange}
                        required
                        className="w-full rounded-xl border border-slate-200 bg-[#f8faf9] py-3.5 pl-9 pr-4 text-sm text-[#0d1b2a] outline-none transition focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-400/10"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="edit-duration"
                      className="mb-2.5 block text-sm font-bold text-[#0d1b2a]"
                    >
                      Duration
                    </label>

                    <div className="relative">
                      <input
                        id="edit-duration"
                        name="duration"
                        type="number"
                        min="1"
                        value={editForm.duration}
                        onChange={handleEditChange}
                        required
                        className="w-full rounded-xl border border-slate-200 bg-[#f8faf9] py-3.5 pl-4 pr-20 text-sm text-[#0d1b2a] outline-none transition focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-400/10"
                      />

                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">
                        minutes
                      </span>
                    </div>
                  </div>
                </div>

                {/* CATEGORY */}
                <div className="mt-7">
                  <label
                    htmlFor="edit-category"
                    className="mb-2.5 block text-sm font-bold text-[#0d1b2a]"
                  >
                    Category
                  </label>

                  <select
                    id="edit-category"
                    name="category"
                    value={editForm.category}
                    onChange={handleEditChange}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-[#f8faf9] px-4 py-3.5 text-sm text-[#0d1b2a] outline-none transition focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-400/10"
                  >
                    <option value="">Select category</option>

                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* BUTTONS */}
                <div className="mt-9 flex flex-col-reverse gap-3 border-t border-slate-100 pt-7 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() => setEditingService(null)}
                    className="rounded-xl border border-slate-200 px-6 py-3 text-sm font-bold text-[#0d1b2a] transition hover:bg-slate-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={editLoading}
                    className="rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 px-6 py-3 text-sm font-bold text-[#08131f] shadow-[0_8px_24px_rgba(34,211,238,0.16)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(34,211,238,0.22)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                  >
                    {editLoading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default ServiceManagement;

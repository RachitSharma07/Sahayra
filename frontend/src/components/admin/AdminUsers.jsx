import { useState } from "react";

import {
  SectionIntro,
  FilterSelect,
  ManagementTable,
  ViewButton,
  Avatar,
  EmptyState,
} from "./AdminComponents";

const AdminUsers = ({
  users,
  statusFilter,
  setStatusFilter,
  onView,
  onUpdateStatus,
  onCreateUser,
  pagination,
  onPageChange,
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
    isActive: true,
  });

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "customer",
      isActive: true,
    });

    setFormError("");
  };

  const closeModal = () => {
    if (creating) {
      return;
    }

    setShowCreateModal(false);
    resetForm();
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));

    setFormError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.name.trim()) {
      setFormError("Name is required.");
      return;
    }

    if (!formData.email.trim()) {
      setFormError("Email is required.");
      return;
    }

    if (!formData.password) {
      setFormError("Password is required.");
      return;
    }

    if (formData.password.length < 6) {
      setFormError("Password must be at least 6 characters.");
      return;
    }

    if (!formData.role) {
      setFormError("Please select a role.");
      return;
    }

    if (typeof onCreateUser !== "function") {
      setFormError("Create user functionality is not connected.");
      return;
    }

    try {
      setCreating(true);
      setFormError("");

      await onCreateUser({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role,
        isActive: formData.isActive,
      });

      setShowCreateModal(false);
      resetForm();
    } catch (error) {
      setFormError(error.message || "Failed to create user.");
    } finally {
      setCreating(false);
    }
  };

  const currentPage = pagination?.currentPage || 1;
  const totalPages = pagination?.totalPages || 1;
  const totalUsers = pagination?.totalUsers || 0;
  const limit = pagination?.limit || 20;

  const startUser = totalUsers === 0 ? 0 : (currentPage - 1) * limit + 1;

  const endUser = Math.min(currentPage * limit, totalUsers);

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
        title="Users"
        description="Manage user accounts and platform access."
        count={totalUsers}
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={() => {
            resetForm();
            setShowCreateModal(true);
          }}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0d1b2a] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#102536] focus:outline-none focus:ring-2 focus:ring-[#22d3ee] focus:ring-offset-2"
        >
          <span className="text-lg leading-none">+</span>
          Create User
        </button>

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

      {users.length === 0 ? (
        <EmptyState title="No users found" />
      ) : (
        <ManagementTable
          headers={["User", "Email", "Role", "Status", "Action"]}
        >
          {users.map((item) => {
            const active = item.isActive !== false;

            return (
              <tr key={item._id} className="border-t border-slate-100">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <Avatar name={item.name} />

                    <span className="font-semibold text-slate-800">
                      {item.name || "Unnamed"}
                    </span>
                  </div>
                </td>

                <td className="px-5 py-4 text-slate-500">{item.email}</td>

                <td className="px-5 py-4">
                  <span className="text-sm font-medium capitalize text-slate-700">
                    {item.role}
                  </span>
                </td>

                <td className="px-5 py-4">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                      active
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-red-50 text-red-700"
                    }`}
                  >
                    {active ? "Active" : "Inactive"}
                  </span>
                </td>

                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <ViewButton onClick={() => onView(item, "user")} />

                    <button
                      type="button"
                      onClick={() =>
                        onUpdateStatus(item._id, active ? "inactive" : "active")
                      }
                      className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-[#22d3ee] hover:text-[#0f766e]"
                    >
                      {active ? "Disable" : "Enable"}
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </ManagementTable>
      )}

      {totalUsers > 0 && (
        <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-slate-500">
            Showing{" "}
            <span className="font-semibold text-slate-700">{startUser}</span> to{" "}
            <span className="font-semibold text-slate-700">{endUser}</span> of{" "}
            <span className="font-semibold text-slate-700">{totalUsers}</span>{" "}
            users
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

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#08131f]/60 px-4 backdrop-blur-sm">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="border-b border-slate-100 bg-[#0d1b2a] px-6 py-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white">Create User</h2>

                  <p className="mt-1 text-sm text-slate-300">
                    Create a new account and assign platform access.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeModal}
                  disabled={creating}
                  className="rounded-lg p-2 text-slate-300 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span className="text-xl leading-none">×</span>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-5 px-6 py-6">
                {formError && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                    {formError}
                  </div>
                )}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter full name"
                    disabled={creating}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#22d3ee] focus:ring-2 focus:ring-[#22d3ee]/20 disabled:bg-slate-50"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Email Address
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="user@example.com"
                    disabled={creating}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#22d3ee] focus:ring-2 focus:ring-[#22d3ee]/20 disabled:bg-slate-50"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Temporary Password
                  </label>

                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Minimum 6 characters"
                    disabled={creating}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#22d3ee] focus:ring-2 focus:ring-[#22d3ee]/20 disabled:bg-slate-50"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Role
                  </label>

                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    disabled={creating}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium capitalize text-slate-800 outline-none transition focus:border-[#22d3ee] focus:ring-2 focus:ring-[#22d3ee]/20 disabled:bg-slate-50"
                  >
                    <option value="customer">Customer</option>
                    <option value="provider">Provider</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <label className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      Account Status
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Allow the user to access the platform immediately.
                    </p>
                  </div>

                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    disabled={creating}
                    className="h-5 w-5 cursor-pointer accent-[#14b8a6]"
                  />
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={creating}
                  className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={creating}
                  className="rounded-xl bg-[#0d1b2a] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#102536] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {creating ? "Creating..." : "Create User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;

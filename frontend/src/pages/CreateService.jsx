import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateService() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    duration: "",
    category: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // -----------------------------------------
  // Fetch Service Categories
  // -----------------------------------------

  useEffect(() => {
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
        console.error("Category fetch error:", error);

        setError(
          error.message || "Something went wrong while fetching categories",
        );
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // -----------------------------------------
  // Handle Input Changes
  // -----------------------------------------

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    if (error) {
      setError("");
    }

    if (message) {
      setMessage("");
    }
  };

  // -----------------------------------------
  // Handle Submit
  // -----------------------------------------

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");

    if (!formData.name.trim()) {
      setError("Service name is required.");
      return;
    }

    if (!formData.price || Number(formData.price) < 0) {
      setError("Please enter a valid price.");
      return;
    }

    if (!formData.duration || Number(formData.duration) < 1) {
      setError("Please enter a valid duration.");
      return;
    }

    if (!formData.category) {
      setError("Please select a service category.");
      return;
    }

    try {
      setSubmitting(true);

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Your session has expired. Please login again.");
        navigate("/login");
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/services`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: formData.name.trim(),
            description: formData.description.trim(),
            price: Number(formData.price),
            duration: Number(formData.duration),
            category: formData.category,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create service");
      }

      setMessage("Service created successfully.");

      setFormData({
        name: "",
        description: "",
        price: "",
        duration: "",
        category: "",
      });

      setTimeout(() => {
        navigate("/provider/services");
      }, 800);
    } catch (error) {
      console.error("Create service error:", error);

      setError(error.message || "Something went wrong while creating service");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <style>{`
        @keyframes createServiceFade {
          from {
            opacity: 0;
            transform: translateY(14px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes createServiceGlow {
          0%, 100% {
            opacity: 0.35;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.08);
          }
        }

        .create-service-page {
          animation: createServiceFade 0.5s ease-out;
        }

        .create-service-glow {
          animation: createServiceGlow 7s ease-in-out infinite;
        }
      `}</style>

      <div className="create-service-page min-h-screen bg-[#f4f7f7] text-[#0d1b2a]">
        {/* PAGE HEADER */}
        <header className="border-b border-slate-200/70 bg-[#f4f7f7]/90 backdrop-blur-xl">
          <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.7)]" />

                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-600">
                    Provider Services
                  </p>
                </div>

                <h1 className="mt-4 text-3xl font-bold tracking-[-0.04em] text-[#08131f] sm:text-4xl">
                  Create a Service
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
                  Add a new service that customers can discover and book.
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate("/provider/services")}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-[#0d1b2a] shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-teal-200 hover:bg-teal-50"
              >
                <span className="text-teal-600">←</span>
                My Services
              </button>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8 lg:px-10 lg:py-12">
          {/* SUCCESS */}
          {message && (
            <div className="mb-8 flex items-start gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 shadow-sm">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
                ✓
              </div>

              <div>
                <p className="font-bold text-emerald-800">Success</p>

                <p className="mt-1 text-sm text-emerald-700">{message}</p>

                <p className="mt-1 text-xs text-emerald-600">
                  Redirecting to your services...
                </p>
              </div>
            </div>
          )}

          {/* ERROR */}
          {error && (
            <div className="mb-8 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-100 text-sm font-bold text-red-600">
                  !
                </div>

                <p className="pt-1 text-sm font-medium leading-6 text-red-700">
                  {error}
                </p>
              </div>
            </div>
          )}

          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.4fr]">
            {/* INFORMATION PANEL */}
            <aside className="relative overflow-hidden rounded-[28px] bg-[#08131f] p-7 text-white shadow-[0_20px_60px_rgba(8,19,31,0.14)] sm:p-8">
              <div className="create-service-glow absolute -right-20 -top-20 h-56 w-56 rounded-full bg-cyan-400/10 blur-3xl" />

              <div className="create-service-glow absolute -bottom-24 -left-20 h-60 w-60 rounded-full bg-teal-400/10 blur-3xl" />

              <div className="relative">
                {/* ICON */}
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-400/10">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-6 w-6 text-cyan-300"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14.7 6.3a4.2 4.2 0 0 0-5.6 5.6L4 17v3h3l5.1-5.1a4.2 4.2 0 0 0 5.6-5.6l-2.2 2.2-2.7-.4-.4-2.7 2.3-2.1Z"
                    />
                  </svg>
                </div>

                <p className="mt-7 text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">
                  Build your listing
                </p>

                <h2 className="mt-3 text-2xl font-bold tracking-[-0.03em]">
                  Offer your expertise
                </h2>

                <p className="mt-4 text-sm leading-7 text-slate-400">
                  Create a clear service listing so customers understand what
                  you offer and can book you with confidence.
                </p>

                {/* STEPS */}
                <div className="mt-10 space-y-7">
                  <div className="flex gap-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-sm font-bold text-cyan-300">
                      1
                    </div>

                    <div>
                      <p className="font-semibold text-white">
                        Describe your service
                      </p>

                      <p className="mt-2 text-xs leading-5 text-slate-500">
                        Give customers a clear understanding of what you
                        provide.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-sm font-bold text-teal-300">
                      2
                    </div>

                    <div>
                      <p className="font-semibold text-white">
                        Set your pricing
                      </p>

                      <p className="mt-2 text-xs leading-5 text-slate-500">
                        Define your price and expected duration.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-sm font-bold text-amber-300">
                      3
                    </div>

                    <div>
                      <p className="font-semibold text-white">
                        Start getting bookings
                      </p>

                      <p className="mt-2 text-xs leading-5 text-slate-500">
                        Customers can discover and book your service.
                      </p>
                    </div>
                  </div>
                </div>

                {/* BOTTOM NOTE */}
                <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <p className="text-xs leading-5 text-slate-400">
                    <span className="font-semibold text-slate-200">Tip:</span>{" "}
                    Clear descriptions and accurate pricing help customers make
                    faster booking decisions.
                  </p>
                </div>
              </div>
            </aside>

            {/* FORM */}
            <section>
              <form
                onSubmit={handleSubmit}
                className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-[0_15px_50px_rgba(8,19,31,0.06)] sm:p-8 lg:p-9"
              >
                {/* FORM HEADER */}
                <div className="border-b border-slate-100 pb-7">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-600">
                    Service information
                  </p>

                  <h2 className="mt-3 text-2xl font-bold tracking-[-0.03em] text-[#08131f]">
                    Service Details
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    Provide the information customers need before booking your
                    service.
                  </p>
                </div>

                {/* SERVICE NAME */}
                <div className="mt-7">
                  <label
                    htmlFor="name"
                    className="mb-2.5 block text-sm font-bold text-[#0d1b2a]"
                  >
                    Service Name
                  </label>

                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. AC Repair & Maintenance"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-[#f8faf9] px-4 py-3.5 text-sm text-[#0d1b2a] outline-none transition duration-200 placeholder:text-slate-400 hover:border-slate-300 focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-400/10"
                  />
                </div>

                {/* DESCRIPTION */}
                <div className="mt-7">
                  <label
                    htmlFor="description"
                    className="mb-2.5 block text-sm font-bold text-[#0d1b2a]"
                  >
                    Description
                  </label>

                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe what customers can expect from this service..."
                    rows={6}
                    className="w-full resize-none rounded-xl border border-slate-200 bg-[#f8faf9] px-4 py-3.5 text-sm leading-6 text-[#0d1b2a] outline-none transition duration-200 placeholder:text-slate-400 hover:border-slate-300 focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-400/10"
                  />
                </div>

                {/* PRICE + DURATION */}
                <div className="mt-7 grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="price"
                      className="mb-2.5 block text-sm font-bold text-[#0d1b2a]"
                    >
                      Price
                    </label>

                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 font-semibold text-teal-600">
                        ₹
                      </span>

                      <input
                        id="price"
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="1500"
                        min="0"
                        required
                        className="w-full rounded-xl border border-slate-200 bg-[#f8faf9] py-3.5 pl-9 pr-4 text-sm text-[#0d1b2a] outline-none transition duration-200 placeholder:text-slate-400 hover:border-slate-300 focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-400/10"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="duration"
                      className="mb-2.5 block text-sm font-bold text-[#0d1b2a]"
                    >
                      Duration
                    </label>

                    <div className="relative">
                      <input
                        id="duration"
                        type="number"
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        placeholder="60"
                        min="1"
                        required
                        className="w-full rounded-xl border border-slate-200 bg-[#f8faf9] py-3.5 pl-4 pr-20 text-sm text-[#0d1b2a] outline-none transition duration-200 placeholder:text-slate-400 hover:border-slate-300 focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-400/10"
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
                    htmlFor="category"
                    className="mb-2.5 block text-sm font-bold text-[#0d1b2a]"
                  >
                    Category
                  </label>

                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    disabled={categoriesLoading}
                    className="w-full rounded-xl border border-slate-200 bg-[#f8faf9] px-4 py-3.5 text-sm text-[#0d1b2a] outline-none transition duration-200 hover:border-slate-300 focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-400/10 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <option value="">
                      {categoriesLoading
                        ? "Loading categories..."
                        : "Select a category"}
                    </option>

                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>

                  {!categoriesLoading && categories.length === 0 && (
                    <p className="mt-2.5 text-xs leading-5 text-red-500">
                      No active categories are available. Please ask an admin to
                      create a category.
                    </p>
                  )}
                </div>

                {/* SUBMIT */}
                <div className="mt-9 border-t border-slate-100 pt-7">
                  <button
                    type="submit"
                    disabled={
                      submitting || categoriesLoading || categories.length === 0
                    }
                    className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 px-5 py-3.5 text-sm font-bold text-[#08131f] shadow-[0_10px_30px_rgba(34,211,238,0.18)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_35px_rgba(34,211,238,0.25)] focus:outline-none focus:ring-4 focus:ring-cyan-400/20 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                  >
                    {submitting ? "Creating Service..." : "Create Service"}

                    {!submitting && (
                      <svg
                        viewBox="0 0 20 20"
                        className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          d="M4 10h11M11 5l5 5-5 5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </form>
            </section>
          </div>
        </main>
      </div>
    </>
  );
}

export default CreateService;

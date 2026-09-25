import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-5 w-5"
    >
      <circle cx="11" cy="11" r="6.5" />
      <path strokeLinecap="round" d="m16 16 4.5 4.5" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-5 w-5"
    >
      <path strokeLinecap="round" d="M4 7h16M7 12h10M10 17h4" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-4 w-4"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 12h13M13 7l5 5-5 5"
      />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-4 w-4"
    >
      <circle cx="12" cy="12" r="8.5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 2" />
    </svg>
  );
}

function EmptySearchIcon() {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-8 w-8"
    >
      <circle cx="21" cy="21" r="11" />
      <path strokeLinecap="round" d="m29 29 9 9" />
      <path strokeLinecap="round" d="M16 21h10M21 16v10" />
    </svg>
  );
}

function ServiceImageFallback() {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-br from-[#e8f6f4] via-white to-[#eef3f2]">
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-teal-300/20 blur-3xl" />
      <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-cyan-300/20 blur-3xl" />

      <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-white bg-white text-teal-600 shadow-sm">
        <SearchIcon />
      </div>
    </div>
  );
}

const ServiceList = () => {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("");

  const [page, setPage] = useState(1);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalServices: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // --------------------------------------------------
  // Fetch categories
  // --------------------------------------------------

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
    }
  };

  // --------------------------------------------------
  // Fetch services
  // --------------------------------------------------

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const params = new URLSearchParams();

      if (search.trim()) {
        params.append("search", search.trim());
      }

      if (category) {
        params.append("category", category);
      }

      if (maxPrice) {
        params.append("maxPrice", maxPrice);
      }

      if (sort) {
        params.append("sort", sort);
      }

      params.append("page", page);
      params.append("limit", 9);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/services/search?${params.toString()}`,
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

      setPagination(
        data.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalServices: 0,
        },
      );
    } catch (error) {
      console.error("Service fetch error:", error);
      setError(error.message || "Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // Initial category fetch
  // --------------------------------------------------

  useEffect(() => {
    fetchCategories();
  }, []);

  // --------------------------------------------------
  // Fetch services when filters/page change
  // --------------------------------------------------

  useEffect(() => {
    fetchServices();
  }, [search, category, maxPrice, sort, page]);

  // --------------------------------------------------
  // Reset page when filters change
  // --------------------------------------------------

  useEffect(() => {
    setPage(1);
  }, [search, category, maxPrice, sort]);

  // --------------------------------------------------
  // Clear filters
  // --------------------------------------------------

  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setMaxPrice("");
    setSort("");
    setPage(1);
  };

  const hasActiveFilters = search.trim() || category || maxPrice || sort;

  const selectedCategory = categories.find((item) => item._id === category);

  return (
    <div className="min-h-screen bg-[#f4f7f7] text-[#0d1b2a]">
      <style>{`
        @keyframes servicePageIn {
          from {
            opacity: 0;
            transform: translateY(14px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes serviceGlow {
          0%, 100% {
            opacity: .18;
          }
          50% {
            opacity: .4;
          }
        }

        @keyframes serviceFloat {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-7px);
          }
        }

        .service-page-in {
          animation: servicePageIn .55s ease-out;
        }

        .service-glow {
          animation: serviceGlow 5s ease-in-out infinite;
        }

        .service-float {
          animation: serviceFloat 6s ease-in-out infinite;
        }

        .service-card {
          transition:
            transform .3s ease,
            box-shadow .3s ease,
            border-color .3s ease;
        }

        .service-card:hover {
          transform: translateY(-5px);
          border-color: rgba(45, 212, 191, .3);
          box-shadow: 0 24px 60px rgba(13, 27, 42, .09);
        }

        .service-image {
          transition: transform .5s cubic-bezier(.2,.65,.25,1);
        }

        .service-card:hover .service-image {
          transform: scale(1.045);
        }

        @media (prefers-reduced-motion: reduce) {
          .service-page-in,
          .service-glow,
          .service-float,
          .service-card,
          .service-image {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>

      <section className="relative overflow-hidden px-5 py-6 sm:px-8 sm:py-8">
        {/* Ambient background */}
        <div className="pointer-events-none absolute left-[8%] top-12 h-48 w-48 rounded-full bg-teal-300/10 blur-[100px]" />
        <div className="pointer-events-none absolute right-[8%] top-36 h-56 w-56 rounded-full bg-cyan-300/10 blur-[110px]" />

        <div className="relative mx-auto max-w-[1450px]">
          {/* ============================================
              HERO
          ============================================ */}

          <section className="service-page-in relative overflow-hidden rounded-[30px] bg-[#0d1b2a] shadow-[0_24px_70px_rgba(13,27,42,.14)]">
            <div className="relative px-6 py-8 sm:px-9 sm:py-10 lg:px-11 lg:py-12">
              <div className="service-glow absolute -right-24 -top-28 h-80 w-80 rounded-full bg-cyan-300/10 blur-[80px]" />

              <div className="service-float absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-teal-300/7 blur-[90px]" />

              <div
                className="pointer-events-none absolute inset-0 opacity-[0.08]"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(148,163,184,.25) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,.25) 1px, transparent 1px)",
                  backgroundSize: "56px 56px",
                  maskImage: "linear-gradient(to bottom, black, transparent)",
                }}
              />

              <div className="relative">
                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200/10 bg-white/[0.05] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
                  Service marketplace
                </div>

                <div className="mt-5 flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
                  <div className="max-w-3xl">
                    <h1 className="text-3xl font-semibold leading-tight tracking-[-0.045em] text-white sm:text-4xl lg:text-5xl">
                      Find the right service,
                      <span className="block bg-gradient-to-r from-cyan-300 via-teal-200 to-amber-200 bg-clip-text text-transparent">
                        without the hassle.
                      </span>
                    </h1>

                    <p className="mt-5 max-w-2xl text-sm leading-7 text-white/45 sm:text-base">
                      Search local professionals, compare services, and choose
                      the option that fits your needs.
                    </p>
                  </div>

                  {!loading && !error && (
                    <div className="rounded-2xl border border-white/10 bg-white/[0.05] px-5 py-4 backdrop-blur-xl">
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/35">
                        Available
                      </p>

                      <p className="mt-1 text-2xl font-semibold tracking-tight text-white">
                        {pagination.totalServices || 0}
                        <span className="ml-1.5 text-sm font-medium text-white/35">
                          services
                        </span>
                      </p>
                    </div>
                  )}
                </div>

                {/* Search */}
                <div className="relative mt-8 max-w-4xl">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <SearchIcon />
                  </span>

                  <input
                    id="service-search"
                    type="text"
                    placeholder="Search for a service..."
                    value={search}
                    onChange={(event) => {
                      setSearch(event.target.value);
                      setPage(1);
                    }}
                    className="h-14 w-full rounded-2xl border border-white/10 bg-white/[0.07] pl-12 pr-5 text-sm font-medium text-white outline-none backdrop-blur-xl transition placeholder:text-white/30 focus:border-cyan-300/35 focus:bg-white/[0.09] focus:ring-4 focus:ring-cyan-300/5"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* ============================================
              FILTERS
          ============================================ */}

          <section className="service-page-in mt-5 rounded-[26px] border border-slate-200/80 bg-white shadow-[0_10px_35px_rgba(13,27,42,.04)]">
            <div className="p-5 sm:p-6">
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                      <FilterIcon />
                    </div>

                    <div>
                      <p className="text-sm font-bold text-[#0d1b2a]">
                        Refine your search
                      </p>

                      <p className="text-xs text-slate-400">
                        Narrow services by category, price or order.
                      </p>
                    </div>
                  </div>

                  {hasActiveFilters && (
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="self-start rounded-xl px-3 py-2 text-xs font-bold text-slate-500 transition hover:bg-teal-50 hover:text-teal-700 sm:self-auto"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  {/* Category */}
                  <div>
                    <label
                      htmlFor="service-category"
                      className="mb-2 block text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400"
                    >
                      Category
                    </label>

                    <select
                      id="service-category"
                      value={category}
                      onChange={(event) => {
                        setCategory(event.target.value);
                        setPage(1);
                      }}
                      className="h-11 w-full rounded-xl border border-slate-200 bg-[#f7faf9] px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-teal-300 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
                    >
                      <option value="">All categories</option>

                      {categories.map((item) => (
                        <option key={item._id} value={item._id}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Maximum price */}
                  <div>
                    <label
                      htmlFor="service-price"
                      className="mb-2 block text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400"
                    >
                      Maximum price
                    </label>

                    <div className="relative">
                      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">
                        ₹
                      </span>

                      <input
                        id="service-price"
                        type="number"
                        min="0"
                        placeholder="e.g. 2000"
                        value={maxPrice}
                        onChange={(event) => {
                          setMaxPrice(event.target.value);
                          setPage(1);
                        }}
                        className="h-11 w-full rounded-xl border border-slate-200 bg-[#f7faf9] pl-8 pr-3 text-sm font-medium text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-teal-300 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
                      />
                    </div>
                  </div>

                  {/* Sort */}
                  <div>
                    <label
                      htmlFor="service-sort"
                      className="mb-2 block text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400"
                    >
                      Sort by
                    </label>

                    <select
                      id="service-sort"
                      value={sort}
                      onChange={(event) => {
                        setSort(event.target.value);
                        setPage(1);
                      }}
                      className="h-11 w-full rounded-xl border border-slate-200 bg-[#f7faf9] px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-teal-300 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
                    >
                      <option value="">Default order</option>
                      <option value="price_asc">Price: Low to High</option>
                      <option value="price_desc">Price: High to Low</option>
                    </select>
                  </div>
                </div>

                {/* Active filters */}
                {hasActiveFilters && (
                  <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">
                    <span className="mr-1 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
                      Active
                    </span>

                    {search.trim() && (
                      <span className="rounded-full border border-teal-100 bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-700">
                        Search: {search.trim()}
                      </span>
                    )}

                    {selectedCategory && (
                      <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600">
                        {selectedCategory.name}
                      </span>
                    )}

                    {maxPrice && (
                      <span className="rounded-full border border-amber-100 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
                        Up to ₹{maxPrice}
                      </span>
                    )}

                    {sort === "price_asc" && (
                      <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600">
                        Lowest price
                      </span>
                    )}

                    {sort === "price_desc" && (
                      <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600">
                        Highest price
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* ============================================
              RESULTS HEADING
          ============================================ */}

          {!loading && !error && (
            <div className="service-page-in mt-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-teal-600">
                  Results
                </p>

                <h2 className="mt-1 text-2xl font-semibold tracking-[-0.035em] text-[#0d1b2a]">
                  Services you can book
                </h2>
              </div>

              <p className="text-xs font-medium text-slate-400">
                {pagination.totalServices || 0} result
                {pagination.totalServices === 1 ? "" : "s"}
              </p>
            </div>
          )}

          {/* ============================================
              LOADING
          ============================================ */}

          {loading && (
            <div className="service-page-in mt-7 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div
                  key={item}
                  className="overflow-hidden rounded-[26px] border border-slate-200 bg-white"
                >
                  <div className="h-56 animate-pulse bg-slate-200" />

                  <div className="p-5">
                    <div className="h-5 w-24 animate-pulse rounded-full bg-slate-200" />

                    <div className="mt-4 h-5 w-4/5 animate-pulse rounded bg-slate-200" />

                    <div className="mt-3 h-3 w-full animate-pulse rounded bg-slate-100" />

                    <div className="mt-2 h-3 w-3/4 animate-pulse rounded bg-slate-100" />

                    <div className="mt-6 flex justify-between">
                      <div>
                        <div className="h-6 w-20 animate-pulse rounded bg-slate-200" />
                        <div className="mt-2 h-3 w-24 animate-pulse rounded bg-slate-100" />
                      </div>

                      <div className="h-10 w-28 animate-pulse rounded-xl bg-slate-200" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ============================================
              ERROR
          ============================================ */}

          {!loading && error && (
            <div className="service-page-in mt-7 rounded-[26px] border border-rose-200 bg-white p-8 text-center shadow-[0_12px_45px_rgba(13,27,42,.04)]">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
                !
              </div>

              <h2 className="mt-4 text-lg font-bold text-[#0d1b2a]">
                We couldn't load the services
              </h2>

              <p className="mt-2 text-sm text-slate-500">{error}</p>

              <button
                type="button"
                onClick={fetchServices}
                className="mt-5 rounded-xl bg-[#0d1b2a] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#173044]"
              >
                Try again
              </button>
            </div>
          )}

          {/* ============================================
              EMPTY
          ============================================ */}

          {!loading && !error && services.length === 0 && (
            <div className="service-page-in mt-7 rounded-[26px] border border-slate-200 bg-white p-10 text-center shadow-[0_12px_45px_rgba(13,27,42,.04)] sm:p-14">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-50 text-teal-600">
                <EmptySearchIcon />
              </div>

              <h2 className="mt-5 text-xl font-bold tracking-tight text-[#0d1b2a]">
                No services matched your search
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Try a different keyword, category or maximum price. You can also
                clear your filters and start again.
              </p>

              <button
                type="button"
                onClick={clearFilters}
                className="mt-6 rounded-xl bg-[#0d1b2a] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#173044]"
              >
                Clear filters
              </button>
            </div>
          )}

          {/* ============================================
              SERVICES
          ============================================ */}

          {!loading && !error && services.length > 0 && (
            <div className="service-page-in mt-7 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {services.map((service) => {
                const providerName =
                  service.provider?.user?.name ||
                  service.provider?.name ||
                  service.provider?.skills?.[0] ||
                  "Professional";

                return (
                  <article
                    key={service._id}
                    className="service-card group overflow-hidden rounded-[26px] border border-slate-200/80 bg-white"
                  >
                    {/* Image */}
                    <Link
                      to={`/services/${service._id}`}
                      className="relative block h-56 overflow-hidden bg-slate-100"
                    >
                      {service.images &&
                      service.images.length > 0 &&
                      service.images[0]?.url ? (
                        <img
                          src={service.images[0].url}
                          alt={service.name}
                          className="service-image h-full w-full object-cover"
                        />
                      ) : (
                        <ServiceImageFallback />
                      )}

                      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#0d1b2a]/35 to-transparent" />

                      {service.category && (
                        <span className="absolute left-4 top-4 rounded-full border border-white/60 bg-white/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-teal-700 shadow-sm backdrop-blur">
                          {service.category.name}
                        </span>
                      )}
                    </Link>

                    {/* Content */}
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <Link
                            to={`/services/${service._id}`}
                            className="line-clamp-1 text-lg font-semibold tracking-tight text-[#0d1b2a] transition hover:text-teal-600"
                          >
                            {service.name}
                          </Link>

                          <p className="mt-1 text-xs font-medium text-slate-400">
                            By {providerName}
                          </p>
                        </div>

                        <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-emerald-600">
                          Available
                        </span>
                      </div>

                      <p className="mt-4 line-clamp-2 min-h-[40px] text-sm leading-5 text-slate-500">
                        {service.description ||
                          "Professional service available through ServiceHub."}
                      </p>

                      <div className="mt-5 flex items-end justify-between gap-4 border-t border-slate-100 pt-5">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                            Starting from
                          </p>

                          <p className="mt-1 text-2xl font-semibold tracking-tight text-[#0d1b2a]">
                            ₹{service.price}
                          </p>
                        </div>

                        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                          <ClockIcon />
                          {service.duration} min
                        </div>
                      </div>

                      <Link
                        to={`/services/${service._id}`}
                        className="group/button mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0d1b2a] px-4 py-3 text-sm font-bold text-white transition hover:bg-teal-600"
                      >
                        View service
                        <span className="transition-transform group-hover/button:translate-x-0.5">
                          <ArrowIcon />
                        </span>
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {/* ============================================
              PAGINATION
          ============================================ */}

          {!loading &&
            !error &&
            services.length > 0 &&
            pagination.totalPages > 1 && (
              <div className="mt-8 rounded-[22px] border border-slate-200 bg-white p-4 shadow-[0_8px_25px_rgba(13,27,42,.03)] sm:p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs font-medium text-slate-400">
                    Page{" "}
                    <span className="font-bold text-slate-700">
                      {pagination.currentPage}
                    </span>{" "}
                    of{" "}
                    <span className="font-bold text-slate-700">
                      {pagination.totalPages}
                    </span>
                  </p>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={page <= 1}
                      onClick={() => setPage((previous) => previous - 1)}
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-600 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Previous
                    </button>

                    <button
                      type="button"
                      disabled={page >= pagination.totalPages}
                      onClick={() => setPage((previous) => previous + 1)}
                      className="rounded-xl bg-[#0d1b2a] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-teal-600 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}

          {/* ============================================
              HELPER
          ============================================ */}

          {!loading && !error && services.length > 0 && (
            <div className="mt-8 flex flex-col gap-3 rounded-[22px] border border-dashed border-slate-300 bg-white/70 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-bold text-[#0d1b2a]">
                  Looking for something specific?
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Use search and filters above to narrow down your options.
                </p>
              </div>

              <button
                type="button"
                onClick={clearFilters}
                className="shrink-0 text-xs font-bold text-teal-600 transition hover:text-teal-700"
              >
                Reset search
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ServiceList;

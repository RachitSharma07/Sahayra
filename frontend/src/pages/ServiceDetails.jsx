import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function ArrowLeftIcon() {
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
        d="M19 12H5M11 6l-6 6 6 6"
      />
    </svg>
  );
}

function ArrowRightIcon() {
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
      className="h-5 w-5"
    >
      <circle cx="12" cy="12" r="8.5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 2" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-5 w-5"
    >
      <rect x="3.5" y="5" width="17" height="16" rx="2.5" />
      <path strokeLinecap="round" d="M7.5 3.5v3M16.5 3.5v3M3.5 10h17" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-5 w-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19 10.5c0 4.5-7 10-7 10s-7-5.5-7-10a7 7 0 1 1 14 0Z"
      />
      <circle cx="12" cy="10.5" r="2.3" />
    </svg>
  );
}

function BriefcaseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-5 w-5"
    >
      <rect x="3.5" y="7" width="17" height="13" rx="2.5" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 7V5.5A1.5 1.5 0 0 1 9.5 4h5A1.5 1.5 0 0 1 16 5.5V7M3.5 12h17"
      />
    </svg>
  );
}

function ShieldCheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-5 w-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3.5 19 6v5.5c0 4.3-2.8 7.8-7 9-4.2-1.2-7-4.7-7-9V6l7-2.5Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m8.5 12 2.3 2.3 4.7-4.8"
      />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-5 w-5"
    >
      <circle cx="12" cy="8" r="3.5" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5.5 20c.7-3.6 3-5.5 6.5-5.5s5.8 1.9 6.5 5.5"
      />
    </svg>
  );
}

function BriefcaseLargeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-8 w-8"
    >
      <rect x="3.5" y="7" width="17" height="13" rx="2.5" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 7V5.5A1.5 1.5 0 0 1 9.5 4h5A1.5 1.5 0 0 1 16 5.5V7"
      />
    </svg>
  );
}

function ServiceImageFallback() {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-br from-[#e8f6f4] via-white to-[#edf3f2]">
      <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-cyan-300/20 blur-3xl" />
      <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-teal-300/15 blur-3xl" />

      <div className="relative flex h-20 w-20 items-center justify-center rounded-[24px] border border-white bg-white text-teal-600 shadow-[0_12px_35px_rgba(13,27,42,.08)]">
        <BriefcaseLargeIcon />
      </div>
    </div>
  );
}

function ServiceDetails() {
  const { serviceId } = useParams();
  const navigate = useNavigate();

  const [service, setService] = useState(null);
  const [bookingDate, setBookingDate] = useState("");

  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  const [error, setError] = useState("");
  const [bookingMessage, setBookingMessage] = useState("");

  const [selectedImage, setSelectedImage] = useState(0);

  // --------------------------------------------------
  // Fetch service
  // --------------------------------------------------

  const fetchService = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/services/${serviceId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch service");
      }

      setService(data.service);
      setSelectedImage(0);
    } catch (error) {
      console.error("Service details error:", error);

      setError(error.message || "Failed to load service");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchService();
  }, [serviceId]);

  // --------------------------------------------------
  // Booking
  // --------------------------------------------------

  const handleBooking = async () => {
    if (!bookingDate) {
      setBookingMessage("Please select a booking date and time.");
      return;
    }

    try {
      setBooking(true);
      setBookingMessage("");
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/bookings`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            serviceId: service._id,
            bookingDate,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create booking");
      }

      setBookingMessage("Booking request created successfully!");
      setBookingDate("");

      setTimeout(() => {
        navigate("/customer/bookings");
      }, 1200);
    } catch (error) {
      console.error("Booking error:", error);

      setBookingMessage(error.message || "Failed to create booking");
    } finally {
      setBooking(false);
    }
  };

  // --------------------------------------------------
  // Loading state
  // --------------------------------------------------

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f4f7f7]">
        <section className="px-5 py-7 sm:px-8 sm:py-9">
          <div className="mx-auto max-w-[1450px] animate-pulse">
            <div className="h-4 w-32 rounded bg-slate-200" />

            <div className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
              <div>
                <div className="h-[350px] rounded-[28px] bg-slate-200 sm:h-[450px]" />

                <div className="mt-6 rounded-[26px] bg-white p-7">
                  <div className="h-4 w-20 rounded bg-slate-200" />

                  <div className="mt-4 h-9 w-3/4 rounded bg-slate-200" />

                  <div className="mt-4 space-y-2">
                    <div className="h-3 w-full rounded bg-slate-100" />
                    <div className="h-3 w-5/6 rounded bg-slate-100" />
                    <div className="h-3 w-2/3 rounded bg-slate-100" />
                  </div>
                </div>
              </div>

              <div className="h-[520px] rounded-[28px] bg-white" />
            </div>
          </div>
        </section>
      </div>
    );
  }

  // --------------------------------------------------
  // Error state
  // --------------------------------------------------

  if (error || !service) {
    return (
      <div className="min-h-screen bg-[#f4f7f7]">
        <section className="px-5 py-8 sm:px-8">
          <div className="mx-auto max-w-3xl">
            <div className="overflow-hidden rounded-[28px] border border-rose-200 bg-white p-8 text-center shadow-[0_12px_45px_rgba(13,27,42,.05)] sm:p-10">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
                !
              </div>

              <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.2em] text-rose-500">
                Service unavailable
              </p>

              <h2 className="mt-2 text-xl font-bold text-[#0d1b2a]">
                Unable to load service
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                {error || "Service not found."}
              </p>

              <button
                type="button"
                onClick={() => navigate("/services")}
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-[#0d1b2a] px-5 py-3 text-sm font-bold text-white transition hover:bg-teal-600"
              >
                <ArrowLeftIcon />
                Back to services
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  const provider = service.provider;

  const images = service.images?.length > 0 ? service.images : [];

  const currentImage = images[selectedImage]?.url || null;

  const providerName =
    provider?.user?.name ||
    provider?.name ||
    provider?.skills?.[0] ||
    "Professional provider";

  const isAvailable = Boolean(provider?.availability);

  return (
    <div className="min-h-screen bg-[#f4f7f7] text-[#0d1b2a]">
      <style>{`
        @keyframes detailsPageIn {
          from {
            opacity: 0;
            transform: translateY(14px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes detailsGlow {
          0%, 100% {
            opacity: .18;
          }
          50% {
            opacity: .38;
          }
        }

        .details-page {
          animation: detailsPageIn .55s ease-out;
        }

        .details-glow {
          animation: detailsGlow 5s ease-in-out infinite;
        }

        .details-image {
          transition: transform .6s cubic-bezier(.2,.65,.25,1);
        }

        .details-gallery:hover .details-image {
          transform: scale(1.025);
        }

        .details-action {
          transition:
            transform .3s ease,
            box-shadow .3s ease,
            background-color .3s ease;
        }

        .details-action:hover {
          transform: translateY(-2px);
        }

        .details-info-card {
          transition:
            transform .3s ease,
            border-color .3s ease,
            box-shadow .3s ease;
        }

        .details-info-card:hover {
          transform: translateY(-3px);
          border-color: rgba(45,212,191,.25);
          box-shadow: 0 14px 35px rgba(13,27,42,.05);
        }

        @media (prefers-reduced-motion: reduce) {
          .details-page,
          .details-glow,
          .details-image,
          .details-action,
          .details-info-card {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>

      <section className="details-page relative overflow-hidden px-5 py-7 sm:px-8 sm:py-9">
        {/* Ambient lights */}
        <div className="pointer-events-none absolute left-[5%] top-20 h-56 w-56 rounded-full bg-teal-300/10 blur-[100px]" />

        <div className="pointer-events-none absolute right-[5%] top-[35%] h-64 w-64 rounded-full bg-cyan-300/10 blur-[110px]" />

        <div className="relative mx-auto max-w-[1450px]">
          {/* Back */}
          <button
            type="button"
            onClick={() => navigate("/services")}
            className="group inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-teal-600"
          >
            <span className="transition-transform duration-300 group-hover:-translate-x-1">
              <ArrowLeftIcon />
            </span>
            Back to services
          </button>

          {/* Main layout */}
          <div className="mt-5 grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
            {/* LEFT */}
            <div className="min-w-0">
              {/* Gallery */}
              <section className="details-gallery overflow-hidden rounded-[30px] border border-slate-200/80 bg-white shadow-[0_16px_50px_rgba(13,27,42,.06)]">
                <div className="relative h-[350px] overflow-hidden bg-slate-100 sm:h-[480px]">
                  {currentImage ? (
                    <img
                      src={currentImage}
                      alt={service.name}
                      className="details-image h-full w-full object-cover"
                    />
                  ) : (
                    <ServiceImageFallback />
                  )}

                  <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0d1b2a]/35 via-transparent to-transparent" />

                  {service.category && (
                    <span className="absolute left-5 top-5 rounded-full border border-white/50 bg-white/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-teal-700 shadow-sm backdrop-blur">
                      {service.category.name}
                    </span>
                  )}

                  {isAvailable && (
                    <span className="absolute right-5 top-5 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/95 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-700 shadow-sm">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Available
                    </span>
                  )}
                </div>

                {/* Thumbnails */}
                {images.length > 1 && (
                  <div className="flex gap-3 overflow-x-auto border-t border-slate-100 p-4">
                    {images.map((image, index) => (
                      <button
                        key={image._id || index}
                        type="button"
                        onClick={() => setSelectedImage(index)}
                        className={`h-16 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition ${
                          selectedImage === index
                            ? "border-teal-500 shadow-sm"
                            : "border-transparent hover:border-slate-200"
                        }`}
                      >
                        <img
                          src={image.url}
                          alt={`${service.name} preview ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}

                {/* Service content */}
                <div className="p-6 sm:p-8">
                  <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                        Service
                      </p>

                      <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-[#0d1b2a] sm:text-4xl">
                        {service.name}
                      </h1>

                      <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
                        <UserIcon />

                        <span>
                          Offered by{" "}
                          <span className="font-semibold text-slate-800">
                            {providerName}
                          </span>
                        </span>
                      </div>
                    </div>

                    <div className="shrink-0 rounded-2xl bg-teal-50 px-5 py-4 sm:text-right">
                      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-teal-600">
                        Price
                      </p>

                      <p className="mt-1 text-2xl font-semibold tracking-tight text-[#0d1b2a]">
                        ₹{service.price}
                      </p>
                    </div>
                  </div>

                  <div className="mt-7 border-t border-slate-100 pt-7">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-teal-600">
                      About this service
                    </p>

                    <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 sm:text-[15px]">
                      {service.description ||
                        "No description available for this service."}
                    </p>
                  </div>

                  <div className="mt-7 grid gap-4 sm:grid-cols-2">
                    <div className="details-info-card rounded-2xl border border-slate-200 bg-[#f8faf9] p-5">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-teal-600 shadow-sm">
                        <ClockIcon />
                      </div>

                      <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                        Duration
                      </p>

                      <p className="mt-1 text-lg font-semibold text-[#0d1b2a]">
                        {service.duration} minutes
                      </p>
                    </div>

                    <div className="details-info-card rounded-2xl border border-slate-200 bg-[#f8faf9] p-5">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
                        <CalendarIcon />
                      </div>

                      <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                        Booking
                      </p>

                      <p className="mt-1 text-lg font-semibold text-[#0d1b2a]">
                        Request based
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Provider */}
              <section className="mt-6 rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-[0_12px_45px_rgba(13,27,42,.05)] sm:p-7">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-teal-600">
                      Provider
                    </p>

                    <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-[#0d1b2a]">
                      Meet your professional
                    </h2>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0d1b2a] text-sm font-bold text-cyan-300">
                      {providerName.charAt(0).toUpperCase()}
                    </div>

                    <div>
                      <p className="text-sm font-bold text-[#0d1b2a]">
                        {providerName}
                      </p>

                      <p className="text-xs text-slate-400">Service provider</p>
                    </div>
                  </div>
                </div>

                <div className="mt-7 grid gap-4 sm:grid-cols-2">
                  {/* Skills */}
                  <div className="details-info-card rounded-2xl border border-slate-200 bg-[#f8faf9] p-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-teal-600 shadow-sm">
                        <BriefcaseIcon />
                      </div>

                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                          Skills
                        </p>

                        <p className="mt-1 text-sm font-bold text-[#0d1b2a]">
                          Professional expertise
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {provider?.skills?.length > 0 ? (
                        provider.skills.map((skill, index) => (
                          <span
                            key={`${skill}-${index}`}
                            className="rounded-full border border-teal-100 bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-700"
                          >
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-slate-400">
                          Not specified
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Experience */}
                  <div className="details-info-card rounded-2xl border border-slate-200 bg-[#f8faf9] p-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#0d1b2a] shadow-sm">
                        <BriefcaseIcon />
                      </div>

                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                          Experience
                        </p>

                        <p className="mt-1 text-sm font-bold text-[#0d1b2a]">
                          Professional background
                        </p>
                      </div>
                    </div>

                    <p className="mt-5 text-lg font-semibold text-[#0d1b2a]">
                      {provider?.experience !== undefined
                        ? `${provider.experience} years`
                        : "Not specified"}
                    </p>
                  </div>

                  {/* Location */}
                  <div className="details-info-card rounded-2xl border border-slate-200 bg-[#f8faf9] p-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-teal-600 shadow-sm">
                        <LocationIcon />
                      </div>

                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                          Location
                        </p>

                        <p className="mt-1 text-sm font-bold text-[#0d1b2a]">
                          Service coverage
                        </p>
                      </div>
                    </div>

                    <p className="mt-5 text-lg font-semibold text-[#0d1b2a]">
                      {provider?.location || "Not specified"}
                    </p>
                  </div>

                  {/* Availability */}
                  <div className="details-info-card rounded-2xl border border-slate-200 bg-[#f8faf9] p-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
                        <ClockIcon />
                      </div>

                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                          Availability
                        </p>

                        <p className="mt-1 text-sm font-bold text-[#0d1b2a]">
                          Current status
                        </p>
                      </div>
                    </div>

                    <div className="mt-5">
                      {isAvailable ? (
                        <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-bold text-emerald-700">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          Available
                        </span>
                      ) : (
                        <span className="inline-flex rounded-full bg-rose-50 px-3 py-1.5 text-sm font-bold text-rose-700">
                          Currently unavailable
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Verification */}
                <div className="mt-5">
                  {provider?.verificationStatus === "verified" ? (
                    <div className="flex items-start gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-white">
                        <ShieldCheckIcon />
                      </div>

                      <div>
                        <p className="text-sm font-bold text-emerald-900">
                          Verified provider
                        </p>

                        <p className="mt-1 text-xs leading-5 text-emerald-700">
                          This provider has been verified by Sahayra.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-5">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                        <ShieldCheckIcon />
                      </div>

                      <div>
                        <p className="text-sm font-bold text-amber-900">
                          Verification pending
                        </p>

                        <p className="mt-1 text-xs leading-5 text-amber-700">
                          Provider verification status is currently{" "}
                          {provider?.verificationStatus || "pending"}.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </section>
            </div>

            {/* RIGHT — BOOKING */}
            <aside className="min-w-0">
              <div className="sticky top-[100px] overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-[0_20px_65px_rgba(13,27,42,.09)]">
                <div className="relative overflow-hidden bg-[#0d1b2a] px-6 py-7 sm:px-7">
                  <div className="details-glow absolute -right-16 -top-20 h-48 w-48 rounded-full bg-cyan-300/10 blur-3xl" />

                  <div className="relative">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-300">
                      Book this service
                    </p>

                    <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-white">
                      Reserve your slot
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-white/40">
                      Choose your preferred date and time. The provider will
                      receive your request.
                    </p>
                  </div>
                </div>

                <div className="p-6 sm:p-7">
                  {/* Price */}
                  <div className="rounded-2xl bg-[#f1f7f6] p-5">
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
                      Service price
                    </p>

                    <div className="mt-2 flex items-end justify-between gap-3">
                      <p className="text-3xl font-semibold tracking-tight text-[#0d1b2a]">
                        ₹{service.price}
                      </p>

                      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                        <ClockIcon />
                        {service.duration} min
                      </div>
                    </div>
                  </div>

                  {/* Date */}
                  <div className="mt-6">
                    <label
                      htmlFor="bookingDate"
                      className="mb-2 block text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400"
                    >
                      Date & time
                    </label>

                    <div className="relative">
                      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-teal-600">
                        <CalendarIcon />
                      </span>

                      <input
                        id="bookingDate"
                        type="datetime-local"
                        value={bookingDate}
                        onChange={(event) => {
                          setBookingDate(event.target.value);
                          setBookingMessage("");
                        }}
                        min={new Date().toISOString().slice(0, 16)}
                        className="h-12 w-full rounded-xl border border-slate-200 bg-[#f8faf9] pl-11 pr-3 text-sm font-medium text-slate-800 outline-none transition focus:border-teal-300 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
                      />
                    </div>
                  </div>

                  {/* Availability */}
                  <div className="mt-4 flex items-center justify-between rounded-xl border border-slate-200 bg-[#f8faf9] px-4 py-3">
                    <span className="text-xs font-semibold text-slate-500">
                      Provider status
                    </span>

                    {isAvailable ? (
                      <span className="inline-flex items-center gap-2 text-xs font-bold text-emerald-600">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        Available
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-rose-600">
                        Unavailable
                      </span>
                    )}
                  </div>

                  {/* Message */}
                  {bookingMessage && (
                    <div
                      className={`mt-4 rounded-xl border px-4 py-3 text-sm leading-5 ${
                        bookingMessage.includes("successfully")
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                          : "border-rose-200 bg-rose-50 text-rose-700"
                      }`}
                    >
                      {bookingMessage}
                    </div>
                  )}

                  {/* CTA */}
                  <button
                    type="button"
                    onClick={handleBooking}
                    disabled={booking || !isAvailable}
                    className="details-action group mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0d1b2a] px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-slate-950/10 transition hover:bg-teal-600 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-[#0d1b2a]"
                  >
                    {booking ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Sending request...
                      </>
                    ) : (
                      <>
                        Request booking
                        <span className="transition-transform group-hover:translate-x-1">
                          <ArrowRightIcon />
                        </span>
                      </>
                    )}
                  </button>

                  {!isAvailable && (
                    <p className="mt-3 text-center text-xs font-medium text-rose-500">
                      This provider is currently unavailable.
                    </p>
                  )}

                  <div className="mt-5 border-t border-slate-100 pt-5">
                    <p className="text-center text-[11px] leading-5 text-slate-400">
                      Your request remains pending until the provider accepts
                      the booking.
                    </p>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ServiceDetails;

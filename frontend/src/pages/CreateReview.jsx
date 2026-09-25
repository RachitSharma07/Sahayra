import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

function StarIcon({ filled = false }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-full w-full"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m12 3 2.3 5 5.4.6-4 3.7 1.1 5.4L12 14.8 7.2 17.7l1.1-5.4-4-.6L12 3Z"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      className="h-4 w-4"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m6.5 12.5 3.5 3.5 7.5-8"
      />
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

function CreateReview() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [bookings, setBookings] = useState([]);
  const [bookingId, setBookingId] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const ratingLabels = {
    1: "Poor",
    2: "Fair",
    3: "Good",
    4: "Very good",
    5: "Excellent",
  };

  /*
   * --------------------------------------------------
   * Fetch completed bookings
   * --------------------------------------------------
   */
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/bookings`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch bookings");
        }

        const completedBookings = (data.bookings || []).filter(
          (booking) => booking.status === "completed",
        );

        setBookings(completedBookings);

        /*
         * If BookingHistory opened this page with:
         *
         * /customer/review?bookingId=xxxxx
         *
         * automatically select that booking.
         */
        const requestedBookingId = searchParams.get("bookingId");

        if (
          requestedBookingId &&
          completedBookings.some(
            (booking) => booking._id === requestedBookingId,
          )
        ) {
          setBookingId(requestedBookingId);
        }
      } catch (error) {
        console.error("Fetch completed bookings error:", error);

        setError(
          error.message || "Something went wrong while fetching bookings",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [navigate, searchParams]);

  /*
   * --------------------------------------------------
   * Submit review
   * --------------------------------------------------
   */
  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");

    if (!bookingId) {
      setError("Please select a completed booking.");
      return;
    }

    try {
      setSubmitting(true);

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/reviews`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            bookingId,
            rating,
            comment,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create review");
      }

      setMessage(
        data.message || "Your review has been submitted successfully.",
      );

      setBookingId("");
      setRating(5);
      setComment("");
    } catch (error) {
      console.error("Create review error:", error);

      setError(error.message || "Something went wrong while creating review");
    } finally {
      setSubmitting(false);
    }
  };

  const selectedBooking = bookings.find((booking) => booking._id === bookingId);

  /*
   * --------------------------------------------------
   * Loading
   * --------------------------------------------------
   */
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f4f7f7] text-[#0d1b2a]">
        <section className="px-5 py-7 sm:px-8 sm:py-9">
          <div className="mx-auto max-w-[1200px] animate-pulse">
            <div className="h-4 w-32 rounded bg-slate-200" />

            <div className="mt-5 h-10 w-80 max-w-full rounded-xl bg-slate-200" />

            <div className="mt-3 h-4 w-[500px] max-w-full rounded bg-slate-100" />

            <div className="mt-8 grid gap-6 lg:grid-cols-[0.82fr_1.18fr]">
              <div className="h-[480px] rounded-[26px] border border-slate-200 bg-white" />

              <div className="h-[560px] rounded-[26px] border border-slate-200 bg-white" />
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @keyframes reviewRise {
          from {
            opacity: 0;
            transform: translateY(14px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes reviewGlow {
          0%, 100% {
            transform: scale(1);
            opacity: 0.5;
          }
          50% {
            transform: scale(1.08);
            opacity: 0.8;
          }
        }

        .review-rise {
          animation: reviewRise 0.55s ease both;
        }

        .review-glow {
          animation: reviewGlow 5s ease-in-out infinite;
        }
      `}</style>

      <div className="min-h-screen overflow-hidden bg-[#f4f7f7] text-[#0d1b2a]">
        <section className="relative px-5 py-7 sm:px-8 sm:py-9">
          <div className="pointer-events-none absolute -left-20 top-32 h-72 w-72 rounded-full bg-teal-200/20 blur-3xl review-glow" />

          <div className="pointer-events-none absolute right-0 top-0 h-80 w-80 rounded-full bg-cyan-200/20 blur-3xl review-glow" />

          <div className="relative mx-auto max-w-[1200px]">
            {/* ------------------------------------ */}
            {/* Heading */}
            {/* ------------------------------------ */}
            <div className="review-rise">
              <button
                type="button"
                onClick={() => navigate("/customer/bookings")}
                className="group mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-teal-600"
              >
                <ArrowLeftIcon />

                <span className="transition-transform group-hover:-translate-x-0.5">
                  Back to bookings
                </span>
              </button>

              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-teal-600">
                Customer feedback
              </p>

              <h1 className="mt-3 text-3xl font-black tracking-[-0.04em] text-[#0b1825] sm:text-4xl">
                Share your experience,
                <span className="text-teal-600"> help others decide.</span>
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-[15px]">
                Rate a completed service and tell the community what your
                experience was like.
              </p>
            </div>

            {/* ------------------------------------ */}
            {/* Messages */}
            {/* ------------------------------------ */}
            {message && (
              <div className="review-rise mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                    <CheckIcon />
                  </div>

                  <div>
                    <p className="text-sm font-black text-emerald-900">
                      Review submitted
                    </p>

                    <p className="mt-1 text-xs leading-5 text-emerald-700">
                      {message}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="review-rise mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4">
                <p className="text-sm font-semibold text-rose-700">{error}</p>
              </div>
            )}

            {/* ------------------------------------ */}
            {/* Empty state */}
            {/* ------------------------------------ */}
            {bookings.length === 0 ? (
              <div className="review-rise relative mt-7 overflow-hidden rounded-[26px] border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-[0_12px_45px_rgba(8,19,31,0.05)] sm:py-20">
                <div className="pointer-events-none absolute left-1/2 top-0 h-44 w-44 -translate-x-1/2 rounded-full bg-amber-100/30 blur-3xl" />

                <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-500">
                  <div className="h-8 w-8">
                    <StarIcon filled />
                  </div>
                </div>

                <p className="relative mt-6 text-[10px] font-bold uppercase tracking-[0.2em] text-teal-600">
                  Nothing to review yet
                </p>

                <h2 className="relative mt-2 text-2xl font-black tracking-tight text-[#0b1825]">
                  No completed bookings
                </h2>

                <p className="relative mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                  Complete a service first and you’ll be able to share your
                  experience here.
                </p>

                <button
                  type="button"
                  onClick={() => navigate("/services")}
                  className="group relative mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-[#08131f] px-5 py-3 text-sm font-bold text-white shadow-[0_10px_25px_rgba(8,19,31,0.18)] transition duration-200 hover:-translate-y-0.5 hover:bg-teal-600"
                >
                  Explore services
                  <span className="transition-transform group-hover:translate-x-0.5">
                    <ArrowRightIcon />
                  </span>
                </button>
              </div>
            ) : (
              <div className="mt-7 grid gap-6 lg:grid-cols-[0.82fr_1.18fr]">
                {/* -------------------------------- */}
                {/* Left information */}
                {/* -------------------------------- */}
                <section
                  className="review-rise rounded-[26px] border border-slate-200 bg-white p-6 shadow-[0_12px_45px_rgba(8,19,31,0.05)] sm:p-7"
                  style={{ animationDelay: "80ms" }}
                >
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-teal-600">
                    Why reviews matter
                  </p>

                  <h2 className="mt-2 text-2xl font-black tracking-tight text-[#0b1825]">
                    Your experience can help the next customer.
                  </h2>

                  <p className="mt-4 text-sm leading-6 text-slate-500">
                    Honest feedback helps people discover reliable professionals
                    and gives providers useful insight into their service.
                  </p>

                  <div className="mt-8 space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-500">
                        <span className="h-4 w-4">
                          <StarIcon filled />
                        </span>
                      </div>

                      <div>
                        <p className="text-sm font-bold text-[#0b1825]">
                          Rate the overall experience
                        </p>

                        <p className="mt-1 text-xs leading-5 text-slate-400">
                          Think about quality, professionalism and how well the
                          service matched your expectations.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                        <UserIcon />
                      </div>

                      <div>
                        <p className="text-sm font-bold text-[#0b1825]">
                          Keep it useful
                        </p>

                        <p className="mt-1 text-xs leading-5 text-slate-400">
                          Mention details that another customer would find
                          helpful.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                        <CheckIcon />
                      </div>

                      <div>
                        <p className="text-sm font-bold text-[#0b1825]">
                          Review completed services
                        </p>

                        <p className="mt-1 text-xs leading-5 text-slate-400">
                          Only services you have completed are available for
                          review.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Selected booking */}
                  {selectedBooking && (
                    <div className="mt-8 overflow-hidden rounded-2xl border border-teal-100 bg-teal-50/60 p-5">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-teal-600">
                          Selected booking
                        </p>

                        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
                          Completed
                        </span>
                      </div>

                      <h3 className="mt-2 text-base font-black text-[#0b1825]">
                        {selectedBooking.service?.name || "Service"}
                      </h3>

                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                            Provider
                          </p>

                          <p className="mt-1 text-sm font-semibold text-slate-800">
                            {selectedBooking.provider?.user?.name || "Provider"}
                          </p>
                        </div>

                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                            Amount
                          </p>

                          <p className="mt-1 text-sm font-semibold text-slate-800">
                            ₹
                            {selectedBooking.amount ??
                              selectedBooking.service?.price ??
                              0}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </section>

                {/* -------------------------------- */}
                {/* Review form */}
                {/* -------------------------------- */}
                <section
                  className="review-rise rounded-[26px] border border-slate-200 bg-white p-6 shadow-[0_12px_45px_rgba(8,19,31,0.05)] sm:p-7"
                  style={{ animationDelay: "150ms" }}
                >
                  <form onSubmit={handleSubmit}>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-teal-600">
                        Write your review
                      </p>

                      <h2 className="mt-2 text-2xl font-black tracking-tight text-[#0b1825]">
                        Tell us how it went.
                      </h2>

                      <p className="mt-2 text-sm leading-6 text-slate-500">
                        Select a completed booking, choose a rating and add your
                        feedback.
                      </p>
                    </div>

                    {/* Booking */}
                    <div className="mt-7">
                      <label
                        htmlFor="booking"
                        className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-slate-400"
                      >
                        Completed booking
                      </label>

                      <select
                        id="booking"
                        value={bookingId}
                        onChange={(event) => {
                          setBookingId(event.target.value);
                          setMessage("");
                          setError("");
                        }}
                        required
                        className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-800 outline-none transition focus:border-teal-300 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
                      >
                        <option value="">Select a completed booking</option>

                        {bookings.map((booking) => (
                          <option key={booking._id} value={booking._id}>
                            {booking.service?.name || "Service"} — ₹
                            {booking.amount ?? booking.service?.price ?? 0}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Rating */}
                    <div className="mt-8">
                      <div className="flex items-end justify-between gap-4">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                            Your rating
                          </label>

                          <p className="mt-1 text-sm font-semibold text-slate-700">
                            How was your experience?
                          </p>
                        </div>

                        <span className="text-sm font-black text-amber-500">
                          {rating}/5
                        </span>
                      </div>

                      <div
                        className="mt-5 flex flex-wrap gap-2"
                        role="radiogroup"
                        aria-label="Rating"
                      >
                        {[1, 2, 3, 4, 5].map((value) => (
                          <button
                            key={value}
                            type="button"
                            role="radio"
                            aria-checked={rating === value}
                            aria-label={`${value} star${
                              value === 1 ? "" : "s"
                            }`}
                            onClick={() => {
                              setRating(value);
                              setMessage("");
                              setError("");
                            }}
                            className={`flex h-14 w-14 items-center justify-center rounded-2xl border transition duration-200 hover:-translate-y-0.5 ${
                              rating >= value
                                ? "border-amber-200 bg-amber-50 text-amber-500 shadow-sm"
                                : "border-slate-200 bg-slate-50 text-slate-300 hover:border-slate-300 hover:text-slate-400"
                            }`}
                          >
                            <span className="h-6 w-6">
                              <StarIcon filled={rating >= value} />
                            </span>
                          </button>
                        ))}
                      </div>

                      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                        <p className="text-xs font-semibold text-slate-500">
                          {ratingLabels[rating]}
                        </p>

                        <p className="text-[10px] font-medium text-slate-400">
                          1 = Poor · 5 = Excellent
                        </p>
                      </div>
                    </div>

                    {/* Comment */}
                    <div className="mt-8">
                      <div className="flex items-end justify-between gap-4">
                        <label
                          htmlFor="comment"
                          className="block text-xs font-bold uppercase tracking-[0.14em] text-slate-400"
                        >
                          Your feedback
                        </label>

                        <span className="text-[10px] font-medium text-slate-400">
                          {comment.length} characters
                        </span>
                      </div>

                      <textarea
                        id="comment"
                        value={comment}
                        onChange={(event) => {
                          setComment(event.target.value);
                          setMessage("");
                          setError("");
                        }}
                        placeholder="What did you like? Was there anything the provider could improve?"
                        rows={7}
                        className="mt-2 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-teal-300 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
                      />
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={submitting}
                      className="group mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-[#08131f] px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#08131f]/10 transition duration-200 hover:-translate-y-0.5 hover:bg-teal-600 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:bg-[#08131f]"
                    >
                      {submitting ? (
                        <>
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                          Submitting review...
                        </>
                      ) : (
                        <>
                          Submit review
                          <span className="transition-transform group-hover:translate-x-0.5">
                            <ArrowRightIcon />
                          </span>
                        </>
                      )}
                    </button>
                  </form>
                </section>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}

export default CreateReview;

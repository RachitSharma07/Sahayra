import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-4 w-4"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m13 6 6 6-6 6" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="m5 12 4 4L19 7" />
    </svg>
  );
}

function Reveal({ children, className = "" }) {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.classList.add("reveal-visible");
          observer.unobserve(element);
        }
      },
      { threshold: 0.12 },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`reveal ${className}`}>
      {children}
    </div>
  );
}

function Home() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f4f7f7] text-[#0d1b2a]">
      <style>{`
        @keyframes floatSlow {
          0%, 100% {
            transform: translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(0, -18px, 0);
          }
        }

        @keyframes floatReverse {
          0%, 100% {
            transform: translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(0, 16px, 0);
          }
        }

        @keyframes pulseGlow {
          0%, 100% {
            opacity: .28;
            transform: scale(1);
          }
          50% {
            opacity: .6;
            transform: scale(1.12);
          }
        }

        @keyframes rotateSlow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes rotateReverse {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }

        @keyframes gridMove {
          from {
            transform: translate3d(0, 0, 0);
          }
          to {
            transform: translate3d(72px, 72px, 0);
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-130%);
          }
          100% {
            transform: translateX(130%);
          }
        }

        @keyframes marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }

        @keyframes lineMove {
          from {
            transform: translateX(-140%);
          }
          to {
            transform: translateX(250%);
          }
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(32px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .hero-enter {
          opacity: 0;
          animation: fadeUp .9s ease-out forwards;
        }

        .hero-delay-1 {
          opacity: 0;
          animation: fadeUp .9s .15s ease-out forwards;
        }

        .hero-delay-2 {
          opacity: 0;
          animation: fadeUp .9s .3s ease-out forwards;
        }

        .hero-delay-3 {
          opacity: 0;
          animation: fadeUp .9s .45s ease-out forwards;
        }

        .hero-scale {
          opacity: 0;
          animation: scaleIn 1s .35s ease-out forwards;
        }

        .float-slow {
          animation: floatSlow 6s ease-in-out infinite;
        }

        .float-reverse {
          animation: floatReverse 7s ease-in-out infinite;
        }

        .float-slower {
          animation: floatSlow 10s ease-in-out infinite;
        }

        .pulse-glow {
          animation: pulseGlow 4s ease-in-out infinite;
        }

        .rotate-slow {
          animation: rotateSlow 30s linear infinite;
        }

        .rotate-reverse {
          animation: rotateReverse 22s linear infinite;
        }

        .grid-motion {
          animation: gridMove 15s linear infinite;
        }

        .marquee-track {
          animation: marquee 28s linear infinite;
        }

        .moving-line {
          animation: lineMove 5s linear infinite;
        }

        .reveal {
          opacity: 0;
          transform: translateY(42px);
          transition:
            opacity .9s cubic-bezier(.2,.65,.25,1),
            transform .9s cubic-bezier(.2,.65,.25,1);
        }

        .reveal-visible {
          opacity: 1;
          transform: translateY(0);
        }

        .reveal-delay-1 {
          transition-delay: 100ms;
        }

        .reveal-delay-2 {
          transition-delay: 220ms;
        }

        .reveal-delay-3 {
          transition-delay: 340ms;
        }

        .service-pill {
          transition:
            transform .35s ease,
            border-color .35s ease,
            background .35s ease,
            box-shadow .35s ease;
        }

        .service-pill:hover {
          transform: translateY(-6px) scale(1.03);
          border-color: rgba(45, 212, 191, .45);
          background: rgba(255,255,255,.08);
          box-shadow: 0 24px 55px rgba(45,212,191,.12);
        }

        .shine {
          position: relative;
          overflow: hidden;
        }

        .shine::after {
          content: "";
          position: absolute;
          inset: 0;
          width: 34%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255,255,255,.16),
            transparent
          );
          transform: translateX(-130%);
          animation: shimmer 5s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: .001ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: .001ms !important;
          }
        }
      `}</style>

      {/* NAVBAR */}
      <header className="sticky top-0 z-50 border-b border-[#0d1b2a]/[0.07] bg-[#f4f7f7]/75 backdrop-blur-2xl">
        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
          <Link to="/" className="group flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-[14px] bg-[#0d1b2a] text-sm font-black text-white shadow-[0_10px_28px_rgba(13,27,42,.16)] transition duration-300 group-hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 via-teal-400 to-emerald-300 opacity-90" />
              <span className="relative z-10 text-[#082032]">S</span>
            </div>

            <div>
              <p className="text-[15px] font-bold tracking-tight text-[#0d1b2a]">
                ServiceHub
              </p>
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
                Local services
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="hidden rounded-xl px-4 py-2.5 text-sm font-semibold text-[#0d1b2a]/60 transition hover:bg-white hover:text-[#0d1b2a] sm:block"
            >
              Sign in
            </Link>

            <Link
              to="/register"
              className="shine rounded-xl bg-[#0d1b2a] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_28px_rgba(13,27,42,.12)] transition hover:-translate-y-0.5 hover:bg-[#13283b]"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section className="relative isolate min-h-[900px] overflow-hidden bg-[#08131f]">
          {/* Glows */}
          <div className="pointer-events-none absolute inset-0">
            <div className="pulse-glow absolute left-1/2 top-[-250px] h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-cyan-400/12 blur-[130px]" />

            <div className="float-slower absolute left-[5%] top-[25%] h-[240px] w-[240px] rounded-full bg-teal-400/8 blur-[100px]" />

            <div className="float-reverse absolute right-[5%] top-[35%] h-[260px] w-[260px] rounded-full bg-amber-300/7 blur-[100px]" />
          </div>

          {/* Grid */}
          <div className="pointer-events-none absolute inset-[-180px] opacity-[0.16]">
            <div
              className="grid-motion absolute inset-0"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(94,234,212,.15) 1px, transparent 1px), linear-gradient(90deg, rgba(94,234,212,.15) 1px, transparent 1px)",
                backgroundSize: "72px 72px",
                transform: "perspective(500px) rotateX(55deg)",
                transformOrigin: "center bottom",
              }}
            />
          </div>

          {/* Rings */}
          <div className="pointer-events-none absolute left-1/2 top-[43%] h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/[0.10] rotate-slow" />

          <div className="pointer-events-none absolute left-1/2 top-[43%] h-[640px] w-[640px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-300/[0.07] rotate-reverse" />

          <div className="pointer-events-none absolute left-1/2 top-[43%] h-[780px] w-[780px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.035]" />

          <div className="relative mx-auto max-w-6xl px-5 pb-20 pt-24 text-center sm:px-8 sm:pt-32 lg:px-10 lg:pt-36">
            <div className="hero-enter inline-flex items-center gap-2 rounded-full border border-cyan-200/15 bg-white/[0.045] px-4 py-2 text-xs font-semibold text-cyan-200 backdrop-blur-xl">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-300 opacity-40" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-300" />
              </span>
              A simpler way to find local services
            </div>

            <h1 className="hero-delay-1 mx-auto mt-8 max-w-5xl text-5xl font-semibold leading-[0.94] tracking-[-0.06em] text-white sm:text-6xl md:text-7xl lg:text-[94px]">
              Local services,
              <span className="block bg-gradient-to-r from-cyan-300 via-teal-200 to-amber-200 bg-clip-text text-transparent">
                simply connected.
              </span>
            </h1>

            <p className="hero-delay-2 mx-auto mt-8 max-w-2xl text-[15px] leading-7 text-white/50 sm:text-lg sm:leading-8">
              ServiceHub brings customers and local professionals together in
              one simple platform. Discover services, connect with the right
              person, and manage everything in one place.
            </p>

            <div className="hero-delay-3 mt-10 flex justify-center">
              <Link
                to="/register"
                className="shine group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-300 px-6 py-3.5 text-sm font-bold text-[#05212a] shadow-[0_18px_55px_rgba(45,212,191,.18)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_65px_rgba(45,212,191,.24)]"
              >
                Get started
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  <ArrowIcon />
                </span>
              </Link>
            </div>

            {/* Floating ecosystem */}
            <div className="hero-scale relative mx-auto mt-24 h-[290px] max-w-4xl sm:h-[330px]">
              {/* Core */}
              <div className="pulse-glow absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/10 blur-2xl" />

              <div className="absolute left-1/2 top-1/2 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[28px] border border-white/10 bg-white/[0.07] shadow-[0_25px_80px_rgba(45,212,191,.14)] backdrop-blur-xl">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-300 to-teal-400 text-lg font-black text-[#062330] shadow-lg">
                  S
                </div>
              </div>

              {/* Service pills */}
              <div className="service-pill float-slow absolute left-[4%] top-[15%] rounded-2xl border border-white/10 bg-white/[0.055] px-4 py-3 text-left backdrop-blur-xl">
                <p className="text-xs font-semibold text-white">
                  Home Cleaning
                </p>
                <p className="mt-1 text-[10px] text-white/35">
                  Local professionals
                </p>
              </div>

              <div className="service-pill float-reverse absolute right-[4%] top-[8%] rounded-2xl border border-white/10 bg-white/[0.055] px-4 py-3 text-left backdrop-blur-xl">
                <p className="text-xs font-semibold text-white">Electrician</p>
                <p className="mt-1 text-[10px] text-white/35">Home services</p>
              </div>

              <div className="service-pill float-slower absolute bottom-[11%] left-[13%] rounded-2xl border border-white/10 bg-white/[0.055] px-4 py-3 text-left backdrop-blur-xl">
                <p className="text-xs font-semibold text-white">AC Service</p>
                <p className="mt-1 text-[10px] text-white/35">
                  Repair & maintenance
                </p>
              </div>

              <div className="service-pill float-slow absolute bottom-[13%] right-[12%] rounded-2xl border border-white/10 bg-white/[0.055] px-4 py-3 text-left backdrop-blur-xl">
                <p className="text-xs font-semibold text-white">Tutoring</p>
                <p className="mt-1 text-[10px] text-white/35">
                  Personal learning
                </p>
              </div>

              {/* Connecting lines */}
              <div className="absolute left-[24%] top-[37%] h-px w-[110px] rotate-[18deg] bg-gradient-to-r from-transparent via-cyan-300/30 to-transparent" />

              <div className="absolute right-[22%] top-[34%] h-px w-[115px] -rotate-[18deg] bg-gradient-to-r from-transparent via-teal-300/30 to-transparent" />

              <div className="absolute bottom-[31%] left-[31%] h-px w-[85px] -rotate-[23deg] bg-gradient-to-r from-transparent via-amber-300/20 to-transparent" />

              <div className="absolute bottom-[30%] right-[28%] h-px w-[92px] rotate-[23deg] bg-gradient-to-r from-transparent via-cyan-300/20 to-transparent" />
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs font-medium text-white/30">
              <span>Discover services</span>
              <span className="h-1 w-1 rounded-full bg-white/20" />
              <span>Connect with professionals</span>
              <span className="h-1 w-1 rounded-full bg-white/20" />
              <span>Manage bookings</span>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-px overflow-hidden bg-white/[0.06]">
            <div className="moving-line h-full w-1/3 bg-gradient-to-r from-transparent via-cyan-300/50 to-transparent" />
          </div>
        </section>

        {/* WHAT IS SERVICEHUB */}
        <section className="relative overflow-hidden bg-[#f4f7f7]">
          <div className="pointer-events-none absolute left-1/2 top-[-140px] h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-teal-300/10 blur-[110px]" />

          <div className="relative mx-auto max-w-5xl px-5 py-28 text-center sm:px-8 lg:py-36">
            <Reveal>
              <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-teal-600">
                What is ServiceHub?
              </p>

              <h2 className="mt-5 text-3xl font-semibold tracking-[-0.045em] text-[#0d1b2a] sm:text-4xl lg:text-5xl">
                One place for local services.
              </h2>

              <p className="mx-auto mt-6 max-w-2xl text-[15px] leading-8 text-slate-500 sm:text-base">
                Finding a reliable professional should not feel complicated.
                ServiceHub creates a straightforward connection between people
                who need services and professionals who provide them.
              </p>

              <div className="mx-auto mt-10 h-1 w-14 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500" />
            </Reveal>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="relative overflow-hidden bg-[#0b1723]">
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[480px] w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/6 blur-[120px]" />

          <div className="relative mx-auto max-w-7xl px-5 py-28 sm:px-8 lg:px-10 lg:py-36">
            <Reveal>
              <div className="text-center">
                <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-cyan-300">
                  How it works
                </p>

                <h2 className="mt-5 text-3xl font-semibold tracking-[-0.045em] text-white sm:text-4xl lg:text-5xl">
                  Simple from start to finish.
                </h2>

                <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-white/40 sm:text-base">
                  ServiceHub keeps the process clear so customers and
                  professionals can focus on the actual service.
                </p>
              </div>
            </Reveal>

            <div className="mt-16 grid gap-5 md:grid-cols-3">
              {[
                {
                  number: "01",
                  title: "Discover",
                  text: "Find the service you need and explore professionals available on the platform.",
                  accent: "text-cyan-300",
                },
                {
                  number: "02",
                  title: "Connect",
                  text: "Review service details, professional information, and choose the right option for your needs.",
                  accent: "text-teal-300",
                },
                {
                  number: "03",
                  title: "Book",
                  text: "Schedule the service and manage your booking through one connected platform.",
                  accent: "text-amber-200",
                },
              ].map((item, index) => (
                <Reveal
                  key={item.number}
                  className={`reveal-delay-${index + 1}`}
                >
                  <div className="group relative h-full overflow-hidden rounded-[28px] border border-white/[0.08] bg-white/[0.035] p-8 backdrop-blur-xl transition duration-500 hover:-translate-y-2 hover:border-teal-300/20 hover:bg-white/[0.055]">
                    <div className="absolute right-[-30px] top-[-30px] h-32 w-32 rounded-full bg-teal-300/[0.05] blur-3xl transition duration-500 group-hover:scale-150" />

                    <div className="relative">
                      <span
                        className={`text-xs font-bold tracking-[0.2em] ${item.accent}`}
                      >
                        {item.number}
                      </span>

                      <h3 className="mt-7 text-2xl font-semibold tracking-tight text-white">
                        {item.title}
                      </h3>

                      <p className="mt-4 text-sm leading-7 text-white/40">
                        {item.text}
                      </p>

                      <div className="mt-8 h-px w-16 bg-gradient-to-r from-cyan-300 to-transparent transition-all duration-500 group-hover:w-28" />
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* MARQUEE */}
        <section className="overflow-hidden border-y border-[#0d1b2a]/[0.07] bg-[#eef4f3] py-6">
          <div className="flex w-max marquee-track">
            {Array.from({ length: 2 }).map((_, index) => (
              <div
                key={index}
                className="flex items-center gap-8 pr-8 whitespace-nowrap"
              >
                {[
                  "LOCAL SERVICES",
                  "EASY BOOKING",
                  "PROFESSIONALS",
                  "CUSTOMER REVIEWS",
                  "SERVICE MANAGEMENT",
                  "LOCAL CONNECTIONS",
                ].map((text) => (
                  <div
                    key={`${index}-${text}`}
                    className="flex items-center gap-8"
                  >
                    <span className="text-[10px] font-bold tracking-[0.25em] text-[#0d1b2a]/30">
                      {text}
                    </span>

                    <span className="h-1.5 w-1.5 rounded-full bg-teal-500/70" />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>

        {/* BOTH SIDES */}
        <section className="relative overflow-hidden bg-[#f4f7f7]">
          <div className="mx-auto max-w-7xl px-5 py-28 sm:px-8 lg:px-10 lg:py-36">
            <Reveal>
              <div className="text-center">
                <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-teal-600">
                  Built for both sides
                </p>

                <h2 className="mt-5 text-3xl font-semibold tracking-[-0.045em] text-[#0d1b2a] sm:text-4xl lg:text-5xl">
                  One platform. Two simple experiences.
                </h2>
              </div>
            </Reveal>

            <div className="mt-16 grid gap-5 lg:grid-cols-2">
              <Reveal className="reveal-delay-1">
                <div className="group relative h-full overflow-hidden rounded-[32px] border border-teal-200/60 bg-gradient-to-br from-white via-[#f7fcfb] to-teal-50 p-8 shadow-[0_20px_55px_rgba(13,27,42,.06)] transition duration-500 hover:-translate-y-2 hover:shadow-[0_30px_70px_rgba(13,27,42,.09)] sm:p-10">
                  <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-teal-300/20 blur-3xl transition duration-700 group-hover:scale-150" />

                  <div className="relative">
                    <div className="inline-flex rounded-full border border-teal-200 bg-teal-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-teal-700">
                      For customers
                    </div>

                    <h3 className="mt-6 text-3xl font-semibold tracking-[-0.04em] text-[#0d1b2a]">
                      Get the help you need.
                    </h3>

                    <p className="mt-5 text-sm leading-7 text-slate-500">
                      Discover local services, choose professionals, book
                      appointments, communicate, and manage your service journey
                      from one place.
                    </p>

                    <div className="mt-8 space-y-3">
                      {[
                        "Easy discovery",
                        "Simple booking",
                        "Reviews & history",
                      ].map((text) => (
                        <div
                          key={text}
                          className="flex items-center gap-3 text-sm font-medium text-[#0d1b2a]/70"
                        >
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 text-teal-600">
                            <CheckIcon />
                          </div>

                          {text}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Reveal>

              <Reveal className="reveal-delay-2">
                <div className="group relative h-full overflow-hidden rounded-[32px] border border-amber-200/70 bg-gradient-to-br from-white via-[#fffdf7] to-amber-50 p-8 shadow-[0_20px_55px_rgba(13,27,42,.06)] transition duration-500 hover:-translate-y-2 hover:shadow-[0_30px_70px_rgba(13,27,42,.09)] sm:p-10">
                  <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-amber-200/25 blur-3xl transition duration-700 group-hover:scale-150" />

                  <div className="relative">
                    <div className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-amber-700">
                      For professionals
                    </div>

                    <h3 className="mt-6 text-3xl font-semibold tracking-[-0.04em] text-[#0d1b2a]">
                      Put your services in front of customers.
                    </h3>

                    <p className="mt-5 text-sm leading-7 text-slate-500">
                      Create your professional profile, publish services, manage
                      bookings, communicate with customers, and build your
                      presence through ServiceHub.
                    </p>

                    <div className="mt-8 space-y-3">
                      {[
                        "Service listings",
                        "Booking management",
                        "Customer communication",
                      ].map((text) => (
                        <div
                          key={text}
                          className="flex items-center gap-3 text-sm font-medium text-[#0d1b2a]/70"
                        >
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                            <CheckIcon />
                          </div>

                          {text}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* PHILOSOPHY */}
        <section className="relative overflow-hidden bg-[#08131f]">
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-300/[0.08] blur-[130px]" />

          <div className="relative mx-auto max-w-4xl px-5 py-32 text-center sm:px-8 lg:py-40">
            <Reveal>
              <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-cyan-300">
                Our approach
              </p>

              <h2 className="mt-6 text-4xl font-semibold leading-[1.02] tracking-[-0.055em] text-white sm:text-5xl lg:text-7xl">
                Less searching.
                <br />
                <span className="bg-gradient-to-r from-cyan-300 via-teal-200 to-amber-200 bg-clip-text text-transparent">
                  More getting things done.
                </span>
              </h2>

              <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-white/40">
                ServiceHub is designed around a simple idea: connecting people
                with useful local services should be clear, accessible, and easy
                to manage.
              </p>
            </Reveal>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="relative overflow-hidden bg-[#f4f7f7] px-5 py-28 sm:px-8 lg:px-10 lg:py-36">
          <div className="pointer-events-none absolute left-[12%] top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-teal-300/10 blur-[110px]" />

          <div className="pointer-events-none absolute right-[8%] top-1/3 h-64 w-64 rounded-full bg-amber-200/10 blur-[100px]" />

          <Reveal>
            <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[38px] border border-[#173044] bg-[#0d1b2a] px-7 py-16 shadow-[0_35px_100px_rgba(13,27,42,.20)] sm:px-10 sm:py-20">
              {/* Animated ambient light */}
              <div className="pulse-glow pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />

              <div className="float-slow pointer-events-none absolute -bottom-24 -right-20 h-72 w-72 rounded-full bg-amber-300/10 blur-3xl" />

              <div className="relative text-center">
                <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-cyan-200/10 bg-white/[0.04] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-cyan-200">
                  ServiceHub
                </div>

                <h2 className="mx-auto mt-6 max-w-2xl text-3xl font-semibold tracking-[-0.045em] text-white sm:text-4xl lg:text-5xl">
                  Ready to get started?
                </h2>

                <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-white/45 sm:text-base sm:leading-8">
                  Join ServiceHub and experience a simpler way to discover and
                  manage local services.
                </p>

                <div className="mt-9 flex justify-center">
                  <Link
                    to="/register"
                    className="shine group inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-sm font-bold text-[#0d1b2a] shadow-[0_15px_35px_rgba(0,0,0,.15)] transition duration-300 hover:-translate-y-1 hover:bg-cyan-50 hover:shadow-[0_20px_45px_rgba(0,0,0,.2)]"
                  >
                    Create your account
                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                      <ArrowIcon />
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-[#0d1b2a]/[0.08] bg-[#eef4f3]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 py-8 text-xs text-[#0d1b2a]/40 sm:px-8 lg:flex-row lg:px-10">
          <div>© 2026 ServiceHub</div>

          <div>Connecting customers with local professionals.</div>
        </div>
      </footer>
    </div>
  );
}

export default Home;

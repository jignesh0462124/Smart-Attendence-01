// src/pages/Landing.jsx
import heroImage from "./img/img1.png";

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top bar */}
      <header className="border-b border-slate-100 bg-white/80 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="text-lg font-semibold tracking-tight text-slate-900">
            SmartAttend
          </div>

          <button
            onClick={() => (window.location.href = "/signup")}
            className="hidden sm:inline-flex items-center rounded-full bg-yellow-400 px-5 py-2 text-sm font-semibold text-slate-900 shadow-md shadow-yellow-400/40 hover:bg-yellow-300 transition"
          >
            Get Started
          </button>
        </div>
      </header>

      <main className="flex-1">
        {/* HERO */}
        <section className="bg-slate-50">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-20 grid gap-10 lg:grid-cols-2 items-center">
            {/* Left */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 mb-5 border border-blue-100">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                <span className="text-[11px] font-medium text-slate-600">
                  New: Smart Geofencing
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
                Track Team
                <br />
                Attendance with <span className="text-blue-600">Precision</span>
              </h1>

              <p className="mt-4 text-sm sm:text-base text-slate-600 max-w-xl">
                Real-time tracking, facial recognition, and geofencing. The
                all-in-one workforce management platform.
              </p>
            </div>

            {/* Right illustration block with image + floating cards */}
            <div className="relative flex justify-center">
              <div className="relative w-full max-w-md">
                {/* Floating top badge */}
                <div className="absolute -top-6 left-6 z-20">
                  <div className="flex items-center gap-2 rounded-2xl bg-white px-4 py-2 text-[11px] shadow-xl shadow-slate-300/60">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-[10px] font-semibold text-blue-600">
                      ●
                    </span>
                    <div>
                      <p className="font-semibold text-slate-800">
                        Geofence Active
                      </p>
                      <p className="text-[10px] text-slate-500">
                        5 employees nearby
                      </p>
                    </div>
                  </div>
                </div>

                {/* Main card with hero image */}
                <div className="relative rounded-3xl bg-white shadow-2xl shadow-slate-300/70 overflow-hidden border border-slate-100 pt-5 pb-6 px-5">
                  <div className="mb-2 text-right text-xs font-semibold text-slate-700">
                    Daily Attendance
                  </div>
                  <div className="rounded-2xl overflow-hidden bg-yellow-50">
                    <img
                      src={heroImage}
                      alt="Smart attendance dashboard"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Floating bottom badge */}
                <div className="absolute -bottom-5 right-6 z-20">
                  <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-[11px] shadow-2xl shadow-slate-300/80">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-yellow-100 text-xs font-bold text-yellow-600">
                      3
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">
                        Late Arrivals
                      </p>
                      <p className="text-[10px] text-slate-500">This week</p>
                    </div>
                  </div>
                </div>

                {/* Soft glow behind card */}
                <div className="pointer-events-none absolute inset-0 -z-10 blur-3xl bg-gradient-to-tr from-blue-200/40 via-transparent to-yellow-200/60" />
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="bg-white">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900">
                How Smart Attendance Works
              </h2>
              <p className="mt-3 text-sm sm:text-base text-slate-500 max-w-xl mx-auto">
                Three simple steps to transform your attendance tracking.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {/* Card 1 */}
              <div className="rounded-3xl bg-gradient-to-b from-slate-50 to-slate-100 p-6 shadow-sm shadow-slate-200 border border-slate-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-500 text-xs font-semibold text-white">
                    1
                  </div>
                  <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                    <span className="text-lg">👥</span>
                  </div>
                </div>
                <h3 className="text-sm font-semibold text-slate-900 mb-2">
                  Onboard your team
                </h3>
                <p className="text-xs sm:text-sm text-slate-500">
                  Import employees, assign departments and shifts. Set up custom
                  work schedules and policies in minutes.
                </p>
              </div>

              {/* Card 2 */}
              <div className="rounded-3xl bg-gradient-to-b from-rose-50 to-rose-100 p-6 shadow-sm shadow-rose-100 border border-rose-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-purple-500 text-xs font-semibold text-white">
                    2
                  </div>
                  <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-purple-100 text-purple-600">
                    <span className="text-lg">😊</span>
                  </div>
                </div>
                <h3 className="text-sm font-semibold text-slate-900 mb-2">
                  Choose check-in method
                </h3>
                <p className="text-xs sm:text-sm text-slate-500">
                  Enable face recognition, mobile GPS, or web check-in. Multiple
                  verification methods for maximum flexibility.
                </p>
              </div>

              {/* Card 3 */}
              <div className="rounded-3xl bg-gradient-to-b from-emerald-50 to-emerald-100 p-6 shadow-sm shadow-emerald-100 border border-emerald-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-xs font-semibold text-white">
                    3
                  </div>
                  <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                    <span className="text-lg">📈</span>
                  </div>
                </div>
                <h3 className="text-sm font-semibold text-slate-900 mb-2">
                  Get real-time insights
                </h3>
                <p className="text-xs sm:text-sm text-slate-500">
                  Access live dashboards, automated alerts, and comprehensive
                  reports. Make data-driven decisions instantly.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* COMPREHENSIVE SUITE */}
        <section className="bg-slate-50">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-center">
            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 mb-3">
              Comprehensive Tracking Suite
            </h2>
            <p className="text-sm sm:text-base text-slate-500 max-w-xl mx-auto">
              Everything you need to manage your workforce efficiently.
            </p>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-slate-950 text-slate-300 pt-10 pb-6">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 md:grid-cols-4 mb-8">
            {/* Brand column */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500 text-white text-lg font-bold">
                  S
                </div>
                <span className="text-sm font-semibold text-white">
                  SmartAttend
                </span>
              </div>
              <p className="text-xs text-slate-400 max-w-xs">
                The all-in-one workforce management platform for modern teams.
              </p>

              <div className="mt-4 flex gap-3 text-slate-400">
                <button className="h-8 w-8 rounded-full bg-slate-900 flex items-center justify-center text-xs hover:text-white hover:bg-slate-800">
                  X
                </button>
                <button className="h-8 w-8 rounded-full bg-slate-900 flex items-center justify-center text-xs hover:text-white hover:bg-slate-800">
                  in
                </button>
                <button className="h-8 w-8 rounded-full bg-slate-900 flex items-center justify-center text-xs hover:text-white hover:bg-slate-800">
                  f
                </button>
              </div>
            </div>

            {/* Product */}
            <div className="text-xs space-y-2">
              <h4 className="text-slate-200 font-semibold mb-1">Product</h4>
              <p className="cursor-pointer text-slate-400 hover:text-white">
                Features
              </p>
              <p className="cursor-pointer text-slate-400 hover:text-white">
                Pricing
              </p>
              <p className="cursor-pointer text-slate-400 hover:text-white">
                Security
              </p>
              <p className="cursor-pointer text-slate-400 hover:text-white">
                Integrations
              </p>
            </div>

            {/* Company */}
            <div className="text-xs space-y-2">
              <h4 className="text-slate-200 font-semibold mb-1">Company</h4>
              <p className="cursor-pointer text-slate-400 hover:text-white">
                About Us
              </p>
              <p className="cursor-pointer text-slate-400 hover:text-white">
                Careers
              </p>
              <p className="cursor-pointer text-slate-400 hover:text-white">
                Blog
              </p>
              <p className="cursor-pointer text-slate-400 hover:text-white">
                Press Kit
              </p>
            </div>

            {/* Support */}
            <div className="text-xs space-y-2">
              <h4 className="text-slate-200 font-semibold mb-1">Support</h4>
              <p className="cursor-pointer text-slate-400 hover:text-white">
                Help Center
              </p>
              <p className="cursor-pointer text-slate-400 hover:text-white">
                Contact Us
              </p>
              <p className="cursor-pointer text-slate-400 hover:text-white">
                Privacy Policy
              </p>
              <p className="cursor-pointer text-slate-400 hover:text-white">
                Terms of Service
              </p>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
            <p>© 2024 SmartAttend. All rights reserved.</p>
            <p>
              Made with <span className="text-pink-400">♥</span> for smart
              teams.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

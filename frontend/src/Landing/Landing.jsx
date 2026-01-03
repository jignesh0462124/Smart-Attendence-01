import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Menu,
  X,
  Users,
  MapPin,
  BarChart3,
  ShieldCheck,
  Smartphone,
  Clock,
  ArrowRight
} from "lucide-react";

// Placeholder for your image - ensure this path is correct
import heroImage from "./img/img1.png";

// --- Components ---

const SectionHeader = ({ title, subtitle, center = true }) => (
  <div className={`mb-16 ${center ? "text-center" : "text-left"}`}>
    <motion.h2
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight"
    >
      {title}
    </motion.h2>
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.1 }}
      className="mt-6 text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed"
    >
      {subtitle}
    </motion.p>
  </div>
);

const FeatureCard = ({ icon: Icon, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay }}
    className="group relative p-8 bg-white rounded-3xl border border-slate-100 shadow-lg hover:shadow-2xl transition-all duration-300"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity" />
    <div className="relative z-10">
      <div className="w-14 h-14 rounded-2xl bg-blue-600/5 flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
        <Icon size={28} />
      </div>
      <h3 className="text-2xl font-bold text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-600 leading-relaxed text-base">{description}</p>
    </div>
  </motion.div>
);

export default function Landing() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Background pattern for visual texture
  const bgPattern = {
    backgroundImage: `radial-gradient(#cbd5e1 1px, transparent 1px)`,
    backgroundSize: '40px 40px',
  };

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-blue-600 selection:text-white overflow-x-hidden">

      {/* --- NAVIGATION --- */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/50 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.scrollTo(0, 0)}>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white font-bold shadow-lg shadow-blue-600/20 group-hover:rotate-3 transition-transform">
                S
              </div>
              <span className="text-2xl font-bold tracking-tight text-slate-900">
                SmartAttend
              </span>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-10">
              {['Features', 'How it Works', 'Pricing', 'About'].map((item) => (
                <a key={item} href={`#${item.toLowerCase().replace(/\s/g, '-')}`} className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">
                  {item}
                </a>
              ))}
            </nav>

            {/* CTA Button */}
            <div className="hidden md:flex items-center gap-4">
              <a href="/login" className="text-sm font-semibold text-slate-600 hover:text-slate-900">Sign In</a>
              <button
                onClick={() => window.location.href = "/signup"}
                className="rounded-full bg-slate-900 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-slate-900/20 hover:bg-blue-600 hover:shadow-blue-600/30 hover:-translate-y-0.5 transition-all duration-300"
              >
                Get Started
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-lg"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-slate-100 bg-white overflow-hidden"
            >
              <div className="space-y-2 px-4 py-6">
                {['Features', 'How it Works', 'Pricing'].map((item) => (
                  <a key={item} href={`#${item.toLowerCase().replace(/\s/g, '-')}`} className="block rounded-xl px-4 py-3 text-lg font-semibold text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors">
                    {item}
                  </a>
                ))}
                <div className="pt-4 mt-4 border-t border-slate-100">
                  <button
                    onClick={() => window.location.href = "/signup"}
                    className="w-full rounded-xl bg-blue-600 px-4 py-3 text-center text-lg font-bold text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all"
                  >
                    Get Started Free
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-1">

        {/* --- HERO SECTION --- */}
        <section className="relative pt-20 pb-32 lg:pt-32 lg:pb-40 overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 -z-10 h-full w-full bg-slate-50/50" style={bgPattern}></div>
          <div className="absolute top-0 right-0 -z-10 translate-x-1/2 -translate-y-1/2 opacity-20 blur-[100px]">
            <div className="h-[800px] w-[800px] rounded-full bg-gradient-to-br from-blue-600 to-purple-600"></div>
          </div>
          <div className="absolute bottom-0 left-0 -z-10 -translate-x-1/2 translate-y-1/2 opacity-20 blur-[100px]">
            <div className="h-[800px] w-[800px] rounded-full bg-gradient-to-tr from-emerald-400 to-blue-400"></div>
          </div>

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-16 lg:gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="max-w-2xl"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-semibold mb-8 animate-fade-in-up">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                New: AI-Powered Roster Formatting
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
                Attendance Tracking, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">Reimagined.</span>
              </h1>

              <p className="mt-8 text-xl text-slate-600 max-w-lg leading-relaxed">
                Eliminate manual errors with geofencing, facial recognition, and real-time analytics. The <span className="font-semibold text-slate-900">smartest way</span> to manage your modern workforce.
              </p>

              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => window.location.href = "/signup"}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-8 py-4 text-base font-bold text-white shadow-xl shadow-blue-600/30 hover:bg-blue-700 hover:scale-105 transition-all duration-300"
                >
                  Start Free Trial <ArrowRight size={20} />
                </button>
                <button className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-base font-bold text-slate-700 border border-slate-200 shadow-sm hover:bg-slate-50 hover:text-slate-900 transition-all duration-300">
                  <Smartphone size={20} className="text-slate-400" /> Download App
                </button>
              </div>

              <div className="mt-12 flex items-center gap-4 text-sm font-medium text-slate-500">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-10 w-10 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-xs overflow-hidden">
                      <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" />
                    </div>
                  ))}
                  <div className="h-10 w-10 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-xs font-bold text-slate-600">
                    +2k
                  </div>
                </div>
                <p>Trusted by <span className="text-slate-900 font-bold">2,000+</span> companies</p>
              </div>
            </motion.div>

            {/* Right Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative mx-auto w-full max-w-lg lg:max-w-none perspective-1000"
            >
              {/* Decorative elements */}
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                className="absolute -top-12 -right-12 z-20 bg-white/90 backdrop-blur-sm p-5 rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-white/50"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 rounded-2xl text-green-600">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">System Status</p>
                    <p className="text-base font-bold text-slate-900">All Systems Active</p>
                  </div>
                </div>
              </motion.div>

              {/* Main Image Container */}
              <div className="relative rounded-[2.5rem] bg-slate-900 p-3 shadow-2xl shadow-blue-900/20 rotate-1 hover:rotate-0 transition-transform duration-700 ease-out-expo">
                <div className="relative rounded-[2rem] overflow-hidden bg-slate-800 aspect-[4/3] border border-slate-700/50 group">
                  <img
                    src={heroImage}
                    alt="Dashboard Preview"
                    className="h-full w-full object-cover opacity-95 group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent"></div>

                  {/* Floating Action Button inside UI */}
                  <div className="absolute bottom-8 right-8 bg-blue-600 p-4 rounded-full text-white shadow-lg shadow-blue-600/40">
                    <Users size={24} />
                  </div>
                </div>
              </div>

              {/* Bottom Badge */}
              <motion.div
                animate={{ y: [0, 15, 0] }}
                transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-10 -left-10 z-20 bg-white/90 backdrop-blur-sm p-6 rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-white/50 w-[260px]"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold text-slate-500">Attendance Rate</span>
                  <span className="text-sm font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-full">+12.5%</span>
                </div>
                <div className="flex items-end gap-2 h-16 justify-between">
                  {[40, 65, 50, 85, 60, 95].map((h, i) => (
                    <div key={i} className="w-full bg-slate-100 rounded-t-lg relative group overflow-hidden">
                      <motion.div
                        initial={{ height: 0 }}
                        whileInView={{ height: `${h}%` }}
                        transition={{ duration: 1, delay: 0.5 + (i * 0.1) }}
                        className="absolute bottom-0 w-full bg-blue-500 group-hover:bg-blue-600 transition-colors"
                      ></motion.div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* --- FEATURES GRID --- */}
        <section id="features" className="py-24 lg:py-32 bg-white relative">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeader
              title="Everything to Run Your Team"
              subtitle="Replace spreadsheets and biometric hardware with a single, modern platform designed for speed and accuracy."
            />

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard
                icon={MapPin}
                title="Smart Geofencing"
                description="Define work zones on a customized map. Employees can only check in when they are physically at the location."
                delay={0.1}
              />
              <FeatureCard
                icon={Smartphone}
                title="Face Recognition"
                description="Touchless, fraud-proof attendance using AI-powered face verification on any mobile device."
                delay={0.2}
              />
              <FeatureCard
                icon={BarChart3}
                title="Real-time Analytics"
                description="Visualize late arrivals, overtime, and absenteeism with beautiful, interactive dashboards."
                delay={0.3}
              />
              <FeatureCard
                icon={Clock}
                title="Shift Management"
                description="Create complex rotating shifts and assign them to departments with an intuitive drag-and-drop interface."
                delay={0.4}
              />
              <FeatureCard
                icon={ShieldCheck}
                title="Device Validation"
                description="Restrict check-ins to specific company devices or IP addresses for maximum security compliance."
                delay={0.5}
              />
              <FeatureCard
                icon={Users}
                title="Leave Handling"
                description="Automated leave requests, approvals, and balance tracking tailored to your company's specific policies."
                delay={0.6}
              />
            </div>
          </div>
        </section>

        {/* --- SOCIAL PROOF / CTA --- */}
        <section className="py-24 bg-slate-900 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20">
            <div className="absolute top-[-50%] left-[-20%] w-[800px] h-[800px] rounded-full bg-blue-600 blur-[150px]"></div>
            <div className="absolute bottom-[-50%] right-[-20%] w-[800px] h-[800px] rounded-full bg-indigo-600 blur-[150px]"></div>
          </div>

          <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-8">
              Ready to modernize your workforce?
            </h2>
            <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto">
              Join thousands of forward-thinking companies saving time and boosting productivity with SmartAttend.
            </p>
            <button
              onClick={() => window.location.href = "/signup"}
              className="bg-white text-slate-900 rounded-full px-10 py-4 text-lg font-bold shadow-2xl hover:bg-blue-50 hover:scale-105 transition-all duration-300"
            >
              Get Started Now
            </button>
            <p className="mt-6 text-sm text-slate-400">No credit card required • 14-day free trial</p>
          </div>
        </section>

      </main>

      {/* --- FOOTER --- */}
      <footer className="bg-slate-50 border-t border-slate-200 pt-20 pb-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-16">
            <div className="col-span-2 lg:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white font-bold text-xl">S</div>
                <span className="text-2xl font-bold text-slate-900">SmartAttend</span>
              </div>
              <p className="text-slate-500 text-base leading-relaxed max-w-xs">
                The next generation of workforce management. Precision tracking, automated insights, and seamless integration for modern teams.
              </p>
              <div className="mt-6 flex gap-4">
                {/* Social Icons Placeholder */}
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-10 w-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-600 cursor-pointer transition-all">
                    <div className="w-4 h-4 bg-current rounded-sm"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Links */}
            <div>
              <h4 className="font-bold text-slate-900 mb-6 text-lg">Product</h4>
              <ul className="space-y-4 text-slate-600">
                <li><a href="#" className="hover:text-blue-600 transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">API</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Integrations</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-6 text-lg">Company</h4>
              <ul className="space-y-4 text-slate-600">
                <li><a href="#" className="hover:text-blue-600 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-6 text-lg">Legal</h4>
              <ul className="space-y-4 text-slate-600">
                <li><a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Security</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500">© 2025 SmartAttend Inc. All rights reserved.</p>
            <div className="flex gap-8 text-slate-500 font-medium">
              <a href="#" className="hover:text-slate-900">Privacy</a>
              <a href="#" className="hover:text-slate-900">Terms</a>
              <a href="#" className="hover:text-slate-900">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
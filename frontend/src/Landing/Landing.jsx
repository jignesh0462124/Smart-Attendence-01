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
  <div className={`mb-12 ${center ? "text-center" : "text-left"}`}>
    <motion.h2 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight"
    >
      {title}
    </motion.h2>
    <motion.p 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.1 }}
      className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto"
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
    className="group relative p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity" />
    <div className="relative z-10">
      <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
        <Icon size={24} />
      </div>
      <h3 className="text-xl font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{description}</p>
    </div>
  </motion.div>
);

export default function Landing() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Background pattern for visual texture
  const bgPattern = {
    backgroundImage: `radial-gradient(#cbd5e1 1px, transparent 1px)`,
    backgroundSize: '32px 32px',
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100 selection:text-blue-900">
      
      {/* --- NAVIGATION --- */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo(0,0)}>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-bold shadow-lg shadow-blue-600/20">
                S
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">
                SmartAttend
              </span>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {['Features', 'How it Works', 'Pricing', 'About'].map((item) => (
                <a key={item} href={`#${item.toLowerCase().replace(/\s/g, '-')}`} className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
                  {item}
                </a>
              ))}
            </nav>

            {/* CTA Button */}
            <div className="hidden md:flex items-center gap-4">
              <a href="/signup" className="text-sm font-medium text-slate-600 hover:text-slate-900"></a>
              <button 
                onClick={() => window.location.href = "/signup"}
                className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 hover:bg-slate-800 hover:-translate-y-0.5 transition-all"
              >
                Get Started
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden p-2 text-slate-600"
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
              className="md:hidden border-t border-slate-100 bg-white"
            >
              <div className="space-y-1 px-4 py-4">
                {['Features', 'How it Works', 'Pricing', 'Login'].map((item) => (
                  <a key={item} href="#" className="block rounded-lg px-3 py-2 text-base font-semibold text-slate-600 hover:bg-slate-50 hover:text-blue-600">
                    {item}
                  </a>
                ))}
                <button className="mt-4 w-full rounded-lg bg-blue-600 px-3 py-2 text-center text-base font-semibold text-white">
                  Get Started
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-1 overflow-hidden">
        
        {/* --- HERO SECTION --- */}
        <section className="relative pt-12 pb-20 lg:pt-24 lg:pb-32 overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 -z-10 h-full w-full bg-slate-50" style={bgPattern}></div>
          <div className="absolute top-0 right-0 -z-10 translate-x-1/3 -translate-y-1/4 opacity-30 blur-3xl">
            <div className="h-[600px] w-[600px] rounded-full bg-blue-400"></div>
          </div>
          <div className="absolute bottom-0 left-0 -z-10 -translate-x-1/3 translate-y-1/4 opacity-30 blur-3xl">
            <div className="h-[600px] w-[600px] rounded-full bg-yellow-200"></div>
          </div>

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            {/* Left Content */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                Attendance Tracking, <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Reimagined.</span>
              </h1>

              <p className="mt-6 text-lg text-slate-600 max-w-lg leading-relaxed">
                Eliminate manual errors with geofencing, facial recognition, and real-time analytics. The smartest way to manage your modern workforce.
              </p>
            </motion.div>

            {/* Right Visual */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative mx-auto w-full max-w-lg lg:max-w-none"
            >
              {/* Decorative elements */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="absolute -top-12 -right-8 z-20 bg-white p-4 rounded-2xl shadow-xl border border-slate-100"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg text-green-600">
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Status</p>
                    <p className="text-sm font-bold text-slate-900">All Systems Active</p>
                  </div>
                </div>
              </motion.div>

              {/* Main Image Container */}
              <div className="relative rounded-3xl bg-slate-900 p-2 shadow-2xl shadow-blue-900/20">
                <div className="relative rounded-2xl overflow-hidden bg-slate-800 aspect-[4/3] border border-slate-700/50">
                  <img 
                    src={heroImage} 
                    alt="Dashboard Preview" 
                    className="h-full w-full object-cover opacity-90 hover:opacity-100 transition-opacity"
                  />
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                </div>
              </div>

              {/* Bottom Badge */}
              <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-6 -left-6 z-20 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 max-w-[200px]"
              >
                 <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-500">Attendance</span>
                    <span className="text-xs font-bold text-green-500">+12%</span>
                 </div>
                 <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full w-[85%] bg-blue-500 rounded-full"></div>
                 </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* --- LOGO CLOUD --- */}
        {/* --- FEATURES GRID --- */}
        <section id="features" className="py-20 lg:py-32 bg-slate-50 relative">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeader 
              title="Everything you need to run your team" 
              subtitle="Replace your spreadsheets and biometric hardware with a single, modern platform."
            />

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard 
                icon={MapPin}
                title="Smart Geofencing"
                description="Define work zones on a map. Employees can only check in when they are physically at the location."
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
                title="Real-time Insights"
                description="Visualize late arrivals, overtime, and absenteeism with beautiful, interactive dashboards."
                delay={0.3}
              />
              <FeatureCard 
                icon={Clock}
                title="Shift Management"
                description="Create complex rotating shifts and assign them to departments with a drag-and-drop interface."
                delay={0.4}
              />
              <FeatureCard 
                icon={ShieldCheck}
                title="Device Lock"
                description="Restrict check-ins to specific company devices or IP addresses for maximum security."
                delay={0.5}
              />
              <FeatureCard 
                icon={Users}
                title="Leave Management"
                description="Automated leave requests and approvals tailored to your company's specific policies."
                delay={0.6}
              />
            </div>
          </div>
        </section>
      </main>

      {/* --- FOOTER --- */}
      <footer className="bg-white border-t border-slate-200 pt-16 pb-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2 lg:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-bold">S</div>
                <span className="text-xl font-bold text-slate-900">SmartAttend</span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
                The next generation of workforce management. Precision tracking, automated insights, and seamless integration.
              </p>
            </div>
            
            {/* Footer Links */}
            <div>
              <h4 className="font-bold text-slate-900 mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><a href="#" className="hover:text-blue-600">Features</a></li>
                <li><a href="#" className="hover:text-blue-600">Pricing</a></li>
                <li><a href="#" className="hover:text-blue-600">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><a href="#" className="hover:text-blue-600">About</a></li>
                <li><a href="#" className="hover:text-blue-600">Blog</a></li>
                <li><a href="#" className="hover:text-blue-600">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><a href="#" className="hover:text-blue-600">Privacy</a></li>
                <li><a href="#" className="hover:text-blue-600">Terms</a></li>
                <li><a href="#" className="hover:text-blue-600">Security</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-100 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-500">© 2025 SmartAttend Inc. All rights reserved.</p>
            <div className="flex gap-4">
              {/* Social placeholders */}
              <div className="h-5 w-5 bg-slate-200 rounded-full hover:bg-slate-300 cursor-pointer"></div>
              <div className="h-5 w-5 bg-slate-200 rounded-full hover:bg-slate-300 cursor-pointer"></div>
              <div className="h-5 w-5 bg-slate-200 rounded-full hover:bg-slate-300 cursor-pointer"></div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
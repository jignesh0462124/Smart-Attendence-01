import React, { useRef, useState } from "react";
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
  ArrowRight,
  Mouse
} from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

// Placeholder for your image - ensure this path is correct
import heroImage from "./img/img1.png";

gsap.registerPlugin(ScrollTrigger);

// --- Components ---

const SectionHeader = ({ title, subtitle, center = true }) => (
  <div className={`section-header mb-20 ${center ? "text-center" : "text-left"}`}>
    <h2 className="section-title text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight opacity-0 translate-y-10">
      {title}
    </h2>
    <p className="section-subtitle mt-6 text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed opacity-0 translate-y-10">
      {subtitle}
    </p>
  </div>
);

const FeatureCard = ({ icon: Icon, title, description, index }) => (
  <div className="feature-card group relative p-8 bg-white/80 backdrop-blur-sm rounded-[2rem] border border-white/50 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 opacity-0 translate-y-20">
    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 to-transparent opacity-0 group-hover:opacity-100 rounded-[2rem] transition-opacity duration-500" />
    <div className="relative z-10">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-sm">
        <Icon size={32} />
      </div>
      <h3 className="text-2xl font-bold text-slate-900 mb-4">{title}</h3>
      <p className="text-slate-600 leading-relaxed text-lg">{description}</p>
    </div>
  </div>
);

export default function Landing() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const container = useRef();

  // GSAP Animations
  useGSAP(() => {
    // Hero Animations
    const tl = gsap.timeline();

    tl.from(".hero-badge", {
      y: -30,
      opacity: 0,
      duration: 1,
      ease: "power3.out"
    })
      .from(".hero-title", {
        y: 60,
        opacity: 0,
        duration: 1.2,
        stagger: 0.15,
        ease: "power4.out"
      }, "-=0.6")
      .from(".hero-desc", {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
      }, "-=0.8")
      .from(".hero-btns", {
        y: 30,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
      }, "-=0.8")
      .from(".hero-stats", {
        opacity: 0,
        x: -20,
        duration: 1
      }, "-=0.6");

    // Scroll Down Indicator
    gsap.to(".scroll-indicator", {
      y: 10,
      opacity: 0.5,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut"
    });

    // Hero Image Parallax & Float
    gsap.to(".hero-image-container", {
      y: -30,
      duration: 4,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    // Floating badges - enhanced movement
    gsap.to(".float-badge-1", {
      y: -20,
      x: 10,
      rotation: 3,
      duration: 5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: 0.5
    });

    gsap.to(".float-badge-2", {
      y: 12,
      x: -5,
      rotation: -2,
      duration: 4,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
      delay: 0.2
    });

    // Background Blobs Movement
    gsap.to(".bg-blob-1", {
      x: 100,
      y: 50,
      rotation: 90,
      duration: 20,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    gsap.to(".bg-blob-2", {
      x: -100,
      y: -50,
      rotation: -90,
      duration: 25,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    // Section Header Scroll Trigger
    gsap.utils.toArray('.section-header').forEach(header => {
      gsap.to(header.querySelectorAll('.section-title, .section-subtitle'), {
        scrollTrigger: {
          trigger: header,
          start: "top 85%",
        },
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out"
      });
    });

    // Feature Cards Stagger with 3D effect
    gsap.to(".feature-card", {
      scrollTrigger: {
        trigger: "#features",
        start: "top 75%",
      },
      y: 0,
      opacity: 1,
      duration: 0.8,
      stagger: 0.15,
      ease: "back.out(1.2)"
    });

    // CTA Section Parallax
    gsap.from(".cta-content", {
      scrollTrigger: {
        trigger: ".cta-section",
        start: "top 80%",
      },
      scale: 0.9,
      y: 50,
      opacity: 0,
      duration: 1.2,
      ease: "power3.out"
    });

  }, { scope: container });

  return (
    <div ref={container} className="min-h-screen bg-slate-50 font-sans selection:bg-blue-600 selection:text-white overflow-x-hidden">

      {/* Background Blobs (Global) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="bg-blob-1 absolute top-[-10%] left-[-10%] w-[800px] h-[800px] rounded-full bg-blue-100/40 blur-[100px] mix-blend-multiply"></div>
        <div className="bg-blob-2 absolute bottom-[-10%] right-[-10%] w-[800px] h-[800px] rounded-full bg-purple-100/40 blur-[100px] mix-blend-multiply"></div>
      </div>

      {/* --- NAVIGATION --- */}
      <header className="fixed top-0 z-50 w-full border-b border-white/20 bg-white/60 backdrop-blur-xl transition-all duration-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.scrollTo(0, 0)}>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold shadow-lg shadow-blue-600/20 group-hover:scale-105 transition-transform">
                S
              </div>
              <span className="text-2xl font-bold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                SmartAttend
              </span>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-10">
              {['Features', 'How it Works', 'Pricing', 'About'].map((item) => (
                <a key={item} href={`#${item.toLowerCase().replace(/\s/g, '-')}`} className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors relative group">
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                </a>
              ))}
            </nav>

            {/* CTA Button */}
            <div className="hidden md:flex items-center gap-4">
              <a href="/signup" className="text-sm font-semibold text-slate-600 hover:text-slate-900">Sign In</a>
              <button
                onClick={() => window.location.href = "/signup"}
                className="rounded-full bg-slate-900 px-7 py-3 text-sm font-bold text-white shadow-xl shadow-slate-900/10 hover:bg-blue-600 hover:shadow-blue-600/30 hover:-translate-y-0.5 transition-all duration-300"
              >
                Get Started
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div
            className="md:hidden border-t border-slate-100 bg-white/90 backdrop-blur-xl overflow-hidden shadow-2xl animate-in slide-in-from-top-5 duration-300"
          >
            <div className="space-y-2 px-4 py-6">
              {['Features', 'How it Works', 'Pricing'].map((item) => (
                <a key={item} href={`#${item.toLowerCase().replace(/\s/g, '-')}`} className="block rounded-xl px-4 py-3 text-lg font-semibold text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors">
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
          </div>
        )}
      </header>

      <main className="flex-1">

        {/* --- HERO SECTION --- */}
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden min-h-[90vh] flex items-center">

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-16 lg:gap-12 items-center w-full">
            {/* Left Content */}
            <div className="max-w-2xl relative z-10">
              <div className="hero-badge inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-blue-100 text-blue-700 text-sm font-semibold mb-8 shadow-sm">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
                </span>
                New: AI-Powered Roster Formatting
              </div>

              <h1 className="hero-title text-6xl sm:text-7xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.05] mb-2">
                Attendance,
              </h1>
              <h1 className="hero-title text-6xl sm:text-7xl lg:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 tracking-tight leading-[1.05] pb-2">
                Reimagined.
              </h1>

              <p className="hero-desc mt-8 text-xl text-slate-600 max-w-lg leading-relaxed font-medium">
                Eliminate manual errors with geofencing, facial recognition, and real-time analytics. The <span className="font-bold text-slate-900 underline decoration-blue-300 decoration-4 underline-offset-2">smartest way</span> to manage your workforce.
              </p>

              <div className="hero-btns mt-10 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => window.location.href = "/signup"}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-8 py-4 text-lg font-bold text-white shadow-xl shadow-blue-600/30 hover:bg-blue-700 hover:scale-105 hover:shadow-2xl hover:shadow-blue-600/40 transition-all duration-300"
                >
                  Start Free Trial <ArrowRight size={20} strokeWidth={2.5} />
                </button>
                <button className="inline-flex items-center justify-center gap-2 rounded-full bg-white/80 backdrop-blur-sm px-8 py-4 text-lg font-bold text-slate-700 border border-slate-200 shadow-lg shadow-slate-200/50 hover:bg-white hover:text-blue-600 hover:border-blue-200 transition-all duration-300">
                  <Smartphone size={20} strokeWidth={2.5} /> Download App
                </button>
              </div>

              <div className="hero-stats mt-14 flex items-center gap-5">
                <div className="flex -space-x-4">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-12 w-12 rounded-full bg-slate-200 border-[3px] border-white flex items-center justify-center text-xs overflow-hidden shadow-md">
                      <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" className="h-full w-full object-cover" />
                    </div>
                  ))}
                  <div className="h-12 w-12 rounded-full bg-slate-100 border-[3px] border-white flex items-center justify-center text-xs font-bold text-slate-600 shadow-md">
                    +2k
                  </div>
                </div>
                <div>
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map(i => <span key={i} className="text-yellow-400">★</span>)}
                  </div>
                  <p className="text-sm font-semibold text-slate-600">Trusted by <span className="text-slate-900 font-bold">2,000+</span> companies</p>
                </div>
              </div>
            </div>

            {/* Right Visual */}
            <div className="hero-image-container relative mx-auto w-full max-w-lg lg:max-w-none perspective-1000">
              {/* Decorative elements */}
              <div
                className="float-badge-1 absolute -top-12 -right-8 z-20 bg-white/90 backdrop-blur-md p-5 rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] border border-white/60"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 rounded-2xl text-green-600 shadow-sm">
                    <CheckCircle2 size={24} strokeWidth={3} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">System Status</p>
                    <p className="text-base font-bold text-slate-900">All Active</p>
                  </div>
                </div>
              </div>

              {/* Main Image Container */}
              <div className="group relative rounded-[2.5rem] bg-gradient-to-br from-slate-800 to-slate-900 p-3 shadow-2xl shadow-blue-900/30 transition-transform duration-700">
                <div className="relative rounded-[2rem] overflow-hidden bg-slate-800 aspect-[4/3] border border-slate-700/50">
                  <img
                    src={heroImage}
                    alt="Dashboard Preview"
                    className="h-full w-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-1000 ease-out"
                  />
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>

                  {/* Floating Action Button inside UI */}
                  <div className="absolute bottom-8 right-8 bg-blue-600 p-4 rounded-full text-white shadow-lg shadow-blue-600/40 hover:scale-110 hover:shadow-blue-600/60 transition-all cursor-pointer">
                    <Users size={24} />
                  </div>
                </div>
              </div>

              {/* Bottom Badge */}
              <div
                className="float-badge-2 absolute -bottom-12 -left-8 z-20 bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] border border-white/60 w-[280px]"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="text-blue-600" size={18} />
                    <span className="text-sm font-bold text-slate-700">Attendance Rate</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">+12.5%</span>
                </div>
                <div className="flex items-end gap-2 h-16 justify-between">
                  {[40, 65, 50, 85, 60, 95].map((h, i) => (
                    <div key={i} className="w-full bg-slate-100 rounded-t-lg relative group overflow-hidden">
                      <div
                        style={{ height: `${h}%` }}
                        className="absolute bottom-0 w-full bg-gradient-to-t from-blue-600 to-indigo-500 group-hover:from-blue-500 group-hover:to-indigo-400 transition-colors rounded-t-sm"
                      ></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="scroll-indicator absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
            <Mouse className="text-slate-400 w-6 h-6" />
            <div className="w-1 h-8 rounded-full bg-gradient-to-b from-slate-400 to-transparent"></div>
          </div>

        </section>

        {/* --- FEATURES GRID --- */}
        <section id="features" className="py-24 lg:py-32 bg-white/50 backdrop-blur-sm relative border-t border-slate-100">
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
                index={0}
              />
              <FeatureCard
                icon={Smartphone}
                title="Face Recognition"
                description="Touchless, fraud-proof attendance using AI-powered face verification on any mobile device."
                index={1}
              />
              <FeatureCard
                icon={BarChart3}
                title="Real-time Analytics"
                description="Visualize late arrivals, overtime, and absenteeism with beautiful, interactive dashboards."
                index={2}
              />
              <FeatureCard
                icon={Clock}
                title="Shift Management"
                description="Create complex rotating shifts and assign them to departments with an intuitive drag-and-drop interface."
                index={3}
              />
              <FeatureCard
                icon={ShieldCheck}
                title="Device Validation"
                description="Restrict check-ins to specific company devices or IP addresses for maximum security compliance."
                index={4}
              />
              <FeatureCard
                icon={Users}
                title="Leave Handling"
                description="Automated leave requests, approvals, and balance tracking tailored to your company's specific policies."
                index={5}
              />
            </div>
          </div>
        </section>

        {/* --- SOCIAL PROOF / CTA --- */}
        <section className="cta-section py-32 bg-slate-900 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-30 pointer-events-none">
            <div className="absolute top-[-50%] left-[-20%] w-[1000px] h-[1000px] rounded-full bg-blue-600 blur-[150px] animate-pulse"></div>
            <div className="absolute bottom-[-50%] right-[-20%] w-[1000px] h-[1000px] rounded-full bg-indigo-600 blur-[150px] animate-pulse" style={{ animationDelay: "2s" }}></div>
          </div>

          <div className="cta-content relative z-10 mx-auto max-w-4xl px-4 text-center">
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight mb-8">
              Ready for the future?
            </h2>
            <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto font-medium">
              Join thousands of forward-thinking companies saving time and boosting productivity with SmartAttend.
            </p>
            <button
              onClick={() => window.location.href = "/signup"}
              className="bg-white text-slate-900 rounded-full px-12 py-5 text-xl font-bold shadow-2xl hover:bg-blue-50 hover:scale-105 transition-all duration-300"
            >
              Get Started Now
            </button>
            <p className="mt-8 text-sm text-slate-400 font-medium tracking-wide uppercase opacity-70">No credit card required • 14-day free trial</p>
          </div>
        </section>

      </main>

    </div>
  );
}
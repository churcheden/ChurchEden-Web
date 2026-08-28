import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Settings as SettingsIcon,
  CheckCircle2,
  Users,
  Calendar,
  CalendarCheck,
  Heart,
  Layers,
  BarChart3,
  Search,
  Bell,
  ChevronDown,
  TrendingUp,
  X,
  Church,
  Waves,
  Sparkles,
  Cross,
  SunMedium,
} from "lucide-react";
import { LandingNav } from "../landing/landing-nav";
import churchedenFavicon from "@/assets/churcheden_favicon.png";

const DEMO_VIDEO_URL =
  "https://res.cloudinary.com/dskyck9yz/video/upload/v1787880561/ChurchEden_brand_animation_guide__202608272254.mp4";

// ─── Church Trust Logos ────────────────────────────────────────────────────────
function GraceChapelLogo() {
  return (
    <div className="flex items-center gap-2 text-slate-500 opacity-80 hover:opacity-100 transition-opacity">
      <Church size={22} className="stroke-[1.5]" />
      <span className="font-serif text-[15px] font-semibold tracking-tight text-slate-700">
        Grace Chapel
      </span>
    </div>
  );
}

function RiverOfLifeLogo() {
  return (
    <div className="flex items-center gap-2 text-slate-500 opacity-80 hover:opacity-100 transition-opacity">
      <Waves size={22} className="stroke-[1.5]" />
      <div className="flex flex-col text-left">
        <span className="text-[11px] font-extrabold uppercase tracking-widest leading-tight text-slate-800">
          River of Life
        </span>
        <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">
          Church
        </span>
      </div>
    </div>
  );
}

function NewHopeLogo() {
  return (
    <div className="flex items-center gap-2 text-slate-500 opacity-80 hover:opacity-100 transition-opacity">
      <Sparkles size={20} className="stroke-[1.5]" />
      <div className="flex flex-col text-left">
        <span className="font-serif text-[13.5px] font-semibold text-slate-800 leading-tight">
          New Hope
        </span>
        <span className="text-[9.5px] font-medium text-slate-500">
          Fellowship
        </span>
      </div>
    </div>
  );
}

function TrinityBibleLogo() {
  return (
    <div className="flex items-center gap-2 text-slate-500 opacity-80 hover:opacity-100 transition-opacity">
      <Cross size={20} className="stroke-[1.5]" />
      <div className="flex flex-col text-left">
        <span className="text-[11.5px] font-extrabold uppercase tracking-wider text-slate-800 leading-tight">
          Trinity
        </span>
        <span className="text-[8.5px] font-bold uppercase tracking-widest text-slate-500">
          Bible Church
        </span>
      </div>
    </div>
  );
}

function LighthouseLogo() {
  return (
    <div className="flex items-center gap-2 text-slate-500 opacity-80 hover:opacity-100 transition-opacity">
      <SunMedium size={22} className="stroke-[1.5]" />
      <div className="flex flex-col text-left">
        <span className="text-[11.5px] font-extrabold uppercase tracking-wider text-slate-800 leading-tight">
          Lighthouse
        </span>
        <span className="text-[8.5px] font-bold uppercase tracking-widest text-slate-500">
          Church
        </span>
      </div>
    </div>
  );
}

// ─── Feature Cards Data ────────────────────────────────────────────────────────
const FEATURE_CARDS = [
  {
    icon: Users,
    title: "Member\nManagement",
    description:
      "Add members, organize families, and keep contact information up to date.",
  },
  {
    icon: CalendarCheck,
    title: "Attendance\nTracking",
    description:
      "Record attendance quickly and view powerful insights.",
  },
  {
    icon: Heart,
    title: "Giving &\nDonations",
    description:
      "Accept donations, track giving history, and generate reports.",
  },
  {
    icon: Calendar,
    title: "Events &\nRegistrations",
    description:
      "Create events, manage registrations, and communicate easily.",
  },
  {
    icon: Layers,
    title: "Groups &\nMinistries",
    description:
      "Organize ministries, assign leaders, and track involvement.",
  },
  {
    icon: BarChart3,
    title: "Reports &\nInsights",
    description:
      "View real-time reports and make data-driven decisions.",
  },
];

export function DemoPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlayClick = () => {
    setShowVideoModal(true);
    setIsPlaying(true);
  };

  return (
    <div className="min-h-screen w-full bg-[#F8F6F1] font-eden text-[#162033] antialiased">
      {/* 1. TOP NAVIGATION */}
      <LandingNav />

      {/* 2. HERO SECTION */}
      <section className="mx-auto max-w-[1360px] px-6 sm:px-8 lg:px-12 pt-10 pb-16 lg:pt-16 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* LEFT COLUMN */}
          <div className="lg:col-span-5 flex flex-col items-start">
            {/* Pill Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#C98A16]/30 bg-[#FFF9EC] px-3.5 py-1.5 text-[11.5px] font-bold uppercase tracking-[0.08em] text-[#C98A16] shadow-sm"
            >
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#C98A16] text-white">
                <Play size={8} className="fill-white translate-x-[0.5px]" />
              </span>
              WATCH PRODUCT DEMO
            </motion.div>

            {/* Large Elegant Serif Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.05 }}
              className="mb-6 font-serif text-4xl sm:text-5xl lg:text-[3.75rem] font-semibold leading-[1.12] tracking-tight text-[#07182F]"
              style={{ fontFamily: "'Fraunces', 'Playfair Display', Georgia, serif" }}
            >
              See ChurchEden<br />
              in action<span className="text-[#C98A16]">.</span>
            </motion.h1>

            {/* Supporting Text */}
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="mb-8 text-base sm:text-lg leading-relaxed text-[#647082] max-w-[460px]"
            >
              Watch how ChurchEden helps churches manage members, attendance,
              donations, events, and ministries — all in one simple platform.
            </motion.p>

            {/* Three Simple Benefit Rows */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.15 }}
              className="flex flex-col gap-3.5"
            >
              <div className="flex items-center gap-3">
                <CheckCircle2 size={19} className="text-[#C98A16] stroke-[2]" />
                <span className="text-[15px] font-medium text-[#162033]">
                  12 min demo
                </span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 size={19} className="text-[#C98A16] stroke-[2]" />
                <span className="text-[15px] font-medium text-[#162033]">
                  No sign up
                </span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 size={19} className="text-[#C98A16] stroke-[2]" />
                <span className="text-[15px] font-medium text-[#162033]">
                  See real workflows
                </span>
              </div>
            </motion.div>
          </div>

          {/* RIGHT COLUMN — REALISTIC DEMO DASHBOARD / VIDEO PREVIEW */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="relative overflow-hidden rounded-[22px] bg-white border border-[#0F1E32]/10 shadow-2xl"
              style={{
                boxShadow: "0 25px 60px -15px rgba(7, 24, 47, 0.16)",
              }}
            >
              {/* Dashboard Layout Container */}
              <div className="grid grid-cols-12 min-h-[380px] sm:min-h-[420px]">
                
                {/* Dark Navy Sidebar */}
                <div className="col-span-3 bg-[#07182F] p-3.5 sm:p-4 text-white flex flex-col justify-between">
                  <div>
                    {/* Logo Lockup */}
                    <div className="flex items-center gap-2 mb-5 px-1 pt-1">
                      <img
                        src={churchedenFavicon}
                        alt="ChurchEden"
                        className="h-5 w-5 object-contain"
                      />
                      <span className="font-eden text-xs font-bold tracking-tight text-white hidden sm:inline">
                        ChurchEden
                      </span>
                    </div>

                    {/* Navigation Items */}
                    <div className="flex flex-col gap-1 text-[11px] sm:text-[12px]">
                      <div className="rounded-lg bg-[#142947] px-2.5 py-1.5 font-semibold text-white flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#C98A16]" />
                        Dashboard
                      </div>
                      <div className="px-2.5 py-1.5 text-slate-400 hover:text-white flex items-center gap-2">
                        Members
                      </div>
                      <div className="px-2.5 py-1.5 text-slate-400 hover:text-white flex items-center gap-2">
                        Attendance
                      </div>
                      <div className="px-2.5 py-1.5 text-slate-400 hover:text-white flex items-center gap-2">
                        Donations
                      </div>
                      <div className="px-2.5 py-1.5 text-slate-400 hover:text-white flex items-center gap-2">
                        Events
                      </div>
                      <div className="px-2.5 py-1.5 text-slate-400 hover:text-white flex items-center gap-2">
                        Groups
                      </div>
                      <div className="px-2.5 py-1.5 text-slate-400 hover:text-white flex items-center gap-2">
                        Reports
                      </div>
                      <div className="px-2.5 py-1.5 text-slate-400 hover:text-white flex items-center gap-2">
                        Settings
                      </div>
                    </div>
                  </div>
                </div>

                {/* Main Dashboard Preview Content */}
                <div className="col-span-9 bg-[#FAFAFA] p-4 sm:p-5 flex flex-col justify-between">
                  {/* Top Bar */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                    <h3 className="text-base sm:text-lg font-bold text-[#07182F]">
                      Dashboard
                    </h3>
                    <div className="flex items-center gap-2 sm:gap-3 text-slate-400">
                      <Search size={14} />
                      <Bell size={14} />
                      <div className="h-6 w-6 rounded-full bg-[#C98A16]/20 text-[#C98A16] flex items-center justify-center text-[10px] font-bold">
                        DA
                      </div>
                      <ChevronDown size={12} />
                    </div>
                  </div>

                  {/* 4 Statistics Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 mb-3">
                    <div className="rounded-xl bg-white p-2.5 border border-slate-100 shadow-sm">
                      <span className="text-[10px] font-medium text-slate-400 block mb-0.5">
                        Total Members
                      </span>
                      <span className="text-sm sm:text-base font-extrabold text-[#07182F] block">
                        2,450
                      </span>
                      <span className="text-[9px] font-semibold text-emerald-600 flex items-center gap-0.5 mt-0.5">
                        ↑ 12% <span className="text-slate-400 font-normal">vs last mo</span>
                      </span>
                    </div>

                    <div className="rounded-xl bg-white p-2.5 border border-slate-100 shadow-sm">
                      <span className="text-[10px] font-medium text-slate-400 block mb-0.5">
                        This Week's Attendance
                      </span>
                      <span className="text-sm sm:text-base font-extrabold text-[#07182F] block">
                        1,320
                      </span>
                      <span className="text-[9px] font-semibold text-emerald-600 flex items-center gap-0.5 mt-0.5">
                        ↑ 8% <span className="text-slate-400 font-normal">vs last wk</span>
                      </span>
                    </div>

                    <div className="rounded-xl bg-white p-2.5 border border-slate-100 shadow-sm">
                      <span className="text-[10px] font-medium text-slate-400 block mb-0.5">
                        Total Donations
                      </span>
                      <span className="text-sm sm:text-base font-extrabold text-[#07182F] block">
                        $24,580
                      </span>
                      <span className="text-[9px] font-semibold text-emerald-600 flex items-center gap-0.5 mt-0.5">
                        ↑ 15% <span className="text-slate-400 font-normal">vs last mo</span>
                      </span>
                    </div>

                    <div className="rounded-xl bg-white p-2.5 border border-slate-100 shadow-sm">
                      <span className="text-[10px] font-medium text-slate-400 block mb-0.5">
                        Upcoming Events
                      </span>
                      <span className="text-sm sm:text-base font-extrabold text-[#07182F] block">
                        8
                      </span>
                      <span className="text-[9px] font-semibold text-[#C98A16] block mt-0.5">
                        View all events →
                      </span>
                    </div>
                  </div>

                  {/* Attendance Chart & Recent Activity Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                    {/* Attendance Overview Chart */}
                    <div className="sm:col-span-7 rounded-xl bg-white p-3 border border-slate-100 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-bold text-[#07182F]">
                          Attendance Overview
                        </span>
                        <div className="flex items-center gap-2 text-[9px]">
                          <span className="flex items-center gap-1 text-blue-600 font-medium">
                            <span className="h-1.5 w-1.5 rounded-full bg-blue-600" /> This Month
                          </span>
                          <span className="flex items-center gap-1 text-[#C98A16] font-medium">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#C98A16]" /> Last Month
                          </span>
                        </div>
                      </div>

                      {/* SVG Line Chart */}
                      <svg viewBox="0 0 200 80" className="w-full h-16 sm:h-20">
                        {/* Grid lines */}
                        <line x1="0" y1="20" x2="200" y2="20" stroke="#F1F5F9" strokeWidth="1" />
                        <line x1="0" y1="40" x2="200" y2="40" stroke="#F1F5F9" strokeWidth="1" />
                        <line x1="0" y1="60" x2="200" y2="60" stroke="#F1F5F9" strokeWidth="1" />
                        {/* Blue Line (This Month) */}
                        <polyline
                          fill="none"
                          stroke="#2563EB"
                          strokeWidth="2"
                          strokeLinecap="round"
                          points="10,65 45,55 80,35 115,45 150,22 190,15"
                        />
                        {/* Gold Line (Last Month) */}
                        <polyline
                          fill="none"
                          stroke="#C98A16"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeDasharray="3 3"
                          points="10,72 45,68 80,50 115,58 150,42 190,32"
                        />
                      </svg>
                    </div>

                    {/* Recent Activity Card */}
                    <div className="sm:col-span-5 rounded-xl bg-white p-3 border border-slate-100 shadow-sm flex flex-col justify-between">
                      <span className="text-[11px] font-bold text-[#07182F] mb-1.5 block">
                        Recent Activity
                      </span>
                      <div className="flex flex-col gap-1.5 text-[10px]">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-semibold text-slate-800">New member joined</p>
                            <p className="text-slate-400">Sarah Johnson</p>
                          </div>
                          <span className="text-slate-400 text-[9px]">2h ago</span>
                        </div>
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-semibold text-slate-800">Donation received</p>
                            <p className="text-slate-400">Tithes - $250</p>
                          </div>
                          <span className="text-slate-400 text-[9px]">5h ago</span>
                        </div>
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-semibold text-slate-800">Event created</p>
                            <p className="text-slate-400">Youth Conf 2025</p>
                          </div>
                          <span className="text-slate-400 text-[9px]">1d ago</span>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* CENTER OVERLAY: Play Button */}
              <div
                onClick={handlePlayClick}
                className="absolute inset-0 bg-[#07182F]/10 hover:bg-[#07182F]/20 transition-all flex items-center justify-center cursor-pointer group"
              >
                <motion.div
                  whileHover={{ scale: 1.12 }}
                  whileTap={{ scale: 0.95 }}
                  className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-[#C98A16] text-white flex items-center justify-center shadow-2xl shadow-[#C98A16]/50 group-hover:bg-[#D99A20] transition-colors"
                >
                  <Play size={28} className="fill-white translate-x-1" />
                </motion.div>
              </div>

              {/* BOTTOM VIDEO CONTROL BAR */}
              <div className="absolute bottom-0 left-0 right-0 bg-[#07182F]/90 backdrop-blur-md px-4 py-2.5 text-white flex items-center justify-between text-xs z-10">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handlePlayClick}
                    className="hover:text-[#C98A16] transition-colors"
                  >
                    <Play size={15} className="fill-current" />
                  </button>
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="hover:text-[#C98A16] transition-colors"
                  >
                    {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
                  </button>
                  <span className="text-[11px] font-mono text-slate-300">
                    0:00 / 12:15
                  </span>
                </div>

                <div className="flex items-center gap-3 text-slate-300">
                  <button className="hover:text-white transition-colors">
                    <SettingsIcon size={14} />
                  </button>
                  <button
                    onClick={handlePlayClick}
                    className="hover:text-white transition-colors"
                  >
                    <Maximize2 size={14} />
                  </button>
                </div>
              </div>

            </motion.div>
          </div>

        </div>
      </section>

      {/* 3. TRUST SECTION */}
      <section className="mx-auto max-w-[1320px] px-6 sm:px-8 lg:px-12 pb-16">
        <div className="text-center mb-8">
          <p className="text-sm sm:text-[15px] font-medium text-[#647082]">
            Trusted by churches of all sizes to simplify ministry and make an impact.
          </p>
        </div>

        {/* 5 Monochrome Church Logos */}
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 lg:gap-16">
          <GraceChapelLogo />
          <RiverOfLifeLogo />
          <NewHopeLogo />
          <TrinityBibleLogo />
          <LighthouseLogo />
        </div>
      </section>

      {/* 4. SUBTLE DIVIDER LINE */}
      <div className="mx-auto max-w-[1320px] px-6 sm:px-8 lg:px-12">
        <div className="h-[1px] w-full bg-[#0F1E32]/08" />
      </div>

      {/* 5. "WHAT YOU'LL SEE IN THIS DEMO" SECTION */}
      <section className="mx-auto max-w-[1360px] px-6 sm:px-8 lg:px-12 py-16 lg:py-24">
        {/* Section Heading */}
        <div className="text-center mb-12">
          <h2
            className="font-serif text-3xl sm:text-4xl lg:text-[2.75rem] font-semibold text-[#07182F] tracking-tight mb-3"
            style={{ fontFamily: "'Fraunces', 'Playfair Display', Georgia, serif" }}
          >
            What you’ll see in this demo
          </h2>
          {/* Thin Gold Accent Line */}
          <div className="h-[2.5px] w-12 bg-[#C98A16] rounded-full mx-auto" />
        </div>

        {/* 6 Feature Cards in One Horizontal Row on Desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
          {FEATURE_CARDS.map((card, idx) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: idx * 0.06 }}
              className="rounded-2xl bg-white p-5 sm:p-6 border border-[#0F1E32]/08 shadow-sm flex flex-col items-center text-center transition-all hover:shadow-md hover:-translate-y-1"
            >
              {/* Icon Container with Warm Tint */}
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#FFF9EC] border border-[#C98A16]/20 text-[#C98A16]">
                <card.icon size={22} className="stroke-[1.5]" />
              </div>

              {/* Title with Serif */}
              <h3
                className="font-serif text-[16px] font-bold text-[#07182F] leading-snug whitespace-pre-line mb-2"
                style={{ fontFamily: "'Fraunces', 'Playfair Display', Georgia, serif" }}
              >
                {card.title}
              </h3>

              {/* Description */}
              <p className="text-[12.5px] leading-relaxed text-[#647082]">
                {card.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Interactive Fullscreen Video Modal */}
      <AnimatePresence>
        {showVideoModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
            onClick={() => setShowVideoModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-4xl overflow-hidden rounded-2xl bg-black shadow-2xl border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setShowVideoModal(false)}
                className="absolute top-4 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/90 transition-colors"
              >
                <X size={18} />
              </button>

              <video
                ref={videoRef}
                src={DEMO_VIDEO_URL}
                controls
                autoPlay
                className="w-full h-auto max-h-[80vh] object-contain rounded-2xl"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useBooking } from "@/context/BookingContext";
import Navbar from "@/components/Navbar";
import RoomSection from "@/components/RoomSection";
import BookingModal from "@/components/BookingModal";
import ExtraSections from "@/components/ExtraSections";
import { Calendar, Users, Shield, ArrowDown } from "lucide-react";

export default function GuestHome() {
  const {
    rooms,
    loading,
    selectedRoom,
    setSelectedRoom,
    checkInDate,
    setCheckInDate,
    checkOutDate,
    setCheckOutDate,
    today,
    threeDaysLater
  } = useBooking();

  const handleSearchClick = () => {
    const roomsEl = document.getElementById("rooms");
    if (roomsEl) {
      roomsEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="bg-obsidian text-cream min-h-screen relative font-sans selection:bg-gold/30">
      {/* Premium Navigation Header */}
      <Navbar />

      {/* Hero Section */}
      <section id="hero" className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        {/* Fullscreen Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero.png"
            alt="Luxury Grand Stay Pool at Sunset"
            fill
            priority
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-[#070708]/40 to-[#070708]" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto text-center px-6 mt-16 flex flex-col items-center">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-gold text-xs md:text-sm uppercase tracking-[0.3em] font-semibold mb-4"
          >
            A Sanctuary of Elite Comfort
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
            className="text-4xl md:text-7xl font-serif text-white tracking-wide leading-tight mb-6"
          >
            Experience Luxury <br />
            <span className="gold-text-gradient italic font-light">&amp; Comfort</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.6 }}
            className="text-xs md:text-sm text-[#d0ceca] max-w-xl leading-relaxed mb-12 font-light"
          >
            Escape to an enclave of sophisticated luxury, where private butler services, michelin-star cuisine, and celestial wellness chambers await your arrival.
          </motion.p>

          {/* Quick Search Overlay Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.8 }}
            className="w-full max-w-4xl glass-card p-6 md:p-8 flex flex-col md:grid md:grid-cols-4 gap-4 items-stretch md:items-end text-left shadow-2xl relative"
          >
            {/* Check-In */}
            <div className="flex flex-col gap-2">
              <label className="text-[9px] uppercase tracking-widest text-[#a19f9a] font-semibold flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-gold" /> Check-In
              </label>
              <input
                type="date"
                min={today}
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
                className="bg-[#0f0f12] text-xs border border-slate-800 focus:border-gold py-2.5 px-3 focus:outline-none text-[#fbfaf7] scheme-dark"
              />
            </div>

            {/* Check-Out */}
            <div className="flex flex-col gap-2">
              <label className="text-[9px] uppercase tracking-widest text-[#a19f9a] font-semibold flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-gold" /> Check-Out
              </label>
              <input
                type="date"
                min={checkInDate}
                value={checkOutDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
                className="bg-[#0f0f12] text-xs border border-slate-800 focus:border-gold py-2.5 px-3 focus:outline-none text-[#fbfaf7] scheme-dark"
              />
            </div>

            {/* Guests */}
            <div className="flex flex-col gap-2">
              <label className="text-[9px] uppercase tracking-widest text-[#a19f9a] font-semibold flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-gold" /> Guests
              </label>
              <select className="bg-[#0f0f12] text-xs border border-slate-800 focus:border-gold py-2.5 px-3 focus:outline-none text-[#fbfaf7] cursor-pointer">
                <option>1 Guest</option>
                <option>2 Guests</option>
                <option>3 Guests</option>
                <option>4+ Guests</option>
              </select>
            </div>

            {/* Submit */}
            <button
              onClick={handleSearchClick}
              className="bg-gold hover:bg-[#bfa232] text-[#070708] text-[10px] font-bold uppercase tracking-widest py-3 border border-gold hover:border-[#bfa232] transition-colors cursor-pointer text-center active:scale-95"
            >
              Explore Suites
            </button>
          </motion.div>

          {/* Scroll Down Hint */}
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            onClick={handleSearchClick}
            className="absolute bottom-8 flex flex-col items-center gap-1 text-[8px] uppercase tracking-widest text-[#a19f9a] cursor-pointer"
          >
            <span>Scroll To Explore</span>
            <ArrowDown className="w-3 h-3 text-gold" />
          </motion.div>
        </div>
      </section>

      {/* Safety / Luxury Trust Banner */}
      <section className="py-12 bg-[#0c0c0e] border-y border-slate-900 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-around items-center gap-6 text-center md:text-left">
          {[
            { title: "Safe Stay Guarantee", desc: "Digital check-in, premium medical sanitization protocols." },
            { title: "Best Rate Guaranteed", desc: "Book directly through our website to unlock elite member pricing." },
            { title: "Concierge Assist", desc: "Our private butler team is available 24/7 during your stay." },
          ].map((item, i) => (
            <div key={i} className="flex gap-3 items-start max-w-xs">
              <Shield className="w-5 h-5 text-gold shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs uppercase tracking-widest text-white font-bold mb-1">{item.title}</h4>
                <p className="text-[11px] text-[#a19f9a] leading-relaxed font-light">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Room Section */}
      <RoomSection rooms={rooms} loading={loading} onBookRoom={(room) => setSelectedRoom(room)} />

      {/* Experiences, testimonials, FAQ, contact, footer */}
      <ExtraSections />

      {/* Multi-step Booking wizard Modal */}
      <AnimatePresence>
        {selectedRoom && (
          <BookingModal onClose={() => setSelectedRoom(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

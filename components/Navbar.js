"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Key } from "lucide-react";

export default function Navbar() {
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-40 glass-nav h-20 flex items-center px-6 md:px-12 justify-between"
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 group">
        <span className="text-2xl font-serif tracking-[0.2em] text-[#fbfaf7] group-hover:text-gold transition-colors duration-300">
          GRAND <span className="font-light text-gold text-base tracking-[0.1em] block md:inline md:ml-1">STAY</span>
        </span>
      </Link>

      {/* Navigation Links */}
      <nav className="hidden lg:flex items-center gap-8 text-xs uppercase tracking-widest text-[#a19f9a] font-medium">
        {[
          { name: "Home", id: "hero" },
          { name: "Rooms & Suites", id: "rooms" },
          { name: "Amenities", id: "amenities" },
          { name: "Gallery", id: "gallery" },
          { name: "FAQs", id: "faq" },
          { name: "Contact", id: "contact" },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => scrollToSection(item.id)}
            className="hover:text-gold transition-colors duration-300 cursor-pointer relative py-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-gold after:transition-all hover:after:w-full"
          >
            {item.name}
          </button>
        ))}
      </nav>

      {/* Actions */}
      <div className="flex items-center gap-4">
        {/* Admin Link */}
        <Link
          href="/admin"
          className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#a19f9a] hover:text-gold transition-colors duration-300"
          title="Property Management Portal"
        >
          <Key className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Admin Portal</span>
        </Link>

        {/* CTA Button */}
        <button
          onClick={() => scrollToSection("rooms")}
          className="bg-gold hover:bg-[#bfa232] text-[#070708] text-[10px] font-bold uppercase tracking-widest px-5 py-2.5 rounded-none border border-gold hover:border-[#bfa232] transition-all duration-300 shadow-md shadow-gold/10 active:scale-95"
        >
          Book Your Stay
        </button>
      </div>
    </motion.header>
  );
}

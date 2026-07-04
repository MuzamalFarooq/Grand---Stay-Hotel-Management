"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Mail, Phone, MapPin, Check, Plus, Minus } from "lucide-react";
import Link from "next/link";

export default function ExtraSections() {
  const [activeFaq, setActiveFaq] = useState(null);

  const amenities = [
    {
      title: "The Celestial Spa",
      description: "An oasis of tranquility offering signature basalt hot stone therapies, custom botanical facials, and private vapor steam chambers.",
      image: "/spa.png",
      tag: "Wellness & Rejuvenation",
    },
    {
      title: "L'Aura Michelin Dining",
      description: "Immerse yourself in a culinary journey overseen by world-renowned chefs. Savour seasonal tasting menus and curated wine pairings.",
      image: "/dining.png",
      tag: "Fine Culinary Arts",
    },
  ];

  const testimonials = [
    {
      quote: "Grand Stay represents the absolute pinnacle of luxury. From the private butler service to the breathtaking sunset views, every detail was meticulously crafted.",
      author: "Lord Julian Sterling",
      stay: "Penthouse Suite Guest",
    },
    {
      quote: "The dining experience at L'Aura was transcendent. The Celestial Spa provided an escape that restored both body and spirit. I will return every season.",
      author: "Lady Evelyn Sinclair",
      stay: "Executive Double Guest",
    },
    {
      quote: "Exquisite aesthetics, prompt attention, and total privacy. The booking process was seamless, and the service was genuinely world-class.",
      author: "Dr. Alistair Vance",
      stay: "Deluxe Single Guest",
    },
  ];

  const galleryImages = [
    { src: "/hero.png", title: "Sunset Infinity Pool" },
    { src: "/suite.png", title: "Presidential Penthouse" },
    { src: "/spa.png", title: "Celestial Massage Chamber" },
    { src: "/dining.png", title: "L'Aura Fine Dining Table" },
  ];

  const faqs = [
    {
      q: "What are the standard check-in and check-out times?",
      a: "Check-in begins at 2:00 PM and check-out is requested by 12:00 PM. Early arrivals and late departures may be arranged through our concierge desk, subject to availability.",
    },
    {
      q: "Is airport transport service available?",
      a: "Yes, we provide luxury private chauffeur services to and from the international airport. Please notify our reception team at least 24 hours prior to arrival to confirm booking.",
    },
    {
      q: "What is your cancellation policy?",
      a: "Reservations can be modified or cancelled free of charge up to 72 hours prior to your scheduled check-in time. Late cancellations may incur a fee of one night's room charge.",
    },
    {
      q: "Do you offer private events or banquet facilities?",
      a: "Absolutely. Our grand ballroom and private ocean-view dining halls are available for executive conferences, wedding receptions, and gala events. Contact our events director for brochures.",
    },
  ];

  const toggleFaq = (idx) => {
    setActiveFaq(activeFaq === idx ? null : idx);
  };

  return (
    <>
      {/* 1. Amenities and Spa/Dining Showcase */}
      <section id="amenities" className="py-24 px-6 md:px-12 bg-[#0c0c0e]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-gold text-xs uppercase tracking-[0.25em] font-semibold block mb-3">
              Unrivaled Indulgence
            </span>
            <h2 className="text-3xl md:text-5xl font-serif text-white tracking-wide">
              Amenities & Experiences
            </h2>
            <div className="w-16 h-[1px] bg-gold mx-auto mt-6"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {amenities.map((item, idx) => (
              <div key={idx} className="glass-card flex flex-col md:flex-row group overflow-hidden">
                <div className="relative w-full md:w-1/2 aspect-[4/3] md:aspect-auto img-zoom-hover">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] uppercase tracking-widest text-gold font-bold block mb-2">
                      {item.tag}
                    </span>
                    <h3 className="text-xl font-serif text-white mb-4 group-hover:text-gold transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#a19f9a] leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                  <div className="pt-6 border-t border-slate-900 mt-6 md:mt-0 flex gap-2 items-center text-xs font-bold uppercase tracking-widest text-[#fbfaf7]">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold"></span>
                    <span>Reservations Required</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Photo Gallery */}
      <section id="gallery" className="py-24 px-6 md:px-12 bg-[#070708]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-gold text-xs uppercase tracking-[0.25em] font-semibold block mb-3">
              Visual Splendour
            </span>
            <h2 className="text-3xl md:text-5xl font-serif text-white tracking-wide">
              The Gallery
            </h2>
            <div className="w-16 h-[1px] bg-gold mx-auto mt-6"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {galleryImages.map((img, idx) => (
              <div key={idx} className="relative aspect-[4/3] glass-card overflow-hidden group cursor-pointer">
                <Image
                  src={img.src}
                  alt={img.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-90 transition-opacity duration-300 flex items-end p-4">
                  <div>
                    <span className="text-gold text-[8px] uppercase tracking-widest block mb-1">Grand Stay</span>
                    <span className="text-white text-xs font-serif">{img.title}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Testimonials */}
      <section className="py-24 px-6 md:px-12 bg-[#0c0c0e] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-80 h-80 bg-gold/5 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <span className="text-gold text-xs uppercase tracking-[0.25em] font-semibold block mb-3">
              Connoisseur Endorsements
            </span>
            <h2 className="text-3xl md:text-5xl font-serif text-white tracking-wide">
              Guest Testimonials
            </h2>
            <div className="w-16 h-[1px] bg-gold mx-auto mt-6"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <div key={idx} className="glass-card p-8 flex flex-col justify-between border-t-2 border-t-gold">
                <p className="text-xs text-[#a19f9a] leading-relaxed italic mb-8 font-light">
                  "{t.quote}"
                </p>
                <div>
                  <h4 className="text-sm font-serif text-white">{t.author}</h4>
                  <span className="text-[10px] text-gold uppercase tracking-widest font-semibold block mt-1">
                    {t.stay}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FAQs Accordion */}
      <section id="faq" className="py-24 px-6 md:px-12 bg-[#070708]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-gold text-xs uppercase tracking-[0.25em] font-semibold block mb-3">
              Inquiries & Details
            </span>
            <h2 className="text-3xl md:text-5xl font-serif text-white tracking-wide">
              Frequently Asked Questions
            </h2>
            <div className="w-16 h-[1px] bg-gold mx-auto mt-6"></div>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div key={idx} className="border border-slate-900 bg-[#0c0c0e] hover:border-gold/20 transition-all duration-300">
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full py-5 px-6 flex justify-between items-center text-left text-xs uppercase tracking-widest text-[#fbfaf7] font-semibold hover:text-gold transition-colors duration-300"
                  >
                    <span>{faq.q}</span>
                    <span>
                      {isOpen ? <Minus className="w-4 h-4 text-gold" /> : <Plus className="w-4 h-4 text-[#a19f9a]" />}
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <p className="px-6 pb-6 text-xs text-[#a19f9a] leading-relaxed border-t border-slate-900/60 pt-4 font-light">
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Contact Section */}
      <section id="contact" className="py-24 px-6 md:px-12 bg-[#0c0c0e] border-t border-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Contact Details */}
            <div className="flex flex-col justify-between">
              <div>
                <span className="text-gold text-xs uppercase tracking-[0.25em] font-semibold block mb-3">
                  Let us welcome you
                </span>
                <h2 className="text-3xl md:text-5xl font-serif text-white tracking-wide mb-6">
                  Get in Touch
                </h2>
                <p className="text-xs text-[#a19f9a] leading-relaxed max-w-md font-light mb-8">
                  For private events, custom room modifications, or tailored concierge services, please send us a query or contact our resort desk.
                </p>

                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 border border-[#1a1a1f] flex items-center justify-center text-gold">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[9px] uppercase tracking-widest text-slate-500 font-semibold">Address</p>
                      <p className="text-xs text-white font-medium">Johar Town,Lahore,Pakistan</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 border border-[#1a1a1f] flex items-center justify-center text-gold">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[9px] uppercase tracking-widest text-slate-500 font-semibold">Contact Desk</p>
                      <p className="text-xs text-white font-medium">+92 3067774327</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 border border-[#1a1a1f] flex items-center justify-center text-gold">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[9px] uppercase tracking-widest text-slate-500 font-semibold">Email</p>
                      <p className="text-xs text-white font-medium">muzamalfarooq111@gmail.com</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Channels */}
              <div className="mt-12 lg:mt-0 flex gap-4">
                {[
                  {
                    icon: (
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                      </svg>
                    ),
                    href: "https://www.facebook.com/tigerstyle786.M",
                  },
                  {
                    icon: (
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                      </svg>
                    ),
                    href: "https://www.instagram.com/tigerstyle786",
                  },
                  {
                    icon: (
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                      </svg>
                    ),
                    href: "https://www.linkedin.com/in/muzamal-farooq-1232693a9",
                  },
                ].map((s, idx) => (
                  <a
                    key={idx}
                    href={s.href}
                    className="w-9 h-9 border border-[#1a1a1f] hover:border-gold/40 hover:text-gold flex items-center justify-center text-[#a19f9a] transition-all cursor-pointer"
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Mock Contact Form */}
            <div className="glass-card p-8 md:p-10">
              <h3 className="text-lg font-serif text-white mb-6 border-b border-slate-900 pb-3 uppercase tracking-widest text-gold text-xs">
                Inquire Online
              </h3>

              <form onSubmit={(e) => { e.preventDefault(); alert("Concierge notified. We will call you shortly."); }} className="space-y-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-widest text-[#a19f9a] font-semibold">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your name..."
                    className="bg-[#070708] border border-slate-900 focus:border-gold py-3 px-4 text-xs text-white focus:outline-none w-full"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-widest text-[#a19f9a] font-semibold">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="Enter your email..."
                    className="bg-[#070708] border border-slate-900 focus:border-gold py-3 px-4 text-xs text-white focus:outline-none w-full"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-widest text-[#a19f9a] font-semibold">Message</label>
                  <textarea
                    rows="4"
                    required
                    placeholder="Describe your inquiry..."
                    className="bg-[#070708] border border-slate-900 focus:border-gold py-3 px-4 text-xs text-white focus:outline-none w-full resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gold hover:bg-[#bfa232] text-[#070708] text-[10px] font-bold uppercase tracking-widest py-4 transition-all"
                >
                  Send Inquiry
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Footer */}
      <footer className="bg-[#070708] border-t border-slate-900 py-12 px-6 md:px-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="font-serif tracking-widest text-gold text-sm uppercase">
            GRAND STAY
          </div>
          <div className="flex gap-8 text-[#a19f9a] uppercase tracking-widest text-[9px]">
            <Link href="/" className="hover:text-gold">Home</Link>
            <Link href="/#rooms" className="hover:text-gold">Rooms</Link>
            <Link href="/admin" className="hover:text-gold font-bold flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-[#D4AF37]"></span> Property Portal
            </Link>
          </div>
          <div>
            &copy; {new Date().getFullYear()} Grand Stay Luxury Hotels. All Rights Reserved.
          </div>
        </div>
      </footer>
    </>
  );
}

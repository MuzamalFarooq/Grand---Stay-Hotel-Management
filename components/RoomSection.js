"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Wifi, Tv, Coffee, Wind, Users, Star } from "lucide-react";

const AMENITY_ICONS = {
  WiFi: <Wifi className="w-3.5 h-3.5" />,
  AC: <Wind className="w-3.5 h-3.5" />,
  TV: <Tv className="w-3.5 h-3.5" />,
  "Smart TV": <Tv className="w-3.5 h-3.5" />,
  "55\" 4K TV": <Tv className="w-3.5 h-3.5" />,
  "65\" OLED TV": <Tv className="w-3.5 h-3.5" />,
  "85\" OLED TV": <Tv className="w-3.5 h-3.5" />,
  "Mini Bar": <Coffee className="w-3.5 h-3.5" />,
  "Premium Mini Bar": <Coffee className="w-3.5 h-3.5" />,
  "Coffee Machine": <Coffee className="w-3.5 h-3.5" />,
};

const ROOM_TYPES = ["All", "Standard", "Deluxe", "Suite", "Presidential"];

export default function RoomSection({ rooms, onBookRoom, loading }) {
  const [filterType, setFilterType] = useState("All");
  const [maxPrice, setMaxPrice] = useState(150000);
  const [filterCapacity, setFilterCapacity] = useState("All");

  const matchesCapacity = (room, capFilter) => {
    if (capFilter === "All") return true;
    const max = room.maxGuests || 2;
    if (capFilter === "1") return max >= 1;
    if (capFilter === "2") return max >= 2;
    if (capFilter === "3+") return max >= 3;
    return true;
  };

  const filteredRooms = rooms.filter((room) => {
    const typeMatch = filterType === "All" || room.type === filterType;
    const priceMatch = room.price <= maxPrice;
    const capacityMatch = matchesCapacity(room, filterCapacity);
    return typeMatch && priceMatch && capacityMatch;
  });

  if (loading) {
    return (
      <section id="rooms" className="py-24 px-6 md:px-12 bg-[#070708]">
        <div className="max-w-7xl mx-auto text-center">
          <div className="w-10 h-10 border-4 border-gold/30 border-t-gold rounded-full animate-spin mx-auto" />
          <p className="text-[#a19f9a] mt-4 text-sm">Loading luxury suites...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="rooms" className="py-24 px-6 md:px-12 bg-[#070708]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-gold text-xs uppercase tracking-[0.25em] font-semibold block mb-3">
            Elite Accommodations
          </span>
          <h2 className="text-3xl md:text-5xl font-serif text-white tracking-wide">
            Rooms & Suites
          </h2>
          <div className="w-16 h-[1px] bg-gold mx-auto mt-6"></div>
        </div>

        <div className="glass-card p-6 md:p-8 rounded-none mb-12 flex flex-col lg:flex-row gap-8 justify-between items-stretch lg:items-center">
          <div className="flex flex-wrap gap-2">
            {ROOM_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-5 py-2.5 text-[10px] uppercase tracking-widest transition-all duration-300 ${
                  filterType === type
                    ? "bg-gold text-[#070708] font-bold"
                    : "bg-transparent text-[#a19f9a] border border-slate-800 hover:border-gold hover:text-white"
                }`}
              >
                {type === "All" ? "All Suites" : type}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-[#a19f9a] uppercase tracking-widest font-semibold flex items-center gap-1.5">
              <Users className="w-4 h-4 text-gold" /> Capacity:
            </span>
            <select
              value={filterCapacity}
              onChange={(e) => setFilterCapacity(e.target.value)}
              className="bg-[#0f0f12] text-[#fbfaf7] text-xs py-2 px-3 border border-slate-800 focus:outline-none focus:border-gold"
            >
              <option value="All">Any Guests</option>
              <option value="1">1 Guest</option>
              <option value="2">2 Guests</option>
              <option value="3+">3+ Guests</option>
            </select>
          </div>

          <div className="flex flex-col gap-2 min-w-[200px]">
            <div className="flex justify-between items-center text-xs uppercase tracking-widest text-[#a19f9a]">
              <span>Max Price</span>
              <span className="text-gold font-bold">Rs {maxPrice.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="10000"
              max="150000"
              step="1000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-gold bg-slate-800 h-1 cursor-pointer"
            />
          </div>
        </div>

        {filteredRooms.length === 0 ? (
          <div className="text-center py-20 border border-slate-800 glass-card">
            <p className="text-[#a19f9a] text-lg font-serif">No suites match your filter parameters.</p>
            <button
              onClick={() => {
                setFilterType("All");
                setMaxPrice(150000);
                setFilterCapacity("All");
              }}
              className="mt-6 text-gold underline text-xs uppercase tracking-widest hover:text-white transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredRooms.map((room, idx) => (
                <motion.div
                  key={room.id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5, delay: idx * 0.05 }}
                  className="glass-card glass-card-hover flex flex-col group overflow-hidden"
                >
                  <div className="relative aspect-[4/3] img-zoom-hover">
                    <Image
                      src={room.images?.[0] || "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80"}
                      alt={room.roomName || `${room.type} Suite`}
                      fill
                      className="object-cover"
                    />
                    <span
                      className={`absolute top-4 right-4 text-[9px] uppercase tracking-widest font-black px-3 py-1.5 backdrop-blur-md border ${
                        room.status === "Available"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : room.status === "Booked"
                          ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                          : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                      }`}
                    >
                      {room.status}
                    </span>
                    <span className="absolute bottom-4 left-4 bg-[#070708]/80 backdrop-blur-sm text-gold text-[9px] uppercase tracking-widest px-2.5 py-1 border border-gold/10">
                      Room #{room.id}
                    </span>
                    {room.rating && (
                      <span className="absolute top-4 left-4 bg-[#070708]/80 backdrop-blur-sm text-gold text-[9px] uppercase tracking-widest px-2.5 py-1 border border-gold/10 flex items-center gap-1">
                        <Star className="w-3 h-3 fill-gold" /> {room.rating}
                      </span>
                    )}
                  </div>

                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-xl font-serif text-white mb-1 group-hover:text-gold transition-colors duration-300">
                      {room.roomName || `Luxury ${room.type} Suite`}
                    </h3>
                    <p className="text-[10px] text-gold/70 uppercase tracking-widest mb-2">{room.type} · Floor {room.floor}</p>

                    {room.description && (
                      <p className="text-xs text-[#a19f9a] mb-3 line-clamp-2">{room.description}</p>
                    )}

                    <p className="text-xs text-[#a19f9a] font-medium mb-4 uppercase tracking-wider flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-gold/60" />
                      Up to {room.maxGuests || 2} Guests · {room.bedType || "Queen"}
                      {room.sizeSqFt ? ` · ${room.sizeSqFt} sq ft` : ""}
                    </p>

                    <div className="flex flex-wrap gap-x-4 gap-y-2 mb-6">
                      {(room.amenities || []).slice(0, 4).map((amenity, index) => (
                        <div key={index} className="flex items-center gap-1 text-[11px] text-[#a19f9a]">
                          <span className="text-gold">{AMENITY_ICONS[amenity] || <Wifi className="w-3.5 h-3.5" />}</span>
                          <span>{amenity}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-auto pt-6 border-t border-slate-900 flex justify-between items-center">
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase tracking-widest block">Price per Night</span>
                        <span className="text-lg font-serif text-white">
                          Rs {room.price.toLocaleString()}
                        </span>
                      </div>

                      <button
                        onClick={() => onBookRoom(room)}
                        disabled={room.status !== "Available"}
                        className={`text-[10px] font-bold uppercase tracking-widest px-4 py-2.5 border transition-all duration-300 ${
                          room.status === "Available"
                            ? "bg-[#D4AF37] border-[#D4AF37] text-[#070708] hover:bg-transparent hover:text-[#D4AF37] active:scale-95"
                            : "bg-transparent border-slate-800 text-slate-600 cursor-not-allowed"
                        }`}
                      >
                        {room.status === "Available" ? "Book Suite" : room.status}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
}

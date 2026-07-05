"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useBooking } from "@/context/BookingContext";
import { useStaff } from "@/context/StaffContext";
import { useCustomers } from "@/context/CustomerContext";
import Link from "next/link";

// --- Icons (Inline SVGs) ---
const Icons = {
  Rooms: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 20v-8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v8" /><path d="M5 10V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v4" /><path d="M3 18h18" /></svg>
  ),
  Bookings: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /><path d="m9 16 2 2 4-4" /></svg>
  ),
  Staff: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
  ),
  Search: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
  ),
  User: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="10" r="3" /><path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" /></svg>
  ),
  Bell: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
  ),
  Plus: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
  ),
  History: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8v4l3 3" /><circle cx="12" cy="12" r="10" /><path d="M16.2 7.8l.1-.1" /></svg>
  ),
  Analytics: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18" /><path d="M18 17V9" /><path d="M13 17V5" /><path d="M8 17v-3" /></svg>
  ),
  Customer: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
  ),
  Maintenance: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg>
  )
};

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("rooms");
  const [viewedBooking, setViewedBooking] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Analytics state
  const [analyticsData, setAnalyticsData] = useState(null);
  const [analyticsPeriod, setAnalyticsPeriod] = useState("monthly");
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  useEffect(() => {
    if (activeTab === "analytics") {
      setAnalyticsLoading(true);
      fetch("/api/analytics")
        .then((res) => res.json())
        .then((data) => {
          if (data.success) setAnalyticsData(data.data);
        })
        .catch(console.error)
        .finally(() => setAnalyticsLoading(false));
    }
  }, [activeTab]);

  // Destructure from BookingContext
  const {
    rooms,
    bookings,
    selectedRoom,
    setSelectedRoom,
    isRoomModalOpen,
    setIsRoomModalOpen,
    customerName,
    setCustomerName,
    idCard,
    setIdCard,
    phoneNumber,
    setPhoneNumber,
    checkInDate,
    setCheckInDate,
    checkOutDate,
    setCheckOutDate,
    newRoom,
    setNewRoom,
    handleBookRoom,
    handleCheckOut,
    handleCancelBooking,
    handleAddRoom,
    handleEditRoom,
    handleDeleteRoom,
    handleMarkAvailable,
    resetBookingForm,
    editingRoom,
    setEditingRoom,
    email,
    setEmail,
    availableRoomsCount,
    maintenanceRoomsCount,
    totalRoomsCount
  } = useBooking();

  // Destructure from StaffContext
  const {
    staff,
    isStaffModalOpen,
    setIsStaffModalOpen,
    newStaff,
    setNewStaff,
    handleAddStaff,
    handleEditStaff,
    handleDeleteStaff,
    editingStaff,
    setEditingStaff,
  } = useStaff();

  const { customers, services } = useCustomers();

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewStaff({ ...newStaff, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex h-screen bg-[#070708] text-[#f4f2ee] font-sans selection:bg-[#D4AF37]/30 relative overflow-hidden">

      {/* Sidebar Overlay (Mobile) */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden animate-in fade-in duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0c0c0e]/95 md:bg-[#0c0c0e]/90 backdrop-blur-xl border-r border-[#1a1a1f] p-6 flex flex-col gap-8 transition-transform duration-300 md:relative md:translate-x-0 ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <div className="flex items-center justify-between group cursor-pointer" onClick={() => { setActiveTab("rooms"); setIsSidebarOpen(false); }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#D4AF37] to-[#AA7C11] rounded-xl flex items-center justify-center shadow-lg shadow-[#D4AF37]/10 group-hover:scale-105 transition-transform">
              <span className="text-xl font-bold text-[#070708]">G</span>
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight text-[#f4f2ee]">Grand Stay</h2>
              <p className="text-[10px] text-[#D4AF37] uppercase tracking-widest font-semibold">Admin Panel</p>
            </div>
          </div>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setIsSidebarOpen(false); }}
            className="md:hidden p-1.5 rounded-lg hover:bg-[#1a1a1f] text-slate-400 hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
          </button>
        </div>

        {/* nav buttons  */}
        <nav className="flex flex-col gap-2">
          {[
            { id: "rooms", label: "Rooms", icon: <Icons.Rooms /> },
            { id: "bookings", label: "Bookings", icon: <Icons.Bookings /> },
            { id: "maintenance", label: "Maintenance", icon: <Icons.Maintenance /> },
            { id: "history", label: "Booking History", icon: <Icons.History /> },
            { id: "analytics", label: "Analytics", icon: <Icons.Analytics /> },
            { id: "customers", label: "Customers", icon: <Icons.Customer /> },
            { id: "staff", label: "Staff Members", icon: <Icons.Staff /> },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 w-full text-left ${activeTab === item.id
                ? "bg-[#D4AF37] text-[#070708] font-bold shadow-lg shadow-[#D4AF37]/20 translate-x-1"
                : "text-slate-400 hover:bg-[#1a1a1f] hover:text-white"
                }`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* login user info */}
        <div className="mt-auto flex flex-col gap-3">
          <Link href="/" className="w-full py-2.5 px-4 rounded-xl text-xs text-center border border-[#D4AF37]/20 text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-all font-semibold">
            ← View Guest Website
          </Link>
          <div className="bg-[#111115] p-4 rounded-xl border border-slate-800/80 group hover:border-[#D4AF37]/30 transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center overflow-hidden border border-slate-600 shadow-inner">
                <Icons.User />
              </div>
              <div>
                <p className="text-sm font-semibold">Admin User</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider">Property Manager</p>
              </div>
            </div>
            <button className="w-full py-1.5 rounded-md text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all">Sign Out</button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-[#111114] via-[#070708] to-[#070708]">

        {/* Header */}
        <header className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mb-6 md:mb-10">
          <div className="flex items-center gap-3 animate-in fade-in slide-in-from-left duration-700">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2.5 text-slate-400 hover:text-white bg-[#0c0c0e]/80 border border-[#1a1a1f] rounded-xl flex items-center justify-center transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
            </button>
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif text-white capitalize tracking-tight mb-1">{activeTab} Dashboard</h1>
              <p className="text-[#a19f9a] text-xs sm:text-sm">Managing your property at your fingertips.</p>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            {/* search bar */}
            <div className="relative group flex-1 sm:flex-none">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#D4AF37] transition-colors">
                <Icons.Search />
              </span>
              <input
                type="text"
                placeholder="Search..."
                className="bg-[#0c0c0e]/85 border border-[#1a1a1f] rounded-full py-2.5 pl-9 pr-4 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#D4AF37] w-full sm:w-64 backdrop-blur-sm transition-all sm:focus:w-72"
              />
            </div>

            {/* notification button */}
            <button className="relative w-10 h-10 rounded-full bg-[#0c0c0e]/85 border border-[#1a1a1f] flex items-center justify-center hover:bg-[#D4AF37]/10 hover:border-[#D4AF37]/30 transition-all group shrink-0">
              <Icons.Bell />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#D4AF37] rounded-full ring-4 ring-[#070708] group-hover:scale-110 transition-transform"></span>
            </button>
          </div>
        </header>

        {/* Stats Section */}
        {activeTab === "rooms" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-10 animate-in fade-in slide-in-from-top duration-500">
            {[
              { label: "Total Capacity", value: totalRoomsCount, color: "bg-[#D4AF37]", icon: "🏢" },
              { label: "Available Now", value: availableRoomsCount, color: "bg-emerald-500", icon: "✅" },
              { label: "Occupied Rooms", value: totalRoomsCount - availableRoomsCount - maintenanceRoomsCount, color: "bg-rose-500", icon: "🚪" },
              { label: "Under Maintenance", value: maintenanceRoomsCount, color: "bg-amber-500", icon: "🔧" },
            ].map((stat, i) => (
              <div key={i} className="bg-[#0c0c0e]/50 backdrop-blur-md border border-[#1c1c22] p-6 rounded-2xl relative overflow-hidden group hover:border-[#D4AF37]/20 transition-all">
                <div className={`absolute top-0 right-0 p-4 text-2xl opacity-20 group-hover:opacity-40 transition-opacity`}>{stat.icon}</div>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-5xl font-serif text-white">{stat.value}</p>
                <div className="mt-5 w-full bg-[#1c1c22] h-1 rounded-full overflow-hidden">
                  <div
                    className={`${stat.color} h-full transition-all duration-1000 ease-out`}
                    style={{ width: `${totalRoomsCount > 0 ? (stat.value / totalRoomsCount) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Dynamic Content Container */}
        <div className="bg-[#0c0c0e]/40 backdrop-blur-md border border-[#1a1a1f] rounded-3xl overflow-hidden shadow-2xl shadow-black/80 animate-in fade-in zoom-in-95 duration-500">

          {/* rooms page */}
          {activeTab === "rooms" && (
            <div className="p-4 sm:p-6 md:p-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
                <div>
                  <h3 className="text-2xl font-serif text-white mb-1">Room Inventory</h3>
                  <p className="text-slate-500 text-sm">Visual status of all property units</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setIsRoomModalOpen(true)} className="bg-[#D4AF37] hover:bg-[#bfa232] text-[#070708] px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-[#D4AF37]/10 flex items-center gap-2">
                    <Icons.Plus />
                    Add Room
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-2.5 sm:gap-3.5">
                {rooms.map((room) => (
                  <div
                    key={room.id}
                    onClick={() => setSelectedRoom(room)}
                    className={`aspect-square rounded-xl flex flex-col items-center justify-center text-[8px] sm:text-[10px] font-black transition-all cursor-pointer relative group ${room.status === "Available"
                      ? "bg-emerald-500/5 border border-emerald-500/10 text-emerald-400/50 hover:bg-emerald-500/20 hover:text-emerald-300 hover:border-emerald-500/30"
                      : room.status === "Booked"
                        ? "bg-rose-500/5 border border-rose-500/10 text-rose-400/50 hover:bg-rose-500/20 hover:text-rose-300 hover:border-rose-500/30"
                        : "bg-amber-500/5 border border-amber-500/10 text-amber-400/50 hover:bg-amber-500/20 hover:text-amber-300 hover:border-amber-500/30"
                      }`}
                  >
                    <span className="mb-0.5 opacity-40 group-hover:opacity-100 transition-opacity uppercase tracking-tighter">{room.type}</span>
                    <span className="text-sm group-hover:scale-110 transition-transform font-black font-serif">#{room.id}</span>
                    <div className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border-2 border-[#070708] ${room.status === "Available" ? "bg-emerald-500" : room.status === "Booked" ? "bg-rose-500" : "bg-amber-500"
                      }`}></div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* booking page */}
          {activeTab === "bookings" && (
            <div className="p-0">
              <div className="p-4 sm:p-6 md:p-8 border-b border-[#1a1a1f] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#0c0c0e]/30">
                <div>
                  <h3 className="text-2xl font-serif text-white mb-1">Active Bookings</h3>
                  <p className="text-slate-500 text-sm">Managing {bookings.length} current customer stays</p>
                </div>
                <button onClick={() => setActiveTab("rooms")} className="bg-[#D4AF37] hover:bg-[#bfa232] text-[#070708] px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-[#D4AF37]/10 w-full sm:w-auto">New Booking</button>
              </div>
              {bookings.length === 0 ? (
                <div className="p-20 text-center flex flex-col items-center gap-4">
                  <div className="w-20 h-20 bg-[#16161d] rounded-3xl flex items-center justify-center text-slate-600">
                    <Icons.Bookings />
                  </div>
                  <h4 className="text-xl font-bold text-slate-400">No bookings yet</h4>
                  <p className="text-slate-600 text-sm max-w-xs">Start by selecting an available room from the inventory section to create your first booking.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[750px] md:min-w-full">
                    <thead>
                      <tr className="bg-[#050507] text-[#D4AF37] text-[10px] uppercase font-bold tracking-widest">
                        <th className="px-6 md:px-8 py-5 border-b border-[#1a1a1f]">Unit No.</th>
                        <th className="px-6 md:px-8 py-5 border-b border-[#1a1a1f]">Customer Details</th>
                        <th className="px-6 md:px-8 py-5 border-b border-[#1a1a1f]">Check-In Period</th>
                        <th className="px-6 md:px-8 py-5 border-b border-[#1a1a1f]">Payment Status</th>
                        <th className="px-6 md:px-8 py-5 border-b border-[#1a1a1f] text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1a1a1f]">
                      {bookings.filter(b => !b.isCompleted).map((booking) => (
                        <tr key={booking.id} className="hover:bg-[#D4AF37]/5 transition-colors group">
                          <td className="px-6 md:px-8 py-6">
                            <span className="bg-[#1c1c22] text-[#D4AF37] px-3 py-1.5 rounded-lg text-xs font-bold border border-[#D4AF37]/20">UNIT {booking.room}</span>
                          </td>
                          <td className="px-6 md:px-8 py-6">
                            <div className="font-bold text-slate-100 mb-0.5">{booking.customer}</div>
                            <div className="text-[10px] text-slate-500 uppercase tracking-tight font-bold">ID: {booking.bookingId || `REZ-${booking.id}`}</div>
                          </td>
                          <td className="px-6 md:px-8 py-6">
                            <div className="flex items-center gap-3">
                              <div className="text-xs font-bold text-slate-300">{booking.checkIn}</div>
                              <div className="w-4 h-px bg-slate-700"></div>
                              <div className="text-xs font-bold text-slate-300">{booking.checkOut}</div>
                            </div>
                          </td>
                          <td className="px-6 md:px-8 py-6">
                            <span className={`text-[9px] uppercase font-black px-3 py-1.5 rounded-lg border tracking-widest ${(booking.paymentStatus || booking.status) === "Paid"
                              ? "bg-emerald-500/5 text-emerald-400 border-emerald-500/20"
                              : "bg-amber-500/5 text-amber-400 border-amber-500/20"
                              }`}>
                              {booking.paymentStatus || booking.status}
                            </span>
                          </td>
                          <td className="px-6 md:px-8 py-6 text-right">
                            <div className="flex justify-end gap-2">
                              <button onClick={() => handleCheckOut(booking.id)} className="px-3 md:px-4 py-2 bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white rounded-lg text-xs font-bold transition-all">Check Out</button>
                              <button onClick={() => handleCancelBooking(booking.id)} className="px-3 md:px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-bold transition-all">Cancel</button>
                              <button onClick={() => setViewedBooking(booking)} className="px-3 md:px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-bold transition-all">View</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Customers page */}
          {activeTab === "customers" && (
            <div className="p-4 sm:p-6 md:p-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
                <div>
                  <h3 className="text-2xl font-serif text-white mb-1">Customer Directory</h3>
                  <p className="text-slate-500 text-sm">{customers.length} registered guests · {services.length} active services</p>
                </div>
              </div>
              {customers.length === 0 ? (
                <div className="p-20 text-center flex flex-col items-center gap-4 border-2 border-dashed border-[#1a1a1f] rounded-3xl">
                  <Icons.Customer />
                  <h4 className="text-xl font-bold text-slate-500">No customers yet</h4>
                  <p className="text-slate-600 text-sm">Customers are created automatically when bookings are made.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[700px] md:min-w-full">
                    <thead>
                      <tr className="bg-[#050507] text-[#D4AF37] text-[10px] uppercase font-bold tracking-widest">
                        <th className="px-6 py-4 border-b border-[#1a1a1f]">Guest</th>
                        <th className="px-6 py-4 border-b border-[#1a1a1f]">Contact</th>
                        <th className="px-6 py-4 border-b border-[#1a1a1f]">Bookings</th>
                        <th className="px-6 py-4 border-b border-[#1a1a1f]">Loyalty Points</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1a1a1f]">
                      {customers.map((c) => (
                        <tr key={c.id} className="hover:bg-[#D4AF37]/5 transition-colors">
                          <td className="px-6 py-5">
                            <div className="font-bold text-slate-100">{c.fullName}</div>
                            <div className="text-[10px] text-slate-500">{c.address || "No address"}</div>
                          </td>
                          <td className="px-6 py-5">
                            <div className="text-xs text-slate-300">{c.email}</div>
                            <div className="text-[10px] text-slate-500">{c.phone}</div>
                          </td>
                          <td className="px-6 py-5 font-bold text-slate-300">{c.bookingHistory?.length || 0}</td>
                          <td className="px-6 py-5">
                            <span className="bg-[#D4AF37]/10 text-[#D4AF37] px-3 py-1 rounded-lg text-xs font-bold">{c.loyaltyPoints?.toLocaleString()}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* staff page */}
          {activeTab === "staff" && (
            <div className="p-4 sm:p-6 md:p-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
                <div>
                  <h3 className="text-2xl font-serif text-white mb-1">Staff Members</h3>
                  <p className="text-slate-500 text-sm">Managing {staff.length} active staff members</p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <button onClick={() => setIsStaffModalOpen(true)} className="bg-[#D4AF37] hover:bg-[#bfa232] text-[#070708] px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-[#D4AF37]/10 flex items-center gap-2 justify-center w-full sm:w-auto">
                    <Icons.Staff />
                    Add Staff
                  </button>
                </div>
              </div>
              {staff.length === 0 ? (
                <div className="p-20 text-center flex flex-col items-center gap-4 border-2 border-dashed border-[#1a1a1f] rounded-3xl">
                  <div className="w-20 h-20 bg-slate-800/30 rounded-full flex items-center justify-center text-slate-700">
                    <Icons.Staff />
                  </div>
                  <h4 className="text-xl font-bold text-slate-500">No staff members registered</h4>
                  <button onClick={() => setIsStaffModalOpen(true)} className="text-[#D4AF37] font-bold hover:underline">Add your first employee</button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                  {staff.map((member) => (
                    <div key={member.id} className="bg-[#0b0b0e] border border-slate-800 p-6 rounded-3xl flex flex-col items-center text-center group hover:border-[#D4AF37]/40 hover:bg-[#D4AF37]/2 transition-all duration-500">
                      <div className="relative mb-5">
                        <div className="absolute -inset-1.5 bg-gradient-to-br from-[#D4AF37] to-[#AA7C11] rounded-full blur opacity-0 group-hover:opacity-40 transition-opacity"></div>
                        <Image
                          src={member.image}
                          alt={member.name}
                          width={96}
                          height={96}
                          className="rounded-full border-4 border-[#070708] relative z-10"
                        />
                        <span className={`absolute bottom-2 right-2 w-5 h-5 rounded-full border-4 border-[#070708] z-20 ${member.status === "Active" ? "bg-emerald-500" : "bg-amber-500"
                          }`}></span>
                      </div>
                      <h4 className="font-serif text-lg text-white group-hover:text-[#D4AF37] transition-colors">{member.name}</h4>
                      <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">{member.role}</p>
                      <p className="text-slate-600 text-[10px] mb-4">{member.department} · {member.shift}</p>
                      <div className="flex gap-2 w-full mt-auto">
                        <button onClick={() => setEditingStaff(member)} className="flex-1 bg-slate-800/50 hover:bg-slate-700 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Edit</button>
                        <button onClick={() => handleDeleteStaff(member.id)} className="flex-1 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Remove</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* booking History page  */}
          {activeTab === "history" && (
            <div className="p-0">
              <div className="p-4 sm:p-6 md:p-8 border-b border-[#1a1a1f] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#0c0c0e]/30">
                <div>
                  <h3 className="text-2xl font-serif text-white mb-1">Booking History</h3>
                  <p className="text-slate-500 text-sm">Reviewing all past and current property stays</p>
                </div>
              </div>
              {bookings.length === 0 ? (
                <div className="p-20 text-center flex flex-col items-center gap-4">
                  <div className="w-20 h-20 bg-slate-800/50 rounded-3xl flex items-center justify-center text-slate-600">
                    <Icons.History />
                  </div>
                  <h4 className="text-xl font-bold text-slate-400">No history found</h4>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[750px] md:min-w-full">
                    <thead>
                      <tr className="bg-[#050507] text-[#D4AF37] text-[10px] uppercase font-bold tracking-widest">
                        <th className="px-6 md:px-8 py-5 border-b border-[#1a1a1f]">Unit No.</th>
                        <th className="px-6 md:px-8 py-5 border-b border-[#1a1a1f]">Customer Details</th>
                        <th className="px-6 md:px-8 py-5 border-b border-[#1a1a1f]">Check-In Period</th>
                        <th className="px-6 md:px-8 py-5 border-b border-[#1a1a1f]">Booking Status</th>
                        <th className="px-6 md:px-8 py-5 border-b border-[#1a1a1f] text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1a1a1f]">
                      {bookings.map((booking) => (
                        <tr key={booking.id} className="hover:bg-[#D4AF37]/5 transition-colors group">
                          <td className="px-6 md:px-8 py-6">
                            <span className="bg-[#1c1c22] text-[#D4AF37] px-3 py-1.5 rounded-lg text-xs font-bold border border-[#D4AF37]/20">UNIT {booking.room}</span>
                          </td>
                          <td className="px-6 md:px-8 py-6">
                            <div className="font-bold text-slate-100 mb-0.5">{booking.customer}</div>
                            <div className="text-[10px] text-slate-500 uppercase tracking-tight font-bold">ID: {booking.bookingId || `REZ-${booking.id}`}</div>
                          </td>
                          <td className="px-6 md:px-8 py-6">
                            <div className="flex items-center gap-3">
                              <div className="text-xs font-bold text-slate-300">{booking.checkIn}</div>
                              <div className="w-4 h-px bg-slate-700"></div>
                              <div className="text-xs font-bold text-slate-300">{booking.checkOut}</div>
                            </div>
                          </td>
                          <td className="px-6 md:px-8 py-6">
                            <span className={`text-[9px] uppercase font-black px-3 py-1.5 rounded-lg border tracking-widest ${booking.isCompleted
                              ? "bg-slate-500/10 text-slate-400 border-slate-500/20"
                              : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                              }`}>
                              {booking.isCompleted ? "Completed" : "Active"}
                            </span>
                          </td>
                          <td className="px-6 md:px-8 py-6 text-right">
                            <div className="flex justify-end gap-2">
                              <button onClick={() => setViewedBooking(booking)} className="px-3 md:px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-bold transition-all">View</button>
                              <button className="px-3 md:px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-bold transition-all">Invoice</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Analytics Page */}
          {activeTab === "analytics" && (
            <div className="p-4 sm:p-6 md:p-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
                <div>
                  <h3 className="text-2xl font-serif text-white mb-1">Revenue & Booking Analytics</h3>
                  <p className="text-slate-500 text-sm">Insights on your property performance</p>
                </div>
                <div className="flex gap-1 bg-[#050507] p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
                  {["daily", "monthly", "yearly"].map((period) => (
                    <button
                      key={period}
                      onClick={() => setAnalyticsPeriod(period)}
                      className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${analyticsPeriod === period
                        ? "bg-[#D4AF37] text-[#070708] shadow-lg shadow-[#D4AF37]/20"
                        : "text-slate-500 hover:text-slate-300"
                        }`}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              </div>

              {analyticsLoading ? (
                <div className="p-20 text-center flex flex-col items-center gap-4">
                  <div className="w-10 h-10 border-4 border-[#D4AF37]/30 border-t-[#D4AF37] rounded-full animate-spin"></div>
                  <p className="text-slate-400 text-sm font-medium">Loading analytics...</p>
                </div>
              ) : !analyticsData ? (
                <div className="p-20 text-center flex flex-col items-center gap-4">
                  <div className="w-20 h-20 bg-slate-800/50 rounded-3xl flex items-center justify-center text-slate-600">
                    <Icons.Analytics />
                  </div>
                  <h4 className="text-xl font-bold text-slate-400">No data available</h4>
                </div>
              ) : (() => {
                const chartData =
                  analyticsPeriod === "daily" ? analyticsData.dailyData
                    : analyticsPeriod === "monthly" ? analyticsData.monthlyData
                      : analyticsData.yearlyData;

                const maxRevenue = Math.max(...(chartData.map((d) => d.revenue) || [0]), 1);
                const maxBookings = Math.max(...(chartData.map((d) => d.bookings) || [0]), 1);
                const avgRevenue = analyticsData.totalBookings > 0 ? Math.round(analyticsData.totalRevenue / analyticsData.totalBookings) : 0;
                const occupancyRate = analyticsData.totalRooms > 0 ? Math.round((analyticsData.occupiedRooms / analyticsData.totalRooms) * 100) : 0;

                const formatLabel = (dateStr) => {
                  if (analyticsPeriod === "daily") {
                    const d = new Date(dateStr + "T00:00:00");
                    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
                  }
                  if (analyticsPeriod === "monthly") {
                    const [y, m] = dateStr.split("-");
                    const d = new Date(Number(y), Number(m) - 1);
                    return d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
                  }
                  return dateStr;
                };

                return (
                  <>
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 mb-8 md:mb-10">
                      {[
                        { label: "Total Bookings", value: analyticsData.totalBookings, icon: "📋", color: "indigo", sub: `${analyticsData.activeBookings} active` },
                        { label: "Total Revenue", value: `Rs ${analyticsData.totalRevenue.toLocaleString()}`, icon: "💰", color: "emerald", sub: `Avg Rs ${avgRevenue.toLocaleString()}/booking` },
                        { label: "Occupancy Rate", value: `${occupancyRate}%`, icon: "📊", color: "amber", sub: `${analyticsData.occupiedRooms}/${analyticsData.totalRooms} rooms` },
                        { label: "Completed", value: analyticsData.completedBookings, icon: "✅", color: "rose", sub: `${analyticsData.activeBookings} still active` },
                      ].map((stat, i) => (
                        <div key={i} className="bg-[#0b0b0e] border border-slate-800 p-6 rounded-2xl relative overflow-hidden group hover:border-[#D4AF37]/20 transition-all">
                          <div className="absolute top-0 right-0 p-4 text-2xl opacity-20 group-hover:opacity-40 transition-opacity">{stat.icon}</div>
                          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">{stat.label}</p>
                          <p className="text-3xl font-serif text-white">{stat.value}</p>
                          <p className="text-slate-600 text-xs font-medium mt-2">{stat.sub}</p>
                        </div>
                      ))}
                    </div>

                    {/* Chart Area */}
                    {chartData.length === 0 ? (
                      <div className="p-12 text-center border-2 border-dashed border-slate-800 rounded-3xl">
                        <p className="text-slate-500 font-bold">No {analyticsPeriod} data to display yet</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Revenue Chart */}
                        <div className="bg-[#0b0b0e] border border-slate-800 rounded-2xl p-4 sm:p-6">
                          <h4 className="text-sm font-bold uppercase tracking-widest text-[#D4AF37] mb-6">Revenue ({analyticsPeriod})</h4>
                          <div className="flex items-end gap-1 sm:gap-2 h-56">
                            {chartData.slice(-12).map((item, i) => (
                              <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                                <span className="text-[8px] sm:text-[9px] font-bold text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Rs {item.revenue.toLocaleString()}</span>
                                <div className="w-full relative flex-1 flex items-end">
                                  <div
                                    className="w-full rounded-t-lg bg-gradient-to-t from-[#AA7C11] to-[#D4AF37] group-hover:from-emerald-500 group-hover:to-emerald-300 transition-all duration-500"
                                    style={{
                                      height: `${Math.max((item.revenue / maxRevenue) * 100, 4)}%`,
                                      minHeight: "4px",
                                    }}
                                  ></div>
                                </div>
                                <span className="text-[7px] sm:text-[8px] font-bold text-slate-600 text-center leading-tight">{formatLabel(item.date)}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Bookings Chart */}
                        <div className="bg-[#0b0b0e] border border-slate-800 rounded-2xl p-4 sm:p-6">
                          <h4 className="text-sm font-bold uppercase tracking-widest text-[#D4AF37] mb-6">Bookings ({analyticsPeriod})</h4>
                          <div className="flex items-end gap-1 sm:gap-2 h-56">
                            {chartData.slice(-12).map((item, i) => (
                              <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                                <span className="text-[8px] sm:text-[9px] font-bold text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">{item.bookings}</span>
                                <div className="w-full relative flex-1 flex items-end">
                                  <div
                                    className="w-full rounded-t-lg bg-gradient-to-t from-slate-700 to-[#D4AF37] transition-all duration-500"
                                    style={{
                                      height: `${Math.max((item.bookings / maxBookings) * 100, 4)}%`,
                                      minHeight: "4px",
                                    }}
                                  ></div>
                                </div>
                                <span className="text-[7px] sm:text-[8px] font-bold text-slate-600 text-center leading-tight">{formatLabel(item.date)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Detail Table */}
                    {chartData.length > 0 && (
                      <div className="mt-6 bg-[#0b0b0e] border border-slate-800 rounded-2xl overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse min-w-[700px] md:min-w-full">
                            <thead>
                              <tr className="bg-[#050507] text-[#D4AF37] text-[10px] uppercase font-bold tracking-widest">
                                <th className="px-6 py-4 border-b border-slate-800">Period</th>
                                <th className="px-6 py-4 border-b border-slate-800">Total Bookings</th>
                                <th className="px-6 py-4 border-b border-slate-800">Total Revenue</th>
                                <th className="px-6 py-4 border-b border-slate-800">Avg Revenue / Booking</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                              {chartData.map((item, i) => (
                                <tr key={i} className="hover:bg-[#D4AF37]/5 transition-colors">
                                  <td className="px-6 py-4">
                                    <span className="bg-slate-800 text-slate-100 px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-700">{formatLabel(item.date)}</span>
                                  </td>
                                  <td className="px-6 py-4 font-bold text-slate-200">{item.bookings}</td>
                                  <td className="px-6 py-4 font-bold text-emerald-400">Rs {item.revenue.toLocaleString()}</td>
                                  <td className="px-6 py-4 font-bold text-slate-400">Rs {item.bookings > 0 ? Math.round(item.revenue / item.bookings).toLocaleString() : 0}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          )}

          {/* Maintenance Page */}
          {activeTab === "maintenance" && (
            <div className="p-4 sm:p-6 md:p-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
                <div>
                  <h3 className="text-2xl font-serif text-white mb-1">Room Maintenance</h3>
                  <p className="text-slate-500 text-sm">Rooms requiring cleaning, inspection, or repairs after checkout</p>
                </div>
                <div className="flex items-center gap-3 self-start sm:self-auto">
                  <div className="bg-amber-500/10 border border-amber-500/20 px-4 py-2 rounded-xl">
                    <span className="text-amber-400 text-xs font-bold uppercase tracking-widest">{maintenanceRoomsCount} rooms pending</span>
                  </div>
                </div>
              </div>

              {rooms.filter(r => r.status === "Maintenance").length === 0 ? (
                <div className="p-20 text-center flex flex-col items-center gap-4 border-2 border-dashed border-[#1a1a1f] rounded-3xl">
                  <div className="w-20 h-20 bg-amber-500/10 rounded-3xl flex items-center justify-center text-4xl">
                    🔧
                  </div>
                  <h4 className="text-xl font-bold text-slate-400">No rooms under maintenance</h4>
                  <p className="text-slate-600 text-sm max-w-xs">All rooms are in great shape! Rooms will appear here automatically after guest checkout.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
                  {rooms.filter(r => r.status === "Maintenance").map((room) => (
                    <div key={room.id} className="bg-[#0b0b0e] border border-amber-500/20 rounded-2xl p-6 group hover:border-[#D4AF37]/30 hover:bg-[#D4AF37]/2 transition-all duration-500">
                      <div className="flex items-start justify-between mb-5">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-400 text-xl font-black group-hover:bg-amber-500/20 transition-colors">
                            {room.id}
                          </div>
                          <div>
                            <h4 className="font-serif font-bold text-white text-lg">Room {room.id}</h4>
                            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{room.type} Unit</p>
                          </div>
                        </div>
                        <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest">
                          Maintenance
                        </span>
                      </div>

                      <div className="flex items-center gap-3 mb-5 p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                        <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
                          <Icons.Maintenance />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Status</p>
                          <p className="text-sm font-bold text-amber-400">Awaiting inspection & cleaning</p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button onClick={() => handleMarkAvailable(room.id)} className="w-full bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white py-3 rounded-xl text-xs font-bold tracking-widest transition-all uppercase">
                          Mark Available
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Room Detail Modal / Booking Modal */}
      {selectedRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setSelectedRoom(null)}></div>
          <div className="relative bg-[#0c0c0e] border border-slate-800 w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl md:rounded-[2rem] p-5 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-300">
            <button
              onClick={() => setSelectedRoom(null)}
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-slate-700 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
            </button>

            <div className="flex items-center gap-4 mb-8">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black ${selectedRoom.status === "Available" ? "bg-emerald-500/20 text-emerald-400" : selectedRoom.status === "Booked" ? "bg-rose-500/20 text-rose-400" : "bg-amber-500/20 text-amber-400"
                }`}>
                {selectedRoom.id}
              </div>
              <div>
                <h3 className="text-2xl font-serif text-white">Room {selectedRoom.id}</h3>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">{selectedRoom.roomName || selectedRoom.type} · {selectedRoom.type}</p>
                <p className="text-[#D4AF37] font-bold text-[14px]">Rs {selectedRoom.price.toLocaleString()} / Night</p>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center p-4 bg-slate-950/50 rounded-2xl border border-slate-800">
                <span className="text-slate-400 text-sm font-medium">Status</span>
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${selectedRoom.status === "Available" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : selectedRoom.status === "Booked" ? "bg-rose-500/10 text-rose-400 border-rose-500/20" : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                  }`}>
                  {selectedRoom.status}
                </span>
              </div>

              {selectedRoom.status === "Available" ? (
                <div className="space-y-4">
                  <div className="p-4 bg-[#D4AF37]/5 rounded-2xl border border-[#D4AF37]/20">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] mb-2">Guest Name</p>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Enter guest name..."
                      className="w-full bg-[#050507] border border-slate-800 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                    />
                  </div>

                  <div className="p-4 bg-[#D4AF37]/5 rounded-2xl border border-[#D4AF37]/20">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] mb-2">Email</p>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="guest@email.com"
                      className="w-full bg-[#050507] border border-slate-800 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-[#D4AF37]/5 rounded-2xl border border-[#D4AF37]/20">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] mb-2">ID Card Number</p>
                      <input
                        type="text"
                        value={idCard}
                        onChange={(e) => setIdCard(e.target.value)}
                        placeholder="12345-6789012-3"
                        className="w-full bg-[#050507] border border-slate-800 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                      />
                    </div>
                    <div className="p-4 bg-[#D4AF37]/5 rounded-2xl border border-[#D4AF37]/20">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] mb-2">Phone Number</p>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="+92 300 1234567"
                        className="w-full bg-[#050507] border border-slate-800 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-[#D4AF37]/5 rounded-2xl border border-[#D4AF37]/20">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] mb-2">Check-In</p>
                      <input
                        type="date"
                        value={checkInDate}
                        onChange={(e) => setCheckInDate(e.target.value)}
                        className="w-full bg-[#050507] border border-slate-800 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#D4AF37] scheme-dark"
                      />
                    </div>
                    <div className="p-4 bg-[#D4AF37]/5 rounded-2xl border border-[#D4AF37]/20">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] mb-2">Check-Out</p>
                      <input
                        type="date"
                        value={checkOutDate}
                        onChange={(e) => setCheckOutDate(e.target.value)}
                        className="w-full bg-[#050507] border border-slate-800 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#D4AF37] scheme-dark"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-slate-950/50 rounded-2xl border border-slate-800">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Assigned Guest</p>
                  <p className="font-bold text-slate-200">Room is currently occupied</p>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button onClick={() => setSelectedRoom(null)} className="flex-1 bg-slate-800 hover:bg-slate-700 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all">Cancel</button>
              <button onClick={() => { setEditingRoom(selectedRoom); setSelectedRoom(null); }} className="flex-1 bg-slate-700 hover:bg-slate-600 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all">Edit</button>
              <button onClick={() => handleDeleteRoom(selectedRoom)} className="flex-1 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all">Delete</button>
              {selectedRoom.status === "Available" && (
                <button
                  onClick={async () => {
                    const result = await handleBookRoom();
                    if (result) {
                      resetBookingForm();
                      setSelectedRoom(null);
                      setActiveTab("bookings");
                    }
                  }}
                  disabled={!customerName || !idCard || !phoneNumber || !checkInDate || !checkOutDate}
                  className="flex-1 bg-[#D4AF37] hover:bg-[#bfa232] disabled:opacity-50 disabled:hover:bg-[#D4AF37] py-4 rounded-2xl font-bold text-xs uppercase tracking-widest text-[#070708] shadow-lg shadow-[#D4AF37]/10 transition-all"
                >
                  Confirm Booking
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Staff Modal */}
      {isStaffModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsStaffModalOpen(false)}></div>
          <form onSubmit={handleAddStaff} className="relative bg-[#0c0c0e] border border-slate-800 w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl md:rounded-[2rem] p-5 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-300">
            <h3 className="text-2xl font-serif text-white mb-6">New Team Member</h3>

            <div className="space-y-6 mb-8">
              <div className="flex flex-col items-center gap-4">
                <div className="relative group cursor-pointer" onClick={() => document.getElementById('staff-image').click()}>
                  <div className="w-24 h-24 rounded-full border-2 border-dashed border-slate-700 flex items-center justify-center overflow-hidden bg-slate-950/50 hover:border-[#D4AF37] transition-colors">
                    {newStaff.image ? (
                      <Image src={newStaff.image} alt="Preview" width={96} height={96} className="object-cover w-full h-full" />
                    ) : (
                      <div className="text-slate-600 flex flex-col items-center">
                        <Icons.Plus />
                        <span className="text-[8px] font-black uppercase mt-1">Photo</span>
                      </div>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-[#D4AF37]/0 group-hover:bg-[#D4AF37]/10 transition-colors rounded-full"></div>
                </div>
                <input
                  id="staff-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Profile Picture</p>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-2">Full Name</label>
                <input
                  type="text"
                  value={newStaff.name}
                  onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                  placeholder="e.g. Alex Johnson"
                  className="w-full bg-[#050507] border border-slate-800 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                  required
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-2">Assign Role</label>
                <select
                  value={newStaff.role}
                  onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })}
                  className="w-full bg-[#050507] border border-slate-800 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                >
                  <option>Receptionist</option>
                  <option>General Manager</option>
                  <option>Housekeeping</option>
                  <option>Security</option>
                  <option>Chef</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={() => setIsStaffModalOpen(false)} className="flex-1 bg-slate-800 hover:bg-slate-700 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all">Cancel</button>
              <button type="submit" className="flex-1 bg-[#D4AF37] hover:bg-[#bfa232] py-4 rounded-2xl font-bold text-xs uppercase tracking-widest text-[#070708] shadow-lg shadow-[#D4AF37]/10 transition-all">Add Member</button>
            </div>
          </form>
        </div>
      )}

      {/* Add Room Modal */}
      {isRoomModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsRoomModalOpen(false)}></div>
          <form onSubmit={handleAddRoom} className="relative bg-[#0c0c0e] border border-slate-800 w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl md:rounded-[2rem] p-5 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-300">
            <h3 className="text-2xl font-serif text-white mb-6">New Property Unit</h3>

            <div className="space-y-6 mb-8">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-2">Room Number</label>
                <input
                  type="number"
                  value={newRoom.id}
                  onChange={(e) => setNewRoom({ ...newRoom, id: e.target.value })}
                  placeholder="e.g. 101"
                  className="w-full bg-[#050507] border border-slate-800 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                  required
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-2">Room Category</label>
                <select
                  value={newRoom.type}
                  onChange={(e) => setNewRoom({ ...newRoom, type: e.target.value })}
                  className="w-full bg-[#050507] border border-slate-800 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                >
                  <option>Standard</option>
                  <option>Deluxe</option>
                  <option>Suite</option>
                  <option>Presidential</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-2">Price per Night</label>
                <input
                  type="number"
                  value={newRoom.price}
                  onChange={(e) => setNewRoom({ ...newRoom, price: e.target.value })}
                  placeholder="e.g. 5000"
                  className="w-full bg-[#050507] border border-slate-800 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                  required
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={() => setIsRoomModalOpen(false)} className="flex-1 bg-slate-800 hover:bg-slate-700 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all">Cancel</button>
              <button type="submit" className="flex-1 bg-[#D4AF37] hover:bg-[#bfa232] py-4 rounded-2xl font-bold text-xs uppercase tracking-widest text-[#070708] shadow-lg shadow-[#D4AF37]/10 transition-all">Create Room</button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Room Modal */}
      {editingRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setEditingRoom(null)}></div>
          <form onSubmit={handleEditRoom} className="relative bg-[#0c0c0e] border border-slate-800 w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl md:rounded-[2rem] p-5 sm:p-8 shadow-2xl">
            <h3 className="text-2xl font-serif text-white mb-6">Edit Room #{editingRoom.id}</h3>
            <div className="space-y-4 mb-8">
              <input type="text" value={editingRoom.roomName || ""} onChange={(e) => setEditingRoom({ ...editingRoom, roomName: e.target.value })} placeholder="Room Name" className="w-full bg-[#050507] border border-slate-800 rounded-xl py-3 px-4 text-sm text-white" />
              <select value={editingRoom.type} onChange={(e) => setEditingRoom({ ...editingRoom, type: e.target.value })} className="w-full bg-[#050507] border border-slate-800 rounded-xl py-3 px-4 text-sm text-white">
                <option>Standard</option><option>Deluxe</option><option>Suite</option><option>Presidential</option>
              </select>
              <input type="number" value={editingRoom.price} onChange={(e) => setEditingRoom({ ...editingRoom, price: e.target.value })} placeholder="Price per Night" className="w-full bg-[#050507] border border-slate-800 rounded-xl py-3 px-4 text-sm text-white" />
              <select value={editingRoom.status} onChange={(e) => setEditingRoom({ ...editingRoom, status: e.target.value })} className="w-full bg-[#050507] border border-slate-800 rounded-xl py-3 px-4 text-sm text-white">
                <option>Available</option><option>Booked</option><option>Maintenance</option>
              </select>
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => setEditingRoom(null)} className="flex-1 bg-slate-800 py-4 rounded-2xl font-bold text-xs uppercase">Cancel</button>
              <button type="submit" className="flex-1 bg-[#D4AF37] text-[#070708] py-4 rounded-2xl font-bold text-xs uppercase">Save</button>
            </div>
          </form>
        </div>
      )}

      {/* Booking Detail Modal */}
      {viewedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setViewedBooking(null)}></div>
          <div className="relative bg-[#0c0c0e] border border-slate-800 w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl md:rounded-[2rem] p-5 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-300">
            <button
              onClick={() => setViewedBooking(null)}
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-slate-700 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
            </button>

            <h3 className="text-2xl font-serif text-white mb-6">Booking Details</h3>

            <div className="space-y-6 mb-8">
              <div className="p-4 bg-slate-950/50 rounded-2xl border border-slate-800">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Guest Name</p>
                <p className="font-bold text-slate-200 text-lg">{viewedBooking.customer}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-950/50 rounded-2xl border border-slate-800">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Unit Number</p>
                  <p className="font-bold text-slate-200">Room {viewedBooking.room}</p>
                </div>
                <div className="p-4 bg-slate-950/50 rounded-2xl border border-slate-800">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Status</p>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest border border-slate-800 ${viewedBooking.isCompleted ? "bg-slate-500/10 text-slate-400 border-slate-500/20" : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"}`}>
                    {viewedBooking.isCompleted ? "Completed" : "Active"}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-slate-950/50 rounded-2xl border border-slate-800">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Booking ID</p>
                <p className="font-bold text-slate-200">{viewedBooking.bookingId || viewedBooking.id}</p>
              </div>

              <div className="p-4 bg-slate-950/50 rounded-2xl border border-slate-800">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">ID Card Number</p>
                <p className="font-bold text-slate-200">{viewedBooking.idCard || "Not Provided"}</p>
              </div>

              <div className="p-4 bg-slate-950/50 rounded-2xl border border-slate-800">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Phone Number</p>
                <p className="font-bold text-slate-200">{viewedBooking.phoneNumber || viewedBooking.phone || "Not Provided"}</p>
              </div>

              <div className="p-4 bg-slate-950/50 rounded-2xl border border-slate-800">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Total Price</p>
                <p className="font-bold text-emerald-400">Rs {(viewedBooking.totalPrice || 0).toLocaleString()}</p>
              </div>

              <div className="p-4 bg-slate-950/50 rounded-2xl border border-slate-800">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Email</p>
                <p className="font-bold text-slate-200">{viewedBooking.email || "Not Provided"}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-950/50 rounded-2xl border border-slate-800">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Check-In</p>
                  <p className="font-bold text-slate-200">{viewedBooking.checkIn}</p>
                </div>
                <div className="p-4 bg-slate-950/50 rounded-2xl border border-slate-800">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Check-Out</p>
                  <p className="font-bold text-slate-200">{viewedBooking.checkOut}</p>
                </div>
              </div>
            </div>

            <button onClick={() => setViewedBooking(null)} className="w-full bg-[#D4AF37] hover:bg-[#bfa232] py-4 rounded-2xl font-bold text-xs uppercase tracking-widest text-[#070708] shadow-lg shadow-[#D4AF37]/10 transition-all">Close Details</button>
          </div>
        </div>
      )}

    </div>
  );
}

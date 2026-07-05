"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useBooking } from "@/context/BookingContext";
import { X, Calendar, User, CreditCard, CheckCircle, ArrowRight, ArrowLeft } from "lucide-react";

export default function BookingModal({ onClose }) {
  const {
    selectedRoom,
    customerName,
    setCustomerName,
    email,
    setEmail,
    idCard,
    setIdCard,
    phoneNumber,
    setPhoneNumber,
    guests,
    setGuests,
    checkInDate,
    setCheckInDate,
    checkOutDate,
    setCheckOutDate,
    handleBookRoom,
    resetBookingForm,
    today,
    threeDaysLater
  } = useBooking();

  const [step, setStep] = useState(1);
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card"); // "card" | "reception"
  // Store a snapshot of the room and booking data for the confirmation screen,
  // so it survives even if selectedRoom gets cleared from context.
  const [confirmedData, setConfirmedData] = useState(null);
  const roomSnapshot = useRef(null);

  // Reset fields on mount and snapshot the room
  useEffect(() => {
    setCustomerName("");
    setEmail("");
    setIdCard("");
    setPhoneNumber("");
    setCheckInDate(today);
    setCheckOutDate(threeDaysLater);
    if (selectedRoom) {
      roomSnapshot.current = { ...selectedRoom };
    }
  }, []);

  // Use the snapshot if selectedRoom has been cleared (e.g. after booking)
  const room = selectedRoom || roomSnapshot.current;
  if (!room) return null;

  // Calculate nights and price
  const start = new Date(checkInDate);
  const end = new Date(checkOutDate);
  const timeDiff = end.getTime() - start.getTime();
  const nightCount = Math.max(Math.ceil(timeDiff / (1000 * 3600 * 24)), 1);

  const subtotal = room.price * nightCount;
  const resortFee = Math.round(subtotal * 0.05);
  const vatTax = Math.round(subtotal * 0.10);
  const grandTotal = subtotal + resortFee + vatTax;

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Snapshot current form data for the confirmation screen
    const snapshot = {
      room: { ...room },
      customerName,
      email,
      checkInDate,
      checkOutDate,
      guests,
      grandTotal,
      paymentMethod,
    };

    // Mimic processing delay
    setTimeout(async () => {
      try {
        const result = await handleBookRoom(paymentMethod === "card" ? "Paid" : "Unpaid");
        if (result) {
          setConfirmedData({ ...snapshot, bookingId: result.bookingId });
          setStep(4);
        }
      } catch (err) {
        console.error(err);
        alert("There was an issue processing your booking.");
      } finally {
        setIsSubmitting(false);
      }
    }, 1500);
  };

  const stepsData = [
    { title: "Dates", icon: <Calendar className="w-4 h-4" /> },
    { title: "Guest Details", icon: <User className="w-4 h-4" /> },
    { title: "Payment", icon: <CreditCard className="w-4 h-4" /> },
    { title: "Confirmed", icon: <CheckCircle className="w-4 h-4" /> },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Darkened backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
        onClick={step === 4 ? () => { resetBookingForm(); onClose(); } : undefined}
      />

      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative bg-charcoal border border-[#1a1a1f] w-full max-w-4xl rounded-none shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12"
      >
        {/* Close Button */}
        {step !== 4 && (
          <button
            onClick={onClose}
            className="absolute top-6 right-6 z-10 w-8 h-8 flex items-center justify-center border border-slate-900 hover:border-gold hover:text-gold transition-colors cursor-pointer text-[#a19f9a]"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Column 1: Booking Process Wizard (Left Side - 7 Cols) */}
        <div className="lg:col-span-7 p-8 md:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#15151a]">
          <div>
            {/* Header */}
            <div className="mb-8">
              <span className="text-gold text-[9px] uppercase tracking-[0.2em] font-semibold block mb-1">
                Luxury Suite Reservation
              </span>
              <h3 className="text-2xl font-serif text-white tracking-wide">
                Room #{room.id}
              </h3>
            </div>

            {/* Stepper Progress Bar */}
            <div className="flex items-center justify-between mb-10 relative">
              <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-[#1a1a23] -translate-y-1/2 z-0" />
              {stepsData.map((s, index) => {
                const stepNum = index + 1;
                const isActive = step === stepNum;
                const isCompleted = step > stepNum;

                return (
                  <div key={index} className="flex flex-col items-center gap-2 relative z-10">
                    <div
                      className={`w-8 h-8 rounded-none flex items-center justify-center text-xs transition-all duration-500 border ${
                        isActive
                          ? "bg-gold border-gold text-[#070708] font-bold scale-110 shadow-lg shadow-gold/20"
                          : isCompleted
                          ? "bg-[#1c1c22] border-gold text-gold"
                          : "bg-charcoal border-slate-800 text-slate-500"
                      }`}
                    >
                      {isCompleted ? <CheckCircle className="w-4 h-4" /> : s.icon}
                    </div>
                    <span
                      className={`text-[9px] uppercase tracking-widest font-semibold transition-all ${
                        isActive ? "text-gold" : isCompleted ? "text-[#fbfaf7]" : "text-slate-500"
                      }`}
                    >
                      {s.title}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Steps Content */}
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h4 className="text-sm font-serif text-white uppercase tracking-widest border-b border-slate-900 pb-2">
                    Select Reservation Dates
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] uppercase tracking-widest text-[#a19f9a] font-semibold">
                        Check-In Date
                      </label>
                      <input
                        type="date"
                        min={today}
                        value={checkInDate}
                        onChange={(e) => setCheckInDate(e.target.value)}
                        className="bg-[#070708] border border-slate-900 focus:border-gold py-3 px-4 text-xs text-white focus:outline-none scheme-dark w-full"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] uppercase tracking-widest text-[#a19f9a] font-semibold">
                        Check-Out Date
                      </label>
                      <input
                        type="date"
                        min={checkInDate}
                        value={checkOutDate}
                        onChange={(e) => setCheckOutDate(e.target.value)}
                        className="bg-[#070708] border border-slate-900 focus:border-gold py-3 px-4 text-xs text-white focus:outline-none scheme-dark w-full"
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-gold-muted border border-gold/10">
                    <p className="text-[11px] text-[#f3e5be] leading-relaxed">
                      * Standard check-in starts at 2:00 PM. Early check-in requests are subject to room availability upon arrival. Check-out time is 12:00 PM.
                    </p>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h4 className="text-sm font-serif text-white uppercase tracking-widest border-b border-slate-900 pb-2">
                    Guest Information
                  </h4>

                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase tracking-widest text-[#a19f9a] font-semibold">
                      Full Guest Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sir Robert Sterling"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="bg-[#070708] border border-slate-900 focus:border-gold py-3 px-4 text-xs text-white focus:outline-none w-full"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] uppercase tracking-widest text-[#a19f9a] font-semibold">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. guest@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-[#070708] border border-slate-900 focus:border-gold py-3 px-4 text-xs text-white focus:outline-none w-full"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] uppercase tracking-widest text-[#a19f9a] font-semibold">
                        Number of Guests
                      </label>
                      <select
                        value={guests}
                        onChange={(e) => setGuests(Number(e.target.value))}
                        className="bg-[#070708] border border-slate-900 focus:border-gold py-3 px-4 text-xs text-white focus:outline-none w-full"
                      >
                        {[1, 2, 3, 4, 5, 6].map((n) => (
                          <option key={n} value={n}>{n} Guest{n > 1 ? "s" : ""}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] uppercase tracking-widest text-[#a19f9a] font-semibold">
                        ID Card / Passport
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 42101-1234567-9"
                        value={idCard}
                        onChange={(e) => setIdCard(e.target.value)}
                        className="bg-[#070708] border border-slate-900 focus:border-gold py-3 px-4 text-xs text-white focus:outline-none w-full"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] uppercase tracking-widest text-[#a19f9a] font-semibold">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. +92 300 1234567"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="bg-[#070708] border border-slate-900 focus:border-gold py-3 px-4 text-xs text-white focus:outline-none w-full"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h4 className="text-sm font-serif text-white uppercase tracking-widest border-b border-slate-900 pb-2">
                    Payment Method
                  </h4>

                  {/* Payment Method Toggle */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("card")}
                      className={`flex flex-col items-center gap-2 p-4 border transition-all duration-300 ${
                        paymentMethod === "card"
                          ? "border-gold bg-gold/10 text-gold"
                          : "border-slate-800 bg-[#070708] text-slate-500 hover:border-slate-600"
                      }`}
                    >
                      <CreditCard className="w-6 h-6" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Pay by Card</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("reception")}
                      className={`flex flex-col items-center gap-2 p-4 border transition-all duration-300 ${
                        paymentMethod === "reception"
                          ? "border-gold bg-gold/10 text-gold"
                          : "border-slate-800 bg-[#070708] text-slate-500 hover:border-slate-600"
                      }`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                      <span className="text-[10px] font-bold uppercase tracking-widest">Pay at Reception</span>
                    </button>
                  </div>

                  {/* Card Payment Form */}
                  {paymentMethod === "card" && (
                    <>
                      {/* Visual Premium Card mockup */}
                      <div className="w-full h-40 bg-gradient-to-br from-slate-900 to-black border border-gold/20 p-6 flex flex-col justify-between shadow-lg relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-28 h-28 bg-gold/5 rounded-full blur-3xl pointer-events-none" />
                        <div className="flex justify-between items-start">
                          <span className="text-[10px] tracking-[0.2em] font-serif text-gold">GRAND STAY PLATINUM</span>
                          <CreditCard className="w-8 h-8 text-gold" />
                        </div>
                        <div>
                          <p className="text-sm tracking-[0.15em] font-mono text-white">
                            {cardNumber ? cardNumber : "•••• •••• •••• ••••"}
                          </p>
                        </div>
                        <div className="flex justify-between items-end">
                          <div>
                            <p className="text-[7px] text-slate-500 uppercase tracking-widest">Card Holder</p>
                            <p className="text-[10px] uppercase font-mono text-gold truncate max-w-[150px]">
                              {cardHolder ? cardHolder : "Valued Member"}
                            </p>
                          </div>
                          <div>
                            <p className="text-[7px] text-slate-500 uppercase tracking-widest text-right">Expires</p>
                            <p className="text-[10px] font-mono text-gold text-right">
                              {cardExpiry ? cardExpiry : "MM/YY"}
                            </p>
                          </div>
                        </div>
                      </div>

                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[9px] uppercase tracking-widest text-[#a19f9a] font-semibold">
                              Card Number
                            </label>
                            <input
                              type="text"
                              maxLength="19"
                              placeholder="4000 1234 5678 9010"
                              value={cardNumber}
                              onChange={(e) => setCardNumber(e.target.value.replace(/[^\d\s]/g, ""))}
                              className="bg-[#070708] border border-slate-900 focus:border-gold py-2.5 px-3 text-xs text-white focus:outline-none w-full"
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[9px] uppercase tracking-widest text-[#a19f9a] font-semibold">
                              Cardholder Name
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. ROBERT STERLING"
                              value={cardHolder}
                              onChange={(e) => setCardHolder(e.target.value)}
                              className="bg-[#070708] border border-slate-900 focus:border-gold py-2.5 px-3 text-xs text-white focus:outline-none w-full"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[9px] uppercase tracking-widest text-[#a19f9a] font-semibold">
                              Expiration Date
                            </label>
                            <input
                              type="text"
                              maxLength="5"
                              placeholder="MM/YY"
                              value={cardExpiry}
                              onChange={(e) => setCardExpiry(e.target.value)}
                              className="bg-[#070708] border border-slate-900 focus:border-gold py-2.5 px-3 text-xs text-white focus:outline-none w-full"
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[9px] uppercase tracking-widest text-[#a19f9a] font-semibold">
                              Security Code (CVV)
                            </label>
                            <input
                              type="password"
                              maxLength="3"
                              placeholder="•••"
                              value={cardCvv}
                              onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ""))}
                              className="bg-[#070708] border border-slate-900 focus:border-gold py-2.5 px-3 text-xs text-white focus:outline-none w-full"
                            />
                          </div>
                        </div>
                      </form>
                    </>
                  )}

                  {/* Pay at Reception Info */}
                  {paymentMethod === "reception" && (
                    <div className="p-5 bg-gold/5 border border-gold/20 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold shrink-0">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
                        </div>
                        <div>
                          <p className="text-[11px] font-bold text-gold uppercase tracking-widest">Pay at Reception</p>
                          <p className="text-[10px] text-[#a19f9a] mt-0.5 leading-relaxed">
                            Your room is reserved. Complete payment at the front desk upon arrival.
                          </p>
                        </div>
                      </div>
                      <div className="border-t border-gold/10 pt-3 space-y-1.5">
                        <div className="flex justify-between text-[10px]">
                          <span className="text-slate-500 uppercase tracking-wider">Reservation Status</span>
                          <span className="text-emerald-400 font-bold">✓ Confirmed</span>
                        </div>
                        <div className="flex justify-between text-[10px]">
                          <span className="text-slate-500 uppercase tracking-wider">Payment Due</span>
                          <span className="text-gold font-bold">At Check-In</span>
                        </div>
                        <div className="flex justify-between text-[10px]">
                          <span className="text-slate-500 uppercase tracking-wider">Accepted Methods</span>
                          <span className="text-white font-bold">Cash · Card · Transfer</span>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {step === 4 && confirmedData && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-6 space-y-6"
                >
                  <div className="w-16 h-16 rounded-full bg-gold-muted border border-gold/30 flex items-center justify-center mx-auto text-gold">
                    <CheckCircle className="w-8 h-8" />
                  </div>

                  <div>
                    <span className="text-gold text-[10px] uppercase tracking-widest font-semibold block mb-1">
                      Reservation Secured
                    </span>
                    <h4 className="text-2xl font-serif text-white">
                      Welcome to the Grand Stay
                    </h4>
                    <p className="text-xs text-[#a19f9a] mt-2 max-w-sm mx-auto leading-relaxed">
                      Your premium suite has been booked. A confirmation invoice and digital key details have been registered under your profile.
                    </p>
                  </div>

                  <div className="p-5 border border-gold/15 bg-gold-muted/5 inline-block text-left max-w-sm w-full mx-auto">
                    <div className="flex justify-between text-[10px] text-slate-500 uppercase tracking-wider mb-2">
                      <span>Confirmation No:</span>
                      <span className="text-white font-mono font-bold">{confirmedData.bookingId || `REZ-GS${confirmedData.room.id}x9B`}</span>
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500 uppercase tracking-wider mb-2">
                      <span>Suite Reserved:</span>
                      <span className="text-gold font-bold">Luxury {confirmedData.room.type} Suite</span>
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500 uppercase tracking-wider mb-2">
                      <span>Check-In:</span>
                      <span className="text-white font-bold">{confirmedData.checkInDate}</span>
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500 uppercase tracking-wider mb-2">
                      <span>Check-Out:</span>
                      <span className="text-white font-bold">{confirmedData.checkOutDate}</span>
                    </div>
                    <div className="flex justify-between text-[10px] text-[#D4AF37] uppercase tracking-wider pt-2 border-t border-slate-900 font-bold">
                      <span>{confirmedData.paymentMethod === "reception" ? "Total Due (at Reception):" : "Total Paid:"}</span>
                      <span>Rs {confirmedData.grandTotal.toLocaleString()}</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Stepper Navigation Buttons */}
          <div className="mt-8 pt-6 border-t border-slate-900 flex justify-between gap-4">
            {step > 1 && step < 4 ? (
              <button
                type="button"
                onClick={prevStep}
                className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-[#a19f9a] hover:text-[#fbfaf7] transition-all"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                disabled={step === 2 && (!customerName || !idCard || !phoneNumber)}
                className="bg-gold disabled:opacity-50 text-obsidian text-[10px] font-bold uppercase tracking-widest px-6 py-3 transition-all flex items-center gap-2 hover:bg-[#bfa232] cursor-pointer"
              >
                Continue <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : step === 3 ? (
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={
                  isSubmitting ||
                  (paymentMethod === "card" && (!cardNumber || !cardHolder || !cardExpiry || !cardCvv))
                }
                className="bg-gold disabled:opacity-50 text-obsidian text-[10px] font-bold uppercase tracking-widest px-6 py-3 transition-all flex items-center justify-center gap-2 hover:bg-[#bfa232] w-full md:w-auto cursor-pointer shadow-lg shadow-gold/10"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-3 h-3 border-2 border-obsidian border-t-transparent rounded-full animate-spin" />
                    Securing Stay...
                  </>
                ) : (
                  <>
                    {paymentMethod === "reception" ? "Confirm Reservation" : "Guarantee Stay"} <CheckCircle className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => { resetBookingForm(); onClose(); }}
                className="w-full bg-[#1c1c22] border border-slate-800 text-gold text-[10px] font-bold uppercase tracking-widest py-3 text-center transition-all hover:bg-gold hover:text-[#070708] cursor-pointer"
              >
                Return to Directory
              </button>
            )}
          </div>
        </div>

        {/* Column 2: Invoice Receipt Breakdown Summary (Right Side - 5 Cols) */}
        <div className="lg:col-span-5 bg-[#0a0a0d] p-8 md:p-10 flex flex-col justify-between">
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] font-serif text-gold border-b border-slate-900 pb-3 mb-6">
              Reservation Summary
            </h4>

            {/* Selected Room mini Card */}
            <div className="mb-8 flex gap-4 items-center">
              <div className="w-16 h-12 bg-slate-900 border border-slate-800 relative img-zoom-hover">
                <Image
                  src="/suite.png"
                  alt="Suite Preview"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                  <span className="text-xs font-serif text-white font-bold leading-tight">
                    Luxury {room.type} Suite
                  </span>
                  <p className="text-[9px] uppercase tracking-widest text-[#a19f9a] mt-1">
                    Property Unit #{room.id}
                  </p>
              </div>
            </div>

            {/* Pricing details */}
            <div className="space-y-3.5 text-xs">
              <div className="flex justify-between items-center text-[#a19f9a]">
                <span>Rate per Night:</span>
                <span className="font-semibold text-white">Rs {room.price.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-[#a19f9a]">
                <span>Number of Nights:</span>
                <span className="font-semibold text-white">{nightCount} nights</span>
              </div>
              <div className="flex justify-between items-center text-[#a19f9a] border-t border-slate-900/60 pt-3">
                <span>Room Subtotal:</span>
                <span className="font-semibold text-white">Rs {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-[#a19f9a]">
                <span>Resort Service Fee (5%):</span>
                <span className="font-semibold text-white">Rs {resortFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-[#a19f9a]">
                <span>VAT & Luxury Tax (10%):</span>
                <span className="font-semibold text-white">Rs {vatTax.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Grand Total */}
          <div className="mt-8 pt-6 border-t border-slate-900 flex justify-between items-end">
            <div>
              <span className="text-[8px] uppercase tracking-widest text-slate-500 font-bold block mb-1">
                Estimated Total
              </span>
              <span className="text-2xl font-serif text-gold">
                Rs {grandTotal.toLocaleString()}
              </span>
            </div>
            <span className="text-[9px] text-[#a19f9a] uppercase tracking-widest font-semibold font-mono">
              PKR Currency 
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

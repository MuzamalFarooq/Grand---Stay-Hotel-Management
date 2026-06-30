import mongoose from "mongoose";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

import Room from "../models/Room.js";
import Booking from "../models/Booking.js";
import Customer from "../models/Customer.js";
import Staff from "../models/Staff.js";
import Service from "../models/Service.js";
import SpaBooking from "../models/SpaBooking.js";
import RestaurantReservation from "../models/RestaurantReservation.js";
import MaintenanceRequest from "../models/MaintenanceRequest.js";
import HousekeepingSchedule from "../models/HousekeepingSchedule.js";
import Inventory from "../models/Inventory.js";
import Payment from "../models/Payment.js";
import Invoice from "../models/Invoice.js";

import {
  generateRooms,
  STAFF_DATA,
  CUSTOMER_DATA,
  SERVICES_DATA,
  INVENTORY_DATA,
} from "./seed-data.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadEnv() {
  try {
    const envPath = resolve(__dirname, "../.env");
    const content = readFileSync(envPath, "utf-8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      const val = trimmed.slice(eq + 1).trim();
      if (!process.env[key]) process.env[key] = val;
    }
  } catch {
    // .env may not exist when MONGODB_URI is set externally
  }
}

function addDays(dateStr, days) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

async function seed() {
  loadEnv();

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI is not set. Add it to .env or export it.");
    process.exit(1);
  }

  console.log("Connecting to MongoDB...");
  await mongoose.connect(uri);
  console.log("Connected.");

  console.log("Clearing existing data...");
  await Promise.all([
    Room.deleteMany({}),
    Booking.deleteMany({}),
    Customer.deleteMany({}),
    Staff.deleteMany({}),
    Service.deleteMany({}),
    SpaBooking.deleteMany({}),
    RestaurantReservation.deleteMany({}),
    MaintenanceRequest.deleteMany({}),
    HousekeepingSchedule.deleteMany({}),
    Inventory.deleteMany({}),
    Payment.deleteMany({}),
    Invoice.deleteMany({}),
  ]);

  console.log("Seeding 40 luxury rooms...");
  const roomDocs = await Room.insertMany(generateRooms());

  console.log("Seeding 20 staff members...");
  const staffDocs = await Staff.insertMany(
    STAFF_DATA.map((s) => ({
      ...s,
      image: `https://i.pravatar.cc/150?u=${s.name.replace(/\s+/g, "")}`,
      status: "Active",
    }))
  );

  console.log("Seeding 10 customers...");
  const customerDocs = await Customer.insertMany(CUSTOMER_DATA);

  console.log("Seeding services...");
  const serviceDocs = await Service.insertMany(SERVICES_DATA);

  console.log("Seeding inventory...");
  await Inventory.insertMany(INVENTORY_DATA);

  const today = new Date().toISOString().split("T")[0];

  console.log("Seeding demo bookings...");
  const bookingConfigs = [
    { customerIdx: 0, roomIdx: 2, checkIn: today, nights: 3, guests: 2, paymentStatus: "Paid", bookingStatus: "CheckedIn" },
    { customerIdx: 1, roomIdx: 8, checkIn: addDays(today, 2), nights: 4, guests: 2, paymentStatus: "Paid", bookingStatus: "Confirmed" },
    { customerIdx: 2, roomIdx: 20, checkIn: addDays(today, -5), nights: 3, guests: 3, paymentStatus: "Paid", bookingStatus: "CheckedOut", isCompleted: true },
    { customerIdx: 3, roomIdx: 28, checkIn: addDays(today, 5), nights: 2, guests: 4, paymentStatus: "Partial", bookingStatus: "Confirmed" },
    { customerIdx: 4, roomIdx: 36, checkIn: addDays(today, -10), nights: 5, guests: 2, paymentStatus: "Paid", bookingStatus: "CheckedOut", isCompleted: true },
    { customerIdx: 5, roomIdx: 5, checkIn: addDays(today, 1), nights: 2, guests: 1, paymentStatus: "Unpaid", bookingStatus: "Confirmed" },
    { customerIdx: 6, roomIdx: 15, checkIn: addDays(today, -3), nights: 2, guests: 2, paymentStatus: "Paid", bookingStatus: "CheckedOut", isCompleted: true },
    { customerIdx: 7, roomIdx: 32, checkIn: today, checkInOffset: 0, nights: 7, guests: 4, paymentStatus: "Paid", bookingStatus: "CheckedIn" },
  ];

  const bookingDocs = [];
  for (const cfg of bookingConfigs) {
    const customer = customerDocs[cfg.customerIdx];
    const room = roomDocs[cfg.roomIdx];
    const checkIn = cfg.checkIn;
    const checkOut = addDays(checkIn, cfg.nights);
    const totalPrice = room.pricePerNight * cfg.nights;

    const booking = await Booking.create({
      customerName: customer.fullName,
      email: customer.email,
      phone: customer.phone,
      phoneNumber: customer.phone,
      roomId: room._id,
      roomNumber: room.roomNumber,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      guests: cfg.guests,
      bookingStatus: cfg.bookingStatus,
      paymentStatus: cfg.paymentStatus,
      totalPrice,
      specialRequests: cfg.guests > 2 ? "Extra pillows requested" : "",
      customerId: customer._id,
      isCompleted: cfg.isCompleted || false,
    });

    bookingDocs.push(booking);

    await Customer.findByIdAndUpdate(customer._id, {
      $push: { bookingHistory: booking._id },
      $inc: { loyaltyPoints: Math.floor(totalPrice / 100) },
    });

    if (cfg.bookingStatus === "CheckedIn" || cfg.bookingStatus === "Confirmed") {
      await Room.findByIdAndUpdate(room._id, { availabilityStatus: "Booked" });
    }
    if (cfg.bookingStatus === "CheckedOut" && cfg.isCompleted) {
      await Room.findByIdAndUpdate(room._id, { availabilityStatus: "Maintenance" });
    }

    await Payment.create({
      bookingId: booking._id,
      customerName: customer.fullName,
      amount: cfg.paymentStatus === "Partial" ? Math.floor(totalPrice * 0.5) : totalPrice,
      method: "Credit Card",
      status: cfg.paymentStatus === "Unpaid" ? "Pending" : "Completed",
      transactionRef: `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    });

    await Invoice.create({
      bookingId: booking._id,
      customerName: customer.fullName,
      customerEmail: customer.email,
      items: [
        {
          description: `${room.roomName} (${room.roomType}) - ${cfg.nights} nights`,
          quantity: cfg.nights,
          unitPrice: room.pricePerNight,
          total: totalPrice,
        },
      ],
      subtotal: totalPrice,
      tax: Math.round(totalPrice * 0.1),
      total: totalPrice + Math.round(totalPrice * 0.1),
      status: cfg.paymentStatus === "Unpaid" ? "Sent" : "Paid",
    });
  }

  console.log("Seeding spa bookings...");
  await SpaBooking.insertMany([
    {
      customerName: customerDocs[0].fullName,
      email: customerDocs[0].email,
      phone: customerDocs[0].phone,
      serviceId: serviceDocs[0]._id,
      serviceName: serviceDocs[0].name,
      appointmentDate: addDays(today, 1),
      appointmentTime: "14:00",
      duration: "60 min",
      price: 8500,
      status: "Scheduled",
    },
    {
      customerName: customerDocs[2].fullName,
      email: customerDocs[2].email,
      phone: customerDocs[2].phone,
      serviceId: serviceDocs[3]._id,
      serviceName: serviceDocs[3].name,
      appointmentDate: addDays(today, 3),
      appointmentTime: "16:30",
      duration: "120 min",
      price: 22000,
      status: "Scheduled",
    },
  ]);

  console.log("Seeding restaurant reservations...");
  await RestaurantReservation.insertMany([
    {
      customerName: customerDocs[1].fullName,
      email: customerDocs[1].email,
      phone: customerDocs[1].phone,
      partySize: 4,
      reservationDate: today,
      reservationTime: "19:30",
      tableNumber: "T-12",
      specialRequests: "Window seat, anniversary celebration",
      status: "Confirmed",
    },
    {
      customerName: customerDocs[4].fullName,
      email: customerDocs[4].email,
      phone: customerDocs[4].phone,
      partySize: 2,
      reservationDate: addDays(today, 1),
      reservationTime: "20:00",
      tableNumber: "T-05",
      status: "Confirmed",
    },
  ]);

  console.log("Seeding maintenance requests...");
  const maintenanceRoom = roomDocs.find((r) => r.availabilityStatus === "Maintenance") || roomDocs[20];
  await MaintenanceRequest.insertMany([
    {
      roomId: maintenanceRoom._id,
      roomNumber: maintenanceRoom.roomNumber,
      issueType: "Cleaning",
      description: "Post-checkout deep cleaning required",
      priority: "Medium",
      assignedTo: staffDocs[6]._id,
      status: "In Progress",
      reportedBy: "Housekeeping",
    },
    {
      roomId: roomDocs[10]._id,
      roomNumber: roomDocs[10].roomNumber,
      issueType: "HVAC",
      description: "AC unit making unusual noise in room 304",
      priority: "High",
      assignedTo: staffDocs[13]._id,
      status: "Open",
      reportedBy: "Guest",
    },
  ]);

  console.log("Seeding housekeeping schedules...");
  const hkStaff = staffDocs.filter((s) => s.department === "Housekeeping");
  await HousekeepingSchedule.insertMany(
    roomDocs.slice(0, 8).map((room, i) => ({
      roomId: room._id,
      roomNumber: room.roomNumber,
      assignedStaffId: hkStaff[i % hkStaff.length]._id,
      assignedStaffName: hkStaff[i % hkStaff.length].name,
      scheduledDate: today,
      scheduledTime: `${9 + (i % 4)}:00`,
      taskType: room.availabilityStatus === "Maintenance" ? "Turnover" : "Daily Cleaning",
      status: i < 3 ? "Completed" : "Pending",
    }))
  );

  console.log("\nSeed completed successfully!");
  console.log(`  Rooms:      ${roomDocs.length}`);
  console.log(`  Staff:      ${staffDocs.length}`);
  console.log(`  Customers:  ${customerDocs.length}`);
  console.log(`  Bookings:   ${bookingDocs.length}`);
  console.log(`  Services:   ${serviceDocs.length}`);

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});

import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Booking from "@/models/Booking";
import Room from "@/models/Room";
import Customer from "@/models/Customer";
import Staff from "@/models/Staff";
import Payment from "@/models/Payment";
import { calcNights } from "@/lib/availability";

export async function GET() {
  try {
    await dbConnect();

    const [bookings, rooms, customers, staff, payments] = await Promise.all([
      Booking.find({}).lean(),
      Room.find({}).lean(),
      Customer.countDocuments(),
      Staff.countDocuments({ status: "Active" }),
      Payment.aggregate([
        { $match: { status: "Completed" } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
    ]);

    const priceMap = {};
    rooms.forEach((room) => {
      priceMap[room.roomNumber] = room.pricePerNight || room.price || 0;
    });

    let totalBookings = bookings.length;
    let totalRevenue = 0;
    let completedBookings = 0;
    let activeBookings = 0;

    const byDay = {};
    const byMonth = {};
    const byYear = {};

    bookings.forEach((b) => {
      const revenue = b.totalPrice || calcNights(b.checkInDate, b.checkOutDate) * (priceMap[b.roomNumber] || 0);
      totalRevenue += revenue;

      if (b.isCompleted || b.bookingStatus === "CheckedOut") completedBookings++;
      else if (b.bookingStatus !== "Cancelled") activeBookings++;

      const dateStr = b.checkInDate;
      const [year, month] = dateStr.split("-");
      const dayKey = dateStr;
      const monthKey = `${year}-${month}`;
      const yearKey = year;

      const roomPrice = priceMap[b.roomNumber] || 0;
      let tier = "low";
      if (roomPrice >= 25000 && roomPrice <= 50000) tier = "medium";
      else if (roomPrice > 50000) tier = "high";

      for (const [key, bucket] of [
        [dayKey, byDay],
        [monthKey, byMonth],
        [yearKey, byYear],
      ]) {
        if (!bucket[key]) bucket[key] = { date: key, bookings: 0, revenue: 0, tiers: { low: 0, medium: 0, high: 0 } };
        bucket[key].bookings += 1;
        bucket[key].revenue += revenue;
        bucket[key].tiers[tier] += 1;
      }
    });

    const dailyData = Object.values(byDay).sort((a, b) => a.date.localeCompare(b.date));
    const monthlyData = Object.values(byMonth).sort((a, b) => a.date.localeCompare(b.date));
    const yearlyData = Object.values(byYear).sort((a, b) => a.date.localeCompare(b.date));

    const roomsByType = rooms.reduce((acc, r) => {
      acc[r.roomType] = (acc[r.roomType] || 0) + 1;
      return acc;
    }, {});

    return NextResponse.json({
      success: true,
      data: {
        totalBookings,
        totalRevenue,
        completedBookings,
        activeBookings,
        totalRooms: rooms.length,
        occupiedRooms: rooms.filter((r) => r.availabilityStatus === "Booked" || r.status === "Booked").length,
        totalCustomers: customers,
        activeStaff: staff,
        totalPayments: payments[0]?.total || 0,
        roomsByType,
        dailyData,
        monthlyData,
        yearlyData,
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

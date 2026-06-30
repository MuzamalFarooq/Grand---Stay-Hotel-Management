import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Booking from "@/models/Booking";
import Room from "@/models/Room";
import Customer from "@/models/Customer";
import { isRoomAvailable, calcTotalPrice } from "@/lib/availability";
import { serializeBooking } from "@/lib/serializers";

export async function GET() {
  try {
    await dbConnect();

    const today = new Date().toISOString().split("T")[0];
    const expiredBookings = await Booking.find({
      isCompleted: false,
      checkOutDate: { $lt: today },
      bookingStatus: { $nin: ["Cancelled"] },
    });

    for (const booking of expiredBookings) {
      booking.isCompleted = true;
      booking.bookingStatus = "CheckedOut";
      await booking.save();

      await Room.findOneAndUpdate(
        { roomNumber: booking.roomNumber },
        { availabilityStatus: "Maintenance" }
      );
    }

    const bookings = await Booking.find({}).sort({ createdAt: -1 }).populate("roomId");
    return NextResponse.json({
      success: true,
      data: bookings.map(serializeBooking),
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();

    const room = body.roomId
      ? await Room.findById(body.roomId)
      : await Room.findOne({ roomNumber: body.roomNumber });

    if (!room) {
      return NextResponse.json({ success: false, error: "Room not found" }, { status: 404 });
    }

    if (room.availabilityStatus !== "Available" && !body.forceBook) {
      return NextResponse.json({ success: false, error: "Room is not available" }, { status: 400 });
    }

    const available = await isRoomAvailable(room._id, body.checkInDate, body.checkOutDate);
    if (!available) {
      return NextResponse.json(
        { success: false, error: "Room is already booked for the selected dates" },
        { status: 409 }
      );
    }

    const totalPrice = body.totalPrice || calcTotalPrice(room.pricePerNight, body.checkInDate, body.checkOutDate);
    const phone = body.phone || body.phoneNumber || "";

    let customer = null;
    if (body.email) {
      customer = await Customer.findOneAndUpdate(
        { email: body.email },
        {
          fullName: body.customerName,
          phone,
          $setOnInsert: { address: body.address || "" },
        },
        { upsert: true, new: true }
      );
    }

    const booking = await Booking.create({
      customerName: body.customerName,
      email: body.email || "",
      phone,
      phoneNumber: phone,
      idCard: body.idCard || "",
      roomId: room._id,
      roomNumber: room.roomNumber,
      checkInDate: body.checkInDate,
      checkOutDate: body.checkOutDate,
      guests: body.guests || 1,
      bookingStatus: body.bookingStatus || "Confirmed",
      paymentStatus: body.paymentStatus || body.status || "Paid",
      totalPrice,
      specialRequests: body.specialRequests || "",
      customerId: customer?._id,
    });

    if (customer) {
      await Customer.findByIdAndUpdate(customer._id, {
        $push: { bookingHistory: booking._id },
        $inc: { loyaltyPoints: Math.floor(totalPrice / 100) },
      });
    }

    await Room.findByIdAndUpdate(room._id, { availabilityStatus: "Booked" });

    return NextResponse.json({ success: true, data: serializeBooking(booking) }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

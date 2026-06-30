import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Booking from "@/models/Booking";
import Room from "@/models/Room";
import { serializeBooking } from "@/lib/serializers";

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const booking = await Booking.findById(id).populate("roomId");

    if (!booking) {
      return NextResponse.json({ success: false, error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: serializeBooking(booking) });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();

    const booking = await Booking.findById(id);
    if (!booking) {
      return NextResponse.json({ success: false, error: "Booking not found" }, { status: 404 });
    }

    // Checkout flow
    if (body.action === "checkout" || body.isCompleted) {
      booking.isCompleted = true;
      booking.bookingStatus = "CheckedOut";
      await booking.save();

      await Room.findOneAndUpdate(
        { roomNumber: booking.roomNumber },
        { availabilityStatus: "Maintenance" }
      );

      return NextResponse.json({ success: true, data: serializeBooking(booking) });
    }

    // Cancel booking
    if (body.bookingStatus === "Cancelled") {
      booking.bookingStatus = "Cancelled";
      booking.isCompleted = true;
      await booking.save();

      await Room.findOneAndUpdate(
        { roomNumber: booking.roomNumber },
        { availabilityStatus: "Available" }
      );

      return NextResponse.json({ success: true, data: serializeBooking(booking) });
    }

    // General update
    const allowed = [
      "customerName", "email", "phone", "checkInDate", "checkOutDate",
      "guests", "bookingStatus", "paymentStatus", "totalPrice", "specialRequests",
    ];
    for (const key of allowed) {
      if (body[key] !== undefined) booking[key] = body[key];
    }
    if (body.phone) booking.phoneNumber = body.phone;
    if (body.paymentStatus) {
      booking.status = body.paymentStatus === "Paid" ? "Paid" : "Unpaid";
    }
    await booking.save();

    return NextResponse.json({ success: true, data: serializeBooking(booking) });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;

    const booking = await Booking.findByIdAndDelete(id);
    if (!booking) {
      return NextResponse.json({ success: false, error: "Booking not found" }, { status: 404 });
    }

    await Room.findOneAndUpdate(
      { roomNumber: booking.roomNumber },
      { availabilityStatus: "Available" }
    );

    return NextResponse.json({ success: true, data: serializeBooking(booking) });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import SpaBooking from "@/models/SpaBooking";

export async function GET() {
  try {
    await dbConnect();
    const bookings = await SpaBooking.find({}).sort({ appointmentDate: -1 });
    return NextResponse.json({ success: true, data: bookings });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const booking = await SpaBooking.create(body);
    return NextResponse.json({ success: true, data: booking }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

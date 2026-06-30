import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import RestaurantReservation from "@/models/RestaurantReservation";

export async function GET() {
  try {
    await dbConnect();
    const reservations = await RestaurantReservation.find({}).sort({ reservationDate: -1 });
    return NextResponse.json({ success: true, data: reservations });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const reservation = await RestaurantReservation.create(body);
    return NextResponse.json({ success: true, data: reservation }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

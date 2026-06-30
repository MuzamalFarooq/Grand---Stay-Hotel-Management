import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Payment from "@/models/Payment";

export async function GET() {
  try {
    await dbConnect();
    const payments = await Payment.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: payments });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const payment = await Payment.create(body);
    return NextResponse.json({ success: true, data: payment }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Customer from "@/models/Customer";
import { serializeCustomer } from "@/lib/serializers";

export async function GET() {
  try {
    await dbConnect();
    const customers = await Customer.find({})
      .populate("bookingHistory")
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: customers.map(serializeCustomer),
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();

    const existing = await Customer.findOne({ email: body.email });
    if (existing) {
      return NextResponse.json({ success: false, error: "Customer with this email already exists" }, { status: 400 });
    }

    const customer = await Customer.create(body);
    return NextResponse.json({ success: true, data: serializeCustomer(customer) }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

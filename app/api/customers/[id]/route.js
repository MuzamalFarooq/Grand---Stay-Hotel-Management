import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Customer from "@/models/Customer";
import { serializeCustomer } from "@/lib/serializers";

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const customer = await Customer.findById(id).populate("bookingHistory");

    if (!customer) {
      return NextResponse.json({ success: false, error: "Customer not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: serializeCustomer(customer) });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();

    const customer = await Customer.findByIdAndUpdate(id, body, { new: true, runValidators: true });

    if (!customer) {
      return NextResponse.json({ success: false, error: "Customer not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: serializeCustomer(customer) });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;

    const customer = await Customer.findByIdAndDelete(id);
    if (!customer) {
      return NextResponse.json({ success: false, error: "Customer not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: serializeCustomer(customer) });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

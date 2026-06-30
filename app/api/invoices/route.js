import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Invoice from "@/models/Invoice";

export async function GET() {
  try {
    await dbConnect();
    const invoices = await Invoice.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: invoices });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const invoice = await Invoice.create(body);
    return NextResponse.json({ success: true, data: invoice }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

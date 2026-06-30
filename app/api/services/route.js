import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Service from "@/models/Service";

export async function GET() {
  try {
    await dbConnect();
    const services = await Service.find({ isActive: true }).sort({ category: 1, name: 1 });
    return NextResponse.json({ success: true, data: services });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const service = await Service.create(body);
    return NextResponse.json({ success: true, data: service }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

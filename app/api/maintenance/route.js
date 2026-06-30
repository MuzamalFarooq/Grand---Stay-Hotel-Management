import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import MaintenanceRequest from "@/models/MaintenanceRequest";

export async function GET() {
  try {
    await dbConnect();
    const requests = await MaintenanceRequest.find({})
      .populate("assignedTo", "name role")
      .sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: requests });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const requestDoc = await MaintenanceRequest.create(body);
    return NextResponse.json({ success: true, data: requestDoc }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

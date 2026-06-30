import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import HousekeepingSchedule from "@/models/HousekeepingSchedule";

export async function GET() {
  try {
    await dbConnect();
    const schedules = await HousekeepingSchedule.find({})
      .populate("assignedStaffId", "name role")
      .sort({ scheduledDate: -1 });
    return NextResponse.json({ success: true, data: schedules });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const schedule = await HousekeepingSchedule.create(body);
    return NextResponse.json({ success: true, data: schedule }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

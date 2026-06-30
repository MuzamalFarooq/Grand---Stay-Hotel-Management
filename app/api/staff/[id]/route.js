import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Staff from "@/models/Staff";
import { serializeStaff } from "@/lib/serializers";

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const member = await Staff.findById(id);

    if (!member) {
      return NextResponse.json({ success: false, error: "Staff member not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: serializeStaff(member) });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();

    const member = await Staff.findByIdAndUpdate(id, body, { new: true, runValidators: true });

    if (!member) {
      return NextResponse.json({ success: false, error: "Staff member not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: serializeStaff(member) });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;

    const member = await Staff.findByIdAndDelete(id);
    if (!member) {
      return NextResponse.json({ success: false, error: "Staff member not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: serializeStaff(member) });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

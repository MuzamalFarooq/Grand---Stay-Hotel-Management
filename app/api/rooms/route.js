import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Room from "@/models/Room";
import { serializeRoom } from "@/lib/serializers";

export async function GET() {
  try {
    await dbConnect();
    const rooms = await Room.find({}).sort({ roomNumber: 1 });
    return NextResponse.json({
      success: true,
      data: rooms.map(serializeRoom),
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();

    const existingRoom = await Room.findOne({ roomNumber: body.roomNumber });
    if (existingRoom) {
      return NextResponse.json({ success: false, error: "Room number already exists" }, { status: 400 });
    }

    const roomData = {
      roomNumber: body.roomNumber,
      roomName: body.roomName || `Room ${body.roomNumber}`,
      roomType: body.roomType || "Standard",
      description: body.description || "",
      pricePerNight: body.pricePerNight || body.price || 0,
      maxGuests: body.maxGuests || 2,
      bedType: body.bedType || "Queen",
      sizeSqFt: body.sizeSqFt || 300,
      amenities: body.amenities || ["WiFi", "AC", "TV"],
      images: body.images || [],
      availabilityStatus: body.availabilityStatus || body.status || "Available",
      floor: body.floor || parseInt(body.roomNumber?.[0]) || 1,
      rating: body.rating || 4.5,
    };

    const room = await Room.create(roomData);
    return NextResponse.json({ success: true, data: serializeRoom(room) }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function PUT(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { roomNumber, status, availabilityStatus, ...updates } = body;

    if (!roomNumber && !body._id) {
      return NextResponse.json({ success: false, error: "Room number or ID is required" }, { status: 400 });
    }

    const filter = body._id ? { _id: body._id } : { roomNumber };

    if (status || availabilityStatus) {
      updates.availabilityStatus = availabilityStatus || status;
    }
    if (updates.price) {
      updates.pricePerNight = updates.price;
      delete updates.price;
    }
    if (updates.type) {
      updates.roomType = updates.type;
      delete updates.type;
    }

    const room = await Room.findOneAndUpdate(filter, updates, { new: true, runValidators: true });

    if (!room) {
      return NextResponse.json({ success: false, error: "Room not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: serializeRoom(room) });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const roomNumber = searchParams.get("roomNumber");

    if (!id && !roomNumber) {
      return NextResponse.json({ success: false, error: "Room ID or number is required" }, { status: 400 });
    }

    const filter = id ? { _id: id } : { roomNumber };
    const room = await Room.findOneAndDelete(filter);

    if (!room) {
      return NextResponse.json({ success: false, error: "Room not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: serializeRoom(room) });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema(
  {
    roomNumber: {
      type: String,
      required: [true, "Please provide a room number"],
      unique: true,
    },
    roomName: {
      type: String,
      required: [true, "Please provide a room name"],
    },
    roomType: {
      type: String,
      enum: ["Standard", "Deluxe", "Suite", "Presidential"],
      required: [true, "Please provide a room type"],
    },
    description: {
      type: String,
      default: "",
    },
    pricePerNight: {
      type: Number,
      required: [true, "Please provide a price per night"],
    },
    maxGuests: {
      type: Number,
      default: 2,
    },
    bedType: {
      type: String,
      default: "Queen",
    },
    sizeSqFt: {
      type: Number,
      default: 300,
    },
    amenities: {
      type: [String],
      default: [],
    },
    images: {
      type: [String],
      default: [],
    },
    availabilityStatus: {
      type: String,
      enum: ["Available", "Booked", "Maintenance"],
      default: "Available",
    },
    floor: {
      type: Number,
      default: 1,
    },
    rating: {
      type: Number,
      default: 4.5,
      min: 0,
      max: 5,
    },
  },
  { timestamps: true }
);

RoomSchema.virtual("price").get(function () {
  return this.pricePerNight;
});

RoomSchema.virtual("status").get(function () {
  return this.availabilityStatus;
});

RoomSchema.set("toJSON", { virtuals: true });
RoomSchema.set("toObject", { virtuals: true });

export default mongoose.models.Room || mongoose.model("Room", RoomSchema);

import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      unique: true,
    },
    customerName: {
      type: String,
      required: [true, "Please provide a customer name"],
    },
    email: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      required: [true, "Please provide a phone number"],
    },
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: [true, "Please provide a room"],
    },
    roomNumber: {
      type: String,
      required: [true, "Please provide a room number"],
    },
    checkInDate: {
      type: String,
      required: [true, "Please provide a check-in date"],
    },
    checkOutDate: {
      type: String,
      required: [true, "Please provide a check-out date"],
    },
    guests: {
      type: Number,
      default: 1,
    },
    bookingStatus: {
      type: String,
      enum: ["Confirmed", "CheckedIn", "CheckedOut", "Cancelled"],
      default: "Confirmed",
    },
    paymentStatus: {
      type: String,
      enum: ["Paid", "Unpaid", "Partial", "Refunded"],
      default: "Paid",
    },
    totalPrice: {
      type: Number,
      default: 0,
    },
    specialRequests: {
      type: String,
      default: "",
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
    },
    // Legacy fields kept for backward compatibility
    idCard: {
      type: String,
      default: "",
    },
    phoneNumber: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["Paid", "Unpaid"],
      default: "Paid",
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

BookingSchema.pre("save", async function () {
  if (!this.bookingId) {
    const year = new Date().getFullYear();
    const random = Math.floor(10000 + Math.random() * 90000);
    this.bookingId = `GS-${year}-${random}`;
  }
  if (!this.phone && this.phoneNumber) {
    this.phone = this.phoneNumber;
  }
  if (!this.phoneNumber && this.phone) {
    this.phoneNumber = this.phone;
  }
  if (this.paymentStatus === "Paid" || this.paymentStatus === "Partial") {
    this.status = "Paid";
  } else {
    this.status = "Unpaid";
  }
});

export default mongoose.models.Booking || mongoose.model("Booking", BookingSchema);

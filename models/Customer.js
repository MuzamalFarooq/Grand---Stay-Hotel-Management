import mongoose from "mongoose";

const CustomerSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Please provide a full name"],
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
    },
    phone: {
      type: String,
      required: [true, "Please provide a phone number"],
    },
    address: {
      type: String,
      default: "",
    },
    bookingHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking",
      },
    ],
    loyaltyPoints: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Customer || mongoose.model("Customer", CustomerSchema);

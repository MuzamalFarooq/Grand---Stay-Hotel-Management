import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema(
  {
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
    customerName: { type: String, required: true },
    amount: { type: Number, required: true },
    method: {
      type: String,
      enum: ["Cash", "Credit Card", "Debit Card", "Bank Transfer", "Online"],
      default: "Credit Card",
    },
    status: {
      type: String,
      enum: ["Pending", "Completed", "Failed", "Refunded"],
      default: "Completed",
    },
    transactionRef: { type: String, default: "" },
    paidAt: { type: Date, default: Date.now },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.models.Payment || mongoose.model("Payment", PaymentSchema);

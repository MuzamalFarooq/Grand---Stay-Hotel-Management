import mongoose from "mongoose";

const SpaBookingSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service" },
    serviceName: { type: String, required: true },
    appointmentDate: { type: String, required: true },
    appointmentTime: { type: String, required: true },
    duration: { type: String, default: "60 min" },
    price: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["Scheduled", "Completed", "Cancelled"],
      default: "Scheduled",
    },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.models.SpaBooking || mongoose.model("SpaBooking", SpaBookingSchema);

import mongoose from "mongoose";

const RestaurantReservationSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    partySize: { type: Number, default: 2 },
    reservationDate: { type: String, required: true },
    reservationTime: { type: String, required: true },
    tableNumber: { type: String, default: "" },
    specialRequests: { type: String, default: "" },
    status: {
      type: String,
      enum: ["Confirmed", "Seated", "Completed", "Cancelled", "No-Show"],
      default: "Confirmed",
    },
  },
  { timestamps: true }
);

export default mongoose.models.RestaurantReservation ||
  mongoose.model("RestaurantReservation", RestaurantReservationSchema);

import mongoose from "mongoose";

const ServiceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["Spa", "Dining", "Concierge", "Transport", "Laundry", "Other"],
      default: "Other",
    },
    description: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      default: 0,
    },
    duration: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Service || mongoose.model("Service", ServiceSchema);

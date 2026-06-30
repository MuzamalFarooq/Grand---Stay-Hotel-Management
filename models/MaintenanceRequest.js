import mongoose from "mongoose";

const MaintenanceRequestSchema = new mongoose.Schema(
  {
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: "Room" },
    roomNumber: { type: String, required: true },
    issueType: {
      type: String,
      enum: ["Plumbing", "Electrical", "HVAC", "Furniture", "Cleaning", "Other"],
      default: "Other",
    },
    description: { type: String, required: true },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Urgent"],
      default: "Medium",
    },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "Staff" },
    status: {
      type: String,
      enum: ["Open", "In Progress", "Resolved", "Closed"],
      default: "Open",
    },
    reportedBy: { type: String, default: "Staff" },
    resolvedAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.models.MaintenanceRequest ||
  mongoose.model("MaintenanceRequest", MaintenanceRequestSchema);

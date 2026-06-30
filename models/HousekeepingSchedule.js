import mongoose from "mongoose";

const HousekeepingScheduleSchema = new mongoose.Schema(
  {
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: "Room" },
    roomNumber: { type: String, required: true },
    assignedStaffId: { type: mongoose.Schema.Types.ObjectId, ref: "Staff" },
    assignedStaffName: { type: String, default: "" },
    scheduledDate: { type: String, required: true },
    scheduledTime: { type: String, default: "10:00" },
    taskType: {
      type: String,
      enum: ["Daily Cleaning", "Deep Clean", "Turnover", "Inspection"],
      default: "Daily Cleaning",
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed", "Skipped"],
      default: "Pending",
    },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.models.HousekeepingSchedule ||
  mongoose.model("HousekeepingSchedule", HousekeepingScheduleSchema);

import mongoose from "mongoose";

const StaffSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
    },
    role: {
      type: String,
      required: [true, "Please provide a role"],
    },
    department: {
      type: String,
      default: "Operations",
    },
    salary: {
      type: Number,
      default: 0,
    },
    shift: {
      type: String,
      enum: ["Morning", "Afternoon", "Night", "Rotating"],
      default: "Morning",
    },
    phone: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      default: "",
    },
    joiningDate: {
      type: String,
      default: () => new Date().toISOString().split("T")[0],
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Staff || mongoose.model("Staff", StaffSchema);

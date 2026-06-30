import mongoose from "mongoose";

const InventorySchema = new mongoose.Schema(
  {
    itemName: { type: String, required: true },
    category: {
      type: String,
      enum: ["Linens", "Toiletries", "Minibar", "Cleaning", "Kitchen", "Office", "Other"],
      default: "Other",
    },
    quantity: { type: Number, default: 0 },
    unit: { type: String, default: "units" },
    reorderLevel: { type: Number, default: 10 },
    supplier: { type: String, default: "" },
    unitCost: { type: Number, default: 0 },
    lastRestocked: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.models.Inventory || mongoose.model("Inventory", InventorySchema);

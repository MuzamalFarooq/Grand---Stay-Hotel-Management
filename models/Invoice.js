import mongoose from "mongoose";

const InvoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: { type: String, unique: true },
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
    customerName: { type: String, required: true },
    customerEmail: { type: String, default: "" },
    items: [
      {
        description: String,
        quantity: Number,
        unitPrice: Number,
        total: Number,
      },
    ],
    subtotal: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["Draft", "Sent", "Paid", "Overdue", "Cancelled"],
      default: "Paid",
    },
    issuedAt: { type: Date, default: Date.now },
    dueDate: { type: String, default: "" },
  },
  { timestamps: true }
);

InvoiceSchema.pre("save", async function () {
  if (!this.invoiceNumber) {
    const year = new Date().getFullYear();
    const random = Math.floor(1000 + Math.random() * 9000);
    this.invoiceNumber = `INV-${year}-${random}`;
  }
});

export default mongoose.models.Invoice || mongoose.model("Invoice", InvoiceSchema);

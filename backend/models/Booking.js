import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    serviceType: { type: String, required: true },
    serviceTitle: { type: String, required: true },
    from: String,
    to: String,
    date: { type: Date, required: true },
    people: { type: Number, required: true },
    contact: { type: String, required: true },
    guestName: { type: String, default: "" },
    guestEmail: { type: String, default: "" },
    status: {
      type: String,
      enum: ["Pending", "Success"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);

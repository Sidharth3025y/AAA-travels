import mongoose from "mongoose";

const contactMessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, default: "", trim: true },
    packageTitle: { type: String, default: "", trim: true },
    preferredDate: { type: String, default: "", trim: true },
    people: { type: String, default: "", trim: true },
    message: { type: String, required: true, trim: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("ContactMessage", contactMessageSchema);

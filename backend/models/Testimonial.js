import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    location: { type: String, default: "Google Review", trim: true },
    quote: { type: String, required: true, trim: true },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    reviewDate: { type: String, default: "", trim: true },
    avatar: { type: String, default: "", trim: true },
    source: { type: String, default: "Google", trim: true },
  },
  { timestamps: true }
);

export default mongoose.model("Testimonial", testimonialSchema);

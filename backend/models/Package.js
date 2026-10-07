import mongoose from "mongoose";

const packageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    image: { type: String, required: true },
    summary: { type: String, default: "", trim: true },
    overview: { type: String, required: true, trim: true },
    highlights: { type: [String], default: [] },
    itinerary: { type: [String], default: [] },
    includes: { type: [String], default: [] },
    duration: { type: Number, required: true, min: 1 },
    destination: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: ["trekking", "adventure", "heli", "tour"],
    },
    priceNpr: { type: Number, required: true, min: 0 },
    priceUsd: { type: Number, required: true, min: 0 },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Package", packageSchema);

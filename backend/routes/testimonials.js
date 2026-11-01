import express from "express";
import Testimonial from "../models/Testimonial.js";
import { authMiddleware, adminMiddleware } from "../middleware/auth.js";

const router = express.Router();

const DEFAULT_REVIEWS = [
  {
    name: "Sarah Mitchell",
    location: "United Kingdom",
    quote:
      "Our Annapurna trek was organised with real care. Guides were professional, hotels were well chosen, and the team stayed reachable the whole time.",
    rating: 5,
    reviewDate: "March 2026",
    source: "Google",
  },
  {
    name: "Rajesh Sharma",
    location: "India",
    quote:
      "AAA Travels handled our Pokhara family trip and domestic flights smoothly. Clear communication and honest advice from start to finish.",
    rating: 5,
    reviewDate: "January 2026",
    source: "Google",
  },
  {
    name: "Emily Chen",
    location: "Singapore",
    quote:
      "The Everest heli tour was the highlight of our Nepal holiday. Booking was simple and the itinerary was exactly as promised.",
    rating: 5,
    reviewDate: "November 2025",
    source: "Google",
  },
  {
    name: "Lukas Weber",
    location: "Germany",
    quote:
      "Excellent local knowledge and a well-paced Langtang itinerary. We felt looked after without being rushed. Highly recommended.",
    rating: 5,
    reviewDate: "October 2025",
    source: "Google",
  },
];

router.get("/", async (_req, res) => {
  try {
    let reviews = await Testimonial.find().sort({ createdAt: -1 });
    if (reviews.length === 0) {
      reviews = await Testimonial.insertMany(DEFAULT_REVIEWS);
    }
    res.json(reviews);
  } catch (err) {
    console.error("Testimonials fetch error:", err);
    res.status(500).json({ msg: "Failed to fetch testimonials" });
  }
});

router.post("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { name, location, quote, rating, reviewDate, avatar, source } = req.body;
    if (!name || !quote) {
      return res.status(400).json({ msg: "Name and review text are required" });
    }
    const created = await Testimonial.create({
      name: String(name).trim(),
      location: location ? String(location).trim() : "Google Review",
      quote: String(quote).trim(),
      rating: Math.min(5, Math.max(1, Number(rating) || 5)),
      reviewDate: reviewDate ? String(reviewDate).trim() : "",
      avatar: avatar ? String(avatar).trim() : "",
      source: source ? String(source).trim() : "Google",
    });
    res.status(201).json(created);
  } catch (err) {
    console.error("Testimonial create error:", err);
    res.status(500).json({ msg: "Failed to create testimonial" });
  }
});

router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const deleted = await Testimonial.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ msg: "Testimonial not found" });
    res.json({ msg: "Testimonial deleted" });
  } catch (err) {
    console.error("Testimonial delete error:", err);
    res.status(500).json({ msg: "Failed to delete testimonial" });
  }
});

export default router;

import express from "express";
import ContactMessage from "../models/ContactMessage.js";
import { authMiddleware, adminMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.post("/messages", async (req, res) => {
  try {
    const { name, email, message, phone, packageTitle, preferredDate, people } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ msg: "name, email, and message are required" });
    }

    const saved = await ContactMessage.create({
      name,
      email,
      message,
      phone: phone || "",
      packageTitle: packageTitle || "",
      preferredDate: preferredDate || "",
      people: people ? String(people) : "",
    });
    res.status(201).json({ msg: "Message sent successfully!", contactMessage: saved });
  } catch (err) {
    console.error("Contact message save error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

router.get("/messages", authMiddleware, adminMiddleware, async (_req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    console.error("Contact messages fetch error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

router.delete("/messages/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const deleted = await ContactMessage.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ msg: "Message not found" });
    res.json({ msg: "Message deleted successfully" });
  } catch (err) {
    console.error("Contact message delete error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

export default router;

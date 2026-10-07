import express from "express";
import Booking from "../models/Booking.js";
import { authMiddleware, adminMiddleware } from "../middleware/auth.js";

const router = express.Router();

// ================= CREATE FLIGHT BOOKING =================

router.post("/flight", async (req, res) => {
  try {
    const { from, to, date, people, contact, guestName, guestEmail } = req.body;

    if (!from || !to || !date || !people || !contact) {
      return res.status(400).json({
        msg: "Departure, arrival, date, passengers and contact are required",
      });
    }

    const booking = await Booking.create({
      serviceType: "flight",
      serviceTitle: `Flight: ${from} → ${to}`,
      from: String(from).trim(),
      to: String(to).trim(),
      date,
      people: Number(people),
      contact: String(contact).trim(),
      guestName: guestName ? String(guestName).trim() : "",
      guestEmail: guestEmail ? String(guestEmail).trim() : "",
      status: "Pending",
    });

    res.status(201).json(booking);
  } catch (err) {
    console.error("Flight booking error:", err);

    res.status(500).json({
      msg: "Flight booking failed",
    });
  }
});

// ================= GET ALL BOOKINGS =================

router.get("/all", authMiddleware, adminMiddleware, async (_req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    console.error("Fetch bookings error:", err);

    res.status(500).json({
      msg: "Server error",
    });
  }
});

// ================= UPDATE BOOKING STATUS =================

router.put("/:id/status", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { status } = req.body;

    // Only these two statuses can be saved.
    // Delete is handled separately by the DELETE route.
    if (!["Pending", "Success"].includes(status)) {
      return res.status(400).json({
        msg: "Invalid booking status",
      });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      {
        status,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!booking) {
      return res.status(404).json({
        msg: "Booking not found",
      });
    }

    res.json({
      msg: "Booking status updated successfully",
      booking,
    });
  } catch (err) {
    console.error("Update booking status error:", err);

    res.status(500).json({
      msg: "Failed to update booking status",
    });
  }
});

// ================= DELETE BOOKING =================

router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);

    if (!booking) {
      return res.status(404).json({
        msg: "Booking not found",
      });
    }

    res.json({
      msg: "Booking deleted successfully",
      id: req.params.id,
    });
  } catch (err) {
    console.error("Delete booking error:", err);

    res.status(500).json({
      msg: "Failed to delete booking",
    });
  }
});

export default router;

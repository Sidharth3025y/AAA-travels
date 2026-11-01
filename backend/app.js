import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.js";
import bookingRoutes from "./routes/booking.js";
import contactRoutes from "./routes/contact.js";
import packageRoutes from "./routes/packages.js";
import testimonialRoutes from "./routes/testimonials.js";

dotenv.config();

const required = ["MONGO_URI", "JWT_SECRET"];
const missing = required.filter((key) => !process.env[key]);
if (missing.length) {
  console.error(`Missing required environment variables: ${missing.join(", ")}`);
  process.exit(1);
}

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

if (process.env.COOKIE_SECURE === "true") {
  app.set("trust proxy", 1);
}

const clientOrigins = String(process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim().replace(/\/$/, ""))
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || clientOrigins.includes(origin))
        return callback(null, true);
      return callback(null, false);
    },
    credentials: true,
  }),
);
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    db: mongoose.connection.readyState === 1,
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/packages", packageRoutes);
app.use("/api/testimonials", testimonialRoutes);

app.use("/api", (_req, res) => {
  res.status(404).json({ msg: "Not found" });
});

app.use((err, _req, res, next) => {
  if (res.headersSent) return next(err);
  console.error(err);
  res.status(500).json({ msg: "Server error" });
});

const PORT = process.env.PORT || 5000;

try {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
} catch (err) {
  console.error("MongoDB connection failed:", err);
  process.exit(1);
}

import express from "express";
import Package from "../models/Package.js";
import { authMiddleware, adminMiddleware } from "../middleware/auth.js";
import { uploadPackageImage } from "../middleware/upload.js";
import { parseLines, uniqueSlug } from "../utils/helpers.js";

const router = express.Router();

function bodyFrom(req) {
  const highlights = parseLines(req.body.highlights);
  const itinerary = parseLines(req.body.itinerary);
  const includes = parseLines(req.body.includes);
  const featured =
    req.body.featured === true ||
    req.body.featured === "true" ||
    req.body.featured === "on";

  return {
    name: req.body.name?.trim(),
    summary: req.body.summary?.trim() || "",
    overview: req.body.overview?.trim(),
    highlights,
    itinerary,
    includes,
    duration: Number(req.body.duration ?? req.body.days),
    destination: (req.body.destination || req.body.country)?.trim(),
    category: req.body.category,
    priceNpr: Number(req.body.priceNpr),
    priceUsd: Number(req.body.priceUsd),
    featured,
  };
}

router.get("/", async (_req, res) => {
  try {
    const packages = await Package.find().sort({ featured: -1, createdAt: -1 });
    res.json(packages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to fetch packages" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const pkg = mongooseId(id)
      ? await Package.findOne({ $or: [{ _id: id }, { slug: id }] })
      : await Package.findOne({ slug: id });
    if (!pkg) return res.status(404).json({ msg: "Package not found" });
    res.json(pkg);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to fetch package" });
  }
});

function mongooseId(id) {
  return /^[a-fA-F0-9]{24}$/.test(id);
}

router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  uploadPackageImage,
  async (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ msg: "Package image is required (JPG/PNG)" });
      const data = bodyFrom(req);
      if (!data.name || !data.overview || !data.destination || !data.category) {
        return res.status(400).json({ msg: "Missing required fields" });
      }
      if (!data.duration || Number.isNaN(data.priceNpr) || Number.isNaN(data.priceUsd)) {
        return res.status(400).json({ msg: "Duration and prices must be valid numbers" });
      }
      data.slug = await uniqueSlug(Package, data.name);
      data.image = `/uploads/${req.file.filename}`;
      const created = await Package.create(data);
      res.status(201).json(created);
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Failed to create package" });
    }
  }
);

router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  uploadPackageImage,
  async (req, res) => {
    try {
      const pkg = await Package.findById(req.params.id);
      if (!pkg) return res.status(404).json({ msg: "Package not found" });
      const data = bodyFrom(req);
      if (!data.name || !data.overview || !data.destination || !data.category) {
        return res.status(400).json({ msg: "Missing required fields" });
      }
      if (!data.duration || Number.isNaN(data.priceNpr) || Number.isNaN(data.priceUsd)) {
        return res.status(400).json({ msg: "Duration and prices must be valid numbers" });
      }
      if (data.name && data.name !== pkg.name) {
        data.slug = await uniqueSlug(Package, data.name, pkg._id);
      }
      if (req.file) data.image = `/uploads/${req.file.filename}`;
      Object.assign(pkg, data);
      await pkg.save();
      res.json(pkg);
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Failed to update package" });
    }
  }
);

router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const deleted = await Package.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ msg: "Package not found" });
    res.json({ msg: "Package deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to delete package" });
  }
});

export default router;

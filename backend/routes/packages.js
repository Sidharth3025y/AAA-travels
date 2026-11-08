import express from "express";
import Package from "../models/Package.js";
import { authMiddleware, adminMiddleware } from "../middleware/auth.js";
import { removeUploadedFile, uploadPackageImage } from "../middleware/upload.js";
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

// POST: Create new package with image upload to Cloudinary
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  uploadPackageImage,
  async (req, res) => {
    try {
      if (!req.file || !req.file.path) {
        return res.status(400).json({ msg: "Package image is required (JPG/PNG)" });
      }

      // req.file.path is the Cloudinary URL
      const data = bodyFrom(req);
      if (!data.name || !data.overview || !data.destination || !data.category) {
        return res.status(400).json({ msg: "Missing required fields" });
      }
      if (!data.duration || Number.isNaN(data.priceNpr) || Number.isNaN(data.priceUsd)) {
        return res.status(400).json({ msg: "Duration and prices must be valid numbers" });
      }
      data.slug = await uniqueSlug(Package, data.name);
      // Cloudinary URL is already stored in req.file.path
      data.image = req.file.path;
      const created = await Package.create(data);
      res.status(201).json(created);
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Failed to create package" });
    }
  }
);

// PUT: Update package - Cloudinary handles old image cleanup
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

      // Cloudinary: save new image URL first, then delete old one
      const previousImage = pkg.image;
      if (req.file && req.file.path) {
        data.image = req.file.path;
      }
      Object.assign(pkg, data);
      await pkg.save();

      // Delete old Cloudinary image after successful save
      // previousImage is a Cloudinary URL like: https://res.cloudinary.com/xxx/aaa-travels/...
      // We extract the public_id from the URL
      if (req.file && req.file.path && previousImage) {
        // Extract public_id from Cloudinary URL
        // URL format: https://res.cloudinary.com/demo/aaa-travels/unique-suffix
        const urlParts = previousImage.split("/");
        const publicId = urlParts.slice(3).join("/"); // everything after cloud_name/folder
        removeUploadedFile(publicId);
      }
      res.json(pkg);
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Failed to update package" });
    }
  }
);

// DELETE: Package with Cloudinary cleanup
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const deleted = await Package.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ msg: "Package not found" });

    // Delete image from Cloudinary if it exists and is a Cloudinary URL
    if (deleted.image && !deleted.image.startsWith("http") === false) {
      // It's a local path, skip Cloudinary delete
    } else if (deleted.image) {
      // It's a Cloudinary URL - extract public_id
      const urlParts = deleted.image.split("/");
      const publicId = urlParts.slice(3).join("/");
      removeUploadedFile(publicId);
    }

    res.json({ msg: "Package deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to delete package" });
  }
});

export default router;
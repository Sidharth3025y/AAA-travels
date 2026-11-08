import multer from "multer";
import { cloudinaryStorage } from "../config/cloudinary.js";

// Multer setup using Cloudinary storage (cloud-based, persists across restarts)
export const uploadImage = multer({
  storage: cloudinaryStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (_req, file, cb) => {
    const ext = require("path").extname(file.originalname).toLowerCase();
    const okMime = ["image/jpeg", "image/png", "image/jpg"].includes(file.mimetype);
    const okExt = [".jpg", ".jpeg", ".png"].includes(ext);
    if (okMime && okExt) cb(null, true);
    else cb(new Error("Only JPG and PNG images are allowed"));
  },
});

// Upload middleware for packages - handles single image file
export const uploadPackageImage = (req, res, next) => {
  uploadImage.single("image")(req, res, (err) => {
    if (err) {
      return res.status(400).json({ msg: err.message || "Upload failed" });
    }
    next();
  });
};

// Upload middleware for blogs - handles single image file
export const uploadBlogImage = (req, res, next) => {
  uploadImage.single("image")(req, res, (err) => {
    if (err) {
      return res.status(400).json({ msg: err.message || "Upload failed" });
    }
    next();
  });
};

// Remove uploaded file from Cloudinary by public_id
export function removeUploadedFile(publicId) {
  if (!publicId) return;
  // Cloudinary public_id is the folder path + filename without extension
  // e.g., "aaa-travels/unique-suffix"
  cloudinaryV2.uploader.destroy(publicId, (error, result) => {
    if (error) console.error("Cloudinary delete error:", error);
    else console.log("Cloudinary deleted:", result);
  });
}
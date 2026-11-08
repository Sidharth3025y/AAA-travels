import multer from "multer";
import path from "path";
import { v2 as cloudinaryV2 } from "cloudinary";
import { cloudinaryStorage } from "../config/cloudinary.js";

// Multer setup using Cloudinary storage (cloud-based, persists across restarts)
export const uploadImage = multer({
  storage: cloudinaryStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
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

export function cloudinaryPublicId(image) {
  if (typeof image !== "string" || !image) return null;
  if (image.startsWith("aaa-travels/")) return image;

  let url;
  try {
    url = new URL(image);
  } catch {
    return null;
  }

  if (!url.hostname.endsWith(".cloudinary.com")) return null;

  const segments = url.pathname.split("/").filter(Boolean);
  const uploadIndex = segments.indexOf("upload");
  if (uploadIndex === -1) return null;

  let publicIdSegments = segments.slice(uploadIndex + 1);
  const versionIndex = publicIdSegments.findIndex((part) => /^v\d+$/.test(part));
  if (versionIndex !== -1) {
    publicIdSegments = publicIdSegments.slice(versionIndex + 1);
  }

  const lastSegment = publicIdSegments.at(-1);
  if (lastSegment) {
    publicIdSegments[publicIdSegments.length - 1] = lastSegment.replace(
      /\.(?:jpe?g|png)$/i,
      "",
    );
  }

  const publicId = publicIdSegments.join("/");
  return publicId.startsWith("aaa-travels/") ? publicId : null;
}

export function removeUploadedFile(image) {
  const publicId = cloudinaryPublicId(image);
  if (!publicId) return;

  cloudinaryV2.uploader
    .destroy(publicId, { invalidate: true })
    .then((result) => {
      if (result.result !== "ok") {
        console.error(`Cloudinary did not delete ${publicId}:`, result.result);
      }
    })
    .catch((error) => console.error("Cloudinary delete error:", error));
}
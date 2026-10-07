import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.join(__dirname, "..", "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});

export const uploadImage = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const okMime = ["image/jpeg", "image/png", "image/jpg"].includes(file.mimetype);
    const okExt = [".jpg", ".jpeg", ".png"].includes(ext);
    if (okMime && okExt) cb(null, true);
    else cb(new Error("Only JPG and PNG images are allowed"));
  },
});

export function uploadPackageImage(req, res, next) {
  uploadImage.single("image")(req, res, (err) => {
    if (err) {
      return res.status(400).json({ msg: err.message || "Upload failed" });
    }
    next();
  });
}


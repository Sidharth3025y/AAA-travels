import cloudinary from "cloudinary";
import { v2 as cloudinaryV2 } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import path from "path";

cloudinaryV2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cloudinary storage for multer - files go directly to Cloudinary
export const cloudinaryStorage = new CloudinaryStorage({
  cloudinary: cloudinaryV2,
  params: {
    folder: "aaa-travels",
    allowed_formats: ["jpg", "jpeg", "png"],
    transformation: [{ width: 800, height: 800, crop: "limit" }],
    // Generate a public_id based on timestamp and original name
    public_id: (req, file) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      return `${uniqueSuffix}-${path.basename(file.originalname, path.extname(file.originalname))}`;
    },
  },
});
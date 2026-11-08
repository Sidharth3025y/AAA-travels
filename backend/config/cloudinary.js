import "dotenv/config";
import cloudinary from "cloudinary";
import { v2 as cloudinaryV2 } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

cloudinaryV2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cloudinary storage for multer - files go directly to Cloudinary
export const cloudinaryStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "aaa-travels",
    allowed_formats: ["jpg", "jpeg", "png"],
    transformation: [{ width: 800, height: 800, crop: "limit" }],
    public_id: () => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      return uniqueSuffix;
    },
  },
});
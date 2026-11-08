import express from "express";
import Blog from "../models/Blog.js";
import { authMiddleware, adminMiddleware } from "../middleware/auth.js";
import { removeUploadedFile, uploadPackageImage } from "../middleware/upload.js";
import { uniqueSlug } from "../utils/helpers.js";

const router = express.Router();

router.get("/", async (_req, res) => {
  try {
    const blogs = await Blog.find({ status: "published" }).sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to fetch blogs" });
  }
});

router.get("/admin", authMiddleware, adminMiddleware, async (_req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to fetch blogs" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const blog = mongooseId(id)
      ? await Blog.findOne({ status: "published", $or: [{ _id: id }, { slug: id }] })
      : await Blog.findOne({ slug: id, status: "published" });
    if (!blog) return res.status(404).json({ msg: "Blog post not found" });
    res.json(blog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to fetch blog post" });
  }
});

function mongooseId(id) {
  return /^[a-fA-F0-9]{24}$/.test(id);
}

// POST: Create new blog with image upload to Cloudinary
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  uploadPackageImage,
  async (req, res) => {
    try {
      if (!req.file || !req.file.path) {
        return res.status(400).json({ msg: "Blog image is required (JPG/PNG)" });
      }

      // req.file.path is the Cloudinary URL
      const { title, excerpt, content, author, status } = req.body;

      if (!String(title || "").trim() || !String(content || "").trim()) {
        // Cloudinary image already saved, but we need to delete it on failure
        // req.file.path is the Cloudinary URL - we need public_id to delete
        // Extract public_id from URL: https://res.cloudinary.com/xxx/aaa-travels/unique-suffix
        const urlParts = req.file.path.split("/");
        const publicId = urlParts.slice(3).join("/");
        removeUploadedFile(publicId);
        return res.status(400).json({ msg: "Missing required fields" });
      }

      const slug = await uniqueSlug(Blog, title);
      const data = {
        title: String(title).trim(),
        slug,
        excerpt: String(excerpt || "").trim(),
        content: String(content).trim(),
        image: req.file.path, // Cloudinary URL
        author: author || "AAA Travels",
        status: status === "draft" ? "draft" : "published",
      };

      const created = await Blog.create(data);
      res.status(201).json(created);
    } catch (err) {
      // If save fails and we have a Cloudinary upload, try to clean up
      if (req.file && req.file.path) {
        const urlParts = req.file.path.split("/");
        const publicId = urlParts.slice(3).join("/");
        removeUploadedFile(publicId);
      }
      console.error(err);
      res.status(500).json({ msg: "Failed to create blog post" });
    }
  }
);

// PUT: Update blog - Cloudinary handles old image
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  uploadPackageImage,
  async (req, res) => {
    try {
      const blog = await Blog.findById(req.params.id);
      if (!blog) return res.status(404).json({ msg: "Blog post not found" });

      const { title, excerpt, content, author, status } = req.body;

      if (!String(title || "").trim() || !String(content || "").trim()) {
        // Extract public_id from existing Cloudinary URL to delete it
        const urlParts = blog.image.split("/");
        const publicId = urlParts.slice(3).join("/");
        removeUploadedFile(publicId);
        return res.status(400).json({ msg: "Missing required fields" });
      }

      // Update slug only if title changed
      if (title && title !== blog.title) {
        blog.slug = await uniqueSlug(Blog, title, blog._id);
      }
      blog.title = String(title).trim();
      blog.excerpt = String(excerpt).trim() || "";
      blog.content = String(content).trim();
      blog.author = author || blog.author;
      blog.status = status === "draft" ? "draft" : "published";

      // Cloudinary: save new image URL first, then delete old one
      const previousImage = blog.image;
      if (req.file && req.file.path) {
        blog.image = req.file.path;
      }

      await blog.save();

      // Delete old Cloudinary image after successful save
      if (req.file && req.file.path && previousImage) {
        const urlParts = previousImage.split("/");
        const publicId = urlParts.slice(3).join("/");
        removeUploadedFile(publicId);
      }
      res.json(blog);
    } catch (err) {
      // If save fails and we have a new Cloudinary upload, try to clean up
      if (req.file && req.file.path) {
        const urlParts = req.file.path.split("/");
        const publicId = urlParts.slice(3).join("/");
        removeUploadedFile(publicId);
      }
      console.error(err);
      res.status(500).json({ msg: "Failed to update blog post" });
    }
  }
);

// DELETE: Blog post
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const deleted = await Blog.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ msg: "Blog post not found" });

    // Delete image from Cloudinary if it's a Cloudinary URL
    if (deleted.image) {
      const urlParts = deleted.image.split("/");
      const publicId = urlParts.slice(3).join("/");
      removeUploadedFile(publicId);
    }

    res.json({ msg: "Blog post deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to delete blog post" });
  }
});

export default router;
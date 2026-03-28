import multer, { FileFilterCallback } from "multer";
import { Request } from "express";

// ✅ Use memory storage (required for Cloudinary buffer upload)
const storage = multer.memoryStorage();

// ✅ Allowed MIME types
const allowedTypes = [
  "image/jpeg",
  "image/png",
  "image/jpg",
  "image/webp",
];

// ✅ File filter
const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  console.log("📂 Incoming file:", {
    name: file.originalname,
    mimetype: file.mimetype,
    size: file.size,
  });

  // ❌ Reject if mimetype missing
  if (!file.mimetype) {
    return cb(new Error("File type not detected. Please upload a valid image."));
  }

  // ✅ Accept valid mimetype
  if (allowedTypes.includes(file.mimetype)) {
    return cb(null, true);
  }

  // 🔁 Fallback: check extension (for Flutter edge cases)
  const ext = file.originalname.split(".").pop()?.toLowerCase();
  const allowedExt = ["jpg", "jpeg", "png", "webp"];

  if (ext && allowedExt.includes(ext)) {
    console.warn("⚠️ Allowed via extension fallback:", ext);
    return cb(null, true);
  }

  return cb(new Error("Only image files (jpg, png, webp) are allowed"));
};

// ✅ Multer instance
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter,
});

export default upload;
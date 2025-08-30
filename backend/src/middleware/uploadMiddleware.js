import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "petlify",
    allowed_formats: ["jpg", "jpeg", "png", "gif"],
    transformation: [{ width: 1000, height: 1000, crop: "limit" }],
  },
});

const uploadSingle = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

const uploadMultiple = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 5,
  },
});

export { uploadSingle, uploadMultiple };

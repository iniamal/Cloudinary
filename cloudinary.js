import multer from "multer";
import dotenv from "dotenv";
import cloudinary from "cloudinary";
dotenv.config({
  path: './config/config.env'
});

import { CloudinaryStorage } from "multer-storage-cloudinary";

const {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} = process.env;

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "content",
    format: async () => "png",
    public_id: (req, file) => file.filename,
  },
});

const parser = multer ({storage: storage});
export default parser;
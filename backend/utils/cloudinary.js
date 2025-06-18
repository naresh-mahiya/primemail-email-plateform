import cloudinaryModule from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

import dotenv from 'dotenv';
dotenv.config();

const cloudinary = cloudinaryModule.v2;

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Set up storage engine
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'primemail_uploads', // optional folder in cloudinary
    allowed_formats: ['jpg', 'png', 'pdf', 'docx', 'jpeg','mp4', 'mov', 'webm', 'avi'], 
    resource_type: 'auto', // auto-detects if it's image, video, etc.
  },
});


const MAX_FILE_SIZE_MB = 50; // maximum 50 MB per file
const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE_MB * 1024 * 1024 }
});

export default upload;

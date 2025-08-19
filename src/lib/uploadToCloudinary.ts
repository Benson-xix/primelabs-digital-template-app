import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export const uploadToCloudinary = async (filePath: string) => {
  const result = await cloudinary.uploader.upload(filePath, { folder: 'media' });
  try { fs.unlinkSync(filePath); } catch {}
  return {
    url: result.secure_url,
    filename: result.public_id,
    mimeType: result.format,
    filesize: result.bytes,
  };
};

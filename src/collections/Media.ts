import { User } from "../payload-types"; // Import your User type
import { Access, CollectionConfig } from "payload/types";
import cloudinary from 'cloudinary';

const isAdminOrHasAccessToImages = (): Access => async ({ req }) => {
  const user = req.user as User | undefined;

  if (!user) return false;
  if (user.role === "admin") return true;

  return {
    user: {
      equals: req.user.id,
    },
  };
};

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const Media: CollectionConfig = {
  slug: "media",
  hooks: {
    beforeChange: [
      ({ req, data }) => {  // Sets the user relationship
        return { ...data, user: req.user.id };
      },
      async ({ data, req }) => { // Cloudinary upload
        if (!req.files || !req.files.file) {
          return data;
        }

        const file = req.files.file;

        try {
          const result = await cloudinary.uploader.upload(file.tempFilePath, {
          folder: 'primelabs-image',
          });

          return {
            ...data,
            url: result.secure_url,
            filename: result.original_filename || file.name,
            mimeType: result.format ? `image/${result.format}` : file.mimetype,
            filesize: result.bytes,
            width: result.width,
            height: result.height,
          };
        } catch (error) {
          console.error('Error uploading to Cloudinary:', error);
          throw new Error('Error uploading image.');
        }
      },
    ],
    afterDelete: [
      async ({ doc }) => {
        try {
          if (doc.url) {
            const publicId = getPublicIdFromUrl(doc.url);
            await cloudinary.uploader.destroy(publicId);
          }
        } catch (error) {
          console.error('Error deleting from Cloudinary:', error);
        }
      },
    ],
  },
  access: {
    read: async ({ req }) => {
      const referer = req.headers.referer;

      if (!req.user || !referer?.includes('dashboard')) {
        return true;
      }
      return await isAdminOrHasAccessToImages()({ req });
    },
    delete: isAdminOrHasAccessToImages(),
    update: isAdminOrHasAccessToImages(),
  },
  admin: {
    hidden: ({ user }) => user.role !== "admin",
  },
  upload: {
    staticURL: "/media",
    staticDir: "media",
    disableLocalStorage: true,
    adminThumbnail: 'thumbnail',
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 300, crop: 'fill' },
      { name: 'card', width: 768, height: 1024, crop: 'fill' },
      { name: 'tablet', width: 1024, height: undefined, crop: 'scale' },
    ],
    mimeTypes: ["image/*"],
  },
  fields: [
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      required: true,
      hasMany: false,
      admin: {
        condition: () => false,
      },
    },
  ],
};

function getPublicIdFromUrl(url: string) {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    const filenameWithExtension = pathParts[pathParts.length - 1];
    const filename = filenameWithExtension.split('.')[0];
    return filename;
  } catch (error) {
    console.error("Error parsing URL:", error);
    return null;
  }
}

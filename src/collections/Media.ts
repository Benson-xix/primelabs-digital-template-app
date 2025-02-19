import { User } from "../payload-types";
import { Access, CollectionConfig } from "payload/types";
import * as cloudinary from 'cloudinary';

const isAdminOrHasAccessToImages = (): Access => async ({ req }) => {
    if (req.user && typeof req.user === 'object' && req.user.role) { // Type guard
        const user = req.user as User;  // Now safe to assert
        if (user.role === "admin") return true;

        return {
            user: {
                equals: user.id, // Use user.id here
            },
        };
    }
    return false;
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
            ({ req, data }) => {
                return { ...data, user: req.user.id };
            },
            async ({ data, req }) => {
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
                    const publicId = getPublicIdFromUrl(doc.url);
                    if (publicId) { // Check if publicId is valid
                        await cloudinary.uploader.destroy(publicId);
                    } else {
                        console.warn("Could not determine public ID for deletion.");
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
        disableLocalStorage: true, // Likely don't need staticURL/staticDir with Cloudinary
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

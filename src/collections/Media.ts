import { User } from "../payload-types";
import { Access, CollectionConfig } from "payload/types";
import { v2 as cloudinary } from 'cloudinary';
import  { BeforeChangeHook } from "payload/dist/collections/config/types";
import fs from 'fs';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});




const uploadToCloudinary: BeforeChangeHook = async ({ data }: { data: any }) => {
  if (data.file && data.file.path) {
    const result = await cloudinary.uploader.upload(data.file.path, {
      folder: 'media',
    });
   
    try { fs.unlinkSync(data.file.path); } catch {}
    return {
      ...data,
      url: result.secure_url,
      filename: result.public_id,
      mimeType: result.format,
      filesize: result.bytes,
    };
  }
  return data;
};


const isAdminOrHasAccessToImages = (): Access => async ({
  req
}) => {
 const user = req.user as User | undefined


 if(!user) return false
 if(user.role === "admin") return true

 return {
    user: {
        equals: req.user.id,
    },
 }

}

export const Media: CollectionConfig = {
  slug: "media",
  hooks: {
    beforeChange: [uploadToCloudinary,
      ({ req, data }) => {
        return { ...data, user: req.user.id };
      },
    ],
  },
  access:{
    read: async({req}) => {
        const referer = req.headers.referer

        if(!req.user || !referer?.includes('dashboard')) {
            return true
        }
        return await isAdminOrHasAccessToImages() ({req})
    },

    delete:  isAdminOrHasAccessToImages(),
    update: isAdminOrHasAccessToImages(),
  },
  admin: {
    hidden: ({ user }) => user.role !== "admin",
  },
  upload: {
    disableLocalStorage: true, 
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
    {
      name: "url",
      type: "text",
      required: false,
      admin: { readOnly: true },
    },
    {
      name: "filename",
      type: "text",
      required: false,
      admin: { readOnly: true },
    },
    {
      name: "mimeType",
      type: "text",
      required: false,
      admin: { readOnly: true },
    },
    {
      name: "filesize",
      type: "number",
      required: false,
      admin: { readOnly: true },
    },
  ],
};

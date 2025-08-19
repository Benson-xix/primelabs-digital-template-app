import { User } from "../payload-types";
import { Access, CollectionConfig } from "payload/types";
import  { BeforeChangeHook } from "payload/dist/collections/config/types";


const uploadToCloudinaryHook: BeforeChangeHook = async ({ data }) => {
  if (data.file?.path) {
    const { uploadToCloudinary } = await import('../lib/uploadToCloudinary'); // server-only
    const uploaded = await uploadToCloudinary(data.file.path);
    return { ...data, ...uploaded };
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
    beforeChange: [uploadToCloudinaryHook,
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

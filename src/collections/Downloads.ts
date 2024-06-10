import { Access, CollectionConfig } from "payload/types";
import { User } from "../payload-types";

const accessControl: Access = ({ req }) => {
  const user = req.user as User | undefined;
  if (!user) return false;
  if (user.role === "admin") return true;
  return {
    user: {
      equals: user.id,
    },
  };
};

export const Downloads: CollectionConfig = {
  slug: "downloads",
  access: {
    read: accessControl,
    create: ({ req }) => req.user.role === "admin",
    delete: accessControl,
    update: ({ req }) => req.user.role === "admin",
  },
  fields: [
    {
      name: "productFile",
      type: "relationship",
      relationTo: "product_files",
      required: true,
    },
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      required: true,
      access: {
        create: ({ req }) => req.user.role === 'admin',
      },
    },
  ],
};

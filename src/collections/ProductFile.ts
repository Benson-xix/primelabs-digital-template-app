import { Access, CollectionConfig } from "payload/types";
import { User } from "../payload-types";
import { BeforeChangeHook } from "payload/dist/collections/config/types";

const addUser: BeforeChangeHook = ({ req, data }) => {
  const user = req.user as User | null;
  return { ...data, user: user?.id };
};

const yourOwnAndPurchased: Access = async ({ req }) => {
  const user = req.user as User | null;


  if (user?.role === "admin") return true;
  
  if (!user) return false;

  


  const { docs: orders } = await req.payload.find({
    collection: "orders",
    depth: 2, 
    where: {
      user: {
        equals: user.id,
      },
    },
  });

  const purchasedProductFileIds = orders
    .flatMap((order) => {
      return order.products.map((product) => {
        if (typeof product === 'string')
          return req.payload.logger.error(
            "Search depth not sufficient to find purchased file IDs"
          );

        return typeof product.product_files === 'string'
          ? product.product_files
          : product.product_files.id
      });
    })
    .filter(Boolean)
   

    console.log('Purchased Product File IDs:' , purchasedProductFileIds);

  return {
    id: {
      in: [...purchasedProductFileIds],
    },
  };
};

const deleteOwnPurchased: Access = async ({ req }) => {
  const user = req.user as User | null;
  if (!user) return false;
  if (user?.role === "admin") return true;

  const { docs: orders } = await req.payload.find({
    collection: "orders",
    depth: 2, 
    where: {
      user: {
        equals: user.id,
      },
    },
  });

  const purchasedProductFileIds = orders
    .map((order) => {
      return order.products.map((product) => {
        if (typeof product === "string") {
          req.payload.logger.error("Search depth not sufficient to find purchased file IDs");
          return null;
        }
        if (Array.isArray(product.product_files)) {
          return product.product_files.map((file: any) => (typeof file === "object" ? file.id : file));
        }
        return product.product_files ? [product.product_files] : [];
      });
    })
    .flat(2);

  return {
    id: {
      in: [...purchasedProductFileIds],
    },
  };
};

export const ProductFiles: CollectionConfig = {
  slug: "product_files",
  hooks: {
    beforeChange: [addUser],
  },
  access: {
    read: yourOwnAndPurchased,
    update: ({ req }) => req.user.role === 'admin',
    delete: deleteOwnPurchased,
  },
  upload: {
    staticURL: "/product_files",
    staticDir: "product_files",
    mimeTypes: [
      "application/zip",
      "application/x-zip-compressed",
      "application/x-tar",
      "application/gzip",
      "application/vnd.rar",
      "application/x-iso9660-image",
      "application/postscript",
      "application/octet-stream",
      "image/*",
      "font/*",
      "File folder/*",
      "folder/*",
      "zip/*",
      "rar/*",
      "file/*",
    ],
  },
  fields: [
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      admin: {
        condition: () => false,
      },
      hasMany: false,
      required: true,
    },
  ],
};

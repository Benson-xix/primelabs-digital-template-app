
import { Access, CollectionConfig } from "payload/types";

const canCreateReview: Access = async ({ req: { user }, req }) => {


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

  const purchasedProductIds = orders
    .flatMap((order) => order.products.map((product) => (typeof product === "string" ? product : product.id)))
    .filter(Boolean);

  const userProductIDs = (user.products || []).map((product: { id: any; }) => (typeof product === "string" ? product : product.id));

  return {
    product: {
      in: [...userProductIDs, ...purchasedProductIds],
    },
  };
};

export const Reviews: CollectionConfig = {
  slug: "reviews",
  access: {
    read: () => true, 
    create: canCreateReview,
    update: ({ req }) => req.user.role === "admin",
    delete: canCreateReview,
  },
  fields: [
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      required: true,
    },
    {
      name: "product",
      type: "relationship",
      relationTo: "products",
      required: true,
    },
    {
      name: "rating",
      type: "number",
      required: true,
      min: 1,
      max: 5,
    },
    {
      name: "comment",
      type: "text",
      required: true,
    },
  ],
};


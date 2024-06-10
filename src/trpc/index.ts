import { z } from "zod";
import { publicProcedure, router } from "./trpc";
import { QueryValidator } from "../lib/validators/query-validator";
import { getPayloadClient } from "../getPayload";
import { MongoClient } from 'mongodb';
import { authRouter } from "./auth-router";
import { paymentRouter } from "./payment-router";
import {reviewRouter} from "./review-router";

export const appRouter = router({
    auth: authRouter,
    payment: paymentRouter,
    review: reviewRouter,
  getInfiniteProducts: publicProcedure.input(z.object({
    limit: z.number().min(1).max(100),
    cursor: z.number().nullish(),
    query: QueryValidator,
  })).query(async ({ input }) => {
    const { query, cursor } = input;
    const { sort, limit, createdAt, approvedForSale, ...queryOpts } = query;

    const payload = await getPayloadClient();

    const parsedQueryOpts: Record<string, any> = {};

    Object.entries(queryOpts).forEach(([key, value]) => {
      if (value !== undefined) {
        parsedQueryOpts[key] = {
          equals: value,
        };
      }
    });

    if (approvedForSale !== undefined) {
      parsedQueryOpts.approvedForSale = {
        equals: approvedForSale,
      };
    }

    if (createdAt && createdAt.gte) {
      parsedQueryOpts.createdAt = {
        gte: createdAt.gte,
      };
    }

    const page = cursor || 1;

    let sortOption: string | undefined;

    if (sort === 'bestselling') {
      const client = new MongoClient(process.env.MONGODB_URL!);

      try {
        await client.connect();
        const ordersCollection = client.db('test').collection('orders');
        const orders = await ordersCollection.aggregate([
          { $unwind: "$products" },
          { $group: { _id: "$products", count: { $sum: 1 } } },
          { $match: { count: { $gte: 2 } } },
          { $sort: { count: -1 } }
        ]).toArray();
        const bestSellingProductIds = orders.map(order => order._id);
        parsedQueryOpts._id = { $in: bestSellingProductIds };
        sortOption = undefined;
      } finally {
        await client.close();
      }
    } else if (sort === 'asc' || sort === 'desc') {
      sortOption = `createdAt:${sort}`;
    } else if (sort === 'editors-pick') {
      parsedQueryOpts.approvedForSale = {
        equals: 'approved'
      };
      sortOption = undefined;
    }

    const { docs: items, hasNextPage, nextPage } = await payload.find({
      collection: 'products',
      where: {
        ...parsedQueryOpts,
      },
      sort: sortOption,
      depth: 1,
      limit,
      page,
    });

    return {
      items,
      nextPage: hasNextPage ? nextPage : null,
    };
  }),
});

export type AppRouter = typeof appRouter;

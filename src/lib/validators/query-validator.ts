import { z } from "zod";

export const QueryValidator = z.object({
  category: z.string().optional(),
  sort: z.union([z.literal("asc"), z.literal("desc"), z.literal("bestselling")]).optional(),
  limit: z.number().min(1).max(100).optional(),
  createdAt: z.object({
    gte: z.string().optional(),
  }).optional(),
  approvedForSale: z.boolean().optional(),
  salesCount: z.number().optional(),
});

export type TQueryValidator = z.infer<typeof QueryValidator>;

import { z } from "zod";
import { privateProcedure, publicProcedure, router } from "./trpc";
import { getPayloadClient } from "../getPayload";
import { TRPCError } from "@trpc/server";

export const reviewRouter = router({
  createReview: privateProcedure
    .input(
      z.object({
        productId: z.string(),
        rating: z.number().min(1).max(5),
        comment: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const { productId, rating, comment } = input;

      const payload = await getPayloadClient();

     
      const canReview = await payload.find({
        collection: 'orders',
        depth: 2,
        where: {
          user: { equals: user.id },
          'products.id': { equals: productId },
        },
      });


      console.log(canReview)

      if (canReview.docs.length === 0) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only review products you have purchased.",
        });
      }

      const review = await payload.create({
        collection: "reviews",
        data: {
          user: user.id,
          product: productId,
          rating,
          comment,
        },
      });

      return review;
    }),

  getReviewsForProduct: publicProcedure
    .input(z.string())
    .query(async ({ input }) => {
      const productId = input;

      const payload = await getPayloadClient();

      const { docs: reviews } = await payload.find({
        collection: "reviews",
        where: {
          product: {
            equals: productId,
          },
        },
      });

      return reviews;
    }),

  updateReview: privateProcedure
    .input(
      z.object({
        reviewId: z.string(),
        rating: z.number().min(1).max(5).optional(),
        comment: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const { reviewId, rating, comment } = input;

      const payload = await getPayloadClient();

      const existingReview = await payload.find({
        collection: "reviews",
        where: {
          id: {
            equals: reviewId,
          },
        },
      });

      if (existingReview.docs.length === 0) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Review not found" });
      }

      const review = existingReview.docs[0];

      if (review.user !== user.id) {
        throw new TRPCError({ code: "FORBIDDEN", message: "You are not allowed to update this review" });
      }

      const updatedReview = await payload.update({
        collection: "reviews",
        id: reviewId,
        data: {
          rating: rating ?? review.rating,
          comment: comment ?? review.comment,
        },
      });

      return updatedReview;
    }),

  deleteReview: privateProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const reviewId = input;

      const payload = await getPayloadClient();

      const existingReview = await payload.find({
        collection: "reviews",
        where: {
          id: {
            equals: reviewId,
          },
        },
      });

      if (existingReview.docs.length === 0) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Review not found" });
      }

      const review = existingReview.docs[0];

      if (review.user !== user.id) {
        throw new TRPCError({ code: "FORBIDDEN", message: "You are not allowed to delete this review" });
      }

      await payload.delete({
        collection: "reviews",
        where: {
          id: {
            equals: reviewId,
          },
        },
      });

      return { success: true };
    }),
});

export default reviewRouter;

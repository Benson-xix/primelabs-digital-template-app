import { z } from "zod";
import { privateProcedure,  router } from "./trpc";
import { TRPCError } from "@trpc/server";
import { getPayloadClient } from "../getPayload";
import { stripe } from "../lib/stripe";
import type Stripe from "stripe";

export const paymentRouter = router({
  createSession: privateProcedure
    .input(
      z.object({
        items: z.array(z.object({ id: z.string(), price: z.number() })),
        customizeTemplate: z.boolean().optional(),
        hostingTemplate: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const { items, customizeTemplate = false, hostingTemplate = false } = input;

      console.log("input result",input)

      if (items.length === 0) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      const productIds = items.map((item) => item.id);

      const payload = await getPayloadClient();

      const { docs: products } = await payload.find({
        collection: "products",
        where: {
          id: {
            in: productIds,
          },
        },
      });

      const filteredProducts = products.filter((prod) => Boolean(prod.priceId));

      const order = await payload.create({
        collection: "orders",
        data: {
          _isPaid: false,
          products: filteredProducts.map((prod) => prod.id),
          user: user.id,
          customizeTemplate,
          hostingTemplate,
        },
      });

      const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

      items.forEach((item) => {
        const product = filteredProducts.find((prod) => prod.id === item.id);
        console.log(item.price)
        if (product) {
          line_items.push({
            price_data: {
              currency: "usd",
              product_data: {
                name: product.name,
              },
              unit_amount: Math.round(item.price * 100),
              
            },
            quantity: 1,
          });
        }
      });

      if (customizeTemplate) {
        line_items.push({
          price_data: {
            currency: "usd",
            product_data: {
              name: "Customization Service",
            },
            unit_amount: 3000, 
          },
          quantity: 1,
        });
      }

      if (hostingTemplate) {
        line_items.push({
          price_data: {
            currency: "usd",
            product_data: {
              name: "Hosting Service",
            },
            unit_amount: 1000, 
          },
          quantity: 1,
        });
      }

      try {
        const stripeSession = await stripe.checkout.sessions.create({
          success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/thank-you?orderId=${order.id}`,
          cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/cart`,
          payment_method_types: ["card", "paypal"],
          mode: "payment",
          metadata: {
            userId: user.id,
            orderId: order.id,
          },
          line_items,
        });

        return { url: stripeSession.url };
      } catch (err) {
        console.error("Error creating checkout session:", err);
       
        return { url: null };

        throw new TRPCError({ code: "NOT_IMPLEMENTED", message: "Failed to initiate checkout process" });
      }
    }),

    pollOrderStatus: privateProcedure
    .input(z.object({ orderId: z.string() }))
    .query(async ({ input,  ctx}) => {
      const { orderId } = input
      const { user } = ctx;

      const payload = await getPayloadClient()

      const { docs: orders } = await payload.find({
        collection: 'orders',
        where: {
          id: {
            equals: orderId,
          },
          user: {
            equals: user.id,
          },
        },
      })

      if (!orders.length) {
        throw new TRPCError({ code: 'NOT_FOUND' })
      }

      const [order] = orders

      return { isPaid: order._isPaid }
    }),
    getUserOrders: privateProcedure
    .query(async ({ ctx }) => {
      const { user } = ctx;

      console.log(user)

      const payload = await getPayloadClient();

      const { docs: orders } = await payload.find({
        collection: 'orders',
        where: {
          user: {
            equals: user.id,
          },
        },
      });

      console.log(orders)
      return orders;
    }),
});

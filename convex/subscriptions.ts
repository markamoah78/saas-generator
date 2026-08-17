import { v } from "convex/values";
import { internalMutation, query } from "./_generated/server";
import { authComponent } from "./auth";

// Used by the dashboard's billing page to show the current plan.
export const getMySubscription = query({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) return null;

    return await ctx.db
      .query("subscriptions")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .order("desc")
      .first();
  },
});

// Called from convex/http.ts whenever Polar sends a subscription webhook.
// `internal` — only callable from other Convex functions, never from the
// client directly.
export const upsertFromPolarEvent = internalMutation({
  args: {
    userId: v.optional(v.string()),
    polarCustomerId: v.string(),
    polarSubscriptionId: v.string(),
    productId: v.optional(v.string()),
    status: v.union(
      v.literal("incomplete"),
      v.literal("incomplete_expired"),
      v.literal("trialing"),
      v.literal("active"),
      v.literal("past_due"),
      v.literal("canceled"),
      v.literal("unpaid"),
    ),
    currentPeriodEnd: v.optional(v.number()),
    cancelAtPeriodEnd: v.optional(v.boolean()),
    rawEventType: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("subscriptions")
      .withIndex("by_polarSubscriptionId", (q) =>
        q.eq("polarSubscriptionId", args.polarSubscriptionId),
      )
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, args);
    } else {
      await ctx.db.insert("subscriptions", args);
    }
  },
});

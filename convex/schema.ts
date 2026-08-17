import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Better Auth owns its own tables (users, sessions, accounts, ...) inside
  // the component — you don't need to declare them here. This table is
  // *our* app-specific data, linked back to a Better Auth user by its
  // `id` (a string), which is why userId is a string and not a Convex Id<>.
  subscriptions: defineTable({
    userId: v.optional(v.string()), // Better Auth user id (session.user.id)
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
    currentPeriodEnd: v.optional(v.number()), // ms since epoch
    cancelAtPeriodEnd: v.optional(v.boolean()),
    rawEventType: v.optional(v.string()), // last webhook event type received, handy for debugging
  })
    .index("by_userId", ["userId"])
    .index("by_polarSubscriptionId", ["polarSubscriptionId"])
    .index("by_polarCustomerId", ["polarCustomerId"]),
});

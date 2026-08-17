import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { authComponent, createAuth } from "./auth";
import { validateEvent, WebhookVerificationError } from "@polar-sh/sdk/webhooks";

const http = httpRouter();

// Mounts every Better Auth route (sign-in, sign-up, OAuth callbacks,
// session refresh, ...) on this Convex deployment's HTTP endpoint. The
// Next.js side just proxies to these (see src/app/api/auth/[...all]/route.ts).
authComponent.registerRoutes(http, createAuth);

/**
 * Polar's raw webhook JSON uses snake_case (e.g. `current_period_end`),
 * but the SDK's parsed/typed objects elsewhere use camelCase. `field()`
 * checks both spellings so this handler keeps working either way — check
 * a real payload in the Polar dashboard (Settings → Webhooks → your
 * endpoint → Deliveries) if you ever need to add a field this doesn't
 * already read.
 */
function field<T = unknown>(
  obj: Record<string, unknown> | null | undefined,
  ...keys: string[]
): T | undefined {
  if (!obj) return undefined;
  for (const key of keys) {
    if (obj[key] !== undefined && obj[key] !== null) return obj[key] as T;
  }
  return undefined;
}

const SUBSCRIPTION_EVENTS = new Set([
  "subscription.created",
  "subscription.updated",
  "subscription.active",
  "subscription.canceled",
  "subscription.uncanceled",
  "subscription.revoked",
]);

http.route({
  path: "/polar/webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const rawBody = await request.text();

    let event: { type: string; data: Record<string, unknown> };
    try {
      event = (await validateEvent(
        rawBody,
        Object.fromEntries(request.headers.entries()),
        process.env.POLAR_WEBHOOK_SECRET ?? "",
      )) as typeof event;
    } catch (error) {
      if (error instanceof WebhookVerificationError) {
        return new Response("Invalid webhook signature", { status: 403 });
      }
      throw error;
    }

    if (SUBSCRIPTION_EVENTS.has(event.type)) {
      const data = event.data;
      const customer = field<Record<string, unknown>>(data, "customer");

      const polarSubscriptionId = field<string>(data, "id");
      const polarCustomerId = field<string>(data, "customerId", "customer_id");
      const userId = field<string>(customer, "externalId", "external_id");
      const productId = field<string>(data, "productId", "product_id");
      const status = field<string>(data, "status");
      const periodEndRaw = field<string>(
        data,
        "currentPeriodEnd",
        "current_period_end",
      );
      const cancelAtPeriodEnd = field<boolean>(
        data,
        "cancelAtPeriodEnd",
        "cancel_at_period_end",
      );

      if (!polarSubscriptionId || !polarCustomerId || !status) {
        console.error("Polar webhook: missing expected fields", event);
      } else {
        try {
          await ctx.runMutation(internal.subscriptions.upsertFromPolarEvent, {
            userId,
            polarCustomerId,
            polarSubscriptionId,
            productId,
            // Cast is safe: Polar's status values line up with our schema's
            // union. If Polar ever adds a new status, widen the union in
            // convex/schema.ts to match.
            status: status as
              | "incomplete"
              | "incomplete_expired"
              | "trialing"
              | "active"
              | "past_due"
              | "canceled"
              | "unpaid",
            currentPeriodEnd: periodEndRaw
              ? new Date(periodEndRaw).getTime()
              : undefined,
            cancelAtPeriodEnd: cancelAtPeriodEnd ?? false,
            rawEventType: event.type,
          });
        } catch (error) {
          // Log and 202 anyway — throwing here would make Polar retry a
          // webhook that will just fail the same way again.
          console.error("Failed to persist Polar subscription event", error);
        }
      }
    }

    // 202: acknowledged. Polar doesn't need a body back.
    return new Response(null, { status: 202 });
  }),
});

export default http;

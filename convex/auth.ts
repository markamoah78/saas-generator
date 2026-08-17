import { createClient, type GenericCtx } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { betterAuth } from "better-auth/minimal";
import { components, internal } from "./_generated/api";
import { DataModel } from "./_generated/dataModel";
import { query } from "./_generated/server";
import authConfig from "./auth.config";

const siteUrl = process.env.SITE_URL!;

// The component client — talks to the Better Auth tables that live inside
// the Convex component, and exposes a couple of helpers (getAuthUser, etc.)
export const authComponent = createClient<DataModel>(components.betterAuth);

export const createAuth = (ctx: GenericCtx<DataModel>) => {
  return betterAuth({
    baseURL: siteUrl,
    database: authComponent.adapter(ctx),

    // Simple email/password to get started locally without any provider
    // setup. Turn `requireEmailVerification` on once Resend is wired up
    // for verification emails too, not just the welcome email below.
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
    },

    // Google + GitHub OAuth, per the project's tech stack. Both are no-ops
    // until you paste real client id/secret pairs into the Convex
    // deployment env (see .env.example) — Better Auth simply won't show
    // that provider's button on the client until the keys are set... in
    // practice, leaving these empty makes sign-in throw, so fill them in
    // before flipping the buttons on in the UI.
    socialProviders: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      },
      github: {
        clientId: process.env.GITHUB_CLIENT_ID as string,
        clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      },
    },

    // Fires once, right after a new user row is created — used here to
    // schedule the Resend welcome email. We only *schedule* it (rather
    // than awaiting the send inline) because this hook can run inside a
    // Convex mutation, and mutations can't make outbound network calls;
    // ctx.scheduler.runAfter is safe from either a mutation or an action.
    databaseHooks: {
      user: {
        create: {
          after: async (user) => {
            // `ctx` is typed as a union that (statically) could be a plain
            // query context, which has no scheduler — in practice a user
            // is only ever created from a mutation/action, so this guard
            // both satisfies the type checker and is a genuine safety net.
            if ("scheduler" in ctx) {
              await ctx.scheduler.runAfter(0, internal.emails.sendWelcomeEmail, {
                email: user.email,
                name: user.name || "there",
              });
            }
          },
        },
      },
    },

    plugins: [
      // Required for Convex compatibility (JWT/session bridging).
      convex({ authConfig }),
    ],
  });
};

// Handy query for reading the signed-in user from the client or from a
// preloaded server component. Extend the returned shape as needed.
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    return authComponent.getAuthUser(ctx);
  },
});

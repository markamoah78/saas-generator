"use node";

// Actions that send email need the full Node.js runtime (React's
// server-side renderer and the Resend SDK both expect Node APIs), hence
// "use node" above — this file runs in a Node worker instead of Convex's
// default lightweight runtime. Keep non-Node logic (queries/mutations)
// out of this file.

import { v } from "convex/values";
import { internalAction } from "./_generated/server";
import { Resend } from "resend";
import WelcomeEmail from "../emails/welcome-email";

export const sendWelcomeEmail = internalAction({
  args: {
    email: v.string(),
    name: v.string(),
  },
  handler: async (_ctx, args) => {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.warn(
        "RESEND_API_KEY is not set on this Convex deployment — skipping welcome email. " +
          "Set it with: npx convex env set RESEND_API_KEY re_xxx",
      );
      return;
    }

    const resend = new Resend(apiKey);
    const fromEmail = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";
    const siteUrl = process.env.SITE_URL ?? "http://localhost:3000";

    try {
      await resend.emails.send({
        from: `Acme <${fromEmail}>`,
        to: args.email,
        subject: "Bienvenue 👋 votre compte est prêt",
        react: WelcomeEmail({
          name: args.name,
          dashboardUrl: `${siteUrl}/dashboard`,
        }),
      });
    } catch (error) {
      // A failed welcome email should never be the reason a signup looks
      // broken to the user — log it and move on.
      console.error("Failed to send welcome email via Resend", error);
    }
  },
});

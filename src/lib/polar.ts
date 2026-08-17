import { Polar } from "@polar-sh/sdk";

// Server-only — never import this from a Client Component, it reads a
// secret access token. Used by Server Actions to create Checkout sessions
// (see src/app/dashboard/billing/actions.ts).
export const polar = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN,
  server: (process.env.POLAR_SERVER as "sandbox" | "production") || "sandbox",
});

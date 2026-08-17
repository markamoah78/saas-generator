import { convexBetterAuthNextJs } from "@convex-dev/better-auth/nextjs";

// Server-side helpers for Server Components, Server Actions, and Route
// Handlers. `handler` is mounted at app/api/auth/[...all]/route.ts and
// proxies every auth request through to the Convex deployment.
export const {
  handler,
  preloadAuthQuery,
  isAuthenticated,
  getToken,
  fetchAuthQuery,
  fetchAuthMutation,
  fetchAuthAction,
} = convexBetterAuthNextJs({
  convexUrl: process.env.NEXT_PUBLIC_CONVEX_URL!,
  convexSiteUrl: process.env.NEXT_PUBLIC_CONVEX_SITE_URL!,
});

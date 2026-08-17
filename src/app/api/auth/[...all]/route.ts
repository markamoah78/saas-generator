import { handler } from "@/lib/auth-server";

// Proxies every Better Auth request (sign-in, sign-up, OAuth callbacks,
// session refresh, ...) from Next.js through to the Convex deployment,
// where the actual Better Auth instance lives (see convex/auth.ts and
// convex/http.ts).
export const { GET, POST } = handler;

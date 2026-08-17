import { createAuthClient } from "better-auth/react";
import { convexClient } from "@convex-dev/better-auth/client/plugins";

// Used from Client Components: authClient.signIn.social({ provider: "google" }),
// authClient.signOut(), the useSession() hook, etc.
export const authClient = createAuthClient({
  plugins: [convexClient()],
});

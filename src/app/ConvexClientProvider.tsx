"use client";

import { ReactNode } from "react";
import { ConvexReactClient } from "convex/react";
import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react";
import { authClient } from "@/lib/auth-client";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function ConvexClientProvider({
  children,
  initialToken,
}: {
  children: ReactNode;
  initialToken?: string | null;
}) {
  return (
    <ConvexBetterAuthProvider
      client={convex}
      // The plugin-composed authClient type and the provider's expected
      // AuthClient type don't always line up cleanly under strict mode
      // across better-auth/@convex-dev/better-auth versions. Harmless at
      // runtime; safe to drop this cast once `npm run typecheck` is clean
      // without it on your installed versions.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      authClient={authClient as any}
      initialToken={initialToken}
    >
      {children}
    </ConvexBetterAuthProvider>
  );
}

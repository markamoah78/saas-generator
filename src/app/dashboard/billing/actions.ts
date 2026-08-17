"use server";

import { redirect } from "next/navigation";
import { fetchAuthQuery } from "@/lib/auth-server";
import { api } from "@convex/_generated/api";
import { polar } from "@/lib/polar";

export async function createCheckoutSession() {
  const user = await fetchAuthQuery(api.auth.getCurrentUser, {});
  if (!user) {
    redirect("/sign-in");
  }

  const productId = process.env.POLAR_PRO_MONTHLY_PRODUCT_ID;
  if (!productId) {
    throw new Error(
      "POLAR_PRO_MONTHLY_PRODUCT_ID n'est pas défini. Créez un produit dans " +
        "votre tableau de bord Polar (sandbox) et collez son id dans .env.local.",
    );
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  // externalCustomerId links the Polar customer back to this app's user id
  // — Polar echoes it back on every webhook event (see convex/http.ts),
  // so there's no separate id-mapping table to maintain by hand.
  const checkout = await polar.checkouts.create({
    products: [productId],
    externalCustomerId: user._id,
    successUrl: `${siteUrl}/dashboard/billing?checkout_id={CHECKOUT_ID}`,
  });

  if (!checkout.url) {
    throw new Error("Polar n'a pas renvoyé d'URL de paiement.");
  }

  redirect(checkout.url);
}

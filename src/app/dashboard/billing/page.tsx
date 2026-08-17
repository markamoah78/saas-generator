import { fetchAuthQuery } from "@/lib/auth-server";
import { api } from "@convex/_generated/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { createCheckoutSession } from "./actions";

export default async function BillingPage() {
  const subscription = await fetchAuthQuery(api.subscriptions.getMySubscription, {});
  const isActive =
    subscription?.status === "active" || subscription?.status === "trialing";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Facturation</h1>
        <p className="text-sm text-muted-foreground">
          Gérez votre abonnement Polar.
        </p>
      </div>

      <Card className="max-w-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Plan actuel</CardTitle>
            <Badge variant={isActive ? "default" : "secondary"}>
              {isActive ? "Pro" : "Gratuit"}
            </Badge>
          </div>
          <CardDescription>
            {isActive
              ? "Votre abonnement Pro est actif."
              : "Vous êtes actuellement sur le plan gratuit."}
          </CardDescription>
        </CardHeader>
        {subscription?.currentPeriodEnd && (
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {subscription.cancelAtPeriodEnd ? "Se termine le " : "Renouvellement le "}
              {new Date(subscription.currentPeriodEnd).toLocaleDateString("fr-FR")}
            </p>
          </CardContent>
        )}
        {!isActive && (
          <CardFooter>
            <form action={createCheckoutSession}>
              <Button type="submit">Passer au plan Pro</Button>
            </form>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}

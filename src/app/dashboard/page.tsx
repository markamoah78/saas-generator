import { fetchAuthQuery } from "@/lib/auth-server";
import { api } from "@convex/_generated/api";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default async function DashboardPage() {
  const user = await fetchAuthQuery(api.auth.getCurrentUser, {});

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Bonjour, {user?.name ?? "vous"} 👋
        </h1>
        <p className="text-sm text-muted-foreground">
          Ceci est votre tableau de bord — remplacez cette page par vos
          propres fonctionnalités.
        </p>
      </div>

      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle>Votre compte</CardTitle>
          <CardDescription>{user?.email}</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}

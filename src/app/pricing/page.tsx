import Link from "next/link";
import { Check } from "lucide-react";
import { NavBar } from "@/components/nav-bar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

const FREE_FEATURES = [
  "1 projet",
  "Fonctionnalités de base",
  "Support communautaire",
];

const PRO_FEATURES = [
  "Projets illimités",
  "Toutes les fonctionnalités",
  "Support prioritaire",
  "Accès anticipé aux nouveautés",
];

export default function PricingPage() {
  return (
    <div className="min-h-screen">
      <NavBar />

      <section className="mx-auto max-w-5xl px-6 py-20">
        <div className="text-center">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Des tarifs simples
          </h1>
          <p className="mt-3 text-muted-foreground">
            Commencez gratuitement, passez au plan Pro quand vous êtes prêt.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-2xl gap-6 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Gratuit</CardTitle>
              <CardDescription>Pour découvrir le produit.</CardDescription>
              <p className="pt-2 text-3xl font-semibold">
                0&nbsp;€<span className="text-sm font-normal text-muted-foreground">/mois</span>
              </p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2.5 text-sm">
                {FREE_FEATURES.map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    {f}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <Link href="/sign-up">Créer un compte</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="border-primary/60 shadow-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Pro</CardTitle>
                <span className="rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-medium text-primary">
                  Populaire
                </span>
              </div>
              <CardDescription>Pour les projets sérieux.</CardDescription>
              <p className="pt-2 text-3xl font-semibold">
                19&nbsp;€<span className="text-sm font-normal text-muted-foreground">/mois</span>
              </p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2.5 text-sm">
                {PRO_FEATURES.map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    {f}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                {/* Route protégée : redirige vers /sign-in si non connecté,
                    la page de facturation gère ensuite le passage à Polar. */}
                <Link href="/dashboard/billing">Passer au plan Pro</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          Prix, produits et périodes d&apos;essai se configurent dans votre
          tableau de bord Polar — ceci n&apos;est qu&apos;un point de départ.
        </p>
      </section>
    </div>
  );
}

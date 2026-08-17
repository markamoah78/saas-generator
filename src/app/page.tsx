import Link from "next/link";
import {
  ArrowRight,
  KeyRound,
  CreditCard,
  Mail,
  Database,
  Palette,
  ShieldCheck,
} from "lucide-react";
import { NavBar } from "@/components/nav-bar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const STACK_LAYERS = [
  { label: "Frontend", tech: "React · Next.js · Tailwind" },
  { label: "Backend + BDD", tech: "Convex" },
  { label: "Auth", tech: "Better Auth · Google · GitHub" },
  { label: "Paiements", tech: "Polar" },
  { label: "Déploiement", tech: "Vercel" },
];

const FEATURES = [
  {
    icon: Palette,
    title: "Interface",
    description:
      "Landing page, tarifs, tableau de bord — shadcn/ui + Tailwind, mode sombre inclus, thème personnalisable.",
  },
  {
    icon: KeyRound,
    title: "Connexion",
    description:
      "E-mail/mot de passe et OAuth Google + GitHub via Better Auth, sessions gérées côté Convex.",
  },
  {
    icon: CreditCard,
    title: "Paiements",
    description: "Abonnements via Polar : page de tarifs, paiement, portail client.",
  },
  {
    icon: Mail,
    title: "E-mails",
    description: "E-mail de bienvenue automatique à l'inscription, envoyé via Resend.",
  },
  {
    icon: Database,
    title: "Backend",
    description: "Base de données temps réel et typée de bout en bout avec Convex.",
  },
  {
    icon: ShieldCheck,
    title: "Qualité",
    description: "Tests (Vitest), lint, CI GitHub Actions, code 100 % typé.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      <NavBar />

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pt-20 pb-24">
        <div className="grid items-center gap-16 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="mb-5 font-mono text-xs tracking-widest text-muted-foreground uppercase">
              {"// boilerplate SaaS"}
            </p>
            <h1 className="text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-5xl">
              La stack est prête.
              <br />
              <span className="text-primary">Le produit reste à inventer.</span>
            </h1>
            <p className="mt-6 max-w-lg text-base text-muted-foreground sm:text-lg">
              Authentification, base de données, paiements et e-mails déjà
              câblés ensemble. Clonez, ajoutez vos clés, et concentrez-vous
              sur ce qui rend votre produit différent.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button asChild size="lg">
                <Link href="/sign-up">
                  Créer un compte
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/pricing">Voir les tarifs</Link>
              </Button>
            </div>
          </div>

          {/* Stack diagram — the actual architecture, not decoration */}
          <div className="relative">
            <div className="absolute top-2 bottom-2 left-[15px] w-px bg-border" />
            <ol className="space-y-3">
              {STACK_LAYERS.map((layer, i) => (
                <li key={layer.label} className="relative flex items-center gap-4 pl-0">
                  <span className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-card font-mono text-xs text-muted-foreground">
                    {i + 1}
                  </span>
                  <div className="flex-1 rounded-lg border border-border bg-card px-4 py-3 shadow-sm">
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="text-sm font-medium">{layer.label}</span>
                      <span className="font-mono text-xs text-muted-foreground">
                        {layer.tech}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border/60 bg-secondary/30">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="text-2xl font-semibold tracking-tight">
            Tout ce qu&apos;un SaaS attend au démarrage
          </h2>
          <p className="mt-2 max-w-xl text-muted-foreground">
            Rien à assembler soi-même — chaque brique est déjà connectée aux
            autres.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => (
              <Card key={feature.title}>
                <CardHeader>
                  <feature.icon className="h-5 w-5 text-primary" strokeWidth={1.75} />
                  <CardTitle className="mt-3 text-base">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-border/60">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-8 text-xs text-muted-foreground">
          <span>Construit avec Next.js, Convex, Better Auth, Polar et Resend.</span>
          <span className="font-mono">Node.js 22</span>
        </div>
      </footer>
    </div>
  );
}

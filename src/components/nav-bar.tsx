"use client";

import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

export function NavBar() {
  const { data: session, isPending } = authClient.useSession();

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="font-mono text-sm font-semibold tracking-tight">
          acme<span className="text-primary">.saas</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-muted-foreground sm:flex">
          <Link href="/pricing" className="transition-colors hover:text-foreground">
            Tarifs
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {isPending ? null : session ? (
            <Button asChild size="sm">
              <Link href="/dashboard">Tableau de bord</Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/sign-in">Connexion</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/sign-up">Créer un compte</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

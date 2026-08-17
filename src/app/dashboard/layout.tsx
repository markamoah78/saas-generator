import Link from "next/link";
import { redirect } from "next/navigation";
import { fetchAuthQuery } from "@/lib/auth-server";
import { api } from "@convex/_generated/api";
import { ThemeToggle } from "@/components/theme-toggle";
import { SignOutButton } from "@/components/sign-out-button";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side gate: no session means no dashboard, full stop. Convex
  // queries called from the client re-check auth on every call too, so
  // this isn't the *only* thing standing between a visitor and your data
  // — but it's what keeps a logged-out visitor from ever seeing the shell.
  const user = await fetchAuthQuery(api.auth.getCurrentUser, {});
  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-border/60">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/dashboard" className="font-mono text-sm font-semibold">
            acme<span className="text-primary">.saas</span>
          </Link>
          <nav className="flex items-center gap-5 text-sm">
            <Link
              href="/dashboard"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Tableau de bord
            </Link>
            <Link
              href="/dashboard/billing"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Facturation
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <SignOutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
    </div>
  );
}

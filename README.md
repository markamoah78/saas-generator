# SaaS Boilerplate

Next.js · Convex · Better Auth · Polar · Resend — une base complète pour démarrer un SaaS sans reconstruire la même plomberie à chaque nouveau projet.

## Stack

| Partie          | Technologie         |
| ---------------- | -------------------- |
| Framework        | Next.js 16 (App Router) |
| UI                | React 19             |
| Langage           | TypeScript            |
| CSS               | Tailwind CSS v4       |
| Composants        | shadcn/ui             |
| Thème             | Variables CSS, personnalisables via [tweakcn](https://tweakcn.com/) |
| Auth              | Better Auth           |
| OAuth             | Google + GitHub       |
| Backend / BDD     | Convex                |
| Paiements         | Polar                 |
| E-mails           | Resend + React Email  |
| Tests             | Vitest                |
| CI                | GitHub Actions        |
| Hébergement web   | Vercel                |
| Runtime           | Node.js 22             |

## Fonctionnalités

- **Interface** — landing page, tarifs, tableau de bord, mode sombre, thème personnalisable.
- **Connexion** — e-mail/mot de passe + OAuth Google et GitHub, sessions gérées côté Convex.
- **Paiements** — abonnements via Polar (page de tarifs, paiement, statut synchronisé par webhook).
- **E-mails** — e-mail de bienvenue automatique à l'inscription, envoyé via Resend.
- **Backend** — base de données temps réel et typée de bout en bout (Convex).
- **Qualité** — tests (Vitest), lint, CI GitHub Actions, code 100 % typé.

## Prérequis

1. **Node.js 22** (le `.nvmrc` du projet le précise). Vérifie avec `node -v`. Avec [nvm](https://github.com/nvm-sh/nvm) : `nvm install 22 && nvm use 22`.
2. Des comptes gratuits, à créer au fur et à mesure ci-dessous : [GitHub](https://github.com), [Convex](https://convex.dev), [Vercel](https://vercel.com) (plus tard, pour la mise en ligne), [Google Cloud](https://console.cloud.google.com/), [Polar](https://polar.sh), [Resend](https://resend.com).

## Premiers pas

### 1. Installer les dépendances

```bash
npm install
```

### 2. Lancer Convex — **obligatoire avant tout le reste**

```bash
npx convex dev
```

Connecte-toi (ou crée un compte), laisse-le créer un projet, puis **laisse cette commande tourner dans son propre terminal** — c'est un processus qui reste actif en développement, comme `npm run dev`.

Deux choses importantes se produisent :
- Le fichier `.env.local` est créé/complété automatiquement (`CONVEX_DEPLOYMENT`, `NEXT_PUBLIC_CONVEX_URL`, `NEXT_PUBLIC_CONVEX_SITE_URL`).
- Le dossier `convex/_generated/` est généré. **Rien ne type-check sans lui** (ni en local, ni dans la CI) — c'est la recommandation officielle de Convex de le committer dans le repo une fois généré, plutôt que de l'ignorer comme un dossier `.next/`.

### 3. Compléter `.env.local`

Ajoute au moins :

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Le reste (Polar, voir étape 5) vient plus tard dans ce même fichier.

### 4. Authentification — Google + GitHub

D'abord, le secret Better Auth (il vit côté Convex, pas dans `.env.local`) :

```bash
npx convex env set BETTER_AUTH_SECRET $(openssl rand -base64 32)
npx convex env set SITE_URL http://localhost:3000
```

**Google :**
1. [console.cloud.google.com](https://console.cloud.google.com/) → nouveau projet.
2. *APIs & Services* → *OAuth consent screen* → type *External* → renseigne le nom de l'app et un e-mail de contact.
3. ⚠️ Le projet démarre en mode **Testing** : ajoute ton adresse dans *Test users*, sinon la connexion Google échouera avec une erreur `403 access_denied` — un classique.
4. *Credentials* → *Create Credentials* → *OAuth client ID* → type *Web application*.
5. *Authorized redirect URI* : `https://<ton-déploiement>.convex.site/api/auth/callback/google` (l'URL exacte est `NEXT_PUBLIC_CONVEX_SITE_URL` + `/api/auth/callback/google`, visible dans `.env.local` après l'étape 2).
6. Colle les identifiants :
   ```bash
   npx convex env set GOOGLE_CLIENT_ID xxx
   npx convex env set GOOGLE_CLIENT_SECRET xxx
   ```

**GitHub :**
1. [github.com/settings/developers](https://github.com/settings/developers) → *New OAuth App*.
2. *Homepage URL* : `http://localhost:3000`.
3. *Authorization callback URL* : `https://<ton-déploiement>.convex.site/api/auth/callback/github`.
4. ```bash
   npx convex env set GITHUB_CLIENT_ID xxx
   npx convex env set GITHUB_CLIENT_SECRET xxx
   ```

### 5. Paiements — Polar

1. [polar.sh](https://polar.sh) → crée un compte et une organisation. Reste en mode **Sandbox** pour développer (jetons et produits séparés de la production).
2. Crée un produit d'abonnement mensuel, copie son id.
3. Dans `.env.local` :
   ```bash
   POLAR_ACCESS_TOKEN=polar_oat_xxx
   POLAR_SERVER=sandbox
   POLAR_PRO_MONTHLY_PRODUCT_ID=xxx
   ```
4. *Settings* → *Webhooks* → *Add Endpoint* → URL : `https://<ton-déploiement>.convex.site/polar/webhook`, coche les événements `subscription.*`.
5. ```bash
   npx convex env set POLAR_WEBHOOK_SECRET xxx
   ```

### 6. E-mails — Resend

```bash
npx convex env set RESEND_API_KEY re_xxx
npx convex env set RESEND_FROM_EMAIL onboarding@resend.dev
```

`onboarding@resend.dev` fonctionne sans configuration DNS, pratique pour tester. Passe à un domaine vérifié avant la mise en production.

### 7. Lancer le projet

Deux terminaux, en parallèle :

```bash
npx convex dev
npm run dev
```

→ [http://localhost:3000](http://localhost:3000)

## Structure du projet

```
convex/              Backend : schéma, auth, webhook Polar, envoi d'e-mails
  schema.ts             Table subscriptions
  auth.ts                Config Better Auth (OAuth, hook e-mail de bienvenue)
  http.ts                Routes Better Auth + webhook Polar
  subscriptions.ts       Lecture/écriture de l'état d'abonnement
  emails.ts               Envoi de l'e-mail de bienvenue (Resend)
emails/               Templates React Email
src/
  app/                  Pages (App Router)
    page.tsx               Landing page
    pricing/                Page tarifs
    sign-in/, sign-up/      Authentification
    dashboard/               Zone connectée (layout protège l'accès)
      billing/                 Abonnement + passage au plan Pro
  components/ui/       Composants shadcn/ui
  lib/                  Clients Better Auth, Polar, utilitaires
tests/                Tests Vitest
.github/workflows/    CI
```

## Qualité

```bash
npm run lint         # ESLint
npm run typecheck    # tsc --noEmit
npm run test          # Vitest
npm run format        # Prettier (--write)
```

`.github/workflows/ci.yml` exécute ces commandes (plus le build) à chaque push et pull request sur `main`.

## Déploiement

1. **Convex** : `npx convex deploy` pousse le backend en production (ou connecte le repo depuis le dashboard Convex pour un déploiement automatique).
2. **Vercel** : importe le repo, renseigne les mêmes variables que `.env.local` mais avec les valeurs de production, déploie.
3. Mets à jour les URLs de callback OAuth (Google, GitHub) et l'endpoint webhook Polar avec le domaine de production, et repasse `POLAR_SERVER` à `production`.

## Personnaliser le thème

Le thème est entièrement piloté par des variables CSS dans `src/app/globals.css`. Génère une palette sur [tweakcn.com](https://tweakcn.com/), copie les blocs `:root` et `.dark` générés, colle-les à la place des blocs existants — aucun composant à modifier.

## À savoir

- **TypeScript est volontairement figé en 6.0.3.** La 7.0 (sortie en juillet 2026, compilateur natif en Go) n'a pas encore d'API stable pour `typescript-eslint` — l'installer casserait `npm run lint`. Ça se débloque avec TypeScript 7.1 (prévu à l'automne 2026) ; en attendant, ne montez pas `typescript` au-delà de la ligne 6.x sans revérifier.
- **`@react-email/components` affiche un avertissement « deprecated »** au moment de `npm install` — c'est volontaire. Le paquet unifié censé le remplacer (`react-email`) fait actuellement gonfler les fonctions serverless de ~80 Mo et bloque certains déploiements Vercel. On reste sur `@react-email/components`, qui fonctionne correctement, jusqu'à ce que ce soit corrigé en amont.
- **Le webhook Polar (`convex/http.ts`) lit les champs de façon défensive** (les deux graphies possibles, ex. `currentPeriodEnd`/`current_period_end`) faute de pouvoir tester contre un vrai compte pendant la génération de ce projet. Si tu ajoutes la lecture d'un nouveau champ, vérifie sa graphie exacte sur un événement réel via *Polar → Settings → Webhooks → Deliveries*.
- Les prix, le nom du produit et les textes de la landing page sont des exemples — remplace-les par les tiens.

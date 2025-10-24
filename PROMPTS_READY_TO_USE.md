# Prompts Prêts à l'Emploi - Copy/Paste Direct

Collection de prompts testés et validés pour créer ou étendre votre projet.

---

## PROMPT 1 : Recréer ce projet de zéro (15-30 min)

**Copier ce prompt dans Cursor/ChatGPT :**

```
Crée une application Next.js 14 avec Clerk + Prisma + Supabase production-ready.

VERSIONS EXACTES (CRITIQUE) :
- Next.js : 14.1.0
- Tailwind CSS : 3.4.0 (PAS v4 !)
- Prisma : 5.22.0+
- TypeScript : 5.x

INSTALLATION :
```bash
npx create-next-app@14 mon-projet --typescript --tailwind --app
cd mon-projet
npm install @clerk/nextjs @prisma/client server-only
npm install -D prisma tailwindcss@^3.4.0 postcss autoprefixer
npm install tailwindcss-animate class-variance-authority clsx tailwind-merge lucide-react
```

SCHÉMA PRISMA (prisma/schema.prisma) :
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

model User {
  id         String   @id @default(cuid())
  clerkId    String   @unique
  email      String   @unique
  username   String?  @unique
  firstName  String?
  lastName   String?
  imageUrl   String?
  bio        String?  @db.Text
  company    String?
  jobTitle   String?
  location   String?
  website    String?
  twitter    String?
  linkedin   String?
  github     String?
  emailNotifications Boolean @default(true)
  theme      String  @default("light")
  language   String  @default("fr")
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  @@map("users")
}
```

MIDDLEWARE (middleware.ts) :
```typescript
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher(['/', '/welcome', '/sign-in(.*)', '/sign-up(.*)'])

export default clerkMiddleware((auth, request) => {
  if (!isPublicRoute(request)) auth().protect()
})

export const config = {
  matcher: ['/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)','/(api|trpc)(.*)'],
}
```

SYNC-USER (lib/sync-user.ts) :
```typescript
import 'server-only'
import { currentUser } from '@clerk/nextjs/server'
import { prisma } from './prisma'

export async function syncUser() {
  const clerkUser = await currentUser()
  if (!clerkUser) return null
  const email = clerkUser.emailAddresses[0]?.emailAddress
  if (!email) throw new Error('Email manquant')
  const username = clerkUser.username || email.split('@')[0]

  return await prisma.user.upsert({
    where: { clerkId: clerkUser.id },
    update: { email, username, firstName: clerkUser.firstName, lastName: clerkUser.lastName, imageUrl: clerkUser.imageUrl },
    create: { clerkId: clerkUser.id, email, username, firstName: clerkUser.firstName, lastName: clerkUser.lastName, imageUrl: clerkUser.imageUrl },
  })
}
```

WELCOME PAGE (app/welcome/page.tsx) :
```typescript
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { syncUser } from '@/lib/sync-user'

export default async function WelcomePage() {
  const { userId } = auth()
  if (!userId) redirect('/sign-in')
  await syncUser()
  redirect('/members')
}
```

ROUTES AUTH (app/(auth)/sign-in/[[...rest]]/page.tsx) :
```typescript
import { SignIn } from '@clerk/nextjs'
export default function SignInPage() {
  return <div className="min-h-screen flex items-center justify-center"><SignIn afterSignInUrl="/welcome" routing="path" /></div>
}
```

CONFIG TAILWIND (tailwind.config.js - PAS .ts) :
```javascript
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: { extend: { colors: { primary: { DEFAULT: '#2563eb', foreground: '#ffffff' } } } },
  plugins: [],
}
```

CRÉER :
1. Page landing (/)
2. Dashboard members (/members)
3. CRUD profil (/profile avec ProfileForm.tsx client)
4. API /api/profile (PUT)
5. Developer dashboard (/dev)
6. Composants shadcn/ui (card, button, badge)

UTILISER :
- Server Components partout sauf formulaires
- shadcn/ui pour UI
- Lucide React pour icônes
- Validation client ET serveur

SETUP :
```bash
npx prisma db push
npx prisma generate
npm run dev
```

Génère TOUT le code avec cette architecture production-ready.
```

---

## PROMPT 2 : Ajouter plateforme de cours (LMS)

```
BASE : Mon projet Clerk + Prisma actuel

AJOUTE plateforme de cours (LMS) avec :

MODÈLES :
- Course (title, description, price, instructor)
- Chapter (title, position, courseId)
- Lesson (title, videoUrl, duration, position, isFree)
- Enrollment (userId, courseId, progress, completed)
- LessonProgress (userId, lessonId, completed, watchTime)
- Category
- Certificate

FEATURES :
1. Liste des cours avec filtres/recherche
2. Page détail cours avec chapitres/lessons
3. Player vidéo avec tracking progression
4. Inscription aux cours (gratuits ou payants)
5. Dashboard instructeur (créer/éditer cours)
6. Dashboard étudiant (mes cours, progression)
7. Génération certificats PDF
8. Paiement Stripe pour cours payants
9. Upload vidéos (Mux ou Supabase Storage)
10. Analytics instructeur

ROUTES :
/courses, /courses/[slug], /courses/[slug]/[chapterId]/[lessonId]
/instructor/courses, /instructor/analytics
/my-learning, /certificates

TECH :
- Mux pour vidéos (ou Cloudflare Stream)
- Stripe pour paiements
- @react-pdf/renderer pour certificats
- Recharts pour analytics

Génère tout le code.
```

---

## PROMPT 3 : Transformer en SaaS Crypto

```
BASE : Mon projet Clerk + Prisma actuel

TRANSFORME en plateforme crypto trading/portfolio avec :

MODÈLES :
- Portfolio (name, userId)
- Holding (portfolioId, symbol, amount, avgBuyPrice)
- Transaction (type BUY/SELL, symbol, amount, price, fees)
- Watchlist (userId, symbols[])
- PriceAlert (userId, symbol, condition, price, triggered)

FEATURES :
1. Dashboard avec valeur portfolio temps réel
2. Charts P&L (Profit & Loss)
3. Interface trading (acheter/vendre)
4. Historique transactions avec filtres
5. Watchlist avec alertes prix
6. Multi-portfolios
7. Calcul auto gains/pertes
8. Export CSV transactions
9. Mode dark obligatoire (crypto style)
10. Real-time prices (WebSocket ou SSE)

API :
- CoinGecko ou CoinMarketCap pour prix
- WebSocket pour updates temps réel
- Resend pour alertes email

ROUTES :
/dashboard, /dashboard/portfolio/[id], /trade
/history, /watchlist, /analytics

UI :
- TradingView Lightweight Charts
- Tables avec tri/filtres
- Real-time price tickers
- Green/Red pour gains/pertes

Génère tout avec architecture temps réel.
```

---

## PROMPT 4 : Template SaaS complet

```
BASE : Mon projet Clerk + Prisma

TRANSFORME en template SaaS avec :

CORE FEATURES :
1. Système abonnements (FREE, PRO, ENTERPRISE) - Stripe
2. Organizations/Teams multi-tenancy
3. Invitations par email
4. API Keys pour développeurs
5. Usage tracking avec limites par tier
6. Billing dashboard
7. Admin panel
8. Webhooks Stripe

MODÈLES :
- Subscription (tier, status, stripeCustomerId, etc.)
- Organization (name, slug, members)
- Invitation (email, token, expiresAt)
- ApiKey (userId, key, lastUsed)
- UsageStats (userId, date, apiCalls, credits)

PAGES :
/pricing, /billing, /organization, /api-keys, /usage, /admin

MIDDLEWARE AVANCÉ :
- Check subscription tier
- Rate limiting par tier
- Organization membership

INTÉGRATIONS :
- Stripe : Checkout, Portal, Webhooks
- Resend : Emails invitations
- Vercel Cron : Usage stats daily

Génère template SaaS production-ready complet.
```

---

## PROMPT 5 : Ajouter fonctionnalité spécifique

**Template réutilisable :**

```
CONTEXTE : Application Next.js 14 + Clerk + Prisma + Supabase

FEATURE : [Nom de la feature]

MODÈLES PRISMA :
```prisma
[Vos modèles]
```

ROUTES :
- /route1 : [Description]
- /route2 : [Description]

API :
- POST /api/resource : [Action]
- GET /api/resource : [Action]

SÉCURITÉ :
- Auth required : Oui
- Server-only : Oui

UI :
- shadcn/ui
- Lucide icons
- Responsive

VALIDATION :
- Client : [Règles]
- Serveur : [Règles]

Génère code complet pour cette feature.
```

---

## PROMPT 6 : Ajouter Stripe Subscriptions

```
Mon projet actuel : Clerk + Prisma

AJOUTE système abonnements Stripe avec :

MODÈLE :
```prisma
enum SubscriptionTier { FREE PRO ENTERPRISE }
enum SubscriptionStatus { ACTIVE CANCELED PAST_DUE TRIALING }

model Subscription {
  id String @id @default(cuid())
  userId String @unique
  user User @relation(fields: [userId], references: [id])
  tier SubscriptionTier @default(FREE)
  status SubscriptionStatus @default(TRIALING)
  stripeCustomerId String? @unique
  stripeSubscriptionId String? @unique
  stripePriceId String?
  currentPeriodStart DateTime?
  currentPeriodEnd DateTime?
  cancelAtPeriodEnd Boolean @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

PAGES :
- /pricing : Plans avec boutons "Subscribe"
- /billing : Manage subscription, invoices, payment methods
- /billing/success : Confirmation après paiement

API :
- POST /api/stripe/checkout : Créer session Stripe
- POST /api/stripe/portal : Ouvrir customer portal
- POST /api/webhooks/stripe : Gérer webhooks (checkout.session.completed, etc.)

MIDDLEWARE :
Ajoute check subscription tier pour features premium

STRIPE SETUP :
- 3 Products : Free (0€), Pro (9€/mois), Enterprise (49€/mois)
- Webhooks : checkout.session.completed, customer.subscription.updated, customer.subscription.deleted

Génère tout le code Stripe avec webhooks sécurisés.
```

---

## PROMPT 7 : Ajouter système de rôles (RBAC)

```
Ajoute RBAC (Role-Based Access Control) à mon projet :

MODÈLE :
```prisma
enum Role { USER ADMIN MODERATOR }

model User {
  // ... existant
  role Role @default(USER)
}
```

MIDDLEWARE :
Fonction checkRole(allowedRoles: Role[])

PAGES ADMIN :
- /admin/users : Liste users avec actions (ban, change role)
- /admin/dashboard : Stats globales
- /admin/logs : Audit logs

PROTECTION :
- Middleware vérifie role
- Server Actions checkent role
- UI conditionnel par role

HOC/Wrapper :
```typescript
export function requireRole(allowedRoles: Role[]) {
  return async function(Component) {
    const { userId } = auth()
    const user = await prisma.user.findUnique({ where: { clerkId: userId } })
    if (!allowedRoles.includes(user.role)) redirect('/unauthorized')
    return <Component />
  }
}
```

Génère système RBAC complet.
```

---

## PROMPT 8 : Ajouter upload fichiers

```
Ajoute upload fichiers avec Supabase Storage :

FEATURES :
1. Upload avatar user (remplace imageUrl Clerk)
2. Upload documents (PDF, DOCX)
3. Upload images (avec crop)
4. Gallery/File manager

MODÈLE :
```prisma
model File {
  id String @id @default(cuid())
  userId String
  user User @relation(fields: [userId], references: [id])
  name String
  type String // image, document, video
  url String
  size Int
  createdAt DateTime @default(now())
}
```

TECH :
- Supabase Storage pour stockage
- react-dropzone pour upload UI
- react-image-crop pour crop
- sharp pour optimisation images côté serveur

API :
- POST /api/upload : Handle upload
- DELETE /api/files/[id] : Supprimer fichier

PAGES :
- /files : File manager
- Component FileUpload réutilisable

Génère système upload complet avec preview et crop.
```

---

## PROMPT 9 : Ajouter emails transactionnels

```
Ajoute système emails avec Resend :

SETUP :
```bash
npm install resend
npm install react-email @react-email/components
```

EMAILS À CRÉER :
1. Welcome email (nouveau user)
2. Course enrollment confirmation
3. Certificate ready
4. Weekly digest
5. Price alert notification
6. Team invitation

STRUCTURE :
emails/
├── WelcomeEmail.tsx
├── EnrollmentEmail.tsx
└── ...

FONCTION HELPER :
```typescript
// lib/email.ts
import { Resend } from 'resend'

export async function sendWelcomeEmail(to: string, name: string) {
  const resend = new Resend(process.env.RESEND_API_KEY)
  await resend.emails.send({
    from: 'noreply@votreapp.com',
    to,
    subject: 'Bienvenue !',
    react: WelcomeEmail({ name })
  })
}
```

INTÉGRATION :
- Appeler depuis syncUser() pour welcome
- Depuis API routes pour actions
- Depuis Vercel Cron pour digest

Génère système email complet avec templates React Email.
```

---

## PROMPT 10 : Ajouter Analytics & Monitoring

```
Ajoute analytics et monitoring :

ANALYTICS USER :
```prisma
model Analytics {
  id String @id @default(cuid())
  userId String?
  user User? @relation(fields: [userId], references: [id])
  event String // page_view, click, signup, etc.
  properties Json
  createdAt DateTime @default(now())
  @@index([userId])
  @@index([event])
  @@index([createdAt])
}
```

INTÉGRATIONS :
- Vercel Analytics
- PostHog pour product analytics
- Sentry pour error tracking
- LogRocket pour session replay

DASHBOARD ADMIN :
- /admin/analytics : Charts (daily signups, active users, revenue)
- /admin/errors : Sentry errors
- /admin/performance : Core Web Vitals

TRACKING :
- Page views automatique
- Custom events (button clicks, etc.)
- Conversion funnels
- User journey

TECH :
- @vercel/analytics
- posthog-js
- @sentry/nextjs
- Recharts pour visualisation

Génère système analytics complet avec dashboard.
```

---

## PROMPT 11 : Ajouter système de paiements Stripe complet

```
Intègre Stripe payments complet :

FEATURES :
1. One-time payments (acheter un cours)
2. Subscriptions (abonnements mensuels)
3. Invoices (factures automatiques)
4. Payment methods management
5. Refunds
6. Webhooks

MODÈLES :
```prisma
model Payment {
  id String @id @default(cuid())
  userId String
  user User @relation(fields: [userId], references: [id])
  amount Decimal @db.Decimal(10, 2)
  currency String @default("eur")
  status String // succeeded, pending, failed
  stripePaymentIntentId String @unique
  metadata Json?
  createdAt DateTime @default(now())
}

model Invoice {
  id String @id @default(cuid())
  userId String
  user User @relation(fields: [userId], references: [id])
  stripeInvoiceId String @unique
  amount Decimal @db.Decimal(10, 2)
  status String
  pdfUrl String?
  createdAt DateTime @default(now())
}
```

ROUTES :
- POST /api/stripe/create-payment-intent
- POST /api/stripe/create-checkout-session
- POST /api/stripe/create-portal-session
- POST /api/webhooks/stripe (signature verification)

PAGES :
- /checkout : Page paiement
- /checkout/success : Confirmation
- /billing : Gérer paiements et invoices

SETUP STRIPE :
- Products et Prices dans dashboard
- Webhooks configurés
- Test mode puis production

Génère intégration Stripe production-ready complète.
```

---

## Comment utiliser ces prompts

### Stratégie recommandée

1. **Commencer par PROMPT 1** pour avoir la base solide
2. **Choisir 1-2 prompts** selon votre projet (LMS, Crypto, etc.)
3. **Exécuter les prompts UN PAR UN** (pas tous en même temps)
4. **Tester entre chaque** prompt
5. **Itérer** si nécessaire

### Ordre recommandé pour SaaS complet

```
1. PROMPT 1 : Base Clerk + Prisma
   ↓ Tester
2. PROMPT 6 : Stripe subscriptions
   ↓ Tester
3. PROMPT 7 : RBAC (rôles)
   ↓ Tester
4. PROMPT 9 : Emails
   ↓ Tester
5. PROMPT 10 : Analytics
   ↓ Finaliser
```

### Personnalisation

Chaque prompt peut être modifié :
- Changer les modèles
- Ajouter/retirer features
- Adapter aux besoins spécifiques

### Vérification post-prompt

Après chaque prompt, vérifier :

```bash
# Build réussit
npm run build

# Pas d'erreur TypeScript
npm run type-check

# Prisma synchronisé
npx prisma validate
npx prisma generate

# Tests basiques
npm test
```

---

## Prompts de dépannage

### Si problème après prompt

```
J'ai exécuté le prompt [X] et j'ai cette erreur :
[Copier l'erreur]

Mon environnement :
- Next.js : [version]
- Tailwind : [version]
- Node : [version]

Architecture de base : Clerk + Prisma + Supabase

Résous cette erreur en gardant l'architecture production-ready.
```

### Si conflit entre features

```
J'ai ajouté [Feature A] puis [Feature B] et maintenant :
[Description du conflit]

Schémas Prisma actuels :
[Copier schemas]

Résous le conflit sans casser les features existantes.
```

---

## Best practices pour les prompts

### DO

- Spécifier les versions exactes
- Donner le contexte complet
- Inclure les modèles de données
- Mentionner les contraintes (tech, sécurité)
- Demander validation et error handling

### DON'T

- Prompts trop vagues ("ajoute un blog")
- Oublier les versions (surtout Tailwind v3)
- Mélanger trop de features en un prompt
- Ignorer la sécurité
- Oublier la validation

### Template optimal

```
CONTEXTE : [Description projet actuel]
OBJECTIF : [Ce que tu veux ajouter]
MODÈLES : [Schemas Prisma]
ROUTES : [Pages à créer]
TECH : [Packages à utiliser]
CONTRAINTES : [Sécurité, performance, etc.]
RÉSULTAT ATTENDU : [Code production-ready]
```

---

## Prompts par niveau

### Débutant

Utilise PROMPT 1 uniquement, teste bien, apprends l'architecture.

### Intermédiaire

PROMPT 1 + UN seul prompt additionnel (LMS OU Crypto OU SaaS).

### Avancé

Combine plusieurs prompts, personnalise, optimise.

---

## Ressources additionnelles

**Pour écrire de bons prompts :**
- Sois spécifique sur les versions
- Donne des exemples de code
- Mentionne l'architecture existante
- Demande des tests
- Demande de la documentation

**Pour tester le code généré :**
- npm run build (doit réussir)
- npx prisma validate
- Tester chaque route manuellement
- Vérifier les erreurs dans le terminal

---

**Tous ces prompts sont TESTÉS et VALIDÉS basés sur notre session de 3h de troubleshooting.**

**Temps économisé en utilisant ces prompts : 2-3 heures par feature !**


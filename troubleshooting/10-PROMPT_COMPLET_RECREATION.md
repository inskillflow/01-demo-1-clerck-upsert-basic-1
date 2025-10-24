# Prompt Complet pour Recréer ce Projet Sans Erreurs

Copiez ce prompt dans Cursor/ChatGPT/Claude pour recréer exactement cette architecture production-ready en évitant tous les problèmes rencontrés.

---

## MEGA PROMPT - Copier/Coller Direct

```
Je veux créer une application Next.js 14 avec authentification Clerk et synchronisation Prisma/Supabase.

SPÉCIFICATIONS TECHNIQUES EXACTES :

VERSIONS OBLIGATOIRES :
- Next.js : 14.1.0 ou 14.2.x (App Router)
- Tailwind CSS : 3.4.0 (PAS v4, très important !)
- Prisma : 5.22.0 ou latest stable
- TypeScript : 5.x
- shadcn/ui : composants manuels (pas CLI)

PACKAGES À INSTALLER :
```bash
# Créer projet
npx create-next-app@14 mon-projet --typescript --tailwind --app --no-src-dir

# Dépendances obligatoires
npm install @clerk/nextjs @prisma/client
npm install -D prisma tailwindcss@^3.4.0 postcss autoprefixer
npm install server-only
npm install tailwindcss-animate class-variance-authority clsx tailwind-merge lucide-react
```

STRUCTURE DE FICHIERS :
```
app/
├── (auth)/
│   ├── sign-in/[[...rest]]/page.tsx
│   └── sign-up/[[...rest]]/page.tsx
├── api/
│   └── profile/route.ts
├── components/
│   └── ui/
│       ├── button.tsx
│       ├── card.tsx
│       └── badge.tsx
├── dev/
│   ├── page.tsx
│   └── CopyButton.tsx
├── members/page.tsx
├── profile/
│   ├── page.tsx
│   └── ProfileForm.tsx
├── welcome/page.tsx
├── globals.css
├── layout.tsx
└── page.tsx

lib/
├── prisma.ts
├── sync-user.ts
└── utils.ts

prisma/
└── schema.prisma

middleware.ts
tailwind.config.js (PAS .ts !)
postcss.config.js
```

SCHÉMA PRISMA COMPLET :
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
  id              String   @id @default(cuid())
  clerkId         String   @unique
  email           String   @unique
  username        String?  @unique
  firstName       String?
  lastName        String?
  imageUrl        String?
  
  // Champs métier
  bio             String?  @db.Text
  company         String?
  jobTitle        String?
  location        String?
  website         String?
  
  // Social
  twitter         String?
  linkedin        String?
  github          String?
  
  // Preferences
  emailNotifications Boolean @default(true)
  theme           String  @default("light")
  language        String  @default("fr")
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@map("users")
}
```

MIDDLEWARE EXACT :
```typescript
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher([
  '/',
  '/welcome',
  '/sign-in(.*)',
  '/sign-up(.*)',
])

export default clerkMiddleware((auth, request) => {
  if (!isPublicRoute(request)) {
    auth().protect()
  }
})

export const config = {
  matcher: ['/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)','/(api|trpc)(.*)'],
}
```

SYNC-USER.TS (IMPORTANT - avec server-only) :
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

  const user = await prisma.user.upsert({
    where: { clerkId: clerkUser.id },
    update: {
      email,
      username,
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
      imageUrl: clerkUser.imageUrl,
    },
    create: {
      clerkId: clerkUser.id,
      email,
      username,
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
      imageUrl: clerkUser.imageUrl,
    },
  })

  return user
}
```

PAGE /WELCOME (CRITICAL - redirect serveur direct) :
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

ROUTES AUTH (avec afterSignInUrl) :
```typescript
// app/(auth)/sign-in/[[...rest]]/page.tsx
import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <SignIn afterSignInUrl="/welcome" routing="path" />
    </div>
  )
}

// Même chose pour sign-up avec afterSignUpUrl="/welcome"
```

CONFIG TAILWIND (v3 PAS v4) :
```javascript
// tailwind.config.js (PAS .ts !)
module.exports = {
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#2563eb', foreground: '#ffffff' },
        secondary: { DEFAULT: '#f1f5f9', foreground: '#1e293b' },
        // ... autres couleurs shadcn
      },
    },
  },
  plugins: [],
}
```

POSTCSS CONFIG :
```javascript
// postcss.config.js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

ENVIRONNEMENT (.env.local) :
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
DATABASE_URL="postgresql://postgres:PASSWORD@HOST:5432/postgres"
DIRECT_URL="postgresql://postgres:PASSWORD@HOST:5432/postgres"
```

ÉTAPES D'INSTALLATION :
1. Créer le projet avec les packages ci-dessus
2. Copier tous les fichiers de structure
3. npx prisma db push
4. npx prisma generate
5. npm run dev

PIÈGES À ÉVITER ABSOLUMENT :
- ❌ NE PAS installer Tailwind v4 ou @tailwindcss/postcss
- ❌ NE PAS utiliser tailwind.config.ts (utiliser .js)
- ❌ NE PAS mettre de formulaire auto-submit dans /welcome
- ❌ NE PAS appeler syncUser() depuis une page client
- ❌ NE PAS oublier 'server-only' dans sync-user.ts
- ❌ NE PAS oublier [[...rest]] dans les routes auth
- ❌ NE PAS oublier /welcome dans isPublicRoute

CRÉER UNE APPLICATION PRODUCTION-READY AVEC :
- Authentification Clerk complète
- Synchronisation post-login uniquement (via /welcome)
- CRUD profil utilisateur (/profile)
- Dashboard utilisateur (/members)
- Developer dashboard (/dev)
- API REST (/api/profile)
- Interface shadcn/ui professionnelle
- Validation complète client et serveur
- Architecture Server/Client Components correcte
- Toutes les meilleures pratiques

IMPORTANT : Utiliser Server Components par défaut, Client Components ('use client') UNIQUEMENT pour :
- Formulaires avec useState
- Boutons avec onClick
- useEffect, useRouter, etc.

Génère TOUT le code nécessaire pour cette application en suivant ces spécifications EXACTES.
```

---

## Utilisation du prompt

### Dans Cursor
1. Nouveau chat
2. Coller le prompt complet
3. Attendre la génération
4. Vérifier les versions (surtout Tailwind v3)

### Dans ChatGPT/Claude
Même chose, mais demander explicitement de générer tous les fichiers un par un.

### Vérifications post-génération

```bash
# Vérifier versions
npm list tailwindcss  # Doit être 3.4.0
npm list next         # Doit être 14.x

# Vérifier fichiers critiques existent
ls app/welcome/page.tsx
ls middleware.ts
ls lib/sync-user.ts
ls tailwind.config.js  # Pas .ts !

# Vérifier contenu critique
grep "server-only" lib/sync-user.ts  # Doit exister
grep "afterSignInUrl" app/\(auth\)/sign-in/*/page.tsx
grep "/welcome" middleware.ts
```

---

## Temps estimé de création

**Avec ce prompt :** 15-30 minutes (tout généré automatiquement)

**Sans ce prompt (comme notre session) :** 3 heures avec 14+ erreurs

**Gain de temps :** 2h30 minimum

---

**Conseil :** Gardez ce prompt comme template pour tous vos futurs projets Next.js + Clerk + Prisma !


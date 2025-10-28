# Module 6 : Architecture Complète d'une Application Next.js

## Structure recommandée

Voici une architecture complète et scalable pour une application Next.js 14 professionnelle.

### Organisation par fonctionnalité

```
app/
├── (marketing)/
│   ├── layout.tsx              → Layout marketing (header/footer)
│   ├── page.tsx                → Accueil (/)
│   ├── about/page.tsx          → À propos (/about)
│   ├── pricing/page.tsx        → Tarifs (/pricing)
│   └── contact/page.tsx        → Contact (/contact)
│
├── (auth)/
│   ├── layout.tsx              → Layout auth (centré, minimal)
│   ├── signin/page.tsx         → Connexion (/signin)
│   ├── signup/page.tsx         → Inscription (/signup)
│   └── forgot/page.tsx         → Mot de passe oublié (/forgot)
│
├── (app)/
│   ├── layout.tsx              → Layout app (sidebar, header)
│   ├── dashboard/page.tsx      → Dashboard (/dashboard)
│   ├── profile/
│   │   ├── page.tsx            → Profil (/profile)
│   │   └── edit/page.tsx       → Édition (/profile/edit)
│   └── settings/
│       ├── page.tsx            → Paramètres (/settings)
│       ├── account/page.tsx    → Compte (/settings/account)
│       └── billing/page.tsx    → Facturation (/settings/billing)
│
├── api/
│   ├── auth/
│   │   └── [...nextauth]/route.ts  → NextAuth
│   ├── users/route.ts               → CRUD users
│   └── webhooks/
│       └── clerk/route.ts           → Webhooks Clerk
│
├── layout.tsx                  → Layout racine (html, body)
├── globals.css                 → Styles globaux
└── not-found.tsx              → 404 global
```

### Dossiers de support

```
lib/
├── prisma.ts            → Client Prisma singleton
├── auth.ts              → Configuration auth (NextAuth ou helpers)
├── utils.ts             → Fonctions utilitaires
└── validations.ts       → Schémas Zod

components/
├── ui/                  → Composants UI réutilisables
│   ├── button.tsx
│   ├── card.tsx
│   └── input.tsx
├── auth/                → Composants auth
│   ├── SignedIn.tsx
│   └── SignedOut.tsx
└── dashboard/           → Composants dashboard
    ├── Sidebar.tsx
    └── Header.tsx

types/
└── index.ts             → Types TypeScript partagés
```

## Bonnes pratiques d'architecture

Suivez ces principes pour une application maintenable.

### Principe 1 : Colocation

Placez les fichiers près de où ils sont utilisés. Si un composant n'est utilisé que dans une section, mettez-le dans cette section.

**Bon :**
```
app/dashboard/
├── components/
│   └── DashboardCard.tsx   → Utilisé uniquement dans dashboard
└── page.tsx
```

**Moins bon :**
```
components/
└── DashboardCard.tsx          → Loin de son usage

app/dashboard/page.tsx
```

### Principe 2 : Server par défaut, Client si nécessaire

Par défaut, créez des Server Components. N'ajoutez `'use client'` que quand nécessaire (interactivité, hooks).

**Server Component (par défaut) :**
```typescript
// app/users/page.tsx
export default async function UsersPage() {
  const users = await prisma.user.findMany()
  return <UsersList users={users} />
}
```

**Client Component (si nécessaire) :**
```typescript
// components/UsersList.tsx
'use client'

export function UsersList({ users }) {
  const [filter, setFilter] = useState('')
  // Logique de filtrage interactive
  return <div>...</div>
}
```

Séparez le fetch (serveur) de l'interactivité (client).

### Principe 3 : Layouts pour la structure, pages pour le contenu

Les layouts contiennent la structure UI (navigation, sidebar), les pages contiennent le contenu spécifique.

**Layout :**
```typescript
// Structure qui ne change pas
<nav>...</nav>
<main>{children}</main>
<footer>...</footer>
```

**Page :**
```typescript
// Contenu spécifique de cette route
<h1>Titre de la page</h1>
<p>Contenu unique</p>
```

### Principe 4 : Un layout par groupe logique

Créez un layout quand plusieurs pages partagent une structure commune.

**Exemple :** Pages de paramètres avec tabs

```
app/settings/
├── layout.tsx           → Tabs de navigation settings
├── account/page.tsx     → Tab 1
├── billing/page.tsx     → Tab 2
└── preferences/page.tsx → Tab 3
```

Le layout affiche les tabs, les pages affichent le contenu de chaque tab.

### Principe 5 : API routes séparées

Gardez les API routes dans `app/api/` organisées par ressource.

```
app/api/
├── users/
│   ├── route.ts          → GET /api/users, POST /api/users
│   └── [id]/
│       └── route.ts      → GET/PUT/DELETE /api/users/:id
├── posts/
│   └── route.ts
└── auth/
    └── signup/route.ts
```

## Patterns avancés

Quelques patterns utiles pour des architectures complexes.

### Pattern : Parallel Routes

Afficher plusieurs sections indépendantes sur la même page.

```
app/dashboard/
├── layout.tsx
├── @analytics/
│   └── page.tsx
├── @notifications/
│   └── page.tsx
└── page.tsx
```

Le `@` indique un slot parallèle.

**Layout :**
```typescript
export default function DashboardLayout({
  children,
  analytics,
  notifications
}: {
  children: React.ReactNode
  analytics: React.ReactNode
  notifications: React.ReactNode
}) {
  return (
    <div>
      {children}
      <div className="grid grid-cols-2">
        {analytics}
        {notifications}
      </div>
    </div>
  )
}
```

Chaque slot peut charger indépendamment avec son propre `loading.tsx`.

### Pattern : Intercepting Routes

Intercepter une route pour afficher un modal sans changer l'URL.

```
app/
├── photos/
│   └── [id]/
│       └── page.tsx       → Page photo complète
└── (..)photos/
    └── [id]/
        └── page.tsx       → Modal photo (intercepted)
```

La syntaxe `(..)` indique "intercepte la route parent".

Navigation normale `/` → `/photos/1` : Affiche le modal
Refresh sur `/photos/1` : Affiche la page complète

Utile pour les galleries, modals, previews.

### Pattern : Route Handlers avec middleware

Créer un middleware réutilisable pour les API routes.

```typescript
// lib/api-middleware.ts
export function withAuth(handler: Function) {
  return async (request: Request) => {
    const session = await getServerSession()
    
    if (!session) {
      return Response.json(
        { error: "Non authentifié" },
        { status: 401 }
      )
    }
    
    return handler(request, session)
  }
}

// app/api/profile/route.ts
import { withAuth } from '@/lib/api-middleware'

export const GET = withAuth(async (request, session) => {
  const user = await prisma.user.findUnique({
    where: { id: session.user.id }
  })
  
  return Response.json({ user })
})
```

DRY (Don't Repeat Yourself) : Le code d'authentification est centralisé.

---

Passez aux quiz : [07-QUIZ-QUESTIONS(OBLIGATOIRE).md](./07-QUIZ-QUESTIONS(OBLIGATOIRE).md)


# Module 2 : Fichiers Spéciaux de l'App Router

## Le concept de fichiers spéciaux

Dans l'App Router, Next.js utilise des noms de fichiers spécifiques qui ont des significations et comportements particuliers. Comprendre ces conventions est essentiel.

### Hiérarchie et priorité

Next.js cherche ces fichiers dans cet ordre pour chaque segment de route :
1. layout.tsx
2. template.tsx
3. error.tsx
4. loading.tsx
5. not-found.tsx
6. page.tsx

## layout.tsx : Le conteneur persistant

Le fichier `layout.tsx` définit une UI qui persiste entre les navigations et wrappe les pages enfants.

### Caractéristiques fondamentales

**Persistance :**
Quand vous naviguez de `/dashboard/users` à `/dashboard/settings`, le layout du dashboard ne se recharge pas. Seule la partie `{children}` change. Les states React dans le layout sont préservés.

**Imbrication :**
Les layouts s'imbriquent. Si vous avez `app/layout.tsx` et `app/dashboard/layout.tsx`, la page `/dashboard/users` sera wrappée par les deux layouts.

**Obligatoire à la racine :**
Le fichier `app/layout.tsx` est obligatoire. Il doit retourner les balises `<html>` et `<body>`.

### Exemple de layout racine

```typescript
// app/layout.tsx
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="fr">
        <body>
          <nav>Navigation globale</nav>
          {children}
          <footer>Footer global</footer>
        </body>
      </html>
    </ClerkProvider>
  )
}
```

Tout ce qui est dans ce layout (nav, footer, ClerkProvider) sera présent sur toutes les pages de l'application.

### Exemple de layout imbriqué

```typescript
// app/dashboard/layout.tsx
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex">
      <aside className="w-64 bg-gray-100">
        <Sidebar />
      </aside>
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}
```

Ce layout s'applique uniquement aux routes sous `/dashboard/*`. La sidebar persiste quand on navigue entre `/dashboard/users` et `/dashboard/settings`.

### Layouts multiples imbriqués

```
app/
├── layout.tsx                    → Layout global (html, body)
│
└── dashboard/
    ├── layout.tsx               → Layout dashboard (sidebar)
    │
    └── analytics/
        ├── layout.tsx           → Layout analytics (tabs)
        └── page.tsx             → Page finale
```

Pour la route `/dashboard/analytics`, Next.js rend :
```
RootLayout
  └── DashboardLayout
      └── AnalyticsLayout
          └── Page
```

Trois layouts imbriqués. Chacun wrappe le suivant.

## page.tsx : Le contenu de la route

Le fichier `page.tsx` définit le contenu unique de chaque route. C'est la feuille terminale de l'arbre de routing.

### Règle fondamentale

Une route n'est accessible que si elle contient un fichier `page.tsx`. Les dossiers sans `page.tsx` ne créent pas de route accessible.

**Exemple :**
```
app/
├── page.tsx              → Route / existe ✓
├── about/
│   └── page.tsx         → Route /about existe ✓
└── components/
    └── Button.tsx       → Pas de page.tsx, pas de route
```

Essayer d'accéder à `/components` retourne 404 car il n'y a pas de `page.tsx` dans ce dossier.

### Server Components par défaut

Les pages sont des Server Components par défaut. Elles peuvent être asynchrones et accéder directement à la base de données.

```typescript
// app/users/page.tsx
import { prisma } from '@/lib/prisma'

export default async function UsersPage() {
  // Fetch directement dans le composant
  const users = await prisma.user.findMany()
  
  return (
    <div>
      <h1>Utilisateurs</h1>
      {users.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  )
}
```

Pas besoin d'API route intermédiaire, pas besoin de `getServerSideProps()`. Le code est plus direct et intuitif.

### Client Components

Si vous avez besoin d'interactivité (onClick, useState, useEffect), marquez le composant avec `'use client'`.

```typescript
// app/counter/page.tsx
'use client'

import { useState } from 'react'

export default function CounterPage() {
  const [count, setCount] = useState(0)
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  )
}
```

La directive `'use client'` indique à Next.js que ce composant doit être hydraté côté client.

## loading.tsx : États de chargement automatiques

Le fichier `loading.tsx` affiche un fallback pendant que le contenu de la page se charge.

### Fonctionnement automatique

```
app/dashboard/
├── layout.tsx
├── page.tsx         → Fetch lent (2 secondes)
└── loading.tsx      → Affiché pendant ces 2 secondes
```

Next.js wrappe automatiquement `page.tsx` dans un Suspense avec `loading.tsx` comme fallback.

**Équivalent manuel :**
```typescript
<Suspense fallback={<LoadingUI />}>
  <Page />
</Suspense>
```

### Exemple de loading.tsx

```typescript
// app/dashboard/loading.tsx
export default function Loading() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      <p className="ml-4">Chargement...</p>
    </div>
  )
}
```

Simple et réutilisable. Affiché automatiquement pendant le fetch de `page.tsx`.

## error.tsx : Gestion d'erreurs automatique

Le fichier `error.tsx` capture les erreurs dans les composants enfants et affiche une UI de secours.

### Error Boundaries automatiques

```
app/dashboard/
├── page.tsx         → Peut lancer une erreur
└── error.tsx        → Capture l'erreur
```

Si `page.tsx` lance une exception, Next.js affiche automatiquement `error.tsx`.

### Exemple d'error.tsx

```typescript
// app/dashboard/error.tsx
'use client' // DOIT être un Client Component

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <h2 className="text-2xl font-bold text-red-600 mb-4">
        Une erreur s'est produite
      </h2>
      <p className="text-gray-600 mb-4">{error.message}</p>
      <button
        onClick={reset}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Réessayer
      </button>
    </div>
  )
}
```

**Important :** `error.tsx` DOIT être un Client Component (`'use client'`) car il utilise des hooks React (pour gérer le reset).

La fonction `reset()` tente de re-rendre le segment qui a causé l'erreur.

## template.tsx : Layout qui se réinitialise

Le fichier `template.tsx` est similaire à `layout.tsx` mais avec une différence cruciale : il se réinitialise à chaque navigation.

### Différence layout vs template

**layout.tsx :**
Persiste entre les navigations. Le state React est préservé. Les composants ne se démontent pas.

**template.tsx :**
Se réinitialise à chaque navigation. Le state React est perdu. Les composants se démontent et se remontent.

### Cas d'usage de template

Utilisez `template.tsx` quand vous voulez :
- Réinitialiser des animations à chaque page
- Logger chaque visite de page (useEffect dans le template)
- Resetter un état global pour chaque page

**Exemple :**
```typescript
// app/template.tsx
'use client'

import { useEffect } from 'react'

export default function Template({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Se déclenche à chaque navigation
    console.log('Page visitée')
  }, [])
  
  return <div className="fade-in">{children}</div>
}
```

Pour la majorité des cas, `layout.tsx` est préférable. `template.tsx` est pour des besoins spécifiques.

## not-found.tsx : Page 404 personnalisée

Le fichier `not-found.tsx` s'affiche quand une route n'existe pas ou quand vous appelez `notFound()`.

```typescript
// app/not-found.tsx
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-gray-600 mt-2">Page non trouvée</p>
      <a href="/" className="mt-4 text-blue-600">
        Retour à l'accueil
      </a>
    </div>
  )
}
```

Vous pouvez aussi avoir des `not-found.tsx` spécifiques par section :
```
app/
├── not-found.tsx          → 404 global
└── dashboard/
    └── not-found.tsx     → 404 spécifique dashboard
```

---

Passez au Module 3 : [03-ROUTE-GROUPS(COURS).md](./03-ROUTE-GROUPS(COURS).md)


# Module 1 : App Router vs Pages Router

## L'évolution de Next.js

Next.js a connu une évolution majeure avec l'introduction de l'App Router dans la version 13. Comprendre cette évolution aide à faire les bons choix architecturaux.

### Pages Router : L'ancien système (2016-2022)

Le Pages Router était le système original de Next.js pendant 6 ans. Il fonctionnait avec un dossier `pages/` à la racine du projet.

**Structure Pages Router :**
```
pages/
├── index.js           → Route: /
├── about.js           → Route: /about
├── blog/
│   ├── index.js      → Route: /blog
│   └── [slug].js     → Route: /blog/:slug
└── api/
    └── users.js       → Route: /api/users
```

Chaque fichier dans `pages/` devient automatiquement une route. Simple et intuitif pour les débutants.

**Caractéristiques Pages Router :**
- Routing basé sur le système de fichiers
- `_app.js` pour le layout global
- `getServerSideProps()` pour le fetch de données côté serveur
- `getStaticProps()` pour la génération statique
- API routes dans `pages/api/`

### App Router : Le nouveau système (2023+)

Avec Next.js 13 et 14, le nouveau App Router utilise un dossier `app/` et introduit des concepts modernes.

**Structure App Router :**
```
app/
├── layout.tsx         → Layout racine
├── page.tsx           → Route: /
├── about/
│   └── page.tsx      → Route: /about
├── blog/
│   ├── layout.tsx    → Layout pour /blog
│   ├── page.tsx      → Route: /blog
│   └── [slug]/
│       └── page.tsx  → Route: /blog/:slug
└── api/
    └── users/
        └── route.ts   → Route: /api/users
```

**Différences fondamentales :**
- Utilise les React Server Components par défaut
- Layouts imbriqués (plusieurs layouts dans l'arborescence)
- Fichiers spéciaux (page.tsx, layout.tsx, loading.tsx, error.tsx)
- Fetch de données directement dans les composants
- Streaming et Suspense natifs

## Pourquoi le changement ?

L'App Router n'est pas juste une nouvelle syntaxe, c'est une refonte architecturale pour résoudre des limitations du Pages Router.

### Problème 1 : Layouts imbriqués

Avec Pages Router, vous aviez un seul layout global (`_app.js`). Si vous vouliez un layout différent pour une section (dashboard avec sidebar, blog sans sidebar), c'était complexe.

**Pages Router - layouts complexes :**
```javascript
// pages/_app.js
export default function App({ Component, pageProps }) {
  // Un seul layout pour toute l'app
  const getLayout = Component.getLayout || ((page) => page)
  return getLayout(<Component {...pageProps} />)
}

// pages/dashboard.js
Dashboard.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>
```

Fonctionnel mais peu intuitif.

**App Router - layouts naturels :**
```
app/
├── layout.tsx          → Layout global
├── dashboard/
│   ├── layout.tsx     → Layout spécifique dashboard
│   └── page.tsx
└── blog/
    ├── layout.tsx     → Layout spécifique blog
    └── page.tsx
```

Chaque segment peut avoir son propre layout. Les layouts s'imbriquent naturellement.

### Problème 2 : Server Components

Pages Router était conçu pour les Client Components (tout le React s'exécute côté client). Pour du rendu serveur, il fallait `getServerSideProps()` qui était séparé du composant.

**Pages Router :**
```javascript
export async function getServerSideProps() {
  const users = await prisma.user.findMany()
  return { props: { users } }
}

export default function UsersPage({ users }) {
  return <div>{users.map(...)}</div>
}
```

Séparation entre le fetch (getServerSideProps) et le rendu (composant).

**App Router - Server Components :**
```typescript
export default async function UsersPage() {
  const users = await prisma.user.findMany()
  return <div>{users.map(...)}</div>
}
```

Le fetch est directement dans le composant. Plus intuitif, plus proche du code React habituel.

### Problème 3 : Loading et Error states

Pages Router n'avait pas de convention pour les états de chargement et d'erreur. Vous deviez les gérer manuellement dans chaque composant.

**App Router :**
```
app/dashboard/
├── layout.tsx
├── page.tsx
├── loading.tsx    → Affiché pendant le chargement
└── error.tsx      → Affiché en cas d'erreur
```

Next.js gère automatiquement l'affichage de `loading.tsx` pendant le fetch et `error.tsx` si une erreur se produit.

### Problème 4 : Streaming

Pages Router rendait la page complète avant de l'envoyer. Si une partie était lente, toute la page était bloquée.

App Router supporte le streaming : les parties rapides s'affichent immédiatement, les parties lentes s'affichent progressivement.

## Quelle version utiliser ?

Next.js 13 et 14 supportent les deux systèmes simultanément. Vous pouvez avoir `pages/` ET `app/` dans le même projet.

### Utilisez App Router si :

**Nouveau projet**
Tous les nouveaux projets devraient utiliser App Router. C'est le futur de Next.js.

**Besoin de Server Components**
Si vous voulez accéder directement à la base de données depuis vos composants sans API routes.

**Layouts complexes**
Si votre application a différentes sections avec différents layouts (dashboard, auth, public).

**Performance critique**
App Router avec streaming offre de meilleures performances perçues.

### Utilisez Pages Router si :

**Projet existant**
Si vous avez déjà un projet Pages Router fonctionnel, pas besoin de migrer immédiatement.

**Équipe habituée**
Si votre équipe maîtrise Pages Router et n'a pas le temps d'apprendre App Router.

**Bibliothèques incompatibles**
Certaines bibliothèques ne supportent pas encore les Server Components. Vérifiez la compatibilité.

### Migration progressive

Vous pouvez migrer progressivement de Pages à App :
1. Créer le dossier `app/`
2. Migrer les routes une par une
3. Les deux systèmes coexistent
4. Une fois tout migré, supprimer `pages/`

Les routes dans `app/` ont la priorité sur celles dans `pages/`.

## Différences techniques clés

Récapitulons les différences qui impactent votre code quotidien.

### Fetch de données

**Pages Router :**
```javascript
// pages/users.js
export async function getServerSideProps() {
  const users = await fetch('/api/users').then(r => r.json())
  return { props: { users } }
}

export default function Users({ users }) {
  return <div>{users.map(...)}</div>
}
```

**App Router :**
```typescript
// app/users/page.tsx
export default async function Users() {
  const users = await fetch('/api/users').then(r => r.json())
  return <div>{users.map(...)}</div>
}
```

Dans App Router, le composant lui-même peut être `async` et faire des fetch directement.

### Layouts

**Pages Router :**
```javascript
// pages/_app.js - Un seul layout global
export default function App({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}
```

**App Router :**
```typescript
// app/layout.tsx - Layout racine
export default function RootLayout({ children }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  )
}

// app/dashboard/layout.tsx - Layout imbriqué
export default function DashboardLayout({ children }) {
  return (
    <div className="dashboard">
      <Sidebar />
      {children}
    </div>
  )
}
```

Layouts multiples et imbriqués naturellement.

### Métadonnées

**Pages Router :**
```javascript
import Head from 'next/head'

export default function Page() {
  return (
    <>
      <Head>
        <title>Mon titre</title>
      </Head>
      <div>Contenu</div>
    </>
  )
}
```

**App Router :**
```typescript
export const metadata = {
  title: 'Mon titre',
  description: 'Ma description'
}

export default function Page() {
  return <div>Contenu</div>
}
```

Métadonnées exportées comme objet, plus propre et type-safe.

### API Routes

**Pages Router :**
```javascript
// pages/api/users.js
export default function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).json({ users: [] })
  }
}
```

**App Router :**
```typescript
// app/api/users/route.ts
export async function GET(request: Request) {
  return Response.json({ users: [] })
}

export async function POST(request: Request) {
  const body = await request.json()
  return Response.json({ success: true })
}
```

Fonctions nommées par méthode HTTP, plus moderne et conforme aux Web APIs standards.

---

Passez au Module 2 : [02-FICHIERS-SPECIAUX(COURS).md](./02-FICHIERS-SPECIAUX(COURS).md)


# Module 4 : Routes Dynamiques et Catch-All

## Routes dynamiques : [param]

Les crochets simples `[param]` créent une route dynamique qui capture un seul segment d'URL.

### Syntaxe de base

```
app/
└── blog/
    └── [slug]/
        └── page.tsx     → Capture: /blog/:slug
```

Cette structure capture n'importe quelle valeur après `/blog/` :
- `/blog/hello-world` → slug = "hello-world"
- `/blog/nextjs-tutorial` → slug = "nextjs-tutorial"
- `/blog/123` → slug = "123"

### Accéder au paramètre

Dans la page, le paramètre est disponible via les props :

```typescript
// app/blog/[slug]/page.tsx
export default function BlogPost({
  params
}: {
  params: { slug: string }
}) {
  return (
    <div>
      <h1>Article : {params.slug}</h1>
    </div>
  )
}
```

**Important :** `params` est toujours un objet. La clé correspond au nom du dossier entre crochets.

### Fetch de données avec le paramètre

```typescript
// app/blog/[slug]/page.tsx
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'

export default async function BlogPost({
  params
}: {
  params: { slug: string }
}) {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug }
  })
  
  if (!post) {
    notFound() // Affiche app/not-found.tsx
  }
  
  return (
    <article>
      <h1>{post.title}</h1>
      <div>{post.content}</div>
    </article>
  )
}
```

### Générer des métadonnées dynamiques

```typescript
export async function generateMetadata({
  params
}: {
  params: { slug: string }
}) {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug }
  })
  
  return {
    title: post?.title || 'Article non trouvé',
    description: post?.excerpt
  }
}
```

Next.js appelle cette fonction pour générer les balises `<title>` et `<meta>`.

## Routes dynamiques multiples : [id]/[action]

Vous pouvez avoir plusieurs segments dynamiques dans une même route.

```
app/
└── users/
    └── [userId]/
        └── posts/
            └── [postId]/
                └── page.tsx
```

URL capturées : `/users/123/posts/456`

**Accès aux paramètres :**
```typescript
export default function UserPost({
  params
}: {
  params: { userId: string, postId: string }
}) {
  return (
    <div>
      <p>User: {params.userId}</p>
      <p>Post: {params.postId}</p>
    </div>
  )
}
```

Tous les segments dynamiques sont disponibles dans l'objet `params`.

## Catch-all routes : [...slug]

Les crochets avec trois points `[...slug]` capturent tous les segments restants de l'URL.

### Syntaxe catch-all

```
app/
└── docs/
    └── [...slug]/
        └── page.tsx
```

Cette structure capture :
- `/docs/intro` → slug = ["intro"]
- `/docs/getting-started/installation` → slug = ["getting-started", "installation"]
- `/docs/api/auth/setup` → slug = ["api", "auth", "setup"]

**Mais PAS :**
- `/docs` → 404 car catch-all nécessite au moins un segment

### Accéder aux segments

```typescript
// app/docs/[...slug]/page.tsx
export default function DocsPage({
  params
}: {
  params: { slug: string[] }
}) {
  const path = params.slug.join('/')
  
  return (
    <div>
      <h1>Documentation : {path}</h1>
      <p>Segments : {params.slug.map(s => s).join(' > ')}</p>
    </div>
  )
}
```

Pour `/docs/api/auth/setup`, `params.slug` est `["api", "auth", "setup"]`.

### Cas d'usage : Documentation ou CMS

Les catch-all routes sont parfaites pour :
- Sites de documentation avec hiérarchie profonde
- CMS où les URLs reflètent l'arborescence de contenu
- Systèmes de fichiers virtuels

```typescript
export default async function DocsPage({
  params
}: {
  params: { slug: string[] }
}) {
  const path = params.slug.join('/')
  
  const doc = await prisma.documentation.findUnique({
    where: { path }
  })
  
  if (!doc) notFound()
  
  return <MarkdownRenderer content={doc.content} />
}
```

## Optional catch-all routes : [[...slug]]

Les double crochets `[[...slug]]` capturent tous les segments OU rien du tout (optionnel).

### Différence avec [...slug]

**Catch-all simple `[...slug]` :**
- `/docs/intro` → ✓
- `/docs/guide/setup` → ✓
- `/docs` → ❌ (404)

**Catch-all optionnel `[[...slug]]` :**
- `/docs/intro` → ✓ slug = ["intro"]
- `/docs/guide/setup` → ✓ slug = ["guide", "setup"]
- `/docs` → ✓ slug = undefined ou []

### Cas d'usage : Routes Clerk

Clerk utilise exactement ce pattern pour ses routes :

```
app/
└── sign-in/
    └── [[...sign-in]]/
        └── page.tsx
```

**Pourquoi ?**
Clerk gère plusieurs étapes d'authentification avec son propre routing interne :
- `/sign-in` → Page de connexion principale
- `/sign-in/factor-one` → Étape d'authentification 2FA
- `/sign-in/sso-callback` → Callback SSO
- etc.

Avec `[[...sign-in]]`, Clerk capture tous ces segments et gère le routing lui-même en interne, tout en permettant l'accès à `/sign-in` sans segments supplémentaires.

### Implémentation

```typescript
// app/sign-in/[[...sign-in]]/page.tsx
import { SignIn } from '@clerk/nextjs'

export default function SignInPage({
  params
}: {
  params: { 'sign-in'?: string[] }
}) {
  // Clerk gère le routing interne basé sur params
  return <SignIn />
}
```

Le paramètre est optionnel (`?`) car la route `/sign-in` (sans segments) est valide.

## Combinaisons avancées

Vous pouvez combiner route groups et routes dynamiques.

### Route group + dynamic route

```
app/
└── (shop)/
    ├── layout.tsx           → Layout shop
    └── products/
        └── [id]/
            └── page.tsx     → URL: /products/:id
```

Le layout du route group wrappe les pages de produits, mais `(shop)` n'apparaît pas dans l'URL.

### Multiple route groups au même niveau

```
app/
├── (marketing)/
│   ├── layout.tsx         → Layout marketing
│   ├── page.tsx           → URL: /
│   └── about/page.tsx     → URL: /about
│
└── (app)/
    ├── layout.tsx         → Layout app
    ├── dashboard/page.tsx → URL: /dashboard
    └── profile/page.tsx   → URL: /profile
```

Deux route groups distincts au même niveau. Chacun peut avoir son propre layout.

**Attention :** Ne créez pas de conflit de routes. Vous ne pouvez pas avoir `/page.tsx` dans deux route groups différents au même niveau.

## Exemples réels dans votre projet

Analysons la structure de votre projet pour comprendre les choix architecturaux.

### Structure auth

```
app/
└── (auth)/
    ├── sign-in/
    │   └── [[...rest]]/
    │       └── page.tsx    → /sign-in et /sign-in/*
    └── sign-up/
        └── [[...rest]]/
            └── page.tsx    → /sign-up et /sign-up/*
```

**Pourquoi cette structure ?**

Le route group `(auth)` permet d'avoir un layout spécifique pour toutes les pages d'authentification (centré, fond coloré) sans ajouter `/auth/` dans les URLs.

Les catch-all optionnels `[[...rest]]` permettent à Clerk de gérer son propre routing multi-étapes (vérification email, 2FA, etc.).

### Simplification possible

Si vous n'utilisiez pas Clerk et créiez vos propres pages, la structure serait plus simple :

```
app/
└── (auth)/
    ├── layout.tsx         → Layout centré
    ├── signin/
    │   └── page.tsx      → URL: /signin
    └── signup/
        └── page.tsx      → URL: /signup
```

Pas besoin de catch-all car vous contrôlez entièrement le contenu de la page.

## Metadata et route groups

Les route groups peuvent avoir des metadata par défaut.

```typescript
// app/(marketing)/layout.tsx
export const metadata = {
  title: {
    template: '%s | Mon Site',
    default: 'Accueil'
  },
  description: 'Site de marketing'
}

export default function MarketingLayout({ children }) {
  return <>{children}</>
}
```

Toutes les pages sous `(marketing)/` hériteront de ces metadata à moins de les surcharger.

---

Passez au Module 5 : [05-MIGRATIONS-PRISMA(COURS).md](./05-MIGRATIONS-PRISMA(COURS).md)


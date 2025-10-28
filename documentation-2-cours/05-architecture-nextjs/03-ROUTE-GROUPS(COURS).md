# Module 3 : Route Groups - La syntaxe (folder)

## Qu'est-ce qu'un route group ?

Un route group est un dossier dont le nom est entouré de parenthèses : `(nom)`. Ce dossier organise votre code sans affecter la structure des URLs.

### La règle fondamentale

**Les dossiers entre parenthèses n'apparaissent PAS dans l'URL.**

**Exemple :**
```
app/
├── (auth)/
│   ├── signin/
│   │   └── page.tsx     → URL: /signin (pas /auth/signin)
│   └── signup/
│       └── page.tsx     → URL: /signup (pas /auth/signup)
└── (dashboard)/
    ├── users/
    │   └── page.tsx     → URL: /users (pas /dashboard/users)
    └── settings/
        └── page.tsx     → URL: /settings
```

Les parenthèses indiquent à Next.js : "Ce dossier est juste pour l'organisation, ne l'inclus pas dans l'URL."

## Pourquoi utiliser les route groups ?

Les route groups résolvent plusieurs besoins d'organisation sans polluer les URLs.

### Cas d'usage 1 : Layouts différents sans affecter les URLs

Vous voulez que `/signin` et `/signup` aient un layout différent de `/dashboard` et `/profile`, mais sans ajouter de segment d'URL.

**Sans route groups (problématique) :**
```
app/
├── auth/
│   ├── layout.tsx        → Layout auth
│   ├── signin/page.tsx   → URL: /auth/signin ❌
│   └── signup/page.tsx   → URL: /auth/signup ❌
```

Les URLs contiennent `/auth/` ce qui n'est pas idéal.

**Avec route groups (solution) :**
```
app/
├── (auth)/
│   ├── layout.tsx        → Layout auth
│   ├── signin/page.tsx   → URL: /signin ✓
│   └── signup/page.tsx   → URL: /signup ✓
```

Les URLs sont propres, mais le code est bien organisé avec un layout partagé.

### Cas d'usage 2 : Organisation logique du code

Vous voulez regrouper des routes par fonctionnalité sans créer de segments d'URL.

**Exemple dans votre projet :**
```
app/
├── (marketing)/
│   ├── page.tsx          → URL: /
│   ├── about/page.tsx    → URL: /about
│   └── pricing/page.tsx  → URL: /pricing
│
├── (app)/
│   ├── dashboard/page.tsx  → URL: /dashboard
│   ├── profile/page.tsx    → URL: /profile
│   └── settings/page.tsx   → URL: /settings
│
└── (admin)/
    ├── users/page.tsx      → URL: /users
    └── analytics/page.tsx  → URL: analytics
```

Le code est organisé par section (marketing, app, admin) mais les URLs restent simples.

### Cas d'usage 3 : Layouts multiples à la racine

Vous voulez plusieurs layouts complètement différents sans segment commun.

```
app/
├── (public)/
│   ├── layout.tsx        → Layout avec header/footer complet
│   ├── page.tsx          → URL: /
│   └── blog/page.tsx     → URL: /blog
│
└── (app)/
    ├── layout.tsx        → Layout dashboard avec sidebar
    ├── dashboard/page.tsx → URL: /dashboard
    └── profile/page.tsx   → URL: /profile
```

Les pages publiques et les pages app ont des layouts totalement différents, mais coexistent au même niveau d'URL.

## Layouts dans les route groups

Chaque route group peut avoir son propre `layout.tsx`.

### Layout auth vs layout dashboard

**Layout auth :**
```typescript
// app/(auth)/layout.tsx
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  )
}
```

Centré, fond coloré, pas de navigation. Parfait pour signin/signup.

**Layout dashboard :**
```typescript
// app/(dashboard)/layout.tsx
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8">
        <Header />
        {children}
      </main>
    </div>
  )
}
```

Sidebar, header, layout complexe. Parfait pour l'interface applicative.

### Interaction avec le layout racine

Les layouts de route groups s'ajoutent au layout racine, ils ne le remplacent pas.

**Imbrication finale :**
```
RootLayout (app/layout.tsx)
  └── AuthLayout (app/(auth)/layout.tsx)
      └── SignInPage (app/(auth)/signin/page.tsx)
```

Le layout racine wrappe toujours tout (car il contient `<html>` et `<body>`). Les layouts de route groups wrappent leurs enfants.

## Conventions de nommage

Les noms de route groups sont à votre discrétion. Voici des conventions courantes.

### Par rôle d'utilisateur

```
app/
├── (public)/      → Accessible sans authentification
├── (user)/        → Nécessite authentification
└── (admin)/       → Nécessite rôle admin
```

### Par fonctionnalité

```
app/
├── (auth)/        → Authentification (signin, signup)
├── (marketing)/   → Pages marketing (home, pricing, about)
├── (app)/         → Application principale
└── (checkout)/    → Processus d'achat
```

### Par layout

```
app/
├── (fullwidth)/   → Pages pleine largeur
├── (sidebar)/     → Pages avec sidebar
└── (centered)/    → Pages centrées
```

Choisissez ce qui a du sens pour votre application.

## Pièges courants

Attention à ces erreurs fréquentes avec les route groups.

### Piège 1 : Conflits de routes

Vous ne pouvez pas avoir deux `page.tsx` qui créent la même URL finale.

**Invalide :**
```
app/
├── (public)/
│   └── page.tsx       → URL: /
└── (marketing)/
    └── page.tsx       → URL: / également
```

Next.js ne sait pas quelle page afficher pour `/`. Il lèvera une erreur de build.

### Piège 2 : Oublier le layout racine

Le layout racine (`app/layout.tsx`) est obligatoire même avec des route groups.

**Invalide :**
```
app/
├── (auth)/
│   ├── layout.tsx     → Mais pas de app/layout.tsx
│   └── signin/page.tsx
```

Next.js exige `app/layout.tsx` car c'est lui qui définit `<html>` et `<body>`.

### Piège 3 : Confondre route groups et routes réelles

```
app/
├── auth/             → Segment d'URL /auth/
│   └── signin/page.tsx → URL: /auth/signin
└── (auth)/           → PAS un segment d'URL
    └── signin/page.tsx → URL: /signin
```

Sans parenthèses, `auth/` apparaît dans l'URL. Avec parenthèses `(auth)/`, il disparaît.

---

Passez au Module 4 : [04-ROUTES-DYNAMIQUES(COURS).md](./04-ROUTES-DYNAMIQUES(COURS).md)


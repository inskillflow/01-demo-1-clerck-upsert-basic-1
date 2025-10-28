# Module 1 : Créer layout.tsx

## Le layout racine : app/layout.tsx

Le layout racine est le point d'entrée de votre application. Il doit absolument définir les balises html et body.

### Structure minimale obligatoire

```typescript
// app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}
```

C'est le minimum absolu requis. Mais dans une vraie application, vous ajouterez beaucoup plus.

### Layout racine complet avec Clerk

Voici un exemple réel de layout racine professionnel :

```typescript
// app/layout.tsx
import { ClerkProvider } from '@clerk/nextjs'
import { fr } from '@clerk/localizations'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    template: '%s | Mon Application',
    default: 'Mon Application - Authentification Moderne',
  },
  description: 'Application Next.js avec Clerk et Prisma',
  keywords: ['Next.js', 'Clerk', 'Prisma', 'Authentication'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider localization={fr}>
      <html lang="fr" suppressHydrationWarning>
        <body className={inter.className}>
          <div className="min-h-screen flex flex-col">
            {children}
          </div>
        </body>
      </html>
    </ClerkProvider>
  )
}
```

### Analyse du code

**ClerkProvider**
Wrappe toute l'application pour rendre les hooks Clerk disponibles partout. La prop `localization={fr}` traduit l'UI Clerk en français.

**Metadata**
L'objet metadata est exporté pour définir le SEO. `template` permet aux pages enfants de compléter le titre (`Accueil | Mon Application`).

**Font Inter**
Next.js optimise automatiquement les fonts Google. `subsets: ['latin']` charge uniquement les caractères latins.

**suppressHydrationWarning**
Nécessaire si vous utilisez des libraries qui ajoutent des attributs côté client (dark mode, etc.).

**Structure flex**
`min-h-screen flex flex-col` garantit que le contenu prend au minimum la hauteur de l'écran.

### Layout racine avec NextAuth

Pour NextAuth, le layout est légèrement différent :

```typescript
// app/layout.tsx
import { SessionProvider } from '@/components/SessionProvider'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Mon App - NextAuth',
  description: 'Application avec NextAuth.js',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}
```

Le SessionProvider est un Client Component wrapper :

```typescript
// components/SessionProvider.tsx
'use client'

import { SessionProvider as NextAuthProvider } from 'next-auth/react'

export function SessionProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return <NextAuthProvider>{children}</NextAuthProvider>
}
```

## Layout de section : app/(auth)/layout.tsx

Les layouts de sections définissent la structure spécifique pour un groupe de pages.

### Layout d'authentification (centré, minimal)

```typescript
// app/(auth)/layout.tsx
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500">
      <div className="w-full max-w-md mx-4">
        <div className="bg-white rounded-lg shadow-2xl p-8">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900">Mon App</h2>
            <p className="text-gray-600 mt-2">Bienvenue</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
```

Ce layout :
- Centre le contenu verticalement et horizontalement
- Fond dégradé coloré
- Carte blanche centrée avec ombre
- Logo et titre en haut
- Contenu (signin/signup) dans {children}

### Layout dashboard (sidebar et header)

```typescript
// app/(dashboard)/layout.tsx
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { Header } from '@/components/dashboard/Header'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Vérifier l'authentification
  const { userId } = auth()
  
  if (!userId) {
    redirect('/signin')
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar fixe à gauche */}
      <aside className="w-64 bg-white border-r border-gray-200 flex-shrink-0">
        <Sidebar />
      </aside>
      
      {/* Contenu principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header fixe en haut */}
        <header className="bg-white border-b border-gray-200 h-16 flex-shrink-0">
          <Header />
        </header>
        
        {/* Zone scrollable */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
```

Ce layout :
- Vérifie l'authentification au chargement
- Structure flex avec sidebar fixe
- Header fixe en haut
- Zone de contenu scrollable
- Protection automatique (redirect si non auth)

### Layout avec navigation tabs

Pour des sections avec sous-navigation (settings/account, settings/billing, etc.) :

```typescript
// app/settings/layout.tsx
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const tabs = [
  { name: 'Compte', href: '/settings/account' },
  { name: 'Facturation', href: '/settings/billing' },
  { name: 'Préférences', href: '/settings/preferences' },
  { name: 'Sécurité', href: '/settings/security' },
]

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Paramètres</h1>
      
      {/* Navigation tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className="pb-4 px-1 border-b-2 border-transparent hover:border-blue-500 transition"
            >
              {tab.name}
            </Link>
          ))}
        </nav>
      </div>
      
      {/* Contenu du tab actif */}
      <div>{children}</div>
    </div>
  )
}
```

**Problème :** Ce code ne fonctionne pas car usePathname() est un hook client, mais le layout est un Server Component.

**Solution :** Créer un Client Component séparé pour les tabs :

```typescript
// app/settings/layout.tsx
import { SettingsTabs } from './components/SettingsTabs'

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Paramètres</h1>
      <SettingsTabs />
      <div className="mt-6">{children}</div>
    </div>
  )
}

// app/settings/components/SettingsTabs.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const tabs = [
  { name: 'Compte', href: '/settings/account' },
  { name: 'Facturation', href: '/settings/billing' },
  { name: 'Préférences', href: '/settings/preferences' },
]

export function SettingsTabs() {
  const pathname = usePathname()
  
  return (
    <div className="border-b border-gray-200">
      <nav className="flex space-x-8">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`pb-4 px-1 border-b-2 transition ${
                isActive
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.name}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
```

Cette séparation Server/Client est un pattern fondamental en Next.js 14.

## Layouts avec multiple children

Pour des layouts complexes avec plusieurs zones.

### Layout avec sidebar et panel

```typescript
// app/dashboard/layout.tsx
export default function DashboardLayout({
  children,
  sidebar,
  panel,
}: {
  children: React.ReactNode
  sidebar: React.ReactNode
  panel: React.ReactNode
}) {
  return (
    <div className="grid grid-cols-12 gap-6 p-6">
      {/* Sidebar gauche */}
      <div className="col-span-3">
        {sidebar}
      </div>
      
      {/* Contenu principal */}
      <div className="col-span-6">
        {children}
      </div>
      
      {/* Panel droit */}
      <div className="col-span-3">
        {panel}
      </div>
    </div>
  )
}
```

Avec parallel routes :
```
app/dashboard/
├── layout.tsx
├── @sidebar/
│   └── page.tsx
├── @panel/
│   └── page.tsx
└── page.tsx
```

---

Passez au Module 2 : [02-CREER-PAGE(COURS).md](./02-CREER-PAGE(COURS).md)


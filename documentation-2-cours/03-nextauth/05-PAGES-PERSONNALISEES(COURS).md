# Module 5 : Pages Personnalisées

## Pourquoi créer ses propres pages

Contrairement à Clerk qui fournit des interfaces toutes faites, NextAuth nécessite que vous créiez vos propres pages d'authentification. C'est plus de travail initial mais offre une flexibilité totale.

### Les pages par défaut

Si vous ne configurez rien, NextAuth utilise des pages par défaut très basiques et peu esthétiques. Ces pages conviennent pour du prototypage rapide mais pas pour une application professionnelle.

Pour une application de qualité, vous devez créer des pages personnalisées qui correspondent à votre design et à votre marque.

## Configuration des pages personnalisées

Dans votre configuration NextAuth, spécifiez les chemins de vos pages personnalisées.

```typescript
// lib/auth.ts
export const authOptions = {
  pages: {
    signIn: '/signin',
    signOut: '/signout',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
    newUser: '/welcome',
  },
  // ... autres configurations
}
```

Quand un utilisateur n'est pas authentifié et tente d'accéder à une route protégée, il sera redirigé vers `/signin` au lieu de la page par défaut NextAuth.

## Page de connexion personnalisée

Créons une page de connexion professionnelle avec support de plusieurs providers.

### Structure de base

```typescript
// app/(auth)/signin/page.tsx
"use client"

import { signIn } from "next-auth/react"
import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

export default function SignInPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/'
  
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleCredentials = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl,
    })

    setLoading(false)

    if (result?.error) {
      setError("Email ou mot de passe incorrect")
    } else {
      router.push(callbackUrl)
      router.refresh()
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-lg">
        <div>
          <h2 className="text-center text-3xl font-bold text-gray-900">
            Connexion
          </h2>
        </div>

        {/* OAuth Providers */}
        <div className="space-y-4">
          <button
            onClick={() => signIn("google", { callbackUrl })}
            className="flex w-full items-center justify-center gap-3 rounded-md bg-white px-4 py-2 text-gray-700 shadow-md hover:bg-gray-50 border"
          >
            Continuer avec Google
          </button>

          <button
            onClick={() => signIn("github", { callbackUrl })}
            className="flex w-full items-center justify-center gap-3 rounded-md bg-gray-900 px-4 py-2 text-white hover:bg-gray-800"
          >
            Continuer avec GitHub
          </button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500">Ou</span>
          </div>
        </div>

        {/* Email + Password Form */}
        <form onSubmit={handleCredentials} className="space-y-6">
          {error && (
            <div className="rounded-md bg-red-50 p-4 text-sm text-red-800">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600">
          Pas encore de compte ?{" "}
          <a href="/signup" className="font-medium text-blue-600 hover:text-blue-500">
            S'inscrire
          </a>
        </p>
      </div>
    </div>
  )
}
```

### Analyse du code

**La fonction signIn()**
C'est la fonction principale de NextAuth côté client. Elle accepte deux paramètres : le provider et des options.

Pour OAuth (Google, GitHub), l'option `callbackUrl` indique où rediriger après connexion réussie.

Pour Credentials, l'option `redirect: false` empêche NextAuth de rediriger automatiquement, vous permettant de gérer les erreurs et la navigation manuellement.

**Gestion des erreurs**
Si `signIn` retourne un objet avec `error`, la connexion a échoué. Vous affichez un message approprié à l'utilisateur.

**CallbackUrl**
Quand un utilisateur est redirigé vers signin parce qu'il tentait d'accéder à une route protégée, NextAuth ajoute `?callbackUrl=/route-protegee` à l'URL. Après connexion réussie, l'utilisateur est redirigé vers cette route plutôt que vers la page d'accueil.

## Page d'inscription

La page d'inscription appelle votre API route de création d'utilisateur.

```typescript
// app/(auth)/signup/page.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function SignUpPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de l'inscription")
      }

      // Rediriger vers la page de connexion
      router.push("/signin?registered=true")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-lg">
        <h2 className="text-center text-3xl font-bold text-gray-900">
          Créer un compte
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-md bg-red-50 p-4 text-sm text-red-800">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nom complet
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="mt-1 block w-full rounded-md border px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="mt-1 block w-full rounded-md border px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Mot de passe
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              minLength={8}
              className="mt-1 block w-full rounded-md border px-3 py-2"
            />
            <p className="mt-1 text-sm text-gray-500">
              Au moins 8 caractères
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Création..." : "S'inscrire"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600">
          Déjà un compte ?{" "}
          <a href="/signin" className="font-medium text-blue-600 hover:text-blue-500">
            Se connecter
          </a>
        </p>
      </div>
    </div>
  )
}
```

### Séparation des responsabilités

La page d'inscription (client component) collecte les données et les envoie à l'API route `/api/auth/signup` (server component). Cette séparation est importante :

**Côté client :** Validation basique, UX (loading states, messages d'erreur)

**Côté serveur :** Validation robuste, hachage du mot de passe, création en base de données, gestion des erreurs sécurisée

Ne jamais hasher les mots de passe côté client. C'est une opération serveur critique.

## Composants d'authentification

Créez des composants réutilisables pour l'authentification.

### UserButton (équivalent de Clerk)

```typescript
// components/UserButton.tsx
"use client"

import { signOut, useSession } from "next-auth/react"
import Image from "next/image"

export function UserButton() {
  const { data: session } = useSession()

  if (!session) return null

  return (
    <div className="flex items-center gap-4">
      {session.user.image && (
        <Image
          src={session.user.image}
          alt={session.user.name || "User"}
          width={40}
          height={40}
          className="rounded-full"
        />
      )}
      <div>
        <p className="font-medium">{session.user.name}</p>
        <p className="text-sm text-gray-500">{session.user.email}</p>
      </div>
      <button
        onClick={() => signOut({ callbackUrl: "/signin" })}
        className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
      >
        Déconnexion
      </button>
    </div>
  )
}
```

### Composants conditionnels

Équivalents de `<SignedIn>` et `<SignedOut>` de Clerk :

```typescript
// components/auth/SignedIn.tsx
"use client"

import { useSession } from "next-auth/react"

export function SignedIn({ children }: { children: React.ReactNode }) {
  const { status } = useSession()
  
  if (status === "authenticated") {
    return <>{children}</>
  }
  
  return null
}

// components/auth/SignedOut.tsx
export function SignedOut({ children }: { children: React.ReactNode }) {
  const { status } = useSession()
  
  if (status === "unauthenticated") {
    return <>{children}</>
  }
  
  return null
}
```

Utilisation :
```typescript
<SignedOut>
  <Link href="/signin">Se connecter</Link>
</SignedOut>

<SignedIn>
  <UserButton />
</SignedIn>
```

---

Passez au Module 6 : [06-INTEGRATION-PRISMA(COURS).md](./06-INTEGRATION-PRISMA(COURS).md)


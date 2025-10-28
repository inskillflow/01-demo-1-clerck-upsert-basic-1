# Module 4 : Sessions et Sécurité

## Gestion des sessions avec NextAuth

La gestion des sessions est au cœur de tout système d'authentification. NextAuth offre deux stratégies distinctes.

### Stratégie JWT (recommandée)

Avec la stratégie JWT, les informations de session sont stockées dans un cookie côté client, pas dans la base de données.

**Configuration :**
```typescript
session: {
  strategy: "jwt",
  maxAge: 30 * 24 * 60 * 60, // 30 jours
  updateAge: 24 * 60 * 60,    // Mettre à jour toutes les 24h
}
```

**Ce qui se passe :**
Quand l'utilisateur se connecte, NextAuth crée un JWT contenant l'ID de l'utilisateur et d'autres données configurées dans le callback jwt(). Ce JWT est signé avec votre NEXTAUTH_SECRET et stocké dans un cookie.

À chaque requête, le JWT est lu et vérifié (signature validée). Si valide, la session est considérée active. Aucune requête base de données n'est nécessaire.

**Avantages :**
Performance exceptionnelle car aucune requête DB pour vérifier la session. Parfait pour les applications serverless où chaque requête DB a un coût. Scalabilité horizontale facile.

**Limitations :**
Impossible de révoquer une session immédiatement. Si vous changez des données utilisateur (rôle, permissions), elles ne seront reflétées dans le JWT qu'à la prochaine connexion ou au prochain updateAge. Le JWT reste valide même si vous supprimez l'utilisateur de la base de données (jusqu'à expiration).

### Stratégie Database

Avec la stratégie database, chaque session est un enregistrement dans la table Session de votre base de données.

**Configuration :**
```typescript
session: {
  strategy: "database",
  maxAge: 30 * 24 * 60 * 60, // 30 jours
  updateAge: 24 * 60 * 60,    // Mettre à jour toutes les 24h
}
```

**Ce qui se passe :**
Quand l'utilisateur se connecte, NextAuth crée un enregistrement Session dans la DB avec un sessionToken unique. Ce token est stocké dans un cookie côté client.

À chaque requête, NextAuth lit le sessionToken du cookie, cherche la session correspondante dans la DB, et vérifie qu'elle n'est pas expirée.

**Avantages :**
Révocation instantanée possible (supprimez la session de la DB). Données de session peuvent être complexes et volumineuses. Audit complet de toutes les sessions actives. Meilleur contrôle sur qui est connecté et depuis où.

**Limitations :**
Requête DB à chaque vérification de session. Plus de charge sur la base de données. Moins adapté aux environnements serverless purs. Légèrement plus lent que JWT.

### Choisir la bonne stratégie

**Utilisez JWT si :**
- Vous hébergez sur Vercel ou autre plateforme serverless
- Vous avez beaucoup de trafic (performance critique)
- Vous n'avez pas besoin de révocation instantanée
- Vos données de session sont simples (juste ID et rôle)

**Utilisez Database si :**
- Vous avez besoin de révoquer des sessions immédiatement
- Vous voulez tracker toutes les sessions actives
- Vous gérez des données sensibles nécessitant un audit complet
- Vous n'êtes pas dans un environnement serverless strict

Pour la majorité des applications, JWT est le meilleur choix.

## Protection des routes

NextAuth fournit plusieurs méthodes pour protéger vos routes et vérifier l'authentification.

### Dans un Server Component

```typescript
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function ProtectedPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect("/signin")
  }
  
  // L'utilisateur est authentifié
  return (
    <div>
      <h1>Bienvenue {session.user.name}</h1>
      <p>Email: {session.user.email}</p>
    </div>
  )
}
```

**getServerSession** est la fonction à utiliser dans les Server Components. Elle lit la session de manière synchrone (avec JWT) ou fait une requête DB (avec stratégie database).

### Dans un Client Component

```typescript
"use client"

import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"

export default function ProtectedPage() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/signin")
    },
  })
  
  if (status === "loading") {
    return <div>Chargement...</div>
  }
  
  return <div>Contenu protégé</div>
}
```

**useSession** est le hook pour les Client Components. Il retourne la session et un status (loading, authenticated, unauthenticated).

Le paramètre `required: true` force la redirection si non authentifié. Le callback `onUnauthenticated` définit où rediriger.

### Avec le middleware

Pour protéger plusieurs routes d'un coup, utilisez le middleware NextAuth.

```typescript
// middleware.ts
export { default } from "next-auth/middleware"

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/admin/:path*",
  ]
}
```

Ce middleware vérifie automatiquement l'authentification pour toutes les routes matchées. Si l'utilisateur n'est pas authentifié, il est redirigé vers `/api/auth/signin`.

### Protection par rôle

Pour implémenter des rôles (admin, user, moderator), ajoutez une logique personnalisée.

**Dans le callback JWT :**
```typescript
callbacks: {
  async jwt({ token, user }) {
    if (user) {
      token.role = user.role
    }
    return token
  },
  async session({ session, token }) {
    session.user.role = token.role as string
    return session
  }
}
```

**Fonction helper pour vérifier le rôle :**
```typescript
// lib/auth-helpers.ts
export async function requireRole(role: string) {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== role) {
    redirect("/unauthorized")
  }
}

// Utilisation
export default async function AdminPage() {
  await requireRole("admin")
  
  return <div>Page admin</div>
}
```

## Sécurité avec NextAuth

Plusieurs couches de sécurité sont nécessaires pour une implémentation NextAuth robuste.

### Hachage des mots de passe

Si vous utilisez le provider Credentials, le hachage correct des mots de passe est crucial.

**Toujours utiliser bcrypt avec un cost factor approprié :**
```typescript
// À l'inscription
const hashedPassword = await bcrypt.hash(password, 12)

// À la connexion
const isValid = await bcrypt.compare(plainPassword, hashedPassword)
```

Ne jamais utiliser de hachage simple (MD5, SHA1) ou stocker les mots de passe en clair. Bcrypt inclut automatiquement un salt et résiste aux attaques par rainbow tables.

### Signature des JWT

Les JWT sont signés avec votre NEXTAUTH_SECRET. Cette signature garantit que le token n'a pas été modifié.

**Génération d'un secret fort :**
Le secret doit être long, aléatoire, et unique pour chaque environnement (dev, staging, production).

```bash
openssl rand -base64 32
```

Ne jamais réutiliser le même secret entre environnements. Si votre secret de dev fuite, ça ne compromet pas la production.

### Cookies sécurisés

NextAuth configure automatiquement les cookies avec les flags de sécurité appropriés :

**httpOnly** : Le cookie ne peut pas être lu par JavaScript (protection contre XSS)

**secure** : Le cookie n'est envoyé qu'en HTTPS (protection contre l'interception)

**sameSite** : Protection contre les attaques CSRF

Vous n'avez pas à configurer ces flags manuellement, NextAuth s'en occupe.

### Validation des données

Même avec une authentification correcte, validez toujours les données côté serveur.

**Exemple avec Zod :**
```typescript
import { z } from "zod"

const signupSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  password: z.string().min(8).regex(/[A-Z]/).regex(/[0-9]/),
})

export async function POST(request: Request) {
  const body = await request.json()
  
  // Valider
  const result = signupSchema.safeParse(body)
  
  if (!result.success) {
    return NextResponse.json(
      { error: "Données invalides", details: result.error },
      { status: 400 }
    )
  }
  
  const { name, email, password } = result.data
  // Continuer avec des données validées
}
```

Cette validation côté serveur est essentielle car la validation client peut être contournée.

### Protection CSRF

Les attaques CSRF (Cross-Site Request Forgery) tentent de faire exécuter des actions par un utilisateur authentifié à son insu.

NextAuth protège automatiquement contre les CSRF via :
- Tokens CSRF générés et vérifiés à chaque requête POST
- Cookies sameSite qui limitent l'envoi cross-origin
- Vérification de l'origin des requêtes

Vous n'avez pas à implémenter cette protection manuellement, elle est intégrée.

---

Passez au Module 5 : [05-PAGES-PERSONNALISEES(COURS).md](./05-PAGES-PERSONNALISEES(COURS).md)


# Module 3 : Providers d'Authentification

## Les providers OAuth

NextAuth supporte plus de 40 providers OAuth différents. Comprendre comment ils fonctionnent est essentiel.

### Qu'est-ce que OAuth ?

OAuth est un protocole standard qui permet à un utilisateur de se connecter à votre application en utilisant un compte existant (Google, GitHub, Facebook, etc.) sans partager son mot de passe avec vous.

**Le flux OAuth simplifié :**

**Étape 1 :** L'utilisateur clique sur "Se connecter avec Google"

**Étape 2 :** Votre application le redirige vers Google avec des paramètres spécifiques (votre client_id, les scopes demandés, une URL de retour)

**Étape 3 :** L'utilisateur se connecte sur Google et autorise votre application

**Étape 4 :** Google redirige vers votre application avec un code d'autorisation

**Étape 5 :** Votre application échange ce code contre un token d'accès (en arrière-plan)

**Étape 6 :** Votre application utilise ce token pour récupérer les informations de l'utilisateur (email, nom, photo)

**Étape 7 :** Votre application crée une session pour l'utilisateur

NextAuth gère automatiquement toutes ces étapes complexes. Vous n'avez qu'à configurer les clés API.

### Configuration de Google OAuth

Pour permettre la connexion avec Google, vous devez créer un projet dans Google Cloud Console.

**Étape 1 : Créer un projet Google Cloud**

1. Allez sur https://console.cloud.google.com
2. Créez un nouveau projet
3. Nommez-le (ex: "Mon App Auth")

**Étape 2 : Activer l'API OAuth**

1. Dans le menu, allez à "APIs & Services" → "Credentials"
2. Cliquez "Create Credentials" → "OAuth 2.0 Client ID"
3. Configurez l'écran de consentement si demandé

**Étape 3 : Configurer l'OAuth Client**

Type d'application : Web application

Authorized JavaScript origins :
```
http://localhost:3000
https://votre-domaine.com
```

Authorized redirect URIs :
```
http://localhost:3000/api/auth/callback/google
https://votre-domaine.com/api/auth/callback/google
```

**Important** : L'URL de callback doit suivre le pattern `/api/auth/callback/[provider-id]`. NextAuth attend ce format spécifique.

**Étape 4 : Obtenir les clés**

Après création, Google vous donne :
- Client ID : `xxxxx.apps.googleusercontent.com`
- Client Secret : `xxxxx`

Ajoutez-les dans `.env.local`.

### Configuration de GitHub OAuth

Le processus avec GitHub est similaire mais plus simple.

**Étape 1 : Créer une OAuth App GitHub**

1. Allez sur https://github.com/settings/developers
2. Cliquez "New OAuth App"

**Étape 2 : Configurer l'application**

Application name : "Mon App"

Homepage URL : `http://localhost:3000` (ou votre domaine en production)

Authorization callback URL : `http://localhost:3000/api/auth/callback/github`

**Étape 3 : Obtenir les clés**

GitHub vous donne :
- Client ID : `xxxxx`
- Client Secret : Cliquez "Generate a new client secret"

Ajoutez dans `.env.local` :
```env
GITHUB_ID=xxxxx
GITHUB_SECRET=xxxxx
```

### Implémentation dans NextAuth

Une fois les clés obtenues, configurez les providers dans votre fichier de configuration.

```typescript
// lib/auth.ts
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  // ... autres configurations
}
```

C'est tout ! NextAuth gère automatiquement tout le flux OAuth pour ces providers.

## Le provider Credentials (Email + Password)

Le provider Credentials permet l'authentification classique avec email et mot de passe. C'est plus complexe car vous devez gérer le hachage des mots de passe vous-même.

### Configuration du provider

```typescript
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { prisma } from "./prisma"

CredentialsProvider({
  name: "credentials",
  credentials: {
    email: { label: "Email", type: "email" },
    password: { label: "Password", type: "password" }
  },
  async authorize(credentials) {
    if (!credentials?.email || !credentials?.password) {
      throw new Error("Email et mot de passe requis")
    }

    // Chercher l'utilisateur dans la DB
    const user = await prisma.user.findUnique({
      where: { email: credentials.email }
    })

    if (!user || !user.hashedPassword) {
      throw new Error("Utilisateur non trouvé")
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(
      credentials.password,
      user.hashedPassword
    )

    if (!isPasswordValid) {
      throw new Error("Mot de passe incorrect")
    }

    // Retourner l'utilisateur (sans le password)
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      image: user.image,
    }
  }
})
```

### La fonction authorize

C'est le cœur du provider Credentials. Elle reçoit les identifiants saisis par l'utilisateur et doit retourner un objet utilisateur si les identifiants sont valides, ou `null` / throw une erreur si invalides.

**Sécurité critique :**
Ne jamais comparer les mots de passe en clair. Toujours utiliser `bcrypt.compare()` qui compare le mot de passe saisi avec le hash stocké en base de données.

Ne jamais retourner le mot de passe hashé dans l'objet utilisateur. Retournez uniquement les informations non-sensibles.

### Inscription d'un utilisateur

Le provider Credentials ne gère que la connexion. Pour l'inscription, vous devez créer une API route séparée.

```typescript
// app/api/auth/signup/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json()

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "Cet email est déjà utilisé" },
        { status: 400 }
      )
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 12)

    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        name,
        email,
        hashedPassword,
        role: "user",
      }
    })

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      }
    })
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de l'inscription" },
      { status: 500 }
    )
  }
}
```

Le nombre 12 dans `bcrypt.hash(password, 12)` est le "cost factor". Plus il est élevé, plus le hashing est lent mais sécurisé. 12 est un bon compromis en 2025.

## Le provider Email (Magic Links)

Le provider Email envoie un lien de connexion par email (passwordless authentication). L'utilisateur clique sur le lien et est automatiquement connecté.

### Configuration du provider

```typescript
import EmailProvider from "next-auth/providers/email"

EmailProvider({
  server: {
    host: process.env.EMAIL_SERVER_HOST,
    port: Number(process.env.EMAIL_SERVER_PORT),
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  },
  from: process.env.EMAIL_FROM,
})
```

### Configuration SMTP

Vous avez besoin d'un serveur SMTP pour envoyer les emails. Plusieurs options existent :

**SendGrid (recommandé pour production) :**
```env
EMAIL_SERVER_HOST=smtp.sendgrid.net
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=apikey
EMAIL_SERVER_PASSWORD=votre_api_key_sendgrid
EMAIL_FROM=noreply@votre-domaine.com
```

**Gmail (développement uniquement) :**
```env
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=votre-email@gmail.com
EMAIL_SERVER_PASSWORD=mot_de_passe_app
EMAIL_FROM=votre-email@gmail.com
```

**Mailtrap (tests) :**
```env
EMAIL_SERVER_HOST=smtp.mailtrap.io
EMAIL_SERVER_PORT=2525
EMAIL_SERVER_USER=votre_username_mailtrap
EMAIL_SERVER_PASSWORD=votre_password_mailtrap
EMAIL_FROM=test@example.com
```

### Le flux magic link

**Étape 1 :** Utilisateur entre son email

**Étape 2 :** NextAuth génère un token unique et le stocke dans la table VerificationToken

**Étape 3 :** NextAuth envoie un email avec un lien contenant ce token

**Étape 4 :** Utilisateur clique sur le lien

**Étape 5 :** NextAuth vérifie que le token existe et n'est pas expiré

**Étape 6 :** Si valide, NextAuth crée une session et supprime le token

**Étape 7 :** Utilisateur est connecté

Ce flux est totalement passwordless et très sécurisé car le lien expire rapidement (généralement 24 heures).

## Combiner plusieurs providers

La force de NextAuth est de pouvoir combiner plusieurs providers dans la même application.

```typescript
providers: [
  GoogleProvider({ ... }),
  GitHubProvider({ ... }),
  EmailProvider({ ... }),
  CredentialsProvider({ ... }),
]
```

Un utilisateur peut se connecter via Google la première fois, puis via GitHub la fois suivante avec le même email. NextAuth liera automatiquement les deux comptes au même utilisateur (même table User, deux enregistrements Account).

---

Passez au Module 4 : [04-SESSIONS-SECURITE(COURS).md](./04-SESSIONS-SECURITE(COURS).md)


# Module 2 : Configuration et Setup

## Installation des dépendances

La première étape est d'installer NextAuth et ses dépendances associées.

### Packages nécessaires

```bash
npm install next-auth@latest
npm install @next-auth/prisma-adapter
npm install bcryptjs
npm install -D @types/bcryptjs
```

**next-auth** : La bibliothèque principale qui gère toute la logique d'authentification.

**@next-auth/prisma-adapter** : L'adapter qui synchronise automatiquement NextAuth avec votre base de données Prisma. Il gère la création des utilisateurs, des sessions, et des comptes OAuth.

**bcryptjs** : Bibliothèque pour hasher les mots de passe. Nécessaire uniquement si vous implémentez l'authentification par email/password (Credentials provider).

### Génération du secret NextAuth

NextAuth nécessite un secret pour signer les JWT. Ce secret doit être généré de manière sécurisée.

**Sur Linux/Mac :**
```bash
openssl rand -base64 32
```

**Sur Windows (PowerShell) :**
```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Cette commande génère une chaîne aléatoire de 32 bytes encodée en base64. Exemple de résultat : `Kd8sJ3n/9fH2kL5mP0qR7tU6vW8xY1zA+B4cE5fG6h=`

### Configuration des variables d'environnement

Créez ou modifiez votre fichier `.env.local` :

```env
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=Kd8sJ3n/9fH2kL5mP0qR7tU6vW8xY1zA+B4cE5fG6h=

# Database (Supabase ou autre PostgreSQL)
DATABASE_URL="postgresql://postgres:password@localhost:5432/mydb"

# Google OAuth (optionnel)
GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxxxx

# GitHub OAuth (optionnel)
GITHUB_ID=xxxxx
GITHUB_SECRET=xxxxx
```

**NEXTAUTH_URL** : L'URL de votre application. En développement, c'est `http://localhost:3000`. En production, ce sera votre domaine réel.

**NEXTAUTH_SECRET** : Le secret généré précédemment. Gardez-le absolument confidentiel.

**Providers OAuth** : Nous verrons comment obtenir ces clés dans le module suivant.

## Configuration du schéma Prisma

NextAuth nécessite des tables spécifiques. Voici le schéma complet à utiliser.

### Schéma complet avec NextAuth

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Tables NextAuth (OBLIGATOIRES)
model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@map("accounts")
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("sessions")
}

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  
  // Champs NextAuth obligatoires pour Credentials provider
  hashedPassword String?
  
  // VOS champs personnalisés
  role          String    @default("user")
  bio           String?
  phoneNumber   String?
  website       String?
  
  // Relations NextAuth
  accounts      Account[]
  sessions      Session[]
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  @@map("users")
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
  @@map("verification_tokens")
}
```

### Analyse du schéma

**Table Account**
Chaque fois qu'un utilisateur se connecte via OAuth (Google, GitHub), un enregistrement Account est créé. Un utilisateur peut avoir plusieurs Accounts (connecté via Google ET GitHub avec le même email).

Le champ `providerAccountId` est l'ID de l'utilisateur chez le provider (ex: l'ID Google de l'utilisateur). La combinaison `[provider, providerAccountId]` est unique.

**Table Session**
Si vous utilisez la stratégie database, chaque session active est stockée ici. Le `sessionToken` est un UUID unique généré pour chaque session.

**Table User**
Les informations de base de l'utilisateur. Les champs `name`, `email`, `emailVerified`, et `image` sont utilisés par NextAuth. Vous pouvez ajouter autant de champs personnalisés que vous voulez.

Le champ `hashedPassword` n'est nécessaire que si vous implémentez l'authentification par email/password (Credentials provider). Pour OAuth uniquement, il peut être omis.

**Table VerificationToken**
Utilisée pour les magic links envoyés par email. Quand un utilisateur demande un lien de connexion, un token est généré et stocké ici. Au clic sur le lien, le token est vérifié et supprimé.

### Synchronisation du schéma

Une fois le schéma défini, synchronisez avec votre base de données :

```bash
npx prisma db push
npx prisma generate
```

Ces commandes créent les tables dans votre base de données et génèrent le client Prisma avec les nouveaux types.

## Structure des fichiers

Voici l'organisation recommandée pour une application NextAuth.

### Structure complète

```
app/
├── api/
│   └── auth/
│       └── [...nextauth]/
│           └── route.ts          # Handler NextAuth
├── (auth)/
│   ├── signin/
│   │   └── page.tsx              # Page de connexion personnalisée
│   ├── signup/
│   │   └── page.tsx              # Page d'inscription
│   └── error/
│       └── page.tsx              # Page d'erreur
├── layout.tsx                     # Root layout avec SessionProvider
└── page.tsx                       # Page d'accueil

lib/
├── auth.ts                        # Configuration NextAuth
└── prisma.ts                      # Client Prisma

components/
└── SessionProvider.tsx            # Client component wrapper
```

### Rôle de chaque fichier

**app/api/auth/[...nextauth]/route.ts**
C'est le point d'entrée de NextAuth. Ce fichier importe la configuration et exporte les handlers pour GET et POST.

**lib/auth.ts**
Contient l'objet `authOptions` avec toute la configuration : providers, callbacks, pages personnalisées, stratégie de session, etc.

**app/layout.tsx**
Wrappe l'application avec le SessionProvider pour rendre les hooks NextAuth disponibles partout.

**app/(auth)/signin/page.tsx**
Votre page de connexion personnalisée. Contrairement à Clerk qui fournit l'UI, avec NextAuth vous devez créer vos propres pages.

**components/SessionProvider.tsx**
Un wrapper client component nécessaire car `SessionProvider` de NextAuth doit être un client component, mais le root layout est un server component par défaut.

## Les callbacks NextAuth

Les callbacks sont des fonctions que NextAuth appelle à des moments spécifiques du cycle de vie de l'authentification. Ils permettent de personnaliser le comportement.

### Callback JWT

Appelé quand un JWT est créé ou mis à jour. Utilisez-le pour ajouter des données personnalisées au token.

```typescript
async jwt({ token, user, account }) {
  // À la première connexion, user est disponible
  if (user) {
    token.id = user.id
    token.role = user.role
  }
  return token
}
```

### Callback Session

Appelé quand la session est lue (à chaque appel `useSession()` ou `getServerSession()`). Utilisez-le pour exposer des données du JWT au client.

```typescript
async session({ session, token }) {
  // Ajouter des données du token à la session
  if (session.user) {
    session.user.id = token.id as string
    session.user.role = token.role as string
  }
  return session
}
```

### Callback SignIn

Appelé quand un utilisateur tente de se connecter. Retournez `true` pour autoriser, `false` pour bloquer.

```typescript
async signIn({ user, account, profile }) {
  // Vérifier si l'email est autorisé
  if (user.email?.endsWith('@company.com')) {
    return true
  }
  return false // Bloquer la connexion
}
```

Ce callback est utile pour implémenter des restrictions d'accès, par exemple autoriser uniquement certains domaines email.

## Différences clés avec Clerk

Comprendre ces différences aide à anticiper les défis lors de l'utilisation de NextAuth.

**Gestion de l'UI**
Avec Clerk, l'UI est fournie (popup de connexion, formulaires). Avec NextAuth, vous devez créer toutes les pages vous-même. C'est plus de travail mais permet une personnalisation totale.

**Synchronisation DB**
Avec Clerk, vous gérez la synchronisation manuellement (upsert ou webhooks). Avec NextAuth, l'adapter Prisma synchronise automatiquement à chaque connexion.

**Schéma de base de données**
Avec Clerk, votre schéma est simple et personnalisé. Avec NextAuth, vous devez inclure les tables obligatoires (User, Account, Session, VerificationToken) avec leurs champs spécifiques.

**Configuration des providers OAuth**
Avec Clerk, vous configurez les providers dans le dashboard web. Avec NextAuth, vous les configurez dans le code (fichier `lib/auth.ts`).

**Gestion des erreurs**
Avec Clerk, les erreurs sont gérées par Clerk et affichées dans leur UI. Avec NextAuth, vous devez gérer et afficher les erreurs vous-même.

---

Passez au Module 3 : [03-PROVIDERS-AUTHENTIFICATION(COURS).md](./03-PROVIDERS-AUTHENTIFICATION(COURS).md)


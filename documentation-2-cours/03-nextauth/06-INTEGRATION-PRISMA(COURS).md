# Module 6 : Intégration Prisma et Synchronisation

## L'adapter Prisma

L'adapter Prisma est le pont entre NextAuth et votre base de données. Il synchronise automatiquement les utilisateurs, sessions, et comptes OAuth.

### Configuration de l'adapter

```typescript
// lib/auth.ts
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "./prisma"

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  // ... autres configurations
}
```

C'est tout ! Cette simple ligne active la synchronisation automatique.

### Ce que fait l'adapter automatiquement

**À la première connexion OAuth (Google, GitHub) :**
1. L'adapter cherche un User avec cet email
2. Si inexistant, crée un nouveau User
3. Crée un Account lié à ce User avec les tokens OAuth
4. Si stratégie database, crée une Session

**Aux connexions suivantes :**
1. L'adapter retrouve le User via l'Account existant
2. Met à jour les tokens OAuth si nécessaires
3. Crée une nouvelle Session (ou met à jour le JWT)

**Tout cela se fait automatiquement**, vous n'avez pas besoin de coder la synchronisation comme avec Clerk.

## Personnalisation de la synchronisation

Vous pouvez personnaliser ce qui se passe lors de la création ou connexion via les callbacks.

### Callback signIn

Exécuté à chaque tentative de connexion. Utilisez-le pour ajouter de la logique personnalisée.

```typescript
callbacks: {
  async signIn({ user, account, profile, isNewUser }) {
    // Si c'est un nouvel utilisateur
    if (isNewUser) {
      // Créer des données par défaut
      await prisma.userPreferences.create({
        data: {
          userId: user.id,
          theme: "light",
          language: "fr",
          emailNotifications: true
        }
      })
      
      // Envoyer un email de bienvenue
      await sendWelcomeEmail(user.email)
    }
    
    return true // Autoriser la connexion
  }
}
```

**isNewUser** est `true` uniquement à la première connexion de cet utilisateur. Utilisez ce flag pour initialiser des données, envoyer des emails, créer des ressources par défaut, etc.

### Events pour le logging

Les events sont similaires aux callbacks mais sont déclenchés de manière asynchrone (ne bloquent pas la connexion).

```typescript
events: {
  async signIn({ user, account, isNewUser }) {
    console.log(`User signed in: ${user.email}`)
    
    // Logger dans une table d'audit
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: isNewUser ? "signup" : "signin",
        provider: account.provider,
        timestamp: new Date(),
      }
    })
  },
  
  async signOut({ session, token }) {
    console.log(`User signed out`)
    
    await prisma.auditLog.create({
      data: {
        userId: token.sub,
        action: "signout",
        timestamp: new Date(),
      }
    })
  }
}
```

## Gestion des champs personnalisés

Le schéma NextAuth de base est minimal. Vous voulez probablement ajouter des champs personnalisés.

### Étendre le modèle User

```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  hashedPassword String?
  
  // Relations NextAuth
  accounts      Account[]
  sessions      Session[]
  
  // VOS CHAMPS PERSONNALISÉS
  role          String    @default("user")
  bio           String?
  phoneNumber   String?
  company       String?
  jobTitle      String?
  location      String?
  website       String?
  twitter       String?
  linkedin      String?
  github        String?
  
  // Préférences
  emailNotifications Boolean  @default(true)
  theme              String   @default("light")
  language           String   @default("fr")
  
  // Vos relations
  posts         Post[]
  comments      Comment[]
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  @@map("users")
}

// Vos tables métier
model Post {
  id        String   @id @default(cuid())
  title     String
  content   String   @db.Text
  published Boolean  @default(false)
  
  authorId  String
  author    User     @relation(fields: [authorId], references: [id], onDelete: Cascade)
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([authorId])
  @@map("posts")
}
```

### Remplir les champs personnalisés

Les champs personnalisés ne sont pas remplis automatiquement par l'adapter. Vous devez le faire manuellement.

**Option 1 : Lors de l'inscription (Credentials)**
```typescript
// app/api/auth/signup/route.ts
const user = await prisma.user.create({
  data: {
    name,
    email,
    hashedPassword,
    role: "user", // Valeur par défaut
    theme: "light",
    language: "fr",
  }
})
```

**Option 2 : Via un formulaire de profil après connexion**
Créez une page `/profile` où l'utilisateur peut remplir bio, phoneNumber, etc.

**Option 3 : Dans le callback signIn pour OAuth**
```typescript
async signIn({ user, account, profile, isNewUser }) {
  if (isNewUser && account.provider === "github") {
    // Récupérer des infos supplémentaires depuis GitHub API
    await prisma.user.update({
      where: { id: user.id },
      data: {
        github: profile.login,
        bio: profile.bio,
        website: profile.blog,
      }
    })
  }
  return true
}
```

## Différences avec Clerk

Comparer la synchronisation NextAuth avec ce que nous avons vu avec Clerk.

### Avec Clerk (approche upsert)

Vous gérez manuellement la synchronisation via `syncUser()`. Vous contrôlez exactement quand et comment les données sont synchronisées.

```typescript
const user = await syncUser() // Appel manuel
```

### Avec NextAuth (adapter Prisma)

La synchronisation est automatique. Dès qu'un utilisateur se connecte, l'adapter crée ou met à jour le User et l'Account.

```typescript
// Rien à faire, c'est automatique
```

### Avantages et inconvénients

**NextAuth automatique :**
- Plus simple, pas de code de synchronisation
- Garantit que User et Account sont toujours cohérents
- Gère automatiquement les comptes multiples (Google + GitHub même user)

**Clerk manuel :**
- Contrôle total sur quand synchroniser
- Schéma plus simple (pas de tables Account, Session obligatoires)
- Flexibilité pour choisir quelles données synchroniser

Les deux approches sont valides, c'est une question de préférence et de cas d'usage.

---

Passez aux quiz : [07-QUIZ-QUESTIONS(OBLIGATOIRE).md](./07-QUIZ-QUESTIONS(OBLIGATOIRE).md)


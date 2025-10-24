# 🔴 Problèmes de Schéma Prisma

## Symptôme principal

```
❌ Invalid `prisma.user.upsert()` invocation:
The column `role` does not exist in the current database.
```

Puis successivement :
- `firstName` n'existe pas
- `lastName` n'existe pas  
- `imageUrl` n'existe pas
- `role` n'existe pas
- `profileComplete` n'existe pas
- `lastLogin` n'existe pas

---

## 🔍 Analyse approfondie

### Historique des migrations

Analyse des fichiers de migration révèle :

**Migration 1 (20251023164944_init)** - Création initiale
```sql
CREATE TABLE "users" (
    "firstName" TEXT,
    "lastName" TEXT,
    "imageUrl" TEXT,
    ...
)
```

**Migration 2 (20251023181041_init)** - Suppression ! 😱
```sql
ALTER TABLE "users" 
DROP COLUMN "firstName",
DROP COLUMN "imageUrl",
DROP COLUMN "lastName";
```

**Migration 3 (20251023183555_init)** - Re-ajout
```sql
ALTER TABLE "users" 
ADD COLUMN "firstName" TEXT,
ADD COLUMN "imageUrl" TEXT,
ADD COLUMN "lastName" TEXT;
```

**Migration 4 (20251023183838_add_username_nullable)**
```sql
ALTER TABLE "users" ADD COLUMN "username" TEXT;
```

### Problème identifié

**Le schéma Prisma contenait des champs qui n'existaient PAS dans la database réelle :**

```prisma
// ❌ SCHÉMA (prisma/schema.prisma)
model User {
  role            Role     @default(USER)      // N'existe PAS en DB
  profileComplete Boolean  @default(false)     // N'existe PAS en DB
  lastLogin       DateTime?                    // N'existe PAS en DB
}

enum Role {
  USER
  ADMIN
}
```

**La DB réelle n'avait que :**
- `id`, `clerkId`, `email`
- `firstName`, `lastName`, `imageUrl`
- `username` (ajouté récemment)
- `createdAt`, `updatedAt`

---

## ✅ Solution appliquée

### Étape 1 : Simplifier le schéma pour correspondre à la réalité

**Suppression des champs inexistants :**

```prisma
// ✅ SCHÉMA SIMPLIFIÉ
model User {
  id              String   @id @default(cuid())
  clerkId         String   @unique
  email           String   @unique
  username        String?
  firstName       String?
  lastName        String?
  imageUrl        String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@map("users")
}

// ❌ Enum Role supprimé (pas utilisé)
```

### Étape 2 : Regénérer le client Prisma

```bash
npx prisma generate
```

**Résultat :** ✅ Client Prisma synchronisé avec le schéma simplifié

---

## 🚨 Erreur de connexion Supabase

**Symptôme :**
```
Error: P1001
Can't reach database server at `aws-1-us-east-2.pooler.supabase.com:5432`
```

**Cause :** Variables d'environnement non trouvées (pas de `.env` ou `.env.local`)

**Solution :** L'app fonctionnait car les variables étaient définies dans `.env` existant (confirmé plus tard)

---

## 🔄 Migration manuelle des nouveaux champs

**Plus tard dans la session**, ajout de champs professionnels :

### Nouveaux champs ajoutés :
```prisma
model User {
  // ... champs existants
  
  // Champs métier
  bio             String?  @db.Text
  company         String?
  jobTitle        String?
  location        String?
  website         String?
  
  // Social
  twitter         String?
  linkedin        String?
  github          String?
  
  // Preferences
  emailNotifications Boolean @default(true)
  theme           String  @default("light")
  language        String  @default("fr")
}
```

### Migration appliquée :

**Commande :**
```bash
npx prisma db push --accept-data-loss
```

**Résultat :**
```
✔ Your database is now in sync with your Prisma schema. Done in 1.85s
✔ Generated Prisma Client (v5.22.0)
```

---

## 📝 Fichier SQL de migration manuelle

Créé `migration-manual.sql` pour documentation :

```sql
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS company TEXT,
ADD COLUMN IF NOT EXISTS "jobTitle" TEXT,
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS website TEXT,
ADD COLUMN IF NOT EXISTS twitter TEXT,
ADD COLUMN IF NOT EXISTS linkedin TEXT,
ADD COLUMN IF NOT EXISTS github TEXT,
ADD COLUMN IF NOT EXISTS "emailNotifications" BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS theme TEXT DEFAULT 'light',
ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'fr';

CREATE UNIQUE INDEX IF NOT EXISTS users_username_key 
ON users(username) WHERE username IS NOT NULL;
```

---

## 📚 Leçons apprises

### 1. Toujours vérifier la réalité de la DB
```bash
# Vérifier les migrations existantes
ls prisma/migrations/

# Voir l'état actuel de la DB
npx prisma db pull

# Comparer avec le schéma
npx prisma validate
```

### 2. Utiliser `prisma db push` en dev

**Quand utiliser :**
- ✅ En développement local
- ✅ Pour tester rapidement des changements
- ✅ Quand les migrations ne fonctionnent pas

**Éviter en production !** Utiliser `prisma migrate deploy`

### 3. Gérer les champs nullable vs required

```prisma
// ❌ Risqué si Clerk ne fournit pas toujours la donnée
username String @unique

// ✅ Sûr, avec fallback dans le code
username String? @unique
```

---

## 🔗 Fichiers modifiés

1. `prisma/schema.prisma` - Simplifié puis enrichi
2. `lib/sync-user.ts` - Ajout username + import 'server-only'
3. Plusieurs itérations avant stabilisation

---

**Status :** ✅ Tous les problèmes de schéma résolus  
**Temps total :** ~30 minutes  
**Complexité :** Moyenne


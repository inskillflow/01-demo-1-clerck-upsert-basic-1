# Module 5 : Migrations Prisma en Détail

## Qu'est-ce qu'une migration ?

Une migration est un fichier SQL qui décrit comment faire évoluer votre base de données d'un état à un autre. Les migrations permettent de versionner votre schéma de base de données comme vous versionnez votre code.

### Le problème sans migrations

Sans système de migrations, quand vous modifiez votre schéma Prisma, vous devez :
- Écrire manuellement le SQL pour modifier la base
- Risquer des erreurs SQL
- Perdre l'historique des changements
- Difficultés à synchroniser entre développeurs
- Impossible de revenir en arrière facilement

### La solution Prisma

Prisma génère automatiquement les migrations SQL à partir de votre schéma. Vous versionnez ces migrations dans Git. Chaque développeur et environnement (dev, staging, production) peut appliquer les mêmes migrations.

## Les trois commandes principales

Prisma offre trois commandes pour gérer le schéma, chacune avec un but spécifique.

### prisma db push

**Syntaxe :**
```bash
npx prisma db push
```

**Ce qu'elle fait :**
Compare votre `schema.prisma` avec l'état actuel de la base de données et applique les changements directement sans créer de fichier de migration.

**Quand l'utiliser :**
- En développement local pour prototyper rapidement
- Quand vous expérimentez avec le schéma
- Pour des changements temporaires
- Première synchronisation d'une nouvelle base

**Avantages :**
Rapide, pas de fichier de migration créé, idéal pour itérer.

**Inconvénients :**
Aucun historique des changements, risque de perte de données (peut supprimer et recréer des colonnes), ne doit JAMAIS être utilisé en production.

**Exemple de flux :**
```bash
# Vous modifiez schema.prisma
model User {
  id    String @id @default(cuid())
  email String @unique
  name  String? // ← Ajout de ce champ
}

# Appliquer le changement
npx prisma db push

# ✓ Colonne 'name' ajoutée à la table users
```

### prisma migrate dev

**Syntaxe :**
```bash
npx prisma migrate dev --name add_user_name
```

**Ce qu'elle fait :**
1. Compare le schéma avec la base de données
2. Génère un fichier de migration SQL
3. Applique la migration à la base de données
4. Met à jour le client Prisma
5. Enregistre la migration dans la table `_prisma_migrations`

**Quand l'utiliser :**
- Développement quand vous voulez versionner les changements
- Avant de commit dans Git
- Quand le schéma est stabilisé
- Pour créer un historique propre

**Avantages :**
Historique complet, migrations versionnées, revenir en arrière possible, production-ready.

**Inconvénients :**
Plus lent que `db push`, crée des fichiers à commit.

**Exemple de flux :**
```bash
# Vous modifiez schema.prisma
model User {
  id    String @id @default(cuid())
  email String @unique
  name  String?
  bio   String? // ← Ajout de bio
}

# Créer la migration
npx prisma migrate dev --name add_bio_field

# Prisma crée :
# prisma/migrations/20251028_add_bio_field/migration.sql

# Contenu du fichier SQL :
-- AlterTable
ALTER TABLE "users" ADD COLUMN "bio" TEXT;
```

Ce fichier SQL est généré automatiquement et versio nné dans Git.

### prisma migrate deploy

**Syntaxe :**
```bash
npx prisma migrate deploy
```

**Ce qu'elle fait :**
Applique toutes les migrations non appliquées sans en créer de nouvelles. Utilisée en production.

**Quand l'utiliser :**
- En production lors du déploiement
- En CI/CD avant le build
- Pour synchroniser une base de données avec les migrations versionnées

**Avantages :**
Sûr pour la production, ne modifie pas les fichiers de migration, déterministe.

**Inconvénients :**
Ne crée pas de migrations, ne synchronise pas un schéma divergent.

**Exemple de flux production :**
```bash
# Dans votre pipeline CI/CD
npx prisma migrate deploy
npm run build
npm start
```

Les migrations dans `prisma/migrations/` sont appliquées avant le démarrage de l'application.

## Structure des migrations

Comprendre ce que contient un dossier de migrations.

### Arborescence

```
prisma/
├── migrations/
│   ├── 20251023164944_init/
│   │   └── migration.sql
│   ├── 20251024103012_add_user_fields/
│   │   └── migration.sql
│   ├── 20251025141523_add_posts_table/
│   │   └── migration.sql
│   └── migration_lock.toml
└── schema.prisma
```

Chaque migration est un dossier avec un timestamp et un nom descriptif.

### Contenu d'une migration

**Fichier : migration.sql**
```sql
-- CreateTable
CREATE TABLE "users" (
  "id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "name" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
```

Le SQL généré par Prisma pour créer ou modifier les tables.

### Fichier migration_lock.toml

```toml
provider = "postgresql"
```

Indique quel provider de base de données est utilisé. Empêche d'appliquer accidentellement des migrations PostgreSQL sur MySQL.

### Table _prisma_migrations

Prisma crée automatiquement une table `_prisma_migrations` dans votre base de données :

```sql
CREATE TABLE "_prisma_migrations" (
  "id" TEXT PRIMARY KEY,
  "checksum" TEXT NOT NULL,
  "finished_at" TIMESTAMP,
  "migration_name" TEXT NOT NULL,
  "logs" TEXT,
  "rolled_back_at" TIMESTAMP,
  "started_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "applied_steps_count" INTEGER NOT NULL DEFAULT 0
);
```

Cette table enregistre quelles migrations ont été appliquées et quand. Prisma la consulte pour savoir quelles migrations restent à appliquer.

## Workflow de développement recommandé

Voici le flux recommandé pour travailler avec Prisma en développement et production.

### Phase 1 : Prototypage (db push)

Au tout début du développement, vous expérimentez avec le schéma :

```bash
# Modifier schema.prisma
# Tester rapidement
npx prisma db push
npx prisma generate

# Continuer à itérer...
npx prisma db push
```

Pas de migrations créées, vous itérez rapidement.

### Phase 2 : Stabilisation (migrate dev)

Une fois le schéma stabilisé et prêt à être partagé :

```bash
# Créer une migration
npx prisma migrate dev --name initial_schema

# Git
git add prisma/migrations/
git commit -m "Add initial schema migration"
git push
```

Maintenant les autres développeurs peuvent appliquer votre migration.

### Phase 3 : Changements futurs (migrate dev)

À chaque modification du schéma :

```bash
# 1. Modifier schema.prisma
# 2. Créer la migration
npx prisma migrate dev --name add_user_bio

# 3. Versionner
git add prisma/
git commit -m "Add bio field to User"
git push
```

### Phase 4 : Production (migrate deploy)

En production, n'utilisez QUE `migrate deploy` :

```bash
# Dans votre Dockerfile ou script de déploiement
npx prisma migrate deploy
npm run build
```

Ne jamais utiliser `db push` ou `migrate dev` en production.

## Gestion des conflits de migrations

Quand plusieurs développeurs travaillent en parallèle, des conflits de migrations peuvent survenir.

### Le scénario

**Développeur A :**
```bash
# Crée une migration
npx prisma migrate dev --name add_phone_number
# Commit et push
```

**Développeur B (en même temps) :**
```bash
# Crée une migration différente
npx prisma migrate dev --name add_address
# Commit et push
```

Les deux ont créé des migrations avec des timestamps différents mais basées sur le même schéma initial.

### Résolution

**Développeur B pull les changements de A :**
```bash
git pull origin main
# Conflit potentiel dans schema.prisma
```

**Deux options :**

**Option 1 : Résoudre et créer nouvelle migration**
```bash
# Résoudre les conflits dans schema.prisma
# Réinitialiser la base de données locale
npx prisma migrate reset

# Appliquer toutes les migrations (dont celle de A)
npx prisma migrate dev

# Votre migration sera appliquée après celle de A
```

**Option 2 : Squash des migrations (dev uniquement)**
```bash
# Supprimer les migrations en conflit
rm -rf prisma/migrations/

# Recréer from scratch
npx prisma migrate dev --name merged_schema
```

Cette option est acceptable en développement mais JAMAIS en production.

## Migrations et données existantes

Les migrations peuvent être destructives si mal gérées.

### Ajout de champ obligatoire

**Problématique :**
```prisma
model User {
  id    String @id
  email String @unique
  name  String  // ← Nouveau champ obligatoire (pas de ?)
}
```

Si la table `users` contient déjà des données, ajouter un champ obligatoire sans valeur par défaut échoue :

```sql
ALTER TABLE "users" ADD COLUMN "name" TEXT NOT NULL;
-- ERROR: column "name" contains null values
```

**Solutions :**

**Solution 1 : Valeur par défaut**
```prisma
name String @default("Unknown")
```

Prisma génère :
```sql
ALTER TABLE "users" ADD COLUMN "name" TEXT NOT NULL DEFAULT 'Unknown';
```

**Solution 2 : Champ optionnel**
```prisma
name String?
```

Prisma génère :
```sql
ALTER TABLE "users" ADD COLUMN "name" TEXT;
```

**Solution 3 : Migration en deux étapes**
```bash
# Étape 1 : Ajouter le champ optionnel
name String?

npx prisma migrate dev --name add_name_nullable

# Étape 2 : Remplir les données existantes
# Manuellement ou via script

# Étape 3 : Rendre obligatoire
name String @default("Unknown")

npx prisma migrate dev --name make_name_required
```

### Renommer un champ

**Problématique :**
```prisma
model User {
  id       String @id
  email    String @unique
  fullName String  // ← Renommé de "name" à "fullName"
}
```

Prisma ne peut pas deviner que vous avez renommé. Par défaut, il génère :
```sql
ALTER TABLE "users" DROP COLUMN "name";
ALTER TABLE "users" ADD COLUMN "fullName" TEXT;
```

**Les données de "name" sont perdues !**

**Solution : Migration personnalisée**
```bash
# Créer la migration
npx prisma migrate dev --create-only --name rename_name_to_fullname

# Éditer le fichier migration.sql généré
# Remplacer DROP + ADD par RENAME
```

**migration.sql modifié :**
```sql
-- RenameColumn
ALTER TABLE "users" RENAME COLUMN "name" TO "fullName";
```

Puis appliquer :
```bash
npx prisma migrate dev
```

### Supprimer un modèle avec relations

**Problématique :**
```prisma
model User {
  posts Post[]
}

model Post {
  id       String @id
  authorId String
  author   User @relation(fields: [authorId], references: [id])
}

// Vous supprimez le modèle Post
```

Prisma génère :
```sql
DROP TABLE "posts";
```

**Toutes les données posts sont perdues !**

**Workflow sécurisé :**
1. Backup de la base de données
2. Exporter les données Post si nécessaires
3. Appliquer la migration
4. Vérifier que rien n'a cassé
5. Commit

En production, testez toujours les migrations destructives sur un environnement de staging avant.

---

Passez au Module 6 : [06-ARCHITECTURE-COMPLETE(COURS).md](./06-ARCHITECTURE-COMPLETE(COURS).md)


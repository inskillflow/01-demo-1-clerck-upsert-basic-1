# Module 3 : Base de données avec Prisma

## Qu'est-ce qu'un ORM ?

Avant de parler de Prisma spécifiquement, comprenons ce qu'est un ORM et pourquoi il existe.

### Le problème des bases de données relationnelles

Les bases de données SQL comme PostgreSQL sont extrêmement puissantes, mais elles parlent un langage différent de JavaScript. Pour interagir avec une base de données, historiquement, il fallait écrire du SQL brut :

```sql
SELECT * FROM users WHERE email = 'user@example.com';
INSERT INTO users (email, name) VALUES ('user@example.com', 'John');
UPDATE users SET name = 'Jane' WHERE id = 123;
```

Cette approche crée plusieurs problèmes dans une application JavaScript moderne :

**Problème 1 : Pas de vérification de types**
JavaScript ne peut pas vérifier si votre requête SQL est correcte avant l'exécution. Une faute de frappe dans le nom d'une colonne provoquera une erreur uniquement au runtime.

**Problème 2 : Injections SQL**
Si vous concaténez des variables utilisateur dans vos requêtes SQL, vous ouvrez la porte aux injections SQL, une des vulnérabilités les plus dangereuses.

**Problème 3 : Maintenance difficile**
Quand votre schéma de base de données évolue, vous devez trouver et modifier toutes les requêtes SQL dans votre code. C'est fastidieux et source d'erreurs.

**Problème 4 : Pas de relations automatiques**
Si un User a plusieurs Posts, vous devez gérer manuellement les jointures SQL. Le code devient rapidement complexe.

### La solution ORM

Un ORM (Object-Relational Mapping) est une couche d'abstraction entre votre code et la base de données. Plutôt que d'écrire du SQL, vous manipulez des objets JavaScript.

Prisma est un ORM moderne qui résout tous les problèmes mentionnés ci-dessus d'une manière élégante et type-safe.

## Comment fonctionne Prisma

Prisma repose sur trois composants principaux :

### 1. Le schéma Prisma (schema.prisma)

C'est un fichier qui décrit la structure de votre base de données dans un langage déclaratif simple :

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  posts     Post[]
  createdAt DateTime @default(now())
}

model Post {
  id       String @id @default(cuid())
  title    String
  author   User   @relation(fields: [authorId], references: [id])
  authorId String
}
```

Ce schéma est la source de vérité unique pour votre base de données. Regardons ce que signifie chaque élément :

**@id** indique que ce champ est la clé primaire
**@unique** garantit qu'aucune valeur ne peut être dupliquée
**@default()** fournit une valeur par défaut
**String?** avec le point d'interrogation signifie optionnel (peut être null)
**Post[]** déclare une relation un-à-plusieurs avec le modèle Post

### 2. Le client Prisma généré

À partir de ce schéma, Prisma génère automatiquement un client TypeScript totalement typé. Quand vous exécutez `npx prisma generate`, Prisma crée des milliers de lignes de code dans `node_modules/@prisma/client`.

Ce client généré connaît exactement votre schéma. Si vous essayez d'accéder à un champ qui n'existe pas, TypeScript vous avertira immédiatement dans votre éditeur.

### 3. Les migrations

Prisma permet de versionner les changements de votre base de données. Plutôt que de modifier manuellement la structure en SQL, vous modifiez le schéma Prisma et générez une migration :

```bash
npx prisma migrate dev --name add_bio_field
```

Cela crée un fichier SQL avec les instructions nécessaires pour faire évoluer la base de données, tout en gardant un historique de tous les changements.

## Utilisation du client Prisma

Voyons comment on utilise concrètement Prisma dans le code :

### Création d'un singleton

Dans Next.js, on crée une instance unique du client Prisma pour toute l'application :

```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
```

Pourquoi ce code complexe ? En développement, Next.js recharge souvent le code. Sans cette astuce, on créerait une nouvelle connexion à chaque rechargement, ce qui épuise rapidement le pool de connexions de la base de données.

### Opérations CRUD de base

**Create - Créer**
```typescript
const user = await prisma.user.create({
  data: {
    email: 'user@example.com',
    name: 'John Doe'
  }
})
```

**Read - Lire**
```typescript
// Un seul utilisateur
const user = await prisma.user.findUnique({
  where: { email: 'user@example.com' }
})

// Plusieurs utilisateurs
const users = await prisma.user.findMany({
  where: { name: { contains: 'John' } },
  orderBy: { createdAt: 'desc' },
  take: 10
})
```

**Update - Mettre à jour**
```typescript
const user = await prisma.user.update({
  where: { id: '123' },
  data: { name: 'Jane Doe' }
})
```

**Delete - Supprimer**
```typescript
await prisma.user.delete({
  where: { id: '123' }
})
```

### L'opération Upsert

L'opération la plus importante dans notre architecture est l'upsert. C'est une combinaison d'UPDATE et INSERT :

```typescript
const user = await prisma.user.upsert({
  where: { clerkId: 'user_2abc123' },
  update: {
    email: 'newemail@example.com',
    name: 'Updated Name'
  },
  create: {
    clerkId: 'user_2abc123',
    email: 'newemail@example.com',
    name: 'Updated Name'
  }
})
```

Ce que fait cette opération :
1. Prisma cherche un utilisateur avec le clerkId spécifié
2. Si trouvé, il met à jour les champs spécifiés dans `update`
3. Si non trouvé, il crée un nouvel utilisateur avec les données de `create`
4. Dans tous les cas, il retourne l'utilisateur (créé ou mis à jour)

L'upsert est idempotent : vous pouvez l'appeler plusieurs fois avec les mêmes données sans créer de doublons.

### Les relations

Prisma gère automatiquement les relations entre tables. Vous pouvez récupérer un utilisateur avec tous ses posts en une seule requête :

```typescript
const user = await prisma.user.findUnique({
  where: { id: '123' },
  include: {
    posts: true
  }
})
// user.posts est un tableau de tous les posts de l'utilisateur
```

Prisma génère automatiquement les jointures SQL nécessaires. Vous n'avez pas à écrire de SQL complexe.

## Prisma avec Supabase

Dans notre projet, Prisma se connecte à une base de données PostgreSQL hébergée sur Supabase. Supabase n'est qu'un hébergeur de PostgreSQL avec une belle interface d'administration.

### Configuration de la connexion

La connexion se configure via la variable d'environnement DATABASE_URL dans le fichier `.env.local` :

```env
DATABASE_URL="postgresql://user:password@host:5432/database"
```

Cette URL contient :
- Le protocol (postgresql)
- Les identifiants (user:password)
- L'hôte du serveur
- Le port (5432 par défaut pour PostgreSQL)
- Le nom de la base de données

### Synchronisation du schéma

Quand vous modifiez `schema.prisma`, vous devez synchroniser ces changements avec Supabase :

```bash
npx prisma db push
```

Cette commande :
1. Compare le schéma Prisma avec la structure actuelle de la base
2. Génère les commandes SQL nécessaires (CREATE TABLE, ALTER TABLE, etc.)
3. Les exécute sur Supabase
4. Régénère le client Prisma avec les nouveaux types

### Visualisation des données

Prisma fournit une interface graphique pour explorer votre base de données :

```bash
npx prisma studio
```

Cela ouvre une application web sur localhost:5555 où vous pouvez voir et modifier vos données directement, sans écrire de SQL.

## Type safety : le super pouvoir de Prisma

Le plus grand avantage de Prisma est la sécurité des types. Quand vous écrivez du code avec le client Prisma, votre éditeur connaît exactement la structure de votre base de données.

Si votre schéma dit que `User` a un champ `email` de type `String`, alors :
- `user.email` est automatiquement typé comme `string` dans TypeScript
- Si vous écrivez `user.emai` (faute de frappe), TypeScript vous avertit immédiatement
- Si vous essayez de passer un nombre pour l'email, TypeScript refuse

Cette sécurité élimine une classe entière de bugs avant même d'exécuter le code.

---

Passez au Module 4 : [04-SYNCHRONISATION.md](./04-SYNCHRONISATION.md)


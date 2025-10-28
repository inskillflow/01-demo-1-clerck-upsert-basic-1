# Module 6 : Patterns Avancés avec Zod

## Schémas Prisma + Zod synchronisés

Gardez vos schémas Prisma et Zod synchronisés pour éviter les incohérences.

### Pattern recommandé

```typescript
// lib/schemas/user.ts
import { z } from 'zod'

// Schéma Zod qui reflète le modèle Prisma User
export const userCreateSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(100),
  role: z.enum(['user', 'admin', 'moderator']).default('user'),
  bio: z.string().max(500).optional(),
  phoneNumber: z.string().regex(/^0[1-9]\d{8}$/).optional()
})

export const userUpdateSchema = userCreateSchema.partial().omit({
  email: true // Email ne peut pas être modifié
})

export type UserCreateInput = z.infer<typeof userCreateSchema>
export type UserUpdateInput = z.infer<typeof userUpdateSchema>
```

```prisma
// prisma/schema.prisma
model User {
  id          String  @id @default(cuid())
  email       String  @unique
  name        String  @db.VarChar(100)
  role        String  @default("user")
  bio         String? @db.VarChar(500)
  phoneNumber String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

Les contraintes Zod (max, regex) reflètent les contraintes Prisma (@db.VarChar).

## Validation environnement

Validez vos variables d'environnement au démarrage pour détecter les erreurs de configuration tôt.

```typescript
// lib/env.ts
import { z } from 'zod'

const envSchema = z.object({
  // Next.js
  NODE_ENV: z.enum(['development', 'production', 'test']),
  
  // Clerk
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().startsWith('pk_'),
  CLERK_SECRET_KEY: z.string().startsWith('sk_'),
  
  // Database
  DATABASE_URL: z.string().url(),
  DIRECT_URL: z.string().url().optional(),
  
  // NextAuth
  NEXTAUTH_URL: z.string().url().optional(),
  NEXTAUTH_SECRET: z.string().min(32).optional(),
  
  // External APIs
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional()
})

// Valider au démarrage
export const env = envSchema.parse(process.env)

// Utilisation ailleurs dans le code
import { env } from '@/lib/env'

console.log(env.DATABASE_URL) // TypeScript sait que c'est une string
```

Si une variable manque ou est invalide, l'application ne démarre pas avec une erreur claire.

## Inférence de types avancée

Zod et TypeScript travaillent ensemble pour une sécurité de type maximale.

```typescript
const postSchema = z.object({
  title: z.string(),
  content: z.string(),
  published: z.boolean().default(false),
  tags: z.array(z.string()),
  author: z.object({
    id: z.string(),
    name: z.string()
  })
})

// Inférer le type
type Post = z.infer<typeof postSchema>

// TypeScript sait exactement la structure
function displayPost(post: Post) {
  console.log(post.title)        // string
  console.log(post.published)    // boolean
  console.log(post.tags[0])      // string
  console.log(post.author.name)  // string
}
```

Un schéma Zod = Validation runtime + Types TypeScript. Pas de duplication.

---

Passez aux quiz : [07-QUIZ-QUESTIONS(OBLIGATOIRE).md](./07-QUIZ-QUESTIONS(OBLIGATOIRE).md)


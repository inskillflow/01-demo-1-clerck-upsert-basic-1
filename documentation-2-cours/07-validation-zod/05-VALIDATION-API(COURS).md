# Module 5 : Validation des API Routes

## Valider les données d'une requête

Toute API route doit valider les données reçues avant de les traiter.

### API route avec validation complète

```typescript
// app/api/users/route.ts
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

const createUserSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().toLowerCase(),
  password: z.string().min(8).regex(/[A-Z]/).regex(/[0-9]/),
  role: z.enum(['user', 'admin']).default('user')
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Valider avec Zod
    const result = createUserSchema.safeParse(body)
    
    if (!result.success) {
      return NextResponse.json(
        {
          error: 'Données invalides',
          details: result.error.flatten().fieldErrors
        },
        { status: 400 }
      )
    }
    
    // Données valides et typées
    const { name, email, password, role } = result.data
    
    // Vérifier unicité email
    const existing = await prisma.user.findUnique({
      where: { email }
    })
    
    if (existing) {
      return NextResponse.json(
        { error: 'Email déjà utilisé' },
        { status: 409 }
      )
    }
    
    // Hasher le password
    const hashedPassword = await bcrypt.hash(password, 12)
    
    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        name,
        email,
        hashedPassword,
        role
      }
    })
    
    return NextResponse.json(
      { user: { id: user.id, name: user.name, email: user.email } },
      { status: 201 }
    )
  } catch (error) {
    console.error('POST /api/users error:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
```

**Protection complète :**
- Validation Zod des données
- Vérification métier (email unique)
- Codes HTTP appropriés (400, 409, 500)
- Données sensibles non retournées (password)

### Middleware de validation réutilisable

```typescript
// lib/api-helpers.ts
import { z } from 'zod'
import { NextResponse } from 'next/server'

export function withValidation<T extends z.ZodType>(
  schema: T,
  handler: (data: z.infer<T>, request: Request) => Promise<NextResponse>
) {
  return async (request: Request) => {
    try {
      const body = await request.json()
      const result = schema.safeParse(body)
      
      if (!result.success) {
        return NextResponse.json(
          { error: 'Validation failed', details: result.error.flatten() },
          { status: 400 }
        )
      }
      
      return await handler(result.data, request)
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid JSON' },
        { status: 400 }
      )
    }
  }
}

// Utilisation
const createUserSchema = z.object({ ... })

export const POST = withValidation(createUserSchema, async (data) => {
  // data est déjà validé et typé
  const user = await prisma.user.create({ data })
  return NextResponse.json({ user })
})
```

DRY : Le code de validation est centralisé.

---

Passez au Module 6 : [06-PATTERNS-AVANCES(COURS).md](./06-PATTERNS-AVANCES(COURS).md)


# Module 5 : Fichiers Avancés

## template.tsx : Layout qui se réinitialise

Le template.tsx est similaire à layout.tsx mais se démonte et remonte à chaque navigation.

### Template avec animation

```typescript
// app/template.tsx
'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'

export default function Template({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Se déclenche à chaque navigation
    console.log('Page visitée:', window.location.pathname)
    
    // Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'page_view', {
        page_path: window.location.pathname,
      })
    }
  }, [])
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  )
}
```

L'animation fade-in se répète à chaque navigation car le template se réinitialise.

## not-found.tsx : Page 404 personnalisée

```typescript
// app/not-found.tsx
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
      <div className="text-center">
        {/* Illustration 404 */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-slate-200">404</h1>
          <p className="text-3xl font-semibold text-slate-700 mt-4">
            Page non trouvée
          </p>
        </div>
        
        {/* Message */}
        <p className="text-slate-600 mb-8 max-w-md mx-auto">
          Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        
        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button className="gap-2">
              <Home className="w-4 h-4" />
              Retour à l'accueil
            </Button>
          </Link>
          
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Page précédente
          </Button>
        </div>
        
        {/* Liens utiles */}
        <div className="mt-12">
          <p className="text-sm text-slate-500 mb-4">Pages populaires :</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/about" className="text-blue-600 hover:underline text-sm">
              À propos
            </Link>
            <Link href="/blog" className="text-blue-600 hover:underline text-sm">
              Blog
            </Link>
            <Link href="/contact" className="text-blue-600 hover:underline text-sm">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
```

**UI complète avec :**
- Grand "404" visuel
- Message clair
- Bouton retour accueil ET retour arrière
- Liens vers pages populaires
- Design professionnel

## route.ts : API Routes

Les API routes dans App Router utilisent des fonctions nommées par méthode HTTP.

### API Route CRUD complète

```typescript
// app/api/users/route.ts
import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Schéma de validation
const userSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(100),
  bio: z.string().max(500).optional(),
})

// GET /api/users - Liste tous les utilisateurs
export async function GET(request: Request) {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }
    
    // Query params
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit
    
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
        }
      }),
      prisma.user.count()
    ])
    
    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('GET /api/users error:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// POST /api/users - Créer un utilisateur
export async function POST(request: Request) {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }
    
    const body = await request.json()
    
    // Valider avec Zod
    const result = userSchema.safeParse(body)
    
    if (!result.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: result.error.flatten() },
        { status: 400 }
      )
    }
    
    const { email, name, bio } = result.data
    
    // Vérifier si l'email existe déjà
    const existing = await prisma.user.findUnique({
      where: { email }
    })
    
    if (existing) {
      return NextResponse.json(
        { error: 'Cet email est déjà utilisé' },
        { status: 409 }
      )
    }
    
    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        email,
        name,
        bio,
        clerkId: userId, // Lier au user Clerk
      }
    })
    
    return NextResponse.json({ user }, { status: 201 })
  } catch (error) {
    console.error('POST /api/users error:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
```

### API Route dynamique

```typescript
// app/api/users/[id]/route.ts
import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

// GET /api/users/:id - Récupérer un utilisateur
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        email: true,
        name: true,
        bio: true,
        role: true,
        createdAt: true,
      }
    })
    
    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ user })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// PUT /api/users/:id - Mettre à jour un utilisateur
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }
    
    // Vérifier que c'est le bon utilisateur
    const dbUser = await prisma.user.findUnique({
      where: { id: params.id }
    })
    
    if (!dbUser || dbUser.clerkId !== userId) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      )
    }
    
    const body = await request.json()
    
    // Mettre à jour
    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: {
        name: body.name,
        bio: body.bio,
        // Autres champs...
      }
    })
    
    return NextResponse.json({ user: updatedUser })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// DELETE /api/users/:id - Supprimer un utilisateur
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }
    
    await prisma.user.delete({
      where: { id: params.id }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
```

**Pattern CRUD complet :**
- GET : Récupérer
- POST : Créer
- PUT : Mettre à jour
- DELETE : Supprimer

Chaque méthode a sa propre fonction exportée.

---

Passez au Module 6 : [06-APPLICATION-COMPLETE(COURS).md](./06-APPLICATION-COMPLETE(COURS).md)


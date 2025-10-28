# Module 6 : Implémentation dans Next.js

## Créer un JWT manuellement

Bien que vous utilisiez généralement une bibliothèque, comprendre comment créer un JWT manuellement est instructif.

### Installation de la bibliothèque

```bash
npm install jsonwebtoken
npm install -D @types/jsonwebtoken
```

### Créer un JWT

```typescript
// lib/jwt.ts
import jwt from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET!

export function createToken(userId: string, role: string) {
  const payload = {
    sub: userId,
    role: role,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) // 7 jours
  }

  const token = jwt.sign(payload, SECRET, {
    algorithm: 'HS256'
  })

  return token
}
```

La fonction `jwt.sign()` fait tout le travail : encode le header et payload, calcule la signature, assemble le JWT final.

### Vérifier un JWT

```typescript
export function verifyToken(token: string) {
  try {
    const payload = jwt.verify(token, SECRET, {
      algorithms: ['HS256'] // Spécifier explicitement
    })
    
    return payload
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error("Token expiré")
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new Error("Token invalide")
    } else {
      throw error
    }
  }
}
```

La fonction `jwt.verify()` vérifie la signature et l'expiration automatiquement. Si quelque chose ne va pas, elle lance une exception.

## Implémentation dans une API route

Créons un système d'authentification complet avec JWT dans Next.js.

### API de connexion

```typescript
// app/api/auth/login/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { createToken } from '@/lib/jwt'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    // Chercher l'utilisateur
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user || !user.hashedPassword) {
      return NextResponse.json(
        { error: "Email ou mot de passe incorrect" },
        { status: 401 }
      )
    }

    // Vérifier le mot de passe
    const isValid = await bcrypt.compare(password, user.hashedPassword)

    if (!isValid) {
      return NextResponse.json(
        { error: "Email ou mot de passe incorrect" },
        { status: 401 }
      )
    }

    // Créer le JWT
    const token = createToken(user.id, user.role)

    // Retourner le token dans un cookie httpOnly
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    })

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 // 7 jours
    })

    return response
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    )
  }
}
```

### Middleware de vérification

Créons un middleware qui vérifie le JWT sur les routes protégées.

```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from '@/lib/jwt'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value

  // Routes publiques
  const publicPaths = ['/', '/signin', '/signup', '/api/auth/login', '/api/auth/signup']
  
  if (publicPaths.includes(request.nextUrl.pathname)) {
    return NextResponse.next()
  }

  // Vérifier le token
  if (!token) {
    return NextResponse.redirect(new URL('/signin', request.url))
  }

  try {
    const payload = verifyToken(token)
    
    // Ajouter les infos user dans les headers pour les API routes
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-user-id', payload.sub as string)
    requestHeaders.set('x-user-role', payload.role as string)

    return NextResponse.next({
      request: {
        headers: requestHeaders
      }
    })
  } catch (error) {
    return NextResponse.redirect(new URL('/signin', request.url))
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
}
```

### Utiliser les infos JWT dans une API route

```typescript
// app/api/profile/route.ts
import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const headersList = headers()
  const userId = headersList.get('x-user-id')

  if (!userId) {
    return NextResponse.json(
      { error: "Non authentifié" },
      { status: 401 }
    )
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      bio: true,
      // Ne pas inclure hashedPassword
    }
  })

  if (!user) {
    return NextResponse.json(
      { error: "Utilisateur non trouvé" },
      { status: 404 }
    )
  }

  return NextResponse.json({ user })
}
```

Le middleware a déjà vérifié le JWT et ajouté l'ID utilisateur dans les headers. L'API route peut directement l'utiliser.

## Refresh tokens

Implémentons le pattern access token + refresh token pour combiner sécurité et performance.

### Schéma Prisma pour refresh tokens

```prisma
model RefreshToken {
  id        String   @id @default(cuid())
  token     String   @unique
  userId    String
  expiresAt DateTime
  createdAt DateTime @default(now())
  
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([userId])
  @@map("refresh_tokens")
}

model User {
  id             String         @id @default(cuid())
  email          String         @unique
  hashedPassword String?
  role           String         @default("user")
  
  refreshTokens  RefreshToken[]
  
  @@map("users")
}
```

### API de login avec refresh token

```typescript
// app/api/auth/login/route.ts
export async function POST(request: Request) {
  // ... vérification credentials ...

  // Créer access token (courte durée)
  const accessToken = jwt.sign(
    { sub: user.id, role: user.role },
    SECRET,
    { expiresIn: '15m' } // 15 minutes
  )

  // Créer refresh token (longue durée)
  const refreshTokenString = crypto.randomBytes(32).toString('hex')
  
  await prisma.refreshToken.create({
    data: {
      token: refreshTokenString,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 jours
    }
  })

  const response = NextResponse.json({ success: true })
  
  // Access token dans cookie httpOnly
  response.cookies.set('accessToken', accessToken, {
    httpOnly: true,
    secure: true,
    maxAge: 15 * 60 // 15 minutes
  })
  
  // Refresh token dans cookie httpOnly séparé
  response.cookies.set('refreshToken', refreshTokenString, {
    httpOnly: true,
    secure: true,
    maxAge: 7 * 24 * 60 * 60 // 7 jours
  })

  return response
}
```

### API de refresh

```typescript
// app/api/auth/refresh/route.ts
export async function POST(request: Request) {
  const refreshTokenString = request.cookies.get('refreshToken')?.value

  if (!refreshTokenString) {
    return NextResponse.json(
      { error: "Refresh token manquant" },
      { status: 401 }
    )
  }

  // Vérifier le refresh token en DB
  const refreshToken = await prisma.refreshToken.findUnique({
    where: { token: refreshTokenString },
    include: { user: true }
  })

  if (!refreshToken) {
    return NextResponse.json(
      { error: "Refresh token invalide" },
      { status: 401 }
    )
  }

  if (refreshToken.expiresAt < new Date()) {
    // Token expiré, le supprimer
    await prisma.refreshToken.delete({
      where: { id: refreshToken.id }
    })
    
    return NextResponse.json(
      { error: "Refresh token expiré" },
      { status: 401 }
    )
  }

  // Créer un nouvel access token
  const newAccessToken = jwt.sign(
    { sub: refreshToken.userId, role: refreshToken.user.role },
    SECRET,
    { expiresIn: '15m' }
  )

  const response = NextResponse.json({ success: true })
  
  response.cookies.set('accessToken', newAccessToken, {
    httpOnly: true,
    secure: true,
    maxAge: 15 * 60
  })

  return response
}
```

Ce système permet de révoquer l'accès en supprimant le refresh token de la DB, tout en bénéficiant de la performance JWT pour les requêtes normales.

---

Passez au Module 7 : [09-COMPARAISON-APPROCHES(COURS).md](./09-COMPARAISON-APPROCHES(COURS).md)


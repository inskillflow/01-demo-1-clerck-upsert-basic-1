# Module 6 : Exemples Concrets de Déploiement

## Exemple complet : Déploiement sur Vercel

Voici un guide complet du déploiement en production sur Vercel, sans ngrok.

### Configuration initiale du projet

**Fichier : vercel.json (optionnel)**

```json
{
  "buildCommand": "prisma generate && next build",
  "framework": "nextjs",
  "regions": ["cdg1"],
  "env": {
    "NODE_ENV": "production"
  }
}
```

### Étape 1 : Préparer le code

Assurez-vous que votre endpoint webhook est prêt :

```typescript
// app/api/webhooks/clerk/route.ts
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { Webhook } from 'svix'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET
  
  if (!WEBHOOK_SECRET) {
    console.error('Missing CLERK_WEBHOOK_SECRET')
    return NextResponse.json(
      { error: 'Webhook secret not configured' },
      { status: 500 }
    )
  }

  const headerPayload = headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json(
      { error: 'Missing svix headers' },
      { status: 400 }
    )
  }

  const payload = await req.json()
  const body = JSON.stringify(payload)

  const wh = new Webhook(WEBHOOK_SECRET)
  let evt

  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    })
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 401 }
    )
  }

  const eventType = evt.type
  console.log(`Webhook received: ${eventType}`)

  try {
    if (eventType === 'user.created') {
      await handleUserCreated(evt.data)
    } else if (eventType === 'user.updated') {
      await handleUserUpdated(evt.data)
    } else if (eventType === 'user.deleted') {
      await handleUserDeleted(evt.data)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`Error processing ${eventType}:`, error)
    return NextResponse.json(
      { error: 'Processing failed' },
      { status: 500 }
    )
  }
}

async function handleUserCreated(data: any) {
  const clerkId = data.id
  const email = data.email_addresses[0]?.email_address
  const firstName = data.first_name
  const lastName = data.last_name
  const imageUrl = data.image_url
  const username = data.username || email.split('@')[0]

  await prisma.user.upsert({
    where: { clerkId },
    update: { email, firstName, lastName, imageUrl, username },
    create: { clerkId, email, firstName, lastName, imageUrl, username }
  })

  console.log(`User created in DB: ${email}`)
}

async function handleUserUpdated(data: any) {
  const clerkId = data.id
  const email = data.email_addresses[0]?.email_address
  const firstName = data.first_name
  const lastName = data.last_name
  const imageUrl = data.image_url
  const username = data.username

  await prisma.user.upsert({
    where: { clerkId },
    update: { email, firstName, lastName, imageUrl, username },
    create: { clerkId, email, firstName, lastName, imageUrl, username }
  })

  console.log(`User updated in DB: ${email}`)
}

async function handleUserDeleted(data: any) {
  const clerkId = data.id

  await prisma.user.update({
    where: { clerkId },
    data: {
      deletedAt: new Date(),
      email: `deleted_${Date.now()}@example.com`
    }
  })

  console.log(`User soft deleted: ${clerkId}`)
}
```

### Étape 2 : Déployer sur Vercel

```bash
vercel --prod
```

URL obtenue : `https://mon-app.vercel.app`

### Étape 3 : Configurer Clerk

Webhook URL : `https://mon-app.vercel.app/api/webhooks/clerk`

Signing secret : `whsec_prod_abc123...`

### Étape 4 : Ajouter le secret sur Vercel

Vercel → Environment Variables → `CLERK_WEBHOOK_SECRET`

### Étape 5 : Redéployer et tester

Configuration permanente, tout fonctionne automatiquement !

## Récapitulatif : Ngrok vs Production

### Développement local (ngrok)

```
Terminal 1: npm run dev
Terminal 2: ngrok http 3000
Configuration: URL ngrok temporaire
```

### Production (sans ngrok)

```
Déploiement: vercel --prod
Configuration: URL permanente (une seule fois)
Fonctionnement: automatique
```

## Règle simple

**localhost = ngrok nécessaire**
**Site hébergé = ngrok PAS nécessaire**

---

Retour à l'index : [INDEX.md](./INDEX.md)


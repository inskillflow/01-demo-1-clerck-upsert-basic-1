# Module 3 : Implémentation Pratique

## Préparation de l'environnement

Avant de coder l'endpoint webhook, plusieurs étapes de configuration sont nécessaires.

### Installation des dépendances

La bibliothèque Svix est indispensable pour vérifier les signatures :

```bash
npm install svix
```

Cette bibliothèque contient tout le code cryptographique nécessaire. Vous n'avez pas à implémenter HMAC vous-même, ce qui serait complexe et source potentielle d'erreurs de sécurité.

### Configuration de ngrok pour le développement local

Votre localhost n'est pas accessible depuis Internet. Ngrok crée un tunnel temporaire qui expose votre serveur local.

**Installation de ngrok :**
Téléchargez depuis ngrok.com ou installez via npm :
```bash
npm install -g ngrok
```

**Utilisation :**
```bash
# Dans un terminal séparé
npm run dev
# Votre app tourne sur localhost:3000

# Dans un autre terminal
ngrok http 3000
```

Ngrok affichera une URL publique comme `https://abc123.ngrok.io`. Cette URL redirige vers votre localhost:3000.

**Configuration dans Clerk :**
Utilisez `https://abc123.ngrok.io/api/webhooks/clerk` comme URL de webhook dans le Clerk Dashboard.

**Important :** L'URL ngrok change à chaque redémarrage de ngrok (version gratuite). Vous devrez mettre à jour l'URL dans Clerk Dashboard chaque fois. Pour une URL fixe, utilisez un compte ngrok payant ou déployez sur un serveur réel pour les tests.

### Variables d'environnement

Ajoutez le signing secret dans votre `.env.local` :

```env
CLERK_WEBHOOK_SECRET=whsec_abc123def456...
```

Ce secret est disponible dans le Clerk Dashboard après création de l'endpoint webhook. Gardez-le absolument confidentiel.

## Structure du code

L'endpoint webhook sera une API route Next.js qui accepte uniquement les POST.

### Architecture du fichier

```
app/
└── api/
    └── webhooks/
        └── clerk/
            └── route.ts
```

Cette structure crée l'URL `/api/webhooks/clerk` accessible en POST.

### Le squelette de base

```typescript
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { Webhook } from 'svix'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  // 1. Récupérer le webhook secret
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET
  
  if (!WEBHOOK_SECRET) {
    throw new Error('Missing CLERK_WEBHOOK_SECRET')
  }

  // 2. Récupérer les headers svix
  const headerPayload = headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  // 3. Vérifier que tous les headers sont présents
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json(
      { error: 'Missing svix headers' },
      { status: 400 }
    )
  }

  // 4. Récupérer le body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  // 5. Créer l'instance Webhook pour vérification
  const wh = new Webhook(WEBHOOK_SECRET)

  // 6. Vérifier la signature
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

  // 7. La signature est valide, traiter l'événement
  const eventType = evt.type
  
  // Router selon le type d'événement
  // (code à venir)

  return NextResponse.json({ message: 'Webhook processed' })
}
```

Ce squelette gère toute la partie sécurité. Si on arrive au point 7, on est sûr que le webhook vient bien de Clerk.

## Vérification de signature en détail

Comprenons ce que fait `wh.verify()` en coulisses.

### Le processus cryptographique

Quand Clerk envoie un webhook, il :
1. Prend le body JSON en string
2. Concatène : `svix-id` + `.` + `svix-timestamp` + `.` + body
3. Calcule le HMAC-SHA256 de cette chaîne avec le secret
4. Encode le résultat en base64
5. L'envoie dans le header `svix-signature`

Votre code doit :
1. Faire exactement les mêmes opérations avec le body reçu
2. Comparer la signature calculée avec celle reçue
3. Accepter si elles correspondent

La bibliothèque Svix fait tout cela pour vous avec `wh.verify()`. Elle retourne le payload parsé si valide, ou lance une exception si invalide.

### Pourquoi cette méthode est sécurisée

Sans connaître le secret, impossible de générer une signature valide. Même si un attaquant intercepte un webhook légitime et essaie de le renvoyer modifié, la signature ne correspondra plus car elle était calculée sur l'ancien body.

Le timestamp dans la signature empêche les replay attacks : même avec un webhook valide capturé, on ne peut pas le renvoyer des heures plus tard car la vérification rejette les timestamps trop anciens.

## Gestion des événements utilisateur

Maintenant que la signature est vérifiée, routons les différents types d'événements.

### Structure de routing

```typescript
const eventType = evt.type

if (eventType === 'user.created') {
  await handleUserCreated(evt.data)
} else if (eventType === 'user.updated') {
  await handleUserUpdated(evt.data)
} else if (eventType === 'user.deleted') {
  await handleUserDeleted(evt.data)
} else {
  console.log(`Unhandled event type: ${eventType}`)
}
```

### Implémentation de user.created

```typescript
async function handleUserCreated(data: any) {
  const clerkId = data.id
  const email = data.email_addresses[0]?.email_address
  const firstName = data.first_name
  const lastName = data.last_name
  const imageUrl = data.image_url
  const username = data.username || email.split('@')[0]

  // Utiliser upsert pour l'idempotence
  await prisma.user.upsert({
    where: { clerkId },
    update: {
      email,
      firstName,
      lastName,
      imageUrl,
      username,
    },
    create: {
      clerkId,
      email,
      firstName,
      lastName,
      imageUrl,
      username,
    },
  })

  console.log(`User created: ${email}`)
}
```

Même si c'est un événement "created", on utilise upsert. Pourquoi ? Car si le webhook est renvoyé plusieurs fois, on ne veut pas d'erreur "utilisateur déjà existant". L'upsert gère cela élégamment.

### Implémentation de user.updated

```typescript
async function handleUserUpdated(data: any) {
  const clerkId = data.id
  const email = data.email_addresses[0]?.email_address
  const firstName = data.first_name
  const lastName = data.last_name
  const imageUrl = data.image_url
  const username = data.username

  // Encore upsert au cas où l'utilisateur n'existerait pas
  // (rare mais possible si la DB a été réinitialisée)
  await prisma.user.upsert({
    where: { clerkId },
    update: {
      email,
      firstName,
      lastName,
      imageUrl,
      username,
    },
    create: {
      clerkId,
      email,
      firstName,
      lastName,
      imageUrl,
      username,
    },
  })

  console.log(`User updated: ${email}`)
}
```

### Implémentation de user.deleted

```typescript
async function handleUserDeleted(data: any) {
  const clerkId = data.id

  // Option 1 : Suppression complète
  await prisma.user.delete({
    where: { clerkId }
  })

  // Option 2 : Soft delete (recommandé pour l'audit)
  await prisma.user.update({
    where: { clerkId },
    data: {
      deletedAt: new Date(),
      email: `deleted_${Date.now()}@example.com`, // Libérer l'email
    }
  })

  console.log(`User deleted: ${clerkId}`)
}
```

Pour un soft delete, ajoutez un champ `deletedAt` optionnel à votre schéma Prisma. Cela permet de garder un historique pour l'audit tout en marquant l'utilisateur comme supprimé.

## Gestion des erreurs robuste

Le code précédent fonctionne pour les cas nominaux, mais doit gérer les erreurs.

### Wrapper avec try-catch

```typescript
export async function POST(req: Request) {
  try {
    // ... tout le code précédent ...
    
    // Router selon le type
    try {
      if (eventType === 'user.created') {
        await handleUserCreated(evt.data)
      } else if (eventType === 'user.updated') {
        await handleUserUpdated(evt.data)
      } else if (eventType === 'user.deleted') {
        await handleUserDeleted(evt.data)
      }
    } catch (error) {
      console.error(`Error processing ${eventType}:`, error)
      // Retourner 500 pour que Svix réessaie
      return NextResponse.json(
        { error: 'Processing failed' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
    
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook failed' },
      { status: 500 }
    )
  }
}
```

### Stratégie de codes d'erreur

**Status 200 :** Succès, Svix ne réessaiera pas
**Status 400 :** Erreur client (headers manquants), Svix ne réessaiera pas
**Status 401 :** Signature invalide, Svix ne réessaiera pas
**Status 500 :** Erreur serveur, Svix réessaiera avec backoff

Utilisez 500 pour les erreurs temporaires (base de données indisponible) et 400/401 pour les erreurs permanentes (problème de configuration).

## Validation des données

Même avec une signature valide, validez que les données ont le format attendu.

### Utilisation de Zod

```typescript
import { z } from 'zod'

const ClerkUserSchema = z.object({
  id: z.string(),
  email_addresses: z.array(
    z.object({
      email_address: z.string().email()
    })
  ),
  first_name: z.string().nullable(),
  last_name: z.string().nullable(),
  image_url: z.string().url().nullable(),
  username: z.string().nullable(),
})

async function handleUserCreated(data: any) {
  // Valider avant de traiter
  const parsed = ClerkUserSchema.safeParse(data)
  
  if (!parsed.success) {
    console.error('Invalid user data:', parsed.error)
    throw new Error('Invalid user data')
  }

  const userData = parsed.data
  // Utiliser userData qui est maintenant typé
}
```

Cette validation protège contre des changements inattendus dans le format de Clerk ou des données corrompues.

## Logging et monitoring

En production, vous devez monitorer vos webhooks.

### Logging structuré

```typescript
async function handleUserCreated(data: any) {
  const startTime = Date.now()
  
  try {
    await prisma.user.upsert(...)
    
    const duration = Date.now() - startTime
    console.log(JSON.stringify({
      event: 'webhook_processed',
      type: 'user.created',
      clerkId: data.id,
      duration,
      success: true,
    }))
  } catch (error) {
    const duration = Date.now() - startTime
    console.error(JSON.stringify({
      event: 'webhook_error',
      type: 'user.created',
      clerkId: data.id,
      duration,
      error: error.message,
    }))
    throw error
  }
}
```

Ces logs structurés en JSON sont facilement parsables par des outils de monitoring comme Datadog, LogRocket, ou Sentry.

### Alertes

Configurez des alertes si :
- Le taux d'erreur dépasse 5%
- Le temps de traitement dépasse 2 secondes
- Plus de 10 webhooks échouent consécutivement

Cela vous permet de détecter rapidement les problèmes en production.

## Testing de l'endpoint

Tester les webhooks est crucial avant de passer en production.

### Test manuel avec Clerk Dashboard

1. Allez dans Clerk Dashboard → Webhooks
2. Cliquez sur votre endpoint
3. Cliquez "Send Example"
4. Choisissez le type d'événement
5. Cliquez "Send"

Vous verrez immédiatement si ça fonctionne et la réponse de votre serveur.

### Test automatisé

```typescript
// tests/webhooks/clerk.test.ts
import { POST } from '@/app/api/webhooks/clerk/route'
import { Webhook } from 'svix'

describe('Clerk Webhook', () => {
  it('should create user on user.created event', async () => {
    const payload = {
      type: 'user.created',
      data: {
        id: 'user_test123',
        email_addresses: [{ email_address: 'test@example.com' }],
        first_name: 'Test',
        last_name: 'User',
      }
    }

    // Générer une vraie signature
    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!)
    const headers = wh.sign('test-id', payload)

    const request = new Request('http://localhost:3000/api/webhooks/clerk', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers
    })

    const response = await POST(request)
    expect(response.status).toBe(200)

    // Vérifier que l'utilisateur existe dans la DB
    const user = await prisma.user.findUnique({
      where: { clerkId: 'user_test123' }
    })
    expect(user).not.toBeNull()
  })
})
```

---

Passez au Module 4 : [04-SCENARIOS-REELS.md](./04-SCENARIOS-REELS.md)


# Module 7 : Exemples Concrets de Déploiement

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
  // Récupérer le secret (sera configuré sur Vercel)
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET
  
  if (!WEBHOOK_SECRET) {
    console.error('Missing CLERK_WEBHOOK_SECRET')
    return NextResponse.json(
      { error: 'Webhook secret not configured' },
      { status: 500 }
    )
  }

  // Headers Svix
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

  // Body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  // Vérifier la signature
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

  // Traiter l'événement
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

### Étape 2 : Pousser sur GitHub

```bash
git add .
git commit -m "Add webhook endpoint"
git push origin main
```

### Étape 3 : Connecter Vercel

**Via le site web :**
1. Allez sur https://vercel.com
2. Cliquez "New Project"
3. Importez votre repo GitHub
4. Vercel détecte automatiquement Next.js

**Via CLI :**
```bash
npm install -g vercel
vercel login
vercel --prod
```

### Étape 4 : Configurer les variables d'environnement

Dans le dashboard Vercel → Settings → Environment Variables, ajoutez :

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_xxxxx
CLERK_SECRET_KEY=sk_live_xxxxx
DATABASE_URL=postgresql://postgres:password@...
DIRECT_URL=postgresql://postgres:password@...
```

Laissez `CLERK_WEBHOOK_SECRET` vide pour l'instant (sera ajouté après configuration Clerk).

### Étape 5 : Premier déploiement

Cliquez "Deploy" ou exécutez `vercel --prod`.

Vercel vous donne une URL : `https://mon-app.vercel.app`

### Étape 6 : Configurer le webhook dans Clerk

1. Allez sur https://dashboard.clerk.com
2. Sélectionnez votre application
3. Menu "Webhooks"
4. Cliquez "Add Endpoint"

**Configuration :**
- Endpoint URL : `https://mon-app.vercel.app/api/webhooks/clerk`
- Description : "Production Webhook"
- Subscribe to events : user.created, user.updated, user.deleted

Cliquez "Create".

### Étape 7 : Copier le signing secret

Clerk affiche le signing secret : `whsec_prod_abc123def456...`

Copiez-le.

### Étape 8 : Ajouter le secret sur Vercel

Retour sur Vercel :
1. Settings → Environment Variables
2. Add New
3. Key : `CLERK_WEBHOOK_SECRET`
4. Value : `whsec_prod_abc123def456...`
5. Save

### Étape 9 : Redéployer

```bash
vercel --prod
```

Ou via Git :
```bash
git commit --allow-empty -m "Trigger redeploy"
git push origin main
```

### Étape 10 : Tester

Créez un nouvel utilisateur. Vérifiez :
- Clerk Dashboard → Webhooks → Logs (status 200)
- Vercel → Functions → Logs
- Base de données (utilisateur créé)

## Exemple avec Railway

### Étapes simplifiées

1. Connecter le repo GitHub sur railway.app
2. Railway détecte Next.js automatiquement
3. Configurer les variables d'environnement
4. Railway génère une URL : `https://mon-app-production.up.railway.app`
5. Configurer webhook Clerk avec cette URL
6. Ajouter `CLERK_WEBHOOK_SECRET` dans Railway
7. Redéployer

## Exemple avec VPS (DigitalOcean)

### Configuration serveur Ubuntu

```bash
# Installation
apt update && apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs nginx certbot python3-certbot-nginx

# Cloner le projet
git clone https://github.com/your-repo.git
cd your-repo
npm install

# Build
npx prisma generate
npm run build

# PM2 pour process management
npm install -g pm2
pm2 start npm --name "app" -- start
pm2 startup
pm2 save
```

### Configuration Nginx

```nginx
server {
    listen 80;
    server_name monsite.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

### SSL avec Let's Encrypt

```bash
sudo certbot --nginx -d monsite.com
```

### Configuration webhook

URL : `https://monsite.com/api/webhooks/clerk`

## Récapitulatif : Ngrok vs Production

### Développement local (ngrok)

```
Terminal 1: npm run dev
Terminal 2: ngrok http 3000
Configuration Clerk: URL ngrok temporaire
```

### Production (sans ngrok)

```
Déploiement: vercel --prod
Configuration Clerk: URL permanente (une seule fois)
Fonctionne automatiquement
```

## Règle simple

**localhost = ngrok nécessaire**
**Site hébergé = ngrok PAS nécessaire**

---

Retour à l'index : [INDEX.md](./INDEX.md)


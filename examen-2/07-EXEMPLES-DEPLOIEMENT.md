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
1. Allez sur [https://vercel.com](https://vercel.com)
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

**Laissez `CLERK_WEBHOOK_SECRET` vide pour l'instant** (nous l'ajouterons après configuration Clerk).

### Étape 5 : Premier déploiement

Cliquez "Deploy" ou exécutez `vercel --prod`.

Vercel vous donne une URL : `https://mon-app.vercel.app`

### Étape 6 : Configurer le webhook dans Clerk

1. Allez sur [https://dashboard.clerk.com](https://dashboard.clerk.com)
2. Sélectionnez votre application
3. Menu "Webhooks"
4. Cliquez "Add Endpoint"

**Configuration :**
- Endpoint URL : `https://mon-app.vercel.app/api/webhooks/clerk`
- Description : "Production Webhook"
- Subscribe to events :
  - [x] user.created
  - [x] user.updated
  - [x] user.deleted

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
5. Environments : Production, Preview, Development
6. Save

### Étape 9 : Redéployer

Le changement de variable d'environnement nécessite un redéploiement.

**Option 1 : Via dashboard**
Vercel → Deployments → trois points → "Redeploy"

**Option 2 : Via CLI**
```bash
vercel --prod
```

**Option 3 : Via Git**
```bash
git commit --allow-empty -m "Trigger redeploy"
git push origin main
```

### Étape 10 : Tester

Créez un nouvel utilisateur dans votre application.

**Vérifier que ça fonctionne :**

1. **Dans Clerk Dashboard :**
   - Webhooks → Votre endpoint → onglet "Logs"
   - Vous devriez voir le webhook avec status 200 (Success)

2. **Dans Vercel :**
   - Deployments → Latest → Functions → Logs
   - Recherchez les logs de votre endpoint webhook

3. **Dans votre base de données :**
   - Ouvrez Supabase ou `npx prisma studio`
   - Vérifiez que l'utilisateur est créé

**Si tout fonctionne, vous voyez :**
- Status 200 dans Clerk
- Logs "User created in DB" dans Vercel
- L'utilisateur dans votre base de données

**Configuration terminée !** Votre webhook fonctionne maintenant automatiquement sans ngrok.

## Exemple avec Railway

Railway est une excellente alternative à Vercel.

### Étape 1 : Connecter le repo

1. Allez sur [https://railway.app](https://railway.app)
2. Cliquez "New Project"
3. Choisissez "Deploy from GitHub repo"
4. Sélectionnez votre repo

### Étape 2 : Configuration automatique

Railway détecte Next.js automatiquement et configure :
- Build command : `npm run build`
- Start command : `npm start`
- Port : 3000

### Étape 3 : Variables d'environnement

Dans Railway dashboard :
1. Variables → Raw Editor
2. Collez :

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_xxxxx
CLERK_SECRET_KEY=sk_live_xxxxx
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...
```

### Étape 4 : Obtenir l'URL

Railway génère une URL comme : `https://mon-app-production.up.railway.app`

### Étape 5 : Configurer Clerk

Webhook URL : `https://mon-app-production.up.railway.app/api/webhooks/clerk`

### Étape 6 : Ajouter le secret

Copiez le signing secret de Clerk et ajoutez-le dans Railway :

```env
CLERK_WEBHOOK_SECRET=whsec_prod_...
```

Railway redéploie automatiquement.

**Terminé !** Même résultat qu'avec Vercel, sans ngrok.

## Exemple avec un VPS (DigitalOcean)

Pour un contrôle total, hébergez sur votre propre serveur.

### Configuration du serveur

**Créer un droplet Ubuntu sur DigitalOcean :**
- OS : Ubuntu 22.04
- Plan : Basic ($6/mois)
- Region : choisir le plus proche

**Se connecter via SSH :**
```bash
ssh root@your-server-ip
```

### Installation des dépendances

```bash
# Mettre à jour le système
apt update && apt upgrade -y

# Installer Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Installer PM2 (process manager)
npm install -g pm2

# Installer Nginx
apt install -y nginx

# Installer Certbot (SSL)
apt install -y certbot python3-certbot-nginx
```

### Cloner et configurer le projet

```bash
# Créer un utilisateur non-root
adduser deployuser
usermod -aG sudo deployuser
su - deployuser

# Cloner le repo
git clone https://github.com/your-username/your-repo.git
cd your-repo

# Installer les dépendances
npm install

# Créer .env.local
nano .env.local
```

Contenu de `.env.local` :
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_xxxxx
CLERK_SECRET_KEY=sk_live_xxxxx
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...
CLERK_WEBHOOK_SECRET=whsec_prod_...
```

### Build et démarrage

```bash
# Générer Prisma client
npx prisma generate

# Build Next.js
npm run build

# Démarrer avec PM2
pm2 start npm --name "mon-app" -- start
pm2 startup
pm2 save
```

### Configuration Nginx

```bash
sudo nano /etc/nginx/sites-available/mon-app
```

Contenu :
```nginx
server {
    listen 80;
    server_name monsite.com www.monsite.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Activer le site :
```bash
sudo ln -s /etc/nginx/sites-available/mon-app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Configurer SSL avec Let's Encrypt

```bash
sudo certbot --nginx -d monsite.com -d www.monsite.com
```

Certbot configure automatiquement HTTPS.

### Configurer le webhook dans Clerk

URL : `https://monsite.com/api/webhooks/clerk`

**Votre webhook fonctionne maintenant sur votre propre serveur, sans ngrok !**

## Domaine personnalisé avec Vercel

Vercel permet d'utiliser votre propre domaine.

### Ajouter le domaine

1. Vercel dashboard → Settings → Domains
2. Add Domain : `monsite.com`
3. Vercel vous donne des enregistrements DNS à configurer

### Configurer le DNS

Chez votre registrar (Namecheap, GoDaddy, etc.) :

**Type A :**
```
Host: @
Value: 76.76.21.21
```

**Type CNAME :**
```
Host: www
Value: cname.vercel-dns.com
```

### Mettre à jour le webhook

Une fois le domaine configuré, mettez à jour dans Clerk :

URL : `https://monsite.com/api/webhooks/clerk`

## Monitoring des webhooks en production

Sans ngrok, vous ne voyez plus les webhooks en temps réel dans votre terminal. Voici comment monitorer en production :

### Logs Vercel

```bash
vercel logs --follow
```

Ou dans le dashboard : Deployments → Latest → Functions → Logs

### Logs Railway

Dans Railway dashboard : Deployments → View Logs

### Logs personnalisés

Ajoutez un système de logging structuré :

```typescript
// lib/logger.ts
export function logWebhook(event: string, data: any, success: boolean) {
  const log = {
    timestamp: new Date().toISOString(),
    event,
    success,
    environment: process.env.NODE_ENV,
    ...data
  }
  
  console.log(JSON.stringify(log))
  
  // Envoyer à un service de logging (optionnel)
  if (process.env.LOGTAIL_TOKEN) {
    fetch('https://in.logtail.com', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.LOGTAIL_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(log)
    })
  }
}
```

Utilisation :
```typescript
async function handleUserCreated(data: any) {
  try {
    await prisma.user.upsert(...)
    logWebhook('user.created', { userId: data.id }, true)
  } catch (error) {
    logWebhook('user.created', { userId: data.id, error }, false)
    throw error
  }
}
```

## Récapitulatif : Ngrok vs Production

### Développement local → Utilisez ngrok

```
Votre machine (localhost:3000)
    ↑
    | tunnel
    |
https://abc123.ngrok.io
    ↑
    | webhook
    |
Serveurs Clerk
```

**Commandes :**
```bash
# Terminal 1
npm run dev

# Terminal 2
ngrok http 3000
```

**Configuration Clerk :** URL temporaire ngrok

### Production → N'utilisez PAS ngrok

```
Votre serveur (Vercel/Railway/VPS)
https://monsite.com
    ↑
    | webhook direct
    |
Serveurs Clerk
```

**Commandes :**
```bash
vercel --prod
# ou
git push origin main (auto-deploy)
```

**Configuration Clerk :** URL permanente de production

## Conclusion

La règle est simple :
- **localhost = ngrok nécessaire**
- **Site hébergé = ngrok pas nécessaire**

Une fois déployé en production avec une URL publique stable, vous configurez le webhook une seule fois dans Clerk Dashboard et tout fonctionne automatiquement, sans aucune intervention manuelle ni outil supplémentaire.

---

Retour à l'index : [INDEX.md](./INDEX.md)


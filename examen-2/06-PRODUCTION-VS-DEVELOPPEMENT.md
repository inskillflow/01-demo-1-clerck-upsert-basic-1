# Module 6 : Production vs Développement Local

## La différence fondamentale

La nécessité de ngrok dépend uniquement de l'accessibilité de votre serveur depuis Internet.

### Développement Local (localhost)

Quand vous développez sur votre ordinateur avec `npm run dev`, votre application tourne sur `http://localhost:3000`. Cette URL n'existe que sur votre machine et n'est pas accessible depuis l'extérieur.

**Le problème :**
Les serveurs de Clerk sont hébergés sur Internet. Quand un utilisateur s'inscrit, Clerk essaie d'envoyer un webhook à votre URL configurée. Si vous avez configuré `http://localhost:3000/api/webhooks/clerk`, les serveurs de Clerk ne peuvent pas atteindre votre machine.

```
Serveur Clerk (Internet)
    |
    | POST http://localhost:3000/api/webhooks/clerk
    |
    ❌ ERREUR : localhost n'existe pas sur Internet
```

**La solution : ngrok**
Ngrok crée un tunnel qui expose temporairement votre localhost sur Internet via une URL publique comme `https://abc123.ngrok.io`.

```
Serveur Clerk (Internet)
    |
    | POST https://abc123.ngrok.io/api/webhooks/clerk
    |
    ↓ (tunnel ngrok)
    |
localhost:3000 (votre machine)
    |
    ✅ Webhook reçu !
```

### Production (site hébergé)

Une fois votre site déployé sur un hébergeur (Vercel, Netlify, Railway, etc.), il a une URL publique accessible depuis Internet. Dans ce cas, **ngrok n'est plus nécessaire**.

**Exemple avec Vercel :**
Votre site est déployé sur `https://mon-app.vercel.app`. Cette URL est accessible publiquement depuis n'importe où sur Internet.

```
Serveur Clerk (Internet)
    |
    | POST https://mon-app.vercel.app/api/webhooks/clerk
    |
    ↓ (directement via Internet)
    |
Serveur Vercel → Votre application Next.js
    |
    ✅ Webhook reçu directement !
```

**Pas besoin de tunnel** : Clerk et votre application sont tous deux sur Internet et peuvent communiquer directement.

## Configuration en développement local

Voici le processus complet avec ngrok.

### Étape 1 : Démarrer votre application

```bash
npm run dev
```

Votre application tourne sur `http://localhost:3000`.

### Étape 2 : Démarrer ngrok

Dans un terminal séparé :

```bash
ngrok http 3000
```

Ngrok affiche quelque chose comme :

```
ngrok

Session Status                online
Account                       your-account (Plan: Free)
Version                       3.5.0
Region                        Europe (eu)
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://abc123def456.ngrok.io -> http://localhost:3000

Connections                   ttl     opn     rt1     rt5     p50     p90
                              0       0       0.00    0.00    0.00    0.00
```

**L'URL importante :** `https://abc123def456.ngrok.io`

### Étape 3 : Configurer Clerk Dashboard

1. Allez sur [https://dashboard.clerk.com](https://dashboard.clerk.com)
2. Sélectionnez votre application
3. Menu "Webhooks"
4. Cliquez "Add Endpoint"
5. Entrez l'URL : `https://abc123def456.ngrok.io/api/webhooks/clerk`
6. Sélectionnez les événements : user.created, user.updated, user.deleted
7. Copiez le signing secret généré

### Étape 4 : Ajouter le secret dans .env.local

```env
CLERK_WEBHOOK_SECRET=whsec_abc123def456...
```

### Étape 5 : Redémarrer votre serveur

```bash
# Arrêter le serveur (Ctrl+C)
npm run dev
```

### Étape 6 : Tester

Créez un nouvel utilisateur dans votre application. Le webhook devrait être envoyé et vous devriez voir les logs dans votre terminal.

**Important :** L'URL ngrok change à chaque redémarrage de ngrok (version gratuite). Vous devrez mettre à jour l'URL dans Clerk Dashboard chaque fois.

## Configuration en production

Une fois déployé, la configuration est beaucoup plus simple et permanente.

### Exemple avec Vercel

**Étape 1 : Déployer sur Vercel**

```bash
# Installer Vercel CLI
npm install -g vercel

# Se connecter
vercel login

# Déployer
vercel --prod
```

Vercel vous donne une URL comme `https://mon-app.vercel.app` ou votre domaine personnalisé `https://monsite.com`.

**Étape 2 : Configurer les variables d'environnement sur Vercel**

Dans le dashboard Vercel :
1. Projet → Settings → Environment Variables
2. Ajouter toutes vos variables :
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
   - `DATABASE_URL`
   - `CLERK_WEBHOOK_SECRET` (sera ajouté après configuration Clerk)

**Étape 3 : Configurer Clerk Dashboard (une seule fois)**

1. Webhooks → Add Endpoint
2. URL : `https://mon-app.vercel.app/api/webhooks/clerk`
3. Événements : user.created, user.updated, user.deleted
4. Copier le signing secret

**Étape 4 : Ajouter le secret sur Vercel**

1. Retour sur Vercel dashboard
2. Environment Variables → Add
3. Key : `CLERK_WEBHOOK_SECRET`
4. Value : `whsec_abc123def...`
5. Save

**Étape 5 : Redéployer**

```bash
vercel --prod
```

Ou simplement push sur GitHub si vous avez configuré le déploiement automatique.

**C'est tout !** Votre configuration est permanente. Les webhooks fonctionnent maintenant automatiquement.

### Exemple avec Railway

**Déploiement :**

1. Connecter votre repo GitHub sur [railway.app](https://railway.app)
2. Railway détecte automatiquement Next.js
3. Déploiement automatique

Railway vous donne une URL comme `https://mon-app-production.up.railway.app`.

**Configuration webhook :**

Même processus que Vercel :
- URL webhook : `https://mon-app-production.up.railway.app/api/webhooks/clerk`
- Variables d'environnement dans Railway dashboard
- Configuration permanente

### Exemple avec Netlify

**Déploiement :**

```bash
npm install -g netlify-cli
netlify deploy --prod
```

URL fournie : `https://mon-app.netlify.app`

**Configuration webhook :**
- URL : `https://mon-app.netlify.app/api/webhooks/clerk`
- Variables dans Netlify dashboard → Site settings → Environment variables

### Exemple avec votre propre serveur (VPS)

Si vous hébergez sur un VPS (DigitalOcean, Linode, AWS EC2, etc.) :

**Configuration Nginx :**

```nginx
server {
    listen 80;
    server_name monsite.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**SSL avec Let's Encrypt :**

```bash
sudo certbot --nginx -d monsite.com
```

**URL webhook :** `https://monsite.com/api/webhooks/clerk`

Pas besoin de ngrok car votre serveur a une IP publique et un nom de domaine.

## Comparaison détaillée

### Développement Local avec ngrok

**Avantages :**
- Tester les webhooks pendant le développement
- Voir les webhooks en temps réel dans votre IDE
- Déboguer facilement avec console.log
- Pas besoin de déployer pour tester

**Inconvénients :**
- L'URL change à chaque redémarrage de ngrok (gratuit)
- Doit mettre à jour l'URL dans Clerk à chaque fois
- Ngrok doit rester actif
- Latence légèrement supérieure

**Quand l'utiliser :**
Uniquement pendant le développement initial de la fonctionnalité webhook.

### Production sans ngrok

**Avantages :**
- URL permanente et stable
- Configuration une seule fois
- Pas de tunnel, communication directe
- Plus rapide (pas de latence du tunnel)
- Plus fiable (pas de dépendance à ngrok)

**Inconvénients :**
- Nécessite un déploiement pour tester
- Debugging plus difficile (doit regarder les logs distants)

**Quand l'utiliser :**
Dès que votre application est déployée sur un hébergeur.

## Stratégie recommandée

### Approche en deux environnements

**Environnement 1 : Développement**
- URL : ngrok temporaire `https://abc123.ngrok.io`
- Endpoint Clerk : Webhook dev séparé
- Base de données : DB de test locale ou Supabase dev
- Logging : Verbose avec tous les détails

**Environnement 2 : Production**
- URL : permanente `https://monsite.com`
- Endpoint Clerk : Webhook production séparé
- Base de données : DB production
- Logging : Erreurs uniquement + metrics

### Configuration Clerk Dashboard

Créez **deux endpoints webhook** dans Clerk :

**Endpoint 1 - Développement**
- URL : `https://abc123.ngrok.io/api/webhooks/clerk`
- Description : "Dev Environment"
- Secret : `whsec_dev_abc123...`

**Endpoint 2 - Production**
- URL : `https://monsite.com/api/webhooks/clerk`
- Description : "Production Environment"
- Secret : `whsec_prod_xyz789...`

Avantage : Vous pouvez tester en dev sans affecter la production, et vous n'avez pas à changer l'URL production quand vous redémarrez ngrok.

## Code adaptatif

Votre code peut s'adapter automatiquement à l'environnement :

```typescript
// app/api/webhooks/clerk/route.ts
export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.NODE_ENV === 'production'
    ? process.env.CLERK_WEBHOOK_SECRET_PROD
    : process.env.CLERK_WEBHOOK_SECRET_DEV
  
  // ... reste du code
}
```

Variables d'environnement :

```env
# .env.local (développement)
CLERK_WEBHOOK_SECRET_DEV=whsec_dev_abc123...

# Vercel/Netlify (production)
CLERK_WEBHOOK_SECRET_PROD=whsec_prod_xyz789...
```

## Testing sans webhook réel

Pendant le développement, vous pouvez aussi tester sans recevoir de vrais webhooks :

### Option 1 : Simuler localement

```typescript
// scripts/test-webhook.ts
async function testWebhook() {
  const payload = {
    type: 'user.created',
    data: {
      id: 'user_test123',
      email_addresses: [{ email_address: 'test@example.com' }],
      first_name: 'Test',
      last_name: 'User'
    }
  }

  const response = await fetch('http://localhost:3000/api/webhooks/clerk', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })

  console.log(await response.json())
}

testWebhook()
```

Exécutez : `npx ts-node scripts/test-webhook.ts`

**Attention :** Ce test ne vérifie pas la signature. Pour tester la signature, utilisez ngrok ou la fonctionnalité "Test" de Clerk Dashboard.

### Option 2 : Clerk Dashboard "Send Example"

Dans Clerk Dashboard, vous pouvez rejouer des webhooks manuellement :
1. Webhooks → Votre endpoint
2. Onglet "Testing"
3. "Send Example Webhook"
4. Choisir le type d'événement
5. Cliquer "Send"

Cela envoie un webhook réel avec une vraie signature, même en développement.

## Résumé : Ai-je besoin de ngrok ?

**OUI, vous avez besoin de ngrok si :**
- Vous développez en local (`localhost`)
- Vous voulez tester les webhooks pendant le développement
- Votre machine n'a pas d'IP publique accessible

**NON, vous N'AVEZ PAS besoin de ngrok si :**
- Votre application est déployée sur Vercel, Netlify, Railway, etc.
- Vous avez un VPS avec une IP publique
- Vous avez un nom de domaine pointant vers votre serveur
- Vous êtes en production

**Analogie simple :**
Ngrok c'est comme donner une adresse postale temporaire pour recevoir du courrier. Une fois que vous avez une vraie maison (site hébergé), vous n'avez plus besoin de l'adresse temporaire.

## Checklist de migration dev → production

Quand vous passez de développement à production :

- [ ] Déployer l'application sur un hébergeur
- [ ] Obtenir l'URL publique permanente
- [ ] Créer un nouvel endpoint webhook dans Clerk pour la production
- [ ] Configurer l'URL : `https://votre-domaine.com/api/webhooks/clerk`
- [ ] Copier le nouveau signing secret de production
- [ ] Ajouter le secret dans les variables d'environnement de l'hébergeur
- [ ] Redéployer l'application
- [ ] Tester en créant un utilisateur de test
- [ ] Vérifier les logs dans Clerk Dashboard
- [ ] Désactiver (pas supprimer) l'endpoint de dev si vous ne l'utilisez plus
- [ ] Arrêter ngrok

Une fois cette migration faite, vous n'aurez plus jamais besoin de ngrok pour cet environnement de production.

---

Passez au Module 7 : [10-EXEMPLES-DEPLOIEMENT.md](./10-EXEMPLES-DEPLOIEMENT.md)


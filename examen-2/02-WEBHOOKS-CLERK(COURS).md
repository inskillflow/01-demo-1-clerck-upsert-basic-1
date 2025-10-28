# Module 2 : Webhooks avec Clerk

## Architecture spécifique Clerk

Clerk implémente les webhooks selon les standards de l'industrie, avec quelques spécificités importantes à comprendre.

### Le fournisseur de webhooks : Svix

Clerk utilise Svix, un service spécialisé dans la gestion de webhooks. Svix s'occupe de :

- Envoyer les webhooks de manière fiable
- Gérer les retries automatiques en cas d'échec
- Fournir des logs détaillés de chaque webhook
- Signer les requêtes pour la sécurité
- Gérer la mise en file d'attente et le rate limiting

Pour vous, développeur, cela signifie que vous utilisez la bibliothèque Svix pour vérifier les signatures. Clerk ne réinvente pas la roue, il utilise un standard éprouvé.

### Le format des webhooks

Chaque webhook envoyé par Clerk suit une structure JSON standardisée :

```json
{
  "data": {
    "id": "user_2abcdef123456",
    "email_addresses": [
      {
        "email_address": "user@example.com",
        "id": "idn_abc123",
        "verification": {
          "status": "verified"
        }
      }
    ],
    "first_name": "John",
    "last_name": "Doe",
    "image_url": "https://img.clerk.com/...",
    "username": "johndoe",
    "created_at": 1698765432000,
    "updated_at": 1698765432000
  },
  "object": "event",
  "type": "user.created"
}
```

**Le champ "type"** indique quel événement s'est produit. C'est le premier champ que vous vérifiez pour router la logique appropriée.

**Le champ "data"** contient l'objet complet de l'utilisateur avec toutes ses propriétés au moment de l'événement. Vous avez accès à tous les champs : email, nom, photo, métadonnées personnalisées, etc.

**Le timestamp** est en millisecondes Unix. Convertissez-le en Date JavaScript avec `new Date(timestamp)`.

### Les headers HTTP

Chaque requête webhook contient des headers spéciaux :

**svix-id**
Un identifiant unique pour ce webhook. Si vous recevez deux fois le même svix-id, c'est un retry du même événement. Utilisez cet ID pour implémenter l'idempotence.

**svix-timestamp**
Le timestamp Unix quand le webhook a été envoyé. Vous pouvez rejeter les webhooks trop anciens (protection contre les replay attacks).

**svix-signature**
La signature cryptographique du corps de la requête. C'est ce que vous vérifiez pour authentifier que la requête vient bien de Clerk.

**Exemple complet de headers :**
```
svix-id: msg_2abcdef123456
svix-timestamp: 1698765432
svix-signature: v1,g0hM9SsE+OTPJTGt/tmIKtSyZlE3uFJELVlNIOLJ1OE=
```

### Configuration dans Clerk Dashboard

Pour activer les webhooks, vous devez configurer Clerk :

**Étape 1 : Accéder aux webhooks**
Dans le Clerk Dashboard, allez dans "Webhooks" dans le menu de navigation.

**Étape 2 : Ajouter un endpoint**
Cliquez sur "Add Endpoint". Vous devez fournir :
- L'URL de votre endpoint (exemple : `https://your-domain.com/api/webhooks/clerk`)
- Les événements que vous voulez recevoir

**Étape 3 : Choisir les événements**
Cochez les événements pertinents. Pour une synchronisation utilisateur basique :
- user.created
- user.updated
- user.deleted

Vous pouvez ajouter d'autres événements plus tard.

**Étape 4 : Obtenir le signing secret**
Clerk génère automatiquement un secret de signature. Il ressemble à `whsec_abc123def456...`. 

**CRUCIAL :** Ce secret doit être stocké dans vos variables d'environnement et JAMAIS commité dans Git. C'est avec ce secret que vous vérifierez l'authenticité des webhooks.

### Le cycle de vie d'un webhook

Comprenons en détail ce qui se passe depuis l'événement jusqu'à votre code :

**Moment T : Événement se produit**
Un utilisateur clique sur "Créer un compte" dans votre interface Clerk et complète l'inscription.

**T + 0.1s : Clerk détecte l'événement**
Les serveurs Clerk détectent que le compte est créé et l'utilisateur a vérifié son email.

**T + 0.2s : Svix reçoit l'événement**
Clerk transmet l'événement à Svix avec les détails de l'utilisateur.

**T + 0.3s : Svix prépare le webhook**
Svix construit le payload JSON, calcule la signature avec votre secret, et prépare les headers.

**T + 0.4s : Envoi du webhook**
Svix envoie une requête POST à votre endpoint avec le payload et les headers signés.

**T + 0.5s : Votre serveur reçoit la requête**
Votre endpoint API Next.js reçoit la requête. Votre code s'exécute.

**T + 0.6s : Vérification de la signature**
Votre code utilise la bibliothèque Svix pour vérifier que la signature est valide.

**T + 0.8s : Traitement de l'événement**
Si la signature est valide, vous parsez le type d'événement et exécutez la logique appropriée (créer l'utilisateur dans Prisma).

**T + 1.0s : Réponse**
Vous retournez un status HTTP 200 pour indiquer que le webhook a été traité avec succès.

**T + 1.1s : Svix marque comme délivré**
Svix enregistre que le webhook a été délivré avec succès et n'essaiera pas de le renvoyer.

### Gestion des erreurs et retries

Si votre endpoint retourne une erreur (status 4xx ou 5xx) ou ne répond pas dans le délai imparti, Svix considère que le webhook a échoué.

**Stratégie de retry de Svix :**
Svix réessaiera automatiquement avec un backoff exponentiel :
- 1ère tentative : immédiate
- 2ème tentative : après 5 secondes
- 3ème tentative : après 5 minutes
- 4ème tentative : après 30 minutes
- 5ème tentative : après 2 heures
- 6ème tentative : après 5 heures
- 7ème tentative : après 10 heures
- Abandon après 3 jours

Cela signifie que votre code doit être idempotent : recevoir le même webhook plusieurs fois ne doit pas causer de problèmes.

### Implémenter l'idempotence

L'idempotence signifie que traiter un webhook plusieurs fois produit le même résultat qu'une seule fois.

**Mauvaise approche (non-idempotente) :**
```typescript
// Si le webhook est reçu 3 fois, créera 3 utilisateurs !
await prisma.user.create({
  data: { clerkId, email, name }
})
```

**Bonne approche (idempotente) :**
```typescript
// Utiliser upsert : crée si n'existe pas, met à jour sinon
await prisma.user.upsert({
  where: { clerkId },
  update: { email, name },
  create: { clerkId, email, name }
})
```

Avec upsert, peu importe combien de fois vous recevez le même webhook, vous aurez toujours un seul utilisateur avec les données à jour.

**Approche avancée avec tracking :**
```typescript
// Vérifier si on a déjà traité ce webhook
const processed = await prisma.webhookLog.findUnique({
  where: { svixId }
})

if (processed) {
  return res.status(200).json({ message: "Already processed" })
}

// Traiter et logger
await prisma.user.upsert(...)
await prisma.webhookLog.create({
  data: { svixId, type, processedAt: new Date() }
})
```

Cette approche garantit que même les side effects (emails, notifications) ne sont exécutés qu'une fois.

### Logs et debugging

Clerk et Svix fournissent des outils de debugging excellents.

**Dans le Clerk Dashboard :**
Allez dans "Webhooks" puis cliquez sur votre endpoint. Vous verrez :
- Liste de tous les webhooks envoyés
- Status (succès, échec, en attente)
- Le payload complet envoyé
- La réponse reçue de votre serveur
- Le temps de réponse

**Pour chaque webhook raté :**
Vous pouvez voir exactement pourquoi il a échoué :
- Timeout (votre serveur a mis trop de temps à répondre)
- Error 500 (votre code a crashé)
- Error 401/403 (problème de signature)
- Connection refused (votre serveur n'est pas accessible)

**Rejouer un webhook manuellement :**
Depuis le dashboard, vous pouvez cliquer "Resend" pour renvoyer n'importe quel webhook. C'est très utile pendant le développement pour tester votre code sans avoir à créer de vrais utilisateurs.

### Sécurité approfondie

Au-delà de la vérification de signature, plusieurs couches de sécurité existent :

**Vérification du timestamp**
Rejetez les webhooks dont le timestamp est trop ancien (plus de 5 minutes). Cela protège contre les replay attacks où quelqu'un enregistrerait un webhook valide et essaierait de le renvoyer plus tard.

**Validation du payload**
Même si la signature est valide, validez que les données ont le format attendu. Utilisez Zod ou similaire pour typer et valider le payload.

**Rate limiting**
Même avec des signatures valides, limitez le nombre de webhooks acceptés par minute pour vous protéger contre les attaques par flood.

**IP whitelisting**
Svix publie les ranges d'IP qu'ils utilisent. Vous pouvez configurer votre firewall pour n'accepter les requêtes sur votre endpoint webhook que depuis ces IPs.

**HTTPS obligatoire**
Les webhooks doivent toujours utiliser HTTPS. Clerk refuse de configurer des endpoints HTTP en production. Cela protège le payload en transit.

### Événements avancés

Au-delà des événements utilisateur de base, Clerk émet des événements pour :

**Organizations**
Si votre app utilise les organisations Clerk :
- organization.created
- organization.updated
- organization.deleted
- organizationMembership.created
- organizationMembership.updated
- organizationMembership.deleted

**Sessions**
- session.created (à chaque connexion)
- session.ended (déconnexion ou expiration)
- session.removed (révocation manuelle)
- session.revoked (révocation par admin)

**Email/SMS**
- email.created (utilisateur ajoute un email)
- sms.created (utilisateur ajoute un numéro)

**Utilité :** Ces événements permettent de construire des analytics détaillés, des systèmes d'audit de sécurité, ou des automatisations complexes.

### Webhooks en développement vs production

Les besoins diffèrent selon l'environnement :

**En développement :**
- Utiliser ngrok pour exposer votre localhost
- Configurer un endpoint séparé dans Clerk Dashboard pour le dev
- Logger tous les webhooks pour comprendre leur structure
- Tester manuellement en rejouant des webhooks

**En production :**
- Utiliser votre domaine réel (https://your-app.com/api/webhooks/clerk)
- Configurer des alertes si les webhooks échouent
- Logger uniquement les erreurs (pas tous les webhooks, sinon explosion des logs)
- Monitorer les temps de réponse pour détecter les ralentissements

---

Passez au Module 3 : [03-IMPLEMENTATION-PRATIQUE.md](./03-IMPLEMENTATION-PRATIQUE.md)


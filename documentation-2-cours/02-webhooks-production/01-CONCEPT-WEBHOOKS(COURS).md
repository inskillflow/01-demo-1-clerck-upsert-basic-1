# Module 1 : Comprendre les Webhooks

## Qu'est-ce qu'un webhook ?

Un webhook est un mécanisme de notification automatique entre deux systèmes. C'est l'inverse d'une requête API classique.

### L'API classique : Pull

Dans une architecture API traditionnelle, votre application doit constamment demander au serveur s'il y a du nouveau. C'est ce qu'on appelle le "polling" :

```
Votre App : "Y a-t-il des nouvelles données ?"
Serveur : "Non"
(5 secondes plus tard)
Votre App : "Y a-t-il des nouvelles données ?"
Serveur : "Non"
(5 secondes plus tard)
Votre App : "Y a-t-il des nouvelles données ?"
Serveur : "Oui, voici les données"
```

Ce système présente plusieurs problèmes. D'abord, vous faites de nombreuses requêtes inutiles qui consomment de la bande passante et de la puissance de calcul. Ensuite, il y a toujours un délai entre le moment où l'événement se produit et le moment où vous le découvrez. Si vous interrogez toutes les 5 secondes, vous pouvez avoir jusqu'à 5 secondes de retard.

### Le webhook : Push

Avec un webhook, c'est le serveur qui prend l'initiative de vous contacter quand quelque chose se produit :

```
(Un événement se produit)
Serveur → Votre App : "POST /webhook : Nouvel utilisateur créé"
Votre App : "Reçu, merci" (200 OK)
```

Le serveur envoie une requête HTTP POST à une URL que vous lui avez fournie. Cette requête contient les détails de l'événement qui vient de se produire.

### Analogie du monde réel

Imaginez que vous attendez un colis important.

**Approche Polling (Pull) :**
Vous appelez la poste toutes les heures pour demander "Mon colis est-il arrivé ?". C'est vous qui faites l'effort répétitif, et la plupart du temps la réponse est "non".

**Approche Webhook (Push) :**
Vous donnez votre numéro de téléphone à la poste et ils vous appellent dès que le colis arrive. Vous n'avez rien à faire, vous êtes notifié au moment exact où l'événement se produit.

## L'architecture webhook

Pour qu'un système de webhooks fonctionne, trois éléments sont nécessaires :

### 1. L'émetteur (Clerk)

C'est le service qui détecte les événements et envoie les notifications. Dans notre cas, c'est Clerk. Quand un utilisateur s'inscrit, se connecte, modifie son profil, ou supprime son compte, Clerk détecte ces événements.

Clerk maintient une liste d'URLs (endpoints) à contacter pour chaque type d'événement. Cette configuration se fait dans le Clerk Dashboard.

### 2. Le récepteur (votre API)

C'est votre application qui reçoit les notifications. Vous devez créer un endpoint HTTP (généralement POST) qui accepte les données envoyées par Clerk.

Cet endpoint doit être accessible publiquement sur Internet. En développement local, c'est un défi car votre localhost n'est pas accessible depuis l'extérieur. C'est pourquoi on utilise des outils comme ngrok pour créer un tunnel temporaire.

### 3. La configuration

Vous devez dire à Clerk où envoyer les webhooks. Dans le Clerk Dashboard, vous configurez :
- L'URL de votre endpoint (exemple : https://votre-app.com/api/webhooks/clerk)
- Les événements qui vous intéressent (user.created, user.updated, etc.)
- Le secret de signature (pour la sécurité)

## Pourquoi la sécurité est cruciale

Réfléchissez un instant : votre endpoint webhook est une URL publique qui, quand on l'appelle, peut créer, modifier ou supprimer des utilisateurs dans votre base de données. C'est extrêmement puissant, donc potentiellement dangereux.

### L'attaque hypothétique

Sans protection, un attaquant pourrait envoyer de fausses requêtes à votre endpoint :

```json
POST /api/webhooks/clerk
{
  "type": "user.created",
  "data": {
    "id": "fake_user_123",
    "email": "hacker@evil.com",
    "role": "admin"
  }
}
```

Si votre endpoint accepte aveuglément cette requête, l'attaquant pourrait créer des comptes administrateurs, modifier des données sensibles, ou corrompre votre base de données.

### La solution : signatures cryptographiques

Clerk signe chaque webhook avec une clé secrète que seuls Clerk et vous connaissez. Cette signature est envoyée dans les headers HTTP de la requête.

Votre endpoint doit :
1. Recevoir la signature dans le header
2. Recalculer la signature à partir du corps de la requête avec la clé secrète
3. Comparer les deux signatures
4. Accepter uniquement si elles correspondent

Si quelqu'un essaie d'envoyer une fausse requête, il ne peut pas générer la bonne signature car il ne connaît pas la clé secrète. Votre endpoint rejettera la requête.

Cette technique s'appelle HMAC (Hash-based Message Authentication Code) et est standard dans l'industrie.

## Les événements Clerk

Clerk émet différents types d'événements pour le cycle de vie d'un utilisateur :

### user.created

Déclenché quand un utilisateur termine son inscription. C'est le moment où l'utilisateur a vérifié son email et son compte est pleinement créé.

**Cas d'usage typiques :**
- Créer l'utilisateur dans votre base de données
- Envoyer un email de bienvenue
- Créer des ressources par défaut (dossiers, préférences)
- Logger l'événement pour analytics

### user.updated

Déclenché quand un utilisateur modifie son profil : changement de nom, d'email, de photo de profil, etc.

**Cas d'usage typiques :**
- Synchroniser les changements dans votre base de données
- Invalider les caches qui contiennent les anciennes données
- Notifier d'autres services de la modification

### user.deleted

Déclenché quand un utilisateur supprime son compte ou qu'un administrateur le supprime.

**Cas d'usage typiques :**
- Supprimer l'utilisateur de votre base de données
- Supprimer ou anonymiser ses données (conformité RGPD)
- Annuler ses abonnements
- Notifier d'autres utilisateurs si pertinent

### session.created / session.ended

Déclenché à chaque connexion et déconnexion.

**Cas d'usage typiques :**
- Logger les connexions pour la sécurité
- Détecter les connexions suspectes
- Analytics d'utilisation

### Autres événements

Clerk émet aussi des événements pour les organisations, les invitations, les changements de rôles, etc. Vous choisissez ceux qui vous intéressent.

## Webhooks vs Polling vs Upsert

Comparons trois approches de synchronisation :

### Polling (interrogation régulière)

```typescript
// Toutes les 5 secondes
setInterval(async () => {
  const users = await clerkClient.users.getUserList()
  // Comparer avec la base et synchroniser
}, 5000)
```

**Problèmes :**
- Consommation de ressources constante
- Délai de synchronisation (jusqu'à 5 secondes)
- Coût en requêtes API (Clerk facture par requête)
- Complexe de détecter ce qui a changé

### Upsert post-login

```typescript
// À la connexion utilisateur
const user = await syncUser()
```

**Avantages :**
- Extrêmement simple
- Une seule requête par session
- Fonctionne immédiatement en local

**Limites :**
- Synchronisation différée (à la prochaine connexion)
- Ne gère pas les suppressions
- Les modifications faites par admin ne sont pas synchronisées immédiatement

### Webhooks

```typescript
// Clerk appelle automatiquement
POST /api/webhooks/clerk
```

**Avantages :**
- Synchronisation instantanée
- Aucune requête inutile
- Gère tous les événements y compris suppressions
- Scalable (fonctionne avec des millions d'utilisateurs)

**Complexité :**
- Configuration initiale plus complexe
- Nécessite un endpoint public
- Gestion des retries et erreurs
- Vérification de signatures

## Quand utiliser les webhooks

Les webhooks sont recommandés dans ces situations :

**Cas 1 : Applications en production**
Une fois que votre MVP fonctionne et que vous avez des utilisateurs réels, migrer vers les webhooks améliore la fiabilité et l'expérience utilisateur.

**Cas 2 : Synchronisation multi-services**
Si plusieurs applications doivent être synchronisées avec Clerk (une app web, une app mobile, un service admin), les webhooks permettent de notifier toutes ces applications simultanément.

**Cas 3 : Automatisations complexes**
Quand vous devez déclencher des workflows complexes (emails, création de ressources, notifications, intégrations tierces) immédiatement après un événement utilisateur.

**Cas 4 : Conformité et audit**
Quand vous devez logger tous les événements utilisateur en temps réel pour des raisons de conformité ou de sécurité.

**Cas 5 : Gestion des suppressions**
Si votre application doit réagir immédiatement quand un utilisateur supprime son compte (RGPD, nettoyage de données).

## Les défis des webhooks

Malgré leurs avantages, les webhooks présentent des défis :

### Défi 1 : Le développement local

Votre localhost n'est pas accessible depuis Internet. Pour tester les webhooks en développement, vous devez utiliser ngrok ou un service similaire qui crée un tunnel temporaire.

### Défi 2 : L'idempotence

Un webhook peut être envoyé plusieurs fois pour le même événement (si la première tentative échoue et Clerk réessaie). Votre code doit gérer ces doublons sans créer de problèmes.

### Défi 3 : L'ordre des événements

Les webhooks peuvent arriver dans le désordre si votre serveur est lent ou si Clerk réessaie certains. Vous ne pouvez pas supposer qu'un user.updated arrivera toujours après le user.created correspondant.

### Défi 4 : Les erreurs réseau

Si votre serveur est temporairement indisponible, les webhooks échouent. Clerk réessaiera, mais vous devez gérer ces situations.

### Défi 5 : La sécurité

Vous devez absolument vérifier les signatures, sinon votre endpoint est une vulnérabilité critique.

Ces défis sont gérables avec du code approprié, ce que nous verrons dans les prochains modules.

---

Passez au Module 2 : [02-WEBHOOKS-CLERK.md](./02-WEBHOOKS-CLERK.md)


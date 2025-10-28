# Module 4 : JWT vs Sessions Traditionnelles

## Les sessions traditionnelles

Avant de comparer, comprenons en détail comment fonctionnent les sessions côté serveur.

### Le mécanisme session-cookie

**Connexion :**
L'utilisateur se connecte. Le serveur vérifie les credentials et crée un objet session en mémoire ou en base de données.

```javascript
// Session stockée côté serveur
const session = {
  id: "sess_abc123",
  userId: "user_456",
  createdAt: Date.now(),
  expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000)
}

// Stockage en mémoire
sessions.set("sess_abc123", session)

// Ou en base de données
await db.sessions.create(session)
```

Le serveur retourne un cookie contenant uniquement l'ID de session :
```
Set-Cookie: session_id=sess_abc123; HttpOnly; Secure; SameSite=Strict
```

**Requêtes suivantes :**
Le navigateur envoie automatiquement le cookie. Le serveur lit le session_id et cherche la session correspondante.

```javascript
const sessionId = req.cookies.session_id
const session = sessions.get(sessionId) // ou requête DB

if (session && session.expiresAt > Date.now()) {
  // Utilisateur authentifié
  const userId = session.userId
} else {
  // Session invalide ou expirée
}
```

### Avantages des sessions traditionnelles

**Révocation immédiate**
Supprimez la session de la mémoire ou de la DB, elle devient immédiatement invalide. Parfait pour les déconnexions ou les bannissements.

**Audit complet**
Toutes les sessions actives sont visibles dans la DB. Vous pouvez lister qui est connecté, depuis où, depuis quand.

**Données de session volumineuses**
Vous pouvez stocker autant de données que nécessaire dans la session sans impact sur la taille des requêtes HTTP.

**Simplicité conceptuelle**
Le modèle est simple à comprendre : le client a juste un ID, toutes les données sont serveur.

### Inconvénients des sessions traditionnelles

**Requête DB ou cache à chaque vérification**
Chaque requête nécessite de chercher la session. Avec des millions de requêtes, c'est coûteux.

**Scalabilité horizontale complexe**
Avec plusieurs serveurs, il faut un session store partagé (Redis, base de données). Configuration et maintenance supplémentaires.

**Pas adapté au serverless**
Les fonctions serverless sont sans état. Gérer des sessions nécessite une base de données externe, ajoutant de la latence.

**Problèmes cross-domain**
Partager une session entre différents domaines (api.site.com et app.site.com) nécessite des configurations complexes de cookies.

## Les JWT : une approche différente

Les JWT inversent complètement le paradigme. Plutôt que de stocker les données serveur et donner un ID au client, on donne toutes les données au client dans un format vérififiable.

### Le mécanisme JWT

**Connexion :**
L'utilisateur se connecte. Le serveur vérifie les credentials et crée un JWT contenant toutes les informations nécessaires.

```javascript
const jwt = createJWT({
  sub: user.id,
  email: user.email,
  role: user.role,
  exp: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60)
}, SECRET)

// Pas de stockage serveur !
```

Le JWT est envoyé au client :
```
Set-Cookie: token=eyJhbGci...; HttpOnly; Secure
```

**Requêtes suivantes :**
Le client envoie le JWT. Le serveur vérifie juste la signature.

```javascript
const jwt = req.cookies.token

try {
  const payload = verifyJWT(jwt, SECRET)
  // Signature valide, payload fiable
  const userId = payload.sub
  const userRole = payload.role
  // Traiter la requête
} catch (error) {
  // JWT invalide ou expiré
}
```

**Aucune requête base de données** pour vérifier l'authentification.

### Avantages des JWT

**Performance**
Vérifier un JWT est une opération CPU pure (calcul de signature). Beaucoup plus rapide qu'une requête DB.

**Scalabilité**
N'importe quel serveur peut vérifier un JWT indépendamment. Pas besoin de coordination ou de session store partagé.

**Stateless**
Le serveur ne stocke rien. Parfait pour serverless où chaque invocation est isolée.

**Cross-domain facile**
Les JWT peuvent être transmis via headers Authorization, fonctionnant facilement entre différents domaines.

### Inconvénients des JWT

**Pas de révocation immédiate**
Une fois créé, un JWT reste valide jusqu'à expiration, même si vous supprimez l'utilisateur de la DB.

**Taille**
Le JWT complet est envoyé à chaque requête, consommant plus de bande passante qu'un simple session ID.

**Données figées**
Si un utilisateur change de rôle, le JWT contient toujours l'ancien rôle jusqu'à expiration ou refresh.

**Exposition des données**
Le payload est lisible par quiconque intercepte le JWT. Pas de données sensibles dedans.

## Tableau comparatif détaillé

Comparons point par point sessions et JWT.

### Stockage serveur

**Sessions :** Requise (mémoire, Redis, ou DB)
**JWT :** Aucune

### Requêtes DB/Cache

**Sessions :** Requise à chaque vérification
**JWT :** Aucune (vérification CPU uniquement)

### Scalabilité horizontale

**Sessions :** Nécessite session store partagé
**JWT :** Natif, aucune coordination nécessaire

### Révocation

**Sessions :** Immédiate (suppression de la DB/cache)
**JWT :** Différée (jusqu'à expiration) ou nécessite blacklist

### Taille des requêtes HTTP

**Sessions :** Petit cookie (~50 bytes pour l'ID)
**JWT :** Plus gros cookie (~200-500 bytes selon payload)

### Serverless

**Sessions :** Problématique (nécessite DB externe)
**JWT :** Idéal (pas d'état requis)

### Sécurité

**Sessions :** ID aléatoire impossible à deviner
**JWT :** Signature cryptographique vérifiable

### Audit

**Sessions :** Facile (toutes les sessions visibles en DB)
**JWT :** Difficile (pas de liste centrale des JWT émis)

### Données de session

**Sessions :** Illimitées (stockées serveur)
**JWT :** Limitées (taille du token)

### Expiration

**Sessions :** Contrôle serveur total
**JWT :** Contrôle via claim exp

## Stratégies hybrides

Dans la pratique, beaucoup d'applications combinent les deux approches.

### JWT avec vérification DB occasionnelle

Utilisez JWT pour les requêtes fréquentes (performance), mais vérifiez occasionnellement en DB pour les opérations sensibles.

```javascript
// Requête normale : JWT uniquement
const payload = verifyJWT(token)
const userId = payload.sub

// Opération sensible : vérifier en DB aussi
const payload = verifyJWT(token)
const user = await db.users.findUnique({ where: { id: payload.sub } })

if (!user || user.banned) {
  throw new Error("Accès refusé")
}
```

Cela offre les performances JWT pour le trafic normal, tout en permettant la révocation pour les cas critiques.

### Access token + Refresh token

Une stratégie courante pour combiner performance JWT et révocation.

**Access token :**
JWT de courte durée (15 minutes). Utilisé pour les requêtes normales. Si compromis, l'impact est limité à 15 minutes.

**Refresh token :**
Token de longue durée (7-30 jours) stocké en DB. Utilisé uniquement pour obtenir un nouvel access token.

**Flux :**
1. Connexion → Serveur crée access token (15min) + refresh token (7j)
2. Client utilise access token pour les requêtes
3. Access token expire
4. Client utilise refresh token pour obtenir nouveau access token
5. Serveur vérifie refresh token en DB
6. Si valide, émet nouveau access token
7. Si révoqué, refuse et force reconnexion

Cette approche permet la révocation (via le refresh token en DB) tout en bénéficiant de la performance JWT pour la majorité des requêtes.

### NextAuth utilise cette approche

NextAuth crée un JWT de session (access token) avec une expiration courte, et le rafraîchit périodiquement. La stratégie `updateAge` contrôle à quelle fréquence le JWT est renouvelé.

```typescript
session: {
  strategy: "jwt",
  maxAge: 30 * 24 * 60 * 60, // 30 jours maximum
  updateAge: 24 * 60 * 60,    // Renouveler toutes les 24h
}
```

Si l'utilisateur est actif, son JWT est renouvelé tous les jours. Lors du renouvellement, NextAuth peut vérifier que l'utilisateur existe toujours et mettre à jour ses données.

---

Passez au Module 5 : [05-SECURITE-JWT(COURS).md](./05-SECURITE-JWT(COURS).md)


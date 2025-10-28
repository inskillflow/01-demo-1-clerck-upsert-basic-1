# Module 3 : Cryptographie et Signature

## HMAC : Hash-based Message Authentication Code

HMAC est l'algorithme de signature le plus couramment utilisé avec les JWT (via HS256). Comprendre son fonctionnement est essentiel.

### Le principe du hachage

Un hash (ou hachage) est une fonction à sens unique qui transforme n'importe quelle donnée en une chaîne de longueur fixe.

**Propriétés d'une bonne fonction de hash :**

**Déterministe** : La même entrée produit toujours le même hash
```
hash("hello") = "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824"
```

**Sens unique** : Impossible de retrouver l'entrée à partir du hash
On peut calculer hash("hello") facilement, mais partir du hash et retrouver "hello" est impossible.

**Effet avalanche** : Un changement minime dans l'entrée change complètement le hash
```
hash("hello")  = "2cf24dba..."
hash("hallo")  = "d3751d33..." (complètement différent)
```

**Résistance aux collisions** : Extrêmement difficile de trouver deux entrées différentes avec le même hash

### HMAC ajoute une clé secrète

HMAC prend une fonction de hash (SHA-256) et y ajoute une clé secrète dans le processus de hachage.

**Calcul simplifié :**
```
HMAC(message, secret) = hash(secret + message + secret)
```

La formule réelle est plus complexe, mais l'idée est là : la clé secrète est intégrée dans le calcul du hash.

**Résultat :**
Sans connaître le secret, impossible de calculer le bon HMAC, même si vous connaissez le message.

### Application aux JWT

Quand on crée un JWT avec HS256 :

```javascript
const header = { alg: "HS256", typ: "JWT" }
const payload = { sub: "user_123", name: "John" }

const encodedHeader = base64url(JSON.stringify(header))
const encodedPayload = base64url(JSON.stringify(payload))

const message = encodedHeader + "." + encodedPayload
const signature = HMAC-SHA256(message, SECRET_KEY)
const encodedSignature = base64url(signature)

const jwt = message + "." + encodedSignature
```

Pour vérifier :
```javascript
const [receivedHeader, receivedPayload, receivedSignature] = jwt.split('.')

const message = receivedHeader + "." + receivedPayload
const calculatedSignature = HMAC-SHA256(message, SECRET_KEY)

if (calculatedSignature === receivedSignature) {
  // Signature valide, JWT authentique
} else {
  // Signature invalide, JWT rejeté
}
```

## RSA : Signatures asymétriques

L'algorithme RS256 utilise la cryptographie asymétrique avec une paire de clés.

### Clé publique vs clé privée

Avec RSA, vous avez deux clés différentes :

**Clé privée** : Gardée secrète sur votre serveur, utilisée pour SIGNER les JWT
**Clé publique** : Peut être distribuée publiquement, utilisée pour VÉRIFIER les JWT

**L'asymétrie :**
Ce qui est signé avec la clé privée peut être vérifié avec la clé publique, mais pas l'inverse. Impossible de signer avec la clé publique.

### Cas d'usage RS256

**Scénario typique :**
Vous avez un service d'authentification qui crée les JWT, et plusieurs services API qui doivent les vérifier.

Avec HS256, vous devriez partager le secret avec tous les services (risque de fuite).

Avec RS256, seul le service d'auth a la clé privée. Les autres services ont juste la clé publique. Ils peuvent vérifier les JWT mais pas en créer de faux.

### Génération des clés RSA

```bash
# Générer la clé privée
openssl genrsa -out private.pem 2048

# Extraire la clé publique
openssl rsa -in private.pem -pubout -out public.pem
```

La clé privée reste secrète sur votre serveur d'authentification. La clé publique peut être distribuée ou exposée via un endpoint JWKS (JSON Web Key Set).

## Vérification de signature en détail

Comprendre exactement ce qui se passe quand un serveur vérifie un JWT.

### Étape 1 : Parsing

Le JWT reçu est splitté en trois parties :
```javascript
const parts = jwt.split('.')
if (parts.length !== 3) {
  throw new Error("JWT invalide : format incorrect")
}

const [headerB64, payloadB64, signatureB64] = parts
```

### Étape 2 : Décodage du header

```javascript
const header = JSON.parse(base64decode(headerB64))

if (header.typ !== "JWT") {
  throw new Error("Type invalide")
}

if (header.alg !== "HS256" && header.alg !== "RS256") {
  throw new Error("Algorithme non supporté")
}
```

Cette vérification empêche l'attaque "algorithm confusion" où quelqu'un changerait l'algorithme de RS256 à HS256 et utiliserait la clé publique comme secret.

### Étape 3 : Recalcul de la signature

```javascript
const message = headerB64 + "." + payloadB64
let expectedSignature

if (header.alg === "HS256") {
  expectedSignature = HMAC-SHA256(message, SECRET)
} else if (header.alg === "RS256") {
  expectedSignature = RSA-SHA256-Verify(message, PUBLIC_KEY)
}
```

### Étape 4 : Comparaison

```javascript
const receivedSignature = base64decode(signatureB64)

if (receivedSignature !== expectedSignature) {
  throw new Error("Signature invalide")
}
```

La comparaison doit être "constant-time" pour éviter les timing attacks, mais c'est un détail d'implémentation géré par les bibliothèques.

### Étape 5 : Vérification des claims

```javascript
const payload = JSON.parse(base64decode(payloadB64))

const now = Math.floor(Date.now() / 1000)

if (payload.exp && payload.exp < now) {
  throw new Error("JWT expiré")
}

if (payload.nbf && payload.nbf > now) {
  throw new Error("JWT pas encore valide")
}

if (payload.aud && payload.aud !== EXPECTED_AUDIENCE) {
  throw new Error("Audience incorrecte")
}
```

### Étape 6 : Utilisation

Si toutes les vérifications passent, les données du payload peuvent être utilisées en toute confiance.

```javascript
const userId = payload.sub
const userRole = payload.role

// Traiter la requête avec ces informations
```

## Pourquoi ne pas vérifier soi-même

Les étapes ci-dessus semblent simples, mais implémenter la vérification de JWT manuellement est risqué.

### Les pièges

**Timing attacks**
La comparaison de signature doit être constant-time pour éviter de révéler des informations via le temps de réponse.

**Padding et encoding**
Base64URL a des subtilités (padding optionnel, caractères spéciaux). Une implémentation incorrecte peut accepter des JWT invalides.

**Gestion des algorithmes**
Vous devez vérifier que l'algorithme annoncé dans le header est celui que vous attendez (protection contre algorithm confusion attack).

**Vérification d'expiration**
Les timestamps doivent être comparés correctement en tenant compte des fuseaux horaires et de la dérive d'horloge.

### Utilisez des bibliothèques éprouvées

Pour toutes ces raisons, utilisez toujours une bibliothèque établie :

**JavaScript/Node :**
- jsonwebtoken (la plus utilisée)
- jose (moderne, supporte tous les algorithmes)

**NextAuth :**
Utilise jose en interne pour gérer les JWT.

**Clerk :**
Gère la vérification de JWT en interne, vous n'avez qu'à appeler `auth()` ou `currentUser()`.

Ces bibliothèques sont auditées, testées, et gèrent tous les edge cases.

---

Passez au Module 4 : [04-JWT-VS-SESSIONS(COURS).md](./04-JWT-VS-SESSIONS(COURS).md)


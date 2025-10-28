# Module 2 : Anatomie d'un JWT

## Structure d'un JWT

Un JWT est composé de trois parties séparées par des points : `header.payload.signature`

Voici un JWT réel :
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

Chaque partie a un rôle spécifique. Décortiquons-les une par une.

## Partie 1 : Le Header

Le header est la première partie du JWT. Il contient des métadonnées sur le token lui-même.

**Version encodée :**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
```

**Version décodée (base64) :**
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

### Les champs du header

**alg (algorithm)**
L'algorithme utilisé pour signer le JWT. Les valeurs courantes :
- HS256 : HMAC avec SHA-256 (signature symétrique avec clé secrète)
- RS256 : RSA avec SHA-256 (signature asymétrique avec paire de clés publique/privée)
- ES256 : ECDSA avec SHA-256 (signature asymétrique elliptique)

Pour la majorité des applications, HS256 est suffisant et plus simple. RS256 est utilisé quand vous devez distribuer la clé publique pour que d'autres puissent vérifier vos JWT sans avoir accès à votre clé privée.

**typ (type)**
Indique que c'est un JWT. Toujours "JWT" pour les JSON Web Tokens. Il existe d'autres types de tokens (JWE pour encrypted, JWS pour signed) mais JWT est le plus courant.

**kid (key ID) - optionnel**
Identifiant de la clé utilisée pour signer. Utile quand vous avez plusieurs clés actives (rotation de clés).

## Partie 2 : Le Payload

Le payload est la deuxième partie du JWT. Il contient les données réelles (claims).

**Version encodée :**
```
eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ
```

**Version décodée (base64) :**
```json
{
  "sub": "1234567890",
  "name": "John Doe",
  "iat": 1516239022
}
```

### Les claims standards

Le standard JWT définit plusieurs claims optionnels mais recommandés :

**iss (issuer)**
Qui a émis ce JWT. Généralement l'URL de votre application.
Exemple : `"iss": "https://mon-app.com"`

**sub (subject)**
Le sujet du JWT, généralement l'ID de l'utilisateur.
Exemple : `"sub": "user_123abc"`

**aud (audience)**
Pour qui ce JWT est destiné. Utilisé pour s'assurer qu'un JWT créé pour l'API A n'est pas utilisé pour l'API B.
Exemple : `"aud": "https://api.mon-app.com"`

**exp (expiration)**
Timestamp Unix de l'expiration. Après ce moment, le JWT ne doit plus être accepté.
Exemple : `"exp": 1735689600` (1er janvier 2025)

**nbf (not before)**
Timestamp Unix avant lequel le JWT n'est pas encore valide. Moins utilisé.
Exemple : `"nbf": 1704067200`

**iat (issued at)**
Timestamp Unix de la création du JWT.
Exemple : `"iat": 1704067200`

**jti (JWT ID)**
Identifiant unique du JWT. Utile pour tracking ou révocation.
Exemple : `"jti": "abc-123-def-456"`

### Les claims personnalisés

Vous pouvez ajouter n'importe quelle donnée dans le payload :

```json
{
  "sub": "user_123",
  "email": "john@example.com",
  "role": "admin",
  "permissions": ["read", "write", "delete"],
  "plan": "premium",
  "iat": 1704067200,
  "exp": 1735689600
}
```

**Important :** Le payload n'est PAS chiffré, juste encodé en base64. N'importe qui peut décoder un JWT et lire son contenu. Ne mettez jamais de données sensibles (mots de passe, numéros de carte bancaire).

## Partie 3 : La Signature

La signature est la troisième partie du JWT. C'est elle qui garantit l'intégrité et l'authenticité du token.

**Version encodée :**
```
SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

### Comment la signature est créée

Pour un algorithme HS256 (HMAC-SHA256), la signature se calcule ainsi :

**Étape 1 : Concaténer header et payload encodés**
```
encodedHeader = base64url(header)
encodedPayload = base64url(payload)
message = encodedHeader + "." + encodedPayload
```

**Étape 2 : Calculer le HMAC**
```
signature = HMAC-SHA256(message, secret)
```

**Étape 3 : Encoder la signature**
```
encodedSignature = base64url(signature)
```

**Résultat final :**
```
JWT = encodedHeader + "." + encodedPayload + "." + encodedSignature
```

### Pourquoi c'est sécurisé

La fonction HMAC (Hash-based Message Authentication Code) a une propriété cruciale : sans connaître le secret, il est mathématiquement impossible de générer une signature valide, même si on connaît le header et le payload.

**Tentative de modification :**
Si quelqu'un tente de modifier le payload (changer le rôle de "user" à "admin"), la signature ne correspondra plus. Quand le serveur vérifie le JWT, il recalcule la signature avec le payload modifié et sa clé secrète. Les deux signatures ne matchent pas → JWT rejeté.

**Tentative de création de faux JWT :**
Quelqu'un pourrait créer un header et payload avec les données de son choix, mais sans la clé secrète, impossible de générer une signature valide. Le serveur rejettera le token.

## Base64URL encoding

Vous avez remarqué que les trois parties du JWT utilisent base64url, pas base64 standard.

### La différence

**Base64 standard :**
Utilise les caractères A-Z, a-z, 0-9, +, /
Le caractère = est utilisé pour le padding

**Base64URL :**
Utilise les caractères A-Z, a-z, 0-9, -, _
Pas de padding =

**Pourquoi :**
Les caractères +, /, et = peuvent causer des problèmes dans les URLs (ils ont des significations spéciales). Base64URL utilise des caractères safe pour les URLs.

Exemple :
- Base64 : `abc+def/ghi=`
- Base64URL : `abc-def_ghi`

## Décoder un JWT manuellement

Vous pouvez décoder un JWT dans n'importe quel language ou même en ligne.

### Avec JavaScript

```javascript
const jwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"

const [headerB64, payloadB64, signature] = jwt.split('.')

// Décoder le header
const header = JSON.parse(atob(headerB64.replace(/-/g, '+').replace(/_/g, '/')))
console.log(header)
// { alg: "HS256", typ: "JWT" }

// Décoder le payload
const payload = JSON.parse(atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/')))
console.log(payload)
// { sub: "1234567890", name: "John Doe", iat: 1516239022 }
```

### Avec jwt.io

Le site https://jwt.io permet de décoder, vérifier et déboguer des JWT directement dans le navigateur. Collez votre JWT et il affiche le header et payload décodés.

**Attention :** Ne collez jamais de vrais JWT de production sur des sites tiers. Utilisez jwt.io uniquement pour des JWT de test ou créez les vôtres pour comprendre.

## Le cycle de vie d'un JWT

Comprendre le parcours complet d'un JWT depuis sa création jusqu'à sa vérification.

### Création (à la connexion)

L'utilisateur soumet ses credentials (email + password ou OAuth). Le serveur les vérifie contre la base de données.

Si valides, le serveur crée un JWT :
```javascript
const payload = {
  sub: user.id,
  email: user.email,
  role: user.role,
  iat: Math.floor(Date.now() / 1000),
  exp: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60) // 30 jours
}

const jwt = sign(payload, SECRET)
```

Le JWT est envoyé au client dans un cookie ou dans le corps de la réponse (pour les apps mobiles).

### Stockage (côté client)

**Dans un navigateur :**
Le JWT est généralement stocké dans un cookie httpOnly. Le JavaScript du client ne peut pas y accéder directement (sécurité).

Parfois stocké dans localStorage (moins sécurisé mais nécessaire pour certaines architectures cross-domain).

**Dans une app mobile :**
Stocké dans le secure storage du système (Keychain sur iOS, KeyStore sur Android).

### Transmission (à chaque requête)

**Via cookie :**
Le navigateur envoie automatiquement le cookie avec chaque requête vers le même domaine.

**Via header Authorization :**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Ce format est standard pour les APIs REST.

### Vérification (à chaque requête)

Le serveur reçoit le JWT, le décode, et vérifie :
1. La signature est valide (recalcule et compare)
2. Le JWT n'est pas expiré (exp > maintenant)
3. L'émetteur est correct (iss correspond)
4. L'audience est correcte (aud correspond)

Si toutes les vérifications passent, le serveur lit le payload et traite la requête comme authentifiée.

### Expiration ou révocation

Le JWT expire naturellement quand le timestamp exp est dépassé. Le serveur le rejette automatiquement.

Pour révoquer avant expiration, il faut des mécanismes supplémentaires (blacklist, vérification DB complémentaire).

---

Passez au Module 3 : [03-CRYPTOGRAPHIE-SIGNATURE(COURS).md](./03-CRYPTOGRAPHIE-SIGNATURE(COURS).md)


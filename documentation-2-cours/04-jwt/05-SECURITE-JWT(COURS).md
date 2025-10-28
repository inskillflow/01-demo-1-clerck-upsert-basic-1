# Module 5 : Sécurité des JWT

## Les vulnérabilités courantes

Les JWT, mal utilisés, peuvent introduire des vulnérabilités de sécurité graves. Comprendre ces attaques permet de les éviter.

### Attaque : Algorithm Confusion

Cette attaque exploite la flexibilité des algorithmes supportés par les bibliothèques JWT.

**Le scénario :**
Un attaquant reçoit un JWT signé avec RS256 (signature asymétrique avec clé publique/privée). Il connaît la clé publique (distribuée publiquement pour vérification).

L'attaquant modifie le header du JWT pour changer l'algorithme de RS256 à HS256 :
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

Puis il signe le JWT avec HS256 en utilisant la clé publique comme secret. Si le serveur ne vérifie pas l'algorithme et accepte aveuglément HS256, il utilisera la clé publique (qu'il pense être la clé publique RSA) comme secret HMAC. La vérification passe !

**Protection :**
Toujours vérifier que l'algorithme reçu correspond à celui attendu :

```javascript
const header = decodeHeader(jwt)

if (header.alg !== EXPECTED_ALGORITHM) {
  throw new Error("Algorithme non autorisé")
}
```

Les bibliothèques modernes (jose, jsonwebtoken) protègent automatiquement contre cette attaque si vous spécifiez l'algorithme attendu.

### Attaque : JWT avec alg=none

Certaines implémentations JWT supportent un algorithme "none" qui signifie "pas de signature".

Un attaquant pourrait créer un JWT avec `"alg": "none"` et aucune signature :
```
eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJzdWIiOiJhZG1pbiIsInJvbGUiOiJhZG1pbiJ9.
```

Notez le point à la fin mais pas de signature après.

Si le serveur accepte `alg=none`, il ne vérifie aucune signature et accepte n'importe quel payload.

**Protection :**
Ne jamais accepter `alg=none` en production. Rejetez explicitement :

```javascript
if (header.alg === "none") {
  throw new Error("Algorithme 'none' non autorisé")
}
```

### Attaque : Données sensibles dans le payload

Le payload JWT n'est pas chiffré, juste encodé en base64. N'importe qui peut le décoder.

**Mauvaise pratique :**
```json
{
  "sub": "user_123",
  "creditCard": "4532-1234-5678-9876",
  "ssn": "123-45-6789"
}
```

Toute personne interceptant ce JWT (réseau non-sécurisé, logs serveur, etc.) peut lire ces données.

**Protection :**
Ne jamais mettre de données sensibles dans un JWT. Uniquement des identifiants et métadonnées non-sensibles :

```json
{
  "sub": "user_123",
  "email": "user@example.com",
  "role": "user"
}
```

Si vous avez besoin de données sensibles, cherchez-les en DB après vérification du JWT.

### Attaque : JWT sans expiration

Un JWT sans claim `exp` reste valide indéfiniment. Si le secret ne change jamais, un JWT volé il y a 5 ans fonctionne toujours.

**Protection :**
Toujours inclure un `exp` avec une durée raisonnable :

```javascript
{
  "sub": "user_123",
  "iat": Math.floor(Date.now() / 1000),
  "exp": Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) // 7 jours
}
```

Vérifier l'expiration côté serveur :
```javascript
const payload = verifyJWT(token)

if (payload.exp < Math.floor(Date.now() / 1000)) {
  throw new Error("JWT expiré")
}
```

### Attaque : Vol de JWT

Si un attaquant vole un JWT valide (interception réseau, XSS, accès au localStorage), il peut l'utiliser pour se faire passer pour l'utilisateur.

**Protection :**

**HTTPS obligatoire :** Toujours utiliser HTTPS pour éviter l'interception réseau.

**Cookies httpOnly :** Stocker le JWT dans un cookie httpOnly plutôt que localStorage pour protection contre XSS.

**Durée courte :** Utiliser des JWT de courte durée (15 minutes) avec refresh tokens.

**IP binding (optionnel) :** Inclure l'IP dans le JWT et vérifier qu'elle n'a pas changé. Problématique avec les réseaux mobiles.

## Bonnes pratiques de sécurité

Récapitulons les règles à suivre pour une utilisation sécurisée des JWT.

### Règle 1 : Secret fort et unique

Générez un secret aléatoire long (minimum 256 bits / 32 bytes) :
```bash
openssl rand -base64 32
```

Utilisez un secret différent pour chaque environnement (dev, staging, production). Ne jamais réutiliser ou partager les secrets.

### Règle 2 : Algorithme vérifié

Spécifiez explicitement l'algorithme attendu :
```javascript
const payload = jwt.verify(token, SECRET, { algorithms: ['HS256'] })
```

N'acceptez jamais `alg=none` ou des algorithmes non configurés.

### Règle 3 : Expiration obligatoire

Toujours inclure `exp` avec une durée raisonnable selon votre cas d'usage :
- Sessions interactives : 15 minutes à 1 heure (avec refresh token)
- API tokens : 1 heure à 24 heures
- Remember me : 7 à 30 jours (mais vérifier périodiquement en DB)

### Règle 4 : Pas de données sensibles

Ne jamais inclure :
- Mots de passe (même hashés)
- Numéros de carte bancaire
- Données personnelles sensibles (SSN, numéro de sécurité sociale)
- Secrets API

Incluez uniquement :
- IDs non-sensibles
- Email (considéré non-sensible dans la plupart des cas)
- Rôles et permissions
- Métadonnées publiques

### Règle 5 : HTTPS obligatoire

Les JWT doivent être transmis uniquement en HTTPS. En HTTP, ils peuvent être interceptés par man-in-the-middle.

### Règle 6 : Cookies httpOnly

Si possible, stockez les JWT dans des cookies httpOnly plutôt que dans localStorage :

```javascript
res.setHeader('Set-Cookie', [
  `token=${jwt}; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAge}`
])
```

**httpOnly :** JavaScript ne peut pas lire le cookie (protection XSS)
**Secure :** Cookie envoyé uniquement en HTTPS
**SameSite :** Protection CSRF

### Règle 7 : Validation complète

Vérifiez tous les claims pertinents :

```javascript
const payload = verifyJWT(token, SECRET)

// Vérifier expiration
if (payload.exp < now) throw new Error("Expiré")

// Vérifier émetteur
if (payload.iss !== EXPECTED_ISSUER) throw new Error("Émetteur invalide")

// Vérifier audience
if (payload.aud !== EXPECTED_AUDIENCE) throw new Error("Audience invalide")

// Vérifier not before
if (payload.nbf && payload.nbf > now) throw new Error("Pas encore valide")
```

### Règle 8 : Rotation des secrets

Changez périodiquement votre secret de signature (tous les 3-6 mois en production). Gérez une période de transition où les deux secrets (ancien et nouveau) sont acceptés.

```javascript
function verifyJWT(token) {
  try {
    return jwt.verify(token, NEW_SECRET)
  } catch (error) {
    // Si échec avec nouveau secret, essayer l'ancien
    return jwt.verify(token, OLD_SECRET)
  }
}
```

Après la période de transition (durée du maxAge de vos JWT), supprimez l'ancien secret.

## Cas d'usage spécifiques

Les JWT brillent dans certains scénarios particuliers.

### API REST stateless

Une API consommée par plusieurs clients (web, mobile, IoT) bénéficie grandement des JWT.

Le client s'authentifie une fois, reçoit un JWT, puis l'envoie dans toutes les requêtes suivantes :
```
Authorization: Bearer eyJhbGci...
```

Chaque endpoint de l'API vérifie le JWT de manière indépendante. Pas de session store, pas de sticky routing, scalabilité parfaite.

### Architecture microservices

Vous avez un service d'authentification et plusieurs services métier. L'auth service crée les JWT. Les autres services vérifient juste la signature.

Avec RS256, seul l'auth service a la clé privée. Les autres ont la clé publique et peuvent vérifier sans pouvoir créer de faux JWT.

### Single Sign-On (SSO)

Les JWT facilitent le SSO entre plusieurs applications. L'utilisateur se connecte une fois, reçoit un JWT, et peut l'utiliser sur plusieurs sous-domaines ou applications liées.

### Applications serverless

AWS Lambda, Vercel Functions, Cloudflare Workers bénéficient des JWT car chaque invocation est isolée. Pas de mémoire partagée pour stocker des sessions.

---

Passez au Module 6 : [06-IMPLEMENTATION-NEXTJS(COURS).md](./06-IMPLEMENTATION-NEXTJS(COURS).md)


# Quiz : Réponses et Explications

## Section 1 : Concepts Fondamentaux

### Question 1
**Réponse : B** - JSON Web Token

**Explication :** JWT signifie JSON Web Token. C'est un standard ouvert (RFC 7519) pour créer des tokens d'accès basés sur JSON.

### Question 2
**Réponse : C** - Trois parties séparées par des points

**Explication :** Un JWT a trois parties : header.payload.signature. Chacune est encodée en base64url et séparée par un point.

### Question 3
**Réponse : B** - Stateless, pas besoin de stocker les sessions côté serveur

**Explication :** Les JWT sont auto-contenus et vérifiables sans état serveur. Pas besoin de session store, ce qui simplifie la scalabilité.

### Question 4
**Réponse : B** - Impossible de révoquer immédiatement un JWT valide

**Explication :** Un JWT signé reste valide jusqu'à son expiration. Pour révoquer, il faut maintenir une blacklist (qui réintroduit de l'état) ou vérifier en DB.

### Question 5
**Réponse : B** - Non, juste encodées en base64 (lisibles par tous)

**Explication :** Le payload JWT est encodé, pas chiffré. N'importe qui peut décoder un JWT et lire son contenu. Ne jamais y mettre de données sensibles.

---

## Section 2 : Structure du JWT

### Question 6
**Réponse : B** - L'algorithme de signature et le type de token

**Explication :** Le header contient typiquement `{"alg": "HS256", "typ": "JWT"}` indiquant l'algorithme de signature et que c'est un JWT.

### Question 7
**Réponse : C** - sub (subject)

**Explication :** Le claim `sub` (subject) identifie le sujet du JWT, généralement l'ID de l'utilisateur. C'est un claim standard du RFC 7519.

### Question 8
**Réponse : B** - Timestamp d'expiration du token

**Explication :** Le claim `exp` (expiration time) est un timestamp Unix après lequel le JWT ne doit plus être accepté.

### Question 9
**Réponse : C** - Base64URL

**Explication :** Base64URL est utilisé (pas base64 standard) car il utilise des caractères safe pour les URLs (-, _ au lieu de +, /).

### Question 10
**Réponse : B** - Oui, on peut ajouter n'importe quelles données

**Explication :** En plus des claims standards (sub, exp, iat), vous pouvez ajouter autant de claims personnalisés que nécessaire (role, permissions, etc.).

---

## Section 3 : Cryptographie

### Question 11
**Réponse : B** - HMAC avec SHA-256

**Explication :** HS256 signifie HMAC (Hash-based Message Authentication Code) utilisant SHA-256 comme fonction de hachage.

### Question 12
**Réponse : B** - HS256 utilise une clé symétrique, RS256 utilise une paire de clés asymétriques

**Explication :** HS256 utilise un secret partagé (symétrique). RS256 utilise une clé privée pour signer et une clé publique pour vérifier (asymétrique).

### Question 13
**Réponse : B** - Garantir que le JWT n'a pas été modifié

**Explication :** La signature permet de vérifier l'intégrité et l'authenticité. Si le payload est modifié, la signature ne correspondra plus.

### Question 14
**Réponse : B** - Non, c'est mathématiquement impossible

**Explication :** Sans la clé secrète, impossible de générer un HMAC valide. C'est la propriété cryptographique qui assure la sécurité des JWT.

### Question 15
**Réponse : B** - Vérifie la signature et l'expiration du JWT

**Explication :** `jwt.verify()` vérifie que la signature est valide avec le secret fourni, et que le JWT n'est pas expiré. Lance une exception si invalide.

---

## Section 4 : Sécurité

### Question 16
**Réponse : C** - Cookie httpOnly

**Explication :** Un cookie httpOnly ne peut pas être lu par JavaScript, protégeant contre les attaques XSS. localStorage est accessible par JS et donc plus vulnérable.

### Question 17
**Réponse : C** - Création de JWT sans signature valide

**Explication :** Si un serveur accepte `alg=none`, un attaquant peut créer un JWT sans signature et le serveur l'acceptera sans vérification.

### Question 18
**Réponse : B** - Le payload n'est pas chiffré, juste encodé (lisible par tous)

**Explication :** Le payload est encodé en base64url, pas chiffré. N'importe qui interceptant le JWT peut décoder et lire le contenu. Jamais de données sensibles dedans.

### Question 19
**Réponse : B** - 15 minutes à 1 heure

**Explication :** Pour un access token, une courte durée limite l'impact d'un vol. Utilisez un refresh token de plus longue durée pour renouveler.

### Question 20
**Réponse : C** - Maintenir une blacklist de JWT révoqués ou vérifier en DB

**Explication :** Pour révoquer avant expiration, il faut soit maintenir une blacklist de JWT interdits, soit vérifier en DB que l'utilisateur/session existe toujours. Les deux réintroduisent de l'état.

---

## Section 5 : Implémentation

### Question 21
**Réponse : B** - jsonwebtoken ou jose

**Explication :** `jsonwebtoken` est la bibliothèque la plus utilisée. `jose` est plus moderne et supporte tous les algorithmes. Les deux sont excellentes.

### Question 22
**Réponse : B** - `openssl rand -base64 32`

**Explication :** Cette commande génère 32 bytes aléatoires encodés en base64, créant un secret cryptographiquement sécurisé.

### Question 23
**Réponse : C** - 7 à 30 jours

**Explication :** Le refresh token a une durée longue car il est stocké en DB et révocable. L'access token est court (15min) pour la sécurité.

### Question 24
**Réponse : B** - En base de données côté serveur

**Explication :** Le refresh token est stocké en DB pour permettre la révocation. L'access token JWT est donné au client.

### Question 25
**Réponse : B** - `Authorization: Bearer token`

**Explication :** Le format standard est `Authorization: Bearer <token>`. C'est utilisé par la majorité des APIs modernes.

---

## Barème

**Total : 50 points (25 questions × 2 points)**

- 45-50 : Excellente maîtrise des JWT
- 38-44 : Bonne compréhension
- 30-37 : Compréhension satisfaisante
- 25-29 : Compréhension partielle
- <25 : Révision nécessaire


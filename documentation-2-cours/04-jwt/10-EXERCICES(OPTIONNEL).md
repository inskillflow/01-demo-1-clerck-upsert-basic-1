# Exercices Pratiques : JWT

## Instructions

- 4 exercices à réaliser
- Durée estimée : 4-5 heures
- Rédigez vos réponses dans un document séparé
- Consultez 10-EXERCICES-SOLUTIONS(OPTIONNEL).md après avoir terminé

---

## Exercice 1 : Créer et vérifier des JWT manuellement (60 minutes)

Implémentez un système complet de création et vérification de JWT sans utiliser de bibliothèque externe (sauf crypto natif).

**Spécifications :**

1. Fonction `createJWT(payload, secret)` qui :
   - Crée le header avec HS256
   - Encode header et payload en base64url
   - Calcule la signature HMAC-SHA256
   - Retourne le JWT complet

2. Fonction `verifyJWT(jwt, secret)` qui :
   - Parse les trois parties
   - Vérifie que l'algorithme est HS256
   - Recalcule la signature
   - Compare les signatures
   - Vérifie l'expiration
   - Retourne le payload si valide

3. Fonction `decodeJWT(jwt)` qui :
   - Décode le header et payload
   - N'effectue AUCUNE vérification
   - Retourne les données pour inspection

**Fournissez :**
- Le code complet des trois fonctions
- Tests unitaires avec Jest ou similaire
- Gestion des erreurs appropriée
- Documentation des fonctions

**Critères d'évaluation :**
- Implémentation correcte de la signature (10 points)
- Vérification robuste (8 points)
- Gestion d'erreurs (4 points)
- Tests (3 points)

---

## Exercice 2 : Système d'authentification complet (120 minutes)

Créez un système d'authentification Next.js complet utilisant JWT (sans NextAuth ni Clerk).

**Spécifications :**

1. **API Login** (`/api/auth/login`) :
   - Accepte email + password
   - Vérifie dans Prisma
   - Crée un JWT avec sub, role, exp
   - Retourne le JWT dans un cookie httpOnly

2. **API Signup** (`/api/auth/signup`) :
   - Accepte name, email, password
   - Hash le password avec bcrypt
   - Crée l'utilisateur dans Prisma
   - Retourne succès

3. **API Logout** (`/api/auth/logout`) :
   - Supprime le cookie JWT
   - Retourne succès

4. **Middleware** :
   - Vérifie le JWT sur les routes protégées
   - Ajoute userId dans les headers
   - Redirige vers /signin si non authentifié

5. **Pages** :
   - Page signin avec formulaire
   - Page signup avec formulaire
   - Page protégée affichant les infos user

**Fournissez :**
- Code complet de toutes les API routes
- Code du middleware
- Pages signin et signup
- Schéma Prisma
- Fonction helper pour vérifier JWT

**Critères d'évaluation :**
- Fonctionnalité complète (15 points)
- Sécurité appropriée (10 points)
- Code propre et typé (5 points)

---

## Exercice 3 : Access + Refresh Tokens (90 minutes)

Implémentez le pattern access token + refresh token pour combiner performance et révocation.

**Spécifications :**

1. **Schéma Prisma** :
   - Table RefreshToken avec token, userId, expiresAt
   - Relation avec User

2. **API Login** :
   - Crée access token JWT (15 minutes)
   - Crée refresh token aléatoire (7 jours) stocké en DB
   - Retourne les deux dans des cookies séparés

3. **API Refresh** (`/api/auth/refresh`) :
   - Reçoit le refresh token
   - Vérifie en DB qu'il existe et n'est pas expiré
   - Crée un nouvel access token
   - Retourne le nouvel access token

4. **API Revoke** (`/api/auth/revoke`) :
   - Supprime tous les refresh tokens de l'utilisateur
   - Force reconnexion partout

5. **Middleware** :
   - Vérifie l'access token
   - Si expiré, tente de refresh automatiquement
   - Redirige si refresh impossible

**Fournissez :**
- Schéma Prisma complet
- Code des 4 API routes
- Middleware intelligent avec auto-refresh
- Flux complet documenté

**Critères d'évaluation :**
- Implémentation correcte du pattern (12 points)
- Révocation fonctionnelle (6 points)
- Auto-refresh dans middleware (6 points)
- Gestion d'erreurs (6 points)

---

## Exercice 4 : Analyse de sécurité (60 minutes)

Analysez ce code JWT vulnérable et identifiez toutes les failles de sécurité.

**Code à analyser :**

```typescript
// MAUVAIS CODE - NE PAS UTILISER
export async function POST(request: Request) {
  const { email, password } = await request.json()
  
  const user = await prisma.user.findUnique({
    where: { email }
  })
  
  if (user && user.password === password) {
    const token = jwt.sign({
      userId: user.id,
      email: user.email,
      password: user.password,
      creditCard: user.creditCard,
      role: user.role
    }, "my-secret-key-123")
    
    return NextResponse.json({ token })
  }
  
  return NextResponse.json({ error: "Invalid" })
}

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  const token = authHeader?.split(' ')[1]
  
  const decoded = jwt.decode(token)
  
  if (decoded) {
    return NextResponse.json({ user: decoded })
  }
  
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
}
```

**Tâches :**

1. Listez au moins 10 problèmes de sécurité dans ce code
2. Pour chaque problème, expliquez l'attaque qu'il permet
3. Proposez la correction appropriée
4. Réécrivez le code de manière sécurisée

**Problèmes à identifier :**
- Comparaison de password en clair
- Données sensibles dans le JWT
- Secret faible et hardcodé
- Pas d'expiration
- Pas d'algorithme spécifié
- decode() au lieu de verify()
- Token retourné en JSON (pas en cookie httpOnly)
- Et autres...

**Critères d'évaluation :**
- Nombre de problèmes identifiés (8 points)
- Qualité des explications (8 points)
- Code corrigé fonctionnel et sécurisé (9 points)

---

## Questions Ouvertes

### Question 1 : JWT vs Sessions - Choix architectural (30 minutes)

Vous concevez trois applications différentes. Pour chacune, justifiez le choix entre JWT pur, sessions pures, ou approche hybride.

**Application 1 : API mobile de réseau social**
- 500k utilisateurs actifs
- Requêtes fréquentes (feed, messages)
- Besoin de performance maximale
- Déploiement serverless (Vercel)

**Application 2 : Application bancaire web**
- 10k utilisateurs
- Opérations financières sensibles
- Révocation immédiate critique
- Audit complet nécessaire
- Serveurs dédiés

**Application 3 : SaaS B2B avec organisations**
- 5k entreprises, 50k users total
- Gestion de permissions complexes
- Changements de rôles fréquents
- Mix de web et mobile

**Pour chaque application, analysez :**
- Contraintes techniques
- Besoins de sécurité
- Performance requise
- Votre recommandation (JWT/Sessions/Hybride)
- Justification détaillée

**Critères d'évaluation :**
- Analyse contextuelle appropriée (6 points)
- Recommandations justifiées (6 points)
- Compréhension des trade-offs (3 points)

---

### Question 2 : Attaques et contre-mesures (25 minutes)

Décrivez en détail 5 attaques différentes contre les JWT et leurs contre-mesures.

**Pour chaque attaque :**
- Nom et description de l'attaque
- Comment elle est exécutée (scénario concret)
- Ce qu'un attaquant peut accomplir
- La contre-mesure technique précise
- Code de protection

**Exemples d'attaques à couvrir :**
- Algorithm confusion
- None algorithm
- Weak secret
- JWT sans expiration
- Vol de JWT (XSS)
- Données sensibles exposées
- Timing attacks
- Token replay

**Critères d'évaluation :**
- Compréhension des attaques (5 points)
- Contre-mesures appropriées (4 points)
- Code de protection correct (4 points)

---

## Soumission

Rédigez vos réponses dans un document structuré et consultez 10-EXERCICES-SOLUTIONS(OPTIONNEL).md pour comparer avec les solutions proposées.


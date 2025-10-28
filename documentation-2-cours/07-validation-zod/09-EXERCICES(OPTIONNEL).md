# Exercices Pratiques : Validation avec Zod

## Instructions

- 4 exercices à réaliser
- Durée estimée : 4-5 heures
- Rédigez vos réponses dans un document séparé
- Consultez 10-EXERCICES-SOLUTIONS(OPTIONNEL).md après avoir terminé

---

## Exercice 1 : Bibliothèque de schémas réutilisables (60 minutes)

Créez une bibliothèque complète de schémas Zod réutilisables pour une application.

**Créez des schémas pour :**

1. **Email** : Validation email + normalisation (toLowerCase, trim)
2. **Password** : Min 8 caractères, 1 majuscule, 1 chiffre, 1 spécial
3. **Username** : 3-20 caractères, alphanumerique + underscore
4. **Phone** : Format français 0X XX XX XX XX
5. **URL** : URL valide, optionnelle
6. **Bio** : String max 500 caractères, optionnelle
7. **Age** : Number 18-120
8. **Role** : Enum (user, admin, moderator)

**Puis créez des schémas composés :**

9. **SignupSchema** : email, password, confirmPassword (avec vérification correspondance)
10. **LoginSchema** : email, password
11. **ProfileUpdateSchema** : username, bio, website, phone (tous optionnels)
12. **UserCreateSchema** : Complet pour API

**Fournissez :**
- Fichier lib/schemas.ts avec tous les schémas
- Exports typés avec z.infer
- Messages d'erreur en français
- Tests unitaires pour chaque schéma

**Critères d'évaluation :**
- Schémas corrects et complets (10 points)
- Réutilisabilité et composition (5 points)
- Messages d'erreur clairs (3 points)
- Tests (2 points)

---

## Exercice 2 : Formulaire complet avec validation (90 minutes)

Créez un formulaire d'inscription complet avec validation côté client et serveur.

**Spécifications :**

1. **Page signup** (Client Component) :
   - React Hook Form + Zod Resolver
   - Champs : username, email, password, confirmPassword
   - Validation temps réel (onChange)
   - Affichage des erreurs sous chaque champ
   - Loading state pendant soumission
   - Messages de succès/erreur

2. **API route** (/api/auth/signup) :
   - Validation Zod identique
   - Vérification email unique
   - Hachage password avec bcrypt
   - Création utilisateur Prisma
   - Gestion d'erreurs complète

3. **Tests** :
   - Cas valides
   - Cas invalides (password faible, email mal formé, etc.)
   - Edge cases

**Fournissez :**
- Code complet du formulaire
- Code complet de l'API route
- Schéma Zod partagé entre client et serveur
- Tests avec exemples de données valides/invalides

**Critères d'évaluation :**
- Formulaire fonctionnel avec RHF (8 points)
- Validation serveur robuste (8 points)
- Schéma partagé (réutilisabilité) (4 points)
- UX (affichage erreurs, loading) (5 points)

---

## Exercice 3 : API CRUD avec validation complète (90 minutes)

Créez une API CRUD complète pour une ressource "Product" avec validation Zod.

**Schéma Product :**
```typescript
{
  name: string (3-100 caractères)
  description: string (10-1000 caractères)
  price: number (0.01-999999, max 2 décimales)
  category: enum ['electronics', 'clothing', 'food', 'other']
  tags: array de strings
  stock: number entier (0-10000)
  published: boolean
}
```

**Implémentez :**

1. **POST /api/products** : Créer un produit
   - Validation complète du schéma
   - Slug généré depuis le nom
   - Vérification unicité du slug

2. **GET /api/products** : Liste avec pagination et filtres
   - Query params : page, limit, category, search
   - Validation des query params avec Zod

3. **PUT /api/products/[id]** : Mettre à jour
   - Schéma partial (tous champs optionnels)
   - Validation de l'ID
   - Vérification que le produit existe

4. **DELETE /api/products/[id]** : Supprimer
   - Validation de l'ID
   - Soft delete ou hard delete

**Fournissez :**
- Tous les fichiers API routes
- Schémas Zod pour chaque endpoint
- Validation des query params
- Middleware de validation réutilisable
- Tests de tous les endpoints

**Critères d'évaluation :**
- CRUD complet fonctionnel (12 points)
- Validation appropriée partout (8 points)
- Code réutilisable et DRY (5 points)

---

## Exercice 4 : Validation environnement et configuration (45 minutes)

Créez un système complet de validation des variables d'environnement et de la configuration.

**Implémentez :**

1. **Schéma environnement** :
   - Validez toutes les variables nécessaires
   - Types appropriés (string, url, number, enum)
   - Valeurs par défaut quand pertinent
   - Messages d'erreur clairs

2. **Validation au démarrage** :
   - Parse process.env au démarrage de l'app
   - Crash avec message clair si configuration invalide
   - Export typé des variables

3. **Schéma configuration app** :
   - Features flags (boolean)
   - Limites (maxUploadSize, maxUsersPerOrg)
   - URLs externes
   - API keys

4. **Environnements multiples** :
   - Schéma pour dev, staging, production
   - Variables optionnelles en dev, obligatoires en prod

**Fournissez :**
- lib/env.ts avec validation complète
- lib/config.ts avec configuration app
- Types TypeScript inférés
- Documentation des variables requises

**Critères d'évaluation :**
- Schéma environnement complet (6 points)
- Validation au démarrage (4 points)
- Types inférés corrects (3 points)
- Documentation (2 points)

---

## Questions Ouvertes

### Question 1 : Stratégie de validation complète (25 minutes)

Concevez une stratégie de validation complète pour une application Next.js professionnelle.

**Couvrez :**
- Où placer les schémas Zod (organisation des fichiers)
- Comment partager les schémas entre client et serveur
- Validation des formulaires (client + serveur)
- Validation des API routes
- Validation des webhooks
- Validation des variables d'environnement
- Gestion et affichage des erreurs
- Tests de validation

**Pour chaque aspect, fournissez :**
- Structure de fichiers
- Exemple de code
- Justification

**Critères d'évaluation :**
- Stratégie complète et cohérente (6 points)
- Exemples de code fonctionnels (4 points)
- Justifications techniques (5 points)

---

### Question 2 : Sécurité et validation (20 minutes)

Listez et expliquez 5 vulnérabilités de sécurité que Zod aide à prévenir.

**Pour chacune :**
- Nom de la vulnérabilité
- Comment l'attaque fonctionne (exemple concret)
- Comment Zod protège (schéma et code)
- Ce qui pourrait se passer sans protection

**Exemples à couvrir :**
- Injection SQL
- XSS (Cross-Site Scripting)
- DoS via données volumineuses
- Type confusion
- Buffer overflow
- Path traversal

**Critères d'évaluation :**
- Compréhension des vulnérabilités (4 points)
- Protection Zod appropriée (3 points)
- Exemples de code (3 points)

---

## Soumission

Rédigez vos réponses dans un document structuré et consultez 10-EXERCICES-SOLUTIONS(OPTIONNEL).md pour comparer avec les solutions proposées.


# Exercices Pratiques : NextAuth

## Instructions

- 5 exercices à réaliser
- Durée estimée : 4-5 heures
- Rédigez vos réponses dans un document séparé
- Consultez 10-EXERCICES-SOLUTIONS(OPTIONNEL).md après avoir terminé

---

## Exercice 1 : Configuration complète NextAuth (90 minutes)

Implémentez une configuration NextAuth complète avec :

1. **Providers** : Google OAuth, GitHub OAuth, Credentials (email + password)
2. **Stratégie** : JWT avec maxAge de 30 jours
3. **Callbacks** : jwt() et session() pour inclure le rôle utilisateur
4. **Pages** : Personnalisées pour signin, signup, error
5. **Adapter** : Prisma pour synchronisation automatique

**Fournissez :**
- Le fichier complet `lib/auth.ts` avec authOptions
- Le fichier `app/api/auth/[...nextauth]/route.ts`
- Le schéma Prisma avec les 4 tables obligatoires + champs personnalisés
- Les variables d'environnement nécessaires dans `.env.local`

**Critères d'évaluation :**
- Configuration correcte de tous les providers (8 points)
- Callbacks appropriés (5 points)
- Schéma Prisma complet (5 points)
- Documentation des variables d'env (2 points)

---

## Exercice 2 : Pages d'authentification (60 minutes)

Créez des pages d'authentification professionnelles avec Tailwind CSS.

**Spécifications :**

1. **Page SignIn** (`/signin`) :
   - Boutons OAuth pour Google et GitHub
   - Formulaire email + password
   - Gestion d'erreurs avec messages appropriés
   - Loading states
   - Lien vers signup

2. **Page SignUp** (`/signup`) :
   - Formulaire complet (name, email, password)
   - Validation côté client (email valide, password ≥ 8 caractères)
   - Appel à l'API `/api/auth/signup`
   - Gestion d'erreurs
   - Redirection vers signin après succès

3. **API Route Signup** (`/api/auth/signup`) :
   - Validation avec Zod
   - Vérification que l'email n'existe pas déjà
   - Hachage du password avec bcrypt
   - Création de l'utilisateur dans Prisma
   - Gestion d'erreurs robuste

**Fournissez le code complet de :**
- `app/(auth)/signin/page.tsx`
- `app/(auth)/signup/page.tsx`
- `app/api/auth/signup/route.ts`
- Le schéma Zod de validation

**Critères d'évaluation :**
- UI professionnelle et responsive (6 points)
- Validation correcte (5 points)
- Gestion d'erreurs appropriée (5 points)
- Code propre et typé (4 points)

---

## Exercice 3 : Système de rôles et permissions (90 minutes)

Implémentez un système complet de gestion de rôles (user, moderator, admin).

**Spécifications :**

1. **Schéma** : Ajouter un champ `role` au User avec enum
2. **JWT** : Inclure le rôle dans le token via callback
3. **Middleware** : Protéger les routes `/admin/*` pour admins uniquement
4. **Helper** : Fonction `requireRole(role)` pour Server Components
5. **Hook** : `useRequireRole(role)` pour Client Components
6. **API** : Endpoint `/api/admin/users/[id]/role` pour changer les rôles (admin only)
7. **UI** : Afficher conditionnellement des éléments selon le rôle

**Fournissez :**
- Le schéma Prisma modifié
- Les callbacks jwt() et session() avec le rôle
- Les fonctions helper de vérification
- Le middleware de protection
- L'API route de changement de rôle
- Un exemple de composant avec UI conditionnelle

**Critères d'évaluation :**
- Système de rôles complet (10 points)
- Protection correcte des routes (5 points)
- API sécurisée (admin only) (5 points)
- Code réutilisable et maintenable (5 points)

---

## Exercice 4 : Migration Clerk → NextAuth (120 minutes)

Vous avez une application en production utilisant Clerk. Planifiez la migration complète vers NextAuth.

**Analysez et décrivez :**

### Phase 1 : Analyse de l'existant (20 points)
- Inventaire de ce qui utilise Clerk dans le code
- Schéma Prisma actuel vs schéma NextAuth requis
- Différences de fonctionnalités (ce qui existe dans Clerk mais pas NextAuth)
- Données utilisateur à migrer
- Stratégies de session comparées

### Phase 2 : Plan de migration (20 points)
- Installation et configuration NextAuth en parallèle
- Migration du schéma Prisma (ajout des tables Account, Session, etc.)
- Script de migration des utilisateurs existants
- Création des pages personnalisées
- Tests sans affecter les utilisateurs actuels

### Phase 3 : Basculement (15 points)
- Stratégie de feature flag ou basculement progressif
- Gestion de la période de transition
- Communication aux utilisateurs (reset password nécessaire ?)
- Monitoring des deux systèmes en parallèle
- Critères de succès pour finaliser

### Phase 4 : Nettoyage (10 points)
- Suppression du code Clerk
- Nettoyage des dépendances
- Migration des variables d'environnement
- Documentation mise à jour
- Plan de rollback d'urgence

**Critères d'évaluation :**
- Analyse complète (20 points)
- Stratégie réaliste (20 points)
- Gestion des risques (15 points)
- Détails et clarté (10 points)

---

## Exercice 5 : Comparaison architecture complète (60 minutes)

Créez un tableau comparatif détaillé entre une implémentation Clerk et une implémentation NextAuth.

**Comparez point par point :**

1. **Setup initial** : Temps, complexité, étapes
2. **Schéma Prisma** : Tables nécessaires, champs obligatoires
3. **Code d'authentification** : Lignes de code, fichiers à créer
4. **UI** : Fournie vs à créer, temps de développement
5. **Coût** : Initial, mensuel, à 10k users, à 100k users
6. **Maintenance** : Mises à jour, sécurité, responsabilités
7. **Fonctionnalités** : OAuth, 2FA, magic links, webhooks
8. **Performance** : Vitesse, scalabilité, requêtes DB
9. **Flexibilité** : Personnalisation, control, limitations
10. **Migration** : Facilité de changer de solution plus tard

**Pour chaque point, donnez :**
- Description pour Clerk
- Description pour NextAuth
- Votre avis sur lequel est meilleur dans quel contexte

**Synthèse finale :**
Recommandation selon différents profils de projet :
- Startup MVP (budget limité, temps court)
- Application établie (milliers d'utilisateurs, rentable)
- Projet open-source communautaire
- Application d'entreprise (sécurité maximale)

**Critères d'évaluation :**
- Exhaustivité de la comparaison (10 points)
- Objectivité et nuances (5 points)
- Recommandations pragmatiques (5 points)

---

## Questions Ouvertes

### Question 1 : Choix technologique argumenté (30 minutes)

Vous devez recommander une solution d'authentification pour ces 3 cas différents. Justifiez votre choix entre Clerk et NextAuth pour chacun :

**Cas 1 : Startup en pré-seed**
- 2 fondateurs développeurs
- Budget : 50k€ seed pour 12 mois
- Objectif : Valider le product-market fit en 3 mois
- Users attendus : 100-500 dans les 6 premiers mois

**Cas 2 : Scale-up Series A**
- Équipe de 10 développeurs
- Budget : 2M€ levés
- Objectif : Passer de 5k à 50k users
- Revenus : 50k€/mois actuels

**Cas 3 : Projet open-source communautaire**
- Contributeurs bénévoles
- Budget : 0€
- Objectif : Maximiser l'adoption
- Users : potentiellement illimités

**Pour chaque cas, analysez :**
- Contraintes budgétaires
- Contraintes de temps
- Expertise disponible
- Objectifs business
- Votre recommandation finale

**Critères d'évaluation :**
- Analyse contextuelle (4 points)
- Argumentation technique (3 points)
- Pragmatisme des recommandations (3 points)

---

### Question 2 : Sécurité NextAuth (20 minutes)

NextAuth nécessite plus de responsabilités en matière de sécurité que Clerk.

**Listez et expliquez 7 bonnes pratiques de sécurité à implémenter avec NextAuth :**

Pour chacune :
- La pratique spécifique
- Pourquoi elle est importante
- Comment l'implémenter dans le code
- Ce qui pourrait se passer sans elle

**Exemples de domaines à couvrir :**
- Hachage de mots de passe
- Génération et rotation de secrets
- Configuration des cookies
- Validation des données
- Protection CSRF
- Rate limiting
- Logging et monitoring

**Critères d'évaluation :**
- Nombre et pertinence des pratiques (4 points)
- Qualité des explications (3 points)
- Implémentation concrète (3 points)

---

## Soumission

Rédigez vos réponses dans un document structuré et consultez 10-EXERCICES-SOLUTIONS(OPTIONNEL).md pour comparer avec les solutions proposées.


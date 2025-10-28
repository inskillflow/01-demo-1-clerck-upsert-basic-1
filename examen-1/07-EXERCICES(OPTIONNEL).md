# Exercices Pratiques

## Instructions

- 5 exercices à réaliser
- Durée estimée : 2-3 heures
- Rédigez vos réponses dans un document séparé
- Consultez 08-EXERCICES-SOLUTIONS(OPTIONNEL).md après avoir terminé

---

## Exercice 1 : Analyse de flux (30 minutes)

Décrivez en détail, étape par étape, ce qui se passe quand un nouvel utilisateur :
1. Clique sur "Créer un compte"
2. Remplit le formulaire Clerk
3. Est redirigé vers l'application

**Incluez dans votre réponse :**
- Les appels à Clerk (quelles fonctions, quand)
- La synchronisation avec Prisma (quelle fonction, quel moment)
- Les redirections (quelles routes, dans quel ordre)
- Ce qui est stocké où (Clerk vs Base de données)
- Le rôle du middleware
- Le contenu du JWT

**Critères d'évaluation :**
- Précision technique (10 points)
- Ordre chronologique correct (5 points)
- Mention de tous les composants clés (5 points)

---

## Exercice 2 : Ajout d'un champ (45 minutes)

Vous devez ajouter un champ `phoneNumber` (optionnel) au profil utilisateur.

**Décrivez toutes les étapes nécessaires :**

1. Modification du schéma Prisma
2. Commandes Prisma à exécuter
3. Modification de la fonction `syncUser()` (nécessaire ou pas ?)
4. Modification du formulaire de profil
5. Modification de l'API route de sauvegarde
6. Affichage dans l'interface utilisateur

**Pour chaque étape, fournissez :**
- Le code exact à ajouter/modifier
- La commande à exécuter (si applicable)
- Une justification de pourquoi c'est nécessaire

**Critères d'évaluation :**
- Code correct et complet (10 points)
- Explication de la logique (5 points)
- Gestion des cas limites (5 points)

---

## Exercice 3 : Gestion d'erreur (45 minutes)

La fonction `syncUser()` peut échouer pour plusieurs raisons :
- Base de données indisponible
- Réseau lent
- Timeout Clerk
- Données manquantes

**Proposez une amélioration du code pour :**

1. Détecter les différents types d'erreurs
2. Afficher un message approprié à l'utilisateur selon le type d'erreur
3. Logger l'erreur avec suffisamment de contexte pour le debugging
4. Permettre une nouvelle tentative automatique (retry avec backoff)
5. Gérer le cas où l'utilisateur existe dans Clerk mais pas dans la DB

**Fournissez :**
- Le code amélioré de `syncUser()`
- Un composant React pour afficher les erreurs
- La logique de retry avec backoff exponentiel
- Les types d'erreurs personnalisés

**Critères d'évaluation :**
- Robustesse de la gestion d'erreurs (8 points)
- Expérience utilisateur (4 points)
- Code maintenable (4 points)
- Logging approprié (4 points)

---

## Exercice 4 : Optimisation et pagination (60 minutes)

L'application a maintenant 10,000 utilisateurs actifs. La page `/members` affiche tous les utilisateurs et devient très lente.

**Implémentez une solution complète :**

1. **Backend (API Route)** : Créer `/api/users` avec pagination
   - Paramètres : page, limit, search (optionnel)
   - Retour : { users, total, page, totalPages }
   - Gestion des filtres (recherche par nom/email)

2. **Utilisation de Prisma** : Requêtes optimisées
   - Utiliser `skip` et `take` pour la pagination
   - Utiliser `where` pour la recherche
   - Compter le total avec `count()`

3. **Frontend** : Composant avec pagination
   - Afficher les utilisateurs paginés
   - Boutons Précédent / Suivant
   - Input de recherche avec debounce
   - Loading states

4. **Bonus** : Implémentation de cache
   - Cacher les résultats côté client
   - Invalider le cache sur mutation

**Fournissez le code complet de :**
- L'API route `/api/users/route.ts`
- Le composant client de liste d'utilisateurs
- Le hook personnalisé pour fetch avec pagination
- Les types TypeScript

**Critères d'évaluation :**
- Fonctionnalité complète (10 points)
- Optimisation Prisma (5 points)
- UX (loading, erreurs) (5 points)
- Code propre et typé (5 points)

---

## Exercice 5 : Migration vers Webhooks (60 minutes)

Imaginez que vous devez migrer de l'approche Upsert vers les Webhooks sans interruption de service.

**Élaborez un plan détaillé incluant :**

### Phase 1 : Préparation
- Configuration Clerk Dashboard
- Installation de dépendances
- Variables d'environnement nécessaires
- Tests en parallèle (comment tester sans affecter la prod)

### Phase 2 : Implémentation
- Code de l'endpoint `/api/webhooks/clerk`
- Vérification de signature
- Gestion des événements (created, updated, deleted)
- Logging pour comparer avec l'ancienne méthode

### Phase 3 : Migration
- Stratégie pour les utilisateurs existants
- Comment basculer progressivement (feature flag ?)
- Période de test (webhooks actifs + upsert en backup)
- Métriques à surveiller

### Phase 4 : Finalisation
- Suppression du code upsert
- Nettoyage de la route `/welcome`
- Documentation mise à jour
- Plan de rollback si problème

**Pour chaque phase, détaillez :**
- Les risques et comment les mitiger
- Les tests à effectuer
- Les indicateurs de succès
- Le temps estimé

**Critères d'évaluation :**
- Stratégie de migration (10 points)
- Gestion des risques (5 points)
- Plan de rollback (3 points)
- Documentation (2 points)

---

## Questions Ouvertes

### Question 1 : Architecture décisionnelle (30 minutes)

Vous développez une nouvelle application SaaS. Expliquez votre processus de décision pour choisir entre :
- Upsert post-login
- Webhooks dès le début
- Approche hybride

**Considérez :**
- Le temps de développement (votre équipe a 2 développeurs)
- Le budget (startup avec seed funding)
- La taille de l'équipe (scaling prévu à 5 personnes dans 6 mois)
- Les fonctionnalités métier (marketplace avec vendeurs et acheteurs)
- L'évolutivité (objectif : 100k users dans 1 an)

**Justifiez votre choix avec des arguments techniques et business.**

**Critères d'évaluation :**
- Analyse des contraintes (3 points)
- Argumentation technique (3 points)
- Considérations business (3 points)
- Pragmatisme de la solution (3 points)

---

### Question 2 : Sécurité (20 minutes)

Listez au moins 5 bonnes pratiques de sécurité implémentées dans ce projet et expliquez pourquoi chacune est importante.

**Pour chaque pratique :**
- Identifier où elle est implémentée dans le code
- Expliquer l'attaque qu'elle prévient
- Donner un exemple de ce qui pourrait se passer sans cette protection

**Critères d'évaluation :**
- Nombre de pratiques identifiées (2 points)
- Qualité des explications (4 points)
- Compréhension des menaces (4 points)

---

### Question 3 : Système de rôles (30 minutes)

L'application doit maintenant gérer des rôles utilisateur (admin, user, moderator).

**Concevez l'implémentation complète :**

1. **Stockage** : Où stocker les rôles (Clerk metadata ou Prisma) ?
2. **Schéma** : Modifications nécessaires du schéma Prisma
3. **Protection routes** : Comment protéger selon le rôle
4. **UI conditionnelle** : Afficher des éléments selon le rôle
5. **Migrations** : Gérer les utilisateurs existants
6. **API** : Endpoint pour changer les rôles (admin only)

**Justifiez chaque décision technique.**

**Critères d'évaluation :**
- Design de la solution (4 points)
- Justifications techniques (3 points)
- Gestion des migrations (3 points)

---

### Question 4 : Performance (20 minutes)

Identifiez 3 optimisations possibles pour améliorer les performances de cette application et expliquez comment elles fonctionneraient.

**Pour chaque optimisation :**
- Identifier le problème de performance
- Proposer une solution concrète avec code
- Expliquer l'impact attendu
- Mentionner les trade-offs éventuels

**Critères d'évaluation :**
- Pertinence des optimisations (3 points)
- Faisabilité technique (3 points)
- Compréhension des trade-offs (3 points)

---

### Question 5 : Tests (20 minutes)

Quels types de tests implémenteriez-vous pour cette application ?

**Listez au moins 5 cas de test importants avec :**
- Type de test (unit, integration, e2e)
- Ce qui est testé exactement
- Le setup nécessaire (mocks, fixtures)
- La valeur apportée par ce test

**Exemple de format attendu :**
```
Test 1 : [Type] Synchronisation utilisateur
- Testé : La fonction syncUser() crée un user si inexistant
- Setup : Mock de currentUser(), DB de test
- Valeur : Garantit que chaque login crée/update le user
```

**Critères d'évaluation :**
- Couverture des cas critiques (3 points)
- Diversité des types de tests (2 points)
- Clarté des explications (2 points)

---

## Soumission

Rédigez vos réponses dans un document structuré et consultez 08-EXERCICES-SOLUTIONS(OPTIONNEL).md pour comparer avec les solutions proposées.


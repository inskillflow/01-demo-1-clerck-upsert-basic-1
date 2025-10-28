# Index du Cours : Architecture Next.js et Routing

## Vue d'ensemble

Ce cours complet explique l'architecture Next.js 14, le système de routing avec l'App Router, les conventions de fichiers, et les migrations Prisma. Durée estimée : 4-5 heures.

## Modules de cours

### [00 - Introduction](./00-INTRODUCTION(COURS).md)
**Durée : 10 minutes**
- Objectifs d'apprentissage
- Structure du cours
- Prérequis
- Le problème à résoudre

### [01 - App Router vs Pages Router](./01-APP-ROUTER-VS-PAGES(COURS).md)
**Durée : 50 minutes**
- L'évolution de Next.js
- Pages Router (ancien système)
- App Router (nouveau système)
- Pourquoi le changement
- Différences techniques clés
- Quelle version utiliser

**Concepts clés :**
- pages/ vs app/
- getServerSideProps vs async components
- React Server Components
- Migration progressive

### [02 - Fichiers Spéciaux](./02-FICHIERS-SPECIAUX(COURS).md)
**Durée : 55 minutes**
- layout.tsx (conteneur persistant)
- page.tsx (contenu de la route)
- loading.tsx (états de chargement)
- error.tsx (gestion d'erreurs)
- template.tsx (layout réinitialisé)
- not-found.tsx (page 404)

**Concepts clés :**
- Layouts imbriqués
- Server vs Client Components
- Suspense automatique
- Error boundaries

### [03 - Route Groups](./03-ROUTE-GROUPS(COURS).md)
**Durée : 45 minutes**
- Qu'est-ce qu'un route group (folder)
- Pourquoi utiliser les route groups
- Cas d'usage : layouts différents, organisation, sections
- Layouts dans les route groups
- Conventions de nommage
- Pièges courants

**Concepts clés :**
- Syntaxe (folder) n'apparaît pas dans l'URL
- (auth), (dashboard), (marketing)
- Layouts multiples sans segments d'URL
- Conflits de routes

### [04 - Routes Dynamiques](./04-ROUTES-DYNAMIQUES(COURS).md)
**Durée : 55 minutes**
- Routes dynamiques [param]
- Routes dynamiques multiples [id]/[action]
- Catch-all routes [...slug]
- Optional catch-all [[...slug]]
- Différences et cas d'usage
- Exemples Clerk : [[...rest]]

**Concepts clés :**
- [id] capture un segment
- [...slug] capture un ou plusieurs segments
- [[...slug]] capture zéro ou plusieurs segments
- params.slug est un tableau
- Usage dans signin/[[...rest]]

### [05 - Migrations Prisma](./05-MIGRATIONS-PRISMA(COURS).md)
**Durée : 60 minutes**
- Qu'est-ce qu'une migration
- db push vs migrate dev vs migrate deploy
- Structure des migrations
- Workflow de développement
- Gestion des conflits
- Migrations et données existantes
- Renommer, supprimer, ajouter des champs

**Concepts clés :**
- db push : prototypage rapide
- migrate dev : créer des migrations
- migrate deploy : appliquer en production
- prisma/migrations/ et _prisma_migrations
- Migration destructive vs non-destructive

### [06 - Architecture Complète](./06-ARCHITECTURE-COMPLETE(COURS).md)
**Durée : 50 minutes**
- Structure recommandée
- Organisation par fonctionnalité
- Bonnes pratiques d'architecture
- Patterns avancés (parallel routes, intercepting)
- Colocation et séparation des responsabilités

**Concepts clés :**
- Organization par feature
- Colocation
- Server par défaut, Client si nécessaire
- API middleware pattern

### [07 - Quiz Questions](./07-QUIZ-QUESTIONS(OBLIGATOIRE).md)
**Durée : 40 minutes**
- 30 questions à choix multiples
- 6 sections thématiques
- Format sans les réponses

### [08 - Quiz Réponses](./08-QUIZ-REPONSES(OBLIGATOIRE).md)
- Corrections détaillées
- Explications approfondies
- Barème de notation

### [09 - Exercices](./09-EXERCICES(OPTIONNEL).md)
**Durée : 4-5 heures**
- 5 exercices pratiques complexes
- 2 questions ouvertes de réflexion
- Critères d'évaluation détaillés

## Progression recommandée

### Parcours Standard (5 heures)
1. Lire tous les modules dans l'ordre (00 → 06)
2. Faire le quiz (07-08)
3. Réaliser au moins 2 exercices pratiques

### Parcours Rapide (2 heures)
1. Modules 01, 02, 03 (bases essentielles)
2. Quiz uniquement
3. Survol des autres modules

### Parcours Expert (1 heure)
1. Modules 04 et 05 (routes dynamiques et migrations)
2. Exercices pratiques uniquement
3. Questions ouvertes

## Critères de réussite

Après ce cours, vous devriez pouvoir :

- Expliquer la différence entre App Router et Pages Router
- Utiliser layout.tsx et page.tsx correctement
- Comprendre et utiliser les route groups (folder)
- Maîtriser les routes dynamiques [...] et [[...]]
- Gérer les migrations Prisma professionnellement
- Architecturer une application Next.js scalable
- Choisir entre App Router et Pages Router selon le contexte

## Sujets couverts en détail

### Fichiers spéciaux
- **layout.tsx** : UI persistante, imbrication
- **page.tsx** : Contenu unique, feuille terminale
- **loading.tsx** : Suspense automatique
- **error.tsx** : Error boundary automatique

### Routes
- **(folder)** : Route group, n'apparaît pas dans URL
- **[param]** : Capture un segment
- **[...slug]** : Capture un ou plusieurs segments  
- **[[...slug]]** : Capture zéro ou plusieurs segments (optionnel)

### Migrations
- **db push** : Prototypage, aucune migration créée
- **migrate dev** : Développement, crée migrations
- **migrate deploy** : Production, applique migrations
- **_prisma_migrations** : Table de tracking

## Comparaison avec les autres examens

### Examen-1 : Clerk + Upsert
Utilise l'App Router avec route groups (auth)

### Examen-2 : Webhooks
Structure app/api/webhooks/clerk/route.ts

### Examen-3 : NextAuth
Utilise [...nextauth] catch-all et route groups

### Examen-4 : JWT
Concepts utilisés par App Router pour les sessions

### Examen-5 : Architecture (ce cours)
Comprend les fondations de tous les examens précédents

## Ressources complémentaires

### Dans ce projet
- `app/` - Voir la structure réelle
- `prisma/migrations/` - Voir les migrations réelles
- `examen-1/` à `examen-4/` - Contexte d'utilisation

### Documentation officielle
- [Next.js App Router](https://nextjs.org/docs/app)
- [Next.js Routing](https://nextjs.org/docs/app/building-your-application/routing)
- [Prisma Migrations](https://www.prisma.io/docs/concepts/components/prisma-migrate)
- [React Server Components](https://react.dev/reference/react/use-server)

## Notation du quiz

**Total : 60 points**
- Quiz : 60 points (30 questions × 2 points)

**Barème :**
- 54-60 : Excellente maîtrise
- 45-53 : Bonne compréhension
- 36-44 : Compréhension satisfaisante
- 30-35 : Révision recommandée
- <30 : Révision nécessaire

## Points clés à retenir

### Conventions de fichiers
- **layout.tsx** : Structure persistante
- **page.tsx** : Contenu unique
- **loading.tsx** : Fallback chargement
- **error.tsx** : Gestion d'erreurs
- **not-found.tsx** : Page 404

### Routes spéciales
- **(folder)** : N'apparaît pas dans URL
- **[param]** : Un segment dynamique
- **[...slug]** : Un ou plusieurs segments
- **[[...slug]]** : Zéro ou plusieurs segments

### Migrations Prisma
- **Développement** : migrate dev
- **Production** : migrate deploy
- **Prototypage** : db push
- **Ne jamais** : db push en production

## Commence par : [00-INTRODUCTION(COURS).md](./00-INTRODUCTION(COURS).md)

Ou directement : [02-FICHIERS-SPECIAUX(COURS).md](./02-FICHIERS-SPECIAUX(COURS).md) pour les concepts pratiques


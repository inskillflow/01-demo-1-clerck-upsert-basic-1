# Examen 5 : Architecture Next.js et Routing Avancé

## Description

Ce cours complet explique l'architecture d'une application Next.js 14, le système de routing avec l'App Router, les conventions de fichiers, et la gestion professionnelle des migrations Prisma.

## Contenu

### Cours (6 modules)

**[00-INTRODUCTION(COURS).md](./00-INTRODUCTION(COURS).md)** - Présentation et objectifs

**[01-APP-ROUTER-VS-PAGES(COURS).md](./01-APP-ROUTER-VS-PAGES(COURS).md)** - Évolution de Next.js, différences entre systèmes

**[02-FICHIERS-SPECIAUX(COURS).md](./02-FICHIERS-SPECIAUX(COURS).md)** - layout.tsx, page.tsx, loading.tsx, error.tsx

**[03-ROUTE-GROUPS(COURS).md](./03-ROUTE-GROUPS(COURS).md)** - Signification de (auth), (dashboard), organisation

**[04-ROUTES-DYNAMIQUES(COURS).md](./04-ROUTES-DYNAMIQUES(COURS).md)** - [id], [...slug], [[...slug]], cas d'usage

**[05-MIGRATIONS-PRISMA(COURS).md](./05-MIGRATIONS-PRISMA(COURS).md)** - db push, migrate dev, migrate deploy, workflows

**[06-ARCHITECTURE-COMPLETE(COURS).md](./06-ARCHITECTURE-COMPLETE(COURS).md)** - Bonnes pratiques, patterns avancés

### Évaluation

**[07-QUIZ-QUESTIONS(OBLIGATOIRE).md](./07-QUIZ-QUESTIONS(OBLIGATOIRE).md)** - 30 questions à choix multiples

**[08-QUIZ-REPONSES(OBLIGATOIRE).md](./08-QUIZ-REPONSES(OBLIGATOIRE).md)** - Corrections avec explications

**[09-EXERCICES(OPTIONNEL).md](./09-EXERCICES(OPTIONNEL).md)** - 5 exercices pratiques + 2 questions ouvertes

### Navigation

**[INDEX.md](./INDEX.md)** - Index complet avec vue d'ensemble et progression recommandée

## Sujets couverts

### App Router
- Nouveau système de routing Next.js 14
- React Server Components par défaut
- Layouts imbriqués naturellement
- Streaming et Suspense natifs

### Fichiers spéciaux
- **layout.tsx** : UI persistante qui wrappe les enfants
- **page.tsx** : Contenu unique de chaque route
- **loading.tsx** : Fallback pendant chargement
- **error.tsx** : Error boundary automatique

### Route Groups
- **Syntaxe (folder)** : N'apparaît pas dans l'URL
- **Usage** : Organisation, layouts différents
- **Exemples** : (auth), (dashboard), (marketing)

### Routes Dynamiques
- **[id]** : Capture un segment
- **[...slug]** : Capture un ou plusieurs segments (catch-all)
- **[[...slug]]** : Capture zéro ou plusieurs segments (optional catch-all)
- **Usage Clerk** : sign-in/[[...rest]]

### Migrations Prisma
- **db push** : Prototypage rapide, aucun fichier de migration
- **migrate dev** : Développement, crée des fichiers SQL versionnés
- **migrate deploy** : Production, applique les migrations existantes
- **Table _prisma_migrations** : Tracking des migrations appliquées

## Comment utiliser ce cours

1. **Contexte :** Fondamental pour comprendre la structure des examens 1-4
2. Commencez par [INDEX.md](./INDEX.md) pour la vue d'ensemble
3. Modules 02, 03, 04 sont les plus pratiques
4. Module 05 est crucial pour Prisma en production
5. Testez avec le quiz (07-08)
6. Pratiquez avec les exercices (09)

## Durée estimée

- **Lecture complète :** 5-6 heures
- **Quiz :** 40 minutes
- **Exercices :** 4-5 heures
- **Total :** 9-12 heures pour maîtrise complète

## Caractéristiques pédagogiques

- Style narratif et progressif
- Exemples tirés de votre projet réel
- Comparaisons App Router vs Pages Router
- Explications des conventions Next.js
- Workflows Prisma complets
- Approche "pourquoi avant comment"

## Public cible

- Développeurs Next.js débutants à intermédiaires
- Personnes ayant suivi examens 1-4 voulant comprendre la structure
- Développeurs migrant de Pages Router vers App Router
- Équipes voulant standardiser leur architecture
- Personnes cherchant à maîtriser Prisma migrations

## Prérequis

- JavaScript/TypeScript de base
- React fondamental
- Next.js installé
- Notions de routing web

## Objectifs d'apprentissage

Après ce cours, vous serez capable de :

1. Expliquer la différence entre App Router et Pages Router
2. Utiliser correctement layout.tsx et page.tsx
3. Organiser le code avec les route groups (folder)
4. Créer des routes dynamiques avec [...] et [[...]]
5. Gérer les migrations Prisma en développement et production
6. Architecturer une application scalable
7. Choisir les bonnes conventions pour votre projet

## Structure du quiz

**30 questions à choix multiples** :
- 5 questions sur App Router vs Pages Router
- 5 questions sur les fichiers spéciaux
- 5 questions sur les route groups
- 5 questions sur les routes dynamiques
- 5 questions sur les migrations Prisma
- 5 questions sur l'architecture

**5 exercices pratiques** :
1. Architecture complète avec route groups
2. Routes dynamiques et CMS
3. Migrations Prisma (4 scénarios complexes)
4. Migration Pages → App Router
5. Patterns avancés (parallel, intercepting)

**2 questions ouvertes** :
1. Choix architectural (3 types d'applications)
2. Migrations en production (procédures complètes)

**Notation sur 60 points (quiz uniquement)**

## Conventions Next.js essentielles

### Fichiers spéciaux (ordre de priorité)
1. layout.tsx
2. template.tsx
3. error.tsx
4. loading.tsx
5. not-found.tsx
6. page.tsx

### Syntaxes de routing
- **/folder** : Segment d'URL normal
- **(folder)** : Route group (n'apparaît pas dans URL)
- **[param]** : Segment dynamique unique
- **[...slug]** : Catch-all (1+ segments)
- **[[...slug]]** : Optional catch-all (0+ segments)
- **@folder** : Parallel route slot

### Commandes Prisma par environnement
- **Dev** : `migrate dev --name description`
- **Production** : `migrate deploy`
- **CI/CD** : `migrate deploy && generate`
- **Prototypage** : `db push`

## Liens avec les autres examens

### Examen-1 : Clerk + Upsert
Comprendre pourquoi app/(auth)/sign-in/[[...rest]]/page.tsx

### Examen-2 : Webhooks  
Comprendre la structure app/api/webhooks/clerk/route.ts

### Examen-3 : NextAuth
Comprendre app/api/auth/[...nextauth]/route.ts

### Examen-4 : JWT
Comprendre où les JWT sont utilisés dans l'architecture

### Examen-5 : Architecture (ce cours)
Les fondations qui expliquent tous les choix architecturaux précédents

## Commence par : [00-INTRODUCTION(COURS).md](./00-INTRODUCTION(COURS).md)

Ou pour les concepts clés immédiatement : [02-FICHIERS-SPECIAUX(COURS).md](./02-FICHIERS-SPECIAUX(COURS).md)


# Documentation Cours - Structure Organisée

## Vue d'ensemble

Ce dossier contient 7 cours complets organisés par thématique avec des noms descriptifs.

## Structure des cours

### 01-clerk-upsert
**Sujet :** Authentification avec Clerk et synchronisation post-login
**Contenu :** Fondations, Clerk, Prisma, Synchronisation upsert
**Quiz :** 20 questions
**Durée :** 3-4 heures

### 02-webhooks-production
**Sujet :** Webhooks Clerk, ngrok, déploiement production
**Contenu :** Concepts webhooks, Svix, Production vs Dev, Déploiement
**Quiz :** 40 questions (webhooks + production)
**Durée :** 5-6 heures

### 03-nextauth
**Sujet :** NextAuth.js - Alternative open-source à Clerk
**Contenu :** Configuration, Providers OAuth, Sessions, Pages personnalisées
**Quiz :** 25 questions
**Durée :** 4-5 heures

### 04-jwt
**Sujet :** JSON Web Tokens en profondeur + Comparaison des approches
**Contenu :** Anatomie JWT, Cryptographie, Sécurité, JWT vs Clerk vs NextAuth
**Quiz :** 25 questions
**Durée :** 5-6 heures
**Note :** Module 09 compare JWT, Clerk, et NextAuth

### 05-architecture-nextjs
**Sujet :** App Router, routing, migrations Prisma (concepts)
**Contenu :** App vs Pages Router, Fichiers spéciaux, Route groups, Routes dynamiques, Migrations
**Quiz :** 30 questions
**Durée :** 4-5 heures

### 06-creer-pages-nextjs
**Sujet :** Guide pratique pour créer layout, page, loading, error (code complet)
**Contenu :** Code réel de layouts, pages, loading, error, API routes
**Quiz :** 25 questions
**Durée :** 5-6 heures
**Note :** Complément pratique de 05-architecture-nextjs

### 07-validation-zod
**Sujet :** Validation type-safe avec Zod
**Contenu :** Pourquoi validation, Fondations Zod, Schémas avancés, Formulaires, API
**Quiz :** 25 questions
**Durée :** 4-5 heures
**Note :** Applicable à tous les autres cours (sécurité)

## Organisation des fichiers

Chaque cours contient :
- `00-INTRODUCTION(COURS).md` à `0X-MODULE(COURS).md` - Modules de cours
- `0X-QUIZ-QUESTIONS(OBLIGATOIRE).md` - Questions sans réponses
- `0X-QUIZ-REPONSES(OBLIGATOIRE).md` - Corrections détaillées
- `0X-EXERCICES(OPTIONNEL).md` - Exercices pratiques
- `INDEX.md` - Navigation du cours
- `README.md` - Vue d'ensemble

## Total du contenu

- **47 modules** narratifs
- **300+ pages** de cours
- **190 questions** de quiz
- **32 exercices** pratiques
- **18 questions** ouvertes

## Parcours recommandé

1. **05-architecture-nextjs** - Comprendre Next.js
2. **06-creer-pages-nextjs** - Pratiquer avec du code
3. **07-validation-zod** - Sécuriser
4. **01-clerk-upsert** - Première approche auth
5. **04-jwt** - Comprendre les fondations + Comparaison
6. **03-nextauth** - Alternative gratuite
7. **02-webhooks-production** - Production avancée

## Commencez ici

- **Nouveau :** [01-clerk-upsert/INDEX.md](./01-clerk-upsert/INDEX.md)
- **Next.js :** [05-architecture-nextjs/INDEX.md](./05-architecture-nextjs/INDEX.md)
- **Comparaison :** [04-jwt/09-COMPARAISON-APPROCHES(COURS).md](./04-jwt/09-COMPARAISON-APPROCHES(COURS).md)


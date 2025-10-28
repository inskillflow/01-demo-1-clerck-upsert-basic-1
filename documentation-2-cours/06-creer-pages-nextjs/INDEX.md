# Index du Cours : Créer des Pages Next.js - Guide Pratique

## Vue d'ensemble

Ce cours pratique montre comment créer concrètement tous les types de fichiers Next.js avec des exemples réels et du code production-ready. Durée estimée : 4-5 heures.

## Modules de cours

### [00 - Introduction](./00-INTRODUCTION(COURS).md)
**Durée : 10 minutes**
- Objectifs d'apprentissage
- Structure du cours
- Prérequis
- Approche pratique

### [01 - Créer layout.tsx](./01-CREER-LAYOUT(COURS).md)
**Durée : 60 minutes**
- Layout racine obligatoire (html, body)
- Layout racine avec Clerk complet
- Layout racine avec NextAuth
- Layout de section (auth, dashboard)
- Layout avec navigation tabs
- Layout avec sidebar
- Séparation Server/Client pour navigation

**Exemples de code :**
- Layout auth (centré, minimal)
- Layout dashboard (sidebar + header)
- Layout settings (tabs de navigation)
- Layouts imbriqués multiples

### [02 - Créer page.tsx](./02-CREER-PAGE(COURS).md)
**Durée : 60 minutes**
- Page simple (Server Component)
- Page avec fetch de données Prisma
- Page avec authentification requise
- Page avec interactivité (Client Component)
- Page avec formulaire complet
- Metadata dynamique
- Gestion des cas vides

**Exemples de code :**
- Page d'accueil avec hero section
- Page users avec grid et fetch
- Page dashboard avec stats
- Page contact avec formulaire

### [03 - Créer loading.tsx](./03-CREER-LOADING(COURS).md)
**Durée : 45 minutes**
- Loading simple avec spinner
- Spinner avec message
- Skeleton pour liste (recommandé)
- Skeleton pour tableau
- Skeleton pour grid
- Loading avec progress bar
- Client vs Server loading

**Exemples de code :**
- Skeleton utilisateurs (grid)
- Skeleton tableau admin
- Progress bar animée
- Skeleton multi-sections

### [04 - Créer error.tsx](./04-CREER-ERROR(COURS).md)
**Durée : 45 minutes**
- Error basique avec reset
- Error professionnel avec détails
- Error spécifique par section
- Error avec catégories (réseau, DB, auth)
- Logging vers services externes
- UI rassurante et actions appropriées

**Exemples de code :**
- Error global avec Sentry logging
- Error auth avec bouton reconnexion
- Error avec messages selon type
- Error 404 custom

### [05 - Fichiers Avancés](./05-FICHIERS-AVANCES(COURS).md)
**Durée : 50 minutes**
- template.tsx avec animations
- template.tsx avec analytics
- not-found.tsx personnalisée
- API routes (route.ts)
- CRUD complet avec validation
- API route dynamique
- Middleware API

**Exemples de code :**
- Template avec framer-motion
- 404 professionnelle avec suggestions
- API CRUD users complète
- API avec validation Zod

### [06 - Application Complète](./06-APPLICATION-COMPLETE(COURS).md)
**Durée : 60 minutes**
- Application blog de A à Z
- Structure complète avec tous les fichiers
- Page d'accueil avec sections
- Page article détaillée
- Fetch parallèle optimisé
- Metadata dynamique
- Gestion complète

**Exemple complet :**
- Application blog professionnelle
- Tous les fichiers commentés
- Bonnes pratiques appliquées

### [07 - Quiz Questions](./07-QUIZ-QUESTIONS(OBLIGATOIRE).md)
**Durée : 30 minutes**
- 25 questions à choix multiples
- 5 sections : layout, page, loading, error, API routes
- Format sans les réponses

### [08 - Quiz Réponses](./08-QUIZ-REPONSES(OBLIGATOIRE).md)
- Corrections détaillées
- Explications approfondies
- Barème de notation

### [09 - Exercices](./09-EXERCICES(OPTIONNEL).md)
**Durée : 5-6 heures**
- 4 exercices pratiques complexes
- 2 questions ouvertes
- Critères d'évaluation détaillés

## Progression recommandée

### Parcours Standard (5 heures)
1. Lire tous les modules dans l'ordre (00 → 06)
2. Copier et tester les exemples de code
3. Faire le quiz (07-08)
4. Réaliser 1-2 exercices pratiques

### Parcours Pratique (3 heures)
1. Modules 01, 02, 03 (les essentiels)
2. Copier le code et l'adapter à votre projet
3. Quiz uniquement

### Parcours Code (2 heures)
1. Lire uniquement les exemples de code
2. Les tester dans votre projet
3. Exercice 4 (améliorer votre code existant)

## Critères de réussite

Après ce cours, vous devriez pouvoir :

- Créer un layout.tsx racine conforme
- Créer des layouts imbriqués pour différentes sections
- Implémenter des page.tsx avec fetch optimisé
- Créer des loading.tsx avec skeletons professionnels
- Gérer les erreurs avec error.tsx appropriés
- Créer des API routes CRUD complètes
- Structurer une application complète
- Appliquer les bonnes pratiques Next.js

## Différence avec examen-5

### Examen-5 : Concepts théoriques
- **Quoi** : Qu'est-ce que layout.tsx ?
- **Pourquoi** : Pourquoi utiliser les route groups ?
- **Quand** : Quand utiliser [...] vs [[...]] ?

### Examen-6 : Pratique concrète
- **Comment** : Comment créer un layout.tsx professionnel ?
- **Code** : Exemples complets et fonctionnels
- **Patterns** : Quelle structure utiliser dans quels cas ?

**Complémentaires :** Suivez examen-5 pour les concepts, examen-6 pour la pratique.

## Exemples de code inclus

### Layouts complets
- Layout racine avec Clerk/NextAuth
- Layout auth (centré)
- Layout dashboard (sidebar + header)
- Layout settings (tabs)

### Pages complètes
- Page d'accueil (hero + sections)
- Page liste avec fetch
- Page détail avec relations
- Page formulaire interactive

### Loading states
- Skeletons grid/tableau/cards
- Progress bars
- Spinners avec messages

### Error handling
- Error globale professionnelle
- Error par section
- Error avec catégories

### API Routes
- CRUD complet
- Validation Zod
- Authentification
- Pagination

## Ressources pratiques

### Code réutilisable
Tous les exemples sont conçus pour être copiés et adaptés directement.

### Dans ce projet
- `app/` - Voir la structure réelle
- `components/` - Composants réutilisables
- `lib/` - Utilitaires

### Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)

## Notation du quiz

**Total : 50 points**
- Quiz : 50 points (25 questions × 2 points)

**Barème :**
- 45-50 : Excellente maîtrise pratique
- 38-44 : Bonne compréhension
- 30-37 : Compréhension satisfaisante
- 25-29 : Révision recommandée
- <25 : Révision nécessaire

## Commence par : [00-INTRODUCTION(COURS).md](./00-INTRODUCTION(COURS).md)

Ou directement le code : [01-CREER-LAYOUT(COURS).md](./01-CREER-LAYOUT(COURS).md)


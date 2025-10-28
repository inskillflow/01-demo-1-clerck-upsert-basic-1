# Index du Cours : NextAuth.js et Authentification Open Source

## Vue d'ensemble

Ce cours complet explique l'implémentation de NextAuth.js, l'alternative open-source gratuite à Clerk. Durée estimée : 4-5 heures.

## Modules de cours

### [00 - Introduction](./00-INTRODUCTION(COURS).md)
**Durée : 10 minutes**
- Objectifs d'apprentissage
- Structure du cours
- Prérequis
- Le problème à résoudre

### [01 - Fondations NextAuth](./01-FONDATIONS-NEXTAUTH(COURS).md)
**Durée : 40 minutes**
- Qu'est-ce que NextAuth.js
- Philosophie open-source vs SaaS
- Architecture de NextAuth
- Schéma de base de données requis
- Stratégies de session
- Comparaison NextAuth vs Clerk
- Quand choisir NextAuth

**Concepts clés :**
- Bibliothèque vs Service
- API Route catch-all
- Tables obligatoires (User, Account, Session, VerificationToken)
- JWT vs Database session

### [02 - Configuration et Setup](./02-CONFIGURATION-SETUP(COURS).md)
**Durée : 50 minutes**
- Installation des dépendances
- Génération du NEXTAUTH_SECRET
- Configuration des variables d'environnement
- Schéma Prisma complet avec NextAuth
- Structure des fichiers
- Les callbacks NextAuth
- Différences clés avec Clerk

**Concepts clés :**
- Prisma Adapter
- authOptions
- Callbacks (jwt, session, signIn)
- Schéma avec tables obligatoires

### [03 - Providers d'Authentification](./03-PROVIDERS-AUTHENTIFICATION(COURS).md)
**Durée : 60 minutes**
- Les providers OAuth
- Qu'est-ce que OAuth (flux complet)
- Configuration de Google OAuth
- Configuration de GitHub OAuth
- Le provider Credentials (email + password)
- Le provider Email (magic links)
- Combiner plusieurs providers

**Concepts clés :**
- OAuth 2.0 flow
- Google Cloud Console
- GitHub OAuth Apps
- Credentials authorize()
- SMTP configuration

### [04 - Sessions et Sécurité](./04-SESSIONS-SECURITE(COURS).md)
**Durée : 50 minutes**
- Gestion des sessions avec NextAuth
- Stratégie JWT détaillée
- Stratégie Database détaillée
- Choisir la bonne stratégie
- Protection des routes
- Sécurité : hachage, signatures, cookies, CSRF

**Concepts clés :**
- JWT vs Database strategy
- getServerSession() vs useSession()
- Protection par rôle
- Bcrypt hashing
- Cookies sécurisés

### [05 - Pages Personnalisées](./05-PAGES-PERSONNALISEES(COURS).md)
**Durée : 45 minutes**
- Pourquoi créer ses propres pages
- Configuration des pages personnalisées
- Page de connexion complète
- Page d'inscription
- Composants d'authentification (UserButton, SignedIn, SignedOut)

**Concepts clés :**
- Pages custom vs pages par défaut
- signIn() et signOut()
- Gestion des erreurs
- CallbackUrl

### [06 - Intégration Prisma](./06-INTEGRATION-PRISMA(COURS).md)
**Durée : 40 minutes**
- L'adapter Prisma en détail
- Synchronisation automatique
- Personnalisation de la synchronisation
- Callback signIn pour nouveaux utilisateurs
- Events pour le logging
- Gestion des champs personnalisés
- Différences avec Clerk

**Concepts clés :**
- PrismaAdapter automatic sync
- isNewUser flag
- Events vs Callbacks
- Champs personnalisés

### [07 - Quiz Questions](./07-QUIZ-QUESTIONS(OBLIGATOIRE).md)
**Durée : 35 minutes**
- 25 questions à choix multiples
- 5 sections : Concepts, Schéma, Sessions, Providers, Sécurité
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
1. Modules 01, 02, 04 (concepts essentiels)
2. Quiz uniquement
3. Survol des autres modules

### Parcours Expert (1 heure)
1. Module 02 (configuration)
2. Exercices pratiques uniquement
3. Questions ouvertes

## Critères de réussite

Après ce cours, vous devriez pouvoir :

- Configurer NextAuth de A à Z dans une application Next.js
- Implémenter plusieurs providers OAuth
- Choisir entre JWT et Database selon le contexte
- Créer des pages d'authentification personnalisées
- Protéger les routes selon les rôles
- Comparer NextAuth et Clerk de manière éclairée
- Migrer de Clerk vers NextAuth si nécessaire

## Comparaison avec examen-1 et examen-2

### Examen-1 : Clerk + Upsert
- Service SaaS facile et rapide
- UI fournie
- Payant à grande échelle

### Examen-2 : Clerk + Webhooks
- Synchronisation temps réel
- Configuration webhook
- Dépendance externe

### Examen-3 : NextAuth (ce cours)
- Open-source et gratuit
- Contrôle total
- Plus de configuration initiale
- Aucune dépendance externe

**Recommandation :** Clerk pour MVP rapide, NextAuth pour long terme ou budget limité.

## Ressources complémentaires

### Dans ce projet
- `examen-1/` - Cours sur Clerk + Upsert (pour comparaison)
- `documentation-1/07-NEXTAUTH_ALTERNATIVE.md` - Guide NextAuth détaillé
- `examples/` - Exemples de code

### Documentation officielle
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Prisma Adapter](https://next-auth.js.org/adapters/prisma)
- [OAuth Providers](https://next-auth.js.org/providers)
- [Next.js Documentation](https://nextjs.org/docs)

## Notation du quiz

**Total : 50 points**
- Quiz : 50 points (25 questions × 2 points)

**Barème :**
- 45-50 : Excellente maîtrise
- 38-44 : Bonne compréhension
- 30-37 : Compréhension satisfaisante
- 25-29 : Révision recommandée
- <25 : Révision nécessaire

## Commence par : [00-INTRODUCTION(COURS).md](./00-INTRODUCTION(COURS).md)


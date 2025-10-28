# Examen 3 : NextAuth.js et Authentification Open Source

## Description

Ce cours complet explique l'implémentation de NextAuth.js, l'alternative open-source gratuite à Clerk. Approche narrative détaillée, même style qu'examen-1 et examen-2.

## Contenu

### Cours (6 modules)

**[00-INTRODUCTION(COURS).md](./00-INTRODUCTION(COURS).md)** - Présentation et objectifs

**[01-FONDATIONS-NEXTAUTH(COURS).md](./01-FONDATIONS-NEXTAUTH(COURS).md)** - Comprendre NextAuth et comparaison avec Clerk

**[02-CONFIGURATION-SETUP(COURS).md](./02-CONFIGURATION-SETUP(COURS).md)** - Installation et configuration complète

**[03-PROVIDERS-AUTHENTIFICATION(COURS).md](./03-PROVIDERS-AUTHENTIFICATION(COURS).md)** - OAuth, Credentials, Email providers

**[04-SESSIONS-SECURITE(COURS).md](./04-SESSIONS-SECURITE(COURS).md)** - JWT vs Database, protection des routes

**[05-PAGES-PERSONNALISEES(COURS).md](./05-PAGES-PERSONNALISEES(COURS).md)** - Créer vos propres interfaces d'authentification

**[06-INTEGRATION-PRISMA(COURS).md](./06-INTEGRATION-PRISMA(COURS).md)** - Adapter Prisma et synchronisation automatique

### Évaluation

**[07-QUIZ-QUESTIONS(OBLIGATOIRE).md](./07-QUIZ-QUESTIONS(OBLIGATOIRE).md)** - 25 questions à choix multiples

**[08-QUIZ-REPONSES(OBLIGATOIRE).md](./08-QUIZ-REPONSES(OBLIGATOIRE).md)** - Corrections avec explications

**[09-EXERCICES(OPTIONNEL).md](./09-EXERCICES(OPTIONNEL).md)** - 5 exercices pratiques + 2 questions ouvertes

### Navigation

**[INDEX.md](./INDEX.md)** - Index complet avec vue d'ensemble et progression recommandée

## Thème central : NextAuth vs Clerk

Ce cours répond notamment aux questions :
- **Pourquoi choisir NextAuth plutôt que Clerk ?**
- **Comment configurer NextAuth de A à Z ?**
- **Quelles sont les différences concrètes dans le code ?**
- **Comment migrer de Clerk vers NextAuth ?**

## Différence avec examen-1 et examen-2

### Examen-1 : Clerk + Upsert
- Service SaaS rapide à configurer
- UI fournie et moderne
- Synchronisation manuelle simple
- Payant après 10k users

### Examen-2 : Clerk + Webhooks
- Synchronisation temps réel
- Configuration webhook Clerk
- Architecture event-driven
- Dépendance externe

### Examen-3 : NextAuth (ce cours)
- Open-source 100% gratuit
- Configuration plus complexe (1-2 heures)
- UI à créer soi-même
- Contrôle total
- Aucune dépendance externe
- Plus de responsabilités (sécurité, maintenance)

## Comment utiliser ce cours

1. **Prérequis :** Avoir suivi examen-1 ou comprendre Clerk + Prisma
2. Commencez par [INDEX.md](./INDEX.md) pour la vue d'ensemble
3. Suivez les modules 00 → 06 dans l'ordre
4. Testez vos connaissances avec le quiz (07-08)
5. Approfondissez avec les exercices (09)

## Durée estimée

- **Lecture complète :** 4-5 heures
- **Quiz :** 35 minutes
- **Exercices :** 4-5 heures
- **Total :** 8-11 heures pour maîtrise complète

## Caractéristiques pédagogiques

- Style narratif et progressif
- Explications en paragraphes détaillés
- Comparaisons constantes avec Clerk
- Code complet et commenté
- Exemples concrets de configuration
- Approche "pourquoi avant comment"

## Public cible

- Développeurs ayant suivi examen-1 (Clerk)
- Personnes voulant éviter les coûts d'un SaaS auth
- Développeurs cherchant le contrôle total
- Projets open-source nécessitant une solution gratuite
- Équipes avec expertise technique suffisante

## Prérequis

- JavaScript/TypeScript intermédiaire
- Avoir suivi examen-1 (ou comprendre Clerk + Prisma + Next.js)
- Notions de OAuth (sera expliqué dans le cours)
- Next.js 14 App Router

## Objectifs d'apprentissage

Après ce cours, vous serez capable de :

1. Installer et configurer NextAuth avec Prisma Adapter
2. Implémenter Google OAuth, GitHub OAuth, et Credentials
3. Choisir entre stratégie JWT et Database selon le contexte
4. Créer des pages d'authentification professionnelles
5. Protéger les routes par authentification et par rôle
6. Gérer la sécurité (hachage, cookies, CSRF)
7. Comparer Clerk et NextAuth pour des décisions éclairées
8. Planifier une migration de Clerk vers NextAuth

## Points clés

### Différences majeures avec Clerk

**Setup :**
- Clerk : 10 minutes
- NextAuth : 1-2 heures

**Coût :**
- Clerk : Gratuit jusqu'à 10k users puis payant
- NextAuth : Gratuit à vie

**UI :**
- Clerk : Fournie et professionnelle
- NextAuth : À créer entièrement

**Contrôle :**
- Clerk : Limité aux options proposées
- NextAuth : Total sur tous les aspects

**Maintenance :**
- Clerk : Gérée par Clerk
- NextAuth : À votre charge

### Quand choisir NextAuth

- Budget limité sur le long terme
- Besoin de contrôle total
- Projet open-source
- Éviter vendor lock-in
- Expertise technique disponible

### Quand choisir Clerk

- MVP rapide
- Petite équipe
- Budget disponible
- Fonctionnalités avancées immédiatement

## Structure du quiz

**25 questions à choix multiples** :
- 5 questions sur les concepts NextAuth
- 5 questions sur le schéma Prisma
- 5 questions sur les stratégies de session
- 5 questions sur les providers
- 5 questions sur la sécurité

**5 exercices pratiques** :
1. Configuration complète NextAuth
2. Pages d'authentification personnalisées
3. Système de rôles et permissions
4. Migration Clerk → NextAuth
5. Comparaison architecture complète

**2 questions ouvertes** :
1. Choix technologique argumenté (3 cas différents)
2. Sécurité NextAuth (7 bonnes pratiques)

**Notation sur 50 points (quiz uniquement)**

## Prérequis techniques

### Packages npm
- next-auth
- @next-auth/prisma-adapter
- bcryptjs
- @types/bcryptjs
- zod (pour validation)

### Comptes à créer
- Google Cloud Console (pour Google OAuth)
- GitHub Developer Settings (pour GitHub OAuth)
- Service SMTP (SendGrid, Mailtrap, etc. pour magic links)

### Connaissances
- Next.js 14 App Router
- Prisma ORM
- TypeScript
- React hooks

## Résumé : NextAuth en 5 points

1. **Gratuit** : Pas de limitation d'utilisateurs
2. **Contrôle** : Total sur le code et la configuration
3. **Flexible** : 40+ providers, personnalisation illimitée
4. **Responsabilité** : Vous gérez la sécurité et maintenance
5. **Configuration** : Plus complexe initialement qu'un SaaS

## Commence par : [00-INTRODUCTION(COURS).md](./00-INTRODUCTION(COURS).md)

Ou si vous avez déjà suivi examen-1, passez à : [01-FONDATIONS-NEXTAUTH(COURS).md](./01-FONDATIONS-NEXTAUTH(COURS).md)


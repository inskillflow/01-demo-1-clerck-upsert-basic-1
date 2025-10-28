# Index du Cours : Architecture Clerk + Prisma + Next.js

## Vue d'ensemble

Ce cours complet explique l'architecture d'une application moderne avec authentification et base de données. Durée estimée : 3-4 heures.

## Modules de cours

### [00 - Introduction](./00-INTRODUCTION.md)
**Durée : 10 minutes**
- Objectifs d'apprentissage
- Structure du cours
- Prérequis
- Méthodologie

### [01 - Les Fondations](./01-FONDATIONS.md)
**Durée : 30 minutes**
- Le problème de l'authentification moderne
- Pourquoi ne pas tout coder soi-même
- Les solutions modernes (NextAuth vs Clerk)
- Le défi de la synchronisation

**Concepts clés :**
- Authentification vs Autorisation
- Bibliothèques open-source vs Services SaaS
- Hachage de mots de passe
- Gestion des sessions

### [02 - Authentification avec Clerk](./02-CLERK-AUTHENTICATION.md)
**Durée : 45 minutes**
- Architecture de Clerk
- Le flux de connexion complet
- Les composants React de Clerk
- Les fonctions serveur (auth, currentUser)
- Le cycle de vie des sessions
- La sécurité du modèle
- L'intégration avec Next.js

**Concepts clés :**
- JWT (JSON Web Token)
- Cookies httpOnly et secure
- ClerkProvider
- Middleware de protection
- Routes catch-all

### [03 - Base de données avec Prisma](./03-PRISMA-DATABASE.md)
**Durée : 45 minutes**
- Qu'est-ce qu'un ORM et pourquoi
- Les trois composants de Prisma (schéma, client, migrations)
- Utilisation du client Prisma
- Les opérations CRUD de base
- L'opération Upsert
- Les relations entre tables
- Prisma avec Supabase
- Type safety avec TypeScript

**Concepts clés :**
- ORM (Object-Relational Mapping)
- Schéma déclaratif
- Client généré type-safe
- Upsert (Update + Insert)
- Migrations de base de données

### [04 - Synchronisation Intelligente](./04-SYNCHRONISATION.md)
**Durée : 45 minutes**
- Le défi central de la synchronisation
- Stratégie 1 : Webhooks (temps réel)
- Stratégie 2 : Upsert post-login (notre choix)
- Implémentation détaillée de syncUser()
- Où et quand appeler syncUser()
- Le schéma de base de données
- Gestion des mises à jour
- Avantages de cette architecture

**Concepts clés :**
- Webhooks vs Upsert
- Idempotence
- server-only protection
- Découplage id / clerkId
- Route /welcome

### [05 - Quiz Questions](./05-QUIZ-QUESTIONS(OBLIGATOIRE).md)
**Durée : 30 minutes**
- 20 questions à choix multiples
- 5 sections thématiques
- Format sans les réponses

### [06 - Quiz Réponses](./06-QUIZ-REPONSES(OBLIGATOIRE).md)
- Corrections détaillées
- Explications pour chaque question
- Barème de notation

### [07 - Exercices](./07-EXERCICES(OPTIONNEL).md)
**Durée : 2-3 heures**
- 5 exercices pratiques
- 5 questions ouvertes de réflexion
- Critères d'évaluation détaillés

**Sections du quiz :**
1. Concepts Fondamentaux (4 questions)
2. Clerk (3 questions)
3. Prisma (4 questions)
4. Synchronisation (5 questions)
5. Architecture Globale (4 questions)

**Exercices pratiques :**
1. Analyse de flux utilisateur
2. Ajout d'un champ au profil
3. Gestion d'erreur améliorée
4. Optimisation de pagination
5. Migration vers Webhooks

## Progression recommandée

### Parcours Standard (4 heures)
1. Lire tous les modules dans l'ordre
2. Prendre des notes sur les concepts clés
3. Faire le quiz
4. Réaliser les exercices pratiques
5. Réfléchir aux questions ouvertes

### Parcours Rapide (2 heures)
1. Lire les modules 01, 02, 04
2. Survol des modules 03 et 05
3. Faire uniquement le quiz

### Parcours Expert (1 heure)
1. Lire uniquement les sections "Concepts clés"
2. Faire les exercices pratiques
3. Répondre aux questions ouvertes

## Critères de réussite

Après ce cours, vous devriez pouvoir :

- Expliquer pourquoi Clerk existe et quels problèmes il résout
- Décrire le flux complet d'une authentification utilisateur
- Comprendre le rôle d'un ORM comme Prisma
- Implémenter une synchronisation Clerk-Prisma
- Faire des choix architecturaux éclairés (Webhooks vs Upsert, Clerk vs NextAuth)
- Identifier les bonnes pratiques de sécurité
- Déboguer les problèmes courants

## Ressources complémentaires

### Dans ce projet
- `documentation-1/` - Guides d'installation et comparaisons
- `troubleshooting/` - Solutions aux problèmes courants
- `README.md` - Documentation générale
- Code source dans `app/`, `lib/`, `prisma/`

### Documentation officielle
- [Clerk Documentation](https://clerk.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)

## Notation du quiz

**Total : 100 points**
- Quiz : 40 points (20 questions x 2 points)
- Exercices pratiques : 30 points (5 exercices x 6 points)
- Questions ouvertes : 30 points (5 questions x 6 points)

**Barème :**
- 90-100 : Excellente maîtrise
- 75-89 : Bonne compréhension
- 60-74 : Compréhension satisfaisante
- 50-59 : Compréhension partielle
- <50 : Révision nécessaire

## Notes pédagogiques

Ce cours utilise une approche narrative pour faciliter la compréhension. Plutôt que de simplement lister des commandes ou du code, chaque module explique :

- **Le problème** : Pourquoi ce concept existe
- **Les solutions** : Comment on peut le résoudre
- **Le choix** : Pourquoi cette solution spécifique
- **L'implémentation** : Comment ça fonctionne concrètement
- **Les alternatives** : Ce qu'on aurait pu faire d'autre

Cette méthodologie développe une compréhension profonde plutôt qu'une simple mémorisation.

## Commence par : [00-INTRODUCTION.md](./00-INTRODUCTION.md)


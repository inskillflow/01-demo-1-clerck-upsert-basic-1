# Cours : Webhooks et Synchronisation Temps Réel

## Introduction

Ce cours explore l'architecture de synchronisation par webhooks entre Clerk et votre base de données. Contrairement à l'approche upsert post-login, les webhooks permettent une synchronisation en temps réel automatique sans intervention de l'utilisateur.

## Objectifs d'apprentissage

À la fin de ce cours, vous serez capable de :

1. Comprendre le concept de webhook et son fonctionnement
2. Implémenter un endpoint webhook sécurisé avec Clerk
3. Gérer les différents événements utilisateur (create, update, delete)
4. Vérifier les signatures cryptographiques avec Svix
5. Comparer webhooks et upsert pour faire des choix architecturaux
6. Gérer les cas d'erreur et les retries automatiques

## Structure du cours

**Module 1 : Comprendre les Webhooks** - Concept fondamental et cas d'usage

**Module 2 : Webhooks avec Clerk** - Architecture spécifique et événements

**Module 3 : Implémentation Pratique** - Code complet d'un endpoint webhook

**Module 4 : Scénarios Réels** - Cas d'usage concrets et exemples

**Module 5 : Quiz (obligatoire) et Exercices (optionnel)** - Validation des acquis

## Prérequis

- Avoir suivi le cours examen-1 (ou comprendre Clerk + Prisma)
- JavaScript/TypeScript intermédiaire
- Notions de HTTP et API REST
- Compréhension des signatures cryptographiques (sera expliqué)

## Méthodologie

Ce cours adopte la même approche narrative qu'examen-1. Nous expliquons le "pourquoi" avant le "comment", avec des scénarios réels et des explications détaillées plutôt que du code brut.

## Le problème à résoudre

Avec l'approche upsert, la synchronisation ne se fait qu'à la connexion de l'utilisateur. Mais que se passe-t-il si :

- Un administrateur modifie le profil d'un utilisateur depuis Clerk Dashboard
- Un utilisateur supprime son compte
- Vous devez envoyer un email de bienvenue immédiatement après inscription
- Plusieurs applications doivent être synchronisées avec Clerk

Les webhooks résolvent ces problèmes en permettant à Clerk de notifier votre application instantanément à chaque modification.

---

Passez au Module 1 : [01-CONCEPT-WEBHOOKS.md](./01-CONCEPT-WEBHOOKS.md)


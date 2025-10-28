# Cours : JWT - JSON Web Tokens

## Introduction

Ce cours explique en profondeur les JWT (JSON Web Tokens), leur fonctionnement, leur structure, et leur utilisation dans les applications modernes. Les JWT sont au cœur de l'authentification moderne, utilisés par Clerk, NextAuth, et la plupart des systèmes d'authentification actuels.

## Objectifs d'apprentissage

À la fin de ce cours, vous serez capable de :

1. Comprendre la structure complète d'un JWT (header, payload, signature)
2. Expliquer comment fonctionne la signature cryptographique
3. Créer et vérifier des JWT manuellement
4. Identifier les cas d'usage appropriés pour les JWT
5. Reconnaître les vulnérabilités et bonnes pratiques de sécurité
6. Comparer JWT avec les sessions traditionnelles
7. Implémenter des JWT dans Next.js sans bibliothèque

## Structure du cours

**Module 1 : Fondations JWT** - Qu'est-ce qu'un JWT et pourquoi il existe

**Module 2 : Anatomie d'un JWT** - Structure détaillée (header, payload, signature)

**Module 3 : Cryptographie et Signature** - Comment la signature fonctionne

**Module 4 : JWT vs Sessions** - Comparaison avec l'authentification traditionnelle

**Module 5 : Sécurité des JWT** - Vulnérabilités et bonnes pratiques

**Module 6 : Implémentation Pratique** - Créer des JWT dans Next.js

**Module 7 : Comparaison des Approches** - JWT vs Clerk vs NextAuth : quelle est la meilleure approche ?

## Prérequis

- JavaScript de base
- Notions de HTTP et cookies
- Compréhension générale de l'authentification
- Avoir suivi examen-1 recommandé (contexte Clerk)

## Méthodologie

Approche narrative avec explications détaillées. Nous allons déconstruire un JWT byte par byte pour comprendre exactement comment il fonctionne, puis explorer les implications pratiques.

## Le problème à résoudre

Dans les applications web modernes, comment prouver qu'un utilisateur est authentifié sans stocker sa session côté serveur ? Comment permettre à plusieurs serveurs de vérifier l'identité d'un utilisateur sans base de données partagée ?

Les JWT résolvent ces problèmes en créant des tokens auto-contenus et vérifiables qui ne nécessitent aucune coordination serveur.

---

Passez au Module 1 : [01-FONDATIONS-JWT(COURS).md](./01-FONDATIONS-JWT(COURS).md)


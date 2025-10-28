# Cours : Validation avec Zod

## Introduction

Ce cours explique en profondeur Zod, la bibliothèque de validation TypeScript-first. Zod permet de valider les données côté serveur et client, de créer des schémas type-safe, et de protéger votre application contre les données invalides ou malveillantes.

## Objectifs d'apprentissage

À la fin de ce cours, vous serez capable de :

1. Comprendre pourquoi la validation est critique en développement web
2. Créer des schémas Zod pour valider tout type de données
3. Valider des formulaires côté client et serveur
4. Intégrer Zod avec React Hook Form
5. Valider des API routes Next.js
6. Gérer les erreurs de validation de manière élégante
7. Créer des schémas réutilisables et composables

## Structure du cours

**Module 1 : Pourquoi la Validation** - Importance et risques sans validation

**Module 2 : Fondations Zod** - Installation, premiers schémas, concepts de base

**Module 3 : Schémas Avancés** - Types complexes, transformations, refinements

**Module 4 : Validation Formulaires** - Client et serveur, React Hook Form

**Module 5 : Validation API Routes** - Protéger vos endpoints Next.js

**Module 6 : Patterns Avancés** - Schémas réutilisables, composition, inférence de types

## Prérequis

- TypeScript de base
- Compréhension des formulaires web
- Next.js (avoir suivi examen-1 recommandé)
- Notion de validation (sera approfondi)

## Méthodologie

Approche narrative progressive. Nous commençons par comprendre pourquoi la validation est critique, puis explorons Zod en profondeur avec des exemples concrets et du code réutilisable.

## Le problème à résoudre

Sans validation appropriée, votre application est vulnérable :
- Données corrompues dans la base de données
- Injections SQL ou NoSQL
- Attaques XSS via données non sanitisées
- Crashes applicatifs sur données inattendues
- Perte de confiance des utilisateurs

Zod résout ces problèmes en fournissant une validation type-safe, expressive, et facile à maintenir.

---

Passez au Module 1 : [01-POURQUOI-VALIDATION(COURS).md](./01-POURQUOI-VALIDATION(COURS).md)


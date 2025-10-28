# Index du Cours : Validation avec Zod

## Vue d'ensemble

Ce cours complet explique la validation de données avec Zod, la bibliothèque TypeScript-first pour valider formulaires, API routes, et configuration. Durée estimée : 4-5 heures.

## Modules de cours

### [00 - Introduction](./00-INTRODUCTION(COURS).md)
**Durée : 10 minutes**
- Objectifs d'apprentissage
- Structure du cours
- Prérequis
- Le problème à résoudre

### [01 - Pourquoi la Validation](./01-POURQUOI-VALIDATION(COURS).md)
**Durée : 40 minutes**
- Le mythe de la validation client
- Pourquoi la validation client ne suffit pas
- Les risques sans validation serveur
- Le principe fondamental
- La solution : validation serveur systématique
- Pourquoi Zod spécifiquement

**Concepts clés :**
- Ne jamais faire confiance au client
- Validation client = UX, serveur = sécurité
- Injections, XSS, corruption de données
- Type-safety avec TypeScript

### [02 - Fondations Zod](./02-FONDATIONS-ZOD(COURS).md)
**Durée : 50 minutes**
- Installation
- Premiers schémas (string, number, boolean, date)
- parse() vs safeParse()
- Contraintes sur les types
- String avec transformations
- Objets et schémas complexes
- Champs optionnels, nullable, nullish
- Valeurs par défaut
- Arrays et enums

**Concepts clés :**
- z.string(), z.number(), z.object()
- safeParse() pour gestion d'erreurs
- optional(), nullable(), default()
- z.infer<typeof schema>

### [03 - Schémas Avancés](./03-SCHEMAS-AVANCES(COURS).md)
**Durée : 50 minutes**
- Refinements avec refine()
- Validation entre champs
- Validation asynchrone
- Transformations complexes
- Coercion (z.coerce)
- Schémas réutilisables et composition
- pick(), omit(), partial(), required()

**Concepts clés :**
- refine() pour logique custom
- transform() pour normalisation
- z.coerce pour conversion de types
- Composition de schémas

### [04 - Validation Formulaires](./04-VALIDATION-FORMULAIRES(COURS).md)
**Durée : 50 minutes**
- Validation côté client
- Formulaire simple avec Zod
- Intégration React Hook Form
- zodResolver
- Affichage des erreurs
- Validation temps réel vs onSubmit

**Concepts clés :**
- React Hook Form + Zod
- zodResolver de @hookform/resolvers
- error.flatten().fieldErrors
- Mode de validation configurable

### [05 - Validation API Routes](./05-VALIDATION-API(COURS).md)
**Durée : 45 minutes**
- Valider les données d'une requête
- API route avec validation complète
- Middleware de validation réutilisable
- Codes HTTP appropriés (400, 409, 500)
- Retourner les erreurs de validation

**Concepts clés :**
- Validation avant toute opération
- Status 400 pour données invalides
- Middleware withValidation
- Sécurité API

### [06 - Patterns Avancés](./06-PATTERNS-AVANCES(COURS).md)
**Durée : 40 minutes**
- Schémas Prisma + Zod synchronisés
- Validation des variables d'environnement
- Inférence de types avancée
- Schémas conditionnels
- Bibliothèque de schémas partagée

**Concepts clés :**
- Sync Prisma + Zod
- Validation de process.env
- Type inference
- Code DRY et réutilisable

### [07 - Quiz Questions](./07-QUIZ-QUESTIONS(OBLIGATOIRE).md)
**Durée : 30 minutes**
- 25 questions à choix multiples
- 5 sections thématiques
- Format sans les réponses

### [08 - Quiz Réponses](./08-QUIZ-REPONSES(OBLIGATOIRE).md)
- Corrections détaillées
- Explications approfondies
- Barème de notation

### [09 - Exercices](./09-EXERCICES(OPTIONNEL).md)
**Durée : 4-5 heures**
- 4 exercices pratiques
- 2 questions ouvertes
- Critères d'évaluation détaillés

## Progression recommandée

### Parcours Standard (5 heures)
1. Lire tous les modules dans l'ordre (00 → 06)
2. Faire le quiz (07-08)
3. Réaliser au moins 2 exercices pratiques

### Parcours Pratique (3 heures)
1. Modules 02, 04, 05 (fondations + formulaires + API)
2. Quiz uniquement
3. Exercice 2 (formulaire complet)

### Parcours Expert (1 heure)
1. Module 06 (patterns avancés)
2. Exercices pratiques uniquement

## Critères de réussite

Après ce cours, vous devriez pouvoir :

- Expliquer pourquoi la validation serveur est critique
- Créer des schémas Zod pour tout type de données
- Valider des formulaires avec React Hook Form + Zod
- Protéger les API routes avec validation Zod
- Utiliser refine() et transform() pour logique complexe
- Créer une bibliothèque de schémas réutilisables
- Inférer les types TypeScript depuis les schémas
- Gérer et afficher les erreurs de validation

## Lien avec les autres examens

### Examen-1 à 6
Tous peuvent bénéficier de Zod pour valider les données.

### Applications concrètes
- Validation des formulaires signup/signin
- Validation des API routes de profil
- Validation des webhooks Clerk
- Validation des query params
- Validation de la configuration

## Ressources complémentaires

### Documentation officielle
- [Zod Documentation](https://zod.dev/)
- [React Hook Form](https://react-hook-form.com/)
- [Zod + React Hook Form](https://react-hook-form.com/get-started#SchemaValidation)

## Notation du quiz

**Total : 50 points**
- Quiz : 50 points (25 questions × 2 points)

**Barème :**
- 45-50 : Excellente maîtrise de Zod
- 38-44 : Bonne compréhension
- 30-37 : Compréhension satisfaisante
- 25-29 : Révision recommandée
- <25 : Révision nécessaire

## Commence par : [00-INTRODUCTION(COURS).md](./00-INTRODUCTION(COURS).md)

Ou pour les bases directement : [02-FONDATIONS-ZOD(COURS).md](./02-FONDATIONS-ZOD(COURS).md)


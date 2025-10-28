# Examen 7 : Validation avec Zod

## Description

Ce cours complet explique la validation de données avec Zod, la bibliothèque TypeScript-first. Apprenez à protéger votre application contre les données invalides, les injections, et les attaques.

## Contenu

### Cours (6 modules)

**[00-INTRODUCTION(COURS).md](./00-INTRODUCTION(COURS).md)** - Présentation et objectifs

**[01-POURQUOI-VALIDATION(COURS).md](./01-POURQUOI-VALIDATION(COURS).md)** - Importance critique de la validation serveur

**[02-FONDATIONS-ZOD(COURS).md](./02-FONDATIONS-ZOD(COURS).md)** - Installation, premiers schémas, types de base

**[03-SCHEMAS-AVANCES(COURS).md](./03-SCHEMAS-AVANCES(COURS).md)** - Refinements, transformations, composition

**[04-VALIDATION-FORMULAIRES(COURS).md](./04-VALIDATION-FORMULAIRES(COURS).md)** - React Hook Form + Zod

**[05-VALIDATION-API(COURS).md](./05-VALIDATION-API(COURS).md)** - Protéger les API routes Next.js

**[06-PATTERNS-AVANCES(COURS).md](./06-PATTERNS-AVANCES(COURS).md)** - Schémas réutilisables, validation environnement

### Évaluation

**[07-QUIZ-QUESTIONS(OBLIGATOIRE).md](./07-QUIZ-QUESTIONS(OBLIGATOIRE).md)** - 25 questions à choix multiples

**[08-QUIZ-REPONSES(OBLIGATOIRE).md](./08-QUIZ-REPONSES(OBLIGATOIRE).md)** - Corrections avec explications

**[09-EXERCICES(OPTIONNEL).md](./09-EXERCICES(OPTIONNEL).md)** - 4 exercices pratiques + 2 questions ouvertes

### Navigation

**[INDEX.md](./INDEX.md)** - Index complet avec vue d'ensemble et progression recommandée

## Thème central : Sécurité par la Validation

**Principe fondamental :** Ne jamais faire confiance aux données venant du client.

**Solution :** Validation systématique côté serveur avec Zod.

## Pourquoi Zod ?

- **Type-safety** : Génère automatiquement les types TypeScript
- **Expressif** : Syntaxe chainable et lisible
- **Flexible** : Validation simple à complexe
- **Messages personnalisables** : Erreurs en français
- **Transformations** : Normalise les données automatiquement

## Sujets couverts

### Bases
- Types primitifs (string, number, boolean, date)
- Contraintes (.min, .max, .email, .url, .regex)
- Optional, nullable, default
- Arrays et enums

### Avancé
- refine() pour validations custom
- transform() pour normalisation
- Validation asynchrone
- Validation entre champs
- z.coerce pour conversion de types

### Pratique
- React Hook Form + zodResolver
- Validation API routes Next.js
- Middleware réutilisable
- Variables d'environnement
- Schémas composables

## Comment utiliser ce cours

1. **Prérequis :** TypeScript de base, React/Next.js
2. Commencez par [INDEX.md](./INDEX.md)
3. Module 01 explique POURQUOI (critique)
4. Modules 02-06 expliquent COMMENT
5. Testez avec le quiz (07-08)
6. Pratiquez avec les exercices (09)

## Durée estimée

- **Lecture complète :** 4-5 heures
- **Quiz :** 30 minutes
- **Exercices :** 4-5 heures
- **Total :** 8-11 heures pour maîtrise complète

## Public cible

- Tous les développeurs Next.js/React
- Personnes construisant des API
- Développeurs soucieux de sécurité
- Équipes voulant standardiser la validation
- Débutants en validation type-safe

## Prérequis

- TypeScript de base
- React (formulaires)
- Next.js (API routes)
- Notion de validation (sera approfondi)

## Objectifs d'apprentissage

Après ce cours, vous serez capable de :

1. Comprendre les risques sans validation serveur
2. Créer des schémas Zod pour tout type de données
3. Valider des formulaires avec React Hook Form + Zod
4. Protéger les API routes avec validation systématique
5. Utiliser refine() et transform() pour logique métier
6. Créer une bibliothèque de schémas réutilisables
7. Inférer les types TypeScript automatiquement
8. Valider les variables d'environnement

## Applications dans les autres examens

**Examen-1, 2, 3 :** Valider les formulaires signin/signup
**Examen-2 :** Valider les payloads de webhooks
**Examen-6 :** Valider tous les formulaires créés
**Tous :** Protéger toutes les API routes

## Points clés

### Règle d'or
**Valider côté client pour l'UX, valider côté serveur pour la sécurité**

### Pattern type-safe
```typescript
const schema = z.object({ email: z.string().email() })
type Data = z.infer<typeof schema>
// Un schéma = validation + types
```

### Validation API
```typescript
const result = schema.safeParse(await request.json())
if (!result.success) {
  return NextResponse.json({ error: result.error }, { status: 400 })
}
// Données validées et typées dans result.data
```

## Commence par : [00-INTRODUCTION(COURS).md](./00-INTRODUCTION(COURS).md)

Ou pour comprendre l'importance : [01-POURQUOI-VALIDATION(COURS).md](./01-POURQUOI-VALIDATION(COURS).md)


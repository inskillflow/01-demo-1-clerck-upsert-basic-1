# Module 2 : Fondations Zod

## Installation

Zod est une dépendance zero-config qui s'installe simplement.

```bash
npm install zod
```

C'est tout. Aucune configuration supplémentaire nécessaire.

## Premiers schémas

Commençons par les types de base que Zod peut valider.

### Types primitifs

```typescript
import { z } from 'zod'

// String
const nameSchema = z.string()
nameSchema.parse("John") // ✓ Passe
nameSchema.parse(123)    // ✗ Lance une erreur

// Number
const ageSchema = z.number()
ageSchema.parse(25)      // ✓
ageSchema.parse("25")    // ✗

// Boolean
const isActiveSchema = z.boolean()
isActiveSchema.parse(true)  // ✓
isActiveSchema.parse("true") // ✗

// Date
const dateSchema = z.date()
dateSchema.parse(new Date()) // ✓
dateSchema.parse("2024-01-01") // ✗ (string, pas Date)

// Undefined / Null
const undefinedSchema = z.undefined()
const nullSchema = z.null()
```

Zod est strict par défaut. `z.number()` accepte uniquement des nombres, pas des chaînes qui ressemblent à des nombres.

### Méthodes de validation

Deux façons de valider des données avec Zod :

**parse() - Lance une exception si invalide**
```typescript
const schema = z.string()

try {
  const result = schema.parse("hello") // Retourne "hello"
  console.log(result)
} catch (error) {
  console.error('Validation failed:', error)
}
```

Utilisez `parse()` quand vous êtes sûr que les données sont valides et voulez une exception en cas de problème.

**safeParse() - Retourne un objet result**
```typescript
const schema = z.string()

const result = schema.safeParse("hello")

if (result.success) {
  console.log(result.data) // "hello"
} else {
  console.error(result.error) // Détails de l'erreur
}
```

Utilisez `safeParse()` pour gérer les erreurs de manière programmatique sans try-catch.

## Contraintes sur les types

Ajoutons des contraintes aux types de base.

### String avec contraintes

```typescript
const emailSchema = z.string().email()
const urlSchema = z.string().url()
const uuidSchema = z.string().uuid()

const usernameSchema = z.string()
  .min(3, 'Minimum 3 caractères')
  .max(20, 'Maximum 20 caractères')
  .regex(/^[a-zA-Z0-9_]+$/, 'Lettres, chiffres et underscore uniquement')

const phoneSchema = z.string()
  .regex(/^0[1-9]\d{8}$/, 'Numéro de téléphone français invalide')
```

Chaque méthode ajoute une contrainte. Si une contrainte échoue, la validation échoue avec le message spécifié.

### Number avec contraintes

```typescript
const ageSchema = z.number()
  .int('Doit être un entier')
  .min(18, 'Vous devez avoir au moins 18 ans')
  .max(120, 'Âge invalide')

const priceSchema = z.number()
  .positive('Le prix doit être positif')
  .max(999999, 'Prix trop élevé')

const ratingSchema = z.number()
  .min(1)
  .max(5)
  .int()
```

### String avec transformations

```typescript
const emailSchema = z.string()
  .email()
  .toLowerCase()  // Normalise en minuscules
  .trim()         // Supprime espaces début/fin

emailSchema.parse(" JOHN@EXAMPLE.COM ") 
// Retourne: "john@example.com"
```

Les transformations sont appliquées après validation réussie.

## Objets et schémas complexes

Les schémas d'objets sont au cœur de la validation avec Zod.

### Objet basique

```typescript
const userSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  age: z.number().min(18)
})

// Validation
const result = userSchema.safeParse({
  name: "John Doe",
  email: "john@example.com",
  age: 25
})

if (result.success) {
  console.log(result.data.name) // TypeScript sait que name est string
}
```

### Champs optionnels

```typescript
const userSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  bio: z.string().optional(),        // Peut être undefined
  phone: z.string().nullable(),      // Peut être null
  website: z.string().nullish(),     // Peut être null OU undefined
})

type User = z.infer<typeof userSchema>
// {
//   name: string
//   email: string
//   bio?: string | undefined
//   phone: string | null
//   website?: string | null | undefined
// }
```

### Valeurs par défaut

```typescript
const settingsSchema = z.object({
  theme: z.string().default('light'),
  language: z.string().default('fr'),
  notifications: z.boolean().default(true)
})

settingsSchema.parse({})
// Retourne: { theme: 'light', language: 'fr', notifications: true }
```

Les valeurs par défaut sont appliquées si le champ est absent.

## Arrays et enums

Valider des listes et des valeurs énumérées.

### Arrays

```typescript
const tagsSchema = z.array(z.string())
tagsSchema.parse(['react', 'nextjs', 'typescript']) // ✓

const numbersSchema = z.array(z.number()).min(1).max(10)
numbersSchema.parse([1, 2, 3]) // ✓
numbersSchema.parse([])        // ✗ Minimum 1 élément

const usersSchema = z.array(
  z.object({
    id: z.string(),
    name: z.string()
  })
)
```

### Enums

```typescript
const roleSchema = z.enum(['user', 'admin', 'moderator'])
roleSchema.parse('admin')     // ✓
roleSchema.parse('superuser') // ✗ Pas dans l'enum

// Avec const pour inférence
const ROLES = ['user', 'admin', 'moderator'] as const
const roleSchema = z.enum(ROLES)

type Role = z.infer<typeof roleSchema>
// 'user' | 'admin' | 'moderator'
```

### Unions

Valider plusieurs types possibles :

```typescript
const idSchema = z.union([
  z.string(),
  z.number()
])

idSchema.parse("abc123") // ✓
idSchema.parse(123)      // ✓
idSchema.parse(true)     // ✗

// Syntaxe raccourcie
const idSchema = z.string().or(z.number())
```

## Gestion des erreurs

Comprendre les erreurs Zod pour les afficher correctement.

### Structure d'une erreur

```typescript
const schema = z.object({
  email: z.string().email(),
  age: z.number().min(18)
})

const result = schema.safeParse({
  email: "invalid",
  age: 15
})

if (!result.success) {
  console.log(result.error.errors)
  /*
  [
    {
      code: 'invalid_string',
      path: ['email'],
      message: 'Invalid email'
    },
    {
      code: 'too_small',
      path: ['age'],
      minimum: 18,
      message: 'Number must be greater than or equal to 18'
    }
  ]
  */
}
```

Chaque erreur a :
- **code** : Type d'erreur
- **path** : Chemin vers le champ invalide
- **message** : Message d'erreur
- Métadonnées supplémentaires selon le type

### Formater les erreurs

Pour afficher les erreurs dans un formulaire :

```typescript
const result = schema.safeParse(formData)

if (!result.success) {
  const errors = result.error.flatten()
  
  console.log(errors.fieldErrors)
  /*
  {
    email: ['Invalid email'],
    age: ['Number must be greater than or equal to 18']
  }
  */
}
```

La méthode `flatten()` organise les erreurs par champ, parfait pour les afficher dans les formulaires.

---

Passez au Module 3 : [03-SCHEMAS-AVANCES(COURS).md](./03-SCHEMAS-AVANCES(COURS).md)


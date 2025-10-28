# Module 3 : Schémas Avancés

## Refinements : Validations personnalisées

Les refinements permettent d'ajouter des règles de validation arbitrairement complexes.

### Validation simple avec refine

```typescript
const passwordSchema = z.string()
  .min(8)
  .refine((val) => /[A-Z]/.test(val), {
    message: 'Doit contenir au moins une majuscule'
  })
  .refine((val) => /[0-9]/.test(val), {
    message: 'Doit contenir au moins un chiffre'
  })
```

La fonction passée à `refine()` doit retourner `true` pour valide, `false` pour invalide.

### Validation entre champs

Valider que deux champs correspondent :

```typescript
const signupSchema = z.object({
  password: z.string().min(8),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'] // Attache l'erreur à confirmPassword
})
```

### Validation asynchrone

Pour des validations nécessitant des requêtes (vérifier si email existe déjà) :

```typescript
const emailSchema = z.string()
  .email()
  .refine(async (email) => {
    const existing = await prisma.user.findUnique({
      where: { email }
    })
    return !existing // True si n'existe pas
  }, {
    message: 'Cet email est déjà utilisé'
  })

// Utilisation avec parseAsync
const result = await emailSchema.safeParseAsync('test@example.com')
```

## Transformations complexes

Modifier les données après validation.

### Transform avec logique métier

```typescript
const userInputSchema = z.object({
  email: z.string().email().transform(email => email.toLowerCase().trim()),
  birthdate: z.string().transform(dateStr => new Date(dateStr)),
  tags: z.string().transform(str => str.split(',').map(t => t.trim()))
})

// Input
{
  email: " JOHN@EXAMPLE.COM ",
  birthdate: "1990-01-15",
  tags: "react, nextjs, typescript"
}

// Output après validation et transformation
{
  email: "john@example.com",
  birthdate: Date(1990-01-15),
  tags: ["react", "nextjs", "typescript"]
}
```

### Coercion : Convertir automatiquement les types

```typescript
const numberSchema = z.coerce.number()
numberSchema.parse("123")  // Retourne 123 (number)
numberSchema.parse("abc")  // Erreur (impossible de convertir)

const booleanSchema = z.coerce.boolean()
booleanSchema.parse("true")  // Retourne true (boolean)
booleanSchema.parse("1")     // Retourne true
booleanSchema.parse("0")     // Retourne false
```

Utile pour les query params ou form data qui sont toujours des strings.

## Schémas réutilisables et composition

Créez des schémas de base et composez-les.

### Bibliothèque de schémas

```typescript
// lib/schemas.ts

// Schémas de base réutilisables
export const emailSchema = z.string()
  .email('Email invalide')
  .toLowerCase()
  .trim()

export const passwordSchema = z.string()
  .min(8, 'Minimum 8 caractères')
  .regex(/[A-Z]/, 'Au moins une majuscule')
  .regex(/[0-9]/, 'Au moins un chiffre')
  .regex(/[^A-Za-z0-9]/, 'Au moins un caractère spécial')

export const usernameSchema = z.string()
  .min(3, 'Minimum 3 caractères')
  .max(20, 'Maximum 20 caractères')
  .regex(/^[a-zA-Z0-9_]+$/, 'Lettres, chiffres et underscore uniquement')

export const phoneSchema = z.string()
  .regex(/^0[1-9]\d{8}$/, 'Numéro français invalide')
  .optional()

// Schémas composés
export const signupSchema = z.object({
  username: usernameSchema,
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword']
})

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Mot de passe requis')
})

export const profileSchema = z.object({
  username: usernameSchema,
  bio: z.string().max(500, 'Maximum 500 caractères').optional(),
  website: z.string().url('URL invalide').optional(),
  phone: phoneSchema
})
```

Réutilisez ces schémas partout dans votre application.

## Pick, Omit, Partial, Required

Dériver de nouveaux schémas depuis des schémas existants.

```typescript
const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string(),
  bio: z.string().optional()
})

// Pick : Sélectionner certains champs
const publicUserSchema = userSchema.pick({
  id: true,
  name: true,
  bio: true
})

// Omit : Exclure certains champs
const userWithoutPasswordSchema = userSchema.omit({
  password: true
})

// Partial : Tous les champs deviennent optionnels
const updateUserSchema = userSchema.partial()

// Required : Tous les champs deviennent obligatoires
const strictUserSchema = userSchema.required()
```

Très utile pour créer des variantes de schémas sans duplication.

---

Passez au Module 4 : [04-VALIDATION-FORMULAIRES(COURS).md](./04-VALIDATION-FORMULAIRES(COURS).md)


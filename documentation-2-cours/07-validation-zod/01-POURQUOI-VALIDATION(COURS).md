# Module 1 : Pourquoi la Validation est Critique

## Le mythe de la validation client

Beaucoup de développeurs débutants pensent que valider un formulaire avec HTML ou JavaScript côté client suffit. C'est une idée dangereuse.

### L'illusion de sécurité

Imaginons un formulaire d'inscription simple :

```html
<form>
  <input type="email" required />
  <input type="password" minlength="8" required />
  <button type="submit">S'inscrire</button>
</form>
```

Le navigateur valide que l'email a le bon format et que le password a au moins 8 caractères. Le formulaire ne peut pas être soumis si les données sont invalides. Problème résolu ?

**Non. Absolument pas.**

### Pourquoi la validation client n'est pas suffisante

N'importe qui peut contourner la validation client en quelques secondes.

**Méthode 1 : Désactiver JavaScript**
Si l'utilisateur désactive JavaScript dans son navigateur, toute validation JavaScript ne s'exécute pas. Seule la validation HTML reste, mais elle peut être contournée.

**Méthode 2 : Modifier le HTML**
Ouvrez les DevTools (F12), trouvez le champ input, supprimez l'attribut `required` ou `minlength`. La validation disparaît.

**Méthode 3 : Envoyer directement avec curl ou Postman**
```bash
curl -X POST https://votre-site.com/api/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"invalid","password":"a"}'
```

Votre API reçoit ces données invalides directement, sans passer par le formulaire HTML ou le JavaScript de validation.

### Le principe fondamental

**Ne jamais faire confiance aux données venant du client.**

Même si votre formulaire a une validation parfaite, même si votre JavaScript vérifie tout, considérez toujours que les données arrivant au serveur peuvent être n'importe quoi.

## Les risques sans validation serveur

Voyons concrètement ce qui peut se passer sans validation côté serveur.

### Risque 1 : Corruption de base de données

Sans validation, des données incorrectes entrent dans votre base :

```typescript
// API sans validation
const { name, email, age } = await request.json()

await prisma.user.create({
  data: { name, email, age }
})
```

Un attaquant envoie :
```json
{
  "name": "",
  "email": "not-an-email",
  "age": "abc"
}
```

Résultat : Utilisateur créé avec nom vide, email invalide, age non-numérique. Votre base de données contient des données corrompues qui causeront des bugs partout.

### Risque 2 : Crashes applicatifs

Votre code suppose que certaines données ont un format spécifique :

```typescript
const user = await prisma.user.findUnique({ where: { email } })
const domain = user.email.split('@')[1]
```

Si email est `null` ou une chaîne vide, `split('@')` plante. Votre application crash.

### Risque 3 : Injections

Sans validation, des attaquants peuvent injecter du code malveillant :

```typescript
// Dangereux sans validation
const { searchTerm } = await request.json()
const users = await prisma.$queryRaw`
  SELECT * FROM users WHERE name LIKE '%${searchTerm}%'
`
```

Un attaquant envoie :
```json
{
  "searchTerm": "'; DROP TABLE users; --"
}
```

Résultat : Injection SQL potentielle qui pourrait supprimer votre table users.

**Note :** Prisma protège contre les injections SQL avec ses méthodes normales, mais si vous utilisez `$queryRaw`, la validation est critique.

### Risque 4 : Attaques XSS

Des données non validées affichées dans l'UI peuvent exécuter du JavaScript malveillant :

```typescript
// Dangereux
const { bio } = await request.json()
await prisma.user.update({
  where: { id },
  data: { bio }
})

// Plus tard, affiché dans une page
<div dangerouslySetInnerHTML={{ __html: user.bio }} />
```

Un attaquant met :
```json
{
  "bio": "<script>alert('XSS')</script>"
}
```

Quand un autre utilisateur visite le profil, le script s'exécute dans son navigateur.

### Risque 5 : Déni de service (DoS)

Sans validation de taille, un attaquant peut surcharger votre serveur :

```typescript
// Sans validation de taille
const { content } = await request.json()
await prisma.post.create({
  data: { content }
})
```

Un attaquant envoie :
```json
{
  "content": "a".repeat(10000000) // 10 millions de caractères
}
```

Votre base de données essaie de stocker 10 MB de texte. Multipliez par 1000 requêtes et votre serveur s'effondre.

## La solution : Validation serveur systématique

La règle d'or du développement web sécurisé :

**Toujours valider côté serveur, même si vous validez aussi côté client.**

La validation client améliore l'UX (feedback immédiat), mais la validation serveur assure la sécurité.

### Validation en couches

**Couche 1 : Validation HTML (UX basique)**
```html
<input type="email" required minlength="8" />
```

**Couche 2 : Validation JavaScript client (UX améliorée)**
```typescript
if (!email.includes('@')) {
  setError('Email invalide')
}
```

**Couche 3 : Validation serveur (SÉCURITÉ)**
```typescript
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})

const result = schema.safeParse(body)
if (!result.success) {
  return Response.json({ error: result.error }, { status: 400 })
}
```

Seule la couche 3 est incontournable pour la sécurité. Les couches 1 et 2 améliorent l'expérience mais ne protègent pas.

## Pourquoi Zod spécifiquement ?

Il existe plusieurs bibliothèques de validation. Pourquoi choisir Zod ?

### Type-safety avec TypeScript

Zod génère automatiquement des types TypeScript depuis vos schémas.

```typescript
const userSchema = z.object({
  email: z.string().email(),
  age: z.number().min(18)
})

type User = z.infer<typeof userSchema>
// TypeScript sait que User = { email: string, age: number }
```

Pas besoin de définir les types manuellement. Un schéma Zod = validation + types.

### Syntaxe expressive et chainable

```typescript
z.string()
  .min(3, 'Minimum 3 caractères')
  .max(50, 'Maximum 50 caractères')
  .regex(/^[a-zA-Z]+$/, 'Lettres uniquement')
  .transform(s => s.toLowerCase())
```

Lisible et expressif. Chaque méthode retourne un nouveau schéma, permettant le chaînage.

### Messages d'erreur personnalisables

```typescript
z.string().email('Veuillez entrer un email valide')
z.number().min(18, 'Vous devez avoir au moins 18 ans')
```

Messages en français, adaptés à votre contexte métier.

### Transformations incluses

Zod peut non seulement valider, mais aussi transformer les données :

```typescript
const schema = z.object({
  email: z.string().email().toLowerCase().trim(),
  age: z.string().transform(s => parseInt(s))
})

// Input: { email: " JOHN@EXAMPLE.COM ", age: "25" }
// Output: { email: "john@example.com", age: 25 }
```

Normalisation automatique des données.

### Raffinements personnalisés

Pour des validations métier complexes :

```typescript
const passwordSchema = z.string()
  .min(8)
  .refine((password) => /[A-Z]/.test(password), {
    message: 'Doit contenir au moins une majuscule'
  })
  .refine((password) => /[0-9]/.test(password), {
    message: 'Doit contenir au moins un chiffre'
  })
  .refine((password) => /[^A-Za-z0-9]/.test(password), {
    message: 'Doit contenir au moins un caractère spécial'
  })
```

Logique de validation arbitrairement complexe.

---

Passez au Module 2 : [02-FONDATIONS-ZOD(COURS).md](./02-FONDATIONS-ZOD(COURS).md)


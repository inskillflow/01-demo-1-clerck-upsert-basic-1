# 🔴 Problème Initial - Erreur `username` manquant

## Symptôme

```
❌ Invalid `prisma.user.upsert()` invocation:

Argument `username: String` is missing.
```

**Capture d'écran :** Erreur rouge sur l'interface web indiquant que l'argument `username` est manquant dans l'opération upsert.

---

## 🔍 Diagnostic

### Message utilisateur initial
> "jai change le chema jai fait npx prisma generate migrate etc..beaucoup doperations mais ca fucké monn user sur clerck et prisma"

### Analyse du problème

1. **Schéma Prisma (ligne 23)** avait `username String @unique` (requis)
2. **Code de sync (`lib/sync-user.ts`)** n'incluait PAS le champ `username`
3. Le code essayait d'utiliser `firstName`, `lastName`, `imageUrl` qui n'existaient PAS dans le schéma

**Fichiers affectés :**
- `prisma/schema.prisma`
- `lib/sync-user.ts`

---

## ✅ Solution appliquée

### Étape 1 : Corriger le schéma Prisma

**Avant :**
```prisma
model User {
  username        String   @unique  // ❌ Requis mais non fourni
}
```

**Après :**
```prisma
model User {
  username        String?  @unique  // ✅ Nullable
  firstName       String?             // ✅ Ajouté
  lastName        String?             // ✅ Ajouté
  imageUrl        String?             // ✅ Ajouté
}
```

### Étape 2 : Corriger le code de synchronisation

**Fichier :** `lib/sync-user.ts`

**Ajout :**
```typescript
// Génère un username à partir du username Clerk ou de l'email
const username = clerkUser.username || email.split('@')[0]

// Upsert avec username inclus
const user = await prisma.user.upsert({
  where: { clerkId: clerkUser.id },
  update: {
    email,
    username,        // ✅ Maintenant fourni
    firstName: clerkUser.firstName,
    lastName: clerkUser.lastName,
    imageUrl: clerkUser.imageUrl,
  },
  create: {
    clerkId: clerkUser.id,
    email,
    username,        // ✅ Maintenant fourni
    firstName: clerkUser.firstName,
    lastName: clerkUser.lastName,
    imageUrl: clerkUser.imageUrl,
  },
})
```

### Étape 3 : Regénérer Prisma Client

```bash
npx prisma generate
```

**Résultat :** ✅ Erreur résolue !

---

## 📚 Leçons apprises

1. **Toujours vérifier la cohérence** entre schéma Prisma et code
2. **Les champs requis** doivent être fournis dans `create` ET `update`
3. **Utiliser `?` (nullable)** pour les champs optionnels
4. **Générer un fallback** pour les champs requis (ex: username depuis email)

---

## 🔗 Problèmes liés

Cette erreur a révélé d'autres incohérences qui ont été résolues ensuite :
- [Problème de schéma suivant](./02-SCHEMA_PROBLEMS.md)
- [Champs manquants dans la DB](./02-SCHEMA_PROBLEMS.md#champs-manquants)

---

**Status :** ✅ Résolu  
**Temps de résolution :** ~10 minutes  
**Difficulté :** Facile


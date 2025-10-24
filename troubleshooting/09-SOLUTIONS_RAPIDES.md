# Solutions Rapides - Quick Reference

Guide ultra-rapide pour résoudre les problèmes les plus courants sans lire toute la documentation.

---

## Prisma

### Erreur : "Column X does not exist"
```bash
npx prisma db push
```

### Erreur : "EPERM operation not permitted"
```bash
taskkill /F /IM node.exe
npx prisma generate
npm run dev
```

### Erreur : "Can't reach database server"
Vérifier `.env` ou `.env.local` existe avec `DATABASE_URL`

---

## CSS / Tailwind

### Interface cassée, pas de styles
```bash
npm uninstall tailwindcss @tailwindcss/postcss
npm install -D tailwindcss@^3.4.0 postcss autoprefixer
rm -rf .next
npm run dev
```

### Erreur "border-border" ou "unknown utility class"
Utiliser Tailwind v3, pas v4 :
```bash
npm list tailwindcss  # Vérifier version
```

Si v4 installé, downgrade vers v3 (voir ci-dessus)

---

## Clerk

### "Clerk publishable key not found"
Créer `.env.local` :
```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

### Routes auth ne fonctionnent pas
Vérifier structure :
```
app/(auth)/sign-in/[[...rest]]/page.tsx
```

Et middleware autorise `/sign-in(.*)`

---

## Next.js

### "Cannot find middleware module"
```bash
rm -rf .next
npm run dev
```

### "Fast Refresh reload"
Vérifier erreur dans le terminal, corriger le fichier indiqué

### Port 3000 occupé
```bash
taskkill /F /IM node.exe
```

Ou utiliser autre port :
```bash
npm run dev -- -p 3001
```

---

## React

### "A React form was unexpectedly submitted"
Supprimer auto-submit, faire redirect serveur direct :
```typescript
// Simple et fonctionne
export default async function Page() {
  await syncUser()
  redirect('/next-page')
}
```

### "Event handlers cannot be passed"
Créer un Client Component séparé :
```typescript
'use client'
export function MyButton() {
  return <button onClick={handler}>...</button>
}
```

---

## Build / Deploy

### Build échoue
```bash
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

### Prisma en production
```bash
npx prisma migrate deploy  # PAS db push
npx prisma generate
```

---

## Commandes d'urgence

### Tout reset
```bash
taskkill /F /IM node.exe
rm -rf .next node_modules
npm install
npx prisma generate
npm run dev
```

### Retour arrière Git
```bash
git status
git restore .  # Annuler tous les changements
```

### Vérifier que tout fonctionne
```bash
npm run build  # Doit réussir sans erreur
```

---

**Pour plus de détails, voir les autres fichiers du dossier troubleshooting/**


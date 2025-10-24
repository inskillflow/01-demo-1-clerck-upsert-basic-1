# FAQ & Erreurs Courantes

Questions fréquentes et solutions rapides pour les erreurs rencontrées.

---

## Erreurs Prisma

### Q: "The column X does not exist in the current database"

**Cause :** Le schéma Prisma contient des champs qui n'existent pas dans la DB réelle.

**Solution :**
```bash
# Option 1 : Push le schéma vers la DB
npx prisma db push

# Option 2 : Retirer les champs du schéma
# Éditer prisma/schema.prisma et supprimer les champs problématiques

# Option 3 : Pull le schéma depuis la DB
npx prisma db pull
```

### Q: "EPERM: operation not permitted" lors de prisma generate

**Cause :** Le serveur Next.js utilise les fichiers Prisma.

**Solution :**
```bash
# Arrêter le serveur d'abord
taskkill /F /IM node.exe

# Puis générer
npx prisma generate

# Redémarrer
npm run dev
```

### Q: "Can't reach database server"

**Cause :** Variables d'environnement DATABASE_URL incorrectes ou DB inaccessible.

**Solution :**
1. Vérifier `.env` ou `.env.local` existe
2. Vérifier DATABASE_URL est correct
3. Tester la connexion dans Supabase Dashboard
4. Vérifier que la DB n'est pas en pause (Supabase free tier)

---

## Erreurs Next.js

### Q: "Cannot find the middleware module"

**Cause :** Cache Next.js corrompu après changement de config.

**Solution :**
```bash
rm -rf .next
npm run dev
```

### Q: "Fast Refresh had to perform a full reload"

**Cause :** Erreur runtime dans un composant.

**Solution :**
- Vérifier les erreurs dans le terminal
- Corriger l'erreur indiquée
- Le hot reload reprendra automatiquement

### Q: "Unexpected end of JSON input" (loadManifest)

**Cause :** Build corrompu, souvent lié aux fonts ou au cache.

**Solution :**
```bash
rm -rf .next
npm run dev
```

---

## Erreurs Tailwind CSS

### Q: "Cannot apply unknown utility class"

**Cause :** Tailwind v4 utilisé à la place de v3.

**Solution :**
```bash
# Désinstaller v4
npm uninstall tailwindcss @tailwindcss/postcss

# Installer v3
npm install -D tailwindcss@^3.4.0 postcss autoprefixer

# Nettoyer
rm -rf .next
npm run dev
```

### Q: "tailwindcss directly as a PostCSS plugin"

**Cause :** Conflit entre Tailwind v3 et v4 dans postcss.config.js

**Solution :**
```javascript
// postcss.config.js
module.exports = {
  plugins: {
    tailwindcss: {},      // Pour v3
    autoprefixer: {},
  },
}

// PAS @tailwindcss/postcss (v4 only)
```

### Q: Les styles ne s'appliquent pas

**Checklist :**
1. Vérifier `@tailwind` directives dans globals.css
2. Vérifier `content` dans tailwind.config.js
3. Vérifier import de globals.css dans layout.tsx
4. Nettoyer cache : `rm -rf .next`
5. Hard refresh navigateur : Ctrl+Shift+R

---

## Erreurs Clerk

### Q: "Clerk publishable key not found"

**Cause :** Variables d'environnement manquantes.

**Solution :**
```bash
# Créer .env.local
cp env.sample .env.local

# Ajouter les clés Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

### Q: "<SignIn/> or <SignUp/> not configured correctly"

**Cause :** Routes catch-all manquantes ou middleware bloque.

**Solution :**
1. Vérifier structure : `app/(auth)/sign-in/[[...rest]]/page.tsx`
2. Vérifier middleware autorise `/sign-in(.*)`
3. Ou utiliser `routing="hash"` sur les composants

### Q: "A React form was unexpectedly submitted"

**Cause :** Utilisation d'un formulaire avec auto-submit via useEffect.

**Solution :**
```typescript
// Au lieu de ça (cause l'erreur) :
<form action={serverAction} id="form" />
<AutoSubmit formId="form" />

// Faire ça (direct) :
export default async function WelcomePage() {
  const { userId } = auth()
  if (!userId) redirect('/sign-in')
  
  await syncUser()      // Direct, pas de form
  redirect('/members')  // Redirect server-side
}
```

---

## Erreurs React

### Q: "Event handlers cannot be passed to Client Component props"

**Cause :** Essayer de passer une fonction onClick d'un Server Component vers un Client Component.

**Solution :**
```typescript
// Créer un composant client séparé
'use client'

export function MyButton({ onClick }) {
  return <button onClick={onClick}>Click</button>
}
```

### Q: "ReferenceError: X is not defined"

**Cause :** Import manquant.

**Solution :**
```typescript
// Vérifier les imports en haut du fichier
import { Copy, Code, ... } from 'lucide-react'
```

---

## Erreurs de build

### Q: Module not found lors du build

**Causes possibles :**
1. Package non installé
2. Chemin d'import incorrect
3. Typo dans le nom du fichier

**Solution :**
```bash
# Vérifier que le package existe
npm list <package-name>

# Réinstaller si manquant
npm install <package-name>

# Vérifier les alias dans tsconfig.json
```

### Q: Build réussit mais runtime error

**Cause :** Différence entre build time et runtime.

**Solution :**
- Vérifier les variables d'environnement
- Tester en mode dev d'abord
- Vérifier les imports dynamiques

---

## Questions sur l'architecture

### Q: Où mettre la logique de sync ?

**Réponse :** Dans `/welcome` (Server Component), appelé UNE FOIS après login.

**Mauvaise pratique :**
```typescript
// app/page.tsx (Server)
export default async function Home() {
  await syncUser()  // Appelé à chaque visite de /
}
```

**Bonne pratique :**
```typescript
// app/welcome/page.tsx (Server)
export default async function WelcomePage() {
  await syncUser()      // Appelé UNE fois post-login
  redirect('/members')
}
```

### Q: Où stocker username, bio, company ?

**Réponse :** Dans votre base de données (Prisma), PAS dans Clerk metadata.

**Raisons :**
- Scalabilité (Clerk metadata limité à 8KB)
- Relations possibles (User -> Posts)
- Requêtes SQL complexes
- Séparation auth/métier

**Exception :** Projets très simples sans relations peuvent utiliser Clerk publicMetadata.

### Q: Faut-il utiliser webhooks Clerk ?

**Réponse :** NON pour cette architecture.

**Pourquoi :**
- La sync post-login via /welcome suffit
- Plus simple à maintenir
- Pas de endpoint webhook à sécuriser

**Quand utiliser webhooks :**
- Sync automatique quand user modifie son profil Clerk
- Événements complexes (user.deleted, session.created)
- Architecture event-driven

### Q: Server Component vs Client Component ?

**Server Component (par défaut) :**
- Peut utiliser : auth(), currentUser(), Prisma, secrets
- Ne peut pas : useState, onClick, useEffect
- Fichiers : pages, layouts, API routes

**Client Component ('use client') :**
- Peut utiliser : hooks React, event handlers, browser APIs
- Ne peut pas : importer du code server-only
- Fichiers : formulaires, boutons interactifs

---

## Performance

### Q: L'app est lente au premier chargement

**Causes :**
1. Next.js compile à la demande en dev
2. Prisma génère le client
3. Clerk charge ses assets

**Normal en dev. En production :**
```bash
npm run build  # Précompile tout
npm start      # Serveur optimisé
```

### Q: Trop de requêtes à la DB

**Solution :** Vérifier que syncUser() n'est appelé que dans /welcome, pas sur chaque page.

**Vérification :**
```bash
# Chercher les appels à syncUser
grep -r "syncUser" app/
```

Devrait apparaître UNIQUEMENT dans `app/welcome/page.tsx`.

---

## Sécurité

### Q: Mes secrets sont-ils sécurisés ?

**Vérifications :**

1. `.env` ou `.env.local` dans .gitignore
```bash
cat .gitignore | grep .env
```

2. Pas de secrets en dur dans le code
```bash
grep -r "sk_test" app/
grep -r "pk_test" app/
```

3. Variables serveur vs publiques :
- `NEXT_PUBLIC_*` : accessible côté client
- Sans préfixe : serveur uniquement

### Q: Comment protéger une route ?

**Middleware (automatique) :**
```typescript
// Toutes les routes sauf celles dans isPublicRoute sont protégées
const isPublicRoute = createRouteMatcher(['/', '/welcome', '/sign-in(.*)'])
```

**Manuelle dans une page :**
```typescript
export default async function ProtectedPage() {
  const { userId } = auth()
  if (!userId) redirect('/sign-in')
  // ...
}
```

---

## Dépannage par symptôme

| Symptôme | Cause probable | Solution rapide |
|----------|----------------|-----------------|
| Page blanche | Erreur JS côté serveur | Vérifier terminal logs |
| CSS non appliqué | Tailwind mal configuré | Vérifier config + cache |
| 404 sur les routes | Fichier mal nommé | Vérifier structure dossiers |
| Prisma type errors | Client pas généré | `npx prisma generate` |
| "Auth required" | Middleware bloque | Vérifier isPublicRoute |
| Erreur upsert | Champ requis manquant | Vérifier schéma vs code |
| EPERM Prisma | Serveur en cours | Arrêter serveur d'abord |

---

## Ressources officielles

**Documentation :**
- Next.js: https://nextjs.org/docs
- Clerk: https://clerk.com/docs
- Prisma: https://www.prisma.io/docs
- Supabase: https://supabase.com/docs
- Tailwind: https://tailwindcss.com/docs
- shadcn/ui: https://ui.shadcn.com

**Support communautaire :**
- Next.js Discord
- Clerk Discord
- Prisma Discord
- Stack Overflow

---

**Dernière mise à jour :** 24 octobre 2025


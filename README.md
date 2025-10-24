# AuthSync - Clerk + Prisma + Supabase

Application Next.js 14 professionnelle avec authentification Clerk et synchronisation automatique Prisma/Supabase.

---

## Caractéristiques

- **Authentification moderne** avec Clerk (OAuth, email/password, 2FA)
- **Synchronisation automatique** post-login avec Prisma upsert
- **Base de données PostgreSQL** via Supabase
- **Interface professionnelle** avec shadcn/ui et Tailwind CSS v3
- **CRUD complet** pour gestion du profil utilisateur
- **Developer Dashboard** pour debug et inspection
- **Architecture production-ready** suivant les meilleures pratiques

---

## Stack Technologique

- **Framework :** Next.js 14.1.0 (App Router)
- **Language :** TypeScript
- **Auth :** Clerk
- **ORM :** Prisma 5.22.0
- **Database :** Supabase (PostgreSQL)
- **Styling :** Tailwind CSS 3.4.0
- **UI Components :** shadcn/ui
- **Icons :** Lucide React

---

## Installation

### Prérequis

- Node.js 18+ 
- Compte Clerk (https://clerk.com)
- Projet Supabase (https://supabase.com)

### Étapes

1. **Cloner et installer**
   ```bash
   git clone <repo>
   cd projet
   npm install
   ```

2. **Configuration environnement**
   ```bash
   cp env.sample .env.local
   ```
   
   Remplir avec vos clés :
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   DATABASE_URL="postgresql://..."
   DIRECT_URL="postgresql://..."
   ```

3. **Synchroniser la base de données**
   ```bash
   npx prisma db push
   npx prisma generate
   ```

4. **Lancer le serveur**
   ```bash
   npm run dev
   ```

5. **Accéder à l'application**
   ```
   http://localhost:3000
   ```

---

## Structure du projet

```
app/
├── (auth)/
│   ├── sign-in/[[...rest]]/      # Routes auth Clerk
│   └── sign-up/[[...rest]]/
├── api/
│   └── profile/route.ts          # API CRUD profil
├── components/
│   └── ui/                       # Composants shadcn/ui
├── dev/                          # Developer dashboard
├── members/                      # Dashboard utilisateur
├── profile/                      # Édition profil
├── welcome/                      # Sync post-login
└── page.tsx                      # Landing page

lib/
├── prisma.ts                     # Client Prisma singleton
├── sync-user.ts                  # Fonction de sync (server-only)
└── utils.ts                      # Utilitaires

prisma/
├── schema.prisma                 # Schéma de base de données
└── migrations/                   # Historique migrations

troubleshooting/                  # Documentation complète
├── 00-INDEX.md                   # Point d'entrée
├── 00-RESUME_VISUEL.md          # Vue d'ensemble
└── ...                          # 10 fichiers de doc

middleware.ts                     # Protection routes
tailwind.config.js               # Config Tailwind v3
```

---

## Utilisation

### Authentification

1. Cliquer sur "Créer un compte" ou "Se connecter"
2. Suivre le flux Clerk
3. Être redirigé automatiquement vers /members

### Modification du profil

1. Depuis /members, cliquer "Paramètres du profil"
2. Remplir le formulaire complet :
   - Username
   - Bio
   - Informations professionnelles
   - Liens réseaux sociaux
   - Préférences
3. Enregistrer

### Developer Dashboard

Accéder à `/dev` pour voir :
- JSON complet Clerk User
- JSON complet Database User
- Liens rapides vers dashboards
- Documentation API
- Flux de synchronisation

---

## Architecture

### Séparation des responsabilités

**Clerk gère :**
- Email, Prénom, Nom, Avatar
- Mot de passe, 2FA
- Sessions
- Modification via UserButton

**Base de données gère :**
- Username, Bio, Company, Job Title
- Location, Website
- Réseaux sociaux (Twitter, LinkedIn, GitHub)
- Préférences (notifications, theme, language)
- Modification via /profile

### Flux de synchronisation

```
Login → /welcome → syncUser() [upsert] → redirect(/members)
```

**Principe :** Sync UNE SEULE FOIS post-login, pas à chaque page.

---

## Commandes utiles

```bash
# Développement
npm run dev

# Prisma
npx prisma generate          # Générer client
npx prisma db push          # Sync schéma → DB
npx prisma studio           # Interface graphique DB

# Build production
npm run build
npm start

# Nettoyage
rm -rf .next                # Cache Next.js
rm -rf node_modules         # Réinstaller tout
```

---

## Troubleshooting

**Documentation complète disponible dans `/troubleshooting/`**

### Problèmes courants

1. **Erreur "Column X does not exist"**
   ```bash
   npx prisma db push
   ```

2. **CSS ne charge pas**
   ```bash
   npm install -D tailwindcss@^3.4.0
   rm -rf .next
   npm run dev
   ```

3. **"Cannot find middleware"**
   ```bash
   rm -rf .next
   npm run dev
   ```

4. **Prisma EPERM**
   ```bash
   taskkill /F /IM node.exe
   npx prisma generate
   ```

**Pour plus de solutions :** Voir [troubleshooting/09-SOLUTIONS_RAPIDES.md](./troubleshooting/09-SOLUTIONS_RAPIDES.md)

---

## Documentation

### Documentation projet (5000+ lignes)

**Troubleshooting complet :** `/troubleshooting/` (14 fichiers)
- [00-INDEX.md](./troubleshooting/00-INDEX.md) - Point d'entrée
- [00-RESUME_VISUEL.md](./troubleshooting/00-RESUME_VISUEL.md) - Vue d'ensemble graphique
- [10-PROMPT_COMPLET_RECREATION.md](./troubleshooting/10-PROMPT_COMPLET_RECREATION.md) - Recréer en 30min
- [11-PROCHAINES_ETAPES.md](./troubleshooting/11-PROCHAINES_ETAPES.md) - LMS, Crypto, SaaS
- [README complet](./troubleshooting/README.md) - Guide de la documentation

**Prompts prêts à l'emploi :** `/PROMPTS_READY_TO_USE.md`
- 11 prompts copy/paste pour créer ou étendre le projet
- Prompts pour LMS, Crypto, SaaS, Stripe, RBAC, etc.

**Documentation utilisateur :** `/documentation-1/` (guides existants)

**Exemples :** `/examples/` (schemas alternatifs, webhooks)

### Documentation externe

- [Next.js Documentation](https://nextjs.org/docs)
- [Clerk Documentation](https://clerk.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)

---

## Meilleures pratiques implémentées

1. **Server Components** pour logique métier
2. **Client Components** pour interactivité uniquement
3. **import 'server-only'** pour protéger le code serveur
4. **Middleware Clerk** pour protection routes
5. **Upsert idempotent** (pas de duplication)
6. **Sync post-login** uniquement (performances)
7. **Validation** client ET serveur
8. **Type safety** avec TypeScript
9. **Error handling** complet
10. **Documentation exhaustive**

---

## Développement

### Structure recommandée

**Pages serveur (Server Components) :**
- Peuvent utiliser : `auth()`, `currentUser()`, Prisma, secrets
- Fichiers : pages principales, layouts

**Composants clients (Client Components) :**
- Marqués avec `'use client'`
- Utilisent : `useState`, `onClick`, browser APIs
- Fichiers : formulaires, boutons interactifs

**API Routes :**
- Endpoints REST dans `app/api/`
- Validation et auth systématiques

### Ajout de fonctionnalités

**Exemple : Ajouter un champ au profil**

1. Modifier `prisma/schema.prisma`
2. `npx prisma db push`
3. Ajouter le champ dans `app/profile/ProfileForm.tsx`
4. Ajouter la validation dans `app/api/profile/route.ts`
5. Afficher dans `app/members/page.tsx`

---

## Déploiement

### Vercel (recommandé)

```bash
# Connecter le repo
vercel

# Configurer les variables d'environnement dans Vercel dashboard
# Déployer
vercel --prod
```

### Autres plateformes

1. Variables d'environnement à configurer
2. `npx prisma migrate deploy` avant le build
3. `npm run build`
4. `npm start`

---

## Licence

Projet d'apprentissage - Next.js + Clerk + Prisma

---

## Support

Pour questions ou problèmes :

1. Consulter `/troubleshooting/` pour erreurs connues
2. Vérifier [FAQ](./troubleshooting/06-FAQ_ERREURS.md)
3. Utiliser [Solutions Rapides](./troubleshooting/09-SOLUTIONS_RAPIDES.md)

---

**Version :** 1.0.0  
**Date :** 24 octobre 2025  
**Status :** Production Ready


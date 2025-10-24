# Commandes Utiles - Cheat Sheet

Guide de référence rapide des commandes utilisées pour résoudre les problèmes.

---

## Gestion du serveur

### Démarrer le serveur
```bash
npm run dev
```

### Arrêter tous les processus Node.js (Windows)
```bash
taskkill /F /IM node.exe
```

### Arrêter un port spécifique (Windows)
```powershell
# Trouver le processus sur le port 3000
netstat -ano | findstr :3000

# Tuer le processus (remplacer PID)
taskkill /F /PID <PID>
```

### Démarrer sur un port différent
```bash
npm run dev -- -p 3001
```

---

## Prisma

### Générer le client Prisma
```bash
npx prisma generate
```

**Quand l'utiliser :**
- Après modification du schema.prisma
- Après pull/clone du projet
- Si erreurs de types TypeScript sur prisma.user

### Synchroniser le schéma avec la DB
```bash
# Sans perte de données (recommandé en dev)
npx prisma db push

# Avec acceptation perte potentielle
npx prisma db push --accept-data-loss
```

**Quand l'utiliser :**
- En développement pour tests rapides
- Quand migrate dev ne fonctionne pas
- Pour prototypage rapide

### Créer une migration
```bash
npx prisma migrate dev --name nom_de_la_migration
```

**Erreur courante :**
```
Error: Prisma Migrate has detected that the environment is non-interactive
```

**Solution :** Utiliser `db push` à la place en dev

### Déployer les migrations (production)
```bash
npx prisma migrate deploy
```

### Voir l'état de la DB
```bash
# Récupérer le schéma depuis la DB
npx prisma db pull

# Valider le schéma
npx prisma validate

# Ouvrir Prisma Studio (interface graphique)
npx prisma studio
```

---

## Nettoyage

### Nettoyer le cache Next.js
```bash
# Windows PowerShell
Remove-Item -Path ".next" -Recurse -Force -ErrorAction SilentlyContinue

# Ou bash/cmd
rm -rf .next
```

**Quand l'utiliser :**
- Après changement de config (tailwind, postcss)
- Erreurs de build étranges
- "Cannot find middleware module"
- Après changement de dépendances majeures

### Nettoyer node_modules
```bash
# Windows PowerShell
Remove-Item -Path "node_modules" -Recurse -Force
Remove-Item -Path "package-lock.json" -Force
npm install

# Ou bash
rm -rf node_modules package-lock.json
npm install
```

**Quand l'utiliser :**
- Après conflit de versions
- Erreurs de dépendances persistantes
- Après downgrade (ex: Tailwind v4 → v3)

---

## Tailwind CSS

### Installer Tailwind v3 (STABLE)
```bash
npm install -D tailwindcss@^3.4.0 postcss autoprefixer
```

### Initialiser la config
```bash
# Créer tailwind.config.js et postcss.config.js
npx tailwindcss init -p
```

### Désinstaller Tailwind v4
```bash
npm uninstall tailwindcss @tailwindcss/postcss
```

### Vérifier la version installée
```bash
npm list tailwindcss
```

---

## shadcn/ui

### Installer les dépendances
```bash
npm install tailwindcss-animate class-variance-authority clsx tailwind-merge lucide-react
```

### Ajouter des composants
```bash
# Mode interactif (ne fonctionne pas toujours)
npx shadcn@latest add card button badge

# Si ça ne marche pas : créer manuellement les fichiers
# Voir components/ui/card.tsx dans le projet
```

---

## Git

### Voir les changements
```bash
git status
git diff
```

### Voir l'historique des migrations Prisma
```bash
ls prisma/migrations/
cat prisma/migrations/YYYYMMDD_nom/migration.sql
```

---

## Debug

### Voir les logs du serveur
Les logs s'affichent directement dans le terminal où `npm run dev` tourne.

### Erreur Prisma - Connexion
```bash
# Tester la connexion
npx prisma db execute --stdin <<< "SELECT 1;"

# Vérifier DATABASE_URL
echo $DATABASE_URL  # Linux/Mac
$env:DATABASE_URL   # Windows PowerShell
```

### Erreur "EPERM: operation not permitted"
**Cause :** Le serveur Node.js bloque les fichiers Prisma

**Solution :**
```bash
taskkill /F /IM node.exe
npx prisma generate
npm run dev
```

### Erreur "Cannot find module"
**Cause :** Cache corrompu

**Solution :**
```bash
rm -rf .next
npm run dev
```

---

## Package.json - Scripts utiles

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "db:push": "prisma db push",
    "db:generate": "prisma generate",
    "db:studio": "prisma studio",
    "db:seed": "tsx prisma/seed.ts"
  }
}
```

**Utilisation :**
```bash
npm run db:push
npm run db:generate
npm run db:studio
```

---

## Troubleshooting rapide

### Le CSS ne charge pas
```bash
# 1. Vérifier la version Tailwind
npm list tailwindcss

# 2. Si v4 → downgrade v3
npm uninstall tailwindcss @tailwindcss/postcss
npm install -D tailwindcss@^3.4.0

# 3. Nettoyer
rm -rf .next

# 4. Redémarrer
npm run dev
```

### Erreur de schéma Prisma
```bash
# 1. Vérifier le schéma
npx prisma validate

# 2. Voir ce qui est en DB
npx prisma db pull

# 3. Push les changements
npx prisma db push

# 4. Générer le client
npx prisma generate
```

### Erreur d'auth Clerk
```bash
# 1. Vérifier les env vars
echo $NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

# 2. Vérifier middleware
cat middleware.ts

# 3. Restart serveur
taskkill /F /IM node.exe
npm run dev
```

---

## Commandes de diagnostic

### Système
```bash
# Version Node
node -v

# Version npm
npm -v

# Espace disque
df -h  # Linux/Mac
Get-PSDrive  # Windows PowerShell
```

### Projet
```bash
# Taille node_modules
du -sh node_modules  # Linux/Mac
(Get-ChildItem node_modules -Recurse | Measure-Object -Property Length -Sum).Sum / 1GB  # Windows

# Nombre de fichiers
find node_modules -type f | wc -l  # Linux/Mac
(Get-ChildItem -Recurse node_modules).Count  # Windows
```

---

## Aide-mémoire Git

### Annuler des changements
```bash
# Annuler tous les changements non commités
git restore .

# Annuler un fichier spécifique
git restore prisma/schema.prisma

# Voir les changements avant d'annuler
git diff prisma/schema.prisma
```

### Sauvegarder avant gros changement
```bash
# Créer une branche de sauvegarde
git checkout -b backup-before-refactor
git add .
git commit -m "Backup avant refactor"
git checkout main
```

---

**Dernière mise à jour :** 24 octobre 2025  
**Plateforme :** Windows 10, PowerShell  
**Projet :** Next.js 14 + Clerk + Prisma + Supabase


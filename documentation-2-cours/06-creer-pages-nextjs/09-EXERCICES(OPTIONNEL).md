# Exercices Pratiques : Créer des Pages Next.js

## Instructions

- 4 exercices à réaliser
- Durée estimée : 5-6 heures
- Rédigez vos réponses dans un document séparé
- Consultez 10-EXERCICES-SOLUTIONS(OPTIONNEL).md après avoir terminé

---

## Exercice 1 : Application E-commerce complète (120 minutes)

Créez une application e-commerce avec tous les fichiers Next.js.

**Structure requise :**
```
app/
├── layout.tsx
├── page.tsx (accueil avec produits vedette)
├── (shop)/
│   ├── layout.tsx (header shop, panier)
│   ├── products/
│   │   ├── page.tsx (liste produits)
│   │   ├── loading.tsx
│   │   └── [id]/
│   │       ├── page.tsx (détail produit)
│   │       └── loading.tsx
│   └── cart/
│       └── page.tsx
├── (auth)/
│   ├── layout.tsx
│   ├── signin/page.tsx
│   └── signup/page.tsx
└── (account)/
    ├── layout.tsx (sidebar compte)
    ├── orders/page.tsx
    └── profile/page.tsx
```

**Fournissez :**
- Tous les fichiers layout.tsx avec structure appropriée
- Toutes les pages avec fetch Prisma
- Loading skeletons pour liste et détail produits
- Error.tsx pour chaque section
- API routes : /api/products, /api/cart, /api/orders
- Schéma Prisma (Product, Cart, Order)

**Critères d'évaluation :**
- Architecture complète et cohérente (10 points)
- Layouts appropriés par section (8 points)
- Fetch de données optimisé (7 points)
- UI professionnelle (5 points)

---

## Exercice 2 : Dashboard Analytics (90 minutes)

Créez un dashboard d'analytics avec loading states avancés.

**Spécifications :**

1. **Layout dashboard** avec sidebar contenant :
   - Logo
   - Navigation (Overview, Users, Revenue, Reports)
   - User profile en bas

2. **Page overview** (/dashboard) avec 4 KPI cards :
   - Total utilisateurs
   - Revenus du mois
   - Nouveaux signups
   - Taux de conversion
   - Graphique (peut être simulé)

3. **Loading states** :
   - Skeleton pour chaque KPI card
   - Skeleton pour le graphique
   - Layout reste visible pendant loading

4. **Error handling** :
   - Error.tsx spécifique dashboard
   - Message adapté si échec de fetch analytics
   - Bouton retry et contact support

5. **API route** `/api/analytics` qui retourne :
   - Statistiques calculées depuis Prisma
   - Données pour graphiques
   - Gestion du cache (revalidate)

**Fournissez :**
- Layout dashboard complet avec sidebar
- Page overview avec fetch analytics
- Loading skeleton détaillé
- Error.tsx adapté
- API route analytics
- Composants KPI card réutilisables

**Critères d'évaluation :**
- Dashboard professionnel (8 points)
- Loading states soignés (7 points)
- Fetch et calculs corrects (6 points)
- Code réutilisable (4 points)

---

## Exercice 3 : Système de Settings avec tabs (75 minutes)

Créez une section settings complète avec navigation par tabs.

**Structure :**
```
app/settings/
├── layout.tsx (tabs navigation)
├── account/page.tsx
├── billing/page.tsx
├── preferences/page.tsx
├── security/page.tsx
└── loading.tsx
```

**Spécifications :**

1. **Layout avec tabs** :
   - Tabs horizontales (Account, Billing, Preferences, Security)
   - Tab active highlightée
   - Navigation client-side
   - Header avec titre "Settings"

2. **Page Account** :
   - Formulaire : name, email, bio
   - Upload de photo de profil
   - Bouton save avec loading state

3. **Page Billing** :
   - Afficher le plan actuel
   - Historique de facturation (tableau)
   - Bouton upgrade

4. **Page Preferences** :
   - Toggle notifications email
   - Select language (fr, en)
   - Select theme (light, dark, system)

5. **Page Security** :
   - Changer mot de passe
   - Sessions actives (liste)
   - Bouton révoquer toutes les sessions

**Fournissez :**
- Layout settings avec composant Tabs client
- Les 4 pages complètes avec formulaires
- API routes pour chaque section
- Loading skeleton qui affiche les tabs et le contenu en skeleton
- Gestion d'état et validation

**Critères d'évaluation :**
- Tabs fonctionnels avec état actif (6 points)
- Formulaires complets et validés (8 points)
- API routes appropriées (6 points)
- UX et feedback utilisateur (5 points)

---

## Exercice 4 : Migration code réel (90 minutes)

Prenez une page de votre projet actuel et améliorez-la avec toutes les bonnes pratiques.

**Choisissez une page complexe (ex: /members, /profile, /dashboard)**

**Tâches :**

1. **Analyser l'existant** :
   - Identifier ce qui est Server vs Client
   - Repérer les fetches de données
   - Noter les points d'amélioration

2. **Créer loading.tsx** :
   - Skeleton qui reproduit exactement la structure
   - Animations pulse appropriées

3. **Créer error.tsx** :
   - Gestion d'erreurs spécifique à cette section
   - Messages adaptés au contexte
   - Actions de recovery appropriées

4. **Optimiser page.tsx** :
   - Séparer Server et Client Components
   - Optimiser les fetch Prisma (include, select)
   - Ajouter metadata
   - Améliorer l'UI

5. **Améliorer layout.tsx** (si applicable) :
   - Extraire navigation dans composant client
   - Optimiser la structure
   - Ajouter loading boundaries

**Fournissez :**
- Code avant (actuel)
- Code après (amélioré)
- Liste des améliorations apportées
- Justification de chaque changement
- Mesures de performance (si possible)

**Critères d'évaluation :**
- Analyse pertinente (6 points)
- Améliorations significatives (10 points)
- Separation Server/Client appropriée (6 points)
- Code production-ready (8 points)

---

## Questions Ouvertes

### Question 1 : Structure optimale (30 minutes)

Vous devez architecturer une plateforme de cours en ligne (LMS) avec :
- Pages publiques (home, catalogue, course preview)
- Authentification (signin, signup)
- Espace étudiant (mes cours, progression, certificats)
- Espace instructeur (créer cours, analytics, students)
- Admin (gestion users, approbation cours)

**Concevez :**
- Structure complète app/ avec route groups
- Layouts pour chaque section
- Pages principales
- Loading et error strategies
- API routes nécessaires

**Justifiez :**
- Choix des route groups
- Pourquoi certain layouts imbriqués
- Où placer loading.tsx et error.tsx
- Organisation des composants

**Critères d'évaluation :**
- Architecture scalable (6 points)
- Justifications techniques (4 points)
- Complétude de la solution (5 points)

---

### Question 2 : Performance et UX (20 minutes)

Listez et expliquez 7 techniques pour améliorer les performances et l'UX des pages Next.js.

**Pour chacune :**
- La technique spécifique
- Quel fichier utiliser (layout, page, loading, etc.)
- Code d'exemple
- Impact sur l'UX
- Gain de performance estimé

**Exemples de techniques à couvrir :**
- Skeletons vs spinners
- Parallel data fetching
- Streaming avec Suspense
- Image optimization
- Prefetching des liens
- Loading states granulaires
- Error recovery automatique

**Critères d'évaluation :**
- Pertinence des techniques (4 points)
- Code d'exemple fonctionnel (3 points)
- Compréhension de l'impact (3 points)

---

## Soumission

Rédigez vos réponses dans un document structuré et consultez 10-EXERCICES-SOLUTIONS(OPTIONNEL).md pour comparer avec les solutions proposées.


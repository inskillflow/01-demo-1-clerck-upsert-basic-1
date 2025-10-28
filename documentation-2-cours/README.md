# Documentation Cours - Guide Complet

## Vue d'ensemble

Ce dossier contient 7 cours complets sur l'authentification, Next.js, et la validation. Plus de 300 pages de contenu pédagogique avec quiz et exercices.

## Guide des Cours par Partie

### PARTIE 1 - Clerk et Synchronisation avec Supabase
**Dossier :** [01-clerk-upsert/](./01-clerk-upsert/)

**Sujets couverts :**
- Fondations de l'authentification moderne
- Fonctionnement de Clerk (JWT, composants, sessions)
- ORM Prisma et base de données
- Stratégie de synchronisation upsert

**Format :**
- 4 modules de cours narratifs
- 20 questions à choix multiple
- Questions d'explication avec réponses détaillées
- 5 exercices pratiques

**Durée :** 3-4 heures

---

### PARTIE 2 - Webhooks
**Dossier :** [02-webhooks-production/](./02-webhooks-production/)

**Sujets couverts :**
- Concepts webhooks (Pull vs Push)
- Architecture Clerk avec Svix
- Implémentation avec vérification de signatures
- Scénarios réels (emails, RGPD, analytics)
- Production vs Développement (ngrok vs URL publique)
- Déploiement Vercel, Railway, VPS

**Format :**
- 6 modules de cours narratifs
- 40 questions à choix multiple (2 quiz : webhooks + production)
- Questions d'explication détaillées
- 5 exercices pratiques

**Durée :** 5-6 heures

**Point clé :** localhost = ngrok nécessaire / Site hébergé = pas ngrok

---

### PARTIE 3 - NextAuth et Étapes de Développement
**Dossier :** [03-nextauth/](./03-nextauth/)

**Sujets couverts :**
- NextAuth vs Clerk (philosophie open-source vs SaaS)
- Configuration et setup complet
- Providers d'authentification (OAuth, Credentials, Email)
- Stratégies de session (JWT vs Database)
- Pages d'authentification personnalisées
- Intégration Prisma avec Adapter

**Format :**
- 6 modules de cours narratifs
- 25 questions à choix multiple
- Questions d'explication approfondies
- 5 exercices pratiques

**Durée :** 4-5 heures

**Point clé :** Alternative 100% gratuite à Clerk avec contrôle total

---

### PARTIE 4 - JWT
**Dossier :** [04-jwt/](./04-jwt/)

**Sujets couverts :**
- Qu'est-ce qu'un JWT (header.payload.signature)
- Anatomie détaillée d'un JWT
- Cryptographie (HMAC, RSA, signatures)
- JWT vs Sessions traditionnelles
- Vulnérabilités et bonnes pratiques de sécurité
- Implémentation Next.js complète
- **Comparaison JWT vs Clerk vs NextAuth (Module 09)**

**Format :**
- 7 modules de cours narratifs
- 25 questions à choix multiple
- Questions d'explication cryptographiques
- 4 exercices pratiques

**Durée :** 5-6 heures

**Point clé :** Comprendre les fondations + Comparaison complète des 3 approches

---

### PARTIE 5 - Architecture d'une Application Next.js
**Dossier :** [05-architecture-nextjs/](./05-architecture-nextjs/)

**Sujets couverts :**
- App Router vs Pages Router
- C'est quoi layout.tsx ? (UI persistante qui wrappe)
- C'est quoi page.tsx ? (Contenu unique de chaque route)
- C'est quoi la signification de (auth) ? (Route group, n'apparaît pas dans URL)
- C'est quoi les [...] ou [[...]] ? (Routes dynamiques catch-all)
- Prisma : Les migrations en détails (db push, migrate dev, migrate deploy)
- Fichiers spéciaux (loading.tsx, error.tsx, template.tsx)

**Format :**
- 6 modules de cours narratifs
- 30 questions à choix multiple
- Questions d'explication architecturales
- 5 exercices pratiques

**Durée :** 4-5 heures

**Point clé :** Concepts fondamentaux de Next.js 14

---

### PARTIE 6 - Comment Créer les Pages Next.js
**Dossier :** [06-creer-pages-nextjs/](./06-creer-pages-nextjs/)

**Sujets couverts :**
- Comment créer layout.tsx (racine, sections, navigation, sidebar)
- Comment créer page.tsx (Server/Client, fetch Prisma, formulaires)
- Comment créer loading.tsx (skeletons, spinners, progress bars)
- Comment créer error.tsx (gestion erreurs, recovery, logging)
- Fichiers avancés (template.tsx, not-found.tsx, API routes CRUD)
- Application blog complète de A à Z avec code complet

**Format :**
- 6 modules pratiques avec code complet
- 25 questions à choix multiple
- Questions d'explication pratiques
- 4 exercices de création

**Durée :** 5-6 heures

**Point clé :** Code production-ready prêt à copier et adapter

---

### PARTIE 7 - Validation avec Zod
**Dossier :** [07-validation-zod/](./07-validation-zod/)

**Sujets couverts :**
- Pourquoi la validation serveur est critique
- Fondations Zod (types, contraintes, transformations)
- Schémas avancés (refinements, composition)
- Validation de formulaires avec React Hook Form
- Validation des API routes Next.js
- Patterns avancés (schémas réutilisables, environnement)

**Format :**
- 6 modules de cours narratifs
- 25 questions à choix multiple
- Questions d'explication de sécurité
- 4 exercices de validation

**Durée :** 4-5 heures

**Point clé :** Ne jamais faire confiance aux données client

## Organisation des fichiers

Chaque cours contient :
- `00-INTRODUCTION(COURS).md` à `0X-MODULE(COURS).md` - Modules de cours
- `0X-QUIZ-QUESTIONS(OBLIGATOIRE).md` - Questions sans réponses
- `0X-QUIZ-REPONSES(OBLIGATOIRE).md` - Corrections détaillées
- `0X-EXERCICES(OPTIONNEL).md` - Exercices pratiques
- `INDEX.md` - Navigation du cours
- `README.md` - Vue d'ensemble

## Total du contenu

- **47 modules** narratifs
- **300+ pages** de cours
- **190 questions** de quiz
- **32 exercices** pratiques
- **18 questions** ouvertes

---

## Format des Cours

Chaque cours contient :

### Modules (COURS)
- Contenu pédagogique narratif
- Explications en paragraphes détaillés
- Exemples concrets et code commenté
- Approche "pourquoi avant comment"

### Quiz (OBLIGATOIRE)
- **Questions à choix multiple**
- Questions séparées des réponses
- Corrections avec explications détaillées
- Barème de notation

### Exercices (OPTIONNEL)
- **Questions d'explication** approfondies
- Exercices pratiques complexes
- Questions ouvertes de réflexion
- Solutions détaillées

---

## Parcours Recommandé

### Parcours Débutant (ordre suggéré)
1. **PARTIE 5** - Architecture Next.js (comprendre la structure)
2. **PARTIE 6** - Créer les pages Next.js (pratiquer avec du code)
3. **PARTIE 7** - Validation Zod (sécuriser)
4. **PARTIE 1** - Clerk + Upsert (première approche auth)
5. **PARTIE 4** - JWT + Comparaison (fondations + choisir son approche)
6. **PARTIE 3** - NextAuth (alternative gratuite)
7. **PARTIE 2** - Webhooks (production avancée)

### Parcours Rapide (pour développeurs expérimentés)
1. **PARTIE 1** - Clerk (démarrage rapide)
2. **PARTIE 4 Module 09** - Comparaison des approches
3. **PARTIE 5 et 6** - Next.js (concepts + pratique)

### Parcours Pratique (code réutilisable)
1. **PARTIE 6** - Créer les pages (exemples complets)
2. **PARTIE 7** - Validation Zod (sécuriser)
3. **PARTIE 1 ou 3** - Choisir Clerk ou NextAuth
4. Quiz de validation uniquement

---

## Liens Rapides

### Pour Commencer
- **Nouveau en auth :** [01-clerk-upsert/INDEX.md](./01-clerk-upsert/INDEX.md)
- **Nouveau en Next.js :** [05-architecture-nextjs/INDEX.md](./05-architecture-nextjs/INDEX.md)

### Pour Comparer
- **Comparaison complète :** [04-jwt/09-COMPARAISON-APPROCHES(COURS).md](./04-jwt/09-COMPARAISON-APPROCHES(COURS).md)
- **JWT vs Clerk vs NextAuth :** Voir aussi `../COMPARAISON-COMPLETE-APPROCHES.md`

### Pour Pratiquer
- **Code réutilisable :** [06-creer-pages-nextjs/](./06-creer-pages-nextjs/)
- **Validation :** [07-validation-zod/](./07-validation-zod/)

---

## Résumé des Contenus

| Partie | Dossier | Modules | Quiz | Durée |
|--------|---------|---------|------|-------|
| 1 | 01-clerk-upsert | 4 | 20 Q | 3-4h |
| 2 | 02-webhooks-production | 6 | 40 Q | 5-6h |
| 3 | 03-nextauth | 6 | 25 Q | 4-5h |
| 4 | 04-jwt | 7 | 25 Q | 5-6h |
| 5 | 05-architecture-nextjs | 6 | 30 Q | 4-5h |
| 6 | 06-creer-pages-nextjs | 6 | 25 Q | 5-6h |
| 7 | 07-validation-zod | 6 | 25 Q | 4-5h |
| **Total** | **7 cours** | **41** | **190 Q** | **30-35h** |

---

## Questions Fréquentes Répondues

### Quelle est la meilleure approche d'authentification ?
Voir **PARTIE 4 - Module 09** pour analyse complète avec 4 scénarios

### Ai-je besoin de ngrok en production ?
Voir **PARTIE 2 - Module 05** : NON, seulement pour localhost en dev

### layout.tsx vs page.tsx, quelle différence ?
Voir **PARTIE 5 - Module 02** : layout persiste, page est unique

### Que signifie (auth) dans app/(auth)/ ?
Voir **PARTIE 5 - Module 03** : Route group, n'apparaît pas dans l'URL

### Différence entre [...] et [[...]] ?
Voir **PARTIE 5 - Module 04** : [...] = 1+segments, [[...]] = 0+segments

### db push vs migrate dev ?
Voir **PARTIE 5 - Module 05** : push = prototypage, migrate = production


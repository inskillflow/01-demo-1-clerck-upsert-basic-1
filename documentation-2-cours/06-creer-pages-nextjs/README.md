# Examen 6 : Créer des Pages Next.js - Guide Pratique

## Description

Ce cours pratique montre comment créer concrètement tous les types de fichiers Next.js (layout, page, loading, error) avec des exemples réels, du code complet et commenté, production-ready.

## Contenu

### Cours (6 modules pratiques)

**[00-INTRODUCTION(COURS).md](./00-INTRODUCTION(COURS).md)** - Présentation et objectifs

**[01-CREER-LAYOUT(COURS).md](./01-CREER-LAYOUT(COURS).md)** - Layouts racine, sections, imbriqués, avec navigation

**[02-CREER-PAGE(COURS).md](./02-CREER-PAGE(COURS).md)** - Pages Server/Client, fetch données, formulaires

**[03-CREER-LOADING(COURS).md](./03-CREER-LOADING(COURS).md)** - Spinners, skeletons, progress bars

**[04-CREER-ERROR(COURS).md](./04-CREER-ERROR(COURS).md)** - Gestion d'erreurs, reset, messages adaptés

**[05-FICHIERS-AVANCES(COURS).md](./05-FICHIERS-AVANCES(COURS).md)** - template.tsx, not-found.tsx, API routes

**[06-APPLICATION-COMPLETE(COURS).md](./06-APPLICATION-COMPLETE(COURS).md)** - Application blog complète avec tous les fichiers

### Évaluation

**[07-QUIZ-QUESTIONS(OBLIGATOIRE).md](./07-QUIZ-QUESTIONS(OBLIGATOIRE).md)** - 25 questions à choix multiples

**[08-QUIZ-REPONSES(OBLIGATOIRE).md](./08-QUIZ-REPONSES(OBLIGATOIRE).md)** - Corrections avec explications

**[09-EXERCICES(OPTIONNEL).md](./09-EXERCICES(OPTIONNEL).md)** - 4 exercices pratiques + 2 questions ouvertes

### Navigation

**[INDEX.md](./INDEX.md)** - Index complet avec vue d'ensemble et progression recommandée

## Approche pédagogique

Ce cours est **100% pratique**. Chaque module contient du code complet, commenté, et fonctionnel que vous pouvez copier et adapter à vos projets.

**Pas de théorie abstraite** : Que du code réel, des structures concrètes, et des patterns éprouvés.

## Exemples de code inclus

### layout.tsx
- Layout racine avec Clerk et NextAuth
- Layout auth (centré, fond coloré)
- Layout dashboard (sidebar + header)
- Layout settings (navigation tabs)
- Patterns Server/Client séparés

### page.tsx
- Page d'accueil avec hero et sections
- Page liste avec fetch Prisma
- Page détail avec relations
- Page dashboard avec stats
- Page formulaire avec validation
- Metadata dynamique

### loading.tsx
- Spinner simple
- Skeleton grid (utilisateurs, produits)
- Skeleton tableau (admin)
- Progress bar animée
- Skeleton multi-sections

### error.tsx
- Error globale professionnelle
- Error auth spécifique
- Error avec catégories (réseau, DB, auth)
- Logging vers Sentry
- UI rassurante avec recovery

### API routes
- CRUD complet avec validation Zod
- Route dynamique [id]
- Pagination et query params
- Authentification et autorisation
- Codes HTTP appropriés

## Comment utiliser ce cours

1. **Prérequis** : Avoir suivi examen-5 (comprendre les concepts)
2. Commencez par [INDEX.md](./INDEX.md)
3. **Copiez le code** : Les exemples sont prêts à l'emploi
4. **Adaptez** : Modifiez selon vos besoins
5. **Testez** : Vérifiez que tout fonctionne
6. Quiz pour valider la compréhension

## Durée estimée

- **Lecture + code :** 5-6 heures
- **Quiz :** 30 minutes
- **Exercices :** 5-6 heures
- **Total :** 10-13 heures pour maîtrise pratique complète

## Public cible

- Développeurs ayant suivi examen-5 (concepts)
- Personnes voulant du code concret et réutilisable
- Développeurs cherchant des patterns production-ready
- Équipes voulant standardiser leurs composants
- Débutants Next.js voulant des exemples complets

## Prérequis

- Avoir suivi examen-5 ou comprendre les concepts Next.js
- React/TypeScript de base
- Next.js 14 installé
- Tailwind CSS (pour les exemples de style)

## Objectifs d'apprentissage

Après ce cours, vous serez capable de :

1. Créer des layouts professionnels pour toutes les sections
2. Implémenter des pages avec fetch optimisé
3. Créer des loading states avec skeletons
4. Gérer les erreurs de manière élégante
5. Structurer des API routes CRUD complètes
6. Construire une application complète de A à Z
7. Appliquer les bonnes pratiques Next.js

## Structure du quiz

**25 questions à choix multiples** :
- 5 questions sur layout.tsx
- 5 questions sur page.tsx
- 5 questions sur loading.tsx
- 5 questions sur error.tsx
- 5 questions sur API routes

**4 exercices pratiques** :
1. Application e-commerce complète
2. Dashboard analytics avec skeletons
3. Système settings avec tabs
4. Améliorer du code existant

**2 questions ouvertes** :
1. Architecturer une plateforme LMS
2. Techniques de performance et UX

**Notation sur 50 points (quiz uniquement)**

## Code prêt à l'emploi

Tous les exemples de ce cours sont :
- **Complets** : Pas de code manquant ou ...
- **Commentés** : Explications inline
- **Typés** : TypeScript strict
- **Styled** : Tailwind CSS professionnel
- **Fonctionnels** : Testés et validés
- **Production-ready** : Sécurité et performances

## Complémentarité avec examen-5

### Examen-5 (Théorie)
**Question :** Qu'est-ce qu'un layout.tsx ?
**Réponse :** Un fichier qui définit une UI persistante...

### Examen-6 (Pratique)
**Question :** Comment créer un layout.tsx ?
**Réponse :** Voici le code complet...
```typescript
export default function RootLayout({ children }) {
  return <html><body>{children}</body></html>
}
```

**Recommandation :** Suivez examen-5 puis examen-6 pour une compréhension complète.

## Patterns de code inclus

### Structure recommandée
- Organization par feature
- Colocation des composants
- Séparation Server/Client

### Bonnes pratiques
- Fetch parallèle avec Promise.all
- Metadata dynamique
- Loading skeletons
- Error boundaries
- Validation Zod
- Types TypeScript stricts

### UI professionnelle
- Tailwind CSS moderne
- Composants shadcn/ui
- Animations subtiles
- Responsive design
- Accessibility

## Commence par : [00-INTRODUCTION(COURS).md](./00-INTRODUCTION(COURS).md)

Ou directement le code : [01-CREER-LAYOUT(COURS).md](./01-CREER-LAYOUT(COURS).md)


# Quiz : Réponses et Explications

## Section 1 : App Router vs Pages Router

### Question 1
**Réponse : B** - App Router utilise React Server Components par défaut

**Explication :** L'App Router introduit les Server Components comme paradigme par défaut, permettant de fetch des données directement dans les composants sans getServerSideProps().

### Question 2
**Réponse : B** - Next.js 13

**Explication :** L'App Router a été introduit dans Next.js 13 (2022) et amélioré dans Next.js 14.

### Question 3
**Réponse : B** - Oui, les deux peuvent coexister

**Explication :** Next.js 13+ supporte app/ et pages/ simultanément, permettant une migration progressive. Les routes dans app/ ont la priorité.

### Question 4
**Réponse : B** - app/

**Explication :** L'App Router utilise le dossier app/ à la racine du projet. Pages Router utilisait pages/.

### Question 5
**Réponse : C** - getServerSideProps()

**Explication :** Dans Pages Router, getServerSideProps() était la fonction pour fetch des données côté serveur avant le rendu.

---

## Section 2 : Fichiers Spéciaux

### Question 6
**Réponse : B** - Définir une UI qui persiste entre les navigations et wrappe les pages enfants

**Explication :** layout.tsx définit une structure UI (nav, sidebar, footer) qui ne se recharge pas lors des navigations. Le state React du layout est préservé.

### Question 7
**Réponse : B** - layout wrappe les enfants et persiste, page définit le contenu unique

**Explication :** layout.tsx est la structure persistante, page.tsx est le contenu spécifique de chaque route. Les layouts s'imbriquent, les pages sont les feuilles terminales.

### Question 8
**Réponse : B** - Oui, il doit définir <html> et <body>

**Explication :** Le layout racine app/layout.tsx est obligatoire et doit retourner les balises html et body. C'est le point d'entrée de l'application.

### Question 9
**Réponse : B** - Afficher un fallback pendant que le contenu de la page se charge

**Explication :** loading.tsx s'affiche automatiquement pendant que page.tsx fait des fetch asynchrones. Next.js wrappe la page dans un Suspense.

### Question 10
**Réponse : B** - Client Component (avec 'use client')

**Explication :** error.tsx doit être un Client Component car il utilise des hooks React (pour gérer reset et l'état d'erreur).

---

## Section 3 : Route Groups

### Question 11
**Réponse : B** - Un route group qui n'apparaît pas dans l'URL

**Explication :** Les parenthèses indiquent un route group. Le nom du dossier est utilisé pour l'organisation du code mais n'apparaît pas dans l'URL finale.

### Question 12
**Réponse : C** - /signin

**Explication :** Le route group (auth) n'apparaît pas dans l'URL. Seuls les dossiers sans parenthèses créent des segments d'URL.

### Question 13
**Réponse : B** - Pour organiser le code et avoir différents layouts sans affecter les URLs

**Explication :** Les route groups permettent d'organiser logiquement le code et d'avoir des layouts différents pour différentes sections sans ajouter de segments d'URL.

### Question 14
**Réponse : B** - Oui, chaque route group peut avoir son propre layout

**Explication :** C'est un des cas d'usage principaux des route groups : avoir des layouts différents (auth centré, dashboard avec sidebar) sans affecter les URLs.

### Question 15
**Réponse : B** - Erreur de build - conflit de routes

**Explication :** Vous ne pouvez pas avoir deux page.tsx qui créent la même URL finale. Next.js lèvera une erreur de conflit de routes.

---

## Section 4 : Routes Dynamiques

### Question 16
**Réponse : B** - Un seul segment d'URL

**Explication :** [id] capture exactement un segment. /users/123 → id="123", mais /users/123/posts ne matche pas.

### Question 17
**Réponse : B** - [...slug] capture un ou plusieurs segments, [[...slug]] capture zéro ou plusieurs

**Explication :** [...slug] nécessite au moins un segment. [[...slug]] (double crochets) est optionnel et matche aussi la route sans segments.

### Question 18
**Réponse : B** - props.params.slug

**Explication :** Dans App Router, les paramètres dynamiques sont passés via props.params. Le nom de la clé correspond au nom du dossier entre crochets.

### Question 19
**Réponse : A** - slug = undefined ou []

**Explication :** Le catch-all optionnel [[...slug]] matche la route sans segments. Dans ce cas, params.slug est undefined ou un tableau vide selon l'implémentation.

### Question 20
**Réponse : B** - Pour gérer plusieurs étapes d'auth avec son propre routing interne

**Explication :** Clerk a plusieurs étapes (connexion, vérification email, 2FA, etc.). Le catch-all optionnel permet de capturer tous ces chemins tout en permettant l'accès à /sign-in simple.

---

## Section 5 : Migrations Prisma

### Question 21
**Réponse : C** - npx prisma migrate deploy

**Explication :** migrate deploy applique les migrations sans en créer de nouvelles. C'est la commande sûre pour la production.

### Question 22
**Réponse : A** - db push est plus rapide mais ne crée pas de migration, migrate dev crée des fichiers de migration

**Explication :** db push synchronise directement sans historique. migrate dev crée des fichiers SQL versionnés. db push pour prototypage, migrate dev pour changements permanents.

### Question 23
**Réponse : B** - prisma/migrations/

**Explication :** Les migrations sont stockées dans prisma/migrations/ avec un dossier par migration contenant migration.sql.

### Question 24
**Réponse : B** - Les commandes SQL pour faire évoluer la base de données

**Explication :** migration.sql contient le SQL généré par Prisma (CREATE TABLE, ALTER TABLE, etc.) pour transformer la base de l'état N à N+1.

### Question 25
**Réponse : B** - Via la table _prisma_migrations dans la base de données

**Explication :** Prisma crée automatiquement une table _prisma_migrations qui enregistre quelles migrations ont été appliquées et quand.

---

## Section 6 : Architecture Avancée

### Question 26
**Réponse : B** - Colocation - près de où ils sont utilisés

**Explication :** La meilleure pratique moderne est de placer les composants près de leur utilisation. Un composant utilisé uniquement dans /dashboard devrait être dans app/dashboard/components/.

### Question 27
**Réponse : B** - Server Components

**Explication :** Dans App Router, tous les composants sont Server Components par défaut. Ajoutez 'use client' pour en faire des Client Components.

### Question 28
**Réponse : B** - Ajouter 'use client' en haut du fichier

**Explication :** Les hooks React (useState, useEffect, etc.) ne fonctionnent que dans les Client Components. La directive 'use client' marque le composant comme client.

### Question 29
**Réponse : B** - Oui, le composant peut être async et fetch directement

**Explication :** Les Server Components peuvent être async et faire des fetch, accéder à Prisma, lire des fichiers, etc. C'est une des grandes innovations de l'App Router.

### Question 30
**Réponse : B** - app/ a la priorité

**Explication :** Si app/ et pages/ définissent la même route, app/ est utilisé. Cela permet une migration progressive.

---

## Barème

**Total : 60 points (30 questions × 2 points)**

- 54-60 : Excellente maîtrise de Next.js
- 45-53 : Bonne compréhension
- 36-44 : Compréhension satisfaisante
- 30-35 : Compréhension partielle
- <30 : Révision nécessaire


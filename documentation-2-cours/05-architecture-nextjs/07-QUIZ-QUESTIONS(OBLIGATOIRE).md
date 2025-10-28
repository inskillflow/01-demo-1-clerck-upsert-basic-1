# Quiz : Architecture Next.js et Routing

## Instructions

- 30 questions à choix multiples
- Durée estimée : 40 minutes
- Cochez votre réponse pour chaque question
- Les réponses sont dans le fichier 08-QUIZ-REPONSES(OBLIGATOIRE).md

---

## Section 1 : App Router vs Pages Router

### Question 1
Quelle est la principale différence entre App Router et Pages Router ?

- [ ] A) App Router est plus rapide
- [ ] B) App Router utilise React Server Components par défaut
- [ ] C) Pages Router est obsolète
- [ ] D) Il n'y a pas de différence

### Question 2
Dans quelle version de Next.js l'App Router a-t-il été introduit ?

- [ ] A) Next.js 12
- [ ] B) Next.js 13
- [ ] C) Next.js 14
- [ ] D) Next.js 15

### Question 3
Peut-on utiliser App Router et Pages Router dans le même projet ?

- [ ] A) Non, il faut choisir l'un ou l'autre
- [ ] B) Oui, les deux peuvent coexister
- [ ] C) Seulement en développement
- [ ] D) Seulement avec une configuration spéciale

### Question 4
Quel dossier définit les routes dans App Router ?

- [ ] A) pages/
- [ ] B) app/
- [ ] C) routes/
- [ ] D) src/

### Question 5
Quelle commande utilisait-on pour fetch des données côté serveur dans Pages Router ?

- [ ] A) getServerData()
- [ ] B) fetchData()
- [ ] C) getServerSideProps()
- [ ] D) serverFetch()

---

## Section 2 : Fichiers Spéciaux

### Question 6
À quoi sert le fichier layout.tsx ?

- [ ] A) Définir le contenu de la page
- [ ] B) Définir une UI qui persiste entre les navigations et wrappe les pages enfants
- [ ] C) Gérer les erreurs
- [ ] D) Afficher un loading

### Question 7
Quelle est la différence entre layout.tsx et page.tsx ?

- [ ] A) Aucune différence
- [ ] B) layout wrappe les enfants et persiste, page définit le contenu unique
- [ ] C) page est plus rapide
- [ ] D) layout est optionnel

### Question 8
Le fichier app/layout.tsx est-il obligatoire ?

- [ ] A) Non, c'est optionnel
- [ ] B) Oui, il doit définir <html> et <body>
- [ ] C) Seulement en production
- [ ] D) Seulement avec TypeScript

### Question 9
À quoi sert le fichier loading.tsx ?

- [ ] A) Charger des images
- [ ] B) Afficher un fallback pendant que le contenu de la page se charge
- [ ] C) Optimiser les performances
- [ ] D) Gérer les erreurs

### Question 10
Le fichier error.tsx doit-il être un Client ou Server Component ?

- [ ] A) Server Component
- [ ] B) Client Component (avec 'use client')
- [ ] C) Les deux fonctionnent
- [ ] D) Ni l'un ni l'autre

---

## Section 3 : Route Groups

### Question 11
Que signifie un dossier nommé (auth) dans l'App Router ?

- [ ] A) C'est une erreur de syntaxe
- [ ] B) Un route group qui n'apparaît pas dans l'URL
- [ ] C) Une route protégée
- [ ] D) Un dossier caché

### Question 12
Quelle URL est créée par app/(auth)/signin/page.tsx ?

- [ ] A) /(auth)/signin
- [ ] B) /auth/signin
- [ ] C) /signin
- [ ] D) Aucune URL

### Question 13
Pourquoi utiliser des route groups ?

- [ ] A) Pour améliorer les performances
- [ ] B) Pour organiser le code et avoir différents layouts sans affecter les URLs
- [ ] C) C'est obligatoire
- [ ] D) Pour la sécurité

### Question 14
Peut-on avoir un layout.tsx dans un route group ?

- [ ] A) Non, les layouts ne fonctionnent pas avec les route groups
- [ ] B) Oui, chaque route group peut avoir son propre layout
- [ ] C) Seulement un layout par projet
- [ ] D) Seulement en production

### Question 15
Que se passe-t-il si deux route groups ont un page.tsx pour la même URL ?

- [ ] A) Le premier est utilisé
- [ ] B) Erreur de build - conflit de routes
- [ ] C) Next.js les fusionne
- [ ] D) L'URL affiche les deux pages

---

## Section 4 : Routes Dynamiques

### Question 16
Que capture un dossier nommé [id] ?

- [ ] A) Seulement des nombres
- [ ] B) Un seul segment d'URL
- [ ] C) Tous les segments restants
- [ ] D) Rien

### Question 17
Quelle est la différence entre [...slug] et [[...slug]] ?

- [ ] A) Aucune différence
- [ ] B) [...slug] capture un ou plusieurs segments, [[...slug]] capture zéro ou plusieurs
- [ ] C) [[...slug]] est plus rapide
- [ ] D) [...slug] est obsolète

### Question 18
Pour la route app/blog/[slug]/page.tsx, comment accéder au slug dans le composant ?

- [ ] A) useParams()
- [ ] B) props.params.slug
- [ ] C) window.location
- [ ] D) request.slug

### Question 19
Que capture /docs/[[...slug]]/page.tsx pour l'URL /docs ?

- [ ] A) slug = undefined ou []
- [ ] B) Erreur 404
- [ ] C) slug = ["docs"]
- [ ] D) Ne capture rien

### Question 20
Pourquoi Clerk utilise-t-il [[...rest]] pour ses routes d'authentification ?

- [ ] A) Pour la sécurité
- [ ] B) Pour gérer plusieurs étapes d'auth avec son propre routing interne
- [ ] C) C'est une erreur
- [ ] D) Pour améliorer les performances

---

## Section 5 : Migrations Prisma

### Question 21
Quelle commande Prisma doit-on utiliser en production ?

- [ ] A) npx prisma db push
- [ ] B) npx prisma migrate dev
- [ ] C) npx prisma migrate deploy
- [ ] D) npx prisma generate

### Question 22
Quelle est la différence entre db push et migrate dev ?

- [ ] A) db push est plus rapide mais ne crée pas de migration, migrate dev crée des fichiers de migration
- [ ] B) Aucune différence
- [ ] C) migrate dev est obsolète
- [ ] D) db push fonctionne uniquement en production

### Question 23
Où sont stockées les migrations Prisma ?

- [ ] A) node_modules/
- [ ] B) prisma/migrations/
- [ ] C) .next/
- [ ] D) Dans la base de données uniquement

### Question 24
Que contient le fichier migration.sql ?

- [ ] A) Le schéma Prisma
- [ ] B) Les commandes SQL pour faire évoluer la base de données
- [ ] C) Les données de la base
- [ ] D) La configuration Prisma

### Question 25
Comment Prisma sait-il quelles migrations ont déjà été appliquées ?

- [ ] A) En lisant un fichier local
- [ ] B) Via la table _prisma_migrations dans la base de données
- [ ] C) En comparant les fichiers
- [ ] D) C'est manuel

---

## Section 6 : Architecture Avancée

### Question 26
Quelle est la meilleure pratique pour organiser les composants ?

- [ ] A) Tout dans components/
- [ ] B) Colocation - près de où ils sont utilisés
- [ ] C) Un dossier par type de composant
- [ ] D) Dans app/ uniquement

### Question 27
Les composants dans app/ sont par défaut :

- [ ] A) Client Components
- [ ] B) Server Components
- [ ] C) Les deux
- [ ] D) Ni l'un ni l'autre

### Question 28
Pour utiliser useState dans App Router, que doit-on faire ?

- [ ] A) Rien, ça fonctionne automatiquement
- [ ] B) Ajouter 'use client' en haut du fichier
- [ ] C) Importer depuis next/client
- [ ] D) Utiliser getServerSideProps

### Question 29
Peut-on faire des fetch directs dans un Server Component ?

- [ ] A) Non, il faut utiliser getServerSideProps
- [ ] B) Oui, le composant peut être async et fetch directement
- [ ] C) Seulement dans les API routes
- [ ] D) C'est déconseillé

### Question 30
Quelle est la priorité si app/ et pages/ contiennent la même route ?

- [ ] A) pages/ a la priorité
- [ ] B) app/ a la priorité
- [ ] C) Erreur de build
- [ ] D) Les deux s'affichent

---

**Voir le fichier 08-QUIZ-REPONSES(OBLIGATOIRE).md pour les corrections**


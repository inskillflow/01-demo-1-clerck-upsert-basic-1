# Quiz : Architecture Clerk + Prisma + Next.js

## Instructions

- 20 questions à choix multiples
- Durée estimée : 30 minutes
- Cochez votre réponse pour chaque question
- Les réponses sont dans le fichier 06-QUIZ-REPONSES(OBLIGATOIRE).md

---

## Section 1 : Concepts Fondamentaux

### Question 1
Pourquoi est-il déconseillé de coder soi-même un système d'authentification complet ?

- [ ] A) C'est trop difficile techniquement
- [ ] B) Les risques de sécurité sont trop élevés et la maintenance est complexe
- [ ] C) C'est impossible sans une équipe de 10 personnes
- [ ] D) Les utilisateurs n'aiment pas les systèmes personnalisés

### Question 2
Quelle est la principale différence entre Clerk et NextAuth ?

- [ ] A) Clerk est plus rapide que NextAuth
- [ ] B) NextAuth ne fonctionne qu'avec MySQL
- [ ] C) Clerk est un service hébergé payant, NextAuth est une bibliothèque gratuite
- [ ] D) Ils font exactement la même chose

### Question 3
Qu'est-ce qu'un JWT (JSON Web Token) dans le contexte de l'authentification ?

- [ ] A) Un fichier JSON stocké sur le serveur
- [ ] B) Un token signé cryptographiquement contenant les informations d'authentification
- [ ] C) Une base de données pour les utilisateurs
- [ ] D) Un protocole réseau

### Question 4
Quel est le principal avantage de Clerk pour un MVP ?

- [ ] A) C'est gratuit à vie
- [ ] B) Démarrage rapide avec UI fournie et sécurité gérée
- [ ] C) Il ne nécessite pas de base de données
- [ ] D) Il fonctionne sans Internet

---

## Section 2 : Clerk

### Question 5
Quel composant Clerk permet d'afficher du contenu uniquement si l'utilisateur est connecté ?

- [ ] A) `<AuthCheck>`
- [ ] B) `<SignedIn>`
- [ ] C) `<Protected>`
- [ ] D) `<RequireAuth>`

### Question 6
Quelle est la différence entre `auth()` et `currentUser()` de Clerk ?

- [ ] A) Aucune différence, ce sont des alias
- [ ] B) `auth()` est plus rapide mais donne moins d'informations, `currentUser()` fait un appel API complet
- [ ] C) `auth()` est pour le client, `currentUser()` pour le serveur
- [ ] D) `currentUser()` est obsolète

### Question 7
Comment Clerk stocke-t-il les sessions utilisateur côté navigateur ?

- [ ] A) Dans localStorage
- [ ] B) Dans sessionStorage
- [ ] C) Dans des cookies httpOnly et secure
- [ ] D) Dans IndexedDB

---

## Section 3 : Prisma

### Question 8
Quel problème un ORM comme Prisma résout-il principalement ?

- [ ] A) Il accélère les requêtes SQL
- [ ] B) Il remplace PostgreSQL par une meilleure base de données
- [ ] C) Il permet d'interagir avec la base de données en JavaScript typé plutôt qu'en SQL brut
- [ ] D) Il crypte automatiquement toutes les données

### Question 9
À quoi sert le fichier `schema.prisma` ?

- [ ] A) À configurer les variables d'environnement
- [ ] B) À définir la structure de la base de données de manière déclarative
- [ ] C) À stocker les données des utilisateurs
- [ ] D) À générer l'interface utilisateur

### Question 10
Que fait exactement une opération `upsert` ?

- [ ] A) Elle met à jour ou insère selon si l'enregistrement existe déjà
- [ ] B) Elle supprime puis recrée l'enregistrement
- [ ] C) Elle fait un backup de la base de données
- [ ] D) Elle vérifie l'intégrité des données

### Question 11
Quel est l'avantage principal de la génération automatique du client Prisma ?

- [ ] A) Le code s'exécute plus rapidement
- [ ] B) TypeScript connaît exactement la structure de votre base de données
- [ ] C) La base de données utilise moins de mémoire
- [ ] D) Les migrations sont automatiques

---

## Section 4 : Synchronisation

### Question 12
Quelles sont les deux principales stratégies pour synchroniser Clerk avec votre base de données ?

- [ ] A) REST et GraphQL
- [ ] B) Webhooks et Upsert post-login
- [ ] C) Push et Pull
- [ ] D) Synchrone et Asynchrone

### Question 13
Pourquoi le projet utilise-t-il l'approche Upsert plutôt que les Webhooks ?

- [ ] A) Les webhooks ne fonctionnent pas avec Clerk
- [ ] B) C'est plus simple à implémenter et suffisant pour la majorité des cas
- [ ] C) L'upsert est plus rapide
- [ ] D) Les webhooks sont obsolètes

### Question 14
Pourquoi la fonction `syncUser()` utilise-t-elle `import 'server-only'` ?

- [ ] A) Pour améliorer les performances
- [ ] B) Pour empêcher son import côté client et protéger les secrets
- [ ] C) C'est une convention de nommage
- [ ] D) Pour activer le mode production

### Question 15
Quel est le rôle de la route `/welcome` dans l'architecture ?

- [ ] A) Afficher un message de bienvenue pendant 5 secondes
- [ ] B) Synchroniser l'utilisateur puis rediriger immédiatement
- [ ] C) Demander les préférences de l'utilisateur
- [ ] D) Envoyer un email de bienvenue

### Question 16
Pourquoi avoir un champ `id` séparé du `clerkId` dans le modèle User ?

- [ ] A) C'est obligatoire avec Prisma
- [ ] B) Pour découpler la base de données de Clerk et faciliter une migration future
- [ ] C) Pour améliorer les performances
- [ ] D) Il n'y a aucune raison, c'est une erreur

---

## Section 5 : Architecture Globale

### Question 17
Dans Next.js 14, quelle est la caractéristique principale des Server Components ?

- [ ] A) Ils s'exécutent uniquement côté serveur et peuvent accéder directement à la base de données
- [ ] B) Ils sont plus rapides que les Client Components
- [ ] C) Ils ne peuvent pas utiliser TypeScript
- [ ] D) Ils remplacent les API routes

### Question 18
Quel est le rôle du middleware Clerk dans `middleware.ts` ?

- [ ] A) Gérer les erreurs de l'application
- [ ] B) Vérifier l'authentification avant chaque requête et rediriger si nécessaire
- [ ] C) Compresser les réponses HTTP
- [ ] D) Logger toutes les requêtes

### Question 19
Pourquoi les clés API Clerk sont-elles stockées dans `.env.local` et non dans le code ?

- [ ] A) Pour des raisons de performance
- [ ] B) C'est plus facile à modifier
- [ ] C) Pour la sécurité et éviter de commiter les secrets dans Git
- [ ] D) C'est obligatoire avec Next.js

### Question 20
Que signifie la syntaxe `[[...rest]]` dans les routes Clerk (`/sign-in/[[...rest]]`) ?

- [ ] A) C'est un commentaire
- [ ] B) Ça capture tous les segments d'URL optionnels pour le routing interne de Clerk
- [ ] C) C'est une erreur de syntaxe
- [ ] D) Ça définit un paramètre obligatoire

---

**Voir le fichier 06-QUIZ-REPONSES(OBLIGATOIRE).md pour les corrections**


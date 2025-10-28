# Quiz : NextAuth.js et Authentification Open Source

## Instructions

- 25 questions à choix multiples
- Durée estimée : 35 minutes
- Cochez votre réponse pour chaque question
- Les réponses sont dans le fichier 08-QUIZ-REPONSES(OBLIGATOIRE).md

---

## Section 1 : Concepts NextAuth

### Question 1
Quelle est la principale différence entre NextAuth et Clerk ?

- [ ] A) NextAuth est plus rapide
- [ ] B) NextAuth est une bibliothèque open-source gratuite, Clerk est un service SaaS payant
- [ ] C) NextAuth ne fonctionne qu'avec PostgreSQL
- [ ] D) Clerk est obsolète

### Question 2
Combien de providers OAuth NextAuth supporte-t-il nativement ?

- [ ] A) Seulement Google et GitHub
- [ ] B) Environ 10 providers
- [ ] C) Plus de 40 providers différents
- [ ] D) Il ne supporte pas OAuth

### Question 3
Qu'est-ce que le Prisma Adapter dans NextAuth ?

- [ ] A) Un outil pour générer le schéma Prisma
- [ ] B) Un composant qui synchronise automatiquement NextAuth avec votre base de données
- [ ] C) Un type de base de données
- [ ] D) Un provider d'authentification

### Question 4
Quelle commande génère un secret sécurisé pour NEXTAUTH_SECRET ?

- [ ] A) `npm run generate-secret`
- [ ] B) `openssl rand -base64 32`
- [ ] C) `nextauth generate`
- [ ] D) `node secret.js`

### Question 5
Pourquoi NextAuth nécessite-t-il une route API spéciale `[...nextauth]` ?

- [ ] A) C'est une erreur de syntaxe
- [ ] B) Pour capturer tous les endpoints d'authentification (signin, signout, session, callback)
- [ ] C) Pour améliorer les performances
- [ ] D) C'est optionnel

---

## Section 2 : Schéma Prisma

### Question 6
Quelles tables sont OBLIGATOIRES pour NextAuth avec stratégie database ?

- [ ] A) User uniquement
- [ ] B) User et Account
- [ ] C) User, Account, Session, VerificationToken
- [ ] D) Aucune table n'est obligatoire

### Question 7
À quoi sert la table Account dans NextAuth ?

- [ ] A) Stocker les mots de passe
- [ ] B) Stocker les connexions OAuth (un user peut avoir plusieurs accounts)
- [ ] C) Gérer les rôles
- [ ] D) Logger les connexions

### Question 8
Le champ `hashedPassword` dans User est nécessaire pour quel provider ?

- [ ] A) Google OAuth
- [ ] B) GitHub OAuth
- [ ] C) Credentials (email + password)
- [ ] D) Tous les providers

### Question 9
Que contient la table VerificationToken ?

- [ ] A) Les mots de passe hashés
- [ ] B) Les tokens pour les magic links email
- [ ] C) Les JWT de session
- [ ] D) Les tokens OAuth

### Question 10
Peut-on ajouter des champs personnalisés au modèle User de NextAuth ?

- [ ] A) Non, le schéma est fixe
- [ ] B) Oui, on peut ajouter autant de champs qu'on veut en plus des obligatoires
- [ ] C) Oui mais seulement 3 champs maximum
- [ ] D) Seulement en mode production

---

## Section 3 : Stratégies de Session

### Question 11
Quelle est la différence entre stratégie JWT et stratégie Database ?

- [ ] A) JWT stocke la session dans un cookie, Database dans la base de données
- [ ] B) JWT est plus lent que Database
- [ ] C) Database est obsolète
- [ ] D) Il n'y a pas de différence

### Question 12
Quel est l'avantage principal de la stratégie JWT ?

- [ ] A) Plus sécurisé
- [ ] B) Pas de requête DB pour vérifier la session, meilleure performance
- [ ] C) Révocation instantanée possible
- [ ] D) Stockage de données illimité

### Question 13
Quel est l'avantage principal de la stratégie Database ?

- [ ] A) Plus rapide que JWT
- [ ] B) Révocation instantanée des sessions en supprimant de la DB
- [ ] C) Pas besoin de base de données
- [ ] D) Configuration plus simple

### Question 14
Pour une application serverless sur Vercel, quelle stratégie est recommandée ?

- [ ] A) Database obligatoirement
- [ ] B) JWT pour éviter les requêtes DB fréquentes
- [ ] C) Les deux sont équivalentes
- [ ] D) NextAuth ne fonctionne pas sur Vercel

### Question 15
Comment révoquer immédiatement une session avec stratégie JWT ?

- [ ] A) Supprimer le cookie côté client
- [ ] B) C'est impossible, le JWT reste valide jusqu'à expiration
- [ ] C) Appeler signOut()
- [ ] D) Redémarrer le serveur

---

## Section 4 : Providers

### Question 16
Pour le provider Credentials, où doit-on hasher le mot de passe ?

- [ ] A) Côté client dans le navigateur
- [ ] B) Côté serveur dans l'API route d'inscription
- [ ] C) Dans le callback JWT
- [ ] D) Pas besoin de hasher

### Question 17
Quelle bibliothèque est recommandée pour hasher les mots de passe ?

- [ ] A) crypto natif
- [ ] B) md5
- [ ] C) bcryptjs
- [ ] D) sha256

### Question 18
Que retourne la fonction `authorize()` du provider Credentials en cas de succès ?

- [ ] A) Un boolean `true`
- [ ] B) Un objet utilisateur avec id, email, name
- [ ] C) Un token JWT
- [ ] D) Une session

### Question 19
Pour configurer Google OAuth, où doit-on créer les credentials ?

- [ ] A) Dans NextAuth directement
- [ ] B) Dans Google Cloud Console
- [ ] C) Dans le code de l'application
- [ ] D) Dans Prisma Studio

### Question 20
Quelle est l'URL de callback pour GitHub OAuth avec NextAuth ?

- [ ] A) `/api/auth/github`
- [ ] B) `/auth/callback`
- [ ] C) `/api/auth/callback/github`
- [ ] D) `/github/callback`

---

## Section 5 : Sécurité et Protection

### Question 21
Comment protéger une route serveur avec NextAuth ?

- [ ] A) Utiliser `getServerSession()` et rediriger si null
- [ ] B) Utiliser `useSession()` dans un Server Component
- [ ] C) Ajouter un middleware Clerk
- [ ] D) C'est automatique

### Question 22
Le hook `useSession()` fonctionne dans quel type de composant ?

- [ ] A) Server Components uniquement
- [ ] B) Client Components uniquement
- [ ] C) Les deux
- [ ] D) Aucun, c'est obsolète

### Question 23
Quel flag de cookie NextAuth configure-t-il automatiquement pour la sécurité ?

- [ ] A) httpOnly uniquement
- [ ] B) secure uniquement
- [ ] C) httpOnly, secure, et sameSite
- [ ] D) Aucun, vous devez les configurer manuellement

### Question 24
À quoi sert le callback JWT dans NextAuth ?

- [ ] A) Hasher les mots de passe
- [ ] B) Ajouter des données personnalisées au token JWT
- [ ] C) Vérifier les signatures
- [ ] D) Créer des utilisateurs

### Question 25
Quelle est la meilleure pratique pour gérer les rôles avec NextAuth ?

- [ ] A) Stocker le rôle dans le JWT via les callbacks
- [ ] B) Créer une table séparée pour les rôles
- [ ] C) Utiliser les metadata Clerk
- [ ] D) Les rôles sont automatiques

---

**Voir le fichier 08-QUIZ-REPONSES(OBLIGATOIRE).md pour les corrections**


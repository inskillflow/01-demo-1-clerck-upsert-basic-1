# Module 1 : Fondations NextAuth

## Qu'est-ce que NextAuth.js ?

NextAuth.js est une bibliothèque open-source d'authentification spécialement conçue pour Next.js. Contrairement à Clerk qui est un service hébergé, NextAuth est du code que vous installez et exécutez dans votre propre application.

### L'origine de NextAuth

NextAuth a été créé pour résoudre un problème simple : l'authentification OAuth est complexe à implémenter correctement. Chaque provider (Google, GitHub, Facebook) a sa propre API, ses propres quirks, et ses propres exigences de sécurité.

Plutôt que chaque développeur réimplémente cette complexité, NextAuth fournit une abstraction qui supporte plus de 40 providers différents avec une API unifiée. Vous écrivez le même code que vous utilisiez Google, GitHub, ou Twitter comme provider.

### Philosophie open-source vs SaaS

Comprendre la différence fondamentale entre NextAuth et Clerk est crucial pour faire un choix éclairé.

**NextAuth (bibliothèque) :**
Vous installez une dépendance npm. Le code s'exécute sur votre serveur. Vous êtes responsable de tout : configuration, hébergement, maintenance, sécurité. En contrepartie, vous avez un contrôle total et c'est gratuit à vie.

**Clerk (service SaaS) :**
Vous vous connectez à un service externe. Le code s'exécute sur les serveurs de Clerk. Ils sont responsables de la maintenance et de la sécurité. En contrepartie, vous payez après un certain volume et dépendez de leur service.

### L'architecture de NextAuth

NextAuth repose sur plusieurs composants qui travaillent ensemble :

**L'API Route**
NextAuth nécessite une API route spéciale dans `app/api/auth/[...nextauth]/route.ts`. Cette route gère tous les endpoints d'authentification : login, logout, callback, session, etc.

Le pattern `[...nextauth]` est une route catch-all qui capture tous les segments d'URL. Ainsi, `/api/auth/signin`, `/api/auth/signout`, `/api/auth/session`, etc., sont tous gérés par le même handler.

**Le fichier de configuration**
Vous créez un fichier `lib/auth.ts` qui contient toute la configuration : les providers, les callbacks, les stratégies de session, les pages personnalisées, etc. Ce fichier est le cœur de votre système d'authentification.

**Le Prisma Adapter**
Si vous utilisez une base de données (recommandé pour la production), NextAuth peut synchroniser automatiquement les utilisateurs et sessions via un adapter Prisma. Cet adapter crée et gère les tables nécessaires.

**Le SessionProvider**
Un contexte React qui rend les informations de session disponibles dans toute votre application. Les hooks comme `useSession()` dépendent de ce provider.

### Le schéma de base de données

NextAuth nécessite des tables spécifiques dans votre base de données. Contrairement à Clerk où votre schéma est simple et personnalisé, NextAuth impose une structure précise.

**Tables obligatoires :**

**User** : Stocke les informations de base des utilisateurs (email, nom, photo)

**Account** : Stocke les connexions OAuth (un utilisateur peut avoir plusieurs comptes : Google ET GitHub)

**Session** : Stocke les sessions actives (si stratégie database)

**VerificationToken** : Stocke les tokens pour les magic links email

Ces tables ont des champs spécifiques requis par NextAuth. Vous pouvez ajouter vos propres champs, mais vous ne pouvez pas renommer ou supprimer les champs obligatoires.

### Les stratégies de session

NextAuth offre deux stratégies pour gérer les sessions, chacune avec ses avantages et inconvénients.

**Stratégie JWT (JSON Web Token) :**
La session est stockée dans un cookie JWT signé côté client. Aucune requête base de données n'est nécessaire pour vérifier une session. C'est rapide et scalable, idéal pour les applications serverless.

**Avantages JWT :**
- Pas de requête DB à chaque vérification de session
- Scalabilité horizontale facile
- Fonctionne parfaitement avec Vercel et autres plateformes serverless
- Moins de charge sur la base de données

**Inconvénients JWT :**
- Impossible de révoquer une session instantanément (elle reste valide jusqu'à expiration)
- Le token peut devenir gros si vous stockez beaucoup de données
- Les données du token ne sont pas chiffrées, juste signées (pas de secrets sensibles dedans)

**Stratégie Database :**
Chaque session est stockée dans la base de données. À chaque requête, NextAuth vérifie que la session existe et est valide.

**Avantages Database :**
- Révocation instantanée possible (supprimez la session de la DB)
- Meilleur contrôle et audit
- Données de session peuvent être grandes et complexes
- Détection de sessions multiples facile

**Inconvénients Database :**
- Requête DB à chaque vérification de session
- Moins scalable avec des millions d'utilisateurs
- Plus de charge sur la base de données

Pour la majorité des applications, la stratégie JWT est recommandée. Passez à Database uniquement si vous avez des besoins spécifiques de révocation ou d'audit.

## Comparaison NextAuth vs Clerk

Récapitulons les différences pour clarifier quand utiliser quoi.

### Complexité de configuration

**Clerk :**
Configuration en 10 minutes. Vous ajoutez des clés API, wrappez votre app avec ClerkProvider, et c'est fonctionnel. Les composants UI sont fournis.

**NextAuth :**
Configuration en 1-2 heures. Vous devez configurer les providers OAuth, créer les tables Prisma, implémenter les pages de login/signup, gérer les callbacks, etc.

### Coût

**Clerk :**
Gratuit jusqu'à 10,000 utilisateurs actifs mensuels, puis $25/mois pour 10,000 users supplémentaires.

**NextAuth :**
Totalement gratuit, quel que soit le nombre d'utilisateurs. Vous payez uniquement votre hébergement (base de données, serveur), pas le service d'authentification lui-même.

### Contrôle et personnalisation

**Clerk :**
Contrôle limité aux options proposées. Vous pouvez personnaliser les couleurs et quelques éléments de l'UI, mais l'architecture globale est fixée par Clerk.

**NextAuth :**
Contrôle total. Vous pouvez personnaliser chaque aspect : UI complète, logique de connexion, stockage des données, providers, callbacks, etc.

### Dépendance externe

**Clerk :**
Dépendance forte. Si Clerk a une panne, votre authentification ne fonctionne plus. Si Clerk change ses prix ou ferme, vous devez migrer.

**NextAuth :**
Aucune dépendance externe. Le code s'exécute sur votre serveur. Même si NextAuth cessait d'être maintenu, votre code continuerait de fonctionner.

### Maintenance

**Clerk :**
Clerk s'occupe des mises à jour de sécurité, des nouveaux providers OAuth, des changements d'API des providers, etc.

**NextAuth :**
Vous devez suivre les mises à jour de NextAuth, tester les migrations, et gérer les breaking changes lors des montées de version.

### Fonctionnalités avancées

**Clerk :**
2FA, magic links, OAuth social, gestion d'organisations, webhooks, tout est inclus et fonctionne immédiatement.

**NextAuth :**
OAuth social et magic links inclus. 2FA et organisations nécessitent une implémentation personnalisée. Plus flexible mais plus de travail.

## Quand choisir NextAuth

NextAuth est le bon choix dans ces situations :

**Budget limité sur le long terme**
Si vous prévoyez des dizaines de milliers d'utilisateurs, les coûts Clerk peuvent devenir significatifs. NextAuth reste gratuit.

**Besoin de contrôle total**
Si vous avez des exigences spécifiques que Clerk ne peut pas satisfaire (logique métier complexe, intégrations spéciales, conformité particulière).

**Éviter le vendor lock-in**
Si vous voulez éviter de dépendre d'un service externe qui pourrait changer ses conditions, augmenter ses prix, ou fermer.

**Projet open-source**
Si votre projet est open-source, utiliser une dépendance gratuite comme NextAuth est plus cohérent qu'une dépendance vers un service payant.

**Expertise technique disponible**
Si votre équipe a l'expertise pour configurer et maintenir NextAuth, les bénéfices (coût, contrôle) valent l'effort initial.

## Quand choisir Clerk

Clerk reste le meilleur choix dans ces situations :

**MVP et prototypes**
Quand vous voulez tester une idée rapidement sans perdre du temps sur l'authentification.

**Petite équipe ou développeur solo**
Quand vous n'avez pas le temps ou l'expertise pour gérer l'authentification vous-même.

**Budget initial disponible**
Si vous avez du budget et préférez payer pour gagner du temps et vous concentrer sur votre métier.

**Fonctionnalités avancées immédiatement**
Si vous avez besoin de 2FA, organisations, webhooks, etc., sans les développer vous-même.

## L'approche hybride

Une stratégie courante est de commencer avec Clerk puis migrer vers NextAuth une fois que l'application est établie et rentable. Cette migration est possible mais représente du travail.

---

Passez au Module 2 : [02-CONFIGURATION-SETUP(COURS).md](./02-CONFIGURATION-SETUP(COURS).md)


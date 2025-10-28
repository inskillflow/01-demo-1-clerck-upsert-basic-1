# Module 1 : Fondations JWT

## Qu'est-ce qu'un JSON Web Token ?

Un JWT (prononcé "jot") est un standard ouvert (RFC 7519) pour créer des tokens d'accès qui affirment des revendications (claims). En termes simples, c'est une chaîne de caractères qui contient des informations et qui peut être vérifiée cryptographiquement.

### Le problème historique

Avant les JWT, l'authentification web fonctionnait principalement via des sessions côté serveur. Quand un utilisateur se connectait, le serveur créait une session stockée en mémoire ou dans une base de données, et retournait un identifiant de session dans un cookie.

**Le flux session traditionnel :**

Utilisateur se connecte → Serveur crée une session en mémoire → Cookie avec session ID envoyé au client → À chaque requête, serveur cherche la session ID en mémoire → Si trouvée, utilisateur est authentifié.

Ce système fonctionne bien pour une application sur un seul serveur, mais pose des problèmes dans les architectures modernes.

### Les défis de l'approche session

**Problème 1 : Scalabilité horizontale**
Si vous avez plusieurs serveurs derrière un load balancer, chaque serveur a sa propre mémoire. L'utilisateur connecté sur le serveur A doit se reconnecter s'il est routé vers le serveur B.

Solution traditionnelle : Sticky sessions (router toujours le même utilisateur vers le même serveur) ou session store partagé (Redis). Les deux ajoutent de la complexité.

**Problème 2 : Microservices**
Dans une architecture microservices, chaque service doit pouvoir vérifier l'identité de l'utilisateur. Avec des sessions, il faut soit partager le session store entre tous les services, soit faire un appel réseau au service d'authentification à chaque requête.

**Problème 3 : Applications mobiles**
Les applications mobiles font des requêtes API vers votre backend. Gérer des sessions avec des apps mobiles est complexe car les cookies ne fonctionnent pas de la même manière que dans un navigateur.

**Problème 4 : Serverless**
Les fonctions serverless sont éphémères et sans état (stateless). Impossible de stocker des sessions en mémoire. Il faut une base de données externe, ce qui ajoute de la latence à chaque requête.

### La solution JWT

Les JWT résolvent tous ces problèmes en rendant les tokens auto-contenus et vérifiables sans état serveur.

**Le principe fondamental :**
Plutôt que de stocker la session côté serveur et donner juste un ID au client, on donne au client toutes les informations de la session dans un format signé cryptographiquement. Le serveur peut vérifier que ces informations n'ont pas été modifiées sans avoir besoin de les chercher quelque part.

**Le flux JWT :**

Utilisateur se connecte → Serveur crée un JWT contenant l'ID utilisateur et d'autres données → JWT signé avec une clé secrète → JWT envoyé au client → À chaque requête, client envoie le JWT → Serveur vérifie la signature → Si valide, lit les données du JWT → Utilisateur authentifié.

**Aucune base de données ou mémoire partagée nécessaire.** Chaque serveur peut vérifier un JWT de manière indépendante tant qu'il connaît la clé secrète.

## Les avantages des JWT

Comprendre pourquoi les JWT sont devenus le standard de facto de l'authentification moderne.

### Stateless (sans état)

Le serveur n'a rien à stocker. Pas de session en mémoire, pas de table Session en base de données (si vous utilisez uniquement JWT). Cela simplifie drastiquement l'architecture.

Un serveur fraîchement démarré peut immédiatement vérifier des JWT sans aucune initialisation, sans connexion à une base de données de sessions.

### Scalabilité

Ajoutez autant de serveurs que vous voulez, ils peuvent tous vérifier les JWT indépendamment. Pas besoin de sticky sessions, pas besoin de session store partagé.

Load balancer → Serveur 1, 2, 3, 4... N → Tous peuvent vérifier le même JWT.

### Performance

Vérifier un JWT est une opération purement CPU (vérification de signature HMAC ou RSA). C'est extrêmement rapide comparé à une requête base de données ou un appel réseau à un session store.

Sur des machines modernes, un serveur peut vérifier des dizaines de milliers de JWT par seconde.

### Décentralisation

Différents services peuvent tous vérifier le même JWT. Votre API principale, votre service de fichiers, votre service de notifications, tous lisent le même JWT et savent qui est l'utilisateur sans se coordonner.

### Cross-domain et mobile

Les JWT fonctionnent facilement avec les applications mobiles (envoyés dans un header Authorization) et peuvent être partagés entre différents domaines (avec les précautions CORS appropriées).

## Les limitations des JWT

Aucune solution n'est parfaite. Les JWT ont des limitations importantes à comprendre.

### Impossible de révoquer immédiatement

Une fois émis, un JWT reste valide jusqu'à son expiration. Même si vous supprimez l'utilisateur de la base de données ou voulez terminer sa session, le JWT continue de fonctionner.

**Exemple problématique :**
Un employé est licencié. Vous supprimez son compte, mais il a un JWT valide pour encore 7 jours. Il peut continuer à accéder à l'application pendant ces 7 jours.

**Solutions :**
Maintenir une blacklist de JWT révoqués (mais ça réintroduit de l'état serveur). Utiliser des durées d'expiration courtes (mais ça nécessite des refresh fréquents). Combiner JWT avec des vérifications DB pour les opérations sensibles.

### Taille des JWT

Un JWT contient toutes les données en clair (encodées en base64 mais pas chiffrées). Plus vous mettez de données dans le JWT, plus il devient gros.

Un JWT typique fait 200-500 bytes. Si vous mettez beaucoup de données, il peut atteindre plusieurs kilobytes. Chaque requête HTTP envoie ce JWT, augmentant la bande passante utilisée.

### Données obsolètes

Les données dans un JWT sont fixées au moment de sa création. Si l'utilisateur change son email ou son rôle, le JWT contient toujours les anciennes informations jusqu'à ce qu'un nouveau JWT soit créé.

**Exemple :**
Un utilisateur est promu admin. Son JWT dit encore role: "user" pendant toute la durée de vie du JWT. Il doit se reconnecter ou attendre le refresh pour voir ses nouveaux droits.

### Secrets sensibles

Ne jamais mettre de données sensibles (numéro de carte bancaire, mot de passe) dans un JWT. Le payload est encodé en base64 mais pas chiffré. N'importe qui peut décoder un JWT et lire son contenu.

## Quand utiliser les JWT

Les JWT ne sont pas toujours la meilleure solution. Voici quand ils brillent et quand éviter.

### Utilisez JWT pour :

**API stateless**
Si vous construisez une API REST consommée par plusieurs clients (web, mobile, desktop), les JWT simplifient l'authentification.

**Microservices**
Quand plusieurs services doivent vérifier l'identité sans coordination centrale.

**Serverless / Edge computing**
Les fonctions serverless bénéficient énormément des JWT car elles évitent les requêtes DB coûteuses.

**Applications scalables**
Quand vous prévoyez beaucoup de trafic et voulez éviter la charge DB des vérifications de session.

### Évitez JWT pour :

**Applications nécessitant révocation immédiate**
Si la révocation instantanée de sessions est critique (applications financières, médicales).

**Données de session volumineuses**
Si vous devez stocker beaucoup de données côté session (préférences complexes, panier d'achat volumineux).

**Applications monolithiques simples**
Si vous avez un seul serveur et peu de trafic, les sessions traditionnelles sont plus simples.

**Compliance stricte**
Certaines réglementations exigent un audit de toutes les sessions. Database sessions facilitent cet audit.

## JWT dans l'écosystème actuel

Comprendre où vous rencontrez les JWT dans votre stack technologique.

### Clerk utilise les JWT

Quand vous vous connectez avec Clerk, un JWT est créé et stocké dans un cookie. Les fonctions `auth()` et `currentUser()` lisent et vérifient ce JWT.

Le JWT Clerk contient l'ID utilisateur, l'ID de session, et des métadonnées. Clerk signe ce JWT avec sa propre clé secrète.

### NextAuth utilise les JWT

Avec la stratégie JWT de NextAuth, les sessions sont des JWT. Quand vous appelez `getServerSession()`, NextAuth vérifie le JWT du cookie de session.

NextAuth vous laisse personnaliser le contenu du JWT via le callback jwt().

### OAuth providers utilisent les JWT

Google, GitHub, et autres providers OAuth retournent souvent des JWT comme access tokens. Ces JWT prouvent que votre application a été autorisée par l'utilisateur.

### Les API modernes

La plupart des API modernes (Stripe, Twilio, Firebase) utilisent des JWT ou des tokens similaires pour l'authentification.

---

Passez au Module 2 : [02-ANATOMIE-JWT(COURS).md](./02-ANATOMIE-JWT(COURS).md)


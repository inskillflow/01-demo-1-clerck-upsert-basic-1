# Quiz : Réponses et Explications

## Section 1 : Concepts Webhooks

### Question 1
**Réponse : B** - Un mécanisme où le serveur envoie des notifications push vers votre application

**Explication :** Un webhook est une notification push automatique. Au lieu que votre application interroge constamment le serveur (polling), c'est le serveur qui vous contacte quand un événement se produit.

### Question 2
**Réponse : C** - Le polling consomme plus de ressources avec requêtes répétées, les webhooks notifient uniquement quand nécessaire

**Explication :** Le polling fait des requêtes répétées même quand il n'y a rien de nouveau (gaspillage). Les webhooks ne sont envoyés que lorsqu'un événement se produit réellement.

### Question 3
**Réponse : B** - Synchronisation en temps réel sans intervention de l'utilisateur

**Explication :** Avec upsert, la synchronisation ne se fait qu'à la connexion. Avec webhooks, elle est instantanée dès que l'événement se produit dans Clerk, même si l'utilisateur n'est pas connecté.

### Question 4
**Réponse : C** - Pour empêcher des attaquants d'envoyer de fausses requêtes à votre endpoint public

**Explication :** Sans vérification, n'importe qui pourrait envoyer des fausses requêtes à votre endpoint et créer/modifier/supprimer des utilisateurs dans votre base de données.

### Question 5
**Réponse : C** - Un algorithme d'authentification basé sur le hachage avec une clé secrète

**Explication :** HMAC (Hash-based Message Authentication Code) utilise une fonction de hachage + une clé secrète pour créer une signature impossible à forger sans connaître la clé.

---

## Section 2 : Webhooks Clerk

### Question 6
**Réponse : B** - Un service qui gère l'envoi fiable des webhooks, les retries et les signatures

**Explication :** Svix est un service spécialisé que Clerk utilise pour gérer toute la complexité des webhooks : envoi, retries automatiques, signatures, logs, etc.

### Question 7
**Réponse : C** - user.logged_in n'existe pas

**Explication :** Clerk émet `session.created` pour les connexions, pas `user.logged_in`. Les événements user.* concernent les modifications du compte lui-même.

### Question 8
**Réponse : B** - svix-id, svix-timestamp, svix-signature

**Explication :** Ces trois headers sont envoyés par Svix avec chaque webhook. Ils sont nécessaires pour vérifier l'authenticité de la requête.

### Question 9
**Réponse : B** - Pour gérer les cas où le webhook est renvoyé plusieurs fois sans créer de doublons

**Explication :** Si le webhook échoue et est renvoyé, `create` causerait une erreur "utilisateur déjà existant". `upsert` gère ce cas en créant si nécessaire ou mettant à jour si existe déjà.

### Question 10
**Réponse : C** - Réessaie automatiquement avec un backoff exponentiel

**Explication :** Un status 500 indique une erreur temporaire (serveur indisponible, DB down). Svix réessaiera automatiquement avec des délais croissants (5s, 5min, 30min, etc.).

---

## Section 3 : Implémentation

### Question 11
**Réponse : B** - Pour créer un tunnel et rendre localhost accessible depuis Internet

**Explication :** Localhost n'est pas accessible depuis Internet. Ngrok crée un tunnel qui expose temporairement votre localhost via une URL publique (ex: https://abc123.ngrok.io).

### Question 12
**Réponse : B** - Vérifier la signature → Traiter l'événement → Retourner la réponse

**Explication :** On doit TOUJOURS vérifier la signature en premier pour s'assurer que la requête vient bien de Clerk. Sinon, on pourrait traiter des requêtes malveillantes.

### Question 13
**Réponse : B** - 401 (Unauthorized)

**Explication :** Une signature invalide signifie que la requête n'est pas authentifiée. 401 est le code approprié. Svix ne réessaiera pas car c'est une erreur permanente.

### Question 14
**Réponse : C** - svix

**Explication :** La bibliothèque npm `svix` fournit la fonction `Webhook.verify()` qui gère toute la complexité de la vérification de signature HMAC.

### Question 15
**Réponse : B** - Dans un fichier .env.local (gitignored)

**Explication :** Le signing secret est une clé de sécurité critique. Il doit être dans .env.local (jamais commité) ou dans les variables d'environnement de l'hébergeur.

---

## Section 4 : Scénarios Avancés

### Question 16
**Réponse : B** - Logger les webhooks traités et vérifier avant d'envoyer

**Explication :** Pour éviter d'envoyer plusieurs fois le même email (side effect), on doit logger le svix-id des webhooks traités et vérifier avant chaque action non-idempotente.

### Question 17
**Réponse : B** - user.deleted

**Explication :** Quand un utilisateur supprime son compte, Clerk émet `user.deleted`. C'est le moment de supprimer ou anonymiser ses données pour respecter le RGPD.

### Question 18
**Réponse : B** - Créer un service central qui reçoit les webhooks et notifie les 3 applications

**Explication :** Un service central évite la duplication de code et permet de gérer la logique de distribution. Chaque app reçoit les mêmes données de manière cohérente.

### Question 19
**Réponse : B** - Mettre l'email en file d'attente et retourner 200 pour la création DB

**Explication :** La création DB est critique (doit réussir), l'email est non-critique (peut être envoyé plus tard). Séparer les opérations critiques des non-critiques permet une meilleure résilience.

### Question 20
**Réponse : C** - user.created pour les inscriptions et session.created pour les connexions

**Explication :** `user.created` est émis une seule fois à l'inscription. `session.created` est émis à chaque connexion. Pour des analytics complets, on a besoin des deux.

---

## Barème

**Total : 40 points (20 questions × 2 points)**

- 36-40 : Excellente maîtrise des webhooks
- 30-35 : Bonne compréhension
- 24-29 : Compréhension satisfaisante
- 18-23 : Compréhension partielle
- <18 : Révision des modules 1-4 recommandée


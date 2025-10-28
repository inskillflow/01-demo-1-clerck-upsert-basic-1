# Quiz : Webhooks et Synchronisation Temps Réel

## Instructions

- 20 questions à choix multiples
- Durée estimée : 30 minutes
- Cochez votre réponse pour chaque question
- Les réponses sont dans le fichier 07-QUIZ-REPONSES(OBLIGATOIRE).md

---

## Section 1 : Concepts Webhooks

### Question 1
Qu'est-ce qu'un webhook dans le contexte d'une API web ?

- [ ] A) Une requête GET périodique vers un serveur
- [ ] B) Un mécanisme où le serveur envoie des notifications push vers votre application
- [ ] C) Un type de base de données
- [ ] D) Un protocole de sécurité

### Question 2
Quelle est la principale différence entre polling (pull) et webhooks (push) ?

- [ ] A) Le polling est plus sécurisé
- [ ] B) Les webhooks nécessitent que votre application interroge constamment le serveur
- [ ] C) Le polling consomme plus de ressources avec des requêtes répétées, les webhooks notifient uniquement quand nécessaire
- [ ] D) Il n'y a pas de différence

### Question 3
Quel est le principal avantage des webhooks par rapport à l'approche upsert post-login ?

- [ ] A) Plus facile à implémenter
- [ ] B) Synchronisation en temps réel sans intervention de l'utilisateur
- [ ] C) Pas besoin de base de données
- [ ] D) Fonctionne mieux en développement local

### Question 4
Pourquoi la vérification de signature est-elle absolument nécessaire pour un endpoint webhook ?

- [ ] A) Pour améliorer les performances
- [ ] B) C'est une recommandation optionnelle
- [ ] C) Pour empêcher des attaquants d'envoyer de fausses requêtes à votre endpoint public
- [ ] D) Pour chiffrer les données

### Question 5
Qu'est-ce que HMAC dans le contexte des signatures de webhooks ?

- [ ] A) Un protocole de base de données
- [ ] B) Une méthode de chiffrement symétrique
- [ ] C) Un algorithme d'authentification basé sur le hachage avec une clé secrète
- [ ] D) Un type de serveur web

---

## Section 2 : Webhooks Clerk

### Question 6
Quel est le rôle de Svix dans l'architecture des webhooks Clerk ?

- [ ] A) C'est une base de données alternative
- [ ] B) Un service qui gère l'envoi fiable des webhooks, les retries et les signatures
- [ ] C) Un framework JavaScript
- [ ] D) Un outil de monitoring

### Question 7
Parmi ces événements, lequel N'EST PAS émis par Clerk ?

- [ ] A) user.created
- [ ] B) user.updated
- [ ] C) user.logged_in
- [ ] D) session.created

### Question 8
Quels sont les trois headers principaux envoyés avec chaque webhook Clerk ?

- [ ] A) authorization, content-type, accept
- [ ] B) svix-id, svix-timestamp, svix-signature
- [ ] C) clerk-id, clerk-token, clerk-user
- [ ] D) webhook-id, webhook-type, webhook-data

### Question 9
Pourquoi utiliser `upsert` plutôt que `create` dans un webhook user.created ?

- [ ] A) C'est plus rapide
- [ ] B) Pour gérer les cas où le webhook est renvoyé plusieurs fois sans créer de doublons
- [ ] C) C'est obligatoire avec Prisma
- [ ] D) Pour améliorer la sécurité

### Question 10
Si votre endpoint webhook retourne un status HTTP 500, que fait Svix ?

- [ ] A) Abandonne immédiatement
- [ ] B) Envoie un email à Clerk
- [ ] C) Réessaie automatiquement avec un backoff exponentiel
- [ ] D) Supprime le webhook

---

## Section 3 : Implémentation

### Question 11
Pourquoi utilise-t-on ngrok en développement local pour les webhooks ?

- [ ] A) Pour accélérer le serveur
- [ ] B) Pour créer un tunnel et rendre localhost accessible depuis Internet
- [ ] C) Pour chiffrer les données
- [ ] D) C'est obsolète, on n'en a plus besoin

### Question 12
Dans quel ordre doit-on effectuer ces opérations dans un endpoint webhook ?

- [ ] A) Traiter l'événement → Vérifier la signature → Retourner la réponse
- [ ] B) Vérifier la signature → Traiter l'événement → Retourner la réponse
- [ ] C) Retourner la réponse → Vérifier la signature → Traiter l'événement
- [ ] D) L'ordre n'a pas d'importance

### Question 13
Quel code HTTP devez-vous retourner pour une signature invalide ?

- [ ] A) 200 (OK)
- [ ] B) 401 (Unauthorized)
- [ ] C) 404 (Not Found)
- [ ] D) 500 (Internal Server Error)

### Question 14
Quelle bibliothèque npm est nécessaire pour vérifier les signatures des webhooks Clerk ?

- [ ] A) clerk
- [ ] B) crypto
- [ ] C) svix
- [ ] D) webhook-verify

### Question 15
Où doit-on stocker le webhook signing secret ?

- [ ] A) Dans le code source
- [ ] B) Dans un fichier .env.local (gitignored)
- [ ] C) Dans la base de données
- [ ] D) Dans les commentaires du code

---

## Section 4 : Scénarios Avancés

### Question 16
Comment gérer l'idempotence quand un webhook déclenche l'envoi d'un email ?

- [ ] A) Envoyer l'email à chaque fois, ce n'est pas grave
- [ ] B) Logger les webhooks traités et vérifier avant d'envoyer
- [ ] C) Ne jamais envoyer d'email depuis un webhook
- [ ] D) Utiliser un timer

### Question 17
Quel webhook permet de gérer automatiquement les demandes de suppression RGPD ?

- [ ] A) user.updated
- [ ] B) user.deleted
- [ ] C) user.logout
- [ ] D) user.gdpr

### Question 18
Si vous avez 3 applications différentes à synchroniser, quelle est la meilleure approche ?

- [ ] A) Configurer 3 endpoints webhooks différents dans Clerk
- [ ] B) Créer un service central qui reçoit les webhooks et notifie les 3 applications
- [ ] C) Utiliser polling pour les 3 applications
- [ ] D) Synchroniser manuellement

### Question 19
L'utilisateur est créé dans la DB mais l'email de bienvenue échoue. Que faire ?

- [ ] A) Retourner 500 pour que tout soit réessayé
- [ ] B) Mettre l'email en file d'attente et retourner 200 pour la création DB
- [ ] C) Abandonner l'email et ne rien faire
- [ ] D) Supprimer l'utilisateur créé

### Question 20
Pour tracker les inscriptions en temps réel, quel(s) événement(s) webhook utiliser ?

- [ ] A) user.created uniquement
- [ ] B) session.created uniquement
- [ ] C) user.created pour les inscriptions et session.created pour les connexions
- [ ] D) user.updated

---

**Voir le fichier 07-QUIZ-REPONSES(OBLIGATOIRE).md pour les corrections**


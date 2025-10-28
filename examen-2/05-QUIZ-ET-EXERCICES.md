# Module 5 : Quiz et Exercices

## Quiz de compréhension

### Section 1 : Concepts Webhooks

**Question 1 : Définition**
Qu'est-ce qu'un webhook dans le contexte d'une API web ?

A) Une requête GET périodique vers un serveur
B) Un mécanisme où le serveur envoie des notifications push vers votre application
C) Un type de base de données
D) Un protocole de sécurité

**Question 2 : Pull vs Push**
Quelle est la principale différence entre polling (pull) et webhooks (push) ?

A) Le polling est plus sécurisé
B) Les webhooks nécessitent que votre application interroge constamment le serveur
C) Le polling consomme plus de ressources avec des requêtes répétées, les webhooks notifient uniquement quand nécessaire
D) Il n'y a pas de différence

**Question 3 : Avantages**
Quel est le principal avantage des webhooks par rapport à l'approche upsert post-login ?

A) Plus facile à implémenter
B) Synchronisation en temps réel sans intervention de l'utilisateur
C) Pas besoin de base de données
D) Fonctionne mieux en développement local

**Question 4 : Sécurité**
Pourquoi la vérification de signature est-elle absolument nécessaire pour un endpoint webhook ?

A) Pour améliorer les performances
B) C'est une recommandation optionnelle
C) Pour empêcher des attaquants d'envoyer de fausses requêtes à votre endpoint public
D) Pour chiffrer les données

**Question 5 : HMAC**
Qu'est-ce que HMAC dans le contexte des signatures de webhooks ?

A) Un protocole de base de données
B) Une méthode de chiffrement symétrique
C) Un algorithme d'authentification basé sur le hachage avec une clé secrète
D) Un type de serveur web

### Section 2 : Webhooks Clerk

**Question 6 : Svix**
Quel est le rôle de Svix dans l'architecture des webhooks Clerk ?

A) C'est une base de données alternative
B) Un service qui gère l'envoi fiable des webhooks, les retries et les signatures
C) Un framework JavaScript
D) Un outil de monitoring

**Question 7 : Types d'événements**
Parmi ces événements, lequel N'EST PAS émis par Clerk ?

A) user.created
B) user.updated
C) user.logged_in
D) session.created

**Question 8 : Headers Svix**
Quels sont les trois headers principaux envoyés avec chaque webhook Clerk ?

A) authorization, content-type, accept
B) svix-id, svix-timestamp, svix-signature
C) clerk-id, clerk-token, clerk-user
D) webhook-id, webhook-type, webhook-data

**Question 9 : Idempotence**
Pourquoi utiliser `upsert` plutôt que `create` dans un webhook user.created ?

A) C'est plus rapide
B) Pour gérer les cas où le webhook est renvoyé plusieurs fois sans créer de doublons
C) C'est obligatoire avec Prisma
D) Pour améliorer la sécurité

**Question 10 : Retries**
Si votre endpoint webhook retourne un status HTTP 500, que fait Svix ?

A) Abandonne immédiatement
B) Envoie un email à Clerk
C) Réessaie automatiquement avec un backoff exponentiel
D) Supprime le webhook

### Section 3 : Implémentation

**Question 11 : Ngrok**
Pourquoi utilise-t-on ngrok en développement local pour les webhooks ?

A) Pour accélérer le serveur
B) Pour créer un tunnel et rendre localhost accessible depuis Internet
C) Pour chiffrer les données
D) C'est obsolète, on n'en a plus besoin

**Question 12 : Vérification**
Dans quel ordre doit-on effectuer ces opérations dans un endpoint webhook ?

A) Traiter l'événement → Vérifier la signature → Retourner la réponse
B) Vérifier la signature → Traiter l'événement → Retourner la réponse
C) Retourner la réponse → Vérifier la signature → Traiter l'événement
D) L'ordre n'a pas d'importance

**Question 13 : Codes d'erreur**
Quel code HTTP devez-vous retourner pour une signature invalide ?

A) 200 (OK)
B) 401 (Unauthorized)
C) 404 (Not Found)
D) 500 (Internal Server Error)

**Question 14 : Bibliothèque**
Quelle bibliothèque npm est nécessaire pour vérifier les signatures des webhooks Clerk ?

A) clerk
B) crypto
C) svix
D) webhook-verify

**Question 15 : Variables d'environnement**
Où doit-on stocker le webhook signing secret ?

A) Dans le code source
B) Dans un fichier .env.local (gitignored)
C) Dans la base de données
D) Dans les commentaires du code

### Section 4 : Scénarios Avancés

**Question 16 : Side effects**
Comment gérer l'idempotence quand un webhook déclenche l'envoi d'un email ?

A) Envoyer l'email à chaque fois, ce n'est pas grave
B) Logger les webhooks traités et vérifier avant d'envoyer
C) Ne jamais envoyer d'email depuis un webhook
D) Utiliser un timer

**Question 17 : Suppression RGPD**
Quel webhook permet de gérer automatiquement les demandes de suppression RGPD ?

A) user.updated
B) user.deleted
C) user.logout
D) user.gdpr

**Question 18 : Multi-services**
Si vous avez 3 applications différentes à synchroniser, quelle est la meilleure approche ?

A) Configurer 3 endpoints webhooks différents dans Clerk
B) Créer un service central qui reçoit les webhooks et notifie les 3 applications
C) Utiliser polling pour les 3 applications
D) Synchroniser manuellement

**Question 19 : Erreurs partielles**
L'utilisateur est créé dans la DB mais l'email de bienvenue échoue. Que faire ?

A) Retourner 500 pour que tout soit réessayé
B) Mettre l'email en file d'attente et retourner 200 pour la création DB
C) Abandonner l'email et ne rien faire
D) Supprimer l'utilisateur créé

**Question 20 : Analytics**
Pour tracker les inscriptions en temps réel, quel(s) événement(s) webhook utiliser ?

A) user.created uniquement
B) session.created uniquement
C) user.created pour les inscriptions et session.created pour les connexions
D) user.updated

---

## Exercices Pratiques

### Exercice 1 : Endpoint webhook basique

Écrivez un endpoint webhook Next.js complet qui :
1. Vérifie la signature Svix
2. Gère les événements user.created, user.updated, user.deleted
3. Synchronise avec Prisma
4. Retourne les bons codes HTTP selon les situations
5. Logue les erreurs

Incluez la gestion d'erreurs robuste.

### Exercice 2 : Système d'onboarding

Concevez un système d'onboarding progressif utilisant les webhooks :

1. À l'inscription (user.created), créer un profil avec status "incomplete"
2. Suivre 4 étapes : email vérifié, profil complété, préférences définies, première action effectuée
3. Envoyer un email de rappel si l'onboarding n'est pas complété sous 48h
4. Débloquer une fonctionnalité premium quand tout est complété

Décrivez :
- Le schéma Prisma nécessaire
- Les webhooks à écouter
- La logique de chaque étape
- Comment programmer les rappels

### Exercice 3 : Détection de fraude

Implémentez un système de détection d'activité suspecte :

1. Logger toutes les sessions (session.created webhook)
2. Détecter si un utilisateur se connecte depuis plus de 3 pays différents en 24h
3. Détecter si plus de 5 sessions sont créées en moins de 10 minutes
4. Envoyer une alerte email à l'utilisateur et notifier l'équipe de sécurité

Écrivez :
- Le code du webhook handler
- La logique de détection
- Le système d'alertes

### Exercice 4 : Migration Upsert → Webhooks

Vous avez une application en production qui utilise l'approche upsert. Vous devez migrer vers les webhooks sans interruption de service.

Décrivez la stratégie de migration :
1. Comment tester les webhooks en parallèle sans affecter la prod
2. Comment gérer les utilisateurs existants
3. Comment basculer progressivement
4. Comment s'assurer qu'aucune donnée n'est perdue
5. Le plan de rollback si quelque chose ne va pas

### Exercice 5 : Système de logs et monitoring

Créez un système complet de logging et monitoring pour vos webhooks :

1. Logger chaque webhook reçu avec timestamp, type, et durée de traitement
2. Créer une API route pour voir les statistiques (webhooks par type, taux de succès, temps moyen)
3. Implémenter des alertes automatiques si le taux d'échec dépasse 5%
4. Créer un dashboard simple affichant ces métriques

Incluez le schéma Prisma et le code de l'API.

---

## Questions Ouvertes

### Question 1 : Architecture décisionnelle

Vous développez une nouvelle application SaaS. Expliquez votre processus de décision pour choisir entre :
- Upsert post-login
- Webhooks dès le début
- Approche hybride

Considérez : le temps de développement, le budget, la taille de l'équipe, les fonctionnalités métier, et l'évolutivité. Justifiez votre choix avec des arguments techniques et business.

### Question 2 : Résilience et fiabilité

Les webhooks peuvent échouer pour de multiples raisons (réseau, base de données indisponible, bug dans le code). Concevez une architecture résiliente qui garantit qu'aucun événement n'est perdu, même en cas de panne prolongée de votre infrastructure. Incluez les concepts de dead letter queue, retry avec backoff, et réconciliation périodique.

### Question 3 : Sécurité approfondie

Au-delà de la vérification de signature, listez et expliquez au moins 5 mesures de sécurité supplémentaires pour protéger votre endpoint webhook. Pour chacune, expliquez l'attaque qu'elle prévient et comment l'implémenter.

### Question 4 : Performance et scalabilité

Votre application reçoit maintenant 1000 webhooks par minute. Le traitement de chaque webhook prend environ 500ms (requête DB + appel API externe). Comment architectureriez-vous le système pour gérer cette charge sans perdre de webhooks et sans ralentir les réponses ? Considérez les queues, le processing asynchrone, et le scaling horizontal.

### Question 5 : Conformité et audit

Votre application doit être conforme RGPD et SOC 2. Expliquez comment vous utiliseriez les webhooks pour :
- Tracer tous les accès et modifications de données utilisateur
- Gérer les demandes de suppression automatiquement
- Prouver la conformité lors d'un audit
- Implémenter le droit à l'oubli tout en conservant les données nécessaires pour la comptabilité

---

## Correction et Barème

### Quiz (40 points - 2 points par question)

1. B - Notification push du serveur vers l'application
2. C - Polling consomme plus de ressources avec requêtes répétées
3. B - Synchronisation temps réel sans intervention utilisateur
4. C - Empêcher les fausses requêtes vers endpoint public
5. C - Algorithme d'authentification basé sur hachage avec clé secrète
6. B - Service gérant l'envoi fiable, retries et signatures
7. C - user.logged_in n'existe pas (c'est session.created)
8. B - svix-id, svix-timestamp, svix-signature
9. B - Gérer les retries sans créer de doublons
10. C - Réessaie automatiquement avec backoff exponentiel
11. B - Créer un tunnel pour rendre localhost accessible
12. B - Vérifier signature → Traiter → Retourner réponse
13. B - 401 (Unauthorized)
14. C - svix
15. B - Fichier .env.local (gitignored)
16. B - Logger les webhooks traités et vérifier avant d'agir
17. B - user.deleted
18. B - Service central qui notifie les 3 applications
19. B - File d'attente pour email et retourner 200
20. C - user.created et session.created

### Exercices Pratiques (30 points - 6 points par exercice)

Critères d'évaluation :
- Exactitude technique (2 points)
- Gestion d'erreurs et edge cases (2 points)
- Code propre et maintenable (2 points)

### Questions Ouvertes (30 points - 6 points par question)

Critères d'évaluation :
- Profondeur de l'analyse (2 points)
- Considération des trade-offs (2 points)
- Faisabilité et pragmatisme (2 points)

**Total : 100 points**

Notation :
- 90-100 : Excellente maîtrise des webhooks
- 75-89 : Bonne compréhension, prêt pour production
- 60-74 : Compréhension satisfaisante
- 50-59 : Compréhension partielle, révision recommandée
- <50 : Révision nécessaire des modules 1-4

---

## Ressources complémentaires

### Documentation officielle
- [Clerk Webhooks Documentation](https://clerk.com/docs/integrations/webhooks)
- [Svix Documentation](https://docs.svix.com/)
- [Webhooks Security Best Practices](https://webhooks.fyi/)

### Outils utiles
- [ngrok](https://ngrok.com/) - Tunneling pour développement local
- [Webhook.site](https://webhook.site/) - Tester et inspecter les webhooks
- [RequestBin](https://requestbin.com/) - Capturer et analyser les requêtes HTTP

### Articles approfondis
- Patterns d'idempotence pour webhooks
- Architecture event-driven avec webhooks
- Monitoring et observabilité des webhooks

### Dans ce projet
- `examen-1/` - Cours sur l'approche Upsert (prérequis)
- `examples/webhook-method/` - Implémentation complète de référence
- `documentation-1/02-COMPARISON.md` - Comparaison Upsert vs Webhooks

## Prochaines étapes

Après avoir maîtrisé les webhooks :
1. Implémenter des webhooks dans votre propre projet
2. Explorer les webhooks d'autres services (Stripe, GitHub, Slack)
3. Construire une architecture event-driven complète
4. Étudier les patterns de messaging (Kafka, RabbitMQ)

Félicitations pour avoir complété ce cours approfondi sur les webhooks !


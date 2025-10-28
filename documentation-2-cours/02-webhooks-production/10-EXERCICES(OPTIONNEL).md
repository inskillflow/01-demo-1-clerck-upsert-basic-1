# Exercices Pratiques : Webhooks

## Instructions

- 5 exercices à réaliser
- Durée estimée : 3-4 heures
- Rédigez vos réponses dans un document séparé
- Consultez 11-EXERCICES-SOLUTIONS(OPTIONNEL).md après avoir terminé

---

## Exercice 1 : Endpoint webhook complet (60 minutes)

Écrivez un endpoint webhook Next.js complet qui :

1. Vérifie la signature Svix correctement
2. Gère les événements user.created, user.updated, user.deleted
3. Synchronise avec Prisma de manière idempotente
4. Retourne les bons codes HTTP selon les situations
5. Logue les erreurs de manière structurée
6. Gère les cas d'erreur avec try-catch appropriés

**Fournissez :**
- Le code complet de `app/api/webhooks/clerk/route.ts`
- Les fonctions handler pour chaque type d'événement
- La gestion d'erreurs robuste
- Les logs structurés en JSON

**Critères d'évaluation :**
- Vérification de signature correcte (5 points)
- Gestion de tous les événements (5 points)
- Idempotence avec upsert (5 points)
- Codes HTTP appropriés (3 points)
- Gestion d'erreurs (2 points)

---

## Exercice 2 : Système d'onboarding (60 minutes)

Concevez un système d'onboarding progressif utilisant les webhooks.

**Spécifications :**
1. À l'inscription (user.created), créer un profil avec status "incomplete"
2. Suivre 4 étapes d'onboarding :
   - Email vérifié (automatique via Clerk)
   - Profil complété (nom, photo)
   - Préférences définies (langue, notifications)
   - Première action effectuée (créer un post, par exemple)
3. Envoyer un email de rappel si onboarding non complété sous 48h
4. Débloquer une fonctionnalité premium quand tout est complété

**Fournissez :**
- Le schéma Prisma avec table OnboardingStatus
- Le code du webhook handler user.created
- Le code du webhook handler user.updated
- La logique de vérification de complétion
- Le système de rappel (peut être conceptuel)

**Critères d'évaluation :**
- Schéma Prisma approprié (5 points)
- Logique d'onboarding complète (5 points)
- Tracking des étapes (5 points)
- Système de rappel (5 points)

---

## Exercice 3 : Détection de fraude (60 minutes)

Implémentez un système de détection d'activité suspecte.

**Spécifications :**
1. Logger toutes les sessions (webhook session.created)
2. Détecter si un utilisateur se connecte depuis plus de 3 pays différents en 24h
3. Détecter si plus de 5 sessions sont créées en moins de 10 minutes
4. Envoyer une alerte email à l'utilisateur ET notifier l'équipe de sécurité sur Slack

**Fournissez :**
- Le schéma Prisma pour logger les sessions
- Le code du webhook handler session.created
- La logique de détection d'anomalies
- Le système d'alertes (email + Slack)
- Les seuils configurables

**Critères d'évaluation :**
- Logging des sessions (4 points)
- Détection des anomalies (6 points)
- Système d'alertes (6 points)
- Code maintenable (4 points)

---

## Exercice 4 : Migration Upsert → Webhooks (90 minutes)

Vous avez une application en production qui utilise l'approche upsert. Décrivez une stratégie de migration complète vers les webhooks sans interruption de service.

**Décrivez pour chaque phase :**

### Phase 1 : Préparation
- Configuration nécessaire dans Clerk Dashboard
- Installation de dépendances et modifications du code
- Variables d'environnement à ajouter
- Comment tester en parallèle sans affecter la production
- Plan de tests

### Phase 2 : Déploiement progressif
- Stratégie de feature flag ou de basculement progressif
- Comment gérer les utilisateurs existants
- Période de transition (webhooks + upsert en backup)
- Métriques à surveiller pour détecter les problèmes
- Logs et monitoring

### Phase 3 : Finalisation
- Comment et quand supprimer le code upsert
- Nettoyage de la route /welcome
- Documentation à mettre à jour
- Tests de régression
- Communication à l'équipe

**Plan de rollback :**
- Comment revenir en arrière rapidement si problème
- Quels indicateurs surveillent que la migration échoue
- Procédure d'urgence

**Critères d'évaluation :**
- Stratégie de migration réaliste (15 points)
- Gestion des risques (10 points)
- Plan de rollback (5 points)
- Clarté et détails (10 points)

---

## Exercice 5 : Logs et monitoring (45 minutes)

Créez un système complet de logging et monitoring pour vos webhooks.

**Implémentez :**

1. **Table de logs** : Schéma Prisma pour logger chaque webhook
   - svixId, type, status, durée, timestamp, error (optionnel)

2. **API route de statistiques** : `/api/webhooks/stats`
   - Retourner : total webhooks, par type, taux de succès, temps moyen
   - Filtres par date, type
   - Pagination

3. **Dashboard simple** : Page `/admin/webhooks`
   - Afficher les statistiques en temps réel
   - Liste des derniers webhooks
   - Possibilité de rejouer un webhook échoué

4. **Système d'alertes** : Alerter si taux d'échec > 5%

**Fournissez :**
- Le schéma Prisma
- Le code de l'API route `/api/webhooks/stats`
- Le composant React du dashboard
- La logique d'alertes

**Critères d'évaluation :**
- Schéma de logging approprié (4 points)
- API de statistiques complète (6 points)
- Dashboard fonctionnel (6 points)
- Système d'alertes (4 points)

---

## Questions Ouvertes

### Question 1 : Architecture multi-développeurs (30 minutes)

Vous êtes dans une startup avec 3 développeurs travaillant simultanément. Comment organiseriez-vous les environnements et webhooks pour que :
- Chaque développeur puisse tester les webhooks en local
- Les tests ne se mélangent pas entre développeurs
- La production reste stable
- Le budget est minimal

**Détaillez :**
- Configuration des endpoints Clerk (combien, lesquels)
- URLs utilisées (ngrok, production)
- Variables d'environnement pour chaque environnement
- Base de données (partagée ou séparée)
- Coûts estimés

**Critères d'évaluation :**
- Solution pratique et réaliste (5 points)
- Séparation des environnements (3 points)
- Gestion des coûts (2 points)

---

### Question 2 : Comparaison hébergeurs (30 minutes)

Comparez les coûts et avantages d'héberger votre application avec webhooks sur :
1. Vercel (serverless)
2. Railway (containers)
3. VPS DigitalOcean (serveur dédié)

**Pour chaque option, analysez :**
- Coût mensuel pour 10,000 utilisateurs actifs
- Facilité de configuration des webhooks
- Scalabilité automatique ou manuelle
- Maintenance requise (temps/expertise)
- Monitoring et logs disponibles
- Temps de setup initial

**Recommandation :**
Laquelle choisiriez-vous pour une application en production ? Justifiez selon le contexte (taille équipe, budget, expertise).

**Critères d'évaluation :**
- Analyse détaillée de chaque option (6 points)
- Comparaison objective (2 points)
- Recommandation justifiée (2 points)

---

### Question 3 : Résilience et fiabilité (20 minutes)

Les webhooks peuvent échouer pour diverses raisons (réseau, DB indisponible, bug).

Concevez une architecture résiliente qui garantit qu'aucun événement n'est perdu, même en cas de panne prolongée.

**Incluez dans votre conception :**
- Dead letter queue pour les webhooks échoués
- Système de retry avec backoff intelligent
- Réconciliation périodique (comparer Clerk et DB)
- Monitoring et alertes
- Procédure de rattrapage manuel

**Critères d'évaluation :**
- Compréhension des risques (3 points)
- Solutions techniques appropriées (4 points)
- Architecture réaliste (3 points)

---

## Soumission

Rédigez vos réponses dans un document structuré et consultez 11-EXERCICES-SOLUTIONS(OPTIONNEL).md pour comparer avec les solutions proposées.


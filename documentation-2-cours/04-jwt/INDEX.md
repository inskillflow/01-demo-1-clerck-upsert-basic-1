# Index du Cours : JWT - JSON Web Tokens

## Vue d'ensemble

Ce cours complet explique les JWT (JSON Web Tokens) en profondeur : structure, cryptographie, sécurité, et implémentation. Durée estimée : 4-5 heures.

## Modules de cours

### [00 - Introduction](./00-INTRODUCTION(COURS).md)
**Durée : 10 minutes**
- Objectifs d'apprentissage
- Structure du cours
- Prérequis
- Le problème à résoudre

### [01 - Fondations JWT](./01-FONDATIONS-JWT(COURS).md)
**Durée : 45 minutes**
- Qu'est-ce qu'un JSON Web Token
- Le problème historique des sessions
- Les défis de l'approche session traditionnelle
- La solution JWT
- Avantages et limitations des JWT
- Quand utiliser les JWT
- JWT dans l'écosystème (Clerk, NextAuth, OAuth)

**Concepts clés :**
- Stateless vs Stateful
- Scalabilité horizontale
- Auto-contenu et vérifiable
- Serverless-friendly

### [02 - Anatomie d'un JWT](./02-ANATOMIE-JWT(COURS).md)
**Durée : 50 minutes**
- Structure d'un JWT (header.payload.signature)
- Partie 1 : Le Header (alg, typ, kid)
- Partie 2 : Le Payload (claims standards et personnalisés)
- Partie 3 : La Signature
- Base64URL encoding
- Décoder un JWT manuellement
- Le cycle de vie d'un JWT

**Concepts clés :**
- Header : alg, typ
- Claims : sub, iss, aud, exp, nbf, iat, jti
- Base64URL vs Base64
- Cycle : création, stockage, transmission, vérification

### [03 - Cryptographie et Signature](./03-CRYPTOGRAPHIE-SIGNATURE(COURS).md)
**Durée : 60 minutes**
- HMAC : Hash-based Message Authentication Code
- Le principe du hachage
- HMAC avec clé secrète
- Application aux JWT
- RSA : Signatures asymétriques
- Clé publique vs clé privée
- Vérification de signature étape par étape
- Pourquoi utiliser des bibliothèques

**Concepts clés :**
- HMAC-SHA256 (HS256)
- RSA-SHA256 (RS256)
- Clés symétriques vs asymétriques
- Vérification cryptographique

### [04 - JWT vs Sessions](./04-JWT-VS-SESSIONS(COURS).md)
**Durée : 50 minutes**
- Les sessions traditionnelles en détail
- Mécanisme session-cookie
- Avantages et inconvénients des sessions
- Les JWT : approche différente
- Tableau comparatif complet
- Stratégies hybrides (JWT + DB occasionnelle)
- Access token + Refresh token pattern

**Concepts clés :**
- Session store vs Stateless
- Révocation immédiate vs Différée
- Scalabilité comparée
- Pattern access + refresh tokens

### [05 - Sécurité des JWT](./05-SECURITE-JWT(COURS).md)
**Durée : 55 minutes**
- Vulnérabilités courantes
- Attaque Algorithm Confusion
- Attaque alg=none
- Données sensibles dans le payload
- JWT sans expiration
- Vol de JWT
- Bonnes pratiques (8 règles essentielles)
- Cas d'usage spécifiques

**Concepts clés :**
- Algorithm confusion attack
- None algorithm vulnerability
- Payload non chiffré
- httpOnly cookies
- Rotation des secrets

### [06 - Implémentation Next.js](./06-IMPLEMENTATION-NEXTJS(COURS).md)
**Durée : 60 minutes**
- Créer un JWT avec jsonwebtoken
- Vérifier un JWT
- Implémentation dans API routes
- Middleware de vérification
- Système complet avec refresh tokens
- API login, refresh, revoke
- Gestion des cookies sécurisés

**Concepts clés :**
- jsonwebtoken library
- Cookie httpOnly configuration
- Middleware JWT verification
- Refresh token DB storage

### [07 - Quiz Questions](./07-QUIZ-QUESTIONS(OBLIGATOIRE).md)
**Durée : 35 minutes**
- 25 questions à choix multiples
- 5 sections : Concepts, Structure, Cryptographie, Sécurité, Implémentation
- Format sans les réponses

### [08 - Quiz Réponses](./08-QUIZ-REPONSES(OBLIGATOIRE).md)
- Corrections détaillées
- Explications approfondies
- Barème de notation

### [09 - Comparaison des Approches](./09-COMPARAISON-APPROCHES(COURS).md)
**Durée : 45 minutes**
- JWT Custom vs Clerk vs NextAuth
- Comparaison technique détaillée
- Analyse par scénarios réels
- Matrice de décision
- Recommandations finales

**Concepts clés :**
- Trade-offs de chaque approche
- Coûts comparés sur 3 ans
- Temps de développement
- Sécurité et responsabilités

### [10 - Exercices](./10-EXERCICES(OPTIONNEL).md)
**Durée : 4-5 heures**
- 4 exercices pratiques complexes
- 2 questions ouvertes de réflexion
- Critères d'évaluation détaillés

## Progression recommandée

### Parcours Standard (5 heures)
1. Lire tous les modules dans l'ordre (00 → 06)
2. Faire le quiz (07-08)
3. Réaliser au moins 2 exercices pratiques

### Parcours Rapide (2 heures)
1. Modules 01, 02, 05 (concepts et sécurité)
2. Quiz uniquement
3. Survol des autres modules

### Parcours Expert (1 heure)
1. Module 03 (cryptographie) et 06 (implémentation)
2. Exercices pratiques uniquement
3. Questions ouvertes

## Critères de réussite

Après ce cours, vous devriez pouvoir :

- Expliquer la structure complète d'un JWT
- Décoder et inspecter un JWT manuellement
- Comprendre comment fonctionne la signature cryptographique
- Identifier les vulnérabilités de sécurité courantes
- Choisir entre JWT et sessions selon le contexte
- Implémenter un système d'authentification JWT
- Comparer HS256 et RS256
- Utiliser le pattern access + refresh tokens

## Comparaison avec les autres examens

### Examen-1 : Clerk + Upsert
- Utilise JWT en interne (géré par Clerk)
- Vous n'avez pas à créer ou vérifier les JWT vous-même

### Examen-2 : Webhooks
- Signatures de webhooks utilisent HMAC (similaire à JWT)
- Concept de vérification cryptographique

### Examen-3 : NextAuth
- Utilise JWT pour la stratégie session="jwt"
- Vous configurez les callbacks mais NextAuth gère les JWT

### Examen-4 : JWT (ce cours)
- Comprend les JWT en profondeur
- Implémente JWT manuellement sans bibliothèque tierce
- Comprend la cryptographie sous-jacente

## Ressources complémentaires

### Dans ce projet
- `examen-1/` - Voir comment Clerk utilise les JWT
- `examen-3/` - Voir comment NextAuth gère les JWT
- `documentation-1/` - Contexte général d'authentification

### Documentation officielle
- [JWT.io](https://jwt.io/) - Décodeur et documentation
- [RFC 7519](https://datatracker.ietf.org/doc/html/rfc7519) - Spécification JWT
- [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) - Bibliothèque Node.js
- [jose](https://github.com/panva/jose) - Bibliothèque moderne

### Outils
- [JWT.io Debugger](https://jwt.io/#debugger) - Décoder et vérifier
- [JWT Inspector](https://chrome.google.com/webstore) - Extension Chrome
- OpenSSL - Génération de secrets

## Notation du quiz

**Total : 50 points**
- Quiz : 50 points (25 questions × 2 points)

**Barème :**
- 45-50 : Excellente maîtrise des JWT
- 38-44 : Bonne compréhension
- 30-37 : Compréhension satisfaisante
- 25-29 : Révision recommandée
- <25 : Révision nécessaire

## Points clés à retenir

### Structure JWT
```
header.payload.signature
```

### Les 3 parties
1. **Header** : Algorithme et type
2. **Payload** : Données (claims)
3. **Signature** : HMAC ou RSA du header + payload

### Règles d'or

**À FAIRE :**
- Toujours inclure expiration (exp)
- Utiliser HTTPS
- Cookies httpOnly
- Secret fort et unique
- Vérifier l'algorithme
- Courte durée + refresh token

**À NE PAS FAIRE :**
- Données sensibles dans le payload
- Accepter alg=none
- Secret faible ou hardcodé
- Stocker dans localStorage
- JWT sans expiration
- Comparer payload sans vérifier signature

## Commence par : [00-INTRODUCTION(COURS).md](./00-INTRODUCTION(COURS).md)

Ou pour une compréhension technique immédiate : [02-ANATOMIE-JWT(COURS).md](./02-ANATOMIE-JWT(COURS).md)


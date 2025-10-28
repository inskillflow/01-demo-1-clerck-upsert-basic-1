# Examen 4 : JWT - JSON Web Tokens

## Description

Ce cours complet explique les JWT (JSON Web Tokens) en profondeur : structure, cryptographie, sécurité, et implémentation pratique. Approche narrative détaillée, même style que les examens précédents.

## Contenu

### Cours (6 modules)

**[00-INTRODUCTION(COURS).md](./00-INTRODUCTION(COURS).md)** - Présentation et objectifs

**[01-FONDATIONS-JWT(COURS).md](./01-FONDATIONS-JWT(COURS).md)** - Qu'est-ce qu'un JWT, problèmes résolus, avantages/limitations

**[02-ANATOMIE-JWT(COURS).md](./02-ANATOMIE-JWT(COURS).md)** - Structure détaillée (header, payload, signature)

**[03-CRYPTOGRAPHIE-SIGNATURE(COURS).md](./03-CRYPTOGRAPHIE-SIGNATURE(COURS).md)** - HMAC, RSA, vérification cryptographique

**[04-JWT-VS-SESSIONS(COURS).md](./04-JWT-VS-SESSIONS(COURS).md)** - Comparaison sessions traditionnelles vs JWT

**[05-SECURITE-JWT(COURS).md](./05-SECURITE-JWT(COURS).md)** - Vulnérabilités courantes et bonnes pratiques

**[06-IMPLEMENTATION-NEXTJS(COURS).md](./06-IMPLEMENTATION-NEXTJS(COURS).md)** - Code complet avec Next.js et jsonwebtoken

### Évaluation

**[07-QUIZ-QUESTIONS(OBLIGATOIRE).md](./07-QUIZ-QUESTIONS(OBLIGATOIRE).md)** - 25 questions à choix multiples

**[08-QUIZ-REPONSES(OBLIGATOIRE).md](./08-QUIZ-REPONSES(OBLIGATOIRE).md)** - Corrections avec explications

**[09-COMPARAISON-APPROCHES(COURS).md](./09-COMPARAISON-APPROCHES(COURS).md)** - JWT vs Clerk vs NextAuth : quelle est la meilleure approche ?

**[10-EXERCICES(OPTIONNEL).md](./10-EXERCICES(OPTIONNEL).md)** - 4 exercices pratiques + 2 questions ouvertes

### Navigation

**[INDEX.md](./INDEX.md)** - Index complet avec vue d'ensemble et progression recommandée

## Thème central : Comprendre les JWT

Ce cours répond notamment aux questions :
- **Comment fonctionne réellement un JWT ?**
- **Pourquoi les JWT sont-ils sécurisés ?**
- **Quand utiliser JWT vs sessions traditionnelles ?**
- **Comment implémenter des JWT manuellement ?**
- **Quelles sont les vulnérabilités à éviter ?**

## Lien avec les autres examens

### Examen-1 : Clerk + Upsert
Clerk utilise des JWT pour les sessions. Après ce cours, vous comprendrez ce qui se passe en coulisse quand vous appelez `auth()`.

### Examen-2 : Webhooks
Les webhooks Clerk utilisent HMAC pour les signatures (même principe que JWT HS256).

### Examen-3 : NextAuth
NextAuth utilise JWT avec la stratégie session="jwt". Vous comprendrez maintenant comment NextAuth crée et vérifie ces JWT.

### Examen-4 : JWT (ce cours)
Comprendre les fondations cryptographiques qui sous-tendent tous les systèmes modernes d'authentification.

## Comment utiliser ce cours

1. **Contexte :** Optionnel mais enrichit la compréhension des examens 1, 2, et 3
2. Commencez par [INDEX.md](./INDEX.md) pour la vue d'ensemble
3. Suivez les modules 00 → 06 dans l'ordre
4. Module 02 (Anatomie) et 03 (Cryptographie) sont les plus techniques
5. Testez vos connaissances avec le quiz (07-08)
6. Pratiquez avec les exercices (09)

## Durée estimée

- **Lecture complète :** 5-6 heures
- **Quiz :** 35 minutes
- **Exercices :** 4-5 heures
- **Total :** 9-12 heures pour maîtrise complète

## Caractéristiques pédagogiques

- Style narratif et progressif
- Explications cryptographiques détaillées
- Exemples de JWT réels décodés
- Analyse de vulnérabilités concrètes
- Code d'implémentation complet
- Comparaisons JWT vs Sessions
- Approche "pourquoi avant comment"

## Public cible

- Développeurs voulant comprendre les JWT en profondeur
- Personnes ayant suivi examen-1, 2, ou 3 et voulant approfondir
- Développeurs implémentant l'authentification custom
- Personnes préparant des certifications de sécurité
- Architectes comparant différentes stratégies de session

## Prérequis

- JavaScript/TypeScript de base
- Notions de HTTP et cookies
- Compréhension générale de l'authentification
- Avoir suivi examen-1 recommandé (contexte)

## Objectifs d'apprentissage

Après ce cours, vous serez capable de :

1. Expliquer la structure complète d'un JWT (header, payload, signature)
2. Décoder un JWT manuellement et inspecter son contenu
3. Comprendre comment HMAC et RSA fonctionnent pour les signatures
4. Identifier les vulnérabilités de sécurité courantes
5. Comparer JWT et sessions pour faire des choix architecturaux
6. Implémenter un système d'authentification JWT dans Next.js
7. Utiliser le pattern access + refresh tokens
8. Appliquer les bonnes pratiques de sécurité

## Structure du quiz

**25 questions à choix multiples** :
- 5 questions sur les concepts fondamentaux
- 5 questions sur la structure du JWT
- 5 questions sur la cryptographie
- 5 questions sur la sécurité
- 5 questions sur l'implémentation

**4 exercices pratiques** :
1. Créer et vérifier des JWT manuellement
2. Système d'authentification complet
3. Access + Refresh tokens pattern
4. Analyse de sécurité (code vulnérable)

**2 questions ouvertes** :
1. JWT vs Sessions - Choix architectural (3 cas)
2. Attaques et contre-mesures (5 attaques)

**Notation sur 50 points (quiz uniquement)**

## Points techniques clés

### Structure d'un JWT
```
eyJhbGci...  .  eyJzdWIi...  .  SflKxwRJ...
  header         payload         signature
```

### Algorithmes principaux

**HS256 :** HMAC avec SHA-256, clé symétrique
**RS256 :** RSA avec SHA-256, clé asymétrique

### Claims standards

- **sub** : Subject (ID utilisateur)
- **exp** : Expiration time
- **iat** : Issued at
- **iss** : Issuer
- **aud** : Audience

### Règles de sécurité

1. Secret fort (32+ bytes aléatoires)
2. Toujours inclure expiration
3. HTTPS obligatoire
4. Cookies httpOnly
5. Pas de données sensibles
6. Vérifier l'algorithme
7. Rotation des secrets
8. Durée courte avec refresh token

## Cas d'usage des JWT

**Idéal pour :**
- API REST stateless
- Applications serverless
- Microservices
- Applications mobiles
- SSO (Single Sign-On)

**Moins adapté pour :**
- Applications nécessitant révocation immédiate
- Données de session très volumineuses
- Applications monolithiques simples
- Compliance avec audit strict de sessions

## Commence par : [00-INTRODUCTION(COURS).md](./00-INTRODUCTION(COURS).md)

Si vous voulez comprendre immédiatement la technique : [02-ANATOMIE-JWT(COURS).md](./02-ANATOMIE-JWT(COURS).md)


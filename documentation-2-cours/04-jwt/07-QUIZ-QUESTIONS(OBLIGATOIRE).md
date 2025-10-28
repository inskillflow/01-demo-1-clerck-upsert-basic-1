# Quiz : JWT - JSON Web Tokens

## Instructions

- 25 questions à choix multiples
- Durée estimée : 35 minutes
- Cochez votre réponse pour chaque question
- Les réponses sont dans le fichier 08-QUIZ-REPONSES(OBLIGATOIRE).md

---

## Section 1 : Concepts Fondamentaux

### Question 1
Que signifie JWT ?

- [ ] A) JavaScript Web Technology
- [ ] B) JSON Web Token
- [ ] C) Java Web Tool
- [ ] D) Just Web Token

### Question 2
Combien de parties composent un JWT ?

- [ ] A) Une seule chaîne
- [ ] B) Deux parties séparées par un point
- [ ] C) Trois parties séparées par des points
- [ ] D) Quatre parties

### Question 3
Quel est l'avantage principal des JWT par rapport aux sessions traditionnelles ?

- [ ] A) Plus sécurisé
- [ ] B) Stateless, pas besoin de stocker les sessions côté serveur
- [ ] C) Plus rapide à créer
- [ ] D) Impossible à voler

### Question 4
Quelle est la principale limitation des JWT ?

- [ ] A) Ils sont trop lents
- [ ] B) Impossible de révoquer immédiatement un JWT valide
- [ ] C) Ils ne fonctionnent qu'avec HTTPS
- [ ] D) Limités à 100 caractères

### Question 5
Les données du payload JWT sont-elles chiffrées ?

- [ ] A) Oui, chiffrées avec AES
- [ ] B) Non, juste encodées en base64 (lisibles par tous)
- [ ] C) Chiffrées uniquement avec RS256
- [ ] D) Chiffrées avec le secret

---

## Section 2 : Structure du JWT

### Question 6
Que contient le header d'un JWT ?

- [ ] A) Les données utilisateur
- [ ] B) L'algorithme de signature et le type de token
- [ ] C) Le mot de passe
- [ ] D) La signature

### Question 7
Quel claim standard représente l'ID de l'utilisateur dans un JWT ?

- [ ] A) id
- [ ] B) userId
- [ ] C) sub (subject)
- [ ] D) user

### Question 8
Que signifie le claim "exp" dans un JWT ?

- [ ] A) Expérience de l'utilisateur
- [ ] B) Timestamp d'expiration du token
- [ ] C) Export des données
- [ ] D) Expression régulière

### Question 9
Quel encoding est utilisé pour les parties du JWT ?

- [ ] A) UTF-8
- [ ] B) Hexadécimal
- [ ] C) Base64URL
- [ ] D) ASCII

### Question 10
Peut-on ajouter des claims personnalisés au payload ?

- [ ] A) Non, seuls les claims standards sont autorisés
- [ ] B) Oui, on peut ajouter n'importe quelles données
- [ ] C) Oui mais maximum 3 claims
- [ ] D) Seulement en production

---

## Section 3 : Cryptographie

### Question 11
Que signifie HS256 ?

- [ ] A) Hash Simple 256
- [ ] B) HMAC avec SHA-256
- [ ] C) HTTP Secure 256
- [ ] D) Hashing Standard 256

### Question 12
Quelle est la différence entre HS256 et RS256 ?

- [ ] A) HS256 est plus rapide
- [ ] B) HS256 utilise une clé symétrique, RS256 utilise une paire de clés asymétriques
- [ ] C) RS256 est obsolète
- [ ] D) Il n'y a pas de différence

### Question 13
À quoi sert la signature dans un JWT ?

- [ ] A) Chiffrer le payload
- [ ] B) Garantir que le JWT n'a pas été modifié
- [ ] C) Compresser le token
- [ ] D) Identifier l'utilisateur

### Question 14
Peut-on créer une signature valide sans connaître la clé secrète ?

- [ ] A) Oui, en utilisant le payload
- [ ] B) Non, c'est mathématiquement impossible
- [ ] C) Oui, avec l'algorithme none
- [ ] D) Oui, en devinant le secret

### Question 15
Que fait la fonction `jwt.verify()` ?

- [ ] A) Crée un nouveau JWT
- [ ] B) Vérifie la signature et l'expiration du JWT
- [ ] C) Chiffre le payload
- [ ] D) Stocke le JWT en base de données

---

## Section 4 : Sécurité

### Question 16
Où devrait-on stocker un JWT dans un navigateur pour une sécurité maximale ?

- [ ] A) localStorage
- [ ] B) sessionStorage
- [ ] C) Cookie httpOnly
- [ ] D) Dans une variable globale

### Question 17
Quelle attaque exploite l'acceptation de l'algorithme "none" ?

- [ ] A) XSS
- [ ] B) CSRF
- [ ] C) Création de JWT sans signature valide
- [ ] D) SQL Injection

### Question 18
Pourquoi ne doit-on jamais mettre un mot de passe dans un JWT ?

- [ ] A) C'est trop long
- [ ] B) Le payload n'est pas chiffré, juste encodé (lisible par tous)
- [ ] C) Ça ralentit la vérification
- [ ] D) C'est interdit par le RFC

### Question 19
Quelle est la durée d'expiration recommandée pour un access token JWT ?

- [ ] A) 1 seconde
- [ ] B) 15 minutes à 1 heure
- [ ] C) 1 an
- [ ] D) Jamais d'expiration

### Question 20
Comment révoquer un JWT avant son expiration naturelle ?

- [ ] A) Modifier la signature
- [ ] B) Supprimer le cookie côté client
- [ ] C) Maintenir une blacklist de JWT révoqués ou vérifier en DB
- [ ] D) C'est impossible

---

## Section 5 : Implémentation

### Question 21
Quelle bibliothèque Node.js est couramment utilisée pour les JWT ?

- [ ] A) jwt-auth
- [ ] B) jsonwebtoken ou jose
- [ ] C) token-maker
- [ ] D) auth-jwt

### Question 22
Quelle commande génère un secret sécurisé pour signer les JWT ?

- [ ] A) `npm run generate-secret`
- [ ] B) `openssl rand -base64 32`
- [ ] C) `jwt create-secret`
- [ ] D) `node secret.js`

### Question 23
Dans le pattern access + refresh token, quelle est la durée typique du refresh token ?

- [ ] A) 15 minutes
- [ ] B) 1 heure
- [ ] C) 7 à 30 jours
- [ ] D) 1 an

### Question 24
Où le refresh token devrait-il être stocké ?

- [ ] A) Dans le JWT access token
- [ ] B) En base de données côté serveur
- [ ] C) Dans localStorage
- [ ] D) Dans le header

### Question 25
Quel header HTTP est standard pour envoyer un JWT à une API ?

- [ ] A) `X-Auth-Token: token`
- [ ] B) `Authorization: Bearer token`
- [ ] C) `Token: token`
- [ ] D) `JWT: token`

---

**Voir le fichier 08-QUIZ-REPONSES(OBLIGATOIRE).md pour les corrections**


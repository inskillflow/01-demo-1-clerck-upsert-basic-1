# Quiz : Réponses et Explications

## Section 1 : Concepts de Validation

### Question 1
**Réponse : B** - Elle peut être contournée facilement par un attaquant

**Explication :** La validation client (HTML, JavaScript) peut être désactivée ou contournée en envoyant des requêtes directes avec curl, Postman, ou en modifiant le DOM.

### Question 2
**Réponse : B** - Ne jamais faire confiance aux données venant du client

**Explication :** Principe fondamental de la sécurité web : toujours valider côté serveur car les données client peuvent être modifiées ou forgées.

### Question 3
**Réponse : B** - Corruption de données, injections, crashes

**Explication :** Sans validation serveur, des données invalides entrent en DB, des injections SQL/XSS sont possibles, et l'application peut crasher sur données inattendues.

### Question 4
**Réponse : C** - Client pour l'UX ET serveur pour la sécurité

**Explication :** Validation client améliore l'UX (feedback immédiat). Validation serveur assure la sécurité (incontournable). Les deux sont complémentaires.

### Question 5
**Réponse : A** - Type-safety, schémas réutilisables, messages d'erreur structurés

**Explication :** Zod offre l'intégration TypeScript (z.infer), la réutilisabilité des schémas, des messages personnalisables, et des erreurs structurées facilement exploitables.

---

## Section 2 : Fondations Zod

### Question 6
**Réponse : A** - npm install zod

**Explication :** Zod s'installe simplement via npm. Aucune configuration supplémentaire nécessaire.

### Question 7
**Réponse : B** - parse() lance une exception si invalide, safeParse() retourne un objet result

**Explication :** parse() utilise try-catch. safeParse() retourne { success: boolean, data/error } sans lever d'exception.

### Question 8
**Réponse : C** - z.string().email()

**Explication :** On commence par z.string() puis on chaîne .email() pour la validation d'email.

### Question 9
**Réponse : A** - z.string().optional()

**Explication :** La méthode optional() rend le champ optionnel (peut être undefined).

### Question 10
**Réponse : B** - z.infer<typeof schema>

**Explication :** z.infer est un type utility de Zod qui extrait le type TypeScript depuis un schéma Zod.

---

## Section 3 : Schémas Avancés

### Question 11
**Réponse : B** - Ajouter des règles de validation personnalisées

**Explication :** refine() permet d'ajouter n'importe quelle logique de validation custom avec une fonction qui retourne true/false.

### Question 12
**Réponse : B** - Utiliser refine() sur l'objet complet

**Explication :** refine() sur un objet reçoit toutes les données et peut comparer password et confirmPassword.

### Question 13
**Réponse : B** - Modifier les données après validation réussie

**Explication :** transform() permet de normaliser ou convertir les données (toLowerCase, trim, parseInt, etc.) après validation.

### Question 14
**Réponse : A** - z.enum(['value1', 'value2'])

**Explication :** z.enum() accepte un tuple de valeurs littérales possibles.

### Question 15
**Réponse : B** - Convertit automatiquement une string en number avant validation

**Explication :** z.coerce.number() essaie de convertir la valeur en number. Utile pour query params ou form data qui sont des strings.

---

## Section 4 : Validation Formulaires

### Question 16
**Réponse : B** - React Hook Form

**Explication :** React Hook Form est la bibliothèque la plus utilisée avec Zod via le zodResolver.

### Question 17
**Réponse : A** - Via zodResolver de @hookform/resolvers

**Explication :** Le package @hookform/resolvers fournit zodResolver qui connecte Zod à React Hook Form.

### Question 18
**Réponse : C** - Côté client ET côté serveur

**Explication :** Client pour UX (feedback immédiat), serveur pour sécurité (incontournable).

### Question 19
**Réponse : B** - Utiliser error.flatten().fieldErrors

**Explication :** flatten() organise les erreurs Zod par champ, retournant un objet { fieldName: [errors] } facile à mapper dans l'UI.

### Question 20
**Réponse : C** - Configurable via mode: 'onChange' ou 'onSubmit'

**Explication :** React Hook Form permet de configurer quand déclencher la validation via l'option mode.

---

## Section 5 : API et Patterns

### Question 21
**Réponse : B** - Avant toute opération, en premier

**Explication :** Validez TOUJOURS avant de toucher à la base de données ou d'exécuter toute logique métier.

### Question 22
**Réponse : B** - Retourner status 400 avec les détails de l'erreur

**Explication :** 400 Bad Request est le code approprié pour des données invalides. Incluez les détails pour aider le client à corriger.

### Question 23
**Réponse : B** - Un objet avec fieldErrors et formErrors

**Explication :** flatten() retourne { fieldErrors: {...}, formErrors: [...] } pour faciliter l'affichage des erreurs par champ.

### Question 24
**Réponse : B** - schema.pick({ field1: true, field2: true })

**Explication :** pick() crée un nouveau schéma avec seulement les champs sélectionnés.

### Question 25
**Réponse : B** - Oui, en créant un schéma et en parsant process.env

**Explication :** Valider les variables d'environnement au démarrage est une excellente pratique pour détecter les erreurs de configuration tôt.

---

## Barème

**Total : 50 points (25 questions × 2 points)**

- 45-50 : Excellente maîtrise de Zod
- 38-44 : Bonne compréhension
- 30-37 : Compréhension satisfaisante
- 25-29 : Compréhension partielle
- <25 : Révision nécessaire


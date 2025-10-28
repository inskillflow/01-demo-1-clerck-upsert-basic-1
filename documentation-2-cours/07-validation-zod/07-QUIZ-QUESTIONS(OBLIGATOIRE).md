# Quiz : Validation avec Zod

## Instructions

- 25 questions à choix multiples
- Durée estimée : 30 minutes
- Cochez votre réponse pour chaque question
- Les réponses sont dans le fichier 08-QUIZ-REPONSES(OBLIGATOIRE).md

---

## Section 1 : Concepts de Validation

### Question 1
Pourquoi la validation côté client n'est-elle pas suffisante ?

- [ ] A) Elle est trop lente
- [ ] B) Elle peut être contournée facilement par un attaquant
- [ ] C) Elle ne fonctionne pas avec TypeScript
- [ ] D) Elle est obsolète

### Question 2
Quel est le principe fondamental de la validation web ?

- [ ] A) Valider uniquement côté client
- [ ] B) Ne jamais faire confiance aux données venant du client
- [ ] C) La validation est optionnelle
- [ ] D) Valider seulement en production

### Question 3
Que peut-il se passer sans validation serveur appropriée ?

- [ ] A) Rien de grave
- [ ] B) Corruption de données, injections, crashes
- [ ] C) L'application est plus rapide
- [ ] D) TypeScript protège automatiquement

### Question 4
Quelle est la bonne stratégie de validation ?

- [ ] A) Client uniquement pour l'UX
- [ ] B) Serveur uniquement pour la sécurité
- [ ] C) Client pour l'UX ET serveur pour la sécurité
- [ ] D) Aucune validation si on utilise TypeScript

### Question 5
Qu'est-ce que Zod apporte par rapport à une validation manuelle ?

- [ ] A) Type-safety, schémas réutilisables, messages d'erreur structurés
- [ ] B) Juste une syntaxe différente
- [ ] C) Uniquement la performance
- [ ] D) Rien de spécial

---

## Section 2 : Fondations Zod

### Question 6
Comment installer Zod ?

- [ ] A) npm install zod
- [ ] B) npm install @zod/core
- [ ] C) npm install validation
- [ ] D) Inclus dans Next.js

### Question 7
Quelle est la différence entre parse() et safeParse() ?

- [ ] A) parse() est plus rapide
- [ ] B) parse() lance une exception si invalide, safeParse() retourne un objet result
- [ ] C) safeParse() est obsolète
- [ ] D) Aucune différence

### Question 8
Comment créer un schéma pour une string email ?

- [ ] A) z.string()
- [ ] B) z.email()
- [ ] C) z.string().email()
- [ ] D) z.validate('email')

### Question 9
Comment rendre un champ optionnel dans Zod ?

- [ ] A) z.string().optional()
- [ ] B) z.optional(z.string())
- [ ] C) z.string().nullable()
- [ ] D) z.string()?

### Question 10
Comment inférer un type TypeScript depuis un schéma Zod ?

- [ ] A) typeof schema
- [ ] B) z.infer<typeof schema>
- [ ] C) schema.type
- [ ] D) z.type(schema)

---

## Section 3 : Schémas Avancés

### Question 11
À quoi sert la méthode refine() ?

- [ ] A) Améliorer les performances
- [ ] B) Ajouter des règles de validation personnalisées
- [ ] C) Refactoriser le code
- [ ] D) Supprimer des champs

### Question 12
Comment valider que deux champs (password et confirmPassword) correspondent ?

- [ ] A) z.string().equals()
- [ ] B) Utiliser refine() sur l'objet complet
- [ ] C) C'est impossible avec Zod
- [ ] D) z.match()

### Question 13
À quoi sert transform() ?

- [ ] A) Valider les données
- [ ] B) Modifier les données après validation réussie
- [ ] C) Changer le type du schéma
- [ ] D) Améliorer les performances

### Question 14
Comment créer un enum avec Zod ?

- [ ] A) z.enum(['value1', 'value2'])
- [ ] B) z.string().oneOf(['value1', 'value2'])
- [ ] C) z.array(['value1', 'value2'])
- [ ] D) z.type.enum()

### Question 15
Que fait z.coerce.number() ?

- [ ] A) Valide uniquement les nombres
- [ ] B) Convertit automatiquement une string en number avant validation
- [ ] C) Force le nombre à être un entier
- [ ] D) Arrondit le nombre

---

## Section 4 : Validation Formulaires

### Question 16
Quelle bibliothèque est couramment utilisée avec Zod pour les formulaires React ?

- [ ] A) Formik
- [ ] B) React Hook Form
- [ ] C) Redux Form
- [ ] D) Final Form

### Question 17
Comment intégrer Zod avec React Hook Form ?

- [ ] A) Via zodResolver de @hookform/resolvers
- [ ] B) Via une prop validate
- [ ] C) Manuellement dans onSubmit
- [ ] D) Ce n'est pas possible

### Question 18
Où devrait-on valider les données d'un formulaire ?

- [ ] A) Uniquement côté client
- [ ] B) Uniquement côté serveur
- [ ] C) Côté client ET côté serveur
- [ ] D) La validation n'est pas nécessaire

### Question 19
Comment afficher les erreurs Zod dans un formulaire ?

- [ ] A) console.log(errors)
- [ ] B) Utiliser error.flatten().fieldErrors
- [ ] C) errors.map()
- [ ] D) C'est automatique

### Question 20
React Hook Form avec Zod valide-t-il automatiquement à chaque frappe ?

- [ ] A) Non, seulement à la soumission
- [ ] B) Oui, à chaque onChange
- [ ] C) Configurable via mode: 'onChange' ou 'onSubmit'
- [ ] D) Jamais

---

## Section 5 : API et Patterns

### Question 21
Dans une API route Next.js, quand devrait-on valider les données ?

- [ ] A) Après les avoir insérées en DB
- [ ] B) Avant toute opération, en premier
- [ ] C) C'est optionnel
- [ ] D) Uniquement en production

### Question 22
Comment gérer une erreur de validation Zod dans une API route ?

- [ ] A) Ignorer l'erreur
- [ ] B) Retourner status 400 avec les détails de l'erreur
- [ ] C) Retourner status 500
- [ ] D) Rediriger vers une page d'erreur

### Question 23
Que retourne flatten() sur une ZodError ?

- [ ] A) Un tableau de strings
- [ ] B) Un objet avec fieldErrors et formErrors
- [ ] C) Une string unique
- [ ] D) undefined

### Question 24
Comment créer un schéma dérivé avec seulement certains champs d'un schéma existant ?

- [ ] A) schema.select()
- [ ] B) schema.pick({ field1: true, field2: true })
- [ ] C) schema.filter()
- [ ] D) schema.extract()

### Question 25
Peut-on valider les variables d'environnement au démarrage avec Zod ?

- [ ] A) Non, Zod est uniquement pour les formulaires
- [ ] B) Oui, en créant un schéma et en parsant process.env
- [ ] C) Seulement en développement
- [ ] D) C'est déconseillé

---

**Voir le fichier 08-QUIZ-REPONSES(OBLIGATOIRE).md pour les corrections**


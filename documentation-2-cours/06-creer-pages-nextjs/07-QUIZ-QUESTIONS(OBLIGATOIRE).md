# Quiz : Créer des Pages Next.js

## Instructions

- 25 questions à choix multiples
- Durée estimée : 30 minutes
- Cochez votre réponse pour chaque question
- Les réponses sont dans le fichier 08-QUIZ-REPONSES(OBLIGATOIRE).md

---

## Section 1 : layout.tsx

### Question 1
Que doit absolument contenir le layout racine app/layout.tsx ?

- [ ] A) Seulement {children}
- [ ] B) Les balises <html> et <body>
- [ ] C) Un header et footer
- [ ] D) Des métadonnées

### Question 2
Comment créer un layout qui persiste entre les navigations ?

- [ ] A) Utiliser template.tsx
- [ ] B) Utiliser layout.tsx
- [ ] C) Utiliser page.tsx
- [ ] D) Utiliser _app.js

### Question 3
Peut-on avoir plusieurs layout.tsx dans une application ?

- [ ] A) Non, un seul layout racine
- [ ] B) Oui, les layouts s'imbriquent dans l'arborescence
- [ ] C) Maximum 3 layouts
- [ ] D) Seulement en production

### Question 4
Dans un layout, où placer un ClerkProvider ou SessionProvider ?

- [ ] A) Dans page.tsx
- [ ] B) Dans le layout racine qui wrappe {children}
- [ ] C) Dans middleware.ts
- [ ] D) Dans chaque page individuellement

### Question 5
Comment accéder au pathname dans un layout pour la navigation active ?

- [ ] A) Directement avec usePathname() dans le layout
- [ ] B) Créer un Client Component séparé qui utilise usePathname()
- [ ] C) Utiliser window.location
- [ ] D) C'est impossible

---

## Section 2 : page.tsx

### Question 6
Quel est le type par défaut d'un composant page.tsx dans App Router ?

- [ ] A) Client Component
- [ ] B) Server Component
- [ ] C) Hybrid Component
- [ ] D) Static Component

### Question 7
Peut-on rendre un composant page.tsx asynchrone ?

- [ ] A) Non, jamais
- [ ] B) Oui, si c'est un Server Component
- [ ] C) Oui, si c'est un Client Component
- [ ] D) Seulement dans les API routes

### Question 8
Comment fetch des données directement dans une page (Server Component) ?

- [ ] A) Utiliser getServerSideProps()
- [ ] B) Utiliser useEffect()
- [ ] C) Await directement dans le composant async
- [ ] D) Utiliser fetch() dans useState

### Question 9
Pour utiliser useState dans une page, que faut-il ajouter ?

- [ ] A) import { useState } from 'react'
- [ ] B) La directive 'use client' en haut du fichier
- [ ] C) Configurer dans next.config.js
- [ ] D) Rien, ça fonctionne automatiquement

### Question 10
Comment rediriger vers /signin si l'utilisateur n'est pas authentifié ?

- [ ] A) window.location.href = '/signin'
- [ ] B) redirect('/signin') de next/navigation
- [ ] C) <Redirect to="/signin" />
- [ ] D) router.push('/signin')

---

## Section 3 : loading.tsx

### Question 11
Quand loading.tsx s'affiche-t-il ?

- [ ] A) Pendant que page.tsx fait des fetch asynchrones
- [ ] B) Pendant 5 secondes fixes
- [ ] C) Seulement en production
- [ ] D) Quand on le déclenche manuellement

### Question 12
loading.tsx doit-il être un Client ou Server Component ?

- [ ] A) Obligatoirement Client Component
- [ ] B) Obligatoirement Server Component
- [ ] C) Peut être l'un ou l'autre
- [ ] D) Ni l'un ni l'autre

### Question 13
Quelle est la meilleure pratique pour un loading.tsx professionnel ?

- [ ] A) Spinner simple centré
- [ ] B) Skeleton qui reproduit la structure de la page
- [ ] C) Texte "Loading..."
- [ ] D) Page blanche

### Question 14
Comment créer un skeleton avec animation ?

- [ ] A) Utiliser animate-spin
- [ ] B) Utiliser animate-pulse de Tailwind
- [ ] C) Créer une animation CSS custom
- [ ] D) Utiliser setTimeout

### Question 15
Peut-on avoir plusieurs loading.tsx dans une application ?

- [ ] A) Non, un seul loading global
- [ ] B) Oui, un par route si nécessaire
- [ ] C) Maximum 3
- [ ] D) Seulement avec route groups

---

## Section 4 : error.tsx

### Question 16
error.tsx doit-il être un Client ou Server Component ?

- [ ] A) Server Component
- [ ] B) Client Component (obligatoirement avec 'use client')
- [ ] C) Les deux fonctionnent
- [ ] D) Aucun des deux

### Question 17
Quels paramètres reçoit un composant error.tsx ?

- [ ] A) Aucun paramètre
- [ ] B) error et reset
- [ ] C) message et code
- [ ] D) type et details

### Question 18
À quoi sert la fonction reset() dans error.tsx ?

- [ ] A) Recharger toute l'application
- [ ] B) Tenter de re-rendre le segment qui a causé l'erreur
- [ ] C) Supprimer l'erreur des logs
- [ ] D) Rediriger vers l'accueil

### Question 19
Doit-on afficher les détails d'erreur en production ?

- [ ] A) Oui, toujours
- [ ] B) Non, uniquement en développement
- [ ] C) Seulement pour les admins
- [ ] D) C'est obligatoire

### Question 20
Comment logger une erreur vers un service externe (Sentry) depuis error.tsx ?

- [ ] A) Dans la fonction render
- [ ] B) Dans un useEffect()
- [ ] C) Dans le catch
- [ ] D) C'est automatique

---

## Section 5 : API Routes

### Question 21
Comment nommer les fonctions dans une API route (route.ts) ?

- [ ] A) handler, getHandler, postHandler
- [ ] B) GET, POST, PUT, DELETE (nom de la méthode HTTP)
- [ ] C) get, post, put, delete (minuscules)
- [ ] D) Peu importe le nom

### Question 22
Comment accéder aux paramètres dynamiques dans une API route ?

- [ ] A) request.params
- [ ] B) Le deuxième paramètre : { params }
- [ ] C) useParams()
- [ ] D) request.query

### Question 23
Comment retourner du JSON depuis une API route ?

- [ ] A) res.json({ data })
- [ ] B) NextResponse.json({ data })
- [ ] C) return { data }
- [ ] D) JSON.stringify({ data })

### Question 24
Comment gérer différentes méthodes HTTP dans le même fichier route.ts ?

- [ ] A) if (req.method === 'GET')
- [ ] B) Exporter des fonctions séparées GET(), POST(), etc.
- [ ] C) switch (req.method)
- [ ] D) Un seul fichier = une seule méthode

### Question 25
Où placer les API routes dans l'App Router ?

- [ ] A) Partout dans app/
- [ ] B) Dans app/api/
- [ ] C) Dans pages/api/
- [ ] D) Dans un dossier routes/

---

**Voir le fichier 08-QUIZ-REPONSES(OBLIGATOIRE).md pour les corrections**


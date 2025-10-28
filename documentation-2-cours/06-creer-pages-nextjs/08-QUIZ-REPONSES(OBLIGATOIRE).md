# Quiz : Réponses et Explications

## Section 1 : layout.tsx

### Question 1
**Réponse : B** - Les balises <html> et <body>

**Explication :** Le layout racine app/layout.tsx doit obligatoirement retourner les balises html et body car c'est le point d'entrée de l'application.

### Question 2
**Réponse : B** - Utiliser layout.tsx

**Explication :** layout.tsx persiste entre les navigations. Le state React est préservé et le composant ne se démonte pas.

### Question 3
**Réponse : B** - Oui, les layouts s'imbriquent dans l'arborescence

**Explication :** Vous pouvez avoir app/layout.tsx, app/dashboard/layout.tsx, app/dashboard/users/layout.tsx, etc. Ils s'imbriquent naturellement.

### Question 4
**Réponse : B** - Dans le layout racine qui wrappe {children}

**Explication :** Les providers globaux (ClerkProvider, SessionProvider) doivent wrapper toute l'application dans le layout racine.

### Question 5
**Réponse : B** - Créer un Client Component séparé qui utilise usePathname()

**Explication :** usePathname() est un hook client. Comme les layouts sont des Server Components par défaut, créez un composant client séparé pour la navigation.

---

## Section 2 : page.tsx

### Question 6
**Réponse : B** - Server Component

**Explication :** Dans App Router, tous les composants sont Server Components par défaut. Ajoutez 'use client' pour en faire des Client Components.

### Question 7
**Réponse : B** - Oui, si c'est un Server Component

**Explication :** Les Server Components peuvent être async et faire des await directement. C'est une des innovations majeures de l'App Router.

### Question 8
**Réponse : C** - Await directement dans le composant async

**Explication :** Dans un Server Component, vous pouvez simplement faire `const users = await prisma.user.findMany()`. Pas besoin de getServerSideProps.

### Question 9
**Réponse : B** - La directive 'use client' en haut du fichier

**Explication :** Les hooks React (useState, useEffect, etc.) ne fonctionnent que dans les Client Components. 'use client' marque le composant comme tel.

### Question 10
**Réponse : B** - redirect('/signin') de next/navigation

**Explication :** Dans les Server Components, utilisez redirect() de next/navigation. Dans les Client Components, utilisez router.push() ou window.location.

---

## Section 3 : loading.tsx

### Question 11
**Réponse : A** - Pendant que page.tsx fait des fetch asynchrones

**Explication :** Next.js wrappe automatiquement page.tsx dans un Suspense avec loading.tsx comme fallback.

### Question 12
**Réponse : C** - Peut être l'un ou l'autre

**Explication :** loading.tsx peut être Server Component (statique) ou Client Component (si vous avez besoin d'animations avec hooks).

### Question 13
**Réponse : B** - Skeleton qui reproduit la structure de la page

**Explication :** Les skeletons donnent une meilleure perception de performance et réduisent le layout shift quand le contenu réel apparaît.

### Question 14
**Réponse : B** - Utiliser animate-pulse de Tailwind

**Explication :** Tailwind fournit animate-pulse qui crée un effet de pulsation parfait pour les skeletons.

### Question 15
**Réponse : B** - Oui, un par route si nécessaire

**Explication :** Chaque segment de route peut avoir son propre loading.tsx pour un fallback spécifique.

---

## Section 4 : error.tsx

### Question 16
**Réponse : B** - Client Component (obligatoirement avec 'use client')

**Explication :** error.tsx doit être un Client Component car il utilise des hooks React pour gérer le state d'erreur et le reset.

### Question 17
**Réponse : B** - error et reset

**Explication :** error.tsx reçoit l'objet Error et une fonction reset() pour retenter le rendu.

### Question 18
**Réponse : B** - Tenter de re-rendre le segment qui a causé l'erreur

**Explication :** reset() relance le rendu du composant qui a échoué, utile pour les erreurs temporaires (timeout, réseau).

### Question 19
**Réponse : B** - Non, uniquement en développement

**Explication :** En production, affichez des messages génériques. Les détails techniques uniquement si process.env.NODE_ENV === 'development'.

### Question 20
**Réponse : B** - Dans un useEffect()

**Explication :** Utilisez useEffect pour logger l'erreur au montage du composant error.tsx.

---

## Section 5 : API Routes

### Question 21
**Réponse : B** - GET, POST, PUT, DELETE (nom de la méthode HTTP)

**Explication :** Dans App Router, exportez des fonctions nommées selon la méthode HTTP : export async function GET(), POST(), etc.

### Question 22
**Réponse : B** - Le deuxième paramètre : { params }

**Explication :** Les handlers d'API route reçoivent (request, { params }) où params contient les segments dynamiques.

### Question 23
**Réponse : B** - NextResponse.json({ data })

**Explication :** Dans App Router, utilisez NextResponse.json() pour retourner du JSON. C'est la méthode standard.

### Question 24
**Réponse : B** - Exporter des fonctions séparées GET(), POST(), etc.

**Explication :** Chaque méthode HTTP a sa propre fonction exportée dans route.ts. Next.js route automatiquement selon la méthode de la requête.

### Question 25
**Réponse : B** - Dans app/api/

**Explication :** Par convention, les API routes vont dans app/api/. Ce n'est pas strictement obligatoire mais c'est la pratique recommandée.

---

## Barème

**Total : 50 points (25 questions × 2 points)**

- 45-50 : Excellente maîtrise pratique
- 38-44 : Bonne compréhension
- 30-37 : Compréhension satisfaisante
- 25-29 : Compréhension partielle
- <25 : Révision nécessaire


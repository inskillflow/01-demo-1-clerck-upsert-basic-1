# Module 2 : Authentification avec Clerk

## Comment fonctionne Clerk

Clerk est un service d'authentification hébergé dans le cloud. Quand vous utilisez Clerk, votre application communique avec leurs serveurs pour tout ce qui concerne la gestion des utilisateurs.

### L'architecture de base

Imaginons le flux complet d'une connexion utilisateur :

**Étape 1 : L'utilisateur visite votre site**
Votre application Next.js charge une page. Dans le code, vous avez importé des composants Clerk comme `<SignInButton>` ou `<UserButton>`.

**Étape 2 : L'utilisateur clique sur "Se connecter"**
Le composant Clerk ouvre une interface (popup ou page dédiée) hébergée par Clerk. Cette interface demande l'email et le mot de passe.

**Étape 3 : Vérification des identifiants**
Quand l'utilisateur soumet le formulaire, les données sont envoyées directement aux serveurs Clerk (pas à votre serveur). Clerk vérifie les identifiants dans sa propre base de données.

**Étape 4 : Création du JWT**
Si les identifiants sont corrects, Clerk génère un JWT (JSON Web Token). Ce token est signé cryptographiquement et contient les informations de l'utilisateur.

**Étape 5 : Stockage du token**
Le token est stocké dans les cookies de votre domaine (httpOnly, secure, sameSite). L'utilisateur est maintenant "connecté" du point de vue du navigateur.

**Étape 6 : Fermeture de l'interface**
L'interface Clerk se ferme et l'utilisateur revient à votre application, mais maintenant le cookie d'authentification est présent.

### Les composants Clerk

Clerk fournit plusieurs composants React qui simplifient drastiquement le développement :

**SignInButton / SignUpButton**
Ces composants affichent un bouton qui, au clic, ouvre l'interface de connexion ou d'inscription Clerk.

```typescript
<SignInButton>
  <Button>Se connecter</Button>
</SignInButton>
```

**UserButton**
Un bouton circulaire avec la photo de profil de l'utilisateur. Au clic, affiche un menu avec le profil et l'option de déconnexion.

```typescript
<UserButton afterSignOutUrl="/" />
```

**SignedIn / SignedOut**
Ces composants conditionnels affichent leur contenu selon l'état d'authentification.

```typescript
<SignedOut>
  <p>Vous devez vous connecter</p>
</SignedOut>

<SignedIn>
  <p>Bienvenue !</p>
</SignedIn>
```

### Les fonctions serveur

Côté serveur (Server Components), Clerk fournit des fonctions pour accéder aux informations de l'utilisateur connecté :

**auth()**
Retourne l'ID de l'utilisateur et quelques métadonnées basiques. Rapide car elle lit juste le JWT sans appel réseau.

```typescript
const { userId } = auth()
if (!userId) redirect('/sign-in')
```

**currentUser()**
Retourne l'objet utilisateur complet depuis Clerk. Plus lent car nécessite un appel API vers Clerk, mais donne accès à toutes les informations (email, nom, photo, etc.).

```typescript
const user = await currentUser()
console.log(user.emailAddresses[0].emailAddress)
```

### Le cycle de vie d'une session

Comprendre comment Clerk gère les sessions est crucial :

**Création de session**
Quand l'utilisateur se connecte, Clerk crée une session avec une durée de vie (par défaut 7 jours). Cette session est matérialisée par le JWT stocké dans les cookies.

**Renouvellement automatique**
Si l'utilisateur est actif, Clerk renouvelle automatiquement le JWT avant son expiration. L'utilisateur reste connecté tant qu'il utilise l'application régulièrement.

**Expiration**
Si l'utilisateur n'utilise pas l'application pendant la durée configurée, la session expire. À la prochaine visite, il devra se reconnecter.

**Révocation**
Un utilisateur peut se déconnecter manuellement (via `<UserButton>`), ce qui supprime le JWT et termine la session immédiatement.

### La sécurité du modèle Clerk

Le modèle de sécurité de Clerk repose sur plusieurs principes :

**Séparation des responsabilités**
Clerk stocke et gère les mots de passe. Votre application ne voit jamais le mot de passe en clair, elle reçoit juste un token signé prouvant que l'utilisateur est authentifié.

**JWT signé**
Le token JWT est signé avec une clé secrète que seul Clerk connaît. Votre application vérifie la signature avec la clé publique. Impossible de forger un faux token.

**Cookies sécurisés**
Les cookies contenant le JWT sont configurés avec les flags de sécurité :
- `httpOnly` : JavaScript ne peut pas y accéder (protection XSS)
- `secure` : Envoyé uniquement en HTTPS
- `sameSite` : Protection contre les attaques CSRF

**Rotation des secrets**
Clerk fait tourner régulièrement ses clés de signature pour limiter l'impact d'une compromission éventuelle.

### L'intégration avec Next.js

Clerk s'intègre spécifiquement avec Next.js via plusieurs mécanismes :

**Le ClerkProvider**
Dans le layout racine, on wrappe l'application avec `<ClerkProvider>`. Ce composant initialise Clerk et rend les hooks disponibles dans toute l'arborescence.

```typescript
// app/layout.tsx
<ClerkProvider>
  {children}
</ClerkProvider>
```

**Le middleware**
Un fichier `middleware.ts` à la racine du projet configure quelles routes nécessitent une authentification.

```typescript
export default clerkMiddleware((auth, request) => {
  if (!isPublicRoute(request)) {
    auth().protect()
  }
})
```

Ce middleware s'exécute avant chaque requête. Si la route est protégée et l'utilisateur non authentifié, Clerk le redirige vers la page de connexion.

**Les routes catch-all**
Clerk utilise des routes spéciales pour ses pages :
- `/sign-in/[[...rest]]` : Toutes les étapes de connexion
- `/sign-up/[[...rest]]` : Toutes les étapes d'inscription

La syntaxe `[[...rest]]` capture tous les segments d'URL possibles, permettant à Clerk de gérer son propre routing interne.

### Ce que Clerk gère pour vous

En utilisant Clerk, vous n'avez plus à vous soucier de :

- Hachage et salage des mots de passe
- Gestion des tokens de session
- Emails de vérification
- Réinitialisation de mot de passe
- Authentification multi-facteur
- OAuth avec Google, GitHub, etc.
- Protection contre les attaques par force brute
- Conformité RGPD pour les données d'authentification
- Interface utilisateur responsive et accessible

Tout cela est géré par Clerk de manière professionnelle et constamment mise à jour.

---

Passez au Module 3 : [03-PRISMA-DATABASE.md](./03-PRISMA-DATABASE.md)


# Erreurs Actuelles à Corriger

Documentation des erreurs encore présentes au moment de la création de cette documentation.

---

## Erreur 1 : Import Copy manquant dans /dev

### Symptôme
```
ReferenceError: Copy is not defined
at DevPage (./app/dev/page.tsx:170:19)
```

### Localisation
Fichier : `app/dev/page.tsx`  
Ligne : 170, 222

### Cause
L'icône Copy a été supprimée des imports après création du composant CopyButton, mais il reste des références dans le code.

### Solution
Le composant CopyButton a déjà été créé et intégré. Le code restant avec `<Copy>` doit être nettoyé par le serveur au prochain hot reload.

**Status :** En cours de résolution automatique

---

## Erreur 2 : Import Code manquant dans /members

### Symptôme
```
ReferenceError: Code is not defined
at MembersPage (./app/members/page.tsx:45:17)
```

### Localisation
Fichier : `app/members/page.tsx`  
Ligne : 45

### Cause
Import de l'icône Code ajouté dans le code mais pas dans la ligne d'import en haut du fichier.

### Code problématique
```typescript
// Ligne 9 : import manque Code
import { Lock, Database, User, Mail, Calendar, Clock, Settings, AlertCircle, Code } from 'lucide-react'
//                                                                                    ^^^^ Ajouté

// Ligne 45 : utilisation
<Code className="h-4 w-4" />
```

### Solution appliquée
Import Code déjà ajouté dans le dernier edit. Devrait se résoudre au prochain hot reload.

**Status :** Résolu (en attente hot reload)

---

## Erreur 3 : Event handlers in Server Component

### Symptôme
```
Error: Event handlers cannot be passed to Client Component props.
<button onClick={function} className=...>
```

### Cause
Tentative de passer un onClick handler depuis un Server Component vers un élément dans le JSX.

### Localisation
Probablement dans le code de CopyButton avant sa conversion en Client Component.

### Solution appliquée
Création de `app/dev/CopyButton.tsx` comme Client Component séparé :

```typescript
'use client'

export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  
  const handleCopy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  
  return (
    <button onClick={handleCopy}>
      {copied ? <Check /> : <Copy />}
    </button>
  )
}
```

**Status :** Résolu

---

## Warning : Next.js outdated

### Symptôme
```
Next.js (14.1.0) is outdated (learn more)
```

### Impact
Aucun impact fonctionnel. Simple avertissement de version.

### Action recommandée
Mettre à jour vers la dernière version stable de Next.js 14 :

```bash
npm install next@latest react@latest react-dom@latest
```

**Note :** Ne pas passer à Next.js 15 sans vérifier la compatibilité Clerk.

**Status :** Warning (non bloquant)

---

## Warning : webpack cache

### Symptôme
```
[webpack.cache.PackFileCacheStrategy] Serializing big strings (100kiB) 
impacts deserialization performance
```

### Cause
Clerk génère de gros strings pour la configuration.

### Impact
Performance légèrement réduite en dev. Aucun impact en production.

### Solution
Ignorer en dev. En production, Next.js optimise automatiquement.

**Status :** Warning (non bloquant)

---

## Warning : punycode deprecated

### Symptôme
```
[DEP0040] DeprecationWarning: The `punycode` module is deprecated.
```

### Cause
Dépendance obsolète dans une librairie tierce (probablement Clerk ou Next.js).

### Impact
Aucun. Simple warning de deprecation.

### Solution
Attendre que les dépendances soient mises à jour.

**Status :** Warning (non bloquant)

---

## Actions à effectuer

### Immédiat

1. **Vérifier que Code est importé**
   ```bash
   # Vérifier le fichier
   grep "import.*Code.*from 'lucide-react'" app/members/page.tsx
   ```

2. **Rafraîchir le navigateur**
   - CTRL + SHIFT + R (hard refresh)
   - Vérifier que /members charge sans erreur
   - Vérifier que /dev charge sans erreur

### Court terme

1. **Tester le CRUD complet**
   - Aller sur /profile
   - Remplir tous les champs
   - Enregistrer
   - Vérifier mise à jour sur /members

2. **Tester Developer Dashboard**
   - Accéder à /dev
   - Vérifier affichage JSON Clerk
   - Vérifier affichage JSON Supabase
   - Tester boutons copier
   - Cliquer sur les liens externes

3. **Vérifier dans Supabase**
   - Ouvrir Supabase Dashboard
   - Aller dans Table Editor
   - Vérifier table users
   - Confirmer présence de tous les nouveaux champs

### Moyen terme

1. **Tests complets**
   - Créer un nouveau compte
   - Tester le flow complet
   - Modifier le profil
   - Se déconnecter
   - Se reconnecter

2. **Optimisations**
   - Mettre à jour Next.js
   - Ajouter loading states
   - Améliorer error messages
   - Ajouter toast notifications

---

## Prochaines étapes recommandées

### Fonctionnalités à ajouter

1. **Avatar upload**
   - Intégration Supabase Storage
   - Crop d'image
   - Preview

2. **Gestion de rôles**
   - Ajout enum Role
   - Middleware basé sur rôles
   - Pages admin

3. **Relations DB**
   - Model Post
   - Model Comment
   - Relations User -> Posts -> Comments

4. **Webhooks Clerk**
   - Endpoint /api/webhooks/clerk
   - Sync automatique lors de changements profil
   - Gestion événements user.deleted

5. **Tests**
   - Tests unitaires (Jest)
   - Tests E2E (Playwright)
   - Tests API (Supertest)

---

**Dernière vérification :** 24 octobre 2025  
**Prochaine action :** Tester l'application complète  
**Documentation :** Complète et à jour


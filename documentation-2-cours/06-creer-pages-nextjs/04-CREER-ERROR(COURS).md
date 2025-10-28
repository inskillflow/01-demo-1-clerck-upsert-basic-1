# Module 4 : Créer error.tsx

## Error basique avec reset

Le fichier error.tsx doit TOUJOURS être un Client Component.

### Structure minimale

```typescript
// app/dashboard/error.tsx
'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] px-4">
      <h2 className="text-2xl font-bold text-red-600 mb-4">
        Une erreur s'est produite
      </h2>
      <p className="text-gray-600 mb-6 text-center">
        {error.message}
      </p>
      <button
        onClick={reset}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Réessayer
      </button>
    </div>
  )
}
```

**La fonction reset() :**
Tente de re-rendre le segment qui a causé l'erreur. Utile pour les erreurs temporaires (réseau, timeout).

### Error professionnel avec détails

```typescript
// app/error.tsx
'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Logger l'erreur vers un service (Sentry, LogRocket, etc.)
    console.error('Error caught by boundary:', error)
  }, [error])
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="flex flex-col items-center text-center">
          {/* Icon */}
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          
          {/* Titre */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Oups ! Quelque chose s'est mal passé
          </h1>
          
          {/* Message d'erreur */}
          <p className="text-gray-600 mb-2">
            Une erreur inattendue s'est produite
          </p>
          
          {/* Détails pour le dev (uniquement en dev) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="w-full bg-red-50 border border-red-200 rounded-lg p-4 my-4">
              <p className="text-xs font-mono text-red-800 break-all">
                {error.message}
              </p>
              {error.digest && (
                <p className="text-xs text-red-600 mt-2">
                  Error ID: {error.digest}
                </p>
              )}
            </div>
          )}
          
          {/* Actions */}
          <div className="flex gap-4 mt-6 w-full">
            <Button
              onClick={reset}
              className="flex-1"
            >
              Réessayer
            </Button>
            
            <Button
              onClick={() => window.location.href = '/'}
              variant="outline"
              className="flex-1"
            >
              Retour à l'accueil
            </Button>
          </div>
          
          {/* Support link */}
          <p className="text-sm text-gray-500 mt-6">
            Si le problème persiste,{' '}
            <a href="/contact" className="text-blue-600 hover:underline">
              contactez le support
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
```

**Bonnes pratiques implémentées :**
- Logging de l'erreur (useEffect)
- UI professionnelle et rassurante
- Détails d'erreur uniquement en développement
- Bouton reset ET bouton retour accueil
- Lien vers le support
- Error digest pour tracking

### Error spécifique par section

Vous pouvez avoir différents error.tsx selon la section.

**Error pour authentification :**
```typescript
// app/(auth)/error.tsx
'use client'

export default function AuthError({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md">
        <h2 className="text-2xl font-bold text-red-600 mb-4">
          Erreur d'authentification
        </h2>
        <p className="text-gray-700 mb-6">
          {error.message || 'Une erreur est survenue lors de l\'authentification'}
        </p>
        <div className="flex gap-4">
          <button
            onClick={reset}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Réessayer
          </button>
          <a
            href="/signin"
            className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 text-center"
          >
            Nouvelle connexion
          </a>
        </div>
      </div>
    </div>
  )
}
```

Adapté au contexte d'authentification avec option de nouvelle connexion.

## Error avec catégories

Gérez différemment selon le type d'erreur.

```typescript
// app/error.tsx
'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Logger selon la sévérité
    if (error.message.includes('Database')) {
      console.error('DB Error:', error)
      // Alert l'équipe
    } else {
      console.error('General error:', error)
    }
  }, [error])
  
  // Déterminer le type d'erreur
  const isNetworkError = error.message.includes('fetch failed') || error.message.includes('Network')
  const isDatabaseError = error.message.includes('Prisma') || error.message.includes('Database')
  const isAuthError = error.message.includes('Unauthorized') || error.message.includes('Auth')
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          {isNetworkError && 'Erreur de connexion'}
          {isDatabaseError && 'Erreur de base de données'}
          {isAuthError && 'Erreur d\'authentification'}
          {!isNetworkError && !isDatabaseError && !isAuthError && 'Une erreur s\'est produite'}
        </h1>
        
        <p className="text-gray-600 mb-6">
          {isNetworkError && 'Impossible de se connecter au serveur. Vérifiez votre connexion Internet.'}
          {isDatabaseError && 'Nos serveurs rencontrent un problème temporaire. Veuillez réessayer dans quelques instants.'}
          {isAuthError && 'Votre session a expiré. Veuillez vous reconnecter.'}
          {!isNetworkError && !isDatabaseError && !isAuthError && error.message}
        </p>
        
        <div className="flex flex-col gap-3">
          {!isAuthError && (
            <button
              onClick={reset}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Réessayer
            </button>
          )}
          
          {isAuthError && (
            <a
              href="/signin"
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-center"
            >
              Se reconnecter
            </a>
          )}
          
          <a
            href="/"
            className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 text-center"
          >
            Retour à l'accueil
          </a>
        </div>
      </div>
    </div>
  )
}
```

Messages et actions adaptés selon le type d'erreur.

---

Passez au Module 5 : [05-FICHIERS-AVANCES(COURS).md](./05-FICHIERS-AVANCES(COURS).md)


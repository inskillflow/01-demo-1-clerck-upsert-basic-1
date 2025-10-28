# Module 3 : Créer loading.tsx

## Loading simple avec spinner

La forme la plus basique d'un loading.tsx est un spinner centré.

### Spinner simple

```typescript
// app/dashboard/loading.tsx
export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
    </div>
  )
}
```

Simple et efficace. S'affiche pendant que page.tsx charge ses données.

### Spinner avec message

```typescript
// app/users/loading.tsx
export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600" />
      <p className="text-gray-600 text-lg">Chargement des utilisateurs...</p>
    </div>
  )
}
```

Plus informatif pour l'utilisateur.

## Loading avec skeleton (recommandé)

Les skeletons donnent une meilleure perception de performance car ils montrent la structure de ce qui va apparaître.

### Skeleton pour liste d'utilisateurs

```typescript
// app/users/loading.tsx
export default function Loading() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header skeleton */}
      <div className="flex items-center justify-between mb-8">
        <div className="h-9 w-48 bg-gray-200 rounded animate-pulse" />
        <div className="h-10 w-40 bg-gray-200 rounded animate-pulse" />
      </div>
      
      {/* Grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6 space-y-4">
            {/* Avatar skeleton */}
            <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse mx-auto" />
            
            {/* Nom skeleton */}
            <div className="h-5 bg-gray-200 rounded animate-pulse w-3/4 mx-auto" />
            
            {/* Email skeleton */}
            <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
            
            {/* Role skeleton */}
            <div className="h-6 bg-gray-200 rounded-full animate-pulse w-20 mx-auto" />
          </div>
        ))}
      </div>
    </div>
  )
}
```

**Avantages du skeleton :**
- L'utilisateur voit immédiatement la structure
- Perception de performance améliorée
- Moins de "flash" quand le contenu apparaît
- Plus professionnel

### Skeleton pour tableau

```typescript
// app/admin/users/loading.tsx
export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-6" />
      
      {/* Table skeleton */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Header table */}
        <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
        </div>
        
        {/* Rows skeleton */}
        {[...Array(10)].map((_, i) => (
          <div key={i} className="border-b border-gray-200 px-6 py-4">
            <div className="grid grid-cols-4 gap-4">
              <div className="h-4 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
```

Reproduit exactement la structure du tableau final pour une transition fluide.

### Loading avec progress bar

Pour des opérations longues où vous pouvez estimer la progression.

```typescript
// app/import/loading.tsx
'use client'

import { useEffect, useState } from 'react'

export default function Loading() {
  const [progress, setProgress] = useState(0)
  
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev
        return prev + 10
      })
    }, 500)
    
    return () => clearInterval(interval)
  }, [])
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6">
      <div className="w-full max-w-md px-4">
        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <div>
              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                Chargement
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold inline-block text-blue-600">
                {progress}%
              </span>
            </div>
          </div>
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
            <div
              style={{ width: `${progress}%` }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600 transition-all duration-500"
            />
          </div>
        </div>
      </div>
      
      <p className="text-gray-600">Importation des données en cours...</p>
    </div>
  )
}
```

**Note :** loading.tsx peut être un Client Component si vous avez besoin de hooks pour des animations avancées.

---

Passez au Module 4 : [04-CREER-ERROR(COURS).md](./04-CREER-ERROR(COURS).md)


# Module 2 : Créer page.tsx

## Page simple : Server Component

La forme la plus simple d'une page est un Server Component qui affiche du contenu statique ou fait du fetch.

### Page d'accueil basique

```typescript
// app/page.tsx
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-4xl mx-auto text-center px-4">
        <h1 className="text-6xl font-bold text-slate-900 mb-6">
          Bienvenue sur Mon Application
        </h1>
        
        <p className="text-xl text-slate-600 mb-10">
          Une application moderne avec Next.js 14, Clerk, et Prisma
        </p>
        
        <div className="flex gap-4 justify-center">
          <Link href="/signup">
            <Button size="lg">Commencer gratuitement</Button>
          </Link>
          
          <Link href="/signin">
            <Button size="lg" variant="outline">Se connecter</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
```

Simple, propre, et fonctionnel. Aucun fetch, juste du JSX.

### Page avec fetch de données (Server Component)

```typescript
// app/users/page.tsx
import { prisma } from '@/lib/prisma'
import { UserCard } from './components/UserCard'

export const metadata = {
  title: 'Utilisateurs',
  description: 'Liste de tous les utilisateurs',
}

export default async function UsersPage() {
  // Fetch directement dans le composant
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    take: 20,
  })
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Utilisateurs ({users.length})
        </h1>
        <Link href="/users/new">
          <Button>Ajouter un utilisateur</Button>
        </Link>
      </div>
      
      {users.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Aucun utilisateur trouvé</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>
      )}
    </div>
  )
}
```

**Points clés :**
- Le composant est `async` pour le fetch
- Fetch Prisma directement dans le composant
- Metadata exporté pour le SEO
- Gestion du cas vide (aucun utilisateur)
- Grid responsive pour l'affichage

### Page avec authentification requise

```typescript
// app/dashboard/page.tsx
import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'

export default async function DashboardPage() {
  // Vérifier l'authentification
  const { userId } = auth()
  
  if (!userId) {
    redirect('/signin')
  }
  
  // Récupérer l'utilisateur complet
  const clerkUser = await currentUser()
  
  // Récupérer ses données DB
  const dbUser = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: {
      posts: {
        take: 5,
        orderBy: { createdAt: 'desc' }
      }
    }
  })
  
  if (!dbUser) {
    // User existe dans Clerk mais pas en DB (cas rare)
    redirect('/welcome')
  }
  
  return (
    <div className="space-y-8">
      {/* Section bienvenue */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Bienvenue, {clerkUser?.firstName || 'Utilisateur'} !
        </h1>
        <p className="text-gray-600 mt-2">
          Dernière connexion : {new Date().toLocaleDateString('fr-FR')}
        </p>
      </div>
      
      {/* Section statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-600">Posts</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {dbUser.posts.length}
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-600">Membre depuis</h3>
          <p className="text-lg font-semibold text-gray-900 mt-2">
            {new Date(dbUser.createdAt).toLocaleDateString('fr-FR')}
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-600">Rôle</h3>
          <p className="text-lg font-semibold text-gray-900 mt-2 capitalize">
            {dbUser.role}
          </p>
        </div>
      </div>
      
      {/* Section posts récents */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Posts Récents
        </h2>
        {dbUser.posts.length === 0 ? (
          <p className="text-gray-600">Aucun post encore</p>
        ) : (
          <div className="space-y-4">
            {dbUser.posts.map((post) => (
              <div key={post.id} className="border-b border-gray-200 pb-4 last:border-0">
                <h3 className="font-semibold text-gray-900">{post.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{post.excerpt}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
```

**Structure professionnelle :**
- Vérification auth en premier
- Fetch de données avec relations Prisma
- Sections organisées en cards
- Grid responsive
- Gestion des cas vides

## Page avec interactivité : Client Component

Quand vous avez besoin d'interactivité, créez un Client Component.

### Page avec formulaire

```typescript
// app/contact/page.tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      if (!response.ok) {
        throw new Error('Erreur lors de l\'envoi')
      }
      
      setSuccess(true)
      setFormData({ name: '', email: '', message: '' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }
  
  if (success) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <h2 className="text-2xl font-bold text-green-900 mb-2">
            Message envoyé !
          </h2>
          <p className="text-green-700">
            Nous vous répondrons dans les plus brefs délais.
          </p>
          <Button
            onClick={() => setSuccess(false)}
            variant="outline"
            className="mt-4"
          >
            Envoyer un autre message
          </Button>
        </div>
      </div>
    )
  }
  
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Contactez-nous</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
            {error}
          </div>
        )}
        
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Nom complet
          </label>
          <input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
            Message
          </label>
          <textarea
            id="message"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            required
            rows={6}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <Button
          type="submit"
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Envoi en cours...' : 'Envoyer le message'}
        </Button>
      </form>
    </div>
  )
}
```

**Gestion complète :**
- States pour les données du formulaire
- Loading state pendant l'envoi
- Success state après envoi réussi
- Error state avec message d'erreur
- Disabled du bouton pendant loading
- Reset du formulaire après succès

---

Passez au Module 3 : [03-CREER-LOADING(COURS).md](./03-CREER-LOADING(COURS).md)


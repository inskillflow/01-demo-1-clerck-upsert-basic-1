# Module 4 : Validation de Formulaires

## Validation côté client

Validez les données avant même de les envoyer au serveur pour une meilleure UX.

### Formulaire simple avec validation manuelle

```typescript
'use client'

import { useState } from 'react'
import { z } from 'zod'

const contactSchema = z.object({
  name: z.string().min(2, 'Minimum 2 caractères'),
  email: z.string().email('Email invalide'),
  message: z.string().min(10, 'Message trop court')
})

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    
    // Valider avec Zod
    const result = contactSchema.safeParse(formData)
    
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors
      const errorMap: Record<string, string> = {}
      
      Object.keys(fieldErrors).forEach(key => {
        errorMap[key] = fieldErrors[key]?.[0] || ''
      })
      
      setErrors(errorMap)
      return
    }
    
    // Données valides, envoyer au serveur
    await fetch('/api/contact', {
      method: 'POST',
      body: JSON.stringify(result.data)
    })
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-2 border rounded"
        />
        {errors.name && (
          <p className="text-red-600 text-sm mt-1">{errors.name}</p>
        )}
      </div>
      
      <button type="submit">Envoyer</button>
    </form>
  )
}
```

### Intégration avec React Hook Form

React Hook Form + Zod est la combinaison standard pour les formulaires complexes.

```bash
npm install react-hook-form @hookform/resolvers
```

```typescript
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const profileSchema = z.object({
  username: z.string().min(3).max(20),
  email: z.string().email(),
  bio: z.string().max(500).optional(),
  age: z.coerce.number().min(18).max(120)
})

type ProfileFormData = z.infer<typeof profileSchema>

export default function ProfileForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema)
  })
  
  const onSubmit = async (data: ProfileFormData) => {
    // data est déjà validé et typé
    await fetch('/api/profile', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <input
          {...register('username')}
          className="w-full px-4 py-2 border rounded"
        />
        {errors.username && (
          <p className="text-red-600 text-sm">{errors.username.message}</p>
        )}
      </div>
      
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Envoi...' : 'Enregistrer'}
      </button>
    </form>
  )
}
```

React Hook Form gère automatiquement le state, les erreurs, et la soumission.

---

Passez au Module 5 : [05-VALIDATION-API(COURS).md](./05-VALIDATION-API(COURS).md)


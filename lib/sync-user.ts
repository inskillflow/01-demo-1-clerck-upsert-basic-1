import 'server-only'
import { currentUser } from '@clerk/nextjs/server'
import { prisma } from './prisma'

/**
 * Synchronise l'utilisateur Clerk avec la base de données Prisma
 * Utilise upsert pour créer ou mettre à jour l'utilisateur
 */
export async function syncUser() {
  const clerkUser = await currentUser()

  if (!clerkUser) {
    return null
  }

  // Récupère le premier email (Clerk peut avoir plusieurs emails)
  const email = clerkUser.emailAddresses[0]?.emailAddress

  if (!email) {
    throw new Error('Utilisateur sans email')
  }

  // Génère un username à partir du username Clerk ou de l'email
  const username = clerkUser.username || email.split('@')[0]

  // Upsert : crée l'utilisateur s'il n'existe pas, sinon le met à jour
  const user = await prisma.user.upsert({
    where: {
      clerkId: clerkUser.id,
    },
    update: {
      email,
      username,
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
      imageUrl: clerkUser.imageUrl,
    },
    create: {
      clerkId: clerkUser.id,
      email,
      username,
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
      imageUrl: clerkUser.imageUrl,
    },
  })

  return user
}


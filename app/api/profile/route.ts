import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function PUT(request: Request) {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { 
      username, 
      bio, 
      company, 
      jobTitle, 
      location, 
      website,
      twitter,
      linkedin,
      github,
      emailNotifications,
      theme,
      language
    } = body

    // Validation
    if (!username || username.trim() === '') {
      return NextResponse.json(
        { error: 'Le username est requis' },
        { status: 400 }
      )
    }

    if (bio && bio.length > 500) {
      return NextResponse.json(
        { error: 'La bio ne peut pas dépasser 500 caractères' },
        { status: 400 }
      )
    }

    // Validation URL website
    if (website && website.trim() !== '') {
      try {
        new URL(website)
      } catch {
        return NextResponse.json(
          { error: 'URL du site web invalide' },
          { status: 400 }
        )
      }
    }

    // Mettre à jour l'utilisateur dans la base de données
    const updatedUser = await prisma.user.update({
      where: { clerkId: userId },
      data: {
        username: username.trim(),
        bio: bio?.trim() || null,
        company: company?.trim() || null,
        jobTitle: jobTitle?.trim() || null,
        location: location?.trim() || null,
        website: website?.trim() || null,
        twitter: twitter?.trim() || null,
        linkedin: linkedin?.trim() || null,
        github: github?.trim() || null,
        emailNotifications: emailNotifications ?? true,
        theme: theme || 'light',
        language: language || 'fr',
        updatedAt: new Date(),
      },
    })

    return NextResponse.json({
      success: true,
      user: updatedUser,
    })
  } catch (error: any) {
    console.error('Erreur mise à jour profil:', error)
    
    // Gérer l'erreur de contrainte unique
    if (error.code === 'P2002') {
      const field = error.meta?.target?.[0] || 'champ'
      return NextResponse.json(
        { error: `Ce ${field} est déjà utilisé` },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du profil' },
      { status: 500 }
    )
  }
}

import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { UserButton } from '@clerk/nextjs'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Lock, ArrowLeft } from 'lucide-react'
import ProfileForm from './ProfileForm'

export default async function ProfilePage() {
  const { userId } = auth()
  if (!userId) redirect('/sign-in')

  const clerkUser = await currentUser()
  const dbUser = await prisma.user.findUnique({
    where: { clerkId: userId }
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
            <Lock className="h-5 w-5 text-blue-600" />
            <span className="text-lg font-semibold">AuthSync</span>
          </Link>
          <UserButton afterSignOutUrl="/" />
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <Link href="/members">
            <Button variant="ghost" size="sm" className="gap-2 mb-4">
              <ArrowLeft className="h-4 w-4" />
              Retour au dashboard
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-slate-900">
            Paramètres du profil
          </h1>
          <p className="text-slate-600 mt-1">
            Gérez vos informations personnelles et professionnelles
          </p>
        </div>

        {/* Profile Form */}
        <ProfileForm 
          initialData={{
            username: dbUser?.username || '',
            email: clerkUser?.emailAddresses[0]?.emailAddress || '',
            firstName: clerkUser?.firstName || '',
            lastName: clerkUser?.lastName || '',
            bio: dbUser?.bio || '',
            company: dbUser?.company || '',
            jobTitle: dbUser?.jobTitle || '',
            location: dbUser?.location || '',
            website: dbUser?.website || '',
            twitter: dbUser?.twitter || '',
            linkedin: dbUser?.linkedin || '',
            github: dbUser?.github || '',
            emailNotifications: dbUser?.emailNotifications ?? true,
            theme: dbUser?.theme || 'light',
            language: dbUser?.language || 'fr',
          }}
          userId={userId}
        />
      </div>
    </div>
  )
}

import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { UserButton } from '@clerk/nextjs'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Lock, Database, User, Mail, Calendar, Clock, Settings, AlertCircle, Code } from 'lucide-react'

export default async function MembersPage() {
  const { userId } = auth()
  if (!userId) redirect('/sign-in')

  const clerkUser = await currentUser()
  
  // Essayer de récupérer l'utilisateur, gérer l'erreur si les colonnes n'existent pas
  let dbUser
  let needsMigration = false
  
  try {
    dbUser = await prisma.user.findUnique({
      where: { clerkId: userId }
    })
  } catch (error: any) {
    if (error.message?.includes('does not exist in the current database')) {
      needsMigration = true
    } else {
      throw error
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
            <Lock className="h-5 w-5 text-blue-600" />
            <span className="text-lg font-semibold">AuthSync</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/dev">
              <Button variant="outline" size="sm" className="gap-2">
                <Code className="h-4 w-4" />
                <span className="hidden sm:inline">Dev</span>
              </Button>
            </Link>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Migration Alert */}
        {needsMigration && (
          <div className="mb-6 bg-amber-50 border-2 border-amber-300 rounded-lg p-6">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="h-6 w-6 text-amber-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-amber-900 text-lg mb-2">
                  Migration de base de données requise
                </h3>
                <p className="text-sm text-amber-800 mb-4">
                  Les nouveaux champs professionnels doivent être ajoutés à votre base de données Supabase.
                </p>
                
                <div className="bg-white rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-slate-900 mb-2 text-sm">
                    Instructions :
                  </h4>
                  <ol className="text-sm text-slate-700 space-y-2 list-decimal list-inside">
                    <li>Ouvrez <a href="https://supabase.com/dashboard" target="_blank" className="text-blue-600 hover:underline">Supabase Dashboard</a></li>
                    <li>Allez dans <strong>SQL Editor</strong></li>
                    <li>Copiez le contenu du fichier <code className="bg-slate-100 px-2 py-0.5 rounded">migration-manual.sql</code></li>
                    <li>Cliquez sur <strong>Run</strong></li>
                    <li>Rafraîchissez cette page</li>
                  </ol>
                </div>

                <details className="bg-white rounded-lg p-4">
                  <summary className="font-semibold text-slate-900 cursor-pointer text-sm">
                    Voir le SQL à exécuter
                  </summary>
                  <pre className="mt-3 text-xs bg-slate-900 text-slate-100 p-4 rounded overflow-x-auto">
{`ALTER TABLE users 
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS company TEXT,
ADD COLUMN IF NOT EXISTS "jobTitle" TEXT,
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS website TEXT,
ADD COLUMN IF NOT EXISTS twitter TEXT,
ADD COLUMN IF NOT EXISTS linkedin TEXT,
ADD COLUMN IF NOT EXISTS github TEXT,
ADD COLUMN IF NOT EXISTS "emailNotifications" BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS theme TEXT DEFAULT 'light',
ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'fr';`}
                  </pre>
                </details>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Dashboard
              </h1>
              <p className="text-slate-600 mt-1">
                Bienvenue, {clerkUser?.firstName || 'Utilisateur'}
              </p>
            </div>
            <Badge variant="default">
              Compte actif
            </Badge>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="text-xs">Status</CardDescription>
              <CardTitle className="text-xl">Actif</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-slate-600">Session en cours</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="text-xs">Synchronisation</CardDescription>
              <CardTitle className="text-xl">À jour</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-slate-600">Données synchronisées</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="text-xs">Base de données</CardDescription>
              <CardTitle className="text-xl">
                {needsMigration ? "À migrer" : "OK"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-slate-600">
                {needsMigration ? "Migration requise" : "Schema à jour"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="text-xs">Membre depuis</CardDescription>
              <CardTitle className="text-xl">
                {dbUser ? new Date(dbUser.createdAt).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' }) : '-'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-slate-600">Date d'inscription</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Account Details */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Lock className="h-5 w-5 text-blue-600" />
                    <CardTitle>Détails du compte</CardTitle>
                  </div>
                  <Badge variant="outline">Clerk</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-sm text-slate-600 mb-1">
                      <Mail className="h-4 w-4" />
                      <span>Email</span>
                    </div>
                    <div className="font-medium text-slate-900">
                      {clerkUser?.emailAddresses[0]?.emailAddress}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-sm text-slate-600 mb-1">
                      <User className="h-4 w-4" />
                      <span>Nom complet</span>
                    </div>
                    <div className="font-medium text-slate-900">
                      {[clerkUser?.firstName, clerkUser?.lastName].filter(Boolean).join(' ') || 'Non renseigné'}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="text-sm text-slate-600 mb-2">Clerk ID</div>
                  <div className="font-mono text-xs bg-slate-100 p-3 rounded-md break-all text-slate-700">
                    {userId}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Database Info */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-green-600" />
                  <CardTitle className="text-lg">Synchronisation</CardTitle>
                </div>
              </CardHeader>
              {dbUser ? (
                <CardContent className="space-y-3">
                  <div>
                    <div className="text-xs text-slate-600 mb-1">Database ID</div>
                    <div className="font-mono text-xs bg-slate-100 p-2 rounded break-all text-slate-700">
                      {dbUser.id}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-slate-600 mb-1">Username</div>
                    <div className="font-medium text-sm text-slate-900">
                      {dbUser.username || 'Non défini'}
                    </div>
                  </div>

                  <div className="pt-3 border-t space-y-2">
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <Calendar className="h-3 w-3" />
                      <span>Créé le {new Date(dbUser.createdAt).toLocaleDateString('fr-FR')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <Clock className="h-3 w-3" />
                      <span>Mis à jour le {new Date(dbUser.updatedAt).toLocaleDateString('fr-FR')}</span>
                    </div>
                  </div>
                </CardContent>
              ) : (
                <CardContent>
                  <p className="text-sm text-amber-600">Données non synchronisées</p>
                </CardContent>
              )}
            </Card>

            {/* Quick Actions */}
            {!needsMigration && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Actions rapides</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link href="/profile" className="block">
                    <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                      <Settings className="h-4 w-4" />
                      Paramètres du profil
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

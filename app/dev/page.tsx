import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { UserButton } from '@clerk/nextjs'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Lock, Database, Code, ExternalLink, ArrowLeft } from 'lucide-react'
import CopyButton from './CopyButton'

export default async function DevPage() {
  const { userId } = auth()
  if (!userId) redirect('/sign-in')

  const clerkUser = await currentUser()
  const dbUser = await prisma.user.findUnique({
    where: { clerkId: userId }
  })

  // Récupérer TOUTES les données Clerk
  const clerkData = {
    id: clerkUser?.id,
    firstName: clerkUser?.firstName,
    lastName: clerkUser?.lastName,
    username: clerkUser?.username,
    emailAddresses: clerkUser?.emailAddresses,
    phoneNumbers: clerkUser?.phoneNumbers,
    imageUrl: clerkUser?.imageUrl,
    hasImage: clerkUser?.hasImage,
    primaryEmailAddressId: clerkUser?.primaryEmailAddressId,
    primaryPhoneNumberId: clerkUser?.primaryPhoneNumberId,
    createdAt: clerkUser?.createdAt,
    updatedAt: clerkUser?.updatedAt,
    lastSignInAt: clerkUser?.lastSignInAt,
    publicMetadata: clerkUser?.publicMetadata,
    privateMetadata: clerkUser?.privateMetadata,
    unsafeMetadata: clerkUser?.unsafeMetadata,
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Navigation */}
      <nav className="border-b border-slate-700 bg-slate-800/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition text-white">
              <Code className="h-5 w-5 text-emerald-400" />
              <span className="text-lg font-bold">Developer Dashboard</span>
            </Link>
            <Badge variant="outline" className="text-emerald-400 border-emerald-400">
              DEV MODE
            </Badge>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/members">
              <Button variant="outline" size="sm" className="gap-2 text-white border-slate-600 hover:bg-slate-700">
                <ArrowLeft className="h-4 w-4" />
                Retour
              </Button>
            </Link>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Technical Dashboard
          </h1>
          <p className="text-slate-400">
            Vue complète des données Clerk et Supabase pour le développement
          </p>
        </div>

        {/* Quick Links */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <a 
            href="https://dashboard.clerk.com" 
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <Card className="bg-slate-800 border-slate-700 hover:bg-slate-750 transition cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Lock className="h-8 w-8 text-blue-400" />
                    <div>
                      <div className="font-semibold text-white">Clerk Dashboard</div>
                      <div className="text-xs text-slate-400">Gérer l'authentification</div>
                    </div>
                  </div>
                  <ExternalLink className="h-4 w-4 text-slate-400" />
                </div>
              </CardContent>
            </Card>
          </a>

          <a 
            href="https://supabase.com/dashboard" 
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <Card className="bg-slate-800 border-slate-700 hover:bg-slate-750 transition cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Database className="h-8 w-8 text-emerald-400" />
                    <div>
                      <div className="font-semibold text-white">Supabase Dashboard</div>
                      <div className="text-xs text-slate-400">Gérer la base de données</div>
                    </div>
                  </div>
                  <ExternalLink className="h-4 w-4 text-slate-400" />
                </div>
              </CardContent>
            </Card>
          </a>

          <Link href="/profile">
            <Card className="bg-slate-800 border-slate-700 hover:bg-slate-750 transition cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Code className="h-8 w-8 text-purple-400" />
                    <div>
                      <div className="font-semibold text-white">Modifier le profil</div>
                      <div className="text-xs text-slate-400">CRUD complet</div>
                    </div>
                  </div>
                  <ExternalLink className="h-4 w-4 text-slate-400" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Clerk Data */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-blue-400" />
                  <CardTitle className="text-white">Clerk User Object</CardTitle>
                </div>
                <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                  Authentication
                </Badge>
              </div>
              <CardDescription className="text-slate-400">
                Toutes les données retournées par currentUser()
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <pre className="bg-slate-900 text-emerald-300 p-4 rounded-lg overflow-x-auto text-xs border border-slate-700 max-h-[600px] overflow-y-auto">
{JSON.stringify(clerkData, null, 2)}
                </pre>
                <div className="absolute top-2 right-2">
                  <CopyButton text={JSON.stringify(clerkData, null, 2)} />
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="text-xs text-slate-400">Propriétés clés :</div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-900 p-2 rounded border border-slate-700">
                    <div className="text-slate-500">ID</div>
                    <div className="text-white font-mono">{clerkUser?.id?.substring(0, 20)}...</div>
                  </div>
                  <div className="bg-slate-900 p-2 rounded border border-slate-700">
                    <div className="text-slate-500">Email</div>
                    <div className="text-white">{clerkUser?.emailAddresses[0]?.emailAddress}</div>
                  </div>
                  <div className="bg-slate-900 p-2 rounded border border-slate-700">
                    <div className="text-slate-500">Dernière connexion</div>
                    <div className="text-white">
                      {clerkUser?.lastSignInAt ? new Date(clerkUser.lastSignInAt).toLocaleString('fr-FR') : 'N/A'}
                    </div>
                  </div>
                  <div className="bg-slate-900 p-2 rounded border border-slate-700">
                    <div className="text-slate-500">Image</div>
                    <div className="text-white">{clerkUser?.hasImage ? 'Oui' : 'Non'}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Supabase Data */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-emerald-400" />
                  <CardTitle className="text-white">Supabase User Record</CardTitle>
                </div>
                <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                  Database
                </Badge>
              </div>
              <CardDescription className="text-slate-400">
                Données stockées dans PostgreSQL via Prisma
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <pre className="bg-slate-900 text-cyan-300 p-4 rounded-lg overflow-x-auto text-xs border border-slate-700 max-h-[600px] overflow-y-auto">
{JSON.stringify(dbUser, null, 2)}
                </pre>
                <div className="absolute top-2 right-2">
                  <CopyButton text={JSON.stringify(dbUser, null, 2)} />
                </div>
              </div>

              {dbUser && (
                <div className="mt-4 space-y-2">
                  <div className="text-xs text-slate-400">Champs métier :</div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-slate-900 p-2 rounded border border-slate-700">
                      <div className="text-slate-500">Username</div>
                      <div className="text-white">{dbUser.username || 'Non défini'}</div>
                    </div>
                    <div className="bg-slate-900 p-2 rounded border border-slate-700">
                      <div className="text-slate-500">Company</div>
                      <div className="text-white">{dbUser.company || 'Non défini'}</div>
                    </div>
                    <div className="bg-slate-900 p-2 rounded border border-slate-700">
                      <div className="text-slate-500">Job Title</div>
                      <div className="text-white">{dbUser.jobTitle || 'Non défini'}</div>
                    </div>
                    <div className="bg-slate-900 p-2 rounded border border-slate-700">
                      <div className="text-slate-500">Location</div>
                      <div className="text-white">{dbUser.location || 'Non défini'}</div>
                    </div>
                    <div className="bg-slate-900 p-2 rounded border border-slate-700">
                      <div className="text-slate-500">Theme</div>
                      <div className="text-white capitalize">{dbUser.theme}</div>
                    </div>
                    <div className="bg-slate-900 p-2 rounded border border-slate-700">
                      <div className="text-slate-500">Language</div>
                      <div className="text-white uppercase">{dbUser.language}</div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* API Endpoints */}
        <Card className="mt-6 bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Code className="h-5 w-5 text-purple-400" />
              API Endpoints disponibles
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-500/20 text-green-300">PUT</Badge>
                  <code className="text-sm text-white">/api/profile</code>
                </div>
              </div>
              <p className="text-xs text-slate-400 mb-2">Mettre à jour le profil utilisateur</p>
              <details className="text-xs">
                <summary className="text-slate-300 cursor-pointer hover:text-white">Voir exemple de body</summary>
                <pre className="mt-2 bg-slate-950 p-3 rounded text-emerald-300 overflow-x-auto">
{`{
  "username": "haythem",
  "bio": "Développeur Full Stack",
  "company": "Tech Corp",
  "jobTitle": "Senior Developer",
  "location": "Paris, France",
  "website": "https://example.com",
  "twitter": "@username",
  "linkedin": "username",
  "github": "username",
  "emailNotifications": true,
  "theme": "dark",
  "language": "fr"
}`}
                </pre>
              </details>
            </div>
          </CardContent>
        </Card>

        {/* Environment Info */}
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Variables d'environnement</CardTitle>
              <CardDescription className="text-slate-400">
                Configuration de l'application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-xs font-mono">
              <div className="flex justify-between bg-slate-900 p-3 rounded border border-slate-700">
                <span className="text-slate-400">NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</span>
                <span className="text-emerald-300">
                  {process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.substring(0, 20)}...
                </span>
              </div>
              <div className="flex justify-between bg-slate-900 p-3 rounded border border-slate-700">
                <span className="text-slate-400">DATABASE_URL</span>
                <span className="text-emerald-300">Configuré ✓</span>
              </div>
              <div className="flex justify-between bg-slate-900 p-3 rounded border border-slate-700">
                <span className="text-slate-400">NODE_ENV</span>
                <span className="text-emerald-300">{process.env.NODE_ENV}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Liens utiles</CardTitle>
              <CardDescription className="text-slate-400">
                Accès rapide aux dashboards
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <a 
                href="https://dashboard.clerk.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 bg-slate-900 hover:bg-slate-750 rounded border border-slate-700 transition group"
              >
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-blue-400" />
                  <span className="text-sm text-white">Clerk Dashboard</span>
                </div>
                <ExternalLink className="h-4 w-4 text-slate-400 group-hover:text-white" />
              </a>

              <a 
                href="https://supabase.com/dashboard" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 bg-slate-900 hover:bg-slate-750 rounded border border-slate-700 transition group"
              >
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-emerald-400" />
                  <span className="text-sm text-white">Supabase Dashboard</span>
                </div>
                <ExternalLink className="h-4 w-4 text-slate-400 group-hover:text-white" />
              </a>

              <Link 
                href="/api/profile"
                className="flex items-center justify-between p-3 bg-slate-900 hover:bg-slate-750 rounded border border-slate-700 transition group"
              >
                <div className="flex items-center gap-2">
                  <Code className="h-4 w-4 text-purple-400" />
                  <span className="text-sm text-white">API Documentation</span>
                </div>
                <ExternalLink className="h-4 w-4 text-slate-400 group-hover:text-white" />
              </Link>

              <a 
                href="https://clerk.com/docs" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 bg-slate-900 hover:bg-slate-750 rounded border border-slate-700 transition group"
              >
                <div className="flex items-center gap-2">
                  <Code className="h-4 w-4 text-slate-400" />
                  <span className="text-sm text-white">Clerk Docs</span>
                </div>
                <ExternalLink className="h-4 w-4 text-slate-400 group-hover:text-white" />
              </a>

              <a 
                href="https://www.prisma.io/docs" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 bg-slate-900 hover:bg-slate-750 rounded border border-slate-700 transition group"
              >
                <div className="flex items-center gap-2">
                  <Code className="h-4 w-4 text-slate-400" />
                  <span className="text-sm text-white">Prisma Docs</span>
                </div>
                <ExternalLink className="h-4 w-4 text-slate-400 group-hover:text-white" />
              </a>
            </CardContent>
          </Card>
        </div>

        {/* Sync Flow */}
        <Card className="mt-6 bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Flux de synchronisation</CardTitle>
            <CardDescription className="text-slate-400">
              Comment les données circulent dans l'application
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-500/20 text-blue-300 rounded-full flex items-center justify-center font-bold border border-blue-500/30">
                  1
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-white">Authentification Clerk</div>
                  <div className="text-sm text-slate-400">L'utilisateur se connecte via /sign-in ou /sign-up</div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-500/20 text-purple-300 rounded-full flex items-center justify-center font-bold border border-purple-500/30">
                  2
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-white">Redirection /welcome</div>
                  <div className="text-sm text-slate-400">afterSignInUrl="/welcome"</div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-emerald-500/20 text-emerald-300 rounded-full flex items-center justify-center font-bold border border-emerald-500/30">
                  3
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-white">Synchronisation Prisma</div>
                  <div className="text-sm text-slate-400">
                    <code className="bg-slate-900 px-2 py-0.5 rounded">await syncUser()</code> utilise 
                    <code className="bg-slate-900 px-2 py-0.5 rounded ml-1">upsert</code> sur clerkId
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-green-500/20 text-green-300 rounded-full flex items-center justify-center font-bold border border-green-500/30">
                  ✓
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-white">Redirection /members</div>
                  <div className="text-sm text-slate-400">L'utilisateur arrive sur son dashboard</div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-700">
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4">
                <p className="text-sm text-emerald-300">
                  <strong>Meilleure pratique :</strong> La synchronisation se fait UNE SEULE FOIS après le login, 
                  pas à chaque page visitée. Utilisation d'upsert pour éviter les doublons.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


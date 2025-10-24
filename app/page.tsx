import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Zap, Lock, Target, Database, Cloud, CheckCircle2, ArrowRight } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Lock className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold text-slate-900">AuthSync</span>
          </div>
          <div className="flex items-center gap-4">
            <SignedOut>
              <Link href="/sign-in">
                <Button variant="ghost" size="sm">Connexion</Button>
              </Link>
              <Link href="/sign-up">
                <Button size="sm">Créer un compte</Button>
              </Link>
            </SignedOut>
            <SignedIn>
              <Link href="/members">
                <Button variant="outline" size="sm">Dashboard</Button>
              </Link>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-28">
        <div className="mx-auto max-w-4xl text-center">
          <Badge className="mb-6 gap-2" variant="secondary">
            <CheckCircle2 className="h-3 w-3" />
            Production Ready
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 mb-6">
            Authentification moderne
            <span className="block text-blue-600 mt-2">avec Clerk & Prisma</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
            Architecture professionnelle Next.js 14 avec authentification Clerk, 
            ORM Prisma et base de données Supabase PostgreSQL.
          </p>

          <SignedOut>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/sign-up">
                <Button size="lg" className="w-full sm:w-auto gap-2">
                  Commencer gratuitement
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/sign-in">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Se connecter
                </Button>
              </Link>
            </div>
          </SignedOut>

          <SignedIn>
            <Link href="/members">
              <Button size="lg" className="gap-2">
                Accéder au dashboard
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </SignedIn>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 pb-20">
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Card className="border-slate-200">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle>Synchronisation intelligente</CardTitle>
              <CardDescription>
                Sync post-login uniquement via /welcome. 
                Performances optimales sans requêtes inutiles.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-slate-200">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center mb-4">
                <Lock className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle>Sécurité maximale</CardTitle>
              <CardDescription>
                Code serveur protégé avec server-only. 
                Middleware Clerk pour routes sécurisées.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-slate-200">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center mb-4">
                <Target className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle>Architecture propre</CardTitle>
              <CardDescription>
                Server Components, upsert idempotent, routes catch-all. 
                Code production-ready.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="border-t bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-center text-sm font-semibold text-slate-500 uppercase tracking-wider mb-10">
            Stack Technologique
          </h2>
          <div className="flex flex-wrap justify-center items-center gap-12 max-w-3xl mx-auto">
            <div className="flex flex-col items-center gap-3">
              <div className="h-12 w-12 rounded-lg bg-slate-100 flex items-center justify-center">
                <Zap className="h-6 w-6 text-slate-700" />
              </div>
              <div className="text-center">
                <div className="text-sm font-semibold text-slate-900">Next.js 14</div>
                <div className="text-xs text-slate-500">App Router</div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-3">
              <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <Lock className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-center">
                <div className="text-sm font-semibold text-slate-900">Clerk</div>
                <div className="text-xs text-slate-500">Authentication</div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-3">
              <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                <Database className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-center">
                <div className="text-sm font-semibold text-slate-900">Prisma</div>
                <div className="text-xs text-slate-500">ORM</div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-3">
              <div className="h-12 w-12 rounded-lg bg-emerald-100 flex items-center justify-center">
                <Cloud className="h-6 w-6 text-emerald-600" />
              </div>
              <div className="text-center">
                <div className="text-sm font-semibold text-slate-900">Supabase</div>
                <div className="text-xs text-slate-500">PostgreSQL</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

'use client'

import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Header() {
  const pathname = usePathname()
  
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo et Navigation */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold text-gray-900 hover:text-blue-600 transition">
              <span className="text-2xl">🔐</span>
              <span>AuthSync</span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-6">
              <Link 
                href="/" 
                className={`text-sm font-medium transition ${
                  pathname === '/' 
                    ? 'text-blue-600' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Accueil
              </Link>
              
              <SignedIn>
                <Link 
                  href="/members" 
                  className={`text-sm font-medium transition ${
                    pathname === '/members' 
                      ? 'text-blue-600' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Espace Membres
                </Link>
              </SignedIn>
            </nav>
          </div>

          {/* Actions utilisateur */}
          <div className="flex items-center gap-4">
            <SignedOut>
              <Link 
                href="/sign-in"
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition"
              >
                Se connecter
              </Link>
              <Link 
                href="/sign-up"
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition shadow-sm"
              >
                Créer un compte
              </Link>
            </SignedOut>

            <SignedIn>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600 hidden sm:block">
                  Connecté
                </span>
                <UserButton 
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "w-10 h-10 border-2 border-gray-200 hover:border-blue-500 transition"
                    }
                  }}
                />
              </div>
            </SignedIn>
          </div>
        </div>
      </div>
    </header>
  )
}


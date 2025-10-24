import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// Routes publiques : page d'accueil, auth, et welcome
const isPublicRoute = createRouteMatcher([
  '/',              // Page d'accueil
  '/welcome',       // DOIT être accessible (sync post-login)
  '/sign-in(.*)',   // Toutes les étapes de sign-in
  '/sign-up(.*)',   // Toutes les étapes de sign-up
])

// Note: /dev, /members, /profile sont protégés (nécessitent auth)

export default clerkMiddleware((auth, request) => {
  // Protéger toutes les routes sauf celles dans isPublicRoute
  if (!isPublicRoute(request)) {
    auth().protect()
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}


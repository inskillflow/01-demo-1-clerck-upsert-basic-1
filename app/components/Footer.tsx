export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* À propos */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">AuthSync</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Authentification moderne avec Clerk, synchronisation automatique avec Prisma et Supabase.
            </p>
          </div>

          {/* Technologies */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Technologies</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Next.js 14 (App Router)</li>
              <li>• Clerk Authentication</li>
              <li>• Prisma ORM</li>
              <li>• Supabase (PostgreSQL)</li>
            </ul>
          </div>

          {/* Ressources */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Ressources</h3>
            <ul className="space-y-2 text-sm">
              <a 
                href="https://clerk.com/docs" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block text-blue-600 hover:text-blue-700 transition"
              >
                Documentation Clerk
              </a>
              <a 
                href="https://www.prisma.io/docs" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block text-blue-600 hover:text-blue-700 transition"
              >
                Documentation Prisma
              </a>
              <a 
                href="https://supabase.com/docs" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block text-blue-600 hover:text-blue-700 transition"
              >
                Documentation Supabase
              </a>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-6 text-center text-sm text-gray-600">
          <p>© 2025 AuthSync - Projet d'apprentissage Next.js + Clerk + Prisma</p>
        </div>
      </div>
    </footer>
  )
}


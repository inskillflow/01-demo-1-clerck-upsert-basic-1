# Module 6 : Application Complète de A à Z

## Créer une application blog complète

Voyons comment créer une application blog professionnelle avec tous les fichiers Next.js.

### Structure complète

```
app/
├── layout.tsx                  → Layout racine
├── page.tsx                    → Accueil avec liste articles
├── globals.css                 → Styles
│
├── (marketing)/
│   ├── layout.tsx             → Header/Footer marketing
│   ├── about/page.tsx         → À propos
│   └── contact/page.tsx       → Contact
│
├── (auth)/
│   ├── layout.tsx             → Layout centré
│   ├── signin/page.tsx        → Connexion
│   └── signup/page.tsx        → Inscription
│
├── blog/
│   ├── layout.tsx             → Layout blog (sidebar)
│   ├── loading.tsx            → Skeleton articles
│   ├── error.tsx              → Gestion d'erreurs
│   ├── page.tsx               → Liste articles
│   └── [slug]/
│       ├── loading.tsx        → Skeleton article
│       ├── error.tsx          → Erreur article
│       └── page.tsx           → Article détail
│
├── dashboard/
│   ├── layout.tsx             → Dashboard layout
│   ├── loading.tsx            → Loading dashboard
│   ├── page.tsx               → Dashboard home
│   └── posts/
│       ├── page.tsx           → Mes posts
│       ├── new/page.tsx       → Créer post
│       └── [id]/
│           ├── edit/page.tsx  → Éditer post
│           └── page.tsx       → Voir post
│
└── api/
    ├── posts/
    │   ├── route.ts           → CRUD posts
    │   └── [id]/route.ts      → CRUD post spécifique
    └── upload/route.ts        → Upload d'images
```

## Exemple 1 : Page d'accueil blog

```typescript
// app/page.tsx
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export const metadata = {
  title: 'Blog - Articles et Tutoriels',
  description: 'Découvrez nos derniers articles sur Next.js, React, et le développement web',
}

export default async function HomePage() {
  const [featuredPosts, recentPosts] = await Promise.all([
    prisma.post.findMany({
      where: { featured: true, published: true },
      take: 3,
      include: { author: { select: { name: true, image: true } } },
      orderBy: { publishedAt: 'desc' }
    }),
    prisma.post.findMany({
      where: { published: true },
      take: 6,
      include: { author: { select: { name: true } } },
      orderBy: { publishedAt: 'desc' }
    })
  ])
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Apprenez le développement web moderne
          </h1>
          <p className="text-xl mb-8 text-blue-100">
            Tutoriels, guides, et articles sur Next.js, React, TypeScript et plus
          </p>
          <Link href="/blog">
            <Button size="lg" variant="secondary" className="gap-2">
              Explorer les articles
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
      
      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Articles en vedette
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredPosts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group"
              >
                <article className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
                  {post.coverImage && (
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center text-sm text-gray-500">
                      <span>{post.author.name}</span>
                      <span className="mx-2">•</span>
                      <time>
                        {new Date(post.publishedAt).toLocaleDateString('fr-FR')}
                      </time>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </section>
      )}
      
      {/* Recent Posts */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Articles récents
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentPosts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="bg-white rounded-lg shadow p-6 hover:shadow-md transition"
              >
                <h3 className="font-bold text-gray-900 mb-2">
                  {post.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {post.excerpt}
                </p>
                <div className="text-sm text-gray-500">
                  Par {post.author.name}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
```

**Structure professionnelle :**
- Fetch parallèle avec Promise.all
- Hero section avec CTA
- Articles en vedette
- Articles récents
- Grid responsive
- Hover effects

## Exemple 2 : Page article détaillée

```typescript
// app/blog/[slug]/page.tsx
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { MarkdownRenderer } from '@/components/MarkdownRenderer'
import { ShareButtons } from '@/components/ShareButtons'

// Générer metadata dynamique
export async function generateMetadata({
  params
}: {
  params: { slug: string }
}) {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug }
  })
  
  if (!post) {
    return {
      title: 'Article non trouvé'
    }
  }
  
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage],
    },
  }
}

export default async function BlogPostPage({
  params
}: {
  params: { slug: string }
}) {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
    include: {
      author: {
        select: {
          name: true,
          image: true,
          bio: true
        }
      },
      comments: {
        where: { approved: true },
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: {
          author: {
            select: { name: true, image: true }
          }
        }
      }
    }
  })
  
  if (!post || !post.published) {
    notFound()
  }
  
  // Incrémenter les vues
  await prisma.post.update({
    where: { id: post.id },
    data: { views: { increment: 1 } }
  })
  
  return (
    <article className="max-w-4xl mx-auto px-4 py-12">
      {/* Header */}
      <header className="mb-12">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          {post.title}
        </h1>
        
        <div className="flex items-center gap-4 text-gray-600 mb-6">
          <img
            src={post.author.image || '/default-avatar.png'}
            alt={post.author.name}
            className="w-12 h-12 rounded-full"
          />
          <div>
            <p className="font-semibold text-gray-900">{post.author.name}</p>
            <p className="text-sm">
              {new Date(post.publishedAt).toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
              {' • '}
              {post.views} vues
            </p>
          </div>
        </div>
        
        {post.coverImage && (
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-96 object-cover rounded-lg"
          />
        )}
      </header>
      
      {/* Contenu */}
      <div className="prose prose-lg max-w-none mb-12">
        <MarkdownRenderer content={post.content} />
      </div>
      
      {/* Share buttons */}
      <div className="border-t border-gray-200 pt-8 mb-12">
        <h3 className="text-lg font-semibold mb-4">Partager cet article</h3>
        <ShareButtons url={`/blog/${post.slug}`} title={post.title} />
      </div>
      
      {/* Comments */}
      <div className="border-t border-gray-200 pt-8">
        <h3 className="text-2xl font-bold mb-6">
          Commentaires ({post.comments.length})
        </h3>
        {post.comments.length === 0 ? (
          <p className="text-gray-600">Aucun commentaire encore</p>
        ) : (
          <div className="space-y-6">
            {post.comments.map((comment) => (
              <div key={comment.id} className="flex gap-4">
                <img
                  src={comment.author.image || '/default-avatar.png'}
                  alt={comment.author.name}
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">
                    {comment.author.name}
                  </p>
                  <p className="text-sm text-gray-500 mb-2">
                    {new Date(comment.createdAt).toLocaleDateString('fr-FR')}
                  </p>
                  <p className="text-gray-700">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </article>
  )
}
```

**Fonctionnalités complètes :**
- Metadata dynamique avec OpenGraph
- Fetch de l'article avec auteur et commentaires
- Incrémentation des vues
- Affichage professionnel avec image de couverture
- Rendu Markdown du contenu
- Boutons de partage
- Section commentaires
- Gestion du cas "article non trouvé"

---

Passez aux quiz : [07-QUIZ-QUESTIONS(OBLIGATOIRE).md](./07-QUIZ-QUESTIONS(OBLIGATOIRE).md)


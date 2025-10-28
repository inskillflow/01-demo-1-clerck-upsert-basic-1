# Exercices Pratiques : Architecture Next.js

## Instructions

- 5 exercices à réaliser
- Durée estimée : 4-5 heures
- Rédigez vos réponses dans un document séparé
- Consultez 10-EXERCICES-SOLUTIONS(OPTIONNEL).md après avoir terminé

---

## Exercice 1 : Architecture complète avec route groups (90 minutes)

Concevez l'architecture complète d'une application SaaS avec Next.js App Router.

**Spécifications de l'application :**
- Pages marketing : accueil, pricing, about, blog
- Authentification : signin, signup, forgot-password
- Application : dashboard, profile, settings, analytics
- Admin : users management, billing, logs
- API : CRUD users, posts, webhooks

**Fournissez :**

1. **Structure complète** de l'arborescence app/
   - Route groups appropriés
   - Layouts pour chaque section
   - Pages pour toutes les routes
   - API routes organisées

2. **Layouts** :
   - Layout marketing (header/footer)
   - Layout auth (centré, minimal)
   - Layout app (sidebar, header utilisateur)
   - Layout admin (sidebar admin, permissions)

3. **Fichiers spéciaux** :
   - loading.tsx pour les sections avec fetch lent
   - error.tsx pour la gestion d'erreurs
   - not-found.tsx personnalisé

4. **Documentation** :
   - Tableau des URLs finales
   - Explication de chaque route group
   - Justification des choix architecturaux

**Critères d'évaluation :**
- Architecture claire et scalable (10 points)
- Utilisation appropriée des route groups (5 points)
- Layouts bien conçus (5 points)
- Documentation complète (5 points)

---

## Exercice 2 : Routes dynamiques et CMS (60 minutes)

Implémentez un système de documentation/CMS avec routes dynamiques avancées.

**Spécifications :**

Structure URL souhaitée :
- /docs → Liste de toute la documentation
- /docs/getting-started → Article simple
- /docs/guides/authentication → Article dans une catégorie
- /docs/api/reference/users/create → Article profond (4 niveaux)

**Implémentez :**

1. **Structure de routes** avec catch-all approprié
2. **Schéma Prisma** pour stocker les articles (path, title, content, category)
3. **Page** qui fetch l'article selon le path
4. **Breadcrumb** généré automatiquement depuis les segments
5. **Navigation** latérale avec arborescence
6. **Metadata dynamiques** (title, description)
7. **not-found** personnalisé pour articles inexistants

**Fournissez :**
- Structure app/docs/
- Schéma Prisma
- Code du composant page.tsx
- Composant Breadcrumb
- Composant Sidebar avec arborescence
- generateMetadata()

**Critères d'évaluation :**
- Routes dynamiques correctes (6 points)
- Schéma Prisma approprié (4 points)
- Navigation et breadcrumb fonctionnels (6 points)
- Code propre et typé (4 points)

---

## Exercice 3 : Migrations Prisma - Scénarios réels (90 minutes)

Gérez plusieurs scénarios de migrations complexes.

**Scénario 1 : Renommer un champ sans perte de données**
```prisma
// AVANT
model User {
  name String
}

// APRÈS
model User {
  fullName String  // Renommé depuis "name"
}
```

**Tâche :** Créez la migration qui renomme sans perdre les données.

---

**Scénario 2 : Ajouter un champ obligatoire avec données existantes**
```prisma
model User {
  id    String @id
  email String
  role  String  // ← Nouveau champ obligatoire
}
```

Table users a déjà 1000 utilisateurs.

**Tâche :** Stratégie complète pour ajouter ce champ.

---

**Scénario 3 : Migration de production avec zero-downtime**
Vous devez ajouter un index sur une table de 10 millions de lignes en production.

**Tâche :** Décrivez la stratégie pour ne pas bloquer l'application.

---

**Scénario 4 : Rollback d'une migration**
Une migration a été appliquée en production mais cause des problèmes.

**Tâche :** Procédure complète de rollback sécurisé.

---

**Pour chaque scénario, fournissez :**
- Analyse du problème
- Commandes Prisma à exécuter
- SQL personnalisé si nécessaire
- Scripts de migration de données
- Tests de vérification
- Plan de rollback

**Critères d'évaluation :**
- Solutions techniques correctes (12 points)
- Gestion de la sécurité des données (8 points)
- Procédures de test (5 points)
- Documentation claire (5 points)

---

## Exercice 4 : Migration Pages Router → App Router (120 minutes)

Vous avez une application existante en Pages Router. Planifiez et exécutez la migration vers App Router.

**Application existante (Pages Router) :**
```
pages/
├── _app.js              → Layout global
├── _document.js         → Document custom
├── index.js             → Home
├── about.js             → About
├── blog/
│   ├── index.js        → Blog liste
│   └── [slug].js       → Blog article
├── dashboard/
│   ├── index.js        → Dashboard
│   └── settings.js     → Settings
└── api/
    └── users.js         → API users
```

**Tâches :**

1. **Analyse** : Listez toutes les différences et adaptations nécessaires

2. **Nouvelle structure** : Proposez l'architecture App Router complète avec route groups

3. **Migration page par page** :
   - Convertir _app.js en layout.tsx
   - Convertir les pages statiques
   - Convertir les pages avec getServerSideProps
   - Convertir les pages avec getStaticProps
   - Convertir les API routes

4. **Code avant/après** :
   - Montrez le code Pages Router original
   - Montrez le code App Router équivalent
   - Expliquez les changements

5. **Plan de migration progressive** :
   - Quelle route migrer en premier
   - Comment tester sans affecter la prod
   - Stratégie de rollback

**Critères d'évaluation :**
- Analyse complète (8 points)
- Architecture App Router appropriée (8 points)
- Conversion du code correcte (10 points)
- Plan de migration réaliste (6 points)
- Documentation (3 points)

---

## Exercice 5 : Patterns avancés (75 minutes)

Implémentez des patterns Next.js avancés.

**Pattern 1 : Parallel Routes**
Créez un dashboard avec 3 sections qui chargent en parallèle :
- Analytics (lent : 2s)
- Notifications (rapide : 0.5s)
- Recent Activity (moyen : 1s)

Utilisez les parallel routes (@analytics, @notifications, @activity) avec des loading.tsx individuels.

**Pattern 2 : Intercepting Routes**
Créez une galerie de photos où :
- Cliquer sur une photo ouvre un modal (URL change : /photos/123)
- Refresh sur /photos/123 affiche la page photo complète
- Fermer le modal revient à la galerie

**Pattern 3 : Middleware avec route matching**
Créez un middleware qui :
- Protège toutes les routes /dashboard/*
- Vérifie le rôle admin pour /admin/*
- Logue toutes les visites de page
- Rate limite les API routes

**Fournissez pour chaque pattern :**
- Structure de dossiers complète
- Code des layouts et pages
- Explication du fonctionnement
- Cas d'usage réels

**Critères d'évaluation :**
- Implémentation correcte des patterns (12 points)
- Code fonctionnel (8 points)
- Compréhension des cas d'usage (5 points)

---

## Questions Ouvertes

### Question 1 : Choix architectural (30 minutes)

Pour ces trois types d'applications, justifiez le choix App Router vs Pages Router et l'architecture recommandée :

**Application 1 : Blog personnel simple**
- 10-20 articles
- Pas d'authentification
- Mise à jour hebdomadaire
- Hébergement statique

**Application 2 : SaaS complexe**
- Authentification multi-rôles
- Dashboard temps réel
- 10+ sections différentes
- API REST complète
- 100k+ utilisateurs

**Application 3 : Site e-commerce**
- Catalogue produits
- Panier d'achat
- Checkout multi-étapes
- Espace client
- Admin pour vendeurs

**Pour chacune, détaillez :**
- App ou Pages Router ? Pourquoi ?
- Structure de dossiers proposée
- Route groups utilisés
- Stratégies de fetch de données
- Justification complète

**Critères d'évaluation :**
- Analyse contextuelle (5 points)
- Choix architecturaux justifiés (5 points)
- Structure proposée cohérente (5 points)

---

### Question 2 : Migrations en production (25 minutes)

Vous gérez une application en production avec 1 million d'utilisateurs. Décrivez votre processus complet pour ces migrations critiques :

**Migration 1 : Ajouter un index sur une colonne**
Impact : Améliore les performances mais bloque la table pendant la création.

**Migration 2 : Ajouter une colonne obligatoire**
Impact : Doit remplir les données existantes.

**Migration 3 : Renommer une table**
Impact : Tout le code qui référence cette table doit être mis à jour.

**Pour chaque migration, détaillez :**
- Préparation (backup, tests)
- Stratégie de déploiement (maintenance window vs zero-downtime)
- Commandes exactes
- Vérifications post-migration
- Plan de rollback
- Communication aux utilisateurs

**Critères d'évaluation :**
- Procédures complètes (6 points)
- Gestion des risques (4 points)
- Stratégies zero-downtime (3 points)

---

## Soumission

Rédigez vos réponses dans un document structuré et consultez 10-EXERCICES-SOLUTIONS(OPTIONNEL).md pour comparer avec les solutions proposées.


# Module 4 : Scénarios Réels et Cas d'Usage

## Scénario 1 : Email de bienvenue automatique

Un des cas d'usage les plus courants des webhooks est l'envoi d'emails automatiques.

### Le besoin

Quand un utilisateur s'inscrit, vous voulez lui envoyer immédiatement un email de bienvenue personnalisé avec :
- Des instructions pour commencer
- Des liens vers la documentation
- Une offre promotionnelle pour les nouveaux utilisateurs

Avec l'approche upsert post-login, cet email serait envoyé uniquement quand l'utilisateur visite votre application pour la première fois. Avec les webhooks, il est envoyé dès que l'inscription est complète dans Clerk.

### L'implémentation

```typescript
import { sendEmail } from '@/lib/email'

async function handleUserCreated(data: any) {
  const email = data.email_addresses[0]?.email_address
  const firstName = data.first_name
  
  // Créer l'utilisateur dans la DB
  await prisma.user.upsert({
    where: { clerkId: data.id },
    update: { email, firstName },
    create: { clerkId: data.id, email, firstName }
  })

  // Envoyer l'email de bienvenue
  await sendEmail({
    to: email,
    subject: 'Bienvenue !',
    template: 'welcome',
    data: {
      firstName: firstName || 'nouvel utilisateur',
      loginUrl: 'https://your-app.com/sign-in'
    }
  })

  // Créer des données par défaut
  await prisma.userPreferences.create({
    data: {
      userId: data.id,
      theme: 'light',
      language: 'fr',
      emailNotifications: true
    }
  })

  console.log(`Welcome email sent to ${email}`)
}
```

### Les défis et solutions

**Défi 1 : L'idempotence avec side effects**
Si le webhook est rejoué, on ne veut pas envoyer l'email plusieurs fois.

**Solution :** Logger les webhooks traités
```typescript
// Vérifier d'abord si déjà traité
const processed = await prisma.webhookLog.findUnique({
  where: { svixId }
})

if (processed) {
  return // Déjà traité, ne rien faire
}

// Traiter le webhook ET logger
await Promise.all([
  handleUserCreated(data),
  prisma.webhookLog.create({
    data: { svixId, type: 'user.created', processedAt: new Date() }
  })
])
```

**Défi 2 : L'email échoue mais la création DB réussit**
Si l'envoi d'email échoue, faut-il retourner une erreur pour que Svix réessaie ?

**Solution :** Séparer les opérations critiques des non-critiques
```typescript
try {
  // Opération critique : créer l'utilisateur
  await prisma.user.upsert(...)
  
  // Opération non-critique : envoyer l'email
  try {
    await sendEmail(...)
  } catch (emailError) {
    // Logger mais ne pas faire échouer le webhook
    console.error('Email failed but user created:', emailError)
    await prisma.emailQueue.create({
      data: { userId, type: 'welcome', status: 'pending' }
    })
  }
  
  return NextResponse.json({ success: true })
} catch (dbError) {
  // Erreur critique : faire échouer pour retry
  throw dbError
}
```

## Scénario 2 : Synchronisation multi-applications

Vous avez plusieurs applications qui doivent toutes être synchronisées avec Clerk.

### Le besoin

Votre entreprise a :
- Une application web principale (Next.js)
- Une application mobile (React Native)
- Un panneau d'administration (separé)
- Un service de facturation

Toutes ces applications ont besoin d'avoir les données utilisateur à jour.

### L'architecture

Plutôt que chaque application appelle Clerk pour récupérer les données, configurez un webhook qui synchronise tout automatiquement.

**Option 1 : Plusieurs endpoints**
Configurez un endpoint webhook différent pour chaque application dans Clerk Dashboard.

**Option 2 : Endpoint centralisé (recommandé)**
Créez un service central qui reçoit les webhooks et notifie toutes les applications.

```typescript
// Service central de webhooks
async function handleUserCreated(data: any) {
  // Synchroniser la DB principale
  await mainDb.user.upsert(...)
  
  // Notifier les autres services
  await Promise.allSettled([
    notifyMobileBackend(data),
    notifyAdminPanel(data),
    notifyBillingService(data)
  ])
}

async function notifyMobileBackend(userData: any) {
  await fetch('https://mobile-api.your-domain.com/webhooks/user-sync', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${INTERNAL_API_KEY}`
    },
    body: JSON.stringify(userData)
  })
}
```

### Les avantages

Chaque service reçoit les mises à jour instantanément sans avoir à interroger Clerk. Les données sont cohérentes partout en quelques millisecondes.

## Scénario 3 : Gestion des suppressions RGPD

Le RGPD impose de supprimer toutes les données d'un utilisateur quand il le demande.

### Le défi

Quand un utilisateur supprime son compte Clerk, vous devez :
- Supprimer ou anonymiser ses données dans votre DB
- Supprimer ses fichiers uploadés
- Annuler ses abonnements Stripe
- Le retirer de votre liste email (Mailchimp, SendGrid)
- Notifier les autres utilisateurs si pertinent
- Logger la suppression pour l'audit

Tout cela doit se faire automatiquement et de manière fiable.

### L'implémentation

```typescript
async function handleUserDeleted(data: any) {
  const clerkId = data.id
  
  // 1. Récupérer l'utilisateur avant suppression
  const user = await prisma.user.findUnique({
    where: { clerkId },
    include: {
      posts: true,
      comments: true,
      subscriptions: true
    }
  })
  
  if (!user) {
    console.log('User already deleted')
    return
  }

  // 2. Annuler les abonnements Stripe
  if (user.stripeCustomerId) {
    await stripe.customers.del(user.stripeCustomerId)
  }

  // 3. Supprimer les fichiers
  await deleteUserFiles(user.id)

  // 4. Anonymiser les posts plutôt que les supprimer
  await prisma.post.updateMany({
    where: { authorId: user.id },
    data: {
      authorName: '[Utilisateur supprimé]',
      authorEmail: null
    }
  })

  // 5. Supprimer l'utilisateur
  await prisma.user.delete({
    where: { clerkId }
  })

  // 6. Logger pour l'audit
  await prisma.deletionLog.create({
    data: {
      clerkId,
      email: user.email,
      deletedAt: new Date(),
      reason: 'user_initiated'
    }
  })

  // 7. Retirer de la liste email
  await mailchimp.lists.removeListMember(
    LIST_ID,
    user.email
  )

  console.log(`User deleted and data cleaned: ${clerkId}`)
}
```

### L'importance de l'audit

Gardez un log des suppressions pour prouver la conformité RGPD. Ce log ne contient que l'ID et la date, pas de données personnelles.

## Scénario 4 : Détection d'activité suspecte

Utilisez les webhooks de session pour détecter les comportements anormaux.

### Le cas d'usage

Vous voulez alerter les utilisateurs (ou votre équipe de sécurité) si :
- Un utilisateur se connecte depuis un nouveau pays
- Plusieurs connexions simultanées depuis des IPs très différentes
- Un utilisateur se connecte après une longue période d'inactivité

### L'implémentation

```typescript
async function handleSessionCreated(data: any) {
  const userId = data.user_id
  const ipAddress = data.client_ip
  const userAgent = data.user_agent
  const country = data.country

  // Logger la session
  await prisma.sessionLog.create({
    data: {
      userId,
      ipAddress,
      userAgent,
      country,
      timestamp: new Date()
    }
  })

  // Récupérer les sessions récentes
  const recentSessions = await prisma.sessionLog.findMany({
    where: {
      userId,
      timestamp: {
        gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // 24h
      }
    }
  })

  // Détecter les anomalies
  const countries = new Set(recentSessions.map(s => s.country))
  
  if (countries.size > 2) {
    // Connexions depuis plus de 2 pays en 24h
    await sendSecurityAlert({
      userId,
      type: 'multiple_countries',
      countries: Array.from(countries)
    })
  }

  // Vérifier les connexions simultanées
  const activeSessions = recentSessions.filter(s => 
    Date.now() - s.timestamp.getTime() < 5 * 60 * 1000 // 5 min
  )

  if (activeSessions.length > 2) {
    await sendSecurityAlert({
      userId,
      type: 'multiple_simultaneous_sessions',
      count: activeSessions.length
    })
  }
}
```

### Les alertes

Vous pouvez envoyer :
- Un email à l'utilisateur : "Nous avons détecté une connexion inhabituelle..."
- Une notification push sur son téléphone
- Un message dans un canal Slack pour votre équipe de sécurité

## Scénario 5 : Onboarding progressif

Guidez l'utilisateur à travers un processus d'onboarding multi-étapes.

### Le flux

1. Utilisateur s'inscrit (user.created webhook)
2. Créer un profil onboarding incomplet
3. Suivre la progression via des flags
4. Envoyer des rappels si l'onboarding n'est pas complété

### L'implémentation

```typescript
async function handleUserCreated(data: any) {
  const clerkId = data.id
  
  // Créer le profil avec onboarding tracking
  await prisma.user.create({
    data: {
      clerkId,
      email: data.email_addresses[0]?.email_address,
      onboardingStatus: 'started',
      onboardingSteps: {
        create: {
          emailVerified: true, // Déjà fait via Clerk
          profileCompleted: false,
          preferencesSet: false,
          firstActionDone: false
        }
      }
    }
  })

  // Programmer un rappel pour dans 24h
  await prisma.scheduledTask.create({
    data: {
      userId: clerkId,
      type: 'onboarding_reminder',
      scheduledFor: new Date(Date.now() + 24 * 60 * 60 * 1000)
    }
  })
}

async function handleUserUpdated(data: any) {
  // Si l'utilisateur a complété son profil
  if (data.first_name && data.last_name) {
    await prisma.user.update({
      where: { clerkId: data.id },
      data: {
        onboardingSteps: {
          update: {
            profileCompleted: true
          }
        }
      }
    })

    // Vérifier si tout l'onboarding est complété
    const user = await prisma.user.findUnique({
      where: { clerkId: data.id },
      include: { onboardingSteps: true }
    })

    if (isOnboardingComplete(user.onboardingSteps)) {
      await prisma.user.update({
        where: { clerkId: data.id },
        data: { onboardingStatus: 'completed' }
      })

      // Débloquer les fonctionnalités premium
      await grantPremiumTrial(data.id)
    }
  }
}
```

## Scénario 6 : Analytics et métriques

Utilisez les webhooks pour alimenter un système d'analytics en temps réel.

### Les métriques à tracker

- Nombre d'inscriptions par jour/heure
- Taux d'activation (inscription → première action)
- Sources d'inscription (si Clerk envoie ces données)
- Durée entre inscription et première connexion

### L'implémentation

```typescript
async function handleUserCreated(data: any) {
  // Enregistrer dans la DB principale
  await prisma.user.create(...)

  // Enregistrer dans le système d'analytics
  await analytics.track({
    event: 'user_signed_up',
    userId: data.id,
    properties: {
      email: data.email_addresses[0]?.email_address,
      signupMethod: data.external_accounts[0]?.provider || 'email',
      timestamp: new Date(data.created_at),
      metadata: data.public_metadata
    }
  })

  // Incrémenter un compteur Redis pour les stats temps réel
  await redis.incr('signups:today')
  await redis.expire('signups:today', 24 * 60 * 60)
}

async function handleSessionCreated(data: any) {
  await analytics.track({
    event: 'user_logged_in',
    userId: data.user_id,
    properties: {
      sessionId: data.id,
      device: data.user_agent,
      location: data.country
    }
  })
}
```

### Dashboard temps réel

Ces événements peuvent alimenter un dashboard qui montre en temps réel :
- Inscriptions des dernières 24 heures
- Utilisateurs actuellement connectés
- Géolocalisation des connexions
- Taux de conversion signup → login

## Scénario 7 : Intégration avec des services tiers

Synchronisez automatiquement avec des outils marketing, CRM, ou support client.

### Les intégrations courantes

**Mailchimp / SendGrid**
Ajoutez automatiquement les nouveaux utilisateurs à votre liste email.

**Intercom / Zendesk**
Créez un profil client pour le support.

**Segment / Mixpanel**
Envoyez les événements pour analytics avancés.

**Slack**
Notifiez votre équipe des nouvelles inscriptions.

### Exemple avec Slack

```typescript
async function handleUserCreated(data: any) {
  // Créer dans la DB
  await prisma.user.create(...)

  // Notifier sur Slack
  await fetch(SLACK_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: `🎉 Nouvelle inscription !`,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Nouvel utilisateur :*\n• Email: ${data.email_addresses[0]?.email_address}\n• Nom: ${data.first_name} ${data.last_name}`
          }
        },
        {
          type: 'actions',
          elements: [
            {
              type: 'button',
              text: { type: 'plain_text', text: 'Voir dans Clerk' },
              url: `https://dashboard.clerk.com/users/${data.id}`
            }
          ]
        }
      ]
    })
  })
}
```

## Comparaison finale : Upsert vs Webhooks

Après avoir vu tous ces scénarios, récapitulons quand utiliser quelle approche.

### Utilisez Upsert si

- Vous développez un MVP ou prototype
- Votre application a peu d'utilisateurs (< 1000)
- Vous n'avez pas besoin de synchronisation temps réel
- Vous voulez minimiser la complexité
- Vous n'avez pas besoin de gérer les suppressions immédiatement
- Vous développez en solo ou en petite équipe

### Utilisez Webhooks si

- Votre application est en production avec des utilisateurs réels
- Vous avez besoin d'envoyer des emails/notifications immédiatement
- Vous devez synchroniser plusieurs services
- Vous gérez des données sensibles nécessitant conformité RGPD
- Vous construisez un système d'analytics temps réel
- Vous avez besoin de détection de fraude ou de sécurité avancée
- Vous intégrez de nombreux services tiers

### Approche hybride (recommandée)

Commencez avec Upsert, puis migrez vers Webhooks quand vous en avez besoin :

**Phase 1 (MVP) :** Upsert uniquement
**Phase 2 (Beta) :** Upsert + Webhooks pour les emails
**Phase 3 (Production) :** Webhooks complets, garder Upsert comme fallback

Cette approche minimise la complexité initiale tout en permettant une évolution progressive vers une architecture plus robuste.

---

Passez au Module 5 : [05-PRODUCTION-VS-DEVELOPPEMENT.md](./05-PRODUCTION-VS-DEVELOPPEMENT.md)

Quiz : [06-QUIZ-QUESTIONS(OBLIGATOIRE).md](./06-QUIZ-QUESTIONS(OBLIGATOIRE).md)


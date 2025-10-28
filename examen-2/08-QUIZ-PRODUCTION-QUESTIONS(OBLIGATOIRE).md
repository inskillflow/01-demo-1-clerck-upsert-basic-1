# Quiz : Production vs Développement et Déploiement

## Instructions

- 20 questions à choix multiples
- Durée estimée : 25 minutes
- Cochez votre réponse pour chaque question
- Les réponses sont dans le fichier 09-QUIZ-PRODUCTION-REPONSES(OBLIGATOIRE).md

---

## Section 1 : Concepts Fondamentaux

### Question 1
Pourquoi ne peut-on pas accéder à `localhost:3000` depuis Internet ?

- [ ] A) C'est un problème de firewall
- [ ] B) localhost est une adresse réseau qui n'existe que sur votre machine locale
- [ ] C) Le port 3000 est bloqué par défaut
- [ ] D) C'est une limitation de Next.js

### Question 2
Quel est le rôle exact de ngrok dans le développement de webhooks ?

- [ ] A) Accélérer les requêtes HTTP
- [ ] B) Créer un tunnel qui expose temporairement votre localhost sur Internet
- [ ] C) Héberger votre application
- [ ] D) Remplacer Next.js

### Question 3
Une fois votre application déployée sur Vercel avec l'URL `https://mon-app.vercel.app`, avez-vous encore besoin de ngrok ?

- [ ] A) Oui, toujours nécessaire
- [ ] B) Non, l'URL Vercel est publiquement accessible
- [ ] C) Oui, mais seulement pour les webhooks
- [ ] D) Ça dépend du plan Vercel

### Question 4
Quelle est la principale différence entre l'URL ngrok et l'URL de production ?

- [ ] A) Ngrok est plus rapide
- [ ] B) L'URL ngrok change à chaque redémarrage (version gratuite), l'URL de production est permanente
- [ ] C) Ngrok fonctionne uniquement avec Clerk
- [ ] D) Il n'y a pas de différence

### Question 5
Dans quel ordre doit-on démarrer les services en développement local pour tester les webhooks ?

- [ ] A) ngrok d'abord, puis npm run dev
- [ ] B) npm run dev d'abord, puis ngrok
- [ ] C) L'ordre n'a pas d'importance
- [ ] D) Démarrer Clerk d'abord

---

## Section 2 : Configuration Clerk

### Question 6
Combien d'endpoints webhook différents devriez-vous configurer dans Clerk Dashboard pour une stratégie optimale ?

- [ ] A) Un seul pour tout
- [ ] B) Deux : un pour développement, un pour production
- [ ] C) Un par développeur
- [ ] D) Aucun, Clerk les configure automatiquement

### Question 7
Après avoir changé votre URL ngrok dans Clerk Dashboard, que devez-vous faire ?

- [ ] A) Rien, c'est automatique
- [ ] B) Redémarrer ngrok uniquement
- [ ] C) Redémarrer votre serveur Next.js pour recharger la configuration
- [ ] D) Attendre 24 heures

### Question 8
Le signing secret est-il le même entre votre endpoint de développement et de production ?

- [ ] A) Oui, c'est toujours le même
- [ ] B) Non, chaque endpoint a son propre signing secret
- [ ] C) Ça dépend du plan Clerk
- [ ] D) Les secrets n'existent pas en développement

### Question 9
Où devez-vous configurer l'URL webhook en production pour une application Vercel ?

- [ ] A) Dans le fichier .env.local
- [ ] B) Dans Clerk Dashboard → Webhooks → Add Endpoint
- [ ] C) Dans vercel.json
- [ ] D) Dans package.json

### Question 10
Si vous déployez sur `https://monsite.com`, quelle URL webhook devez-vous configurer dans Clerk ?

- [ ] A) `http://localhost:3000/api/webhooks/clerk`
- [ ] B) `https://monsite.com`
- [ ] C) `https://monsite.com/api/webhooks/clerk`
- [ ] D) `https://clerk.com/webhooks`

---

## Section 3 : Déploiement Vercel

### Question 11
Où doit-on stocker `CLERK_WEBHOOK_SECRET` pour un déploiement Vercel ?

- [ ] A) Dans le fichier .env.local commité sur Git
- [ ] B) Dans Vercel Dashboard → Settings → Environment Variables
- [ ] C) Dans le code source directement
- [ ] D) Pas besoin de le stocker

### Question 12
Après avoir ajouté une nouvelle variable d'environnement sur Vercel, que devez-vous faire ?

- [ ] A) Rien, c'est immédiat
- [ ] B) Redéployer l'application pour que la variable soit prise en compte
- [ ] C) Redémarrer Vercel
- [ ] D) Attendre 5 minutes

### Question 13
Quel est l'avantage principal du déploiement automatique sur Vercel via GitHub ?

- [ ] A) C'est gratuit
- [ ] B) Chaque push sur la branche main déclenche un redéploiement automatique
- [ ] C) Ça génère automatiquement le code
- [ ] D) Ça configure Clerk automatiquement

### Question 14
Comment tester que votre webhook fonctionne en production Vercel sans créer de vrai utilisateur ?

- [ ] A) Impossible à tester
- [ ] B) Utiliser la fonctionnalité "Send Example" dans Clerk Dashboard
- [ ] C) Créer 100 utilisateurs de test
- [ ] D) Utiliser ngrok en production

### Question 15
Quelle commande permet de voir les logs en temps réel de votre application Vercel ?

- [ ] A) `npm run logs`
- [ ] B) `vercel logs --follow`
- [ ] C) `clerk logs`
- [ ] D) `tail -f vercel.log`

---

## Section 4 : Railway et VPS

### Question 16
Quelle est la principale différence entre Railway et Vercel pour les webhooks ?

- [ ] A) Railway ne supporte pas les webhooks
- [ ] B) Aucune différence majeure, les deux fournissent une URL publique
- [ ] C) Railway nécessite ngrok
- [ ] D) Vercel est plus rapide pour les webhooks

### Question 17
Sur un VPS avec Nginx, quel est le rôle du reverse proxy pour votre application Next.js ?

- [ ] A) Ralentir les requêtes
- [ ] B) Recevoir les requêtes sur le port 80/443 et les transférer vers localhost:3000
- [ ] C) Générer du SSL automatiquement
- [ ] D) Remplacer Next.js

### Question 18
Quel outil utilise-t-on généralement pour obtenir un certificat SSL gratuit sur un VPS ?

- [ ] A) Vercel
- [ ] B) Let's Encrypt via Certbot
- [ ] C) SSL Generator
- [ ] D) Clerk Dashboard

### Question 19
Si vous hébergez sur un VPS avec le domaine `monsite.com`, avez-vous besoin de ngrok ?

- [ ] A) Oui, toujours
- [ ] B) Non, le domaine est accessible publiquement
- [ ] C) Oui, pour la sécurité
- [ ] D) Seulement en HTTPS

### Question 20
Quel est l'avantage principal d'un VPS par rapport à Vercel ou Railway ?

- [ ] A) C'est gratuit
- [ ] B) Contrôle total du serveur et de la configuration
- [ ] C) Plus rapide
- [ ] D) Pas besoin de configuration

---

**Voir le fichier 09-QUIZ-PRODUCTION-REPONSES(OBLIGATOIRE).md pour les corrections**


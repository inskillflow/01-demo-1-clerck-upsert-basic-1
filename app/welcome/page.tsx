import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { syncUser } from '@/lib/sync-user'

export default async function WelcomePage() {
  const { userId } = auth()
  if (!userId) redirect('/sign-in')

  // Sync directe côté serveur
  await syncUser()
  
  // Redirection immédiate
  redirect('/members')
}

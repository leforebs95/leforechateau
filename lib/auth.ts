import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from './database.types'

export const createClient = () => createClientComponentClient<Database>()

export const signInWithGoogle = async () => {
  const supabase = createClient()
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  })
  if (error) throw error
}

export const signOut = async () => {
  const supabase = createClient()
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export const getSession = async () => {
  const supabase = createClient()
  const { data: { session }, error } = await supabase.auth.getSession()
  if (error) throw error
  return session
} 
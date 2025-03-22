import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { createClient } from '@/lib/auth'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const supabase = createClient()
        const { error } = await supabase.auth.getSession()
        
        if (error) {
          throw error
        }

        // Redirect to home page on success
        router.push('/')
      } catch (error) {
        console.error('Error during auth callback:', error)
        router.push('/auth/error?error=invalid_request')
      }
    }

    handleCallback()
  }, [router])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-gray-600">Completing sign in...</p>
      </div>
    </div>
  )
} 
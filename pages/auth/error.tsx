import { useRouter } from 'next/router'
import Head from 'next/head'

export default function AuthError() {
  const router = useRouter()
  const { error } = router.query

  const getErrorMessage = (error: string) => {
    switch (error) {
      case 'invalid_grant':
        return 'Invalid email or password.'
      case 'email_not_confirmed':
        return 'Please confirm your email address before signing in.'
      case 'invalid_request':
        return 'Invalid request. Please try again.'
      case 'user_not_found':
        return 'No account found with this email address.'
      case 'too_many_requests':
        return 'Too many attempts. Please try again later.'
      default:
        return 'An error occurred during authentication. Please try again.'
    }
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <Head>
        <title>Authentication Error - Beach House Rental</title>
      </Head>

      <div className="max-w-md mx-auto text-center">
        <div className="text-5xl mb-4">😕</div>
        <h2 className="text-3xl font-bold text-text mb-4">Authentication Error</h2>
        <p className="text-gray-600 mb-8">
          {error ? getErrorMessage(error as string) : 'An unknown error occurred.'}
        </p>
        <div className="space-y-4">
          <button
            onClick={() => router.push('/')}
            className="btn-primary w-full"
          >
            Return Home
          </button>
        </div>
      </div>
    </div>
  )
} 
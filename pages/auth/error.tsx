import { useRouter } from 'next/router'
import Head from 'next/head'

export default function AuthError() {
  const router = useRouter()
  const { error } = router.query

  const getErrorMessage = (error: string) => {
    switch (error) {
      case 'Configuration':
        return 'There is a problem with the server configuration.'
      case 'AccessDenied':
        return 'You do not have permission to sign in.'
      case 'Verification':
        return 'The sign in link is no longer valid. It may have been used already or it may have expired.'
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
            onClick={() => router.push('/auth/signin')}
            className="btn-primary w-full"
          >
            Try Again
          </button>
          <button
            onClick={() => router.push('/')}
            className="text-primary hover:text-primary-light transition-colors"
          >
            Return Home
          </button>
        </div>
      </div>
    </div>
  )
} 
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getSession, signInWithEmail, signInWithGoogle, signOut } from '@/lib/auth'

export default function Header() {
  const [session, setSession] = useState<any>(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Fetch session on component mount
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const sessionData = await getSession();
        setSession(sessionData);
      } catch (error) {
        console.error('Error fetching session:', error);
      }
    };
    fetchSession();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setSession(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className={`fixed w-full z-50 transition-colors duration-300 ${
      isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
    }`}>
      <div className="container-custom py-4">
        <nav className="flex items-center justify-between">
          <Link href="/" className={`text-2xl font-bold ${
            isScrolled ? 'text-primary' : 'text-white'
          }`}>
            Beach House
          </Link>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center gap-6">
            {session ? (
              <>
                <span className={`${isScrolled ? 'text-text' : 'text-white'}`}>
                  {session.user?.user_metadata?.full_name}
                </span>
                <button
                  onClick={handleSignOut}
                  className={`${isScrolled ? 'text-text hover:text-primary' : 'text-white hover:text-gray-200'}`}
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={handleSignIn}
                className={isScrolled ? 'btn-primary' : 'bg-white/10 text-white hover:bg-white/20 px-6 py-2 rounded-lg'}
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`md:hidden ${isScrolled ? 'text-primary' : 'text-white'}`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </nav>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className={`md:hidden mt-4 py-4 ${
            isScrolled ? 'bg-white border-t border-gray-100' : 'bg-black/20'
          }`}>
            {session ? (
              <div className="space-y-4 px-4">
                <div className={isScrolled ? 'text-text' : 'text-white'}>
                  {session.user?.user_metadata?.full_name}
                </div>
                <button
                  onClick={handleSignOut}
                  className={`block w-full text-left ${
                    isScrolled ? 'text-text hover:text-primary' : 'text-white hover:text-gray-200'
                  }`}
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="px-4">
                <button
                  onClick={handleSignIn}
                  className={`w-full ${
                    isScrolled ? 'btn-primary' : 'bg-white/10 text-white hover:bg-white/20 px-6 py-2 rounded-lg'
                  }`}
                >
                  Sign In
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  )
} 
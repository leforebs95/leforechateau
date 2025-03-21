import { useSession, signIn, signOut } from 'next-auth/react'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Header() {
  const { data: session } = useSession()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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
                  {session.user?.name}
                </span>
                <button
                  onClick={() => signOut()}
                  className={`${isScrolled ? 'text-text hover:text-primary' : 'text-white hover:text-gray-200'}`}
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={() => signIn()}
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
                  {session.user?.name}
                </div>
                <button
                  onClick={() => signOut()}
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
                  onClick={() => signIn()}
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
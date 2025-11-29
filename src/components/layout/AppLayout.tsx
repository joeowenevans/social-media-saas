import { useState, type ReactNode } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { Share2, LayoutDashboard, Upload, Calendar, Settings, Menu, X } from 'lucide-react'
import toast from 'react-hot-toast'

interface AppLayoutProps {
  children: ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { signOut } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleSignOut = async () => {
    setMobileMenuOpen(false)
    await signOut()
    toast.success('Signed out successfully')
    navigate('/')
  }

  const handleNavClick = (path: string) => {
    setMobileMenuOpen(false)
    navigate(path)
  }

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Upload, label: 'Upload', path: '/upload' },
    { icon: Calendar, label: 'Scheduled', path: '/schedule' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundColor: '#0a0a0a',
        backgroundImage: 'radial-gradient(circle, rgba(75, 85, 99, 0.35) 1px, transparent 1px)',
        backgroundSize: '24px 24px'
      }}
    >
      {/* Header */}
      <header className="sticky top-0 z-50 h-16 w-full bg-[#0f0f0f] border-b border-[#1a1a1a]">

        {/* Desktop Navigation - hidden on mobile, flex on sm+ */}
        <div className="hidden sm:flex h-full w-full items-center justify-between px-12">
          {/* Logo (1/3) */}
          <div className="flex-1 flex items-center gap-3">
            <Share2 className="w-6 h-6 text-white" />
            <span className="text-teal-400 text-xl font-bold">SocialAI</span>
          </div>

          {/* Nav Items (2/3) */}
          <nav className="flex-[2] flex justify-evenly items-center">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="bg-transparent border-none cursor-pointer transition-all duration-300"
                style={{
                  color: isActive(item.path) ? '#2dd4bf' : '#e5e5e5',
                  fontSize: '15px',
                  fontWeight: 600,
                  textShadow: isActive(item.path)
                    ? '0 0 10px rgba(20, 184, 166, 0.6), 0 0 20px rgba(20, 184, 166, 0.4)'
                    : 'none'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#2dd4bf'
                  e.currentTarget.style.textShadow = '0 0 10px rgba(20, 184, 166, 0.6)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = isActive(item.path) ? '#2dd4bf' : '#e5e5e5'
                  e.currentTarget.style.textShadow = isActive(item.path)
                    ? '0 0 10px rgba(20, 184, 166, 0.6), 0 0 20px rgba(20, 184, 166, 0.4)'
                    : 'none'
                }}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={handleSignOut}
              className="bg-transparent border-none cursor-pointer transition-all duration-300"
              style={{
                color: '#e5e5e5',
                fontSize: '15px',
                fontWeight: 600
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#2dd4bf'
                e.currentTarget.style.textShadow = '0 0 10px rgba(20, 184, 166, 0.6)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#e5e5e5'
                e.currentTarget.style.textShadow = 'none'
              }}
            >
              Sign Out
            </button>
          </nav>
        </div>

        {/* Mobile Navigation - flex on mobile, hidden on sm+ */}
        <div className="flex sm:hidden h-full w-full items-center justify-between px-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Share2 className="w-6 h-6 text-white" />
            <span className="text-teal-400 text-xl font-bold">SocialAI</span>
          </div>

          {/* Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 bg-transparent border-none cursor-pointer"
            aria-label="Open menu"
          >
            <Menu className="w-7 h-7 text-teal-400" />
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="sm:hidden fixed inset-0 z-[100] flex">
          {/* Backdrop */}
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Slide-in Menu */}
          <div className="absolute top-0 right-0 bottom-0 w-72 max-w-[80vw] bg-gray-800 border-l border-gray-700 flex flex-col animate-slide-in">
            {/* Header with Close */}
            <div className="flex justify-between items-center p-4 border-b border-gray-700">
              <span className="text-teal-400 text-lg font-bold">Menu</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 bg-transparent border-none cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-6 h-6 text-gray-300" />
              </button>
            </div>

            {/* Nav Items */}
            <nav className="flex-1 py-4">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleNavClick(item.path)}
                  className={`w-full flex items-center gap-4 px-6 py-4 border-none cursor-pointer text-left transition-all ${
                    isActive(item.path)
                      ? 'bg-teal-400/10 border-l-4 border-l-teal-400 text-teal-400'
                      : 'bg-transparent border-l-4 border-l-transparent text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  <span className="text-base font-medium">{item.label}</span>
                </button>
              ))}
            </nav>

            {/* Sign Out */}
            <div className="p-4 border-t border-gray-700">
              <button
                onClick={handleSignOut}
                className="w-full py-3 px-4 bg-gray-700 hover:bg-gray-600 border-none rounded-lg text-gray-300 text-base font-semibold cursor-pointer transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Animation styles */}
      <style>{`
        @keyframes slide-in {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in {
          animation: slide-in 0.2s ease-out;
        }
      `}</style>

      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 py-4 sm:py-8">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#0f0f0f] border-t border-[#1a1a1a] mt-8 sm:mt-16">
        <div className="max-w-[900px] mx-auto text-center p-4 sm:p-8">
          <div className="text-teal-400 font-bold text-lg mb-4">SocialAI</div>
          <div className="flex flex-col items-center gap-4">
            {['Privacy Policy', 'Terms of Service', 'Contact', 'Support'].map((link) => (
              <a
                key={link}
                href="#"
                className="text-gray-500 text-sm hover:text-teal-400 transition-colors"
              >
                {link}
              </a>
            ))}
          </div>
          <div className="text-gray-500 text-sm mt-6">
            &copy; {new Date().getFullYear()} SocialAI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

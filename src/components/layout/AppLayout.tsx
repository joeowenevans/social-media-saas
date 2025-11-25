import type { ReactNode } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import {
  Share2,
  LayoutDashboard,
  Upload,
  Calendar,
  Settings,
  LogOut,
  CreditCard,
  Menu,
  X
} from 'lucide-react'
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
    await signOut()
    toast.success('Signed out successfully')
    navigate('/')
  }

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Upload, label: 'Upload', path: '/upload' },
    { icon: Calendar, label: 'Schedule', path: '/schedule' },
    { icon: Settings, label: 'Settings', path: '/settings' },
    { icon: CreditCard, label: 'Billing', path: '/billing' },
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-filter backdrop-blur-xl bg-white/70 dark:bg-charcoal-900/70 border-b border-gray-200/50 dark:border-charcoal-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2.5 hover:opacity-70 transition-opacity"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-primary-600">
                <Share2 className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-semibold tracking-tight">SocialAI</span>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-2">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${isActive(item.path)
                      ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400'
                      : 'text-charcoal-600 dark:text-charcoal-300 hover:text-charcoal-900 dark:hover:text-charcoal-100 hover:bg-charcoal-100/50 dark:hover:bg-charcoal-800/50'
                    }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleSignOut}
                className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-charcoal-600 dark:text-charcoal-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50/50 dark:hover:bg-red-900/20 transition-all duration-200"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-charcoal-600 dark:text-charcoal-400 hover:bg-charcoal-100/50 dark:hover:bg-charcoal-800/50 transition-colors"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200/50 dark:border-charcoal-700/50 backdrop-filter backdrop-blur-xl bg-white/90 dark:bg-charcoal-900/90">
            <div className="px-4 py-3 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path)
                    setMobileMenuOpen(false)
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200
                    ${isActive(item.path)
                      ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400'
                      : 'text-charcoal-600 dark:text-charcoal-300 hover:bg-charcoal-100/50 dark:hover:bg-charcoal-800/50'
                    }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              ))}
              <button
                onClick={() => {
                  handleSignOut()
                  setMobileMenuOpen(false)
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50/50 dark:hover:bg-red-900/20 transition-all duration-200"
              >
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="backdrop-filter backdrop-blur-xl bg-white/70 dark:bg-charcoal-900/70 border-t border-gray-200/50 dark:border-charcoal-700/50 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Logo & Copyright */}
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-primary-600">
                <Share2 className="h-3.5 w-3.5 text-white" />
              </div>
              <div>
                <span className="font-semibold text-sm">SocialAI</span>
                <p className="text-xs text-charcoal-500 dark:text-charcoal-400">&copy; {new Date().getFullYear()} All rights reserved.</p>
              </div>
            </div>

            {/* Links */}
            <div className="flex items-center gap-6 text-sm text-charcoal-600 dark:text-charcoal-400">
              <a href="#" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

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
  X,
  Twitter,
  Facebook,
  Instagram,
  Linkedin
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
    <div className="min-h-screen flex flex-col bg-[#0d0d0d]">
      {/* Header - Full Width Dark Bar */}
      <header className="sticky top-0 z-50 bg-[#0d0d0d] border-b border-[#27272a]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="flex justify-between items-center h-16">
            {/* Logo - Static, Non-Clickable */}
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-primary-600">
                <Share2 className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-semibold tracking-tight text-white">SocialAI</span>
            </div>

            {/* Desktop Navigation - Evenly Spaced */}
            <nav className="hidden md:flex items-center justify-center flex-1 px-8">
              <div className="flex items-center gap-8">
                {navItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`relative text-sm font-medium transition-all duration-200 ease-in-out
                      ${isActive(item.path)
                        ? 'text-primary-400 font-semibold'
                        : 'text-[#a1a1aa] hover:text-white'
                      }
                    `}
                  >
                    {item.label}
                    {isActive(item.path) && (
                      <span className="absolute -bottom-[17px] left-0 right-0 h-0.5 bg-primary-400"></span>
                    )}
                  </button>
                ))}
              </div>
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleSignOut}
                className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-[#a1a1aa] hover:text-red-400 hover:bg-[#1a1a1a] transition-all duration-200"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-[#a1a1aa] hover:text-white hover:bg-[#1a1a1a] transition-colors"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation - Slide Down Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#27272a] bg-[#0d0d0d]">
            <div className="px-6 lg:px-12 py-3 space-y-1 max-w-[1400px] mx-auto">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path)
                    setMobileMenuOpen(false)
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200
                    ${isActive(item.path)
                      ? 'bg-[#1a1a1a] text-primary-400 font-semibold'
                      : 'text-[#a1a1aa] hover:text-white hover:bg-[#1a1a1a]'
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
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:bg-[#1a1a1a] transition-all duration-200"
              >
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 bg-[#0d0d0d]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-8">
          {children}
        </div>
      </main>

      {/* Footer - Dark Matching Theme */}
      <footer className="bg-[#0d0d0d] border-t border-[#27272a] mt-auto">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Brand Section */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-primary-600">
                  <Share2 className="h-4 w-4 text-white" />
                </div>
                <span className="text-lg font-semibold tracking-tight text-white">SocialAI</span>
              </div>
              <p className="text-sm text-[#a1a1aa] leading-relaxed">
                AI-powered social media management made simple. Create, schedule, and optimize your content effortlessly.
              </p>
            </div>

            {/* Quick Links */}
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wide">Quick Links</h3>
              <div className="flex flex-col gap-2 text-sm">
                <a href="#" className="text-[#a1a1aa] hover:text-primary-400 transition-colors duration-200">Privacy Policy</a>
                <a href="#" className="text-[#a1a1aa] hover:text-primary-400 transition-colors duration-200">Terms of Service</a>
                <a href="#" className="text-[#a1a1aa] hover:text-primary-400 transition-colors duration-200">Contact</a>
                <a href="#" className="text-[#a1a1aa] hover:text-primary-400 transition-colors duration-200">Support</a>
              </div>
            </div>

            {/* Social Media */}
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wide">Follow Us</h3>
              <div className="flex gap-3">
                <a
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1a1a1a] text-[#a1a1aa] hover:bg-primary-500 hover:text-white transition-all duration-200 border border-[#27272a]"
                  aria-label="Twitter"
                >
                  <Twitter className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1a1a1a] text-[#a1a1aa] hover:bg-primary-500 hover:text-white transition-all duration-200 border border-[#27272a]"
                  aria-label="Facebook"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1a1a1a] text-[#a1a1aa] hover:bg-primary-500 hover:text-white transition-all duration-200 border border-[#27272a]"
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1a1a1a] text-[#a1a1aa] hover:bg-primary-500 hover:text-white transition-all duration-200 border border-[#27272a]"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-[#27272a]">
            <p className="text-center text-sm text-[#71717a]">
              &copy; {new Date().getFullYear()} SocialAI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

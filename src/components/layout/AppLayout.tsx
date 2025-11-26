import type { ReactNode } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import {
  LayoutDashboard,
  Upload,
  Calendar,
  Settings,
  CreditCard
} from 'lucide-react'
import toast from 'react-hot-toast'

interface AppLayoutProps {
  children: ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { signOut } = useAuth()

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
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(180deg, #111111 0%, #0a0a0a 100%)' }}>
      {/* Header - New Design System */}
      <header
        className="sticky top-0 z-50"
        style={{
          background: '#0f0f0f',
          borderBottom: '1px solid #1a1a1a',
          height: '64px'
        }}
      >
        <div className="mx-auto flex items-center justify-between h-full" style={{ maxWidth: '900px', padding: '0 32px' }}>
          {/* Logo - Left Aligned */}
          <div
            style={{
              color: '#14b8a6',
              fontWeight: 700,
              fontSize: '18px'
            }}
          >
            SocialAI
          </div>

          {/* Navigation - Always visible (no mobile menu) */}
          <nav className="flex items-center gap-6">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="unstyled transition-colors"
                style={{
                  color: isActive(item.path) ? '#14b8a6' : '#e5e5e5',
                  fontSize: '15px',
                  fontWeight: isActive(item.path) ? 600 : 500,
                  background: 'transparent',
                  border: 'none',
                  padding: '0',
                  cursor: 'pointer',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#14b8a6'}
                onMouseLeave={(e) => e.currentTarget.style.color = isActive(item.path) ? '#14b8a6' : '#e5e5e5'}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={handleSignOut}
              className="unstyled transition-colors"
              style={{
                color: '#e5e5e5',
                fontSize: '15px',
                fontWeight: 500,
                background: 'transparent',
                border: 'none',
                padding: '0',
                cursor: 'pointer',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#14b8a6'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#e5e5e5'}
            >
              Sign Out
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-8">
          {children}
        </div>
      </main>

      {/* Footer - New Design System */}
      <footer
        style={{
          background: '#0f0f0f',
          borderTop: '1px solid #1a1a1a',
          marginTop: '64px'
        }}
      >
        <div
          className="mx-auto text-center"
          style={{
            maxWidth: '900px',
            padding: '32px'
          }}
        >
          {/* Logo */}
          <div
            style={{
              color: '#14b8a6',
              fontWeight: 700,
              fontSize: '18px',
              marginBottom: '16px'
            }}
          >
            SocialAI
          </div>

          {/* Links - Stacked vertically, centered */}
          <div className="flex flex-col items-center gap-4">
            <a
              href="#"
              className="transition-colors"
              style={{
                color: '#888',
                fontSize: '14px',
                textDecoration: 'none',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#14b8a6'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#888'}
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="transition-colors"
              style={{
                color: '#888',
                fontSize: '14px',
                textDecoration: 'none',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#14b8a6'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#888'}
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="transition-colors"
              style={{
                color: '#888',
                fontSize: '14px',
                textDecoration: 'none',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#14b8a6'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#888'}
            >
              Contact
            </a>
            <a
              href="#"
              className="transition-colors"
              style={{
                color: '#888',
                fontSize: '14px',
                textDecoration: 'none',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#14b8a6'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#888'}
            >
              Support
            </a>
          </div>

          {/* Copyright */}
          <div
            style={{
              color: '#888',
              fontSize: '14px',
              marginTop: '24px'
            }}
          >
            &copy; {new Date().getFullYear()} SocialAI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

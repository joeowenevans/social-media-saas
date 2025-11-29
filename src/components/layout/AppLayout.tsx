import { useState, type ReactNode } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import {
  Share2,
  LayoutDashboard,
  Upload,
  Calendar,
  Settings,
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
      {/* Header - Fixed Layout */}
      <header
        style={{
          background: '#0f0f0f',
          borderBottom: '1px solid #1a1a1a',
          height: '64px',
          width: '100%',
          position: 'sticky',
          top: 0,
          zIndex: 50
        }}
      >
        {/* Desktop Navigation - Hidden on mobile, visible on sm+ */}
        <div
          className="hidden sm:flex"
          style={{
            justifyContent: 'space-between',
            alignItems: 'center',
            height: '100%',
            padding: '0 48px',
            width: '100%'
          }}
        >
          {/* Left Side - Logo Section (1/3) */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}
          >
            <Share2
              style={{
                color: 'white',
                width: '24px',
                height: '24px'
              }}
            />
            <span
              style={{
                color: '#14b8a6',
                fontSize: '20px',
                fontWeight: 700
              }}
            >
              SocialAI
            </span>
          </div>

          {/* Right Side - Navigation (2/3) */}
          <nav
            style={{
              flex: 2,
              display: 'flex',
              justifyContent: 'space-evenly',
              alignItems: 'center'
            }}
          >
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="unstyled"
                style={{
                  color: isActive(item.path) ? '#14b8a6' : '#e5e5e5',
                  fontSize: '15px',
                  fontWeight: 600,
                  background: 'transparent',
                  border: 'none',
                  padding: '0',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  textShadow: isActive(item.path)
                    ? '0 0 12px rgba(20, 184, 166, 0.8), 0 0 24px rgba(20, 184, 166, 0.5)'
                    : 'none'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#14b8a6'
                  e.currentTarget.style.textShadow = '0 0 10px rgba(20, 184, 166, 0.8)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = isActive(item.path) ? '#14b8a6' : '#e5e5e5'
                  e.currentTarget.style.textShadow = isActive(item.path)
                    ? '0 0 12px rgba(20, 184, 166, 0.8), 0 0 24px rgba(20, 184, 166, 0.5)'
                    : 'none'
                }}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={handleSignOut}
              className="unstyled"
              style={{
                color: '#e5e5e5',
                fontSize: '15px',
                fontWeight: 600,
                background: 'transparent',
                border: 'none',
                padding: '0',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textShadow: 'none'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#14b8a6'
                e.currentTarget.style.textShadow = '0 0 10px rgba(20, 184, 166, 0.8)'
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

        {/* Mobile Navigation - Visible on mobile, hidden on sm+ */}
        <div
          className="sm:hidden flex"
          style={{
            justifyContent: 'space-between',
            alignItems: 'center',
            height: '100%',
            padding: '0 16px',
            width: '100%'
          }}
        >
          {/* Logo */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}
          >
            <Share2
              style={{
                color: 'white',
                width: '24px',
                height: '24px'
              }}
            />
            <span
              style={{
                color: '#14b8a6',
                fontSize: '20px',
                fontWeight: 700
              }}
            >
              SocialAI
            </span>
          </div>

          {/* Hamburger Button */}
          <button
            className="sm:hidden"
            onClick={() => setMobileMenuOpen(true)}
            style={{
              background: 'transparent',
              border: 'none',
              padding: '10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '44px',
              minHeight: '44px'
            }}
            aria-label="Open menu"
          >
            <Menu style={{ color: '#14b8a6', width: '28px', height: '28px' }} />
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay - Only visible on mobile */}
      {mobileMenuOpen && (
        <div
          className="sm:hidden"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 100,
            display: 'flex'
          }}
        >
          {/* Backdrop */}
          <div
            onClick={() => setMobileMenuOpen(false)}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(4px)'
            }}
          />

          {/* Slide-in Menu from Right */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              width: '280px',
              maxWidth: '80vw',
              background: '#1a1a1a',
              borderLeft: '1px solid #2a2a2a',
              display: 'flex',
              flexDirection: 'column',
              animation: 'slideInRight 0.2s ease-out'
            }}
          >
            {/* Menu Header with Close Button */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px 20px',
                borderBottom: '1px solid #2a2a2a'
              }}
            >
              <span
                style={{
                  color: '#14b8a6',
                  fontSize: '18px',
                  fontWeight: 700
                }}
              >
                Menu
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  padding: '10px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: '44px',
                  minHeight: '44px',
                  marginRight: '-10px'
                }}
                aria-label="Close menu"
              >
                <X style={{ color: '#e5e5e5', width: '24px', height: '24px' }} />
              </button>
            </div>

            {/* Mobile Nav Items */}
            <nav style={{ flex: 1, padding: '16px 0' }}>
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleNavClick(item.path)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    width: '100%',
                    padding: '16px 24px',
                    background: isActive(item.path) ? 'rgba(20, 184, 166, 0.1)' : 'transparent',
                    border: 'none',
                    borderLeft: isActive(item.path) ? '3px solid #14b8a6' : '3px solid transparent',
                    color: isActive(item.path) ? '#14b8a6' : '#e5e5e5',
                    fontSize: '16px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    textAlign: 'left',
                    minHeight: '52px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <item.icon style={{ width: '22px', height: '22px', flexShrink: 0 }} />
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Sign Out Button at Bottom */}
            <div style={{ padding: '16px 20px', borderTop: '1px solid #2a2a2a' }}>
              <button
                onClick={handleSignOut}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  width: '100%',
                  padding: '14px 20px',
                  background: '#2a2a2a',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#e5e5e5',
                  fontSize: '15px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  minHeight: '48px',
                  transition: 'all 0.2s ease'
                }}
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CSS Animation for Mobile Menu */}
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>

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

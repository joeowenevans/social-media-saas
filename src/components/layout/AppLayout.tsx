import { useState, type ReactNode } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
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
      className="app-root min-h-screen flex flex-col"
      style={{
        backgroundColor: '#1A1F36',
        backgroundImage: 'radial-gradient(circle, rgba(80, 227, 194, 0.08) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
        overflowX: 'hidden',
        maxWidth: '100vw'
      }}
    >
      {/* Header - Fixed Layout */}
      <header
        style={{
          background: '#151929',
          borderBottom: '1px solid rgba(80, 227, 194, 0.1)',
          height: '64px',
          width: '100%',
          position: 'sticky',
          top: 0,
          zIndex: 50
        }}
      >
        <div
          className="header-inner"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: '100%',
            padding: '0 48px',
            width: '100%'
          }}
        >
          {/* Left Side - Logo Section (1/3) - Clickable to Dashboard */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <button
              onClick={() => navigate('/dashboard')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: 0
              }}
            >
              <Share2
                style={{
                  color: '#50E3C2',
                  width: '24px',
                  height: '24px'
                }}
              />
              <span
                style={{
                  color: '#50E3C2',
                  fontSize: '20px',
                  fontWeight: 700
                }}
              >
                SocialAI
              </span>
            </button>
          </div>

          {/* Right Side - Navigation (2/3) - Desktop only */}
          <nav
            className="desktop-nav"
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
                  color: isActive(item.path) ? '#50E3C2' : '#F2F4F8',
                  fontSize: '15px',
                  fontWeight: 600,
                  background: 'transparent',
                  border: 'none',
                  padding: '0',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  textShadow: isActive(item.path)
                    ? '0 0 12px rgba(80, 227, 194, 0.8), 0 0 24px rgba(80, 227, 194, 0.5)'
                    : 'none'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#50E3C2'
                  e.currentTarget.style.textShadow = '0 0 10px rgba(80, 227, 194, 0.8)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = isActive(item.path) ? '#50E3C2' : '#F2F4F8'
                  e.currentTarget.style.textShadow = isActive(item.path)
                    ? '0 0 12px rgba(80, 227, 194, 0.8), 0 0 24px rgba(80, 227, 194, 0.5)'
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
                color: '#F2F4F8',
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
                e.currentTarget.style.color = '#50E3C2'
                e.currentTarget.style.textShadow = '0 0 10px rgba(80, 227, 194, 0.8)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#F2F4F8'
                e.currentTarget.style.textShadow = 'none'
              }}
            >
              Sign Out
            </button>
          </nav>

          {/* Mobile Hamburger Button - Hidden on desktop */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(true)}
            style={{
              background: 'transparent',
              border: 'none',
              padding: '10px',
              cursor: 'pointer',
              display: 'none',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '44px',
              minHeight: '44px'
            }}
            aria-label="Open menu"
          >
            <Menu style={{ color: '#50E3C2', width: '28px', height: '28px' }} />
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay - Only renders on mobile */}
      {mobileMenuOpen && (
        <div
          className="mobile-menu-overlay"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 100,
            display: 'none'
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
              background: 'rgba(26, 31, 54, 0.8)',
              backdropFilter: 'blur(8px)'
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
              background: '#1A1F36',
              borderLeft: '1px solid rgba(80, 227, 194, 0.2)',
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
                borderBottom: '1px solid rgba(80, 227, 194, 0.2)'
              }}
            >
              <span
                style={{
                  color: '#50E3C2',
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
                <X style={{ color: '#50E3C2', width: '24px', height: '24px' }} />
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
                    background: 'transparent',
                    border: 'none',
                    color: isActive(item.path) ? '#50E3C2' : '#F2F4F8',
                    fontSize: '16px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    textAlign: 'left',
                    minHeight: '52px',
                    transition: 'all 0.2s ease',
                    textShadow: isActive(item.path)
                      ? '0 0 10px rgba(80, 227, 194, 0.8), 0 0 20px rgba(80, 227, 194, 0.4)'
                      : 'none'
                  }}
                >
                  <item.icon style={{
                    width: '22px',
                    height: '22px',
                    flexShrink: 0,
                    filter: isActive(item.path)
                      ? 'drop-shadow(0 0 6px rgba(80, 227, 194, 0.8))'
                      : 'none'
                  }} />
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Sign Out Button at Bottom */}
            <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(80, 227, 194, 0.2)' }}>
              <button
                onClick={handleSignOut}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  width: '100%',
                  padding: '14px 20px',
                  background: '#242A45',
                  border: '1px solid rgba(80, 227, 194, 0.3)',
                  borderRadius: '8px',
                  color: '#F2F4F8',
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

      {/* Mobile-only CSS - does not affect desktop */}
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }

        @media (max-width: 639px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
          .mobile-menu-overlay { display: flex !important; }
          .header-inner { padding: 0 12px !important; max-width: 100% !important; box-sizing: border-box !important; }
          .app-main { padding-left: 16px !important; padding-right: 16px !important; }
          header { max-width: 100vw !important; overflow: hidden !important; }
        }
      `}</style>

      {/* Main Content */}
      <main className="flex-1">
        <div className="app-main max-w-[1400px] mx-auto px-6 lg:px-12 py-8">
          {children}
        </div>
      </main>

      {/* Footer - New Design System */}
      <footer
        style={{
          background: '#151929',
          borderTop: '1px solid rgba(80, 227, 194, 0.1)',
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
              color: '#50E3C2',
              fontWeight: 700,
              fontSize: '18px',
              marginBottom: '16px'
            }}
          >
            SocialAI
          </div>

          {/* Links - Stacked vertically, centred */}
          <div className="flex flex-col items-center gap-4">
            <Link
              to="/privacy"
              className="transition-colors"
              style={{
                color: 'rgba(242, 244, 248, 0.6)',
                fontSize: '14px',
                textDecoration: 'none',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#50E3C2'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(242, 244, 248, 0.6)'}
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="transition-colors"
              style={{
                color: 'rgba(242, 244, 248, 0.6)',
                fontSize: '14px',
                textDecoration: 'none',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#50E3C2'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(242, 244, 248, 0.6)'}
            >
              Terms of Service
            </Link>
            <Link
              to="/contact"
              className="transition-colors"
              style={{
                color: 'rgba(242, 244, 248, 0.6)',
                fontSize: '14px',
                textDecoration: 'none',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#50E3C2'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(242, 244, 248, 0.6)'}
            >
              Contact
            </Link>
            <Link
              to="/support"
              className="transition-colors"
              style={{
                color: 'rgba(242, 244, 248, 0.6)',
                fontSize: '14px',
                textDecoration: 'none',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#50E3C2'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(242, 244, 248, 0.6)'}
            >
              Support
            </Link>
            <a
              href="mailto:studio@dizzyotter.com"
              className="transition-colors"
              style={{
                color: 'rgba(242, 244, 248, 0.6)',
                fontSize: '14px',
                textDecoration: 'none',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#50E3C2'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(242, 244, 248, 0.6)'}
            >
              studio@dizzyotter.com
            </a>
          </div>

          {/* Copyright */}
          <div
            style={{
              color: 'rgba(242, 244, 248, 0.5)',
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

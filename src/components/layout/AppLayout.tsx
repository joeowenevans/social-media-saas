import type { ReactNode } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import {
  Share2,
  LayoutDashboard,
  Upload,
  Calendar,
  Settings
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
    { icon: Calendar, label: 'Scheduled', path: '/schedule' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: `
          radial-gradient(ellipse 80% 50% at 10% 10%, rgba(20, 184, 166, 0.08) 0%, transparent 50%),
          radial-gradient(ellipse 80% 50% at 90% 90%, rgba(20, 184, 166, 0.06) 0%, transparent 50%),
          radial-gradient(ellipse 60% 40% at 50% 0%, rgba(20, 184, 166, 0.04) 0%, transparent 40%),
          linear-gradient(180deg, #111111 0%, #0a0a0a 100%)
        `,
        position: 'relative'
      }}
    >
      {/* Noise texture overlay */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.035,
          pointerEvents: 'none',
          zIndex: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '128px 128px'
        }}
      />
      {/* Header - Fixed Layout */}
      <header
        style={{
          background: 'rgba(15, 15, 15, 0.95)',
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid #1a1a1a',
          height: '64px',
          width: '100%',
          position: 'sticky',
          top: 0,
          zIndex: 50
        }}
      >
        <div
          style={{
            display: 'flex',
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
      </header>

      {/* Main Content */}
      <main className="flex-1" style={{ position: 'relative', zIndex: 1 }}>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-8">
          {children}
        </div>
      </main>

      {/* Footer - New Design System */}
      <footer
        style={{
          background: 'rgba(15, 15, 15, 0.95)',
          backdropFilter: 'blur(8px)',
          borderTop: '1px solid #1a1a1a',
          marginTop: '64px',
          position: 'relative',
          zIndex: 1
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

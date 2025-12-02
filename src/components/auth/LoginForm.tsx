import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { Share2 } from 'lucide-react'
import toast from 'react-hot-toast'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await signIn(email, password)

    if (error) {
      toast.error(error.message)
      setLoading(false)
    } else {
      toast.success('Successfully logged in!')
      navigate('/dashboard')
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        backgroundColor: '#1A1F36',
        backgroundImage: 'radial-gradient(circle, rgba(41, 121, 255, 0.15) 1px, transparent 1px)',
        backgroundSize: '24px 24px'
      }}
    >
      <style>{`
        /* Fix autofill white background */
        input {
          background-color: rgba(26, 31, 54, 0.8) !important;
          background-image: none !important;
        }

        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus,
        input:-webkit-autofill:active {
          -webkit-background-clip: text;
          -webkit-text-fill-color: #F2F4F8 !important;
          transition: background-color 5000s ease-in-out 0s;
          box-shadow: inset 0 0 20px 20px rgba(26, 31, 54, 0.8) !important;
          border: 1px solid rgba(41, 121, 255, 0.3) !important;
        }

        /* Mobile-only styles - does not affect desktop */
        @media (max-width: 639px) {
          .auth-card-wrapper { max-width: calc(100% - 48px) !important; margin: 0 24px !important; }
          .auth-form-container { padding: 28px 20px !important; }
          .auth-input { width: 100% !important; max-width: 260px !important; box-sizing: border-box !important; }
          .auth-button { width: 70% !important; max-width: 200px !important; }
          .auth-logo { margin-bottom: 24px !important; }
          .auth-logo-icon { width: 28px !important; height: 28px !important; }
          .auth-logo-text { font-size: 26px !important; }
        }
      `}</style>

      <div className="auth-card-wrapper w-full" style={{ maxWidth: '400px' }}>
        {/* Logo with Icon */}
        <div className="auth-logo" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          marginBottom: '32px'
        }}>
          <Share2 className="auth-logo-icon" style={{
            color: '#50E3C2',
            width: '32px',
            height: '32px'
          }} />
          <h1 className="auth-logo-text" style={{
            color: '#50E3C2',
            fontSize: '32px',
            fontWeight: 700,
            margin: 0
          }}>
            SocialAI
          </h1>
        </div>

        {/* Form Container with Brand Glow */}
        <div
          className="auth-form-container"
          style={{
            background: 'rgba(26, 31, 54, 0.9)',
            border: '1px solid rgba(41, 121, 255, 0.2)',
            borderRadius: '16px',
            padding: '48px 40px',
            boxShadow: '0 0 40px rgba(80, 227, 194, 0.15), 0 0 80px rgba(41, 121, 255, 0.1)'
          }}
        >
          <form
            onSubmit={handleSubmit}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%'
            }}
          >
            {/* Email Input */}
            <input
              className="auth-input"
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              style={{
                width: '320px',
                height: '44px',
                padding: '12px 16px',
                border: '1px solid rgba(41, 121, 255, 0.3)',
                borderRadius: '8px',
                backgroundColor: 'rgba(26, 31, 54, 0.8)',
                color: '#F2F4F8',
                fontSize: '15px',
                outline: 'none',
                transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                marginBottom: '20px'
              }}
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={(e) => {
                e.target.style.borderColor = '#50E3C2'
                e.target.style.boxShadow = '0 0 0 3px rgba(80, 227, 194, 0.2)'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(41, 121, 255, 0.3)'
                e.target.style.boxShadow = 'none'
              }}
            />

            {/* Password Input */}
            <input
              className="auth-input"
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              style={{
                width: '320px',
                height: '44px',
                padding: '12px 16px',
                border: '1px solid rgba(41, 121, 255, 0.3)',
                borderRadius: '8px',
                backgroundColor: 'rgba(26, 31, 54, 0.8)',
                color: '#F2F4F8',
                fontSize: '15px',
                outline: 'none',
                transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                marginBottom: '32px'
              }}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={(e) => {
                e.target.style.borderColor = '#50E3C2'
                e.target.style.boxShadow = '0 0 0 3px rgba(80, 227, 194, 0.2)'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(41, 121, 255, 0.3)'
                e.target.style.boxShadow = 'none'
              }}
            />

            {/* Sign In Button */}
            <button
              className="auth-button"
              type="submit"
              disabled={loading}
              style={{
                display: 'block',
                margin: '0 auto 32px',
                maxWidth: '240px',
                width: '60%',
                padding: '12px 24px',
                height: '44px',
                background: loading ? 'rgba(41, 121, 255, 0.5)' : '#2979FF',
                color: '#FFFFFF',
                fontSize: '16px',
                fontWeight: 600,
                border: 'none',
                borderRadius: '8px',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.5 : 1,
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.background = '#50E3C2'
                  e.currentTarget.style.color = '#1A1F36'
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#2979FF'
                e.currentTarget.style.color = '#FFFFFF'
              }}
              onMouseDown={(e) => {
                if (!loading) e.currentTarget.style.transform = 'scale(0.98)'
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = 'scale(1)'
              }}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

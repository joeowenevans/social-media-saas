import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { Share2, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
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
      style={{ background: 'linear-gradient(180deg, #111111 0%, #0a0a0a 100%)' }}
    >
      <style>{`
        /* Fix autofill white background */
        input {
          background-color: #0d0d0d !important;
          background-image: none !important;
        }

        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus,
        input:-webkit-autofill:active {
          -webkit-background-clip: text;
          -webkit-text-fill-color: #e5e5e5 !important;
          transition: background-color 5000s ease-in-out 0s;
          box-shadow: inset 0 0 20px 20px #0d0d0d !important;
          border: 1px solid #27272a !important;
        }
      `}</style>

      <div className="w-full" style={{ maxWidth: '400px' }}>
        {/* Logo with Icon */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          marginBottom: '32px'
        }}>
          <Share2 style={{
            color: 'white',
            width: '32px',
            height: '32px'
          }} />
          <h1 style={{
            color: '#14b8a6',
            fontSize: '32px',
            fontWeight: 700,
            margin: 0
          }}>
            SocialAI
          </h1>
        </div>

        {/* Form Container with Teal Glow */}
        <div
          style={{
            background: '#1a1a1a',
            border: '1px solid #27272a',
            borderRadius: '16px',
            padding: '48px 40px',
            boxShadow: '0 0 40px rgba(20, 184, 166, 0.15), 0 0 80px rgba(20, 184, 166, 0.08)'
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
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              style={{
                width: '320px',
                height: '44px',
                padding: '12px 16px',
                border: '1px solid #27272a',
                borderRadius: '8px',
                backgroundColor: '#0d0d0d',
                color: '#e5e5e5',
                fontSize: '15px',
                outline: 'none',
                transition: 'border-color 0.2s ease',
                marginBottom: '20px'
              }}
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={(e) => e.target.style.borderColor = '#14b8a6'}
              onBlur={(e) => e.target.style.borderColor = '#27272a'}
            />

            {/* Password Input */}
            <div style={{ position: 'relative', width: '320px', marginBottom: '32px' }}>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                style={{
                  width: '320px',
                  height: '44px',
                  padding: '12px 40px 12px 16px',
                  border: '1px solid #27272a',
                  borderRadius: '8px',
                  backgroundColor: '#0d0d0d',
                  color: '#e5e5e5',
                  fontSize: '15px',
                  outline: 'none',
                  transition: 'border-color 0.2s ease'
                }}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={(e) => e.target.style.borderColor = '#14b8a6'}
                onBlur={(e) => e.target.style.borderColor = '#27272a'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#9ca3af',
                  transition: 'color 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#14b8a6'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
              >
                {showPassword ? (
                  <EyeOff style={{ width: '20px', height: '20px' }} />
                ) : (
                  <Eye style={{ width: '20px', height: '20px' }} />
                )}
              </button>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                display: 'block',
                margin: '0 auto 32px',
                maxWidth: '240px',
                width: '60%',
                padding: '12px 20px',
                height: '44px',
                background: loading ? '#2a2a2a' : '#2a2a2a',
                color: 'white',
                fontSize: '16px',
                fontWeight: 600,
                border: 'none',
                borderRadius: '20px',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1,
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.background = '#14b8a6'
                  e.currentTarget.style.transform = 'scale(1.05)'
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#2a2a2a'
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

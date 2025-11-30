import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { Link, useNavigate } from 'react-router-dom'
import { Share2 } from 'lucide-react'
import toast from 'react-hot-toast'

export function SignupForm() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    const { error } = await signUp(email, password, firstName, lastName)

    if (error) {
      toast.error(error.message)
      setLoading(false)
    } else {
      toast.success('Account created successfully! Welcome to SocialAI')
      navigate('/dashboard')
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        backgroundColor: '#0a0a0a',
        backgroundImage: 'radial-gradient(circle, rgba(75, 85, 99, 0.35) 1px, transparent 1px)',
        backgroundSize: '24px 24px'
      }}
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

        /* Mobile-only styles - does not affect desktop */
        @media (max-width: 639px) {
          .auth-form-container { padding: 32px 24px !important; }
          .auth-input { width: 100% !important; box-sizing: border-box !important; }
          .auth-button { width: 80% !important; max-width: none !important; }
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
          className="auth-form-container"
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
            {/* First Name Input */}
            <input
              className="auth-input"
              id="first-name"
              name="firstName"
              type="text"
              autoComplete="given-name"
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
              placeholder="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              onFocus={(e) => e.target.style.borderColor = '#14b8a6'}
              onBlur={(e) => e.target.style.borderColor = '#27272a'}
            />

            {/* Last Name Input */}
            <input
              className="auth-input"
              id="last-name"
              name="lastName"
              type="text"
              autoComplete="family-name"
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
              placeholder="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              onFocus={(e) => e.target.style.borderColor = '#14b8a6'}
              onBlur={(e) => e.target.style.borderColor = '#27272a'}
            />

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
            <input
              className="auth-input"
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
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
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={(e) => e.target.style.borderColor = '#14b8a6'}
              onBlur={(e) => e.target.style.borderColor = '#27272a'}
            />

            {/* Confirm Password Input */}
            <input
              className="auth-input"
              id="confirm-password"
              name="confirm-password"
              type="password"
              autoComplete="new-password"
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
                marginBottom: '32px'
              }}
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onFocus={(e) => e.target.style.borderColor = '#14b8a6'}
              onBlur={(e) => e.target.style.borderColor = '#27272a'}
            />

            {/* Sign Up Button */}
            <button
              className="auth-button"
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
              {loading ? 'Creating account...' : 'Sign up'}
            </button>

            {/* Sign In Link - Centered */}
            <div style={{ textAlign: 'center' }}>
              <span style={{ color: '#888', fontSize: '14px' }}>
                Already have an account?{' '}
              </span>
              <Link
                to="/login"
                style={{
                  color: '#14b8a6',
                  fontSize: '14px',
                  fontWeight: 500,
                  textDecoration: 'none',
                  transition: 'opacity 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              >
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

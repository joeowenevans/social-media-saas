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

  const inputStyle = {
    width: '100%',
    height: '44px',
    padding: '12px 16px',
    border: '1px solid rgba(80, 227, 194, 0.3)',
    borderRadius: '8px',
    backgroundColor: 'rgba(26, 31, 54, 0.8)',
    color: '#F2F4F8',
    fontSize: '15px',
    outline: 'none',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    marginBottom: '20px',
    boxSizing: 'border-box' as const
  }

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = '#50E3C2'
    e.target.style.boxShadow = '0 0 0 3px rgba(80, 227, 194, 0.2)'
  }

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = 'rgba(80, 227, 194, 0.3)'
    e.target.style.boxShadow = 'none'
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        backgroundColor: '#1A1F36',
        backgroundImage: 'radial-gradient(circle, rgba(80, 227, 194, 0.08) 1px, transparent 1px)',
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
          border: 1px solid rgba(80, 227, 194, 0.3) !important;
        }

        /* Mobile-only styles - does not affect desktop */
        @media (max-width: 639px) {
          .auth-form-container { padding: 32px 24px !important; }
          .auth-input { width: 100% !important; box-sizing: border-box !important; }
          .auth-button { width: 100% !important; max-width: none !important; }
        }

        .auth-link:hover { text-decoration: underline !important; }
      `}</style>

      <div className="w-full" style={{ maxWidth: '420px' }}>
        {/* Logo with Icon and Tagline */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: '32px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '8px'
          }}>
            <Share2 style={{
              color: '#50E3C2',
              width: '32px',
              height: '32px'
            }} />
            <h1 style={{
              color: '#50E3C2',
              fontSize: '32px',
              fontWeight: 700,
              margin: 0
            }}>
              SocialAI
            </h1>
          </div>
          <p style={{
            color: '#50E3C2',
            fontSize: '13px',
            fontWeight: 400,
            margin: 0,
            opacity: 0.8
          }}>
            Impossible tech at unthinkable speed
          </p>
        </div>

        {/* Form Container with Brand Glow */}
        <div
          className="auth-form-container"
          style={{
            background: 'rgba(26, 31, 54, 0.9)',
            border: '1px solid rgba(80, 227, 194, 0.2)',
            borderRadius: '16px',
            padding: '40px',
            boxShadow: '0 0 40px rgba(80, 227, 194, 0.15), 0 0 80px rgba(80, 227, 194, 0.1)'
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
              style={inputStyle}
              placeholder="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
            />

            {/* Last Name Input */}
            <input
              className="auth-input"
              id="last-name"
              name="lastName"
              type="text"
              autoComplete="family-name"
              required
              style={inputStyle}
              placeholder="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
            />

            {/* Email Input */}
            <input
              className="auth-input"
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              style={inputStyle}
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
            />

            {/* Password Input */}
            <input
              className="auth-input"
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              style={inputStyle}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
            />

            {/* Confirm Password Input */}
            <input
              className="auth-input"
              id="confirm-password"
              name="confirm-password"
              type="password"
              autoComplete="new-password"
              required
              style={{ ...inputStyle, marginBottom: '32px' }}
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
            />

            {/* Sign Up Button */}
            <button
              className="auth-button"
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
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
                transition: 'all 0.2s ease',
                marginBottom: '24px'
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
              {loading ? 'Creating account...' : 'Sign up'}
            </button>

            {/* Divider */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              marginBottom: '24px'
            }}>
              <div style={{
                flex: 1,
                height: '1px',
                background: 'rgba(80, 227, 194, 0.2)'
              }} />
              <span style={{
                padding: '0 16px',
                color: 'rgba(242, 244, 248, 0.5)',
                fontSize: '13px'
              }}>
                or
              </span>
              <div style={{
                flex: 1,
                height: '1px',
                background: 'rgba(80, 227, 194, 0.2)'
              }} />
            </div>

            {/* Sign In Link - Centered */}
            <div style={{ textAlign: 'center' }}>
              <span style={{ color: 'rgba(242, 244, 248, 0.6)', fontSize: '14px' }}>
                Already have an account?{' '}
              </span>
              <Link
                to="/login"
                className="auth-link"
                style={{
                  color: '#50E3C2',
                  fontSize: '14px',
                  fontWeight: 500,
                  textDecoration: 'none',
                  transition: 'color 0.2s ease'
                }}
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

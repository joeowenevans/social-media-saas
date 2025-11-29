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
    padding: '12px 16px',
    border: '1px solid #27272a',
    borderRadius: '8px',
    backgroundColor: '#0d0d0d',
    color: '#e5e5e5',
    fontSize: '15px',
    outline: 'none',
    transition: 'border-color 0.2s ease'
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-8"
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

      <div className="w-full max-w-[400px]">
        {/* Logo with Icon */}
        <div className="flex items-center justify-center gap-3 mb-6 sm:mb-8">
          <Share2 className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
          <h1 className="text-2xl sm:text-3xl font-bold text-teal-400 m-0">
            SocialAI
          </h1>
        </div>

        {/* Form Container with Teal Glow */}
        <div
          className="p-5 sm:p-10"
          style={{
            background: '#1a1a1a',
            border: '1px solid #27272a',
            borderRadius: '16px',
            boxShadow: '0 0 40px rgba(20, 184, 166, 0.15), 0 0 80px rgba(20, 184, 166, 0.08)'
          }}
        >
          <form
            onSubmit={handleSubmit}
            className="flex flex-col w-full"
          >
            {/* Name inputs row on larger screens */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-3 sm:mb-4">
              {/* First Name Input */}
              <input
                id="first-name"
                name="firstName"
                type="text"
                autoComplete="given-name"
                required
                className="w-full h-11 sm:h-12"
                style={inputStyle}
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                onFocus={(e) => e.target.style.borderColor = '#14b8a6'}
                onBlur={(e) => e.target.style.borderColor = '#27272a'}
              />

              {/* Last Name Input */}
              <input
                id="last-name"
                name="lastName"
                type="text"
                autoComplete="family-name"
                required
                className="w-full h-11 sm:h-12"
                style={inputStyle}
                placeholder="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                onFocus={(e) => e.target.style.borderColor = '#14b8a6'}
                onBlur={(e) => e.target.style.borderColor = '#27272a'}
              />
            </div>

            {/* Email Input */}
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="w-full h-11 sm:h-12 mb-3 sm:mb-4"
              style={inputStyle}
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={(e) => e.target.style.borderColor = '#14b8a6'}
              onBlur={(e) => e.target.style.borderColor = '#27272a'}
            />

            {/* Password Input */}
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              className="w-full h-11 sm:h-12 mb-3 sm:mb-4"
              style={inputStyle}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={(e) => e.target.style.borderColor = '#14b8a6'}
              onBlur={(e) => e.target.style.borderColor = '#27272a'}
            />

            {/* Confirm Password Input */}
            <input
              id="confirm-password"
              name="confirm-password"
              type="password"
              autoComplete="new-password"
              required
              className="w-full h-11 sm:h-12 mb-5 sm:mb-8"
              style={inputStyle}
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onFocus={(e) => e.target.style.borderColor = '#14b8a6'}
              onBlur={(e) => e.target.style.borderColor = '#27272a'}
            />

            {/* Sign Up Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto sm:mx-auto sm:px-16 h-11 sm:h-12 mb-5"
              style={{
                background: loading ? '#2a2a2a' : '#2a2a2a',
                color: 'white',
                fontSize: '16px',
                fontWeight: 600,
                border: 'none',
                borderRadius: '24px',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1,
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.background = '#14b8a6'
                  e.currentTarget.style.transform = 'scale(1.02)'
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
            <div className="text-center">
              <span className="text-gray-500 text-sm">
                Already have an account?{' '}
              </span>
              <Link
                to="/login"
                className="text-teal-400 text-sm font-medium hover:opacity-80 transition-opacity"
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

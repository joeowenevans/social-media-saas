import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { Link, useNavigate } from 'react-router-dom'
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
    <div className="min-h-screen flex items-center justify-center bg-[#0d0d0d] px-4">
      <div className="w-full" style={{ maxWidth: '400px' }}>
        {/* Logo */}
        <h1 className="text-[32px] font-bold text-white text-center mb-12">
          SocialAI
        </h1>

        {/* Form Container */}
        <div className="bg-[#1a1a1a] border border-[#27272a] rounded-2xl px-8 py-12">
          <form onSubmit={handleSubmit}>
            {/* Email Input */}
            <div className="mb-4">
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full h-11 px-4 py-3 border border-[#27272a] rounded-lg bg-[#0d0d0d] text-white placeholder:text-[#71717a] focus:outline-none focus:border-[#14b8a6] transition-colors"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password Input */}
            <div className="mb-6">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="w-full h-11 px-4 py-3 border border-[#27272a] rounded-lg bg-[#0d0d0d] text-white placeholder:text-[#71717a] focus:outline-none focus:border-[#14b8a6] transition-colors"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-3/5 h-11 mx-auto block bg-[#27272a] hover:bg-[#14b8a6] hover:scale-[1.02] text-white font-semibold rounded-full focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-200"
              style={{ maxWidth: '240px' }}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>

            {/* Sign Up Link */}
            <div className="text-center mt-6">
              <Link
                to="/signup"
                className="text-[#14b8a6] hover:underline text-sm transition-all"
              >
                Sign up
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

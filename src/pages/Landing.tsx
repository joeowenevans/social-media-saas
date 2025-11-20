import { Link } from 'react-router-dom'
import { Sparkles, Calendar, Wand2, TrendingUp } from 'lucide-react'

export function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-8 h-8 text-indigo-600" />
            <span className="text-2xl font-bold text-gray-900">SocialAI</span>
          </div>
          <div className="space-x-4">
            <Link
              to="/login"
              className="px-4 py-2 text-gray-700 hover:text-gray-900"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6">
          AI-Powered Social Media
          <span className="block text-indigo-600">Made Simple</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Upload your content, let AI craft perfect captions, and schedule posts
          across all platforms. Your social media manager, powered by AI.
        </p>
        <Link
          to="/signup"
          className="inline-block px-8 py-4 bg-indigo-600 text-white text-lg font-semibold rounded-lg hover:bg-indigo-700 transition"
        >
          Start Free Trial
        </Link>
        <p className="mt-4 text-gray-500">10 posts free. No credit card required.</p>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <Wand2 className="w-12 h-12 text-indigo-600 mb-4" />
            <h3 className="text-xl font-bold mb-2">AI Caption Generation</h3>
            <p className="text-gray-600">
              GPT-4 Vision analyzes your content and creates engaging captions
              tailored to your brand voice.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <Calendar className="w-12 h-12 text-indigo-600 mb-4" />
            <h3 className="text-xl font-bold mb-2">Smart Scheduling</h3>
            <p className="text-gray-600">
              Schedule posts across Instagram, Facebook, and Pinterest with our
              intuitive calendar.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <TrendingUp className="w-12 h-12 text-indigo-600 mb-4" />
            <h3 className="text-xl font-bold mb-2">Multi-Platform</h3>
            <p className="text-gray-600">
              Post to all your social accounts simultaneously with one click.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <Sparkles className="w-12 h-12 text-indigo-600 mb-4" />
            <h3 className="text-xl font-bold mb-2">Brand Voice</h3>
            <p className="text-gray-600">
              Customize your brand voice and preferences for consistent,
              on-brand content.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-12">
          Simple, Transparent Pricing
        </h2>
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8 border-2 border-indigo-600">
          <h3 className="text-2xl font-bold mb-2">Pro Plan</h3>
          <div className="mb-6">
            <span className="text-5xl font-extrabold">$29</span>
            <span className="text-gray-600">/month</span>
          </div>
          <ul className="space-y-3 mb-8">
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Unlimited posts
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              AI caption generation
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Multi-platform scheduling
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Brand voice customization
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Priority support
            </li>
          </ul>
          <Link
            to="/signup"
            className="block w-full py-3 bg-indigo-600 text-white text-center font-semibold rounded-lg hover:bg-indigo-700 transition"
          >
            Start Free Trial
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-gray-600">
        <p>&copy; 2024 SocialAI. All rights reserved.</p>
      </footer>
    </div>
  )
}

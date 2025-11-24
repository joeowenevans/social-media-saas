import { Link } from 'react-router-dom'
import { Sparkles, Calendar, Wand2, TrendingUp, CheckCircle2, Zap } from 'lucide-react'

export function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg z-50 border-b border-gray-200 dark:border-gray-800">
        <nav className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">SocialAI</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="px-6 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-full hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg hover:shadow-xl hover:scale-105 font-medium"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 md:py-32 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary-100 to-amber-100 dark:from-primary-900/30 dark:to-amber-900/30 text-primary-700 dark:text-primary-400 font-medium text-sm mb-8">
          <Zap className="w-4 h-4" />
          <span>Powered by GPT-4 Vision AI</span>
        </div>

        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
          AI-Powered Social Media
          <span className="block bg-gradient-to-r from-primary-600 to-amber-500 bg-clip-text text-transparent">Made Simple</span>
        </h1>

        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-10 max-w-3xl mx-auto leading-relaxed">
          Upload your content, let AI craft perfect captions, and schedule posts
          across all platforms. Your social media manager, powered by AI.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/signup"
            className="group relative overflow-hidden px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white text-lg font-semibold rounded-full hover:from-primary-600 hover:to-primary-700 transition-all shadow-2xl hover:shadow-3xl hover:scale-105"
          >
            <span className="relative z-10">Start Free Trial</span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          </Link>
          <Link
            to="/login"
            className="px-8 py-4 border-2 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-lg font-semibold rounded-full hover:border-primary-500 dark:hover:border-primary-500 hover:text-primary-600 dark:hover:text-primary-400 transition-all"
          >
            View Demo
          </Link>
        </div>

        <p className="mt-6 text-gray-500 dark:text-gray-400 flex items-center justify-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          <span>10 posts free • No credit card required</span>
        </p>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Everything you need to succeed
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Powerful features designed to streamline your social media workflow
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="group bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-2 border border-gray-100 dark:border-gray-700">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg mb-6 group-hover:scale-110 transition-transform">
              <Wand2 className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">AI Caption Generation</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              GPT-4 Vision analyzes your content and creates engaging captions
              tailored to your brand voice.
            </p>
          </div>

          <div className="group bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-2 border border-gray-100 dark:border-gray-700">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-blue-600 shadow-lg mb-6 group-hover:scale-110 transition-transform">
              <Calendar className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Smart Scheduling</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Schedule posts across Instagram, Facebook, and Pinterest with our
              intuitive calendar.
            </p>
          </div>

          <div className="group bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-2 border border-gray-100 dark:border-gray-700">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg mb-6 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Multi-Platform</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Post to all your social accounts simultaneously with one click.
            </p>
          </div>

          <div className="group bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-2 border border-gray-100 dark:border-gray-700">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg mb-6 group-hover:scale-110 transition-transform">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Brand Voice</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Customize your brand voice and preferences for consistent,
              on-brand content.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Start free, upgrade when you're ready
          </p>
        </div>

        <div className="max-w-lg mx-auto">
          <div className="relative bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl shadow-2xl p-8 md:p-10 border-2 border-primary-500">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <span className="inline-block px-6 py-2 bg-gradient-to-r from-primary-500 to-amber-500 text-white text-sm font-bold rounded-full shadow-lg">
                MOST POPULAR
              </span>
            </div>

            <h3 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">Pro Plan</h3>
            <div className="mb-8">
              <span className="text-6xl font-extrabold bg-gradient-to-r from-primary-600 to-amber-500 bg-clip-text text-transparent">$29</span>
              <span className="text-gray-600 dark:text-gray-400 text-xl ml-2">/month</span>
            </div>

            <ul className="space-y-4 mb-10">
              <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                <span className="font-medium">Unlimited posts</span>
              </li>
              <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                <span className="font-medium">AI caption generation</span>
              </li>
              <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                <span className="font-medium">Multi-platform scheduling</span>
              </li>
              <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                <span className="font-medium">Brand voice customization</span>
              </li>
              <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                <span className="font-medium">Priority support</span>
              </li>
            </ul>

            <Link
              to="/signup"
              className="block w-full py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white text-center text-lg font-semibold rounded-full hover:from-primary-600 hover:to-primary-700 transition-all shadow-xl hover:shadow-2xl hover:scale-105"
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-12 border-t border-gray-200 dark:border-gray-800">
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-primary-600">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">SocialAI</span>
          </div>
          <p className="text-gray-600 dark:text-gray-400">&copy; 2024 SocialAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

import { Link } from 'react-router-dom'
import { Share2, Calendar, Wand2, TrendingUp, CheckCircle2, Sparkles } from 'lucide-react'

export function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-charcoal-50 via-gray-50 to-charcoal-100 dark:from-charcoal-950 dark:via-charcoal-900 dark:to-charcoal-950">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 sticky top-0 backdrop-filter backdrop-blur-xl bg-white/70 dark:bg-charcoal-900/70 z-50 border-b border-gray-200/50 dark:border-charcoal-700/50">
        <nav className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg">
              <Share2 className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-charcoal-900 dark:text-white tracking-tight">SocialAI</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="px-4 py-2 text-charcoal-700 dark:text-charcoal-300 hover:text-charcoal-900 dark:hover:text-white font-medium transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="px-6 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] font-medium"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 md:py-32 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 font-medium text-sm mb-8 border border-primary-200 dark:border-primary-800">
          <Sparkles className="w-4 h-4" />
          <span>Powered by GPT-4 Vision AI</span>
        </div>

        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-charcoal-900 dark:text-white mb-6 leading-tight">
          AI-Powered Social Media
          <span className="block bg-gradient-to-r from-primary-500 to-cyan-500 bg-clip-text text-transparent">Made Simple</span>
        </h1>

        <p className="text-xl md:text-2xl text-charcoal-600 dark:text-charcoal-400 mb-10 max-w-3xl mx-auto leading-relaxed">
          Upload your content, let AI craft perfect captions, and schedule posts
          across all platforms. Your social media manager, powered by AI.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/signup"
            className="group relative overflow-hidden px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white text-lg font-semibold rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all shadow-2xl hover:shadow-3xl hover:scale-[1.02]"
          >
            <span className="relative z-10">Start Free Trial</span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          </Link>
          <Link
            to="/login"
            className="px-8 py-4 border-2 border-charcoal-300 dark:border-charcoal-700 text-charcoal-700 dark:text-charcoal-300 text-lg font-semibold rounded-xl hover:border-primary-500 dark:hover:border-primary-500 hover:text-primary-600 dark:hover:text-primary-400 transition-all"
          >
            View Demo
          </Link>
        </div>

        <p className="mt-6 text-charcoal-500 dark:text-charcoal-400 flex items-center justify-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-primary-500" />
          <span>10 posts free • No credit card required</span>
        </p>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-charcoal-900 dark:text-white mb-4">
            Everything you need to succeed
          </h2>
          <p className="text-xl text-charcoal-600 dark:text-charcoal-400 max-w-2xl mx-auto">
            Powerful features designed to streamline your social media workflow
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="group bg-white dark:bg-charcoal-800 p-8 rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-2 border border-gray-100 dark:border-charcoal-700">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg mb-6 group-hover:scale-110 transition-transform">
              <Wand2 className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-charcoal-900 dark:text-white">AI Caption Generation</h3>
            <p className="text-charcoal-600 dark:text-charcoal-400 leading-relaxed">
              GPT-4 Vision analyzes your content and creates engaging captions
              tailored to your brand voice.
            </p>
          </div>

          <div className="group bg-white dark:bg-charcoal-800 p-8 rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-2 border border-gray-100 dark:border-charcoal-700">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg mb-6 group-hover:scale-110 transition-transform">
              <Calendar className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-charcoal-900 dark:text-white">Smart Scheduling</h3>
            <p className="text-charcoal-600 dark:text-charcoal-400 leading-relaxed">
              Schedule posts across Instagram, Facebook, and Pinterest with our
              intuitive calendar.
            </p>
          </div>

          <div className="group bg-white dark:bg-charcoal-800 p-8 rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-2 border border-gray-100 dark:border-charcoal-700">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg mb-6 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-charcoal-900 dark:text-white">Multi-Platform</h3>
            <p className="text-charcoal-600 dark:text-charcoal-400 leading-relaxed">
              Post to all your social accounts simultaneously with one click.
            </p>
          </div>

          <div className="group bg-white dark:bg-charcoal-800 p-8 rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-2 border border-gray-100 dark:border-charcoal-700">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg mb-6 group-hover:scale-110 transition-transform">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-charcoal-900 dark:text-white">Brand Voice</h3>
            <p className="text-charcoal-600 dark:text-charcoal-400 leading-relaxed">
              Customize your brand voice and preferences for consistent,
              on-brand content.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-charcoal-900 dark:text-white mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-charcoal-600 dark:text-charcoal-400">
            Start free, upgrade when you're ready
          </p>
        </div>

        <div className="max-w-lg mx-auto">
          <div className="relative bg-gradient-to-br from-white to-primary-50/30 dark:from-charcoal-800 dark:to-charcoal-900 rounded-3xl shadow-2xl p-8 md:p-10 border-2 border-primary-500">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <span className="inline-block px-6 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white text-sm font-bold rounded-full shadow-lg">
                MOST POPULAR
              </span>
            </div>

            <h3 className="text-3xl font-bold mb-2 text-charcoal-900 dark:text-white">Pro Plan</h3>
            <div className="mb-8">
              <span className="text-6xl font-extrabold bg-gradient-to-r from-primary-500 to-cyan-500 bg-clip-text text-transparent">$29</span>
              <span className="text-charcoal-600 dark:text-charcoal-400 text-xl ml-2">/month</span>
            </div>

            <ul className="space-y-4 mb-10">
              <li className="flex items-center gap-3 text-charcoal-700 dark:text-charcoal-300">
                <CheckCircle2 className="w-6 h-6 text-primary-500 shrink-0" />
                <span className="font-medium">Unlimited posts</span>
              </li>
              <li className="flex items-center gap-3 text-charcoal-700 dark:text-charcoal-300">
                <CheckCircle2 className="w-6 h-6 text-primary-500 shrink-0" />
                <span className="font-medium">AI caption generation</span>
              </li>
              <li className="flex items-center gap-3 text-charcoal-700 dark:text-charcoal-300">
                <CheckCircle2 className="w-6 h-6 text-primary-500 shrink-0" />
                <span className="font-medium">Multi-platform scheduling</span>
              </li>
              <li className="flex items-center gap-3 text-charcoal-700 dark:text-charcoal-300">
                <CheckCircle2 className="w-6 h-6 text-primary-500 shrink-0" />
                <span className="font-medium">Brand voice customization</span>
              </li>
              <li className="flex items-center gap-3 text-charcoal-700 dark:text-charcoal-300">
                <CheckCircle2 className="w-6 h-6 text-primary-500 shrink-0" />
                <span className="font-medium">Priority support</span>
              </li>
            </ul>

            <Link
              to="/signup"
              className="block w-full py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white text-center text-lg font-semibold rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all shadow-xl hover:shadow-2xl hover:scale-[1.02]"
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-12 border-t border-charcoal-200 dark:border-charcoal-800">
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-primary-600">
              <Share2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-charcoal-900 dark:text-white tracking-tight">SocialAI</span>
          </div>
          <p className="text-charcoal-600 dark:text-charcoal-400">&copy; 2024 SocialAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

import { Link } from 'react-router-dom'
import { Share2, Calendar, Wand2, TrendingUp, CheckCircle2, Sparkles, Twitter, Facebook, Instagram, Linkedin } from 'lucide-react'

export function Landing() {
  return (
    <div className="min-h-screen bg-[#0d0d0d]">
      {/* Header - Dark Full Width */}
      <header className="sticky top-0 z-50 bg-[#0d0d0d] border-b border-[#27272a]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo - Static, Non-Clickable */}
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-primary-600">
                <Share2 className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-semibold tracking-tight text-white">SocialAI</span>
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="px-4 py-2 text-[#a1a1aa] hover:text-white font-medium transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="px-6 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors font-medium"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 md:py-32 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/20 text-primary-400 border border-primary-500/30 font-medium text-sm mb-8">
          <Sparkles className="w-4 h-4" />
          <span>Powered by GPT-4 Vision AI</span>
        </div>

        <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold text-white mb-6 leading-tight">
          AI-Powered Social Media
          <span className="block bg-gradient-to-r from-primary-400 to-cyan-400 bg-clip-text text-transparent">Made Simple</span>
        </h1>

        <p className="text-xl md:text-2xl text-[#a1a1aa] mb-10 max-w-3xl mx-auto leading-relaxed">
          Upload your content, let AI craft perfect captions, and schedule posts
          across all platforms. Your social media manager, powered by AI.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/signup"
            className="px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white text-lg font-medium rounded-lg transition-colors"
          >
            Start Free Trial
          </Link>
          <Link
            to="/login"
            className="px-8 py-4 border border-[#27272a] bg-[#1a1a1a] hover:bg-[#222] text-white text-lg font-medium rounded-lg transition-colors"
          >
            View Demo
          </Link>
        </div>

        <p className="mt-6 text-[#a1a1aa] flex items-center justify-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-primary-400" />
          <span>10 posts free • No credit card required</span>
        </p>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-semibold text-white mb-4">
            Everything you need to succeed
          </h2>
          <p className="text-xl text-[#a1a1aa] max-w-2xl mx-auto">
            Powerful features designed to streamline your social media workflow
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-[#1a1a1a] border border-[#27272a] p-8 rounded-xl hover:border-[#3a3a3a] transition-all duration-200">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 mb-6">
              <Wand2 className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-white">AI Caption Generation</h3>
            <p className="text-[#a1a1aa] leading-relaxed">
              GPT-4 Vision analyzes your content and creates engaging captions
              tailored to your brand voice.
            </p>
          </div>

          <div className="bg-[#1a1a1a] border border-[#27272a] p-8 rounded-xl hover:border-[#3a3a3a] transition-all duration-200">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 mb-6">
              <Calendar className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-white">Smart Scheduling</h3>
            <p className="text-[#a1a1aa] leading-relaxed">
              Schedule posts across Instagram, Facebook, and Pinterest with our
              intuitive calendar.
            </p>
          </div>

          <div className="bg-[#1a1a1a] border border-[#27272a] p-8 rounded-xl hover:border-[#3a3a3a] transition-all duration-200">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 mb-6">
              <TrendingUp className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-white">Multi-Platform</h3>
            <p className="text-[#a1a1aa] leading-relaxed">
              Post to all your social accounts simultaneously with one click.
            </p>
          </div>

          <div className="bg-[#1a1a1a] border border-[#27272a] p-8 rounded-xl hover:border-[#3a3a3a] transition-all duration-200">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 mb-6">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-white">Brand Voice</h3>
            <p className="text-[#a1a1aa] leading-relaxed">
              Customize your brand voice and preferences for consistent,
              on-brand content.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-semibold text-white mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-[#a1a1aa]">
            Start free, upgrade when you're ready
          </p>
        </div>

        <div className="max-w-lg mx-auto">
          <div className="relative bg-[#1a1a1a] border-2 border-primary-500 rounded-xl p-8 md:p-10">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <span className="inline-block px-6 py-2 bg-primary-500 text-white text-sm font-semibold rounded-full">
                MOST POPULAR
              </span>
            </div>

            <h3 className="text-3xl font-semibold mb-2 text-white">Pro Plan</h3>
            <div className="mb-8">
              <span className="text-6xl font-semibold bg-gradient-to-r from-primary-400 to-cyan-400 bg-clip-text text-transparent">$29</span>
              <span className="text-[#a1a1aa] text-xl ml-2">/month</span>
            </div>

            <ul className="space-y-4 mb-10">
              <li className="flex items-center gap-3 text-white">
                <CheckCircle2 className="w-6 h-6 text-primary-400 shrink-0" />
                <span className="font-medium">Unlimited posts</span>
              </li>
              <li className="flex items-center gap-3 text-white">
                <CheckCircle2 className="w-6 h-6 text-primary-400 shrink-0" />
                <span className="font-medium">AI caption generation</span>
              </li>
              <li className="flex items-center gap-3 text-white">
                <CheckCircle2 className="w-6 h-6 text-primary-400 shrink-0" />
                <span className="font-medium">Multi-platform scheduling</span>
              </li>
              <li className="flex items-center gap-3 text-white">
                <CheckCircle2 className="w-6 h-6 text-primary-400 shrink-0" />
                <span className="font-medium">Brand voice customization</span>
              </li>
              <li className="flex items-center gap-3 text-white">
                <CheckCircle2 className="w-6 h-6 text-primary-400 shrink-0" />
                <span className="font-medium">Priority support</span>
              </li>
            </ul>

            <Link
              to="/signup"
              className="block w-full py-4 bg-primary-500 hover:bg-primary-600 text-white text-center text-lg font-medium rounded-lg transition-colors"
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      </section>

      {/* Footer - Dark Matching Theme */}
      <footer className="bg-[#0d0d0d] border-t border-[#27272a] mt-auto">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Brand Section */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-primary-600">
                  <Share2 className="h-4 w-4 text-white" />
                </div>
                <span className="text-lg font-semibold tracking-tight text-white">SocialAI</span>
              </div>
              <p className="text-sm text-[#a1a1aa] leading-relaxed">
                AI-powered social media management made simple. Create, schedule, and optimize your content effortlessly.
              </p>
            </div>

            {/* Quick Links */}
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wide">Quick Links</h3>
              <div className="flex flex-col gap-2 text-sm">
                <a href="#" className="text-[#a1a1aa] hover:text-primary-400 transition-colors duration-200">Privacy Policy</a>
                <a href="#" className="text-[#a1a1aa] hover:text-primary-400 transition-colors duration-200">Terms of Service</a>
                <a href="#" className="text-[#a1a1aa] hover:text-primary-400 transition-colors duration-200">Contact</a>
                <a href="#" className="text-[#a1a1aa] hover:text-primary-400 transition-colors duration-200">Support</a>
              </div>
            </div>

            {/* Social Media */}
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wide">Follow Us</h3>
              <div className="flex gap-3">
                <a
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1a1a1a] text-[#a1a1aa] hover:bg-primary-500 hover:text-white transition-all duration-200 border border-[#27272a]"
                  aria-label="Twitter"
                >
                  <Twitter className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1a1a1a] text-[#a1a1aa] hover:bg-primary-500 hover:text-white transition-all duration-200 border border-[#27272a]"
                  aria-label="Facebook"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1a1a1a] text-[#a1a1aa] hover:bg-primary-500 hover:text-white transition-all duration-200 border border-[#27272a]"
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1a1a1a] text-[#a1a1aa] hover:bg-primary-500 hover:text-white transition-all duration-200 border border-[#27272a]"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-[#27272a]">
            <p className="text-center text-sm text-[#71717a]">
              &copy; {new Date().getFullYear()} SocialAI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

import { AppLayout } from '../components/layout/AppLayout'
import { CreditCard, Zap, CheckCircle2, Calendar, TrendingUp, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'

export function Billing() {
  return (
    <AppLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div className="page-header">
          <h1 className="page-title text-4xl">Billing & Subscription</h1>
          <p className="page-subtitle">Manage your subscription and billing information</p>
        </div>

        {/* Current Plan Card */}
        <div className="bg-[#1a1a1a] border border-primary-500 overflow-hidden rounded-xl">
          <div className="p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex items-start gap-6">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-semibold text-white">Free Plan</h2>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Active</span>
                  </div>
                  <p className="text-[#a1a1aa] mb-4">
                    You're currently on the free plan with 10 AI-generated posts
                  </p>
                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary-400" />
                      <span className="text-white">Started: Jan 1, 2024</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-primary-400" />
                      <span className="text-white">7 posts remaining</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="shrink-0">
                <button className="bg-primary-500 hover:bg-primary-600 text-white font-medium px-6 py-3 rounded-lg transition-colors">
                  Upgrade to Pro
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Available Plans */}
        <div>
          <h2 className="text-2xl font-semibold text-white mb-6">Available Plans</h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Free Plan */}
            <div className="bg-[#1a1a1a] p-8 rounded-xl">
              <div className="mb-6">
                <h3 className="text-2xl font-semibold text-white mb-2">Free Plan</h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-5xl font-semibold text-white">$0</span>
                  <span className="text-[#a1a1aa]">/month</span>
                </div>
                <p className="text-[#a1a1aa]">Perfect for trying out SocialAI</p>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-white">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>10 AI-generated posts</span>
                </li>
                <li className="flex items-center gap-3 text-white">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>Basic caption generation</span>
                </li>
                <li className="flex items-center gap-3 text-white">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>Single platform posting</span>
                </li>
                <li className="flex items-center gap-3 text-[#a1a1aa]">
                  <div className="w-5 h-5 rounded-full border-2 border-[#27272a] shrink-0"></div>
                  <span className="line-through">Multi-platform scheduling</span>
                </li>
                <li className="flex items-center gap-3 text-[#a1a1aa]">
                  <div className="w-5 h-5 rounded-full border-2 border-[#27272a] shrink-0"></div>
                  <span className="line-through">Priority support</span>
                </li>
              </ul>

              <button className="w-full bg-[#0d0d0d] text-[#a1a1aa] font-medium px-6 py-3 rounded-lg cursor-not-allowed" disabled>
                Current Plan
              </button>
            </div>

            {/* Pro Plan */}
            <div className="relative bg-[#1a1a1a] border-2 border-primary-500 p-8 rounded-xl">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="inline-block px-6 py-2 bg-primary-500 text-white text-sm font-semibold rounded-full">
                  RECOMMENDED
                </span>
              </div>

              <div className="mb-6">
                <h3 className="text-2xl font-semibold text-white mb-2">Pro Plan</h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-5xl font-semibold bg-gradient-to-r from-primary-400 to-cyan-400 bg-clip-text text-transparent">$29</span>
                  <span className="text-[#a1a1aa]">/month</span>
                </div>
                <p className="text-[#a1a1aa]">For serious social media managers</p>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-white font-medium">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>Unlimited AI-generated posts</span>
                </li>
                <li className="flex items-center gap-3 text-white font-medium">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>Advanced caption generation</span>
                </li>
                <li className="flex items-center gap-3 text-white font-medium">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>Multi-platform scheduling</span>
                </li>
                <li className="flex items-center gap-3 text-white font-medium">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>Brand voice customization</span>
                </li>
                <li className="flex items-center gap-3 text-white font-medium">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>Priority support</span>
                </li>
              </ul>

              <button className="w-full flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-medium px-6 py-3 rounded-lg transition-colors">
                <Sparkles className="w-5 h-5" />
                <span>Upgrade to Pro</span>
              </button>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-[#1a1a1a] rounded-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <CreditCard className="w-6 h-6 text-primary-400" />
            <h2 className="text-2xl font-semibold text-white">Payment Method</h2>
          </div>

          <div className="text-center py-12">
            <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-xl bg-[#0d0d0d] mb-4">
              <CreditCard className="w-8 h-8 text-[#a1a1aa]" />
            </div>
            <p className="text-[#a1a1aa] mb-4">
              No payment method on file
            </p>
            <p className="text-sm text-[#71717a] mb-6">
              Upgrade to Pro to add a payment method and unlock unlimited features
            </p>
            <Link to="/settings" className="inline-block bg-primary-500 hover:bg-primary-600 text-white font-medium px-6 py-3 rounded-lg transition-colors">
              Upgrade Now
            </Link>
          </div>
        </div>

        {/* Billing History */}
        <div className="bg-[#1a1a1a] rounded-xl p-8">
          <h2 className="text-2xl font-semibold text-white mb-6">Billing History</h2>

          <div className="text-center py-12">
            <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-xl bg-[#0d0d0d] mb-4">
              <Calendar className="w-8 h-8 text-[#a1a1aa]" />
            </div>
            <p className="text-[#a1a1aa]">
              No billing history yet
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

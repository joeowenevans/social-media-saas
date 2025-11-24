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
        <div className="card overflow-hidden bg-gradient-to-br from-primary-50 via-blue-50 to-amber-50 dark:from-primary-900/20 dark:via-blue-900/20 dark:to-amber-900/20 border-primary-200 dark:border-primary-800">
          <div className="p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex items-start gap-6">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Free Plan</h2>
                    <span className="badge badge-success">Active</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    You're currently on the free plan with 10 AI-generated posts
                  </p>
                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary-500" />
                      <span className="text-gray-700 dark:text-gray-300">Started: Jan 1, 2024</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-primary-500" />
                      <span className="text-gray-700 dark:text-gray-300">7 posts remaining</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="shrink-0">
                <button className="btn-primary px-6 py-3 shadow-lg">
                  Upgrade to Pro
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Available Plans */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Available Plans</h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Free Plan */}
            <div className="card p-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-2 border-gray-200 dark:border-gray-700">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Free Plan</h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-5xl font-extrabold text-gray-900 dark:text-white">$0</span>
                  <span className="text-gray-600 dark:text-gray-400">/month</span>
                </div>
                <p className="text-gray-600 dark:text-gray-400">Perfect for trying out SocialAI</p>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span>10 AI-generated posts</span>
                </li>
                <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span>Basic caption generation</span>
                </li>
                <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span>Single platform posting</span>
                </li>
                <li className="flex items-center gap-3 text-gray-500 dark:text-gray-500">
                  <div className="w-5 h-5 rounded-full border-2 border-gray-300 dark:border-gray-600 shrink-0"></div>
                  <span className="line-through">Multi-platform scheduling</span>
                </li>
                <li className="flex items-center gap-3 text-gray-500 dark:text-gray-500">
                  <div className="w-5 h-5 rounded-full border-2 border-gray-300 dark:border-gray-600 shrink-0"></div>
                  <span className="line-through">Priority support</span>
                </li>
              </ul>

              <button className="btn-neutral w-full" disabled>
                Current Plan
              </button>
            </div>

            {/* Pro Plan */}
            <div className="relative card p-8 bg-gradient-to-br from-primary-50 via-blue-50 to-amber-50 dark:from-primary-900/30 dark:via-blue-900/30 dark:to-amber-900/30 border-2 border-primary-500 shadow-2xl">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="inline-block px-6 py-2 bg-gradient-to-r from-primary-500 to-amber-500 text-white text-sm font-bold rounded-full shadow-lg">
                  RECOMMENDED
                </span>
              </div>

              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Pro Plan</h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-5xl font-extrabold bg-gradient-to-r from-primary-600 to-amber-500 bg-clip-text text-transparent">$29</span>
                  <span className="text-gray-600 dark:text-gray-400">/month</span>
                </div>
                <p className="text-gray-600 dark:text-gray-400">For serious social media managers</p>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span>Unlimited AI-generated posts</span>
                </li>
                <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span>Advanced caption generation</span>
                </li>
                <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span>Multi-platform scheduling</span>
                </li>
                <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span>Brand voice customization</span>
                </li>
                <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span>Priority support</span>
                </li>
              </ul>

              <button className="btn-primary w-full shadow-xl">
                <Sparkles className="w-5 h-5" />
                <span>Upgrade to Pro</span>
              </button>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="card p-8">
          <div className="flex items-center gap-3 mb-6">
            <CreditCard className="w-6 h-6 text-primary-500" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Payment Method</h2>
          </div>

          <div className="empty-state">
            <div className="empty-state-icon mx-auto">
              <CreditCard className="w-8 h-8" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              No payment method on file
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Upgrade to Pro to add a payment method and unlock unlimited features
            </p>
            <Link to="/settings" className="btn-primary">
              Upgrade Now
            </Link>
          </div>
        </div>

        {/* Billing History */}
        <div className="card p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Billing History</h2>

          <div className="empty-state">
            <div className="empty-state-icon mx-auto">
              <Calendar className="w-8 h-8" />
            </div>
            <p className="text-gray-500 dark:text-gray-400">
              No billing history yet
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

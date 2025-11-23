import { useAuth } from '../hooks/useAuth'
import { useBrand } from '../hooks/useBrand'
import { usePosts } from '../hooks/usePosts'
import { useNavigate } from 'react-router-dom'
import { Upload, Calendar, Settings as SettingsIcon, LogOut, Sparkles, Zap, TrendingUp, FileText, Clock, CheckCircle2 } from 'lucide-react'
import toast from 'react-hot-toast'

export function Dashboard() {
  const { user, signOut } = useAuth()
  const { brand, loading: brandLoading } = useBrand(user?.id)
  const { posts, loading: postsLoading } = usePosts(brand?.id)
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    toast.success('Signed out successfully')
    navigate('/')
  }

  if (brandLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-primary-50/30">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="text-gray-500 text-sm">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!brand) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-primary-50/30">
        <div className="max-w-md w-full card p-8 text-center animate-fade-in">
          <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 shadow-lg mb-6">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome!</h2>
          <p className="text-gray-600 mb-6">
            Let's set up your brand profile to get started with AI-powered social media management.
          </p>
          <button
            onClick={() => navigate('/settings')}
            className="btn-primary px-6 py-3 w-full"
          >
            Create Brand Profile
          </button>
        </div>
      </div>
    )
  }

  const scheduledPosts = posts.filter(p => p.status === 'scheduled')
  const postedPosts = posts.filter(p => p.status === 'posted')
  const draftPosts = posts.filter(p => p.status === 'draft')

  const stats = [
    { label: 'Total Posts', value: posts.length, icon: FileText, color: 'from-primary-500 to-primary-600' },
    { label: 'Scheduled', value: scheduledPosts.length, icon: Clock, color: 'from-blue-500 to-blue-600' },
    { label: 'Posted', value: postedPosts.length, icon: CheckCircle2, color: 'from-emerald-500 to-emerald-600' },
    { label: 'Drafts', value: draftPosts.length, icon: FileText, color: 'from-amber-500 to-amber-600' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50/30">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-200/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 shadow-lg shadow-primary-500/25">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold gradient-text">SocialAI</span>
                <p className="text-[10px] text-gray-400 font-medium tracking-wide uppercase">AI Automation</p>
              </div>
            </div>
            <nav className="flex items-center gap-2">
              {[
                { icon: Upload, label: 'Upload', path: '/upload' },
                { icon: Calendar, label: 'Schedule', path: '/schedule' },
                { icon: SettingsIcon, label: 'Settings', path: '/settings' },
              ].map((item) => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 transition-all duration-200"
                >
                  <item.icon className="w-5 h-5" />
                  <span className="hidden sm:inline">{item.label}</span>
                </button>
              ))}
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-600 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 animate-fade-in">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back{user?.email ? `, ${user.email.split('@')[0]}` : ''}!
          </h1>
          <p className="text-gray-500">Here's what's happening with <span className="font-medium text-gray-700">{brand.name}</span></p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="card p-6 card-hover">
              <div className="flex items-start justify-between mb-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${stat.color} shadow-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <TrendingUp className="h-4 w-4 text-emerald-500" />
              </div>
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="card p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <button
              onClick={() => navigate('/upload')}
              className="flex items-center justify-center gap-3 p-4 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/30 transition-all duration-200 hover:-translate-y-0.5"
            >
              <Upload className="w-5 h-5" />
              <span>Upload Content</span>
            </button>
            <button
              onClick={() => navigate('/schedule')}
              className="flex items-center justify-center gap-3 p-4 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-all duration-200"
            >
              <Calendar className="w-5 h-5" />
              <span>View Calendar</span>
            </button>
            <button
              onClick={() => navigate('/settings')}
              className="flex items-center justify-center gap-3 p-4 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-all duration-200"
            >
              <SettingsIcon className="w-5 h-5" />
              <span>Brand Settings</span>
            </button>
          </div>
        </div>

        {/* AI Suggestions Card */}
        <div className="card overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-accent-500/10 via-primary-500/10 to-accent-500/10 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-500 to-primary-500 shadow-xl">
                <Sparkles className="h-7 w-7 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">AI Content Suggestions</h3>
                <p className="text-gray-600 mt-1">Upload media to get AI-generated captions optimized for your brand voice and audience.</p>
              </div>
              <button
                onClick={() => navigate('/upload')}
                className="btn-primary px-5 py-2.5 shrink-0"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>

        {/* Recent Posts */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Posts</h2>
            <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              View all
            </button>
          </div>
          {postsLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-gray-100 mb-4">
                <FileText className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-500 mb-4">No posts yet. Start by uploading content!</p>
              <button
                onClick={() => navigate('/upload')}
                className="btn-primary px-6 py-2"
              >
                Upload Content
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {posts.slice(0, 6).map((post) => (
                <div key={post.id} className="group rounded-xl border border-gray-200 overflow-hidden hover:border-primary-300 hover:shadow-soft transition-all duration-200">
                  {post.media && (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={post.media.thumbnail_url || post.media.cloudinary_url}
                        alt="Post media"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                      {post.final_caption || post.generated_caption || 'No caption'}
                    </p>
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full ${
                        post.status === 'posted'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/50'
                          : post.status === 'scheduled'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200/50'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {post.status === 'posted' && <CheckCircle2 className="w-3 h-3" />}
                      {post.status === 'scheduled' && <Clock className="w-3 h-3" />}
                      {post.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

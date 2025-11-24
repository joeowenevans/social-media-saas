import { useBrand } from '../hooks/useBrand'
import { usePosts } from '../hooks/usePosts'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { AppLayout } from '../components/layout/AppLayout'
import { Upload, Calendar, Settings as SettingsIcon, FileText, Clock, CheckCircle2, TrendingUp, Sparkles } from 'lucide-react'

export function Dashboard() {
  const { user } = useAuth()
  const { brand, loading: brandLoading } = useBrand(user?.id)
  const { posts, loading: postsLoading } = usePosts(brand?.id)
  const navigate = useNavigate()

  if (brandLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 spinner"></div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!brand) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="max-w-md w-full card p-8 text-center animate-fade-in">
          <div className="empty-state-icon mx-auto bg-gradient-to-br from-primary-500 to-primary-600 mb-6">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-semibold mb-2">Welcome to SocialAI!</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Let's set up your brand profile to get started with AI-powered social media management.
          </p>
          <button onClick={() => navigate('/settings')} className="btn-primary w-full">
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
    { label: 'Total Posts', value: posts.length, icon: FileText, colorClass: 'from-primary-500 to-primary-600' },
    { label: 'Scheduled', value: scheduledPosts.length, icon: Clock, colorClass: 'from-blue-500 to-blue-600' },
    { label: 'Posted', value: postedPosts.length, icon: CheckCircle2, colorClass: 'from-emerald-500 to-emerald-600' },
    { label: 'Drafts', value: draftPosts.length, icon: FileText, colorClass: 'from-secondary-500 to-secondary-600' },
  ]

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="page-header">
          <h1 className="page-title">Welcome back{user?.email ? `, ${user.email.split('@')[0]}` : ''}!</h1>
          <p className="page-subtitle">Here's what's happening with <span className="font-semibold text-gray-900 dark:text-gray-100">{brand.name}</span></p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="card p-6 card-hover">
              <div className="flex items-start justify-between mb-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${stat.colorClass} shadow-md`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{stat.label}</p>
              <p className="text-3xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button onClick={() => navigate('/upload')} className="btn-primary py-4">
              <Upload className="w-5 h-5" />
              <span>Upload Content</span>
            </button>
            <button onClick={() => navigate('/schedule')} className="btn-neutral py-4">
              <Calendar className="w-5 h-5" />
              <span>View Calendar</span>
            </button>
            <button onClick={() => navigate('/settings')} className="btn-neutral py-4">
              <SettingsIcon className="w-5 h-5" />
              <span>Brand Settings</span>
            </button>
          </div>
        </div>

        <div className="card overflow-hidden">
          <div className="bg-gradient-to-r from-primary-50 via-purple-50 to-primary-50 dark:from-primary-900/20 dark:via-purple-900/20 dark:to-primary-900/20 p-6">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-1">AI-Powered Caption Generation</h3>
                <p className="text-gray-600 dark:text-gray-400">Upload your media and let our AI create engaging captions optimized for your brand voice and target audience.</p>
              </div>
              <button onClick={() => navigate('/upload')} className="btn-primary shrink-0">
                Get Started
              </button>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Recent Posts</h2>
            {posts.length > 6 && (
              <button className="text-sm font-medium link">View All</button>
            )}
          </div>
          
          {postsLoading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 spinner"></div>
            </div>
          ) : posts.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon mx-auto">
                <FileText />
              </div>
              <p className="text-gray-500 dark:text-gray-400 mb-4">No posts yet. Start by uploading your first piece of content!</p>
              <button onClick={() => navigate('/upload')} className="btn-primary">
                Upload Content
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {posts.slice(0, 6).map((post) => (
                <div key={post.id} className="group rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-card-hover dark:hover:shadow-lg-dark transition-all duration-200">
                  {post.media && (
                    <div className="aspect-video overflow-hidden bg-gray-100 dark:bg-gray-800">
                      <img src={post.media.thumbnail_url || post.media.cloudinary_url} alt="Post media" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                  )}
                  <div className="p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">
                      {post.final_caption || post.generated_caption || 'No caption'}
                    </p>
                    <span className={`badge ${
                      post.status === 'posted' ? 'badge-success' :
                      post.status === 'scheduled' ? 'badge-primary' :
                      'badge-gray'
                    }`}>
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
      </div>
    </AppLayout>
  )
}

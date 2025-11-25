import { useBrand } from '../hooks/useBrand'
import { usePosts } from '../hooks/usePosts'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { AppLayout } from '../components/layout/AppLayout'
import { Upload, Calendar, Settings as SettingsIcon, FileText, Clock, CheckCircle2, Sparkles, X, Hash } from 'lucide-react'
import { useState } from 'react'

export function Dashboard() {
  const { user } = useAuth()
  const { brand, loading: brandLoading } = useBrand(user?.id)
  const { posts, loading: postsLoading } = usePosts(brand?.id)
  const navigate = useNavigate()
  const [selectedPost, setSelectedPost] = useState<any>(null)
  const [statusFilter, setStatusFilter] = useState<'all' | 'posted' | 'scheduled' | 'draft'>('all')

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
    { label: 'Total Posts', value: posts.length, icon: FileText, colorClass: 'from-primary-500 to-primary-600', bgColor: 'bg-primary-50/50 dark:bg-primary-900/10' },
    { label: 'Scheduled', value: scheduledPosts.length, icon: Clock, colorClass: 'from-primary-400 to-primary-500', bgColor: 'bg-primary-50/30 dark:bg-primary-900/10' },
    { label: 'Posted', value: postedPosts.length, icon: CheckCircle2, colorClass: 'from-primary-600 to-primary-700', bgColor: 'bg-primary-50/40 dark:bg-primary-900/10' },
    { label: 'Drafts', value: draftPosts.length, icon: FileText, colorClass: 'from-primary-500 to-primary-600', bgColor: 'bg-primary-50/30 dark:bg-primary-900/10' },
  ]

  const filteredPosts = statusFilter === 'all'
    ? posts
    : posts.filter(p => p.status === statusFilter)

  return (
    <AppLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div className="page-header">
          <h1 className="page-title text-4xl">Welcome back{user?.email ? `, ${user.email.split('@')[0]}` : ''}!</h1>
          <p className="page-subtitle text-base">Here's what's happening with <span className="font-semibold text-gray-900 dark:text-gray-100">{brand.name}</span></p>
        </div>

        {/* Quick Actions - Top Priority */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => navigate('/upload')}
            className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 px-6 py-3 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] active:scale-95 flex items-center gap-2"
          >
            <Upload className="w-5 h-5" />
            <span>Upload Content</span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          </button>

          <button
            onClick={() => navigate('/schedule')}
            className="group relative overflow-hidden rounded-xl border border-gray-300 dark:border-charcoal-700 bg-white dark:bg-charcoal-800 hover:bg-gray-50 dark:hover:bg-charcoal-700 px-6 py-3 text-charcoal-900 dark:text-charcoal-100 font-medium shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02] active:scale-95 flex items-center gap-2"
          >
            <Calendar className="w-5 h-5" />
            <span>View Calendar</span>
          </button>

          <button
            onClick={() => navigate('/settings')}
            className="group relative overflow-hidden rounded-xl border border-gray-300 dark:border-charcoal-700 bg-white dark:bg-charcoal-800 hover:bg-gray-50 dark:hover:bg-charcoal-700 px-6 py-3 text-charcoal-900 dark:text-charcoal-100 font-medium shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02] active:scale-95 flex items-center gap-2"
          >
            <SettingsIcon className="w-5 h-5" />
            <span>Brand Settings</span>
          </button>
        </div>

        {/* Stats Overview - Compact 2x2 Grid */}
        <div className="grid grid-cols-2 gap-4 max-w-2xl">
          {stats.map((stat) => (
            <div key={stat.label} className={`${stat.bgColor} rounded-2xl p-4 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-200 hover:-translate-y-1`}>
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${stat.colorClass} shadow-sm`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">{stat.label}</p>
                  <p className="text-2xl font-bold mt-0.5">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* AI Feature Card */}
        <div className="card overflow-hidden bg-gradient-to-br from-primary-50/50 via-cyan-50/30 to-blue-50/30 dark:from-primary-900/10 dark:via-cyan-900/10 dark:to-blue-900/10 border-primary-200/50 dark:border-primary-800/30">
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-1">AI-Powered Caption Generation</h3>
                <p className="text-charcoal-600 dark:text-charcoal-400 text-sm">Upload your media and let our AI create engaging captions optimized for your brand voice and target audience.</p>
              </div>
              <button onClick={() => navigate('/upload')} className="btn-primary shrink-0 shadow-lg">
                Get Started
              </button>
            </div>
          </div>
        </div>

        {/* Recent Posts Gallery */}
        <div className="card p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-xl font-semibold">Recent Posts</h2>

            {/* Filter Tabs */}
            <div className="flex gap-2 flex-wrap">
              {['all', 'posted', 'scheduled', 'draft'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setStatusFilter(filter as any)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    statusFilter === filter
                      ? 'bg-primary-500 text-white shadow-sm'
                      : 'bg-white dark:bg-charcoal-800 text-charcoal-700 dark:text-charcoal-300 hover:bg-gray-50 dark:hover:bg-charcoal-700 border border-gray-200 dark:border-charcoal-700'
                  }`}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  {filter !== 'all' && (
                    <span className="ml-1.5 text-xs opacity-75">
                      ({filter === 'posted' ? postedPosts.length : filter === 'scheduled' ? scheduledPosts.length : draftPosts.length})
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {postsLoading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 spinner"></div>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon mx-auto">
                <FileText />
              </div>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {statusFilter === 'all'
                  ? 'No posts yet. Start by uploading your first piece of content!'
                  : `No ${statusFilter} posts found.`
                }
              </p>
              <button onClick={() => navigate('/upload')} className="btn-primary">
                Upload Content
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {filteredPosts.map((post) => (
                <button
                  key={post.id}
                  onClick={() => setSelectedPost(post)}
                  className="group relative aspect-square rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-700 hover:ring-4 hover:ring-primary-400 dark:hover:ring-primary-600 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-primary-400"
                >
                  {post.media ? (
                    <>
                      <img
                        src={post.media.thumbnail_url || `${post.media.cloudinary_url}?w=400&h=400&c=fill&q=80&f_auto`}
                        alt="Post media"
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <div className="absolute bottom-2 left-2 right-2">
                          <p className="text-white text-xs line-clamp-2 font-medium">
                            {post.final_caption || post.generated_caption || 'No caption'}
                          </p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FileText className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <span className={`badge text-xs ${
                      post.status === 'posted' ? 'badge-success' :
                      post.status === 'scheduled' ? 'badge-primary' :
                      'badge-gray'
                    } shadow-lg`}>
                      {post.status === 'posted' && <CheckCircle2 className="w-2.5 h-2.5" />}
                      {post.status === 'scheduled' && <Clock className="w-2.5 h-2.5" />}
                      {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Modal/Lightbox for Post Details */}
        {selectedPost && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
            onClick={() => setSelectedPost(null)}
          >
            <div
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between z-10">
                <h3 className="text-lg font-semibold">Post Details</h3>
                <button
                  onClick={() => setSelectedPost(null)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {selectedPost.media && (
                  <div className="rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-900">
                    <img
                      src={`${selectedPost.media.cloudinary_url}?w=1200&h=800&c_limit&q=90&f_auto`}
                      alt="Post media"
                      className="w-full max-h-96 object-contain mx-auto"
                    />
                  </div>
                )}

                <div>
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide block mb-2">Status</label>
                  <span className={`badge ${
                    selectedPost.status === 'posted' ? 'badge-success' :
                    selectedPost.status === 'scheduled' ? 'badge-primary' :
                    'badge-gray'
                  }`}>
                    {selectedPost.status === 'posted' && <CheckCircle2 className="w-3 h-3" />}
                    {selectedPost.status === 'scheduled' && <Clock className="w-3 h-3" />}
                    {selectedPost.status.charAt(0).toUpperCase() + selectedPost.status.slice(1)}
                  </span>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide block mb-2">Caption</label>
                  <p className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
                    {selectedPost.final_caption || selectedPost.generated_caption || 'No caption available'}
                  </p>
                </div>

                {selectedPost.hashtags && selectedPost.hashtags.length > 0 && (
                  <div>
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide block mb-2 flex items-center gap-1">
                      <Hash className="w-3 h-3" />
                      Hashtags
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {selectedPost.hashtags.map((tag: string, idx: number) => (
                        <span key={idx} className="badge badge-primary">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedPost.scheduled_for && (
                  <div>
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide block mb-2">Scheduled For</label>
                    <p className="text-gray-900 dark:text-gray-100">
                      {new Date(selectedPost.scheduled_for).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  )
}

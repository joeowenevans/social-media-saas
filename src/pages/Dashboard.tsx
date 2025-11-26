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
      <div className="min-h-screen flex items-center justify-center bg-[#0d0d0d]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 spinner border-primary-500"></div>
          <p className="text-sm text-[#a1a1aa]">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!brand) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0d0d0d]">
        <div className="max-w-md w-full bg-[#1a1a1a] border border-[#27272a] rounded-xl p-8 text-center">
          <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 mb-6">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-semibold mb-2 text-white">Welcome to SocialAI!</h2>
          <p className="text-[#a1a1aa] mb-6">
            Let's set up your brand profile to get started with AI-powered social media management.
          </p>
          <button onClick={() => navigate('/settings')} className="bg-primary-500 hover:bg-primary-600 text-white font-medium px-6 py-3 rounded-lg w-full transition-colors">
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
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-semibold text-white mb-2">Welcome back{user?.email ? `, ${user.email.split('@')[0]}` : ''}!</h1>
          <p className="text-base text-[#a1a1aa]">Here's what's happening with <span className="font-medium text-white">{brand.name}</span></p>
        </div>

        {/* Quick Actions - Top Priority */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => navigate('/upload')}
            className="rounded-lg bg-primary-500 hover:bg-primary-600 px-6 py-3 text-white font-medium transition-all duration-200 flex items-center gap-2"
          >
            <Upload className="w-5 h-5" />
            <span>Upload Content</span>
          </button>

          <button
            onClick={() => navigate('/schedule')}
            className="rounded-lg border border-[#27272a] bg-[#1a1a1a] hover:bg-[#222] px-6 py-3 text-white font-medium transition-all duration-200 flex items-center gap-2"
          >
            <Calendar className="w-5 h-5" />
            <span>View Calendar</span>
          </button>

          <button
            onClick={() => navigate('/settings')}
            className="rounded-lg border border-[#27272a] bg-[#1a1a1a] hover:bg-[#222] px-6 py-3 text-white font-medium transition-all duration-200 flex items-center gap-2"
          >
            <SettingsIcon className="w-5 h-5" />
            <span>Brand Settings</span>
          </button>
        </div>

        {/* Stats Overview - Compact 2x2 Grid */}
        <div className="grid grid-cols-2 gap-6 max-w-2xl">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-[#1a1a1a] border border-[#27272a] rounded-xl p-6 hover:border-[#3a3a3a] transition-all duration-200">
              <div className="flex items-center gap-4">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${stat.colorClass}`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-xs font-medium text-[#a1a1aa] uppercase tracking-wide">{stat.label}</p>
                  <p className="text-3xl font-semibold mt-1 text-white">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* AI Feature Card */}
        <div className="bg-[#1a1a1a] border border-[#27272a] rounded-xl p-6">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-600">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-1 text-white">AI-Powered Caption Generation</h3>
              <p className="text-[#a1a1aa] text-sm">Upload your media and let our AI create engaging captions optimized for your brand voice and target audience.</p>
            </div>
            <button onClick={() => navigate('/upload')} className="bg-primary-500 hover:bg-primary-600 text-white font-medium px-6 py-3 rounded-lg transition-colors shrink-0">
              Get Started
            </button>
          </div>
        </div>

        {/* Recent Posts Gallery */}
        <div className="bg-[#1a1a1a] border border-[#27272a] rounded-xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-xl font-semibold text-white">Recent Posts</h2>

            {/* Filter Tabs */}
            <div className="flex gap-2 flex-wrap">
              {['all', 'posted', 'scheduled', 'draft'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setStatusFilter(filter as any)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    statusFilter === filter
                      ? 'bg-primary-500 text-white'
                      : 'bg-transparent text-[#a1a1aa] hover:text-white border border-[#27272a] hover:border-[#3a3a3a]'
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
              <div className="w-8 h-8 spinner border-primary-500"></div>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-xl bg-[#222] mb-4">
                <FileText className="w-8 h-8 text-[#a1a1aa]" />
              </div>
              <p className="text-[#a1a1aa] mb-4">
                {statusFilter === 'all'
                  ? 'No posts yet. Start by uploading your first piece of content!'
                  : `No ${statusFilter} posts found.`
                }
              </p>
              <button onClick={() => navigate('/upload')} className="bg-primary-500 hover:bg-primary-600 text-white font-medium px-6 py-3 rounded-lg transition-colors">
                Upload Content
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {filteredPosts.map((post) => (
                <button
                  key={post.id}
                  onClick={() => setSelectedPost(post)}
                  className="group relative aspect-square rounded-xl overflow-hidden bg-[#222] hover:ring-2 hover:ring-primary-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {post.media ? (
                    <>
                      <img
                        src={post.media.thumbnail_url || `${post.media.cloudinary_url}?w=400&h=400&c=fill&q=80&f_auto`}
                        alt="Post media"
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <div className="absolute bottom-2 left-2 right-2">
                          <p className="text-white text-xs line-clamp-2 font-medium">
                            {post.final_caption || post.generated_caption || 'No caption'}
                          </p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FileText className="w-8 h-8 text-[#a1a1aa]" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                      post.status === 'posted' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                      post.status === 'scheduled' ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30' :
                      'bg-[#27272a] text-[#a1a1aa] border border-[#3a3a3a]'
                    }`}>
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedPost(null)}
          >
            <div
              className="bg-[#1a1a1a] border border-[#27272a] rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-[#1a1a1a] border-b border-[#27272a] p-4 flex items-center justify-between z-10">
                <h3 className="text-lg font-semibold text-white">Post Details</h3>
                <button
                  onClick={() => setSelectedPost(null)}
                  className="p-2 hover:bg-[#222] rounded-lg transition-colors text-[#a1a1aa] hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {selectedPost.media && (
                  <div className="rounded-xl overflow-hidden bg-[#0d0d0d]">
                    <img
                      src={`${selectedPost.media.cloudinary_url}?w=1200&h=800&c_limit&q=90&f_auto`}
                      alt="Post media"
                      className="w-full max-h-96 object-contain mx-auto"
                    />
                  </div>
                )}

                <div>
                  <label className="text-xs font-semibold text-[#a1a1aa] uppercase tracking-wide block mb-2">Status</label>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                    selectedPost.status === 'posted' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                    selectedPost.status === 'scheduled' ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30' :
                    'bg-[#27272a] text-[#a1a1aa] border border-[#3a3a3a]'
                  }`}>
                    {selectedPost.status === 'posted' && <CheckCircle2 className="w-3 h-3" />}
                    {selectedPost.status === 'scheduled' && <Clock className="w-3 h-3" />}
                    {selectedPost.status.charAt(0).toUpperCase() + selectedPost.status.slice(1)}
                  </span>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#a1a1aa] uppercase tracking-wide block mb-2">Caption</label>
                  <p className="text-white whitespace-pre-wrap leading-relaxed">
                    {selectedPost.final_caption || selectedPost.generated_caption || 'No caption available'}
                  </p>
                </div>

                {selectedPost.hashtags && selectedPost.hashtags.length > 0 && (
                  <div>
                    <label className="text-xs font-semibold text-[#a1a1aa] uppercase tracking-wide block mb-2 flex items-center gap-1">
                      <Hash className="w-3 h-3" />
                      Hashtags
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {selectedPost.hashtags.map((tag: string, idx: number) => (
                        <span key={idx} className="px-3 py-1 rounded-full text-xs font-medium bg-primary-500/20 text-primary-400 border border-primary-500/30">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedPost.scheduled_for && (
                  <div>
                    <label className="text-xs font-semibold text-[#a1a1aa] uppercase tracking-wide block mb-2">Scheduled For</label>
                    <p className="text-white">
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

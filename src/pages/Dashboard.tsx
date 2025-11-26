import { useBrand } from '../hooks/useBrand'
import { usePosts } from '../hooks/usePosts'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { AppLayout } from '../components/layout/AppLayout'
import { FileText, Clock, CheckCircle2, Sparkles, X, Hash, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  isSameMonth
} from 'date-fns'

export function Dashboard() {
  const { user } = useAuth()
  const { brand, loading: brandLoading } = useBrand(user?.id)
  const { posts, loading: postsLoading } = usePosts(brand?.id)
  const navigate = useNavigate()
  const [selectedPost, setSelectedPost] = useState<any>(null)
  const [currentMonth, setCurrentMonth] = useState(new Date())

  if (brandLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(180deg, #111111 0%, #0a0a0a 100%)' }}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 spinner border-primary-500"></div>
          <p className="text-sm" style={{ color: '#e5e5e5' }}>Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!brand) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(180deg, #111111 0%, #0a0a0a 100%)' }}>
        <div className="max-w-md w-full bg-[#1a1a1a] rounded-xl text-center" style={{ borderRadius: '12px', padding: '32px' }}>
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
    { label: 'Total Posts', value: posts.length, icon: FileText, colorClass: 'from-primary-500 to-primary-600' },
    { label: 'Scheduled', value: scheduledPosts.length, icon: Clock, colorClass: 'from-primary-400 to-primary-500' },
    { label: 'Posted', value: postedPosts.length, icon: CheckCircle2, colorClass: 'from-primary-600 to-primary-700' },
    { label: 'Drafts', value: draftPosts.length, icon: FileText, colorClass: 'from-primary-500 to-primary-600' },
  ]

  // Calendar generation
  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const startDate = startOfWeek(monthStart)
  const endDate = endOfWeek(monthEnd)
  const dateRange = eachDayOfInterval({ start: startDate, end: endDate })

  // Group scheduled posts by date
  const postsByDate = scheduledPosts.reduce((acc: any, post) => {
    if (post.scheduled_for) {
      const dateKey = format(new Date(post.scheduled_for), 'yyyy-MM-dd')
      if (!acc[dateKey]) acc[dateKey] = []
      acc[dateKey].push(post)
    }
    return acc
  }, {})

  // Get platform color
  const getPlatformColor = (platforms: string[]) => {
    if (!platforms || platforms.length === 0) return '#14b8a6'
    if (platforms.includes('instagram')) return '#E1306C'
    if (platforms.includes('facebook')) return '#1877F2'
    if (platforms.includes('pinterest')) return '#E60023'
    if (platforms.includes('linkedin')) return '#0A66C2'
    return '#14b8a6'
  }

  // Recent posts for gallery (all posts, limit 10)
  const recentPosts = [...posts]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 10)

  return (
    <AppLayout>
      <div style={{ padding: '48px 32px' }}>
        {/* Welcome Title */}
        <h1 style={{
          color: '#14b8a6',
          fontSize: '32px',
          fontWeight: 600,
          textAlign: 'center',
          marginBottom: '64px'
        }}>
          Welcome back{user?.email ? `, ${user.email.split('@')[0]}` : ''}!
        </h1>

        {/* AI Caption Generation Section */}
        <div style={{
          background: '#1a1a1a',
          padding: '32px',
          borderRadius: '12px',
          marginBottom: '64px',
          textAlign: 'center'
        }}>
          <h2 style={{
            color: '#14b8a6',
            fontSize: '24px',
            fontWeight: 600,
            marginBottom: '16px'
          }}>
            AI-Powered Caption Generation
          </h2>
          <p style={{
            color: '#e5e5e5',
            fontSize: '16px',
            lineHeight: '1.7',
            marginTop: '16px',
            marginBottom: '24px'
          }}>
            Upload your media and let our AI create engaging captions optimized for your brand voice and target audience.
          </p>
          <button
            onClick={() => navigate('/upload')}
            style={{
              width: '200px',
              height: '48px',
              background: '#2a2a2a',
              color: 'white',
              border: 'none',
              borderRadius: '24px',
              fontSize: '15px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              margin: '0 auto',
              display: 'block'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#14b8a6'
              e.currentTarget.style.transform = 'scale(1.05)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#2a2a2a'
              e.currentTarget.style.transform = 'scale(1)'
            }}
          >
            Get Started
          </button>
        </div>

        {/* Stats Grid - 2x2 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '24px',
          maxWidth: '800px',
          margin: '0 auto',
          marginBottom: '64px'
        }}>
          {stats.map((stat) => (
            <div key={stat.label} style={{
              background: '#1a1a1a',
              borderRadius: '12px',
              padding: '32px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${stat.colorClass}`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p style={{
                    fontSize: '12px',
                    fontWeight: 500,
                    color: '#a1a1aa',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '4px'
                  }}>
                    {stat.label}
                  </p>
                  <p style={{
                    fontSize: '32px',
                    fontWeight: 600,
                    color: 'white'
                  }}>
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Calendar View */}
        <div style={{ marginBottom: '64px' }}>
          <h2 style={{
            color: '#14b8a6',
            fontSize: '24px',
            fontWeight: 600,
            marginBottom: '24px'
          }}>
            Scheduled Posts Calendar
          </h2>
          <div style={{
            background: '#1a1a1a',
            padding: '32px',
            borderRadius: '12px'
          }}>
            {/* Month Navigation */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px'
            }}>
              <button
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                className="unstyled"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#14b8a6',
                  cursor: 'pointer',
                  padding: '8px'
                }}
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <h3 style={{
                color: 'white',
                fontSize: '18px',
                fontWeight: 600
              }}>
                {format(currentMonth, 'MMMM yyyy')}
              </h3>
              <button
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                className="unstyled"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#14b8a6',
                  cursor: 'pointer',
                  padding: '8px'
                }}
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Weekday Headers */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: '8px',
              marginBottom: '8px'
            }}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} style={{
                  textAlign: 'center',
                  color: '#a1a1aa',
                  fontSize: '12px',
                  fontWeight: 600,
                  padding: '8px'
                }}>
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: '8px'
            }}>
              {dateRange.map((date, idx) => {
                const dateKey = format(date, 'yyyy-MM-dd')
                const dayPosts = postsByDate[dateKey] || []
                const isCurrentMonth = isSameMonth(date, currentMonth)

                return (
                  <div
                    key={idx}
                    style={{
                      background: '#0d0d0d',
                      border: '1px solid #27272a',
                      borderRadius: '8px',
                      padding: '12px',
                      minHeight: '100px',
                      opacity: isCurrentMonth ? 1 : 0.4
                    }}
                  >
                    <div style={{ color: '#888', fontSize: '12px', marginBottom: '8px' }}>
                      {format(date, 'd')}
                    </div>

                    {dayPosts.slice(0, 2).map((post: any) => (
                      <div key={post.id} style={{ marginBottom: '8px' }}>
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '4px' }}>
                          <img
                            src={post.media?.thumbnail_url || post.media?.cloudinary_url}
                            alt=""
                            style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: '6px',
                              objectFit: 'cover'
                            }}
                          />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', gap: '4px', marginBottom: '2px' }}>
                              {post.platforms?.slice(0, 2).map((platform: string) => (
                                <div
                                  key={platform}
                                  style={{
                                    width: '6px',
                                    height: '6px',
                                    borderRadius: '50%',
                                    background: getPlatformColor([platform])
                                  }}
                                />
                              ))}
                            </div>
                            <div style={{
                              color: '#888',
                              fontSize: '11px',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}>
                              {post.final_caption.split(' ').slice(0, 3).join(' ')}...
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {dayPosts.length > 2 && (
                      <div style={{ color: '#14b8a6', fontSize: '11px', fontWeight: 500 }}>
                        +{dayPosts.length - 2} more
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Recent Posts Gallery */}
        <div style={{ marginBottom: '64px' }}>
          <h2 style={{
            color: '#14b8a6',
            fontSize: '24px',
            fontWeight: 600,
            marginBottom: '24px'
          }}>
            Recent Posts
          </h2>

          {postsLoading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 spinner border-primary-500"></div>
            </div>
          ) : recentPosts.length === 0 ? (
            <div className="text-center py-12">
              <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-xl bg-[#222] mb-4">
                <FileText className="w-8 h-8 text-[#a1a1aa]" />
              </div>
              <p className="text-[#a1a1aa] mb-4">
                No posts yet. Start by uploading your first piece of content!
              </p>
              <button onClick={() => navigate('/upload')} className="bg-primary-500 hover:bg-primary-600 text-white font-medium px-6 py-3 rounded-lg transition-colors">
                Upload Content
              </button>
            </div>
          ) : (
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1%'
            }}>
              {recentPosts.map((post) => (
                <div
                  key={post.id}
                  onClick={() => setSelectedPost(post)}
                  style={{
                    width: '18%',
                    margin: '0.5%',
                    aspectRatio: '1 / 1',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    background: '#1a1a1a',
                    cursor: 'pointer',
                    position: 'relative'
                  }}
                  className="group"
                >
                  {post.media ? (
                    <>
                      <img
                        src={post.media.thumbnail_url || `${post.media.cloudinary_url.split('/upload/')[0]}/upload/w_200,h_200,c_fill/${post.media.cloudinary_url.split('/upload/')[1]}`}
                        alt="Post media"
                        loading="lazy"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                      <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-2 p-2">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          post.status === 'posted' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                          post.status === 'scheduled' ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30' :
                          'bg-[#27272a] text-[#a1a1aa] border border-[#3a3a3a]'
                        }`}>
                          {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                        </span>
                        {post.platforms && post.platforms.length > 0 && (
                          <div className="flex gap-1">
                            {post.platforms.map((platform: string, idx: number) => (
                              <div
                                key={idx}
                                style={{
                                  width: '8px',
                                  height: '8px',
                                  borderRadius: '50%',
                                  background: getPlatformColor([platform])
                                }}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FileText className="w-8 h-8 text-[#a1a1aa]" />
                    </div>
                  )}
                </div>
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
              className="bg-[#1a1a1a] max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              style={{ borderRadius: '12px' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-[#1a1a1a] border-b border-[#27272a] flex items-center justify-between z-10" style={{ padding: '32px' }}>
                <h3 className="text-lg font-semibold text-white">Post Details</h3>
                <button
                  onClick={() => setSelectedPost(null)}
                  className="unstyled p-2 hover:bg-[#222] rounded-lg transition-colors text-[#a1a1aa] hover:text-white"
                  style={{ background: 'transparent', border: 'none' }}
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

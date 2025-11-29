import { useBrand } from '../hooks/useBrand'
import { usePosts } from '../hooks/usePosts'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { AppLayout } from '../components/layout/AppLayout'
import { FileText, Clock, CheckCircle2, Sparkles, X, Hash, ChevronLeft, ChevronRight, Edit3, XCircle } from 'lucide-react'
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
  isSameMonth,
  isToday,
  addWeeks,
  subWeeks
} from 'date-fns'

export function Dashboard() {
  const { user } = useAuth()
  const { brand, loading: brandLoading } = useBrand(user?.id)
  const { posts, loading: postsLoading } = usePosts(brand?.id)
  const navigate = useNavigate()
  const [selectedPost, setSelectedPost] = useState<any>(null)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [calendarView, setCalendarView] = useState<'week' | 'month'>('month')
  const [currentWeek, setCurrentWeek] = useState(new Date())

  // Helper function to get proper thumbnail URL for videos
  // Handles both new uploads (correct thumbnail_url) and legacy data (video URL in thumbnail_url)
  const getMediaThumbnail = (media: any) => {
    if (!media) return null

    // Check if thumbnail_url exists and is actually an image (not a video file)
    // Legacy data has video URLs stored in thumbnail_url which won't display in <img> tags
    const videoExtensions = ['.mp4', '.mov', '.avi', '.webm', '.mkv']
    const hasValidThumbnail = media.thumbnail_url &&
      !videoExtensions.some(ext => media.thumbnail_url.toLowerCase().endsWith(ext))

    if (hasValidThumbnail) {
      return media.thumbnail_url
    }

    // For videos (or videos incorrectly stored in thumbnail_url), generate thumbnail from Cloudinary
    // Use thumbnail_url if it's a Cloudinary video URL, otherwise use cloudinary_url
    const videoUrl = media.thumbnail_url?.includes('/video/upload/')
      ? media.thumbnail_url
      : media.cloudinary_url

    if (media.media_type === 'video' && videoUrl?.includes('/video/upload/')) {
      // Transform: get first frame (so_0), convert to jpg, resize with fill
      return videoUrl
        .replace('/video/upload/', '/video/upload/so_0,f_jpg,w_400,h_400,c_fill/')
        .replace(/\.[^/.]+$/, '.jpg')
    }

    // For images, just return the cloudinary_url
    return media.cloudinary_url
  }

  // Get user's first name from metadata
  const firstName = user?.user_metadata?.first_name || user?.email?.split('@')[0] || 'there'

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
  const failedPosts = posts.filter(p => p.status === 'failed')

  const stats = [
    { label: 'Scheduled', value: scheduledPosts.length, icon: Clock, filter: 'scheduled', color: '#14b8a6' },
    { label: 'Posted', value: postedPosts.length, icon: CheckCircle2, filter: 'posted', color: '#14b8a6' },
    { label: 'Drafts', value: draftPosts.length, icon: Edit3, filter: 'draft', color: '#14b8a6' },
    { label: 'Failed', value: failedPosts.length, icon: XCircle, filter: 'failed', color: '#14b8a6' },
  ]

  // Calendar generation for month view
  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const startDate = startOfWeek(monthStart)
  const endDate = endOfWeek(monthEnd)
  const dateRange = eachDayOfInterval({ start: startDate, end: endDate })

  // Calendar generation for week view
  const weekStart = startOfWeek(currentWeek)
  const weekEnd = endOfWeek(currentWeek)
  const weekDateRange = eachDayOfInterval({ start: weekStart, end: weekEnd })

  // Group all posts by date (not just scheduled - includes posted too)
  const postsByDate = posts.reduce((acc: any, post: any) => {
    if (post.scheduled_for) {
      const dateKey = format(new Date(post.scheduled_for), 'yyyy-MM-dd')
      if (!acc[dateKey]) acc[dateKey] = []
      acc[dateKey].push(post)
    }
    return acc
  }, {})

  // Recent posts for gallery (all posts, limit 10)
  const recentPosts = [...posts]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 10)

  return (
    <AppLayout>
      <div style={{ padding: '48px 32px' }}>
        {/* Welcome Title */}
        <h1 style={{
          color: '#ffffff',
          fontSize: '32px',
          fontWeight: 700,
          textAlign: 'center',
          marginBottom: '64px'
        }}>
          Welcome back, {firstName}!
        </h1>

        {/* AI Caption Generation Section */}
        <div style={{
          background: '#1a1a1a',
          padding: '32px',
          borderRadius: '12px',
          marginBottom: '64px',
          textAlign: 'center',
          boxShadow: '0 0 40px rgba(20, 184, 166, 0.2), 0 0 80px rgba(20, 184, 166, 0.1)'
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

        {/* Stats Grid - 1x4 with white glow */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '16px',
          maxWidth: '1200px',
          margin: '0 auto',
          marginBottom: '64px'
        }}>
          {stats.map((stat) => (
            <div
              key={stat.label}
              onClick={() => {
                navigate(`/schedule?status=${stat.filter}`)
                setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100)
              }}
              style={{
                background: '#1a1a1a',
                borderRadius: '12px',
                padding: '24px 20px',
                boxShadow: '0 0 20px rgba(255, 255, 255, 0.05)',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)'
                e.currentTarget.style.boxShadow = '0 0 30px rgba(255, 255, 255, 0.12)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)'
                e.currentTarget.style.boxShadow = '0 0 20px rgba(255, 255, 255, 0.05)'
              }}
            >
              <div>
                <p style={{
                  fontSize: '11px',
                  fontWeight: 500,
                  color: '#a1a1aa',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '12px'
                }}>
                  {stat.label}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <stat.icon style={{ width: '32px', height: '32px', color: stat.color, flexShrink: 0 }} />
                  <p style={{
                    fontSize: '32px',
                    fontWeight: 700,
                    color: 'white',
                    lineHeight: 1
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{
              color: '#14b8a6',
              fontSize: '24px',
              fontWeight: 600
            }}>
              Content Calendar
            </h2>

            {/* View Toggle */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setCalendarView('week')}
                style={{
                  padding: '8px 16px',
                  background: calendarView === 'week' ? '#14b8a6' : '#0d0d0d',
                  border: `1px solid ${calendarView === 'week' ? '#14b8a6' : '#27272a'}`,
                  borderRadius: '6px',
                  color: calendarView === 'week' ? 'white' : '#888',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                Week
              </button>
              <button
                onClick={() => setCalendarView('month')}
                style={{
                  padding: '8px 16px',
                  background: calendarView === 'month' ? '#14b8a6' : '#0d0d0d',
                  border: `1px solid ${calendarView === 'month' ? '#14b8a6' : '#27272a'}`,
                  borderRadius: '6px',
                  color: calendarView === 'month' ? 'white' : '#888',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                Month
              </button>
            </div>
          </div>

          <div style={{ background: '#1a1a1a', padding: '32px', borderRadius: '12px' }}>
            {/* Calendar Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <button
                onClick={() => calendarView === 'month'
                  ? setCurrentMonth(subMonths(currentMonth, 1))
                  : setCurrentWeek(subWeeks(currentWeek, 1))
                }
                style={{
                  background: '#0d0d0d',
                  border: '1px solid #27272a',
                  borderRadius: '8px',
                  padding: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <ChevronLeft style={{ width: '20px', height: '20px', color: '#e5e5e5' }} />
              </button>

              <h3 style={{ color: 'white', fontSize: '18px', fontWeight: 600 }}>
                {calendarView === 'month'
                  ? format(currentMonth, 'MMMM yyyy')
                  : `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`
                }
              </h3>

              <button
                onClick={() => calendarView === 'month'
                  ? setCurrentMonth(addMonths(currentMonth, 1))
                  : setCurrentWeek(addWeeks(currentWeek, 1))
                }
                style={{
                  background: '#0d0d0d',
                  border: '1px solid #27272a',
                  borderRadius: '8px',
                  padding: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <ChevronRight style={{ width: '20px', height: '20px', color: '#e5e5e5' }} />
              </button>
            </div>

            {/* Days of Week */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', marginBottom: '8px' }}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} style={{
                  textAlign: 'center',
                  color: '#888',
                  fontSize: '12px',
                  fontWeight: 600,
                  padding: '8px 0'
                }}>
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
              {(calendarView === 'month' ? dateRange : weekDateRange).map(date => {
                const dateKey = format(date, 'yyyy-MM-dd')
                const dayPosts = postsByDate[dateKey] || []
                const isCurrentMonth = calendarView === 'month' ? isSameMonth(date, currentMonth) : true
                const isTodayDate = isToday(date)
                const maxPosts = calendarView === 'week' ? 3 : 2

                return (
                  <div
                    key={dateKey}
                    style={{
                      background: isTodayDate ? 'rgba(20, 184, 166, 0.1)' : '#0d0d0d',
                      border: isTodayDate ? '2px solid #14b8a6' : '1px solid #27272a',
                      borderRadius: '8px',
                      padding: '12px',
                      minHeight: calendarView === 'week' ? '150px' : '100px',
                      opacity: isCurrentMonth ? 1 : 0.4
                    }}
                  >
                    <div style={{
                      color: isTodayDate ? '#14b8a6' : '#888',
                      fontSize: '12px',
                      marginBottom: '8px',
                      fontWeight: isTodayDate ? 600 : 400
                    }}>
                      {calendarView === 'week' ? format(date, 'MMM d') : format(date, 'd')}
                    </div>

                    {dayPosts.slice(0, maxPosts).map((post: any) => (
                      <div
                        key={post.id}
                        style={{ marginBottom: '8px', cursor: 'pointer' }}
                        onClick={() => navigate(`/schedule?edit=${post.id}`)}
                      >
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-start', marginBottom: '4px' }}>
                          <div style={{ position: 'relative', flexShrink: 0 }}>
                            <img
                              src={getMediaThumbnail(post.media)}
                              alt=""
                              style={{
                                width: calendarView === 'week' ? '48px' : '40px',
                                height: calendarView === 'week' ? '48px' : '40px',
                                borderRadius: '6px',
                                objectFit: 'cover'
                              }}
                            />
                            {/* Status indicator dot */}
                            <div style={{
                              position: 'absolute',
                              top: '-3px',
                              right: '-3px',
                              width: '10px',
                              height: '10px',
                              borderRadius: '50%',
                              background: post.status === 'posted' ? '#10b981' :
                                         post.status === 'scheduled' ? '#14b8a6' :
                                         '#6b7280',
                              border: '2px solid #0d0d0d'
                            }} />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            {/* Platform names as text */}
                            <div style={{
                              color: '#666',
                              fontSize: '10px',
                              marginBottom: '2px',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}>
                              {post.platforms?.slice(0, 2).map((p: string) =>
                                p.charAt(0).toUpperCase() + p.slice(1)
                              ).join(', ')}
                              {post.platforms?.length > 2 && ` +${post.platforms.length - 2}`}
                            </div>
                            {/* Media type */}
                            <div style={{
                              color: '#666',
                              fontSize: '10px',
                              marginBottom: '2px'
                            }}>
                              {post.media?.media_type === 'video' ? 'video' : 'image'}
                            </div>
                            {calendarView === 'week' && (
                              <div style={{
                                color: '#888',
                                fontSize: '11px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}>
                                {post.final_caption?.split(' ').slice(0, 4).join(' ')}...
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    {dayPosts.length > maxPosts && (
                      <div style={{ color: '#14b8a6', fontSize: '11px', fontWeight: 500 }}>
                        +{dayPosts.length - maxPosts} more
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
                  onClick={() => navigate(`/schedule?edit=${post.id}`)}
                  style={{
                    width: '18%',
                    margin: '0.5%',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    background: '#1a1a1a',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 0 10px rgba(255, 255, 255, 0.05)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.02)'
                    e.currentTarget.style.boxShadow = '0 0 20px rgba(20, 184, 166, 0.3), 0 0 40px rgba(20, 184, 166, 0.1)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)'
                    e.currentTarget.style.boxShadow = '0 0 10px rgba(255, 255, 255, 0.05)'
                  }}
                >
                  {/* Image/Video Thumbnail */}
                  <div style={{ aspectRatio: '1 / 1', position: 'relative', background: '#0d0d0d' }}>
                    {post.media ? (
                      <img
                        src={getMediaThumbnail(post.media)}
                        alt="Post media"
                        loading="lazy"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FileText style={{ width: '32px', height: '32px', color: '#666' }} />
                      </div>
                    )}
                    {/* Media type badge for videos */}
                    {post.media?.media_type === 'video' && (
                      <div style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        background: 'rgba(0, 0, 0, 0.7)',
                        borderRadius: '4px',
                        padding: '4px 8px',
                        fontSize: '10px',
                        color: '#14b8a6',
                        fontWeight: 500
                      }}>
                        VIDEO
                      </div>
                    )}
                  </div>

                  {/* Info Card */}
                  <div style={{
                    background: '#1a1a1a',
                    padding: '12px'
                  }}>
                    {/* Caption Preview */}
                    <p style={{
                      color: '#e5e5e5',
                      fontSize: '12px',
                      lineHeight: 1.4,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      marginBottom: '8px'
                    }}>
                      {post.final_caption || post.generated_caption || 'No caption'}
                    </p>

                    {/* Status and Platform */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: '10px',
                        fontSize: '10px',
                        fontWeight: 500,
                        background: post.status === 'posted' ? 'rgba(16, 185, 129, 0.2)' :
                                    post.status === 'scheduled' ? 'rgba(20, 184, 166, 0.2)' :
                                    'rgba(107, 114, 128, 0.2)',
                        color: post.status === 'posted' ? '#10b981' :
                               post.status === 'scheduled' ? '#14b8a6' :
                               '#888'
                      }}>
                        {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                      </span>

                      {/* Platform Names */}
                      {post.platforms && post.platforms.length > 0 && (
                        <span style={{
                          fontSize: '10px',
                          color: '#888',
                          fontWeight: 500,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          flex: 1,
                          textAlign: 'right'
                        }}>
                          {post.platforms.slice(0, 2).map((p: string) => p.charAt(0).toUpperCase() + p.slice(1)).join(', ')}
                          {post.platforms.length > 2 && ` +${post.platforms.length - 2}`}
                        </span>
                      )}
                    </div>
                  </div>
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

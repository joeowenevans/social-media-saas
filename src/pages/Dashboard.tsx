import { useBrand } from '../hooks/useBrand'
import { usePosts } from '../hooks/usePosts'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { AppLayout } from '../components/layout/AppLayout'
import { FileText, Clock, CheckCircle2, Sparkles, X, Hash, ChevronLeft, ChevronRight, Edit3 } from 'lucide-react'
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

  // Get user's first name - hardcoded for known accounts, otherwise extract from email
  const getFirstName = () => {
    // Hardcoded name for specific account
    if (user?.email === 'joe.owenevans@gmail.com') {
      return 'Joe'
    }

    // Check user metadata first_name
    if (user?.user_metadata?.first_name) {
      return user.user_metadata.first_name
    }

    // Extract from email: take first part before @ and before any dots/numbers, then capitalize
    if (user?.email) {
      const emailPrefix = user.email.split('@')[0]
      const namePart = emailPrefix.split(/[._\d]/)[0]
      if (namePart) {
        return namePart.charAt(0).toUpperCase() + namePart.slice(1).toLowerCase()
      }
    }

    return 'there'
  }
  const firstName = getFirstName()

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
    { label: 'Scheduled', value: scheduledPosts.length, icon: Clock, filter: 'scheduled', color: '#14b8a6' },
    { label: 'Posted', value: postedPosts.length, icon: CheckCircle2, filter: 'posted', color: '#14b8a6' },
    { label: 'Drafts', value: draftPosts.length, icon: Edit3, filter: 'draft', color: '#14b8a6' },
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
      <div className="px-2 sm:px-4 md:px-8 py-6 sm:py-8 md:py-12">
        {/* Welcome Title */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white text-center mb-8 sm:mb-12 md:mb-16">
          Welcome back, {firstName}!
        </h1>

        {/* AI Caption Generation Section */}
        <div className="bg-[#1a1a1a] p-5 sm:p-6 md:p-8 rounded-xl mb-8 sm:mb-12 md:mb-16 text-center"
          style={{ boxShadow: '0 0 40px rgba(20, 184, 166, 0.2), 0 0 80px rgba(20, 184, 166, 0.1)' }}>
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-teal-400 mb-3 sm:mb-4">
            AI-Powered Caption Generation
          </h2>
          <p className="text-sm sm:text-base text-[#e5e5e5] leading-relaxed mb-4 sm:mb-6">
            Upload your media and let our AI create engaging captions optimized for your brand voice and target audience.
          </p>
          <button
            onClick={() => navigate('/upload')}
            className="w-full sm:w-auto px-8 sm:px-10 h-11 sm:h-12 bg-[#2a2a2a] text-white rounded-full font-semibold text-sm sm:text-base transition-all duration-200 hover:bg-teal-500 hover:scale-105"
          >
            Get Started
          </button>
        </div>

        {/* Stats Grid - 1 col mobile, 3 cols desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-8 sm:mb-12 md:mb-16">
          {stats.map((stat) => (
            <div
              key={stat.label}
              onClick={() => {
                navigate(`/schedule?status=${stat.filter}`)
                setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100)
              }}
              style={{
                background: '#1a1a1a',
                borderRadius: '10px',
                padding: '16px 20px',
                boxShadow: '0 0 20px rgba(255, 255, 255, 0.05)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.02)'
                e.currentTarget.style.boxShadow = '0 0 30px rgba(255, 255, 255, 0.12)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)'
                e.currentTarget.style.boxShadow = '0 0 20px rgba(255, 255, 255, 0.05)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <stat.icon style={{ width: '24px', height: '24px', color: stat.color, flexShrink: 0 }} />
                <p style={{
                  fontSize: '13px',
                  fontWeight: 500,
                  color: '#a1a1aa',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  {stat.label}
                </p>
              </div>
              <p style={{
                fontSize: '28px',
                fontWeight: 700,
                color: 'white',
                lineHeight: 1
              }}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Calendar View */}
        <div className="mb-8 sm:mb-12 md:mb-16">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-teal-400">
              Content Calendar
            </h2>

            {/* View Toggle */}
            <div className="flex gap-2">
              <button
                onClick={() => setCalendarView('week')}
                className={`px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-all ${
                  calendarView === 'week'
                    ? 'bg-teal-500 text-white border border-teal-500'
                    : 'bg-[#0d0d0d] text-gray-400 border border-[#27272a]'
                }`}
              >
                Week
              </button>
              <button
                onClick={() => setCalendarView('month')}
                className={`px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-all ${
                  calendarView === 'month'
                    ? 'bg-teal-500 text-white border border-teal-500'
                    : 'bg-[#0d0d0d] text-gray-400 border border-[#27272a]'
                }`}
              >
                Month
              </button>
            </div>
          </div>

          <div className="bg-[#1a1a1a] p-3 sm:p-4 md:p-8 rounded-xl overflow-x-auto">
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
        <div className="mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-teal-400 mb-4 sm:mb-6">
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
              <p className="text-[#a1a1aa] mb-4 text-sm sm:text-base">
                No posts yet. Start by uploading your first piece of content!
              </p>
              <button onClick={() => navigate('/upload')} className="w-full sm:w-auto bg-primary-500 hover:bg-primary-600 text-white font-medium px-6 py-3 rounded-lg transition-colors">
                Upload Content
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
              {recentPosts.map((post) => (
                <div
                  key={post.id}
                  onClick={() => navigate(`/schedule?edit=${post.id}`)}
                  className="rounded-lg overflow-hidden bg-[#1a1a1a] cursor-pointer transition-all duration-300 hover:scale-[1.02]"
                  style={{ boxShadow: '0 0 10px rgba(255, 255, 255, 0.05)' }}
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

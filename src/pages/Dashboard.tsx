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
  const [calendarView, setCalendarView] = useState<'week' | 'month'>('week')
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
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#1A1F36', backgroundImage: 'radial-gradient(circle, rgba(80, 227, 194, 0.08) 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#50E3C2]"></div>
          <p className="text-sm" style={{ color: 'rgba(242, 244, 248, 0.6)' }}>Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!brand) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#1A1F36', backgroundImage: 'radial-gradient(circle, rgba(80, 227, 194, 0.08) 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
        <div className="max-w-md w-full text-center" style={{ background: '#242A45', borderRadius: '16px', padding: '40px', border: '1px solid rgba(80, 227, 194, 0.2)', boxShadow: '0 0 40px rgba(80, 227, 194, 0.1)' }}>
          <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-xl mb-6" style={{ background: 'rgba(80, 227, 194, 0.1)' }}>
            <Sparkles className="w-8 h-8" style={{ color: '#50E3C2' }} />
          </div>
          <h2 className="text-2xl font-semibold mb-2" style={{ color: '#F2F4F8' }}>Welcome to SocialAI!</h2>
          <p style={{ color: 'rgba(242, 244, 248, 0.6)', marginBottom: '24px' }}>
            Let's set up your brand profile to get started with AI-powered social media management.
          </p>
          <button onClick={() => navigate('/settings')} style={{ background: '#2979FF', color: '#FFFFFF', fontWeight: 600, padding: '12px 24px', borderRadius: '8px', width: '100%', border: 'none', cursor: 'pointer', transition: 'all 0.2s ease' }}>
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
    { label: 'Scheduled', value: scheduledPosts.length, icon: Clock, filter: 'scheduled', color: '#50E3C2' },
    { label: 'Posted', value: postedPosts.length, icon: CheckCircle2, filter: 'posted', color: '#50E3C2' },
    { label: 'Drafts', value: draftPosts.length, icon: Edit3, filter: 'draft', color: '#50E3C2' },
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
      {/* Mobile-only styles - does not affect desktop */}
      <style>{`
        @media (max-width: 639px) {
          .dashboard-container { padding: 24px 16px !important; max-width: 100vw !important; overflow-x: hidden !important; }
          .dashboard-welcome { font-size: 2rem !important; }
          .stats-grid { grid-template-columns: 1fr !important; gap: 16px !important; }
          .posts-gallery { display: grid !important; grid-template-columns: 1fr !important; gap: 12px !important; }
          .posts-gallery > div { width: 100% !important; margin: 0 !important; }
          .calendar-section { max-width: 100% !important; overflow: hidden !important; }
          .calendar-title-row { flex-direction: column !important; gap: 12px !important; align-items: flex-start !important; }
          .calendar-view-toggle button { padding: 6px 12px !important; font-size: 12px !important; }
          .calendar-container { padding: 12px !important; }
          .calendar-header { margin-bottom: 12px !important; }
          .calendar-header h3 { font-size: 14px !important; }
          .calendar-header button { padding: 6px !important; }
          .calendar-header button svg { width: 16px !important; height: 16px !important; }
          .calendar-days-header { gap: 2px !important; margin-bottom: 4px !important; }
          .calendar-days-header > div { font-size: 9px !important; padding: 4px 0 !important; }
          .calendar-grid { gap: 2px !important; }
          .calendar-day { padding: 4px !important; min-height: 50px !important; border-radius: 4px !important; }
          .calendar-day-date { font-size: 9px !important; margin-bottom: 2px !important; }
          .calendar-post-thumb { width: 24px !important; height: 24px !important; border-radius: 3px !important; }
          .calendar-post-info { display: none !important; }
          .calendar-more { font-size: 9px !important; }
        }
        @media (min-width: 640px) and (max-width: 1023px) {
          .dashboard-welcome { font-size: 3rem !important; }
        }
      `}</style>
      <div className="dashboard-container" style={{ padding: '48px 32px' }}>
        {/* Welcome Title */}
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <h1 className="dashboard-welcome" style={{
            color: '#50E3C2',
            fontSize: '4.5rem',
            fontWeight: 700,
            marginBottom: '16px',
            textShadow: '0 0 20px rgba(80, 227, 194, 0.6), 0 0 40px rgba(80, 227, 194, 0.4), 0 0 60px rgba(80, 227, 194, 0.2)'
          }}>
            Welcome back, {firstName}!
          </h1>
          <p style={{
            color: 'rgba(242, 244, 248, 0.7)',
            fontSize: '18px',
            margin: 0
          }}>
            {format(new Date(), 'EEEE, MMMM d, yyyy')}
          </p>
        </div>

        {/* AI Caption Generation Section */}
        <div style={{
          background: '#242A45',
          padding: '32px',
          borderRadius: '16px',
          marginBottom: '64px',
          textAlign: 'center',
          border: '1px solid rgba(80, 227, 194, 0.2)',
          boxShadow: '0 0 40px rgba(80, 227, 194, 0.15), 0 0 80px rgba(41, 121, 255, 0.1)'
        }}>
          <h2 style={{
            color: '#50E3C2',
            fontSize: '24px',
            fontWeight: 600,
            marginBottom: '16px'
          }}>
            AI-Powered Caption Generation
          </h2>
          <p style={{
            color: '#F2F4F8',
            fontSize: '16px',
            lineHeight: '1.7',
            marginTop: '16px',
            marginBottom: '24px'
          }}>
            Upload your media and let our AI create engaging captions optimised for your brand voice and target audience.
          </p>
          <button
            onClick={() => navigate('/upload')}
            style={{
              width: '200px',
              height: '48px',
              background: '#2979FF',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              margin: '0 auto',
              display: 'block'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#50E3C2'
              e.currentTarget.style.color = '#1A1F36'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#2979FF'
              e.currentTarget.style.color = '#FFFFFF'
            }}
          >
            Get Started
          </button>
        </div>

        {/* Stats Grid - 1x3 with white glow */}
        <div className="stats-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '24px',
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
                background: '#242A45',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(80, 227, 194, 0.2)',
                boxShadow: '0 4px 20px rgba(26, 31, 54, 0.5)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(80, 227, 194, 0.2), 0 0 40px rgba(41, 121, 255, 0.1)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(26, 31, 54, 0.5)'
              }}
            >
              {/* Gradient left border accent */}
              <div style={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: '3px',
                background: 'linear-gradient(180deg, #50E3C2 0%, #2979FF 100%)'
              }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingLeft: '8px' }}>
                <stat.icon style={{ width: '24px', height: '24px', color: '#50E3C2', flexShrink: 0 }} />
                <p style={{
                  fontSize: '13px',
                  fontWeight: 500,
                  color: 'rgba(242, 244, 248, 0.7)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  {stat.label}
                </p>
              </div>
              <p style={{
                fontSize: '28px',
                fontWeight: 700,
                color: '#F2F4F8',
                lineHeight: 1
              }}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Calendar View */}
        <div className="calendar-section" style={{ marginBottom: '64px' }}>
          <div className="calendar-title-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{
              color: '#50E3C2',
              fontSize: '24px',
              fontWeight: 600
            }}>
              Content Calendar
            </h2>

            {/* View Toggle */}
            <div className="calendar-view-toggle" style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setCalendarView('week')}
                style={{
                  padding: '8px 16px',
                  background: calendarView === 'week' ? '#2979FF' : 'transparent',
                  border: `1px solid ${calendarView === 'week' ? '#2979FF' : 'rgba(80, 227, 194, 0.3)'}`,
                  borderRadius: '8px',
                  color: calendarView === 'week' ? '#FFFFFF' : 'rgba(242, 244, 248, 0.7)',
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
                  background: calendarView === 'month' ? '#2979FF' : 'transparent',
                  border: `1px solid ${calendarView === 'month' ? '#2979FF' : 'rgba(80, 227, 194, 0.3)'}`,
                  borderRadius: '8px',
                  color: calendarView === 'month' ? '#FFFFFF' : 'rgba(242, 244, 248, 0.7)',
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

          <div className="calendar-container" style={{ background: '#242A45', padding: '32px', borderRadius: '16px', border: '1px solid rgba(80, 227, 194, 0.2)' }}>
            {/* Calendar Header */}
            <div className="calendar-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <button
                onClick={() => calendarView === 'month'
                  ? setCurrentMonth(subMonths(currentMonth, 1))
                  : setCurrentWeek(subWeeks(currentWeek, 1))
                }
                style={{
                  background: 'rgba(26, 31, 54, 0.8)',
                  border: '1px solid rgba(80, 227, 194, 0.3)',
                  borderRadius: '8px',
                  padding: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease'
                }}
              >
                <ChevronLeft style={{ width: '20px', height: '20px', color: '#50E3C2' }} />
              </button>

              <h3 style={{ color: '#F2F4F8', fontSize: '18px', fontWeight: 600 }}>
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
                  background: 'rgba(26, 31, 54, 0.8)',
                  border: '1px solid rgba(80, 227, 194, 0.3)',
                  borderRadius: '8px',
                  padding: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease'
                }}
              >
                <ChevronRight style={{ width: '20px', height: '20px', color: '#50E3C2' }} />
              </button>
            </div>

            {/* Days of Week */}
            <div className="calendar-days-header" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', marginBottom: '8px' }}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} style={{
                  textAlign: 'center',
                  color: 'rgba(242, 244, 248, 0.7)',
                  fontSize: '12px',
                  fontWeight: 600,
                  padding: '8px 0'
                }}>
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="calendar-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
              {(calendarView === 'month' ? dateRange : weekDateRange).map(date => {
                const dateKey = format(date, 'yyyy-MM-dd')
                const dayPosts = postsByDate[dateKey] || []
                const isCurrentMonth = calendarView === 'month' ? isSameMonth(date, currentMonth) : true
                const isTodayDate = isToday(date)
                const maxPosts = calendarView === 'week' ? 3 : 2

                return (
                  <div
                    key={dateKey}
                    className="calendar-day"
                    style={{
                      background: isTodayDate ? '#2979FF' : 'rgba(26, 31, 54, 0.8)',
                      border: isTodayDate ? '2px solid #2979FF' : '1px solid rgba(80, 227, 194, 0.15)',
                      borderRadius: '8px',
                      padding: '12px',
                      minHeight: calendarView === 'week' ? '150px' : '100px',
                      opacity: isCurrentMonth ? 1 : 0.4
                    }}
                  >
                    <div className="calendar-day-date" style={{
                      color: isTodayDate ? '#FFFFFF' : 'rgba(242, 244, 248, 0.6)',
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
                              className="calendar-post-thumb"
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
                              background: post.status === 'posted' ? '#50E3C2' :
                                         post.status === 'scheduled' ? '#2979FF' :
                                         'rgba(242, 244, 248, 0.4)',
                              border: '2px solid rgba(26, 31, 54, 0.8)'
                            }} />
                          </div>
                          <div className="calendar-post-info" style={{ flex: 1, minWidth: 0 }}>
                            {/* Platform names as text */}
                            <div style={{
                              color: 'rgba(242, 244, 248, 0.5)',
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
                              color: 'rgba(242, 244, 248, 0.5)',
                              fontSize: '10px',
                              marginBottom: '2px'
                            }}>
                              {post.media?.media_type === 'video' ? 'video' : 'image'}
                            </div>
                            {calendarView === 'week' && (
                              <div style={{
                                color: 'rgba(242, 244, 248, 0.6)',
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
                      <div className="calendar-more" style={{ color: '#50E3C2', fontSize: '11px', fontWeight: 500 }}>
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{
              color: '#F2F4F8',
              fontSize: '24px',
              fontWeight: 600,
              margin: 0
            }}>
              Recent Posts
            </h2>
            <button
              onClick={() => navigate('/schedule')}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#50E3C2',
                fontSize: '15px',
                fontWeight: 500,
                cursor: 'pointer',
                padding: 0,
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.textDecoration = 'underline'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.textDecoration = 'none'
              }}
            >
              View all
            </button>
          </div>

          {postsLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#50E3C2]"></div>
            </div>
          ) : recentPosts.length === 0 ? (
            <div className="text-center py-12">
              <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-xl mb-4" style={{ background: 'rgba(80, 227, 194, 0.1)' }}>
                <FileText className="w-8 h-8" style={{ color: '#50E3C2' }} />
              </div>
              <p style={{ color: 'rgba(242, 244, 248, 0.6)', marginBottom: '16px' }}>
                No posts yet. Start by uploading your first piece of content!
              </p>
              <button onClick={() => navigate('/upload')} style={{ background: '#2979FF', color: '#FFFFFF', fontWeight: 600, padding: '12px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer', transition: 'all 0.2s ease' }}>
                Upload Content
              </button>
            </div>
          ) : (
            <div className="posts-gallery" style={{
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
                    borderRadius: '16px',
                    overflow: 'hidden',
                    background: '#242A45',
                    border: '1px solid rgba(80, 227, 194, 0.2)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 20px rgba(26, 31, 54, 0.5)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 8px 30px rgba(80, 227, 194, 0.2), 0 0 40px rgba(41, 121, 255, 0.1)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(26, 31, 54, 0.5)'
                  }}
                >
                  {/* Image/Video Thumbnail */}
                  <div style={{ aspectRatio: '1 / 1', position: 'relative', background: 'rgba(26, 31, 54, 0.8)' }}>
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
                        background: 'rgba(26, 31, 54, 0.9)',
                        borderRadius: '4px',
                        padding: '4px 8px',
                        fontSize: '10px',
                        color: '#50E3C2',
                        fontWeight: 500
                      }}>
                        VIDEO
                      </div>
                    )}
                  </div>

                  {/* Info Card */}
                  <div style={{
                    background: '#242A45',
                    padding: '12px'
                  }}>
                    {/* Caption Preview */}
                    <p style={{
                      color: '#F2F4F8',
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
                        background: post.status === 'posted' ? 'rgba(80, 227, 194, 0.2)' :
                                    post.status === 'scheduled' ? 'rgba(41, 121, 255, 0.2)' :
                                    'rgba(242, 244, 248, 0.1)',
                        color: post.status === 'posted' ? '#50E3C2' :
                               post.status === 'scheduled' ? '#2979FF' :
                               'rgba(242, 244, 248, 0.6)'
                      }}>
                        {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                      </span>

                      {/* Platform Names */}
                      {post.platforms && post.platforms.length > 0 && (
                        <span style={{
                          fontSize: '10px',
                          color: 'rgba(242, 244, 248, 0.6)',
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(26, 31, 54, 0.9)', backdropFilter: 'blur(8px)' }}
            onClick={() => setSelectedPost(null)}
          >
            <div
              style={{ background: '#242A45', borderRadius: '16px', border: '1px solid rgba(80, 227, 194, 0.2)', boxShadow: '0 0 60px rgba(80, 227, 194, 0.15)' }}
              className="max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 flex items-center justify-between z-10" style={{ padding: '32px', background: '#242A45', borderBottom: '1px solid rgba(80, 227, 194, 0.2)' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#F2F4F8' }}>Post Details</h3>
                <button
                  onClick={() => setSelectedPost(null)}
                  className="unstyled p-2 rounded-lg transition-colors"
                  style={{ background: 'transparent', border: 'none', color: 'rgba(242, 244, 248, 0.6)' }}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {selectedPost.media && (
                  <div style={{ borderRadius: '12px', overflow: 'hidden', background: 'rgba(26, 31, 54, 0.8)' }}>
                    <img
                      src={`${selectedPost.media.cloudinary_url}?w=1200&h=800&c_limit&q=90&f_auto`}
                      alt="Post media"
                      className="w-full max-h-96 object-contain mx-auto"
                    />
                  </div>
                )}

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(242, 244, 248, 0.6)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '8px' }}>Status</label>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 500,
                    background: selectedPost.status === 'posted' ? 'rgba(80, 227, 194, 0.2)' :
                               selectedPost.status === 'scheduled' ? 'rgba(41, 121, 255, 0.2)' :
                               'rgba(242, 244, 248, 0.1)',
                    color: selectedPost.status === 'posted' ? '#50E3C2' :
                           selectedPost.status === 'scheduled' ? '#2979FF' :
                           'rgba(242, 244, 248, 0.6)',
                    border: `1px solid ${selectedPost.status === 'posted' ? 'rgba(80, 227, 194, 0.3)' :
                                          selectedPost.status === 'scheduled' ? 'rgba(41, 121, 255, 0.3)' :
                                          'rgba(242, 244, 248, 0.2)'}`
                  }}>
                    {selectedPost.status === 'posted' && <CheckCircle2 className="w-3 h-3" />}
                    {selectedPost.status === 'scheduled' && <Clock className="w-3 h-3" />}
                    {selectedPost.status.charAt(0).toUpperCase() + selectedPost.status.slice(1)}
                  </span>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(242, 244, 248, 0.6)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '8px' }}>Caption</label>
                  <p style={{ color: '#F2F4F8', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                    {selectedPost.final_caption || selectedPost.generated_caption || 'No caption available'}
                  </p>
                </div>

                {selectedPost.hashtags && selectedPost.hashtags.length > 0 && (
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(242, 244, 248, 0.6)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
                      <Hash className="w-3 h-3" />
                      Hashtags
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {selectedPost.hashtags.map((tag: string, idx: number) => (
                        <span key={idx} style={{
                          padding: '6px 12px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: 500,
                          background: 'rgba(41, 121, 255, 0.2)',
                          color: '#2979FF',
                          border: '1px solid rgba(41, 121, 255, 0.3)'
                        }}>
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedPost.scheduled_for && (
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(242, 244, 248, 0.6)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '8px' }}>Scheduled For</label>
                    <p style={{ color: '#F2F4F8' }}>
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

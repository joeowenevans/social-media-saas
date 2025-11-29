import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useBrand } from '../hooks/useBrand'
import { usePosts } from '../hooks/usePosts'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { AppLayout } from '../components/layout/AppLayout'
import {
  Calendar as CalendarIcon,
  Clock,
  Trash2,
  Send,
  Edit2,
  ChevronLeft,
  ChevronRight,
  X,
  Sparkles,
  AlertCircle
} from 'lucide-react'
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
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

type Platform = 'instagram' | 'facebook' | 'pinterest'

interface Post {
  id: string
  final_caption: string
  scheduled_for: string
  platforms: string[]
  status: string
  media: {
    id: string
    cloudinary_url: string
    thumbnail_url: string
    media_type: string
  }
}

export function Schedule() {
  const { user } = useAuth()
  const { brand, loading } = useBrand(user?.id)
  const { posts, loading: postsLoading, refetch } = usePosts(brand?.id)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedPlatform, setSelectedPlatform] = useState<'all' | Platform>('all')
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'scheduled' | 'posted' | 'draft'>('all')
  const [posting, setPosting] = useState<string | null>(null)
  const [editingPost, setEditingPost] = useState<Post | null>(null)
  const [postToConfirm, setPostToConfirm] = useState<string | null>(null)
  const [editFormData, setEditFormData] = useState({
    caption: '',
    scheduled_date: '',
    scheduled_time: '',
    platforms: [] as string[]
  })

  // Handle URL parameter for status filter
  useEffect(() => {
    const statusParam = searchParams.get('status')
    if (statusParam && ['all', 'scheduled', 'posted', 'draft'].includes(statusParam)) {
      setSelectedStatus(statusParam as any)
    }
  }, [searchParams])

  // Filter by status first
  const statusFilteredPosts = selectedStatus === 'all'
    ? posts
    : posts.filter((p) => p.status === selectedStatus)

  // Then apply platform filter
  const filteredPosts = selectedPlatform === 'all'
    ? statusFilteredPosts
    : statusFilteredPosts.filter(p => p.platforms?.includes(selectedPlatform))

  // Sort by date (earliest first)
  const sortedPosts = [...filteredPosts].sort((a: any, b: any) => {
    if (!a.scheduled_for || !b.scheduled_for) return 0
    return new Date(a.scheduled_for).getTime() - new Date(b.scheduled_for).getTime()
  })

  // Group posts by date for calendar (use filtered posts)
  const postsByDate = filteredPosts.reduce((acc: any, post) => {
    if (post.scheduled_for) {
      const dateKey = format(new Date(post.scheduled_for), 'yyyy-MM-dd')
      if (!acc[dateKey]) acc[dateKey] = []
      acc[dateKey].push(post)
    }
    return acc
  }, {})

  // Generate calendar grid
  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const startDate = startOfWeek(monthStart)
  const endDate = endOfWeek(monthEnd)
  const dateRange = eachDayOfInterval({ start: startDate, end: endDate })

  const getPlatformColor = (platform: string) => {
    if (platform === 'instagram') return '#E1306C'
    if (platform === 'facebook') return '#1877F2'
    if (platform === 'pinterest') return '#E60023'
    return '#14b8a6'
  }

  const confirmPostNow = async () => {
    if (!postToConfirm) return

    setPosting(postToConfirm)
    setPostToConfirm(null) // Close modal

    try {
      console.log('Fetching post data for Post Now...')

      // Fetch post with joined media data using proper foreign key syntax
      const { data: postData, error: fetchError } = await supabase
        .from('posts')
        .select(`
          *,
          media:media_id (
            cloudinary_url,
            media_type,
            cloudinary_public_id,
            thumbnail_url
          )
        `)
        .eq('id', postToConfirm)
        .single()

      if (fetchError) throw fetchError
      if (!postData) throw new Error('Post not found')

      console.log('Post data fetched:', postData)

      // Prepare data for n8n webhook
      const webhookPayload = {
        caption: postData.final_caption || postData.generated_caption,
        media_url: postData.media?.cloudinary_url,
        media_type: postData.media?.media_type,
        platforms: postData.platforms || []
      }

      console.log('Calling n8n webhook:', webhookPayload)

      // Validate required fields before calling webhook
      if (!webhookPayload.media_url) {
        throw new Error('Media URL not found - post may be missing media')
      }
      if (!webhookPayload.caption) {
        throw new Error('Caption not found - please add a caption to this post')
      }
      if (!webhookPayload.platforms || webhookPayload.platforms.length === 0) {
        throw new Error('No platforms selected - please select at least one platform')
      }

      // Call n8n workflow to post instantly
      const response = await fetch('https://n8n-latest-8yp2.onrender.com/webhook/post-instant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(webhookPayload)
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('n8n webhook error:', errorText)
        throw new Error(`Webhook failed: ${response.status} - ${errorText}`)
      }

      const result = await response.json()
      console.log('Post result:', result)

      // Update post status in database
      const { error: updateError } = await supabase
        .from('posts')
        .update({
          status: 'posted',
          posted_at: new Date().toISOString()
        })
        .eq('id', postToConfirm)

      if (updateError) throw updateError

      toast.success('Posted successfully!')
      refetch()
    } catch (error: any) {
      console.error('Post now error:', error)
      toast.error(error.message || 'Failed to post')
    } finally {
      setPosting(null)
    }
  }

  const handleDelete = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this scheduled post?')) return

    try {
      const { error } = await supabase.from('posts').delete().eq('id', postId)
      if (error) throw error
      toast.success('Post deleted')
      refetch()
    } catch (error: any) {
      toast.error('Failed to delete post')
    }
  }

  const handleEdit = (post: Post) => {
    const date = new Date(post.scheduled_for)
    setEditFormData({
      caption: post.final_caption,
      scheduled_date: format(date, 'yyyy-MM-dd'),
      scheduled_time: format(date, 'HH:mm'),
      platforms: post.platforms || []
    })
    setEditingPost(post)
  }

  const handleSaveEdit = async () => {
    if (!editingPost) return

    // Validate date and time
    if (!editFormData.scheduled_date || !editFormData.scheduled_time) {
      toast.error('Please select both date and time')
      return
    }

    const scheduledDateTime = new Date(`${editFormData.scheduled_date}T${editFormData.scheduled_time}`)
    const now = new Date()

    // Validate future date
    if (scheduledDateTime <= now) {
      toast.error('Please select a future date and time')
      return
    }

    try {
      const { error } = await supabase
        .from('posts')
        .update({
          final_caption: editFormData.caption,
          scheduled_for: scheduledDateTime.toISOString(),
          platforms: editFormData.platforms
        })
        .eq('id', editingPost.id)

      if (error) throw error

      toast.success('Post updated successfully!')
      setEditingPost(null)
      refetch()
    } catch (error: any) {
      toast.error('Failed to update post')
    }
  }

  const togglePlatform = (platform: string) => {
    setEditFormData(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform]
    }))
  }

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 200px)' }}>
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#14b8a6]"></div>
            <p style={{ color: '#a1a1aa', fontSize: '14px' }}>Loading...</p>
          </div>
        </div>
      </AppLayout>
    )
  }

  if (!brand) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 200px)' }}>
          <div style={{ maxWidth: '500px', background: '#1a1a1a', borderRadius: '12px', padding: '48px', textAlign: 'center' }}>
            <div style={{
              width: '64px',
              height: '64px',
              margin: '0 auto 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)'
            }}>
              <Sparkles style={{ width: '32px', height: '32px', color: 'white' }} />
            </div>
            <h2 style={{ color: 'white', fontSize: '24px', fontWeight: 600, marginBottom: '16px' }}>Brand Profile Required</h2>
            <p style={{ color: '#888', fontSize: '16px', marginBottom: '32px' }}>
              Please create a brand profile first to use this feature.
            </p>
            <button
              onClick={() => navigate('/settings')}
              style={{
                width: '100%',
                padding: '12px 24px',
                background: '#14b8a6',
                color: 'white',
                fontSize: '16px',
                fontWeight: 600,
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Create Brand Profile
            </button>
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 32px' }}>
        {/* Page Title Card with Teal Glow */}
        <div style={{
          background: '#1a1a1a',
          borderRadius: '12px',
          padding: '32px',
          marginBottom: '48px',
          boxShadow: '0 0 30px rgba(20, 184, 166, 0.2), 0 0 60px rgba(20, 184, 166, 0.1)',
          textAlign: 'center'
        }}>
          <h1 style={{
            color: '#14b8a6',
            fontSize: '32px',
            fontWeight: 700,
            marginBottom: '12px'
          }}>
            Scheduled Posts
          </h1>
          <p style={{
            color: '#888',
            fontSize: '16px',
            margin: 0
          }}>
            Plan and edit your scheduled content
          </p>
        </div>

        {/* Side-by-Side Filters */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px',
          gap: '24px',
          flexWrap: 'wrap'
        }}>
          {/* Status Filter - Left */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {[
              { id: 'all', label: 'All', color: '#14b8a6' },
              { id: 'scheduled', label: 'Scheduled', color: '#14b8a6' },
              { id: 'posted', label: 'Posted', color: '#14b8a6' },
              { id: 'draft', label: 'Drafts', color: '#14b8a6' }
            ].map(status => (
              <button
                key={status.id}
                onClick={() => setSelectedStatus(status.id as any)}
                style={{
                  background: selectedStatus === status.id ? status.color : '#1a1a1a',
                  border: `1px solid ${selectedStatus === status.id ? status.color : '#27272a'}`,
                  borderRadius: '20px',
                  padding: '10px 24px',
                  color: selectedStatus === status.id ? 'white' : '#888',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {status.label}
              </button>
            ))}
          </div>

          {/* Platform Filter - Right */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {[
              { id: 'all', label: 'All', color: '#14b8a6' },
              { id: 'instagram', label: 'Instagram', color: '#E1306C' },
              { id: 'facebook', label: 'Facebook', color: '#1877F2' },
              { id: 'pinterest', label: 'Pinterest', color: '#E60023' }
            ].map(platform => (
              <button
                key={platform.id}
                onClick={() => setSelectedPlatform(platform.id as any)}
                style={{
                  background: selectedPlatform === platform.id ? platform.color : '#1a1a1a',
                  border: `1px solid ${selectedPlatform === platform.id ? platform.color : '#27272a'}`,
                  borderRadius: '20px',
                  padding: '10px 24px',
                  color: selectedPlatform === platform.id ? 'white' : '#888',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {platform.label}
              </button>
            ))}
          </div>
        </div>

        {/* Scheduled Posts Section */}
        <h2 style={{
          color: '#14b8a6',
          fontSize: '24px',
          fontWeight: 600,
          marginBottom: '32px',
          textAlign: 'left'
        }}>
          Your Scheduled Posts
        </h2>

        {/* Gallery Layout */}
        {postsLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#14b8a6]"></div>
          </div>
        ) : sortedPosts.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '64px 32px',
            background: '#1a1a1a',
            borderRadius: '12px'
          }}>
            <CalendarIcon style={{ width: '48px', height: '48px', color: '#666', margin: '0 auto 16px' }} />
            <p style={{ color: '#666', fontSize: '16px', marginBottom: '24px' }}>
              No scheduled posts yet
            </p>
            <button
              onClick={() => navigate('/upload')}
              style={{
                padding: '12px 32px',
                background: '#14b8a6',
                color: 'white',
                fontSize: '16px',
                fontWeight: 600,
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Schedule a Post
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '24px'
          }}>
            {sortedPosts.map((post: any) => (
              <div
                key={post.id}
                style={{
                  borderRadius: '12px',
                  overflow: 'hidden',
                  minHeight: '600px',
                  display: 'flex',
                  flexDirection: 'column',
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
                {/* Image */}
                <div style={{
                  aspectRatio: '1 / 1',
                  overflow: 'hidden',
                  position: 'relative',
                  background: '#1a1a1a'
                }}>
                  {post.media?.media_type === 'video' ? (
                    <video
                      src={post.media.cloudinary_url}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  ) : (
                    <img
                      src={post.media?.cloudinary_url}
                      alt=""
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  )}
                </div>

                {/* Info Card */}
                <div style={{
                  background: '#1a1a1a',
                  borderTop: '1px solid #27272a',
                  padding: '20px',
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  {/* Status and Platform - Repositioned */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      background: post.status === 'posted' ? 'rgba(16, 185, 129, 0.2)' :
                                  post.status === 'scheduled' ? 'rgba(20, 184, 166, 0.2)' :
                                  'rgba(107, 114, 128, 0.2)',
                      color: post.status === 'posted' ? '#10b981' :
                             post.status === 'scheduled' ? '#14b8a6' :
                             '#888'
                    }}>
                      {post.status}
                    </span>

                    {/* Platform Names */}
                    {post.platforms && post.platforms.length > 0 && (
                      <span style={{
                        fontSize: '11px',
                        color: '#888',
                        fontWeight: 500
                      }}>
                        {post.platforms.slice(0, 2).map((p: string) => p.charAt(0).toUpperCase() + p.slice(1)).join(', ')}
                        {post.platforms.length > 2 && ` +${post.platforms.length - 2}`}
                      </span>
                    )}
                  </div>

                  {/* Caption */}
                  <p style={{
                    color: '#e5e5e5',
                    fontSize: '14px',
                    lineHeight: 1.5,
                    height: '60px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    marginBottom: '12px',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical'
                  }}>
                    {post.final_caption}
                  </p>

                  {/* Date & Time - Only show for scheduled and posted */}
                  {post.status !== 'draft' && post.scheduled_for && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <CalendarIcon style={{ width: '14px', height: '14px', color: '#14b8a6' }} />
                        <span style={{ color: '#14b8a6', fontSize: '13px' }}>
                          {format(new Date(post.scheduled_for), 'MMM dd, yyyy')}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Clock style={{ width: '14px', height: '14px', color: '#888' }} />
                        <span style={{ color: '#888', fontSize: '13px' }}>
                          {format(new Date(post.scheduled_for), 'HH:mm')}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                    <button
                      onClick={() => handleEdit(post)}
                      style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        padding: '10px',
                        background: '#2a2a2a',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: 500,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#14b8a6'}
                      onMouseLeave={(e) => e.currentTarget.style.background = '#2a2a2a'}
                    >
                      <Edit2 style={{ width: '16px', height: '16px' }} />
                      Edit
                    </button>

                    <button
                      onClick={() => setPostToConfirm(post.id)}
                      disabled={posting === post.id}
                      style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        padding: '10px',
                        background: '#2a2a2a',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: 500,
                        cursor: posting === post.id ? 'not-allowed' : 'pointer',
                        opacity: posting === post.id ? 0.6 : 1,
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        if (posting !== post.id) e.currentTarget.style.background = '#14b8a6'
                      }}
                      onMouseLeave={(e) => e.currentTarget.style.background = '#2a2a2a'}
                    >
                      {posting === post.id ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Posting...
                        </>
                      ) : (
                        <>
                          <Send style={{ width: '16px', height: '16px' }} />
                          Post Now
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleDelete(post.id)}
                      style={{
                        padding: '10px',
                        background: '#2a2a2a',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#ef4444'}
                      onMouseLeave={(e) => e.currentTarget.style.background = '#2a2a2a'}
                    >
                      <Trash2 style={{ width: '16px', height: '16px' }} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Content Calendar Section - Moved to Bottom */}
        <div style={{ marginTop: '64px' }}>
          <h2 style={{
            color: '#14b8a6',
            fontSize: '24px',
            fontWeight: 600,
            marginBottom: '24px'
          }}>
            Content Calendar
          </h2>

          <div style={{ background: '#1a1a1a', padding: '32px', borderRadius: '12px' }}>
            {/* Calendar Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <button
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
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
                {format(currentMonth, 'MMMM yyyy')}
              </h3>

              <button
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
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
              {dateRange.map(date => {
                const dateKey = format(date, 'yyyy-MM-dd')
                const dayPosts = postsByDate[dateKey] || []
                const isCurrentMonth = isSameMonth(date, currentMonth)

                return (
                  <div
                    key={dateKey}
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
                                    background: getPlatformColor(platform)
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
      </div>

      {/* Post Now Confirmation Modal */}
      {postToConfirm && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '24px'
          }}
          onClick={() => setPostToConfirm(null)}
        >
          <div
            style={{
              maxWidth: '450px',
              background: '#1a1a1a',
              border: '1px solid #27272a',
              borderRadius: '16px',
              padding: '40px',
              boxShadow: '0 0 60px rgba(0, 0, 0, 0.8)',
              textAlign: 'center'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Icon */}
            <div style={{
              width: '48px',
              height: '48px',
              margin: '0 auto 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              background: 'rgba(20, 184, 166, 0.1)'
            }}>
              <AlertCircle style={{ width: '28px', height: '28px', color: '#14b8a6' }} />
            </div>

            {/* Title */}
            <h2 style={{
              color: '#ffffff',
              fontSize: '24px',
              fontWeight: 700,
              marginBottom: '16px'
            }}>
              Post Now?
            </h2>

            {/* Message */}
            <p style={{
              color: '#888',
              fontSize: '15px',
              lineHeight: 1.6,
              marginBottom: '32px'
            }}>
              This will immediately post your content to the selected platforms. This action cannot be undone.
            </p>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={() => setPostToConfirm(null)}
                style={{
                  background: '#2a2a2a',
                  color: '#e5e5e5',
                  padding: '12px 32px',
                  borderRadius: '20px',
                  fontWeight: 500,
                  fontSize: '15px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#333'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#2a2a2a'}
              >
                Cancel
              </button>
              <button
                onClick={confirmPostNow}
                style={{
                  background: '#14b8a6',
                  color: 'white',
                  padding: '12px 32px',
                  borderRadius: '20px',
                  fontWeight: 600,
                  fontSize: '15px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#10a896'
                  e.currentTarget.style.transform = 'scale(1.02)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#14b8a6'
                  e.currentTarget.style.transform = 'scale(1)'
                }}
              >
                Yes, Post Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal - Cleaned Up Design */}
      {editingPost && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '24px'
          }}
          onClick={() => setEditingPost(null)}
        >
          <div
            style={{
              background: '#1a1a1a',
              borderRadius: '16px',
              padding: '40px',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 0 60px rgba(0, 0, 0, 0.5)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
              <h2 style={{ color: '#14b8a6', fontSize: '28px', fontWeight: 700, margin: 0 }}>
                Edit Scheduled Post
              </h2>
              <button
                onClick={() => setEditingPost(null)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  transition: 'color 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#888'}
              >
                <X style={{ width: '24px', height: '24px', color: '#888' }} />
              </button>
            </div>

            {/* Thumbnail Preview */}
            <div style={{ marginBottom: '32px', textAlign: 'center' }}>
              <img
                src={editingPost.media?.thumbnail_url || editingPost.media?.cloudinary_url}
                alt="Preview"
                style={{
                  maxWidth: '200px',
                  maxHeight: '200px',
                  objectFit: 'cover',
                  borderRadius: '12px'
                }}
              />
            </div>

            {/* Caption */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ color: '#e5e5e5', fontSize: '14px', fontWeight: 500, display: 'block', marginBottom: '8px' }}>
                Caption
              </label>
              <textarea
                value={editFormData.caption}
                onChange={(e) => setEditFormData({ ...editFormData, caption: e.target.value })}
                style={{
                  width: '100%',
                  minHeight: '120px',
                  background: '#1a1a1a',
                  border: '1px solid #27272a',
                  borderRadius: '12px',
                  padding: '16px',
                  color: '#e5e5e5',
                  fontSize: '15px',
                  lineHeight: '1.6',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                  outline: 'none',
                  resize: 'vertical',
                  transition: 'border-color 0.2s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = '#14b8a6'}
                onBlur={(e) => e.target.style.borderColor = '#27272a'}
              />
            </div>

            {/* Date & Time */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ color: '#e5e5e5', fontSize: '14px', fontWeight: 500, display: 'block', marginBottom: '8px' }}>
                  Date
                </label>
                <input
                  type="date"
                  value={editFormData.scheduled_date}
                  onChange={(e) => setEditFormData({ ...editFormData, scheduled_date: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  style={{
                    width: '100%',
                    height: '44px',
                    background: '#1a1a1a',
                    border: '1px solid #27272a',
                    borderRadius: '12px',
                    padding: '12px 16px',
                    color: '#e5e5e5',
                    fontSize: '15px',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#14b8a6'}
                  onBlur={(e) => e.target.style.borderColor = '#27272a'}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ color: '#e5e5e5', fontSize: '14px', fontWeight: 500, display: 'block', marginBottom: '8px' }}>
                  Time
                </label>
                <input
                  type="time"
                  value={editFormData.scheduled_time}
                  onChange={(e) => setEditFormData({ ...editFormData, scheduled_time: e.target.value })}
                  style={{
                    width: '100%',
                    height: '44px',
                    background: '#1a1a1a',
                    border: '1px solid #27272a',
                    borderRadius: '12px',
                    padding: '12px 16px',
                    color: '#e5e5e5',
                    fontSize: '15px',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#14b8a6'}
                  onBlur={(e) => e.target.style.borderColor = '#27272a'}
                />
              </div>
            </div>

            {/* Platforms */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{ color: '#e5e5e5', fontSize: '14px', fontWeight: 500, display: 'block', marginBottom: '12px' }}>
                Platforms
              </label>
              <div style={{ display: 'flex', gap: '12px' }}>
                {[
                  { id: 'instagram', label: 'Instagram', color: '#E1306C' },
                  { id: 'facebook', label: 'Facebook', color: '#1877F2' },
                  { id: 'pinterest', label: 'Pinterest', color: '#E60023' }
                ].map(platform => (
                  <label
                    key={platform.id}
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '12px 16px',
                      background: '#1a1a1a',
                      border: editFormData.platforms.includes(platform.id) ? `1px solid ${platform.color}` : '1px solid #27272a',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={editFormData.platforms.includes(platform.id)}
                      onChange={() => togglePlatform(platform.id)}
                      style={{
                        width: '18px',
                        height: '18px',
                        accentColor: platform.color,
                        cursor: 'pointer'
                      }}
                    />
                    <span style={{ color: '#e5e5e5', fontSize: '14px', fontWeight: 500 }}>
                      {platform.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'space-between' }}>
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
                    handleDelete(editingPost.id)
                    setEditingPost(null)
                  }
                }}
                style={{
                  padding: '12px 24px',
                  background: '#2a2a2a',
                  color: '#ef4444',
                  fontSize: '16px',
                  fontWeight: 600,
                  border: '1px solid #ef4444',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#ef4444'
                  e.currentTarget.style.color = 'white'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#2a2a2a'
                  e.currentTarget.style.color = '#ef4444'
                }}
              >
                Delete Post
              </button>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => setEditingPost(null)}
                  style={{
                    padding: '12px 24px',
                    background: '#2a2a2a',
                    color: 'white',
                    fontSize: '16px',
                    fontWeight: 600,
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#333'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#2a2a2a'}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  style={{
                    padding: '12px 32px',
                    background: '#14b8a6',
                    color: 'white',
                    fontSize: '16px',
                    fontWeight: 600,
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#10a896'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#14b8a6'}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  )
}

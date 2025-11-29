import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useBrand } from '../hooks/useBrand'
import { usePosts } from '../hooks/usePosts'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { AppLayout } from '../components/layout/AppLayout'
import {
  Calendar as CalendarIcon,
  Clock,
  Send,
  ChevronLeft,
  ChevronRight,
  X,
  Sparkles,
  AlertCircle,
  Video,
  Image as ImageIcon
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
  isSameMonth,
  isSameDay,
  isToday,
  isBefore,
  startOfDay,
  addWeeks,
  subWeeks
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

  // Edit modal calendar state
  const [editCalendarMonth, setEditCalendarMonth] = useState(new Date())
  const [editSelectedDate, setEditSelectedDate] = useState<Date | null>(null)
  const [editSelectedTime, setEditSelectedTime] = useState<string>('12:00')

  // Lightbox and delete confirmation state
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [postToDelete, setPostToDelete] = useState<string | null>(null)

  // Calendar view toggle (week/month)
  const [calendarView, setCalendarView] = useState<'week' | 'month'>('month')
  const [currentWeek, setCurrentWeek] = useState(new Date())

  // Handle URL parameter for status filter
  useEffect(() => {
    const statusParam = searchParams.get('status')
    if (statusParam && ['all', 'scheduled', 'posted', 'draft'].includes(statusParam)) {
      setSelectedStatus(statusParam as any)
    }
  }, [searchParams])

  // Handle URL parameter for edit modal (from Dashboard click)
  useEffect(() => {
    const editPostId = searchParams.get('edit')
    if (editPostId && posts.length > 0) {
      const postToEdit = posts.find((p: any) => p.id === editPostId)
      if (postToEdit) {
        handleEdit(postToEdit as Post)
        // Clear the URL parameter after opening modal
        const newParams = new URLSearchParams(searchParams)
        newParams.delete('edit')
        window.history.replaceState({}, '', `${window.location.pathname}${newParams.toString() ? '?' + newParams.toString() : ''}`)
      }
    }
  }, [searchParams, posts])

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

  // Generate calendar grid for month view
  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const startDate = startOfWeek(monthStart)
  const endDate = endOfWeek(monthEnd)
  const dateRange = eachDayOfInterval({ start: startDate, end: endDate })

  // Generate calendar grid for week view
  const weekStart = startOfWeek(currentWeek)
  const weekEnd = endOfWeek(currentWeek)
  const weekDateRange = eachDayOfInterval({ start: weekStart, end: weekEnd })

  const getPlatformColor = (platform: string) => {
    if (platform === 'instagram') return '#E1306C'
    if (platform === 'facebook') return '#1877F2'
    if (platform === 'pinterest') return '#E60023'
    return '#14b8a6'
  }

  // Helper function to get proper thumbnail URL for videos
  // Handles both new uploads (correct thumbnail_url) and legacy data (video URL in thumbnail_url)
  const getMediaThumbnail = (media: any) => {
    if (!media) return null

    // Check if thumbnail_url exists and is actually an image (not a video file)
    const videoExtensions = ['.mp4', '.mov', '.avi', '.webm', '.mkv']
    const hasValidThumbnail = media.thumbnail_url &&
      !videoExtensions.some(ext => media.thumbnail_url.toLowerCase().endsWith(ext))

    if (hasValidThumbnail) {
      return media.thumbnail_url
    }

    // For videos, generate thumbnail from Cloudinary URL
    const videoUrl = media.thumbnail_url?.includes('/video/upload/')
      ? media.thumbnail_url
      : media.cloudinary_url

    if (media.media_type === 'video' && videoUrl?.includes('/video/upload/')) {
      return videoUrl
        .replace('/video/upload/', '/video/upload/so_0,f_jpg,w_400,h_400,c_fill/')
        .replace(/\.[^/.]+$/, '.jpg')
    }

    return media.cloudinary_url
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
    // Fix for drafts with invalid dates - default to today if scheduled_for is null or before year 2000
    let date: Date
    const scheduledDate = post.scheduled_for ? new Date(post.scheduled_for) : null
    const isValidDate = scheduledDate && scheduledDate.getFullYear() >= 2000

    if (isValidDate) {
      date = scheduledDate
    } else {
      // Default to today at noon for drafts with invalid dates
      date = new Date()
      date.setHours(12, 0, 0, 0)
    }

    const timeHour = date.getHours()
    const roundedTime = `${timeHour.toString().padStart(2, '0')}:00`

    setEditFormData({
      caption: post.final_caption,
      scheduled_date: format(date, 'yyyy-MM-dd'),
      scheduled_time: roundedTime,
      platforms: post.platforms || []
    })
    setEditSelectedDate(date)
    setEditSelectedTime(roundedTime)
    setEditCalendarMonth(date)
    setEditingPost(post)
  }

  // Generate time options in hourly intervals for edit modal
  const editTimeOptions = Array.from({ length: 24 }, (_, i) => {
    const time24 = `${i.toString().padStart(2, '0')}:00`
    const dateObj = new Date(`2000-01-01T${time24}`)
    const time12 = format(dateObj, 'h:mm a')
    return { value: time24, label: time12 }
  })

  // Format the selected date/time for edit modal display
  const editFormattedDateTime = editSelectedDate
    ? `${format(editSelectedDate, 'MMM d, yyyy')} at ${format(new Date(`2000-01-01T${editSelectedTime}`), 'h:mm a')}`
    : null

  // Generate edit modal calendar grid
  const editMonthStart = startOfMonth(editCalendarMonth)
  const editMonthEnd = endOfMonth(editCalendarMonth)
  const editCalendarStart = startOfWeek(editMonthStart)
  const editCalendarEnd = endOfWeek(editMonthEnd)
  const editDateRange = eachDayOfInterval({ start: editCalendarStart, end: editCalendarEnd })

  // Sync edit form data when date/time selection changes
  useEffect(() => {
    if (editSelectedDate && editSelectedTime) {
      setEditFormData(prev => ({
        ...prev,
        scheduled_date: format(editSelectedDate, 'yyyy-MM-dd'),
        scheduled_time: editSelectedTime
      }))
    }
  }, [editSelectedDate, editSelectedTime])

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
      {/* Mobile-only styles - does not affect desktop */}
      <style>{`
        @media (max-width: 639px) {
          .schedule-container { padding: 24px 16px !important; }
          .schedule-title { font-size: 24px !important; }
          .schedule-filters { flex-direction: column !important; gap: 16px !important; }
          .status-filter { flex-wrap: wrap !important; gap: 8px !important; }
          .status-filter button { padding: 8px 16px !important; font-size: 12px !important; }
          .platform-filter { flex-wrap: wrap !important; gap: 8px !important; }
          .platform-filter button { padding: 8px 16px !important; font-size: 12px !important; }
          .posts-grid { grid-template-columns: 1fr !important; }
          .posts-grid > div { min-height: auto !important; }
          .schedule-calendar-section { margin-top: 48px !important; }
          .schedule-calendar-title-row { flex-direction: column !important; gap: 12px !important; align-items: flex-start !important; }
          .schedule-calendar-container { padding: 12px !important; }
          .schedule-calendar-header { margin-bottom: 12px !important; }
          .schedule-calendar-header h3 { font-size: 14px !important; }
          .schedule-calendar-days-header { gap: 2px !important; }
          .schedule-calendar-days-header > div { font-size: 9px !important; }
          .schedule-calendar-grid { gap: 2px !important; }
          .schedule-calendar-day { padding: 4px !important; min-height: 50px !important; }
          .schedule-calendar-day > div:first-child { font-size: 9px !important; }
          .schedule-calendar-thumb { width: 24px !important; height: 24px !important; }
          .schedule-calendar-post-info { display: none !important; }
          .edit-modal { padding: 24px !important; max-width: 95vw !important; }
          .edit-modal-actions { flex-direction: column !important; gap: 12px !important; }
          .edit-modal-actions > div { width: 100% !important; justify-content: center !important; }
          .edit-modal-actions button { flex: 1 !important; }
        }
      `}</style>
      <div className="schedule-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 32px' }}>
        {/* Page Title with Teal Text Glow */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1 style={{
            color: '#14b8a6',
            fontSize: '32px',
            fontWeight: 700,
            marginBottom: '12px',
            textShadow: '0 0 20px rgba(20, 184, 166, 0.6), 0 0 40px rgba(20, 184, 166, 0.4), 0 0 60px rgba(20, 184, 166, 0.2)'
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
        <div className="schedule-filters" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px',
          gap: '24px',
          flexWrap: 'wrap'
        }}>
          {/* Status Filter - Left */}
          <div className="status-filter" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
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
          <div className="platform-filter" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
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
          <div className="posts-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '24px'
          }}>
            {sortedPosts.map((post: any) => (
              <div
                key={post.id}
                onClick={() => handleEdit(post)}
                style={{
                  borderRadius: '12px',
                  overflow: 'hidden',
                  minHeight: '500px',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 0 10px rgba(255, 255, 255, 0.05)',
                  cursor: 'pointer'
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
                  {/* Status and Platform */}
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
                  {post.status !== 'draft' && post.scheduled_for && new Date(post.scheduled_for).getFullYear() >= 2000 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: 'auto' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <CalendarIcon style={{ width: '14px', height: '14px', color: '#14b8a6' }} />
                        <span style={{ color: '#14b8a6', fontSize: '13px' }}>
                          {format(new Date(post.scheduled_for), 'MMM dd, yyyy')}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Clock style={{ width: '14px', height: '14px', color: '#888' }} />
                        <span style={{ color: '#888', fontSize: '13px' }}>
                          {format(new Date(post.scheduled_for), 'h:mm a')}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Draft indicator */}
                  {post.status === 'draft' && (
                    <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: '#666', fontSize: '12px' }}>
                        click to edit and schedule
                      </span>
                      <span style={{ color: '#666', fontSize: '12px' }}>
                        {post.media?.media_type === 'video' ? 'video' : 'image'}
                      </span>
                    </div>
                  )}

                  {/* Media type for non-drafts */}
                  {post.status !== 'draft' && (
                    <div style={{ marginTop: '12px', textAlign: 'right' }}>
                      <span style={{ color: '#666', fontSize: '12px' }}>
                        {post.media?.media_type === 'video' ? 'video' : 'image'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Content Calendar Section - Moved to Bottom */}
        <div className="schedule-calendar-section" style={{ marginTop: '64px' }}>
          <div className="schedule-calendar-title-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
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

          <div className="schedule-calendar-container" style={{ background: '#1a1a1a', padding: '32px', borderRadius: '12px' }}>
            {/* Calendar Header */}
            <div className="schedule-calendar-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
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
            <div className="schedule-calendar-days-header" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', marginBottom: '8px' }}>
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
            <div className="schedule-calendar-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
              {(calendarView === 'month' ? dateRange : weekDateRange).map(date => {
                const dateKey = format(date, 'yyyy-MM-dd')
                const dayPosts = postsByDate[dateKey] || []
                const isCurrentMonth = calendarView === 'month' ? isSameMonth(date, currentMonth) : true
                const isTodayDate = isToday(date)
                const maxPosts = calendarView === 'week' ? 3 : 2

                return (
                  <div
                    key={dateKey}
                    className="schedule-calendar-day"
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
                        onClick={() => handleEdit(post)}
                      >
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-start', marginBottom: '4px' }}>
                          <img
                            src={getMediaThumbnail(post.media)}
                            alt=""
                            className="schedule-calendar-thumb"
                            style={{
                              width: calendarView === 'week' ? '48px' : '40px',
                              height: calendarView === 'week' ? '48px' : '40px',
                              borderRadius: '6px',
                              objectFit: 'cover',
                              flexShrink: 0
                            }}
                          />
                          <div className="schedule-calendar-post-info" style={{ flex: 1, minWidth: 0 }}>
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
            zIndex: 1300,
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

      {/* Edit Modal - Redesigned with View-only for Posted */}
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
          onClick={() => { setEditingPost(null); setLightboxOpen(false); }}
        >
          <div
            className="edit-modal"
            style={{
              background: '#1a1a1a',
              borderRadius: '16px',
              padding: '40px',
              maxWidth: '700px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 0 60px rgba(0, 0, 0, 0.5)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
              <h2 style={{
                color: '#14b8a6',
                fontSize: '28px',
                fontWeight: 700,
                margin: 0,
                textShadow: '0 0 20px rgba(20, 184, 166, 0.6), 0 0 40px rgba(20, 184, 166, 0.4)'
              }}>
                {editingPost.status === 'posted' ? 'View Post' : 'Edit Post'}
              </h2>
              <button
                onClick={() => { setEditingPost(null); setLightboxOpen(false); }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                <X style={{ width: '24px', height: '24px', color: '#888' }} />
              </button>
            </div>

            {/* Posted Status Banner */}
            {editingPost.status === 'posted' && (
              <div style={{
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid #10b981',
                borderRadius: '12px',
                padding: '12px 16px',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Sparkles style={{ width: '16px', height: '16px', color: '#10b981' }} />
                <span style={{ color: '#10b981', fontSize: '14px', fontWeight: 500 }}>
                  This post has been published and cannot be edited
                </span>
              </div>
            )}

            {/* Thumbnail Preview with Media Type Indicator */}
            <div style={{ marginBottom: '32px', textAlign: 'center', position: 'relative' }}>
              <div
                onClick={() => setLightboxOpen(true)}
                style={{ cursor: 'pointer', display: 'inline-block', position: 'relative' }}
              >
                {editingPost.media?.media_type === 'video' ? (
                  <video
                    src={editingPost.media?.cloudinary_url}
                    style={{
                      maxWidth: '200px',
                      maxHeight: '200px',
                      objectFit: 'cover',
                      borderRadius: '12px'
                    }}
                  />
                ) : (
                  <img
                    src={getMediaThumbnail(editingPost.media)}
                    alt="Preview"
                    style={{
                      maxWidth: '200px',
                      maxHeight: '200px',
                      objectFit: 'cover',
                      borderRadius: '12px'
                    }}
                  />
                )}
                {/* Media Type Badge */}
                <div style={{
                  position: 'absolute',
                  bottom: '8px',
                  right: '8px',
                  background: 'rgba(0, 0, 0, 0.7)',
                  borderRadius: '6px',
                  padding: '4px 8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  {editingPost.media?.media_type === 'video' ? (
                    <Video style={{ width: '12px', height: '12px', color: '#14b8a6' }} />
                  ) : (
                    <ImageIcon style={{ width: '12px', height: '12px', color: '#14b8a6' }} />
                  )}
                  <span style={{ color: '#888', fontSize: '10px' }}>Click to enlarge</span>
                </div>
              </div>
            </div>

            {/* Caption */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{ color: 'white', fontSize: '16px', fontWeight: 600, display: 'block', marginBottom: '12px' }}>
                Caption
              </label>
              <textarea
                value={editFormData.caption}
                onChange={(e) => setEditFormData({ ...editFormData, caption: e.target.value })}
                disabled={editingPost.status === 'posted'}
                style={{
                  width: '100%',
                  minHeight: '150px',
                  background: editingPost.status === 'posted' ? '#0a0a0a' : '#0d0d0d',
                  border: '1px solid #374151',
                  borderRadius: '12px',
                  padding: '16px',
                  color: editingPost.status === 'posted' ? '#888' : '#e5e5e5',
                  fontSize: '15px',
                  lineHeight: '1.6',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                  outline: 'none',
                  resize: 'vertical',
                  cursor: editingPost.status === 'posted' ? 'not-allowed' : 'text'
                }}
              />
            </div>

            {/* Platforms */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{ color: 'white', fontSize: '16px', fontWeight: 600, display: 'block', marginBottom: '12px' }}>
                {editingPost.status === 'posted' ? 'Posted To' : 'Select Platforms'}
              </label>
              <div style={{ display: 'flex', gap: '12px' }}>
                {[
                  { id: 'instagram', label: 'Instagram' },
                  { id: 'facebook', label: 'Facebook' },
                  { id: 'pinterest', label: 'Pinterest' }
                ].map(platform => {
                  const isSelected = editFormData.platforms.includes(platform.id)
                  return (
                    <button
                      key={platform.id}
                      type="button"
                      onClick={() => editingPost.status !== 'posted' && togglePlatform(platform.id)}
                      disabled={editingPost.status === 'posted'}
                      style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '14px',
                        background: isSelected ? 'rgba(20, 184, 166, 0.1)' : 'transparent',
                        border: isSelected ? '2px solid #14b8a6' : '2px solid #27272a',
                        borderRadius: '12px',
                        cursor: editingPost.status === 'posted' ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s ease',
                        boxShadow: isSelected ? '0 0 20px rgba(20, 184, 166, 0.3)' : 'none',
                        opacity: editingPost.status === 'posted' && !isSelected ? 0.5 : 1
                      }}
                    >
                      <span style={{
                        color: isSelected ? '#14b8a6' : 'white',
                        fontSize: '14px',
                        fontWeight: 500
                      }}>
                        {platform.label}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Scheduling Section - Only show for non-posted */}
            {editingPost.status !== 'posted' && (
              <div style={{ marginBottom: '32px' }}>
                <label style={{ color: 'white', fontSize: '16px', fontWeight: 600, display: 'block', marginBottom: '12px' }}>
                  Schedule
                </label>

                {/* Selected Date/Time Display */}
                {editFormattedDateTime && (
                  <div style={{
                    background: 'rgba(20, 184, 166, 0.1)',
                    border: '1px solid #14b8a6',
                    borderRadius: '12px',
                    padding: '16px',
                    marginBottom: '20px',
                    textAlign: 'center'
                  }}>
                    <p style={{ color: '#f3f4f6', fontSize: '18px', fontWeight: 600, margin: 0 }}>
                      {editFormattedDateTime}
                    </p>
                  </div>
                )}

                {/* Time Picker Dropdown */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ color: '#888', fontSize: '14px', fontWeight: 500, display: 'block', marginBottom: '8px' }}>
                    Select Time
                  </label>
                  <select
                    value={editSelectedTime}
                    onChange={(e) => setEditSelectedTime(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: '#1a1a1a',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '14px',
                      outline: 'none',
                      cursor: 'pointer',
                      appearance: 'none',
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2314b8a6' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 16px center'
                    }}
                  >
                    {editTimeOptions.map((option) => (
                      <option key={option.value} value={option.value} style={{ background: '#1a1a1a', color: 'white' }}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Calendar View */}
                <div style={{ background: '#0d0d0d', padding: '20px', borderRadius: '12px' }}>
                  {/* Calendar Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <button
                      type="button"
                      onClick={() => setEditCalendarMonth(subMonths(editCalendarMonth, 1))}
                      style={{
                        background: '#1a1a1a',
                        border: '1px solid #27272a',
                        borderRadius: '8px',
                        padding: '8px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <ChevronLeft style={{ width: '18px', height: '18px', color: '#e5e5e5' }} />
                    </button>

                    <h3 style={{ color: 'white', fontSize: '15px', fontWeight: 600, margin: 0 }}>
                      {format(editCalendarMonth, 'MMMM yyyy')}
                    </h3>

                    <button
                      type="button"
                      onClick={() => setEditCalendarMonth(addMonths(editCalendarMonth, 1))}
                      style={{
                        background: '#1a1a1a',
                        border: '1px solid #27272a',
                        borderRadius: '8px',
                        padding: '8px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <ChevronRight style={{ width: '18px', height: '18px', color: '#e5e5e5' }} />
                    </button>
                  </div>

                  {/* Days of Week */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '8px' }}>
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <div key={day} style={{
                        textAlign: 'center',
                        color: '#888',
                        fontSize: '11px',
                        fontWeight: 600,
                        padding: '6px 0'
                      }}>
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Calendar Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
                    {editDateRange.map(date => {
                      const dateKey = format(date, 'yyyy-MM-dd')
                      const dayPosts = postsByDate[dateKey] || []
                      const isCurrentMonth = isSameMonth(date, editCalendarMonth)
                      const isSelected = editSelectedDate && isSameDay(date, editSelectedDate)
                      const isPast = isBefore(date, startOfDay(new Date()))
                      const isTodayDate = isToday(date)

                      return (
                        <button
                          key={dateKey}
                          type="button"
                          onClick={() => !isPast && setEditSelectedDate(date)}
                          disabled={isPast}
                          style={{
                            background: isSelected ? '#14b8a6' : '#1a1a1a',
                            border: isTodayDate && !isSelected ? '2px solid #14b8a6' : '1px solid #27272a',
                            borderRadius: '6px',
                            padding: '6px',
                            minHeight: '50px',
                            opacity: isCurrentMonth ? (isPast ? 0.3 : 1) : 0.3,
                            cursor: isPast ? 'not-allowed' : 'pointer',
                            transition: 'all 0.2s ease',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center'
                          }}
                        >
                          <div style={{
                            color: isSelected ? 'white' : (isTodayDate ? '#14b8a6' : '#888'),
                            fontSize: '11px',
                            fontWeight: isSelected || isTodayDate ? 600 : 400,
                            marginBottom: '2px'
                          }}>
                            {format(date, 'd')}
                          </div>

                          {/* Post indicators */}
                          {dayPosts.length > 0 && (
                            <div style={{ display: 'flex', gap: '2px', flexWrap: 'wrap', justifyContent: 'center' }}>
                              {dayPosts.slice(0, 3).map((post: any) => (
                                <div
                                  key={post.id}
                                  style={{
                                    width: '5px',
                                    height: '5px',
                                    borderRadius: '50%',
                                    background: getPlatformColor(post.platforms?.[0] || '')
                                  }}
                                />
                              ))}
                            </div>
                          )}
                        </button>
                      )
                    })}
                  </div>

                  {/* Legend */}
                  <div style={{ marginTop: '12px', display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#E1306C' }} />
                      <span style={{ color: '#888', fontSize: '10px' }}>Instagram</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#1877F2' }} />
                      <span style={{ color: '#888', fontSize: '10px' }}>Facebook</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#E60023' }} />
                      <span style={{ color: '#888', fontSize: '10px' }}>Pinterest</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Posted Date/Time Display - Only for posted */}
            {editingPost.status === 'posted' && editingPost.scheduled_for && (
              <div style={{ marginBottom: '32px' }}>
                <label style={{ color: 'white', fontSize: '16px', fontWeight: 600, display: 'block', marginBottom: '12px' }}>
                  Posted On
                </label>
                <div style={{
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid #10b981',
                  borderRadius: '12px',
                  padding: '16px',
                  textAlign: 'center'
                }}>
                  <p style={{ color: '#10b981', fontSize: '18px', fontWeight: 600, margin: 0 }}>
                    {format(new Date(editingPost.scheduled_for), 'MMM d, yyyy')} at {format(new Date(editingPost.scheduled_for), 'h:mm a')}
                  </p>
                </div>
              </div>
            )}

            {/* Actions - Different for posted vs editable */}
            {editingPost.status === 'posted' ? (
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button
                  onClick={() => setEditingPost(null)}
                  style={{
                    padding: '12px 32px',
                    background: '#2a2a2a',
                    color: 'white',
                    fontSize: '15px',
                    fontWeight: 600,
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#333'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#2a2a2a'}
                >
                  Close
                </button>
              </div>
            ) : (
              <div className="edit-modal-actions" style={{ display: 'flex', gap: '12px', justifyContent: 'space-between' }}>
                {/* Left side buttons */}
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={() => {
                      setPostToDelete(editingPost.id)
                      setDeleteConfirmOpen(true)
                    }}
                    style={{
                      padding: '12px 24px',
                      background: 'transparent',
                      color: '#ef4444',
                      fontSize: '15px',
                      fontWeight: 600,
                      border: '2px solid #ef4444',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#ef4444'
                      e.currentTarget.style.color = 'white'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent'
                      e.currentTarget.style.color = '#ef4444'
                    }}
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => {
                      setPostToConfirm(editingPost.id)
                    }}
                    disabled={posting === editingPost.id}
                    style={{
                      padding: '12px 24px',
                      background: '#2a2a2a',
                      color: 'white',
                      fontSize: '15px',
                      fontWeight: 600,
                      border: '2px solid #27272a',
                      borderRadius: '8px',
                      cursor: posting === editingPost.id ? 'not-allowed' : 'pointer',
                      opacity: posting === editingPost.id ? 0.6 : 1,
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                    onMouseEnter={(e) => {
                      if (posting !== editingPost.id) {
                        e.currentTarget.style.background = '#14b8a6'
                        e.currentTarget.style.borderColor = '#14b8a6'
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#2a2a2a'
                      e.currentTarget.style.borderColor = '#27272a'
                    }}
                  >
                    {posting === editingPost.id ? (
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
                </div>
                {/* Right side buttons */}
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={() => setEditingPost(null)}
                    style={{
                      padding: '12px 24px',
                      background: '#2a2a2a',
                      color: 'white',
                      fontSize: '15px',
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
                      fontSize: '15px',
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
            )}
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxOpen && editingPost && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.95)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1100,
            cursor: 'pointer'
          }}
          onClick={() => setLightboxOpen(false)}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            style={{
              position: 'absolute',
              top: '24px',
              right: '24px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              borderRadius: '50%',
              padding: '12px',
              cursor: 'pointer'
            }}
          >
            <X style={{ width: '24px', height: '24px', color: 'white' }} />
          </button>
          {editingPost.media?.media_type === 'video' ? (
            <video
              src={editingPost.media?.cloudinary_url}
              controls
              autoPlay
              style={{
                maxWidth: '90vw',
                maxHeight: '90vh',
                borderRadius: '12px'
              }}
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <img
              src={editingPost.media?.cloudinary_url}
              alt="Full size preview"
              style={{
                maxWidth: '90vw',
                maxHeight: '90vh',
                objectFit: 'contain',
                borderRadius: '12px'
              }}
              onClick={(e) => e.stopPropagation()}
            />
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmOpen && (
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
            zIndex: 1200,
            padding: '24px'
          }}
          onClick={() => setDeleteConfirmOpen(false)}
        >
          <div
            style={{
              background: '#1a1a1a',
              borderRadius: '16px',
              padding: '32px',
              maxWidth: '400px',
              width: '100%',
              textAlign: 'center',
              boxShadow: '0 0 60px rgba(0, 0, 0, 0.5)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <AlertCircle style={{ width: '48px', height: '48px', color: '#ef4444', margin: '0 auto 16px' }} />
            <h3 style={{ color: 'white', fontSize: '20px', fontWeight: 600, marginBottom: '12px' }}>
              Delete Post?
            </h3>
            <p style={{ color: '#888', fontSize: '14px', marginBottom: '24px' }}>
              Are you sure you want to delete this post? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={() => setDeleteConfirmOpen(false)}
                style={{
                  padding: '12px 24px',
                  background: '#2a2a2a',
                  color: 'white',
                  fontSize: '15px',
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
                onClick={() => {
                  if (postToDelete) {
                    handleDelete(postToDelete)
                    setDeleteConfirmOpen(false)
                    setEditingPost(null)
                  }
                }}
                style={{
                  padding: '12px 24px',
                  background: '#ef4444',
                  color: 'white',
                  fontSize: '15px',
                  fontWeight: 600,
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#dc2626'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#ef4444'}
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  )
}

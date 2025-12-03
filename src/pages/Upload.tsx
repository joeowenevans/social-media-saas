import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useBrand } from '../hooks/useBrand'
import { usePosts } from '../hooks/usePosts'
import { AppLayout } from '../components/layout/AppLayout'
import { useDropzone } from 'react-dropzone'
import { Upload as UploadIcon, Wand2, Sparkles, Image as ImageIcon, Video, X, Send, Clock, ChevronLeft, ChevronRight, Zap, AlertCircle } from 'lucide-react'
import type { Media } from '../types'
import toast from 'react-hot-toast'
import { supabase } from '../lib/supabase'
import { uploadToCloudinary } from '../lib/cloudinary'
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
  startOfDay
} from 'date-fns'

export function Upload() {
  const { user } = useAuth()
  const { brand, loading } = useBrand(user?.id)
  const { posts } = usePosts(brand?.id)
  const navigate = useNavigate()
  const [uploadedMedia, setUploadedMedia] = useState<Media | null>(null)
  const [caption, setCaption] = useState('')
  const [generating, setGenerating] = useState(false)
  const [saving, setSaving] = useState(false)
  const [scheduledTime, setScheduledTime] = useState<string>('')
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [postType, setPostType] = useState<'post_now' | 'draft' | 'scheduled'>('draft')
  const [showPostNowConfirm, setShowPostNowConfirm] = useState(false)
  const abortControllerRef = useRef<AbortController | null>(null)

  // Calendar state
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string>('12:00')

  // Sync selectedDate and selectedTime with scheduledTime
  useEffect(() => {
    if (selectedDate && selectedTime) {
      const [hours, minutes] = selectedTime.split(':').map(Number)
      const dateTime = new Date(selectedDate)
      dateTime.setHours(hours, minutes, 0, 0)
      setScheduledTime(dateTime.toISOString().slice(0, 16))
    }
  }, [selectedDate, selectedTime])

  // Get scheduled posts grouped by date for calendar display
  const scheduledPosts = posts.filter(p => p.status === 'scheduled')
  const postsByDate = scheduledPosts.reduce((acc: Record<string, typeof scheduledPosts>, post) => {
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
  const calendarStart = startOfWeek(monthStart)
  const calendarEnd = endOfWeek(monthEnd)
  const dateRange = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

  // Get platform color
  const getPlatformColor = (platforms: string[]) => {
    if (!platforms || platforms.length === 0) return '#50E3C2'
    if (platforms.includes('instagram')) return '#E1306C'
    if (platforms.includes('facebook')) return '#1877F2'
    if (platforms.includes('pinterest')) return '#E60023'
    return '#50E3C2'
  }

  // Format the selected date/time for display
  const formattedDateTime = selectedDate
    ? `${format(selectedDate, 'MMM d, yyyy')} at ${format(new Date(`2000-01-01T${selectedTime}`), 'h:mm a')}`
    : null

  // Generate time options in hourly intervals
  const timeOptions = Array.from({ length: 24 }, (_, i) => {
    const time24 = `${i.toString().padStart(2, '0')}:00`
    const date = new Date(`2000-01-01T${time24}`)
    const time12 = format(date, 'h:mm a')
    return { value: time24, label: time12 }
  })

  // Upload states
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [preview, setPreview] = useState<string | null>(null)
  const [fileType, setFileType] = useState<'image' | 'video' | null>(null)
  const progressIntervalRef = useRef<number | null>(null)

  // Cleanup existing drafts with invalid dates on mount
  useEffect(() => {
    const cleanupDrafts = async () => {
      if (!brand?.id) return

      try {
        await supabase
          .from('posts')
          .update({ scheduled_for: null })
          .eq('brand_id', brand.id)
          .eq('status', 'draft')
          .not('scheduled_for', 'is', null)
      } catch (error) {
        console.error('Draft cleanup error:', error)
      }
    }

    cleanupDrafts()
  }, [brand?.id])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
    }
  }, [])

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return

    const file = acceptedFiles[0]
    const isVideo = file.type.startsWith('video')
    const isImage = file.type.startsWith('image')

    if (!isVideo && !isImage) {
      toast.error('Please upload an image or video file')
      return
    }

    const maxSize = isVideo ? 100 * 1024 * 1024 : 10 * 1024 * 1024
    if (file.size > maxSize) {
      toast.error(isVideo ? 'Video must be under 100MB' : 'Image must be under 10MB')
      return
    }

    setUploading(true)
    setUploadProgress(0)
    setFileType(isVideo ? 'video' : 'image')

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    try {
      progressIntervalRef.current = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90))
      }, 200) as unknown as number

      const cloudinaryData = await uploadToCloudinary(file)

      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
        progressIntervalRef.current = null
      }
      setUploadProgress(100)

      const { data, error } = await supabase
        .from('media')
        .insert([
          {
            brand_id: brand!.id,
            cloudinary_url: cloudinaryData.secure_url,
            cloudinary_public_id: cloudinaryData.public_id,
            thumbnail_url: cloudinaryData.thumbnail_url,
            media_type: isVideo ? 'video' : 'image',
            file_format: cloudinaryData.format,
            file_size: cloudinaryData.bytes,
            width: cloudinaryData.width,
            height: cloudinaryData.height,
            duration: cloudinaryData.duration ? Math.round(cloudinaryData.duration) : null,
          },
        ])
        .select()
        .single()

      if (error) throw error

      toast.success('Media uploaded successfully!')
      setUploadedMedia(data)
      await generateCaption(data)
    } catch (error: any) {
      console.error('Upload error:', error)
      toast.error(error.message || 'Failed to upload media')
      setPreview(null)
      setFileType(null)
    } finally {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
        progressIntervalRef.current = null
      }
      setUploading(false)
      setUploadProgress(0)
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      'video/*': ['.mp4', '.mov'],
    },
    maxFiles: 1,
    disabled: uploading || !!uploadedMedia,
  })

  const clearPreview = () => {
    setPreview(null)
    setFileType(null)
    setUploadedMedia(null)
    setCaption('')
  }

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 200px)' }}>
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#50E3C2]"></div>
            <p style={{ color: 'rgba(242, 244, 248, 0.6)', fontSize: '14px' }}>Loading...</p>
          </div>
        </div>
      </AppLayout>
    )
  }

  if (!brand) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 200px)' }}>
          <div style={{ maxWidth: '500px', background: '#242A45', borderRadius: '12px', padding: '48px', textAlign: 'center', border: '1px solid rgba(80, 227, 194, 0.2)' }}>
            <div style={{
              width: '64px',
              height: '64px',
              margin: '0 auto 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #50E3C2 0%, #3dd4b0 100%)'
            }}>
              <Sparkles style={{ width: '32px', height: '32px', color: '#1A1F36' }} />
            </div>
            <h2 style={{ color: '#F2F4F8', fontSize: '24px', fontWeight: 600, marginBottom: '16px' }}>Brand Profile Required</h2>
            <p style={{ color: 'rgba(242, 244, 248, 0.6)', fontSize: '16px', marginBottom: '32px' }}>
              Please create a brand profile first to use this feature.
            </p>
            <button
              onClick={() => navigate('/settings')}
              style={{
                width: '100%',
                padding: '12px 24px',
                background: '#50E3C2',
                color: '#1A1F36',
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

  const generateCaption = async (media: Media) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    abortControllerRef.current = new AbortController()

    setGenerating(true)
    try {
      const response = await fetch('/api/generate-caption', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mediaUrl: media.cloudinary_url,
          mediaType: media.media_type,
          // New comprehensive brand fields
          brandName: brand.name,
          industryNiche: brand.industry_niche,
          voiceDescription: brand.voice_description,
          audiencePriorities: brand.audience_priorities,
          brandValues: brand.brand_values,
          preferredCaptionLength: brand.preferred_caption_length,
          hashtagTopics: brand.hashtag_topics,
          ctaStyle: brand.cta_style,
          exampleCaptions: brand.example_captions,
          phrasesTaglines: brand.phrases_taglines,
          generalGoals: brand.general_goals,
          numHashtags: brand.num_hashtags,
          numEmojis: brand.num_emojis,
          // Legacy fields for backwards compatibility
          brandVoice: brand.brand_voice,
          targetAudience: brand.target_audience,
          hashtagCount: brand.hashtag_count,
          hashtagsAlwaysUse: brand.hashtags_always_use,
          hashtagsAvoid: brand.hashtags_avoid,
          ctaPreference: brand.cta_preference,
          emojiCount: brand.emoji_count,
        }),
        signal: abortControllerRef.current.signal,
      })

      if (!response.ok) throw new Error('Failed to generate caption')

      const data = await response.json()
      setCaption(data.caption)
      toast.success('Caption generated!')
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Caption generation aborted')
        return
      }
      console.error('Caption generation error:', error)
      toast.error('Failed to generate caption. You can write one manually.')
      setCaption('')
    } finally {
      setGenerating(false)
      abortControllerRef.current = null
    }
  }

  const handleSavePost = async () => {
    if (!uploadedMedia) return

    if (postType === 'scheduled' && !scheduledTime) {
      toast.error('Please select a date and time')
      return
    }

    // Validate future date for scheduled posts
    if (postType === 'scheduled' && scheduledTime) {
      const selectedDate = new Date(scheduledTime)
      const now = new Date()

      if (selectedDate <= now) {
        toast.error('Please select a future date and time')
        return
      }
    }

    if (selectedPlatforms.length === 0) {
      toast.error('Please select at least one platform')
      return
    }

    if (postType === 'post_now' && !caption) {
      toast.error('Please add a caption before posting')
      return
    }

    // Show confirmation modal for Post Now
    if (postType === 'post_now') {
      setShowPostNowConfirm(true)
      return
    }

    await executePost()
  }

  const executePost = async () => {
    if (!uploadedMedia) return

    setSaving(true)
    try {
      // Determine status based on postType
      let status: string
      if (postType === 'scheduled') {
        status = 'scheduled'
      } else if (postType === 'post_now') {
        status = 'posting'
      } else {
        status = 'draft'
      }

      const postData: any = {
        brand_id: brand.id,
        media_id: uploadedMedia.id,
        generated_caption: caption,
        final_caption: caption,
        status: status,
        platforms: selectedPlatforms,
        scheduled_for: postType === 'scheduled' ? new Date(scheduledTime).toISOString() : null,
      }

      const { data: insertedPost, error } = await supabase.from('posts').insert([postData]).select().single()

      if (error) throw error

      // If posting now, call the webhook
      if (postType === 'post_now' && insertedPost) {
        try {
          // Fetch brand credentials
          const { data: brandData } = await supabase
            .from('brands')
            .select('facebook_page_id, instagram_account_id, facebook_access_token')
            .eq('id', brand.id)
            .single()

          const webhookPayload = {
            caption: caption,
            media_url: uploadedMedia.cloudinary_url,
            media_type: uploadedMedia.media_type,
            platforms: selectedPlatforms,
            facebook_page_id: brandData?.facebook_page_id || null,
            instagram_account_id: brandData?.instagram_account_id || null,
            facebook_access_token: brandData?.facebook_access_token || null
          }

          const response = await fetch('https://n8n-latest-8yp2.onrender.com/webhook/post-instant', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(webhookPayload)
          })

          if (response.ok) {
            // Update post status to posted
            await supabase
              .from('posts')
              .update({ status: 'posted', posted_at: new Date().toISOString() })
              .eq('id', insertedPost.id)
            toast.success('Post published successfully!')
          } else {
            // Update post status to failed
            await supabase
              .from('posts')
              .update({ status: 'failed', error_message: 'Webhook failed' })
              .eq('id', insertedPost.id)
            toast.error('Failed to publish post')
          }
        } catch (webhookError) {
          console.error('Webhook error:', webhookError)
          await supabase
            .from('posts')
            .update({ status: 'failed', error_message: 'Webhook error' })
            .eq('id', insertedPost.id)
          toast.error('Failed to publish post')
        }
      } else if (postType === 'scheduled') {
        toast.success('Post scheduled successfully!')
      } else {
        toast.success('Draft saved!')
      }
      navigate('/dashboard')
    } catch (error: any) {
      console.error('Save error:', error)
      toast.error('Failed to save post')
    } finally {
      setSaving(false)
    }
  }

  const togglePlatform = (platform: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform]
    )
  }

  const confirmPostNow = async () => {
    setShowPostNowConfirm(false)
    await executePost()
  }

  return (
    <AppLayout>
      {/* Mobile-only styles - does not affect desktop */}
      <style>{`
        @media (max-width: 639px) {
          .upload-container { padding: 24px 16px !important; }
          .upload-title { font-size: 24px !important; }
          .upload-section-title { font-size: 16px !important; }
          .platform-buttons { flex-direction: column !important; }
          .platform-buttons button { flex: none !important; width: 100% !important; }
          .post-type-buttons { flex-direction: column !important; }
          .post-type-buttons button { flex: none !important; width: 100% !important; }
          .upload-calendar { padding: 16px !important; }
          .upload-calendar-header { margin-bottom: 12px !important; }
          .upload-calendar-header h3 { font-size: 14px !important; }
          .upload-calendar-grid { gap: 2px !important; }
          .upload-calendar-day { padding: 6px !important; min-height: 50px !important; }
          .upload-calendar-day > div:first-child { font-size: 10px !important; }
          .upload-legend { gap: 8px !important; }
          .upload-legend > div { gap: 4px !important; }
          .upload-legend span { font-size: 9px !important; }
        }
      `}</style>
      <div className="upload-container" style={{ maxWidth: '900px', margin: '0 auto', padding: '48px 32px' }}>
        {/* Page Title with Teal Text Glow */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1 style={{
            color: '#50E3C2',
            fontSize: '32px',
            fontWeight: 700,
            marginBottom: '12px',
            textShadow: '0 0 20px rgba(80, 227, 194, 0.6), 0 0 40px rgba(80, 227, 194, 0.4), 0 0 60px rgba(80, 227, 194, 0.2)'
          }}>
            Upload Content
          </h1>
          <p style={{
            color: 'rgba(242, 244, 248, 0.6)',
            fontSize: '16px',
            margin: 0
          }}>
            Create AI-powered posts for your brand
          </p>
        </div>

        {/* Upload Media Section */}
        <div style={{ marginBottom: '64px' }}>
          <h2 style={{
            color: '#F2F4F8',
            fontSize: '18px',
            fontWeight: 600,
            marginBottom: '24px'
          }}>
            Upload Media
          </h2>

          {!uploadedMedia ? (
            <div
              {...getRootProps()}
              style={{
                background: '#242A45',
                padding: '48px',
                borderRadius: '12px',
                border: isDragActive ? '2px dashed #50E3C2' : '2px dashed rgba(80, 227, 194, 0.3)',
                textAlign: 'center',
                cursor: uploading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                opacity: uploading ? 0.6 : 1
              }}
            >
              <input {...getInputProps()} />

              {uploading ? (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#50E3C2]"></div>
                  </div>
                  <p style={{ color: 'rgba(242, 244, 248, 0.6)', fontSize: '16px', marginBottom: '16px' }}>
                    Uploading... {uploadProgress}%
                  </p>
                  <div style={{
                    maxWidth: '300px',
                    margin: '0 auto',
                    height: '4px',
                    background: 'rgba(80, 227, 194, 0.2)',
                    borderRadius: '2px',
                    overflow: 'hidden'
                  }}>
                    <div
                      style={{
                        height: '100%',
                        background: '#50E3C2',
                        width: `${uploadProgress}%`,
                        transition: 'width 0.3s ease'
                      }}
                    />
                  </div>
                </div>
              ) : (
                <>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginBottom: '24px' }}>
                    <ImageIcon style={{ width: '48px', height: '48px', color: '#50E3C2' }} />
                    <Video style={{ width: '48px', height: '48px', color: '#50E3C2' }} />
                  </div>
                  <UploadIcon style={{ width: '32px', height: '32px', color: 'rgba(242, 244, 248, 0.5)', margin: '0 auto 16px' }} />
                  <p style={{ color: '#F2F4F8', fontSize: '18px', fontWeight: 500, marginBottom: '8px' }}>
                    {isDragActive ? 'Drop your file here...' : 'Drop your image or video here'}
                  </p>
                  <p style={{ color: 'rgba(242, 244, 248, 0.6)', fontSize: '14px', marginBottom: '24px' }}>
                    or click to browse
                  </p>
                  <p style={{ color: 'rgba(242, 244, 248, 0.4)', fontSize: '12px' }}>
                    Supports: JPG, PNG, GIF, MP4, MOV
                    <br />
                    Max size: 10MB for images, 100MB for videos
                  </p>
                </>
              )}
            </div>
          ) : (
            <div style={{ position: 'relative', background: '#242A45', padding: '24px', borderRadius: '12px', border: '1px solid rgba(80, 227, 194, 0.2)' }}>
              <button
                onClick={clearPreview}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  zIndex: 10,
                  transition: 'transform 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <X style={{ width: '32px', height: '32px', color: '#50E3C2' }} />
              </button>
              {fileType === 'video' ? (
                <video
                  src={preview || ''}
                  controls
                  style={{
                    width: '100%',
                    maxHeight: '400px',
                    borderRadius: '8px'
                  }}
                />
              ) : (
                <img
                  src={preview || ''}
                  alt="Preview"
                  style={{
                    width: '100%',
                    maxHeight: '400px',
                    objectFit: 'contain',
                    borderRadius: '8px'
                  }}
                />
              )}
            </div>
          )}
        </div>

        {/* Caption Section */}
        {uploadedMedia && (
          <>
            <div style={{ marginBottom: '64px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{
                  color: '#F2F4F8',
                  fontSize: '18px',
                  fontWeight: 600,
                  margin: 0
                }}>
                  Caption
                </h2>
                <button
                  onClick={() => uploadedMedia && generateCaption(uploadedMedia)}
                  disabled={generating}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    background: '#242A45',
                    border: '1px solid rgba(80, 227, 194, 0.3)',
                    borderRadius: '8px',
                    color: '#50E3C2',
                    fontSize: '14px',
                    fontWeight: 500,
                    cursor: generating ? 'not-allowed' : 'pointer',
                    opacity: generating ? 0.6 : 1
                  }}
                >
                  <Wand2 style={{ width: '16px', height: '16px' }} className={generating ? 'animate-spin' : ''} />
                  <span>{generating ? 'Generating...' : 'Regenerate'}</span>
                </button>
              </div>

              {generating ? (
                <div style={{
                  background: '#242A45',
                  padding: '48px',
                  borderRadius: '12px',
                  textAlign: 'center',
                  border: '1px solid rgba(80, 227, 194, 0.2)'
                }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    margin: '0 auto 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #50E3C2 0%, #3dd4b0 100%)'
                  }}>
                    <Sparkles style={{ width: '32px', height: '32px', color: '#1A1F36' }} className="animate-pulse" />
                  </div>
                  <p style={{ color: '#F2F4F8', fontSize: '16px', fontWeight: 500, marginBottom: '8px' }}>
                    AI is crafting your perfect caption...
                  </p>
                  <p style={{ color: 'rgba(242, 244, 248, 0.6)', fontSize: '14px' }}>
                    This may take a few seconds
                  </p>
                </div>
              ) : (
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Your AI-generated caption will appear here..."
                  style={{
                    width: '100%',
                    height: '200px',
                    padding: '16px',
                    background: '#242A45',
                    border: '1px solid rgba(80, 227, 194, 0.3)',
                    borderRadius: '12px',
                    color: '#F2F4F8',
                    fontSize: '15px',
                    lineHeight: '1.6',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                    resize: 'none',
                    outline: 'none'
                  }}
                />
              )}
            </div>

            {/* Platform Selection */}
            {!generating && (
              <div style={{ marginBottom: '64px' }}>
                <h2 style={{
                  color: '#F2F4F8',
                  fontSize: '18px',
                  fontWeight: 600,
                  marginBottom: '24px'
                }}>
                  Select Platforms
                </h2>

                <div className="platform-buttons" style={{ display: 'flex', gap: '16px' }}>
                  {[
                    { id: 'instagram', label: 'Instagram' },
                    { id: 'facebook', label: 'Facebook' },
                    { id: 'pinterest', label: 'Pinterest' }
                  ].map((platform) => {
                    const isSelected = selectedPlatforms.includes(platform.id)
                    return (
                      <button
                        key={platform.id}
                        type="button"
                        onClick={() => togglePlatform(platform.id)}
                        style={{
                          flex: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '16px',
                          background: isSelected ? 'rgba(80, 227, 194, 0.1)' : 'transparent',
                          border: isSelected ? '2px solid #50E3C2' : '2px solid rgba(80, 227, 194, 0.3)',
                          borderRadius: '12px',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          boxShadow: isSelected ? '0 0 20px rgba(80, 227, 194, 0.3)' : 'none'
                        }}
                      >
                        <span style={{
                          color: isSelected ? '#50E3C2' : '#F2F4F8',
                          fontSize: '16px',
                          fontWeight: 500
                        }}>
                          {platform.label}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Scheduling */}
            {!generating && (
              <div style={{ marginBottom: '64px' }}>
                <h2 style={{
                  color: '#F2F4F8',
                  fontSize: '18px',
                  fontWeight: 600,
                  marginBottom: '24px'
                }}>
                  When to Post
                </h2>

                <div className="post-type-buttons" style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                  <button
                    type="button"
                    onClick={() => setPostType('post_now')}
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '12px',
                      padding: '16px',
                      background: postType === 'post_now' ? 'rgba(80, 227, 194, 0.1)' : 'transparent',
                      border: postType === 'post_now' ? '2px solid #50E3C2' : '2px solid rgba(80, 227, 194, 0.3)',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: postType === 'post_now' ? '0 0 20px rgba(80, 227, 194, 0.3)' : 'none'
                    }}
                  >
                    <Zap style={{ width: '20px', height: '20px', color: '#50E3C2' }} />
                    <span style={{ color: postType === 'post_now' ? '#50E3C2' : '#F2F4F8', fontSize: '16px', fontWeight: 500 }}>
                      Post Now
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPostType('draft')}
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '12px',
                      padding: '16px',
                      background: postType === 'draft' ? 'rgba(80, 227, 194, 0.1)' : 'transparent',
                      border: postType === 'draft' ? '2px solid #50E3C2' : '2px solid rgba(80, 227, 194, 0.3)',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: postType === 'draft' ? '0 0 20px rgba(80, 227, 194, 0.3)' : 'none'
                    }}
                  >
                    <Send style={{ width: '20px', height: '20px', color: '#50E3C2' }} />
                    <span style={{ color: postType === 'draft' ? '#50E3C2' : '#F2F4F8', fontSize: '16px', fontWeight: 500 }}>
                      Save as Draft
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPostType('scheduled')}
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '12px',
                      padding: '16px',
                      background: postType === 'scheduled' ? 'rgba(80, 227, 194, 0.1)' : 'transparent',
                      border: postType === 'scheduled' ? '2px solid #50E3C2' : '2px solid rgba(80, 227, 194, 0.3)',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: postType === 'scheduled' ? '0 0 20px rgba(80, 227, 194, 0.3)' : 'none'
                    }}
                  >
                    <Clock style={{ width: '20px', height: '20px', color: '#50E3C2' }} />
                    <span style={{ color: postType === 'scheduled' ? '#50E3C2' : '#F2F4F8', fontSize: '16px', fontWeight: 500 }}>
                      Schedule for Later
                    </span>
                  </button>
                </div>

                {postType === 'scheduled' && (
                  <div style={{ marginTop: '24px' }}>
                    {/* Selected Date/Time Display */}
                    {formattedDateTime && (
                      <div style={{
                        background: 'rgba(80, 227, 194, 0.1)',
                        border: '1px solid #50E3C2',
                        borderRadius: '12px',
                        padding: '16px',
                        marginBottom: '24px',
                        textAlign: 'center'
                      }}>
                        <p style={{ color: '#F2F4F8', fontSize: '18px', fontWeight: 600, margin: 0 }}>
                          {formattedDateTime}
                        </p>
                      </div>
                    )}

                    {/* Time Picker Dropdown */}
                    <div style={{ marginBottom: '24px' }}>
                      <label style={{ color: 'rgba(242, 244, 248, 0.6)', fontSize: '14px', fontWeight: 500, display: 'block', marginBottom: '8px' }}>
                        Select Time
                      </label>
                      <select
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          background: '#242A45',
                          border: '1px solid rgba(80, 227, 194, 0.3)',
                          borderRadius: '8px',
                          color: '#F2F4F8',
                          fontSize: '14px',
                          outline: 'none',
                          cursor: 'pointer',
                          appearance: 'none',
                          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2350E3C2' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
                          backgroundRepeat: 'no-repeat',
                          backgroundPosition: 'right 16px center'
                        }}
                      >
                        {timeOptions.map((option) => (
                          <option key={option.value} value={option.value} style={{ background: '#242A45', color: '#F2F4F8' }}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Calendar View */}
                    <div className="upload-calendar" style={{ background: '#242A45', padding: '24px', borderRadius: '12px', border: '1px solid rgba(80, 227, 194, 0.2)' }}>
                      {/* Calendar Header */}
                      <div className="upload-calendar-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <button
                          type="button"
                          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                          style={{
                            background: '#1A1F36',
                            border: '1px solid rgba(80, 227, 194, 0.3)',
                            borderRadius: '8px',
                            padding: '8px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <ChevronLeft style={{ width: '20px', height: '20px', color: '#F2F4F8' }} />
                        </button>

                        <h3 style={{ color: '#F2F4F8', fontSize: '16px', fontWeight: 600, margin: 0 }}>
                          {format(currentMonth, 'MMMM yyyy')}
                        </h3>

                        <button
                          type="button"
                          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                          style={{
                            background: '#1A1F36',
                            border: '1px solid rgba(80, 227, 194, 0.3)',
                            borderRadius: '8px',
                            padding: '8px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <ChevronRight style={{ width: '20px', height: '20px', color: '#F2F4F8' }} />
                        </button>
                      </div>

                      {/* Days of Week */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '8px' }}>
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                          <div key={day} style={{
                            textAlign: 'center',
                            color: 'rgba(242, 244, 248, 0.5)',
                            fontSize: '11px',
                            fontWeight: 600,
                            padding: '8px 0'
                          }}>
                            {day}
                          </div>
                        ))}
                      </div>

                      {/* Calendar Grid */}
                      <div className="upload-calendar-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
                        {dateRange.map(date => {
                          const dateKey = format(date, 'yyyy-MM-dd')
                          const dayPosts = postsByDate[dateKey] || []
                          const isCurrentMonth = isSameMonth(date, currentMonth)
                          const isSelected = selectedDate && isSameDay(date, selectedDate)
                          const isPast = isBefore(date, startOfDay(new Date()))
                          const isTodayDate = isToday(date)

                          return (
                            <button
                              key={dateKey}
                              type="button"
                              className="upload-calendar-day"
                              onClick={() => !isPast && setSelectedDate(date)}
                              disabled={isPast}
                              style={{
                                background: isSelected ? '#50E3C2' : '#1A1F36',
                                border: isTodayDate && !isSelected ? '2px solid #50E3C2' : '1px solid rgba(80, 227, 194, 0.2)',
                                borderRadius: '8px',
                                padding: '8px',
                                minHeight: '60px',
                                opacity: isCurrentMonth ? (isPast ? 0.3 : 1) : 0.3,
                                cursor: isPast ? 'not-allowed' : 'pointer',
                                transition: 'all 0.2s ease',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center'
                              }}
                            >
                              <div style={{
                                color: isSelected ? '#1A1F36' : (isTodayDate ? '#50E3C2' : 'rgba(242, 244, 248, 0.6)'),
                                fontSize: '12px',
                                fontWeight: isSelected || isTodayDate ? 600 : 400,
                                marginBottom: '4px'
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
                                        width: '6px',
                                        height: '6px',
                                        borderRadius: '50%',
                                        background: getPlatformColor(post.platforms || [])
                                      }}
                                    />
                                  ))}
                                  {dayPosts.length > 3 && (
                                    <span style={{ color: 'rgba(242, 244, 248, 0.5)', fontSize: '8px' }}>+{dayPosts.length - 3}</span>
                                  )}
                                </div>
                              )}
                            </button>
                          )
                        })}
                      </div>

                      {/* Legend */}
                      <div className="upload-legend" style={{ marginTop: '16px', display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#E1306C' }} />
                          <span style={{ color: 'rgba(242, 244, 248, 0.5)', fontSize: '11px' }}>Instagram</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#1877F2' }} />
                          <span style={{ color: 'rgba(242, 244, 248, 0.5)', fontSize: '11px' }}>Facebook</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#E60023' }} />
                          <span style={{ color: 'rgba(242, 244, 248, 0.5)', fontSize: '11px' }}>Pinterest</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            {!generating && (
              <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                <button
                  onClick={handleSavePost}
                  disabled={saving}
                  style={{
                    padding: '16px 48px',
                    background: '#50E3C2',
                    color: '#1A1F36',
                    fontSize: '16px',
                    fontWeight: 600,
                    border: 'none',
                    borderRadius: '8px',
                    cursor: saving ? 'not-allowed' : 'pointer',
                    opacity: saving ? 0.6 : 1,
                    transition: 'all 0.2s ease'
                  }}
                >
                  {saving ? (postType === 'post_now' ? 'Posting...' : 'Saving...') : postType === 'scheduled' ? 'Schedule Post' : postType === 'post_now' ? 'Post Now' : 'Save as Draft'}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Post Now Confirmation Modal */}
      {showPostNowConfirm && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(26, 31, 54, 0.85)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1300,
            padding: '24px'
          }}
          onClick={() => setShowPostNowConfirm(false)}
        >
          <div
            style={{
              maxWidth: '450px',
              background: '#1A1F36',
              border: '1px solid rgba(80, 227, 194, 0.2)',
              borderRadius: '16px',
              padding: '40px',
              boxShadow: '0 0 60px rgba(80, 227, 194, 0.15)',
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
              background: 'rgba(80, 227, 194, 0.1)'
            }}>
              <AlertCircle style={{ width: '28px', height: '28px', color: '#50E3C2' }} />
            </div>

            {/* Title */}
            <h2 style={{
              color: '#F2F4F8',
              fontSize: '24px',
              fontWeight: 700,
              marginBottom: '16px'
            }}>
              Post Now?
            </h2>

            {/* Message */}
            <p style={{
              color: 'rgba(242, 244, 248, 0.6)',
              fontSize: '15px',
              lineHeight: 1.6,
              marginBottom: '32px'
            }}>
              This will immediately post your content to the selected platforms. This action cannot be undone.
            </p>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={() => setShowPostNowConfirm(false)}
                style={{
                  background: '#242A45',
                  color: '#F2F4F8',
                  padding: '12px 32px',
                  borderRadius: '8px',
                  fontWeight: 500,
                  fontSize: '15px',
                  border: '1px solid rgba(80, 227, 194, 0.3)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#2d3454'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#242A45'}
              >
                Cancel
              </button>
              <button
                onClick={confirmPostNow}
                style={{
                  background: '#50E3C2',
                  color: '#1A1F36',
                  padding: '12px 32px',
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '15px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#3dd4b0'
                  e.currentTarget.style.transform = 'scale(1.02)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#50E3C2'
                  e.currentTarget.style.transform = 'scale(1)'
                }}
              >
                Yes, Post Now
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  )
}

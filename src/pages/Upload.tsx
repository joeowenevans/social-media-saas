import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useBrand } from '../hooks/useBrand'
import { AppLayout } from '../components/layout/AppLayout'
import { useDropzone } from 'react-dropzone'
import { Upload as UploadIcon, Wand2, Sparkles, Image as ImageIcon, Video, X } from 'lucide-react'
import type { Media } from '../types'
import toast from 'react-hot-toast'
import { supabase } from '../lib/supabase'
import { uploadToCloudinary } from '../lib/cloudinary'

export function Upload() {
  const { user } = useAuth()
  const { brand, loading } = useBrand(user?.id)
  const navigate = useNavigate()
  const [uploadedMedia, setUploadedMedia] = useState<Media | null>(null)
  const [caption, setCaption] = useState('')
  const [generating, setGenerating] = useState(false)
  const [saving, setSaving] = useState(false)
  const [scheduledTime, setScheduledTime] = useState<string>('')
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['instagram'])
  const [postType, setPostType] = useState<'now' | 'scheduled'>('now')
  const abortControllerRef = useRef<AbortController | null>(null)

  // Upload states
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [preview, setPreview] = useState<string | null>(null)
  const [fileType, setFileType] = useState<'image' | 'video' | null>(null)
  const progressIntervalRef = useRef<number | null>(null)

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
            duration: cloudinaryData.duration || null,
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
          brandVoice: brand.brand_voice || 'Professional and engaging',
          targetAudience: brand.target_audience || 'General audience',
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

    if (selectedPlatforms.length === 0) {
      toast.error('Please select at least one platform')
      return
    }

    setSaving(true)
    try {
      const postData: any = {
        brand_id: brand.id,
        media_id: uploadedMedia.id,
        generated_caption: caption,
        final_caption: caption,
        status: postType === 'scheduled' ? 'scheduled' : 'draft',
        platforms: selectedPlatforms,
      }

      if (postType === 'scheduled' && scheduledTime) {
        postData.scheduled_for = new Date(scheduledTime).toISOString()
      }

      const { error } = await supabase.from('posts').insert([postData])

      if (error) throw error

      if (postType === 'scheduled') {
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

  return (
    <AppLayout>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '48px 32px' }}>
        {/* Page Title */}
        <h1 style={{
          color: '#14b8a6',
          fontSize: '32px',
          fontWeight: 700,
          textAlign: 'center',
          marginBottom: '16px'
        }}>
          Upload Content
        </h1>

        {/* Subtitle */}
        <p style={{
          color: '#888',
          fontSize: '16px',
          textAlign: 'center',
          marginBottom: '48px'
        }}>
          Create AI-powered posts for your brand
        </p>

        {/* Upload Media Section */}
        <div style={{ marginBottom: '64px' }}>
          <h2 style={{
            color: 'white',
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
                background: '#1a1a1a',
                padding: '48px',
                borderRadius: '12px',
                border: isDragActive ? '2px dashed #14b8a6' : '2px dashed #27272a',
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
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#14b8a6]"></div>
                  </div>
                  <p style={{ color: '#888', fontSize: '16px', marginBottom: '16px' }}>
                    Uploading... {uploadProgress}%
                  </p>
                  <div style={{
                    maxWidth: '300px',
                    margin: '0 auto',
                    height: '4px',
                    background: '#27272a',
                    borderRadius: '2px',
                    overflow: 'hidden'
                  }}>
                    <div
                      style={{
                        height: '100%',
                        background: '#14b8a6',
                        width: `${uploadProgress}%`,
                        transition: 'width 0.3s ease'
                      }}
                    />
                  </div>
                </div>
              ) : (
                <>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginBottom: '24px' }}>
                    <ImageIcon style={{ width: '48px', height: '48px', color: '#14b8a6' }} />
                    <Video style={{ width: '48px', height: '48px', color: '#14b8a6' }} />
                  </div>
                  <UploadIcon style={{ width: '32px', height: '32px', color: '#888', margin: '0 auto 16px' }} />
                  <p style={{ color: 'white', fontSize: '18px', fontWeight: 500, marginBottom: '8px' }}>
                    {isDragActive ? 'Drop your file here...' : 'Drop your image or video here'}
                  </p>
                  <p style={{ color: '#888', fontSize: '14px', marginBottom: '24px' }}>
                    or click to browse
                  </p>
                  <p style={{ color: '#666', fontSize: '12px' }}>
                    Supports: JPG, PNG, GIF, MP4, MOV
                    <br />
                    Max size: 10MB for images, 100MB for videos
                  </p>
                </>
              )}
            </div>
          ) : (
            <div style={{ position: 'relative', background: '#1a1a1a', padding: '24px', borderRadius: '12px' }}>
              <button
                onClick={clearPreview}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'white',
                  borderRadius: '50%',
                  border: 'none',
                  cursor: 'pointer',
                  zIndex: 10
                }}
              >
                <X style={{ width: '20px', height: '20px', color: '#666' }} />
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
                  color: 'white',
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
                    background: '#1a1a1a',
                    border: '1px solid #27272a',
                    borderRadius: '8px',
                    color: '#14b8a6',
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
                  background: '#1a1a1a',
                  padding: '48px',
                  borderRadius: '12px',
                  textAlign: 'center'
                }}>
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
                    <Sparkles style={{ width: '32px', height: '32px', color: 'white' }} className="animate-pulse" />
                  </div>
                  <p style={{ color: 'white', fontSize: '16px', fontWeight: 500, marginBottom: '8px' }}>
                    AI is crafting your perfect caption...
                  </p>
                  <p style={{ color: '#888', fontSize: '14px' }}>
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
                    background: '#1a1a1a',
                    border: '1px solid #27272a',
                    borderRadius: '12px',
                    color: 'white',
                    fontSize: '14px',
                    lineHeight: '1.6',
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
                  color: 'white',
                  fontSize: '18px',
                  fontWeight: 600,
                  marginBottom: '24px'
                }}>
                  Select Platforms
                </h2>

                <div style={{ display: 'flex', gap: '16px' }}>
                  {[
                    { id: 'instagram', label: 'Instagram', color: '#E1306C' },
                    { id: 'facebook', label: 'Facebook', color: '#1877F2' },
                    { id: 'pinterest', label: 'Pinterest', color: '#E60023' }
                  ].map((platform) => (
                    <label
                      key={platform.id}
                      style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '16px',
                        background: selectedPlatforms.includes(platform.id) ? '#1a1a1a' : 'transparent',
                        border: selectedPlatforms.includes(platform.id) ? `2px solid ${platform.color}` : '2px solid #27272a',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedPlatforms.includes(platform.id)}
                        onChange={() => togglePlatform(platform.id)}
                        style={{
                          width: '20px',
                          height: '20px',
                          accentColor: platform.color,
                          cursor: 'pointer'
                        }}
                      />
                      <span style={{ color: 'white', fontSize: '16px', fontWeight: 500 }}>
                        {platform.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Scheduling */}
            {!generating && (
              <div style={{ marginBottom: '64px' }}>
                <h2 style={{
                  color: 'white',
                  fontSize: '18px',
                  fontWeight: 600,
                  marginBottom: '24px'
                }}>
                  When to Post
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '16px',
                      background: postType === 'now' ? '#1a1a1a' : 'transparent',
                      border: postType === 'now' ? '2px solid #14b8a6' : '2px solid #27272a',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <input
                      type="radio"
                      name="postType"
                      checked={postType === 'now'}
                      onChange={() => setPostType('now')}
                      style={{
                        width: '20px',
                        height: '20px',
                        accentColor: '#14b8a6',
                        cursor: 'pointer'
                      }}
                    />
                    <span style={{ color: 'white', fontSize: '16px', fontWeight: 500 }}>
                      Save as Draft
                    </span>
                  </label>

                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '16px',
                      background: postType === 'scheduled' ? '#1a1a1a' : 'transparent',
                      border: postType === 'scheduled' ? '2px solid #14b8a6' : '2px solid #27272a',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <input
                      type="radio"
                      name="postType"
                      checked={postType === 'scheduled'}
                      onChange={() => setPostType('scheduled')}
                      style={{
                        width: '20px',
                        height: '20px',
                        accentColor: '#14b8a6',
                        cursor: 'pointer'
                      }}
                    />
                    <span style={{ color: 'white', fontSize: '16px', fontWeight: 500 }}>
                      Schedule for Later
                    </span>
                  </label>
                </div>

                {postType === 'scheduled' && (
                  <input
                    type="datetime-local"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '16px',
                      background: '#1a1a1a',
                      border: '1px solid #27272a',
                      borderRadius: '12px',
                      color: 'white',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
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
                    background: '#14b8a6',
                    color: 'white',
                    fontSize: '16px',
                    fontWeight: 600,
                    border: 'none',
                    borderRadius: '8px',
                    cursor: saving ? 'not-allowed' : 'pointer',
                    opacity: saving ? 0.6 : 1,
                    transition: 'all 0.2s ease'
                  }}
                >
                  {saving ? 'Saving...' : postType === 'scheduled' ? 'Schedule Post' : 'Save as Draft'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </AppLayout>
  )
}

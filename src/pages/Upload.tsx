import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useBrand } from '../hooks/useBrand'
import { MediaUploader } from '../components/upload/MediaUploader'
import { ArrowLeft, Wand2, Sparkles, Image, Send, FileText, Clock } from 'lucide-react'
import type { Media } from '../types'
import toast from 'react-hot-toast'
import { supabase } from '../lib/supabase'

export function Upload() {
  const { user } = useAuth()
  const { brand, loading } = useBrand(user?.id)
  const navigate = useNavigate()
  const [uploadedMedia, setUploadedMedia] = useState<Media | null>(null)
  const [caption, setCaption] = useState('')
  const [generating, setGenerating] = useState(false)
  const [saving, setSaving] = useState(false)
  const [scheduledTime, setScheduledTime] = useState<string>('')
  const abortControllerRef = useRef<AbortController | null>(null)

  // Cleanup abort controller on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0d0d0d]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          <p className="text-[#a1a1aa] text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  if (!brand) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(180deg, #111111 0%, #0a0a0a 100%)' }}>
        <div className="max-w-md w-full bg-[#1a1a1a] text-center" style={{ borderRadius: '12px', padding: '32px' }}>
          <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 mb-6">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-semibold text-white mb-2">Brand Profile Required</h2>
          <p className="text-[#a1a1aa] mb-6">
            Please create a brand profile first to use this feature.
          </p>
          <button
            onClick={() => navigate('/settings')}
            className="bg-primary-500 hover:bg-primary-600 text-white font-medium px-6 py-3 rounded-lg w-full transition-colors"
          >
            Create Brand Profile
          </button>
        </div>
      </div>
    )
  }

  const handleUploadComplete = async (media: Media) => {
    setUploadedMedia(media)
    await generateCaption(media)
  }

  const generateCaption = async (media: Media) => {
    // Abort any existing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // Create new abort controller for this request
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
      // Don't show error if request was aborted
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

  const handleSaveDraft = async () => {
    if (!uploadedMedia) return

    setSaving(true)
    try {
      const postData: any = {
        brand_id: brand.id,
        media_id: uploadedMedia.id,
        generated_caption: caption,
        final_caption: caption,
        status: scheduledTime ? 'scheduled' : 'draft',
      }

      // Add scheduled_for if scheduledTime is set
      if (scheduledTime) {
        postData.scheduled_for = new Date(scheduledTime).toISOString()
      }

      const { error } = await supabase.from('posts').insert([postData])

      if (error) throw error

      if (scheduledTime) {
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

  const handleSchedule = () => {
    if (!uploadedMedia) return
    navigate('/schedule', {
      state: { media: uploadedMedia, caption },
    })
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] p-4 sm:p-8">
      <div className="container mx-auto max-w-4xl">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-[#a1a1aa] hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Dashboard</span>
        </button>

        <div className="bg-[#1a1a1a]" style={{ borderRadius: '12px', padding: '32px' }}>
          <div className="flex items-center gap-4 mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-600">
              <Image className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold text-white">Upload Content</h1>
              <p className="text-[#a1a1aa]">Create AI-powered posts for your brand</p>
            </div>
          </div>

          <div className="space-y-8">
            {/* Step 1: Media Upload */}
            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-500 text-white text-sm font-semibold">1</div>
                <h2 className="text-lg font-semibold text-white">Upload Media</h2>
              </div>
              <div className="ml-11">
                <MediaUploader brandId={brand.id} onUploadComplete={handleUploadComplete} />
              </div>
            </div>

            {/* Step 2: Caption Generation */}
            {uploadedMedia && (
              <div className="relative border-t border-[#27272a] pt-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-500 text-white text-sm font-semibold">2</div>
                    <h2 className="text-lg font-semibold text-white">Review & Edit Caption</h2>
                  </div>
                  <button
                    onClick={() => generateCaption(uploadedMedia)}
                    disabled={generating}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1a1a1a] border border-[#27272a] text-primary-400 font-medium hover:bg-[#222] disabled:opacity-50 transition-all duration-200"
                  >
                    <Wand2 className={`w-4 h-4 ${generating ? 'animate-spin' : ''}`} />
                    <span>{generating ? 'Generating...' : 'Regenerate'}</span>
                  </button>
                </div>

                <div className="ml-11">
                  {generating ? (
                    <div className="flex flex-col items-center justify-center py-12 rounded-xl bg-[#0d0d0d] border border-[#27272a]">
                      <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 mb-4">
                        <Sparkles className="h-8 w-8 text-white animate-pulse" />
                      </div>
                      <p className="text-white font-medium">AI is crafting your perfect caption...</p>
                      <p className="text-[#a1a1aa] text-sm mt-1">This may take a few seconds</p>
                    </div>
                  ) : (
                    <textarea
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                      rows={8}
                      className="w-full px-4 py-3 border border-[#27272a] bg-[#0d0d0d] rounded-xl resize-none text-white placeholder:text-[#71717a] focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Your AI-generated caption will appear here..."
                    />
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Schedule Time (Optional) */}
            {uploadedMedia && caption && !generating && (
              <div className="relative border-t border-[#27272a] pt-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-500 text-white text-sm font-semibold">3</div>
                  <h2 className="text-lg font-semibold text-white">Schedule Time (Optional)</h2>
                </div>
                <div className="ml-11">
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#a1a1aa] pointer-events-none" />
                    <input
                      type="datetime-local"
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 border border-[#27272a] rounded-xl bg-[#0d0d0d] text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                      placeholder="Select date and time"
                    />
                  </div>
                  <p className="mt-2 text-sm text-[#a1a1aa]">
                    {scheduledTime
                      ? 'Your post will be saved as scheduled'
                      : 'Leave empty to save as draft'}
                  </p>
                </div>
              </div>
            )}

            {/* Step 4: Actions */}
            {uploadedMedia && caption && !generating && (
              <div className="relative border-t border-[#27272a] pt-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-500 text-white text-sm font-semibold">4</div>
                  <h2 className="text-lg font-semibold text-white">Save or Continue</h2>
                </div>
                <div className="ml-11 flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={handleSaveDraft}
                    disabled={saving}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary-500 hover:bg-primary-600 text-white font-medium disabled:opacity-50 transition-colors"
                  >
                    {scheduledTime ? (
                      <>
                        <Clock className="w-5 h-5" />
                        <span>{saving ? 'Scheduling...' : 'Schedule Post'}</span>
                      </>
                    ) : (
                      <>
                        <FileText className="w-5 h-5" />
                        <span>{saving ? 'Saving...' : 'Save as Draft'}</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleSchedule}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-[#27272a] bg-[#1a1a1a] hover:bg-[#222] text-white font-medium transition-colors"
                  >
                    <Send className="w-5 h-5" />
                    <span>Advanced Schedule</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

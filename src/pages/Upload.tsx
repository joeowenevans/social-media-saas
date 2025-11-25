import { useState } from 'react'
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-charcoal-50 via-gray-50 to-charcoal-100 dark:from-charcoal-950 dark:via-charcoal-900 dark:to-charcoal-950">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="text-charcoal-500 dark:text-charcoal-400 text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  if (!brand) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-charcoal-50 via-gray-50 to-charcoal-100 dark:from-charcoal-950 dark:via-charcoal-900 dark:to-charcoal-950">
        <div className="max-w-md w-full card p-8 text-center animate-fade-in">
          <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg mb-6">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-charcoal-900 dark:text-white mb-2">Brand Profile Required</h2>
          <p className="text-charcoal-600 dark:text-charcoal-400 mb-6">
            Please create a brand profile first to use this feature.
          </p>
          <button
            onClick={() => navigate('/settings')}
            className="btn-primary px-6 py-3 w-full"
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
    setGenerating(true)
    try {
      const response = await fetch('/.netlify/functions/generate-caption', {
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
      })

      if (!response.ok) throw new Error('Failed to generate caption')

      const data = await response.json()
      setCaption(data.caption)
      toast.success('Caption generated!')
    } catch (error: any) {
      console.error('Caption generation error:', error)
      toast.error('Failed to generate caption. You can write one manually.')
      setCaption('')
    } finally {
      setGenerating(false)
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
    <div className="min-h-screen bg-gradient-to-br from-charcoal-50 via-gray-50 to-charcoal-100 dark:from-charcoal-950 dark:via-charcoal-900 dark:to-charcoal-950 p-4 sm:p-8">
      <div className="container mx-auto max-w-4xl animate-fade-in">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-charcoal-600 dark:text-charcoal-400 hover:text-charcoal-900 dark:hover:text-charcoal-100 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Dashboard</span>
        </button>

        <div className="card p-6 sm:p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg">
              <Image className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-charcoal-900 dark:text-white">Upload Content</h1>
              <p className="text-charcoal-600 dark:text-charcoal-400">Create AI-powered posts for your brand</p>
            </div>
          </div>

          <div className="space-y-8">
            {/* Step 1: Media Upload */}
            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-500 text-white text-sm font-bold">1</div>
                <h2 className="text-lg font-semibold text-charcoal-900 dark:text-white">Upload Media</h2>
              </div>
              <div className="ml-11">
                <MediaUploader brandId={brand.id} onUploadComplete={handleUploadComplete} />
              </div>
            </div>

            {/* Step 2: Caption Generation */}
            {uploadedMedia && (
              <div className="relative border-t border-charcoal-100 dark:border-charcoal-800 pt-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-500 text-white text-sm font-bold">2</div>
                    <h2 className="text-lg font-semibold text-charcoal-900 dark:text-white">Review & Edit Caption</h2>
                  </div>
                  <button
                    onClick={() => generateCaption(uploadedMedia)}
                    disabled={generating}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 font-medium hover:bg-primary-100 dark:hover:bg-primary-900/30 disabled:opacity-50 transition-all duration-200"
                  >
                    <Wand2 className={`w-4 h-4 ${generating ? 'animate-spin' : ''}`} />
                    <span>{generating ? 'Generating...' : 'Regenerate'}</span>
                  </button>
                </div>

                <div className="ml-11">
                  {generating ? (
                    <div className="flex flex-col items-center justify-center py-12 rounded-xl bg-gradient-to-br from-primary-50/50 to-cyan-50/30 dark:from-primary-900/10 dark:to-cyan-900/10 border border-primary-200 dark:border-primary-800">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg mb-4">
                        <Sparkles className="h-8 w-8 text-white animate-pulse" />
                      </div>
                      <p className="text-charcoal-600 dark:text-charcoal-300 font-medium">AI is crafting your perfect caption...</p>
                      <p className="text-charcoal-500 dark:text-charcoal-400 text-sm mt-1">This may take a few seconds</p>
                    </div>
                  ) : (
                    <textarea
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                      rows={8}
                      className="w-full px-4 py-3 border border-charcoal-300 dark:border-charcoal-700 bg-white dark:bg-charcoal-800 rounded-xl input-focus resize-none text-charcoal-900 dark:text-charcoal-100"
                      placeholder="Your AI-generated caption will appear here..."
                    />
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Schedule Time (Optional) */}
            {uploadedMedia && caption && !generating && (
              <div className="relative border-t border-charcoal-100 dark:border-charcoal-800 pt-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-500 text-white text-sm font-bold">3</div>
                  <h2 className="text-lg font-semibold text-charcoal-900 dark:text-white">Schedule Time (Optional)</h2>
                </div>
                <div className="ml-11">
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal-400 dark:text-charcoal-500 pointer-events-none" />
                    <input
                      type="datetime-local"
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 border border-charcoal-300 dark:border-charcoal-700 rounded-xl bg-white dark:bg-charcoal-800 text-charcoal-900 dark:text-charcoal-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      placeholder="Select date and time"
                    />
                  </div>
                  <p className="mt-2 text-sm text-charcoal-500 dark:text-charcoal-400">
                    {scheduledTime
                      ? 'Your post will be saved as scheduled'
                      : 'Leave empty to save as draft'}
                  </p>
                </div>
              </div>
            )}

            {/* Step 4: Actions */}
            {uploadedMedia && caption && !generating && (
              <div className="relative border-t border-charcoal-100 dark:border-charcoal-800 pt-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-500 text-white text-sm font-bold">4</div>
                  <h2 className="text-lg font-semibold text-charcoal-900 dark:text-white">Save or Continue</h2>
                </div>
                <div className="ml-11 flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={handleSaveDraft}
                    disabled={saving}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold hover:from-primary-600 hover:to-primary-700 disabled:opacity-50 transition-all duration-200 shadow-lg hover:shadow-xl"
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
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-charcoal-300 dark:border-charcoal-700 text-charcoal-700 dark:text-charcoal-300 font-medium hover:bg-charcoal-50 dark:hover:bg-charcoal-800 transition-all duration-200"
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

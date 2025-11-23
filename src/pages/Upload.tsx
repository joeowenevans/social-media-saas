import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useBrand } from '../hooks/useBrand'
import { MediaUploader } from '../components/upload/MediaUploader'
import { ArrowLeft, Wand2 } from 'lucide-react'
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

if (loading) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  )
}

if (!brand) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold mb-4">Brand Profile Required</h2>
        <p className="text-gray-600 mb-6">
          Please create a brand profile first to use this feature.
        </p>
        <button
          onClick={() => navigate('/settings')}
          className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700"
        >
          Create Brand Profile
        </button>
      </div>
    </div>
  )
}

  const handleUploadComplete = async (media: Media) => {
    setUploadedMedia(media)
    // Auto-generate caption
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
      const { error } = await supabase.from('posts').insert([
        {
          brand_id: brand.id,
          media_id: uploadedMedia.id,
          generated_caption: caption,
          final_caption: caption,
          status: 'draft',
        },
      ])

      if (error) throw error

      toast.success('Draft saved!')
      navigate('/dashboard')
    } catch (error: any) {
      console.error('Save error:', error)
      toast.error('Failed to save draft')
    } finally {
      setSaving(false)
    }
  }

  const handleSchedule = () => {
    if (!uploadedMedia) return
    // Navigate to schedule page with media and caption
    navigate('/schedule', {
      state: { media: uploadedMedia, caption },
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="container mx-auto max-w-4xl">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Dashboard</span>
        </button>

        <div className="bg-white rounded-lg shadow p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Upload Content</h1>

          <div className="space-y-8">
            {/* Media Upload */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Step 1: Upload Media
              </h2>
              <MediaUploader brandId={brand.id} onUploadComplete={handleUploadComplete} />
            </div>

            {/* Caption Generation */}
            {uploadedMedia && (
              <div className="border-t pt-8">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Step 2: Review & Edit Caption
                  </h2>
                  <button
                    onClick={() => generateCaption(uploadedMedia)}
                    disabled={generating}
                    className="flex items-center space-x-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 disabled:opacity-50"
                  >
                    <Wand2 className="w-4 h-4" />
                    <span>{generating ? 'Generating...' : 'Regenerate'}</span>
                  </button>
                </div>

                {generating ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                      <p className="text-gray-600">AI is crafting your perfect caption...</p>
                    </div>
                  </div>
                ) : (
                  <textarea
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    rows={8}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Your caption will appear here..."
                  />
                )}
              </div>
            )}

            {/* Actions */}
            {uploadedMedia && caption && !generating && (
              <div className="border-t pt-8 flex justify-end space-x-4">
                <button
                  onClick={handleSaveDraft}
                  disabled={saving}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save as Draft'}
                </button>
                <button
                  onClick={handleSchedule}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Schedule Post
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

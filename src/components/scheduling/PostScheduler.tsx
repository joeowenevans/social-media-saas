import { useState } from 'react'
import type { Media } from '../../types'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'
import { Instagram, Facebook } from 'lucide-react'

interface PostSchedulerProps {
  media: Media
  caption: string
  brandId: string
  onComplete: () => void
}

export function PostScheduler({ media, caption, brandId, onComplete }: PostSchedulerProps) {
  const [scheduledDate, setScheduledDate] = useState('')
  const [scheduledTime, setScheduledTime] = useState('')
  const [platforms, setPlatforms] = useState<string[]>(['instagram'])
  const [saving, setSaving] = useState(false)

  const togglePlatform = (platform: string) => {
    if (platforms.includes(platform)) {
      setPlatforms(platforms.filter((p) => p !== platform))
    } else {
      setPlatforms([...platforms, platform])
    }
  }

  const handleSchedule = async () => {
    if (!scheduledDate || !scheduledTime) {
      toast.error('Please select date and time')
      return
    }

    if (platforms.length === 0) {
      toast.error('Please select at least one platform')
      return
    }

    setSaving(true)
    try {
      const scheduledFor = new Date(`${scheduledDate}T${scheduledTime}`)

      const { error } = await supabase.from('posts').insert([
        {
          brand_id: brandId,
          media_id: media.id,
          generated_caption: caption,
          final_caption: caption,
          status: 'scheduled',
          scheduled_for: scheduledFor.toISOString(),
          platforms,
        },
      ])

      if (error) throw error

      toast.success('Post scheduled successfully!')
      onComplete()
    } catch (error: any) {
      console.error('Schedule error:', error)
      toast.error('Failed to schedule post')
    } finally {
      setSaving(false)
    }
  }

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="space-y-6">
      {/* Media Preview */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold text-gray-900 mb-3">Post Preview</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            {media.media_type === 'video' ? (
              <video
                src={media.cloudinary_url}
                controls
                className="w-full rounded-lg"
              />
            ) : (
              <img
                src={media.cloudinary_url}
                alt="Post media"
                className="w-full rounded-lg"
              />
            )}
          </div>
          <div>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{caption}</p>
          </div>
        </div>
      </div>

      {/* Platform Selection */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Select Platforms</h3>
        <div className="grid grid-cols-3 gap-4">
          <button
            type="button"
            onClick={() => togglePlatform('instagram')}
            className={`flex flex-col items-center justify-center p-4 border-2 rounded-lg transition ${
              platforms.includes('instagram')
                ? 'border-indigo-600 bg-indigo-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <Instagram className="w-8 h-8 mb-2" />
            <span className="text-sm font-medium">Instagram</span>
          </button>
          <button
            type="button"
            onClick={() => togglePlatform('facebook')}
            className={`flex flex-col items-center justify-center p-4 border-2 rounded-lg transition ${
              platforms.includes('facebook')
                ? 'border-indigo-600 bg-indigo-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <Facebook className="w-8 h-8 mb-2" />
            <span className="text-sm font-medium">Facebook</span>
          </button>
          <button
            type="button"
            onClick={() => togglePlatform('pinterest')}
            className={`flex flex-col items-center justify-center p-4 border-2 rounded-lg transition ${
              platforms.includes('pinterest')
                ? 'border-indigo-600 bg-indigo-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <div className="w-8 h-8 mb-2 flex items-center justify-center text-2xl">📌</div>
            <span className="text-sm font-medium">Pinterest</span>
          </button>
        </div>
      </div>

      {/* Date & Time Selection */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
            Schedule Date
          </label>
          <input
            type="date"
            id="date"
            min={today}
            value={scheduledDate}
            onChange={(e) => setScheduledDate(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <div>
          <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
            Schedule Time
          </label>
          <input
            type="time"
            id="time"
            value={scheduledTime}
            onChange={(e) => setScheduledTime(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-4">
        <button
          onClick={handleSchedule}
          disabled={saving}
          className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {saving ? 'Scheduling...' : 'Schedule Post'}
        </button>
      </div>
    </div>
  )
}

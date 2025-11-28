import { useState } from 'react'
import type { Brand } from '../../types'
import toast from 'react-hot-toast'

interface BrandSetupProps {
  onComplete: (brand: Brand) => void
  onSave: (brandData: Partial<Brand>) => Promise<{ data: Brand | null; error: string | null }>
  initialData?: Brand
}

export function BrandSetup({ onComplete, onSave, initialData }: BrandSetupProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    brand_voice: initialData?.brand_voice || '',
    target_audience: initialData?.target_audience || '',
    hashtag_count: initialData?.hashtag_count || 7,
    hashtags_always_use: initialData?.hashtags_always_use?.join(', ') || '',
    hashtags_avoid: initialData?.hashtags_avoid?.join(', ') || '',
    cta_preference: initialData?.cta_preference || 'visit_link',
    emoji_count: initialData?.emoji_count || 2,
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const brandData = {
      name: formData.name,
      brand_voice: formData.brand_voice,
      target_audience: formData.target_audience,
      hashtag_count: formData.hashtag_count,
      hashtags_always_use: formData.hashtags_always_use
        .split(',')
        .map(h => h.trim())
        .filter(h => h.length > 0),
      hashtags_avoid: formData.hashtags_avoid
        .split(',')
        .map(h => h.trim())
        .filter(h => h.length > 0),
      cta_preference: formData.cta_preference,
      emoji_count: formData.emoji_count,
    }

    const { data, error } = await onSave(brandData)

    if (error) {
      toast.error(error)
      setLoading(false)
    } else if (data) {
      toast.success(initialData ? 'Brand updated successfully!' : 'Brand created successfully!')
      onComplete(data)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-semibold text-charcoal-700 dark:text-charcoal-300 mb-2">
          Brand Name *
        </label>
        <input
          type="text"
          id="name"
          required
          className="w-full px-4 py-3 border border-charcoal-300 dark:border-charcoal-700 bg-white dark:bg-charcoal-800 rounded-xl text-charcoal-900 dark:text-charcoal-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>

      <div>
        <label htmlFor="brand_voice" className="block text-sm font-semibold text-charcoal-700 dark:text-charcoal-300 mb-2">
          Brand Voice
        </label>
        <textarea
          id="brand_voice"
          rows={3}
          className="w-full px-4 py-3 border border-charcoal-300 dark:border-charcoal-700 bg-white dark:bg-charcoal-800 rounded-xl resize-none text-charcoal-900 dark:text-charcoal-100 font-normal leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all scrollbar-thin scrollbar-thumb-charcoal-400 dark:scrollbar-thumb-charcoal-600 scrollbar-track-charcoal-100 dark:scrollbar-track-charcoal-800"
          placeholder="e.g., Friendly, professional, witty..."
          value={formData.brand_voice}
          onChange={(e) => setFormData({ ...formData, brand_voice: e.target.value })}
        />
      </div>

      <div>
        <label htmlFor="target_audience" className="block text-sm font-semibold text-charcoal-700 dark:text-charcoal-300 mb-2">
          Target Audience
        </label>
        <textarea
          id="target_audience"
          rows={3}
          className="w-full px-4 py-3 border border-charcoal-300 dark:border-charcoal-700 bg-white dark:bg-charcoal-800 rounded-xl resize-none text-charcoal-900 dark:text-charcoal-100 font-normal leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all scrollbar-thin scrollbar-thumb-charcoal-400 dark:scrollbar-thumb-charcoal-600 scrollbar-track-charcoal-100 dark:scrollbar-track-charcoal-800"
          placeholder="e.g., Young professionals aged 25-35 interested in technology..."
          value={formData.target_audience}
          onChange={(e) => setFormData({ ...formData, target_audience: e.target.value })}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="hashtag_count" className="block text-sm font-semibold text-charcoal-700 dark:text-charcoal-300 mb-2">
            Number of Hashtags
          </label>
          <input
            type="number"
            id="hashtag_count"
            min="0"
            max="30"
            className="w-full px-4 py-3 border border-charcoal-300 dark:border-charcoal-700 bg-white dark:bg-charcoal-800 rounded-xl text-charcoal-900 dark:text-charcoal-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            value={formData.hashtag_count}
            onChange={(e) => setFormData({ ...formData, hashtag_count: parseInt(e.target.value) })}
          />
        </div>

        <div>
          <label htmlFor="emoji_count" className="block text-sm font-semibold text-charcoal-700 dark:text-charcoal-300 mb-2">
            Number of Emojis
          </label>
          <input
            type="number"
            id="emoji_count"
            min="0"
            max="10"
            className="w-full px-4 py-3 border border-charcoal-300 dark:border-charcoal-700 bg-white dark:bg-charcoal-800 rounded-xl text-charcoal-900 dark:text-charcoal-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            value={formData.emoji_count}
            onChange={(e) => setFormData({ ...formData, emoji_count: parseInt(e.target.value) })}
          />
        </div>
      </div>

      <div>
        <label htmlFor="hashtags_always_use" className="block text-sm font-semibold text-charcoal-700 dark:text-charcoal-300 mb-2">
          Always Use These Hashtags
        </label>
        <input
          type="text"
          id="hashtags_always_use"
          className="w-full px-4 py-3 border border-charcoal-300 dark:border-charcoal-700 bg-white dark:bg-charcoal-800 rounded-xl text-charcoal-900 dark:text-charcoal-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          placeholder="e.g., #brandname, #yourhashtag (comma-separated)"
          value={formData.hashtags_always_use}
          onChange={(e) => setFormData({ ...formData, hashtags_always_use: e.target.value })}
        />
      </div>

      <div>
        <label htmlFor="hashtags_avoid" className="block text-sm font-semibold text-charcoal-700 dark:text-charcoal-300 mb-2">
          Avoid These Hashtags
        </label>
        <input
          type="text"
          id="hashtags_avoid"
          className="w-full px-4 py-3 border border-charcoal-300 dark:border-charcoal-700 bg-white dark:bg-charcoal-800 rounded-xl text-charcoal-900 dark:text-charcoal-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          placeholder="e.g., #spam, #unwanted (comma-separated)"
          value={formData.hashtags_avoid}
          onChange={(e) => setFormData({ ...formData, hashtags_avoid: e.target.value })}
        />
      </div>

      <div>
        <label htmlFor="cta_preference" className="block text-sm font-semibold text-charcoal-700 dark:text-charcoal-300 mb-2">
          Call-to-Action Preference
        </label>
        <select
          id="cta_preference"
          className="w-full px-4 py-3 border border-charcoal-300 dark:border-charcoal-700 bg-white dark:bg-charcoal-800 rounded-xl text-charcoal-900 dark:text-charcoal-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          value={formData.cta_preference}
          onChange={(e) => setFormData({ ...formData, cta_preference: e.target.value })}
        >
          <option value="visit_link">Visit Link in Bio</option>
          <option value="comment">Leave a Comment</option>
          <option value="like_follow">Like & Follow</option>
          <option value="shop_now">Shop Now</option>
          <option value="learn_more">Learn More</option>
          <option value="custom">Custom</option>
        </select>
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-xl hover:from-primary-600 hover:to-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl hover:scale-[1.02]"
        >
          {loading ? 'Saving...' : initialData ? 'Update Brand' : 'Create Brand'}
        </button>
      </div>
    </form>
  )
}

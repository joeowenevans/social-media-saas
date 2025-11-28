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
    industry_niche: initialData?.industry_niche || '',
    voice_description: initialData?.voice_description || '',
    audience_priorities: initialData?.audience_priorities || '',
    brand_values: initialData?.brand_values || '',
    preferred_caption_length: initialData?.preferred_caption_length || 'medium',
    hashtag_topics: initialData?.hashtag_topics || '',
    cta_style: initialData?.cta_style || 'direct',
    example_captions: initialData?.example_captions || '',
    phrases_taglines: initialData?.phrases_taglines || '',
    general_goals: initialData?.general_goals || '',
    num_hashtags: initialData?.num_hashtags || 7,
    num_emojis: initialData?.num_emojis || 2,
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { data, error } = await onSave(formData)

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
      {/* 1. Brand Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-semibold text-charcoal-700 dark:text-charcoal-300 mb-2">
          Brand Name *
        </label>
        <input
          type="text"
          id="name"
          required
          placeholder="e.g., Blue Pencil Gallery"
          className="w-full px-4 py-3 border border-charcoal-300 dark:border-charcoal-700 bg-white dark:bg-charcoal-800 rounded-xl text-charcoal-900 dark:text-charcoal-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>

      {/* 2. Industry/Niche */}
      <div>
        <label htmlFor="industry_niche" className="block text-sm font-semibold text-charcoal-700 dark:text-charcoal-300 mb-2">
          Industry/Niche
        </label>
        <input
          type="text"
          id="industry_niche"
          placeholder="e.g., Pet Portrait Artist, Animation-Inspired Art"
          className="w-full px-4 py-3 border border-charcoal-300 dark:border-charcoal-700 bg-white dark:bg-charcoal-800 rounded-xl text-charcoal-900 dark:text-charcoal-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          value={formData.industry_niche}
          onChange={(e) => setFormData({ ...formData, industry_niche: e.target.value })}
        />
        <p className="mt-2 text-xs text-charcoal-500 dark:text-charcoal-400">
          What industry or niche does your brand operate in?
        </p>
      </div>

      {/* 3. Voice Description */}
      <div>
        <label htmlFor="voice_description" className="block text-sm font-semibold text-charcoal-700 dark:text-charcoal-300 mb-2">
          Voice Description
        </label>
        <textarea
          id="voice_description"
          rows={3}
          placeholder="e.g., Friendly, professional, enthusiastic about pets"
          className="w-full px-4 py-3 border border-charcoal-300 dark:border-charcoal-700 bg-white dark:bg-charcoal-800 rounded-xl resize-none text-charcoal-900 dark:text-charcoal-100 font-normal leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all scrollbar-thin scrollbar-thumb-charcoal-400 dark:scrollbar-thumb-charcoal-600 scrollbar-track-charcoal-100 dark:scrollbar-track-charcoal-800"
          value={formData.voice_description}
          onChange={(e) => setFormData({ ...formData, voice_description: e.target.value })}
        />
        <p className="mt-2 text-xs text-charcoal-500 dark:text-charcoal-400">
          How should your brand sound? Describe the tone and personality.
        </p>
      </div>

      {/* 4. Audience Priorities */}
      <div>
        <label htmlFor="audience_priorities" className="block text-sm font-semibold text-charcoal-700 dark:text-charcoal-300 mb-2">
          Audience Priorities
        </label>
        <textarea
          id="audience_priorities"
          rows={3}
          placeholder="e.g., Pet owners looking for custom artwork, fans of animation"
          className="w-full px-4 py-3 border border-charcoal-300 dark:border-charcoal-700 bg-white dark:bg-charcoal-800 rounded-xl resize-none text-charcoal-900 dark:text-charcoal-100 font-normal leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all scrollbar-thin scrollbar-thumb-charcoal-400 dark:scrollbar-thumb-charcoal-600 scrollbar-track-charcoal-100 dark:scrollbar-track-charcoal-800"
          value={formData.audience_priorities}
          onChange={(e) => setFormData({ ...formData, audience_priorities: e.target.value })}
        />
        <p className="mt-2 text-xs text-charcoal-500 dark:text-charcoal-400">
          Who is your target audience? What do they care about?
        </p>
      </div>

      {/* 5. Brand Values */}
      <div>
        <label htmlFor="brand_values" className="block text-sm font-semibold text-charcoal-700 dark:text-charcoal-300 mb-2">
          Brand Values
        </label>
        <textarea
          id="brand_values"
          rows={3}
          placeholder="e.g., Quality craftsmanship, customer satisfaction, creativity"
          className="w-full px-4 py-3 border border-charcoal-300 dark:border-charcoal-700 bg-white dark:bg-charcoal-800 rounded-xl resize-none text-charcoal-900 dark:text-charcoal-100 font-normal leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all scrollbar-thin scrollbar-thumb-charcoal-400 dark:scrollbar-thumb-charcoal-600 scrollbar-track-charcoal-100 dark:scrollbar-track-charcoal-800"
          value={formData.brand_values}
          onChange={(e) => setFormData({ ...formData, brand_values: e.target.value })}
        />
        <p className="mt-2 text-xs text-charcoal-500 dark:text-charcoal-400">
          What values does your brand stand for?
        </p>
      </div>

      {/* 6. Preferred Caption Length */}
      <div>
        <label htmlFor="preferred_caption_length" className="block text-sm font-semibold text-charcoal-700 dark:text-charcoal-300 mb-2">
          Preferred Caption Length
        </label>
        <select
          id="preferred_caption_length"
          className="w-full px-4 py-3 border border-charcoal-300 dark:border-charcoal-700 bg-white dark:bg-charcoal-800 rounded-xl text-charcoal-900 dark:text-charcoal-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          value={formData.preferred_caption_length}
          onChange={(e) => setFormData({ ...formData, preferred_caption_length: e.target.value })}
        >
          <option value="short">Short (1-2 sentences)</option>
          <option value="medium">Medium (3-5 sentences)</option>
          <option value="long">Long (6+ sentences)</option>
        </select>
      </div>

      {/* 7. Hashtag Topics/Branding */}
      <div>
        <label htmlFor="hashtag_topics" className="block text-sm font-semibold text-charcoal-700 dark:text-charcoal-300 mb-2">
          Hashtag Topics/Branding
        </label>
        <input
          type="text"
          id="hashtag_topics"
          placeholder="e.g., petportrait, customart, animationstyle, brandname"
          className="w-full px-4 py-3 border border-charcoal-300 dark:border-charcoal-700 bg-white dark:bg-charcoal-800 rounded-xl text-charcoal-900 dark:text-charcoal-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          value={formData.hashtag_topics}
          onChange={(e) => setFormData({ ...formData, hashtag_topics: e.target.value })}
        />
        <p className="mt-2 text-xs text-charcoal-500 dark:text-charcoal-400">
          Keywords for hashtag generation (comma-separated)
        </p>
      </div>

      {/* 8. CTA Style */}
      <div>
        <label htmlFor="cta_style" className="block text-sm font-semibold text-charcoal-700 dark:text-charcoal-300 mb-2">
          Call-to-Action Style
        </label>
        <select
          id="cta_style"
          className="w-full px-4 py-3 border border-charcoal-300 dark:border-charcoal-700 bg-white dark:bg-charcoal-800 rounded-xl text-charcoal-900 dark:text-charcoal-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          value={formData.cta_style}
          onChange={(e) => setFormData({ ...formData, cta_style: e.target.value })}
        >
          <option value="direct">Direct (e.g., 'Shop now', 'Book today')</option>
          <option value="soft">Soft (e.g., 'Learn more', 'Discover')</option>
          <option value="question">Question (e.g., 'Ready to transform your space?')</option>
          <option value="none">None (No CTA)</option>
        </select>
      </div>

      {/* 9. Example Captions */}
      <div>
        <label htmlFor="example_captions" className="block text-sm font-semibold text-charcoal-700 dark:text-charcoal-300 mb-2">
          Example Captions
        </label>
        <textarea
          id="example_captions"
          rows={5}
          placeholder="Paste 2-3 example captions that match your desired style..."
          className="w-full px-4 py-3 border border-charcoal-300 dark:border-charcoal-700 bg-white dark:bg-charcoal-800 rounded-xl resize-none text-charcoal-900 dark:text-charcoal-100 font-normal leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all scrollbar-thin scrollbar-thumb-charcoal-400 dark:scrollbar-thumb-charcoal-600 scrollbar-track-charcoal-100 dark:scrollbar-track-charcoal-800"
          value={formData.example_captions}
          onChange={(e) => setFormData({ ...formData, example_captions: e.target.value })}
        />
        <p className="mt-2 text-xs text-charcoal-500 dark:text-charcoal-400">
          Provide examples of captions you love - AI will learn from these
        </p>
      </div>

      {/* 10. Signature Phrases/Taglines */}
      <div>
        <label htmlFor="phrases_taglines" className="block text-sm font-semibold text-charcoal-700 dark:text-charcoal-300 mb-2">
          Signature Phrases/Taglines
        </label>
        <input
          type="text"
          id="phrases_taglines"
          placeholder="e.g., 'Art that captures the soul', 'Your pet, immortalized'"
          className="w-full px-4 py-3 border border-charcoal-300 dark:border-charcoal-700 bg-white dark:bg-charcoal-800 rounded-xl text-charcoal-900 dark:text-charcoal-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          value={formData.phrases_taglines}
          onChange={(e) => setFormData({ ...formData, phrases_taglines: e.target.value })}
        />
        <p className="mt-2 text-xs text-charcoal-500 dark:text-charcoal-400">
          Phrases you want occasionally included in captions
        </p>
      </div>

      {/* 11. General Goals */}
      <div>
        <label htmlFor="general_goals" className="block text-sm font-semibold text-charcoal-700 dark:text-charcoal-300 mb-2">
          General Goals
        </label>
        <textarea
          id="general_goals"
          rows={3}
          placeholder="e.g., Increase bookings for custom portraits, build community of pet lovers"
          className="w-full px-4 py-3 border border-charcoal-300 dark:border-charcoal-700 bg-white dark:bg-charcoal-800 rounded-xl resize-none text-charcoal-900 dark:text-charcoal-100 font-normal leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all scrollbar-thin scrollbar-thumb-charcoal-400 dark:scrollbar-thumb-charcoal-600 scrollbar-track-charcoal-100 dark:scrollbar-track-charcoal-800"
          value={formData.general_goals}
          onChange={(e) => setFormData({ ...formData, general_goals: e.target.value })}
        />
        <p className="mt-2 text-xs text-charcoal-500 dark:text-charcoal-400">
          What are your overall social media goals?
        </p>
      </div>

      {/* 12 & 13. Number Inputs Row */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="num_hashtags" className="block text-sm font-semibold text-charcoal-700 dark:text-charcoal-300 mb-2">
            Number of Hashtags
          </label>
          <input
            type="number"
            id="num_hashtags"
            min="0"
            max="30"
            placeholder="7"
            className="w-full px-4 py-3 border border-charcoal-300 dark:border-charcoal-700 bg-white dark:bg-charcoal-800 rounded-xl text-charcoal-900 dark:text-charcoal-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            value={formData.num_hashtags}
            onChange={(e) => setFormData({ ...formData, num_hashtags: parseInt(e.target.value) || 0 })}
          />
        </div>

        <div>
          <label htmlFor="num_emojis" className="block text-sm font-semibold text-charcoal-700 dark:text-charcoal-300 mb-2">
            Number of Emojis
          </label>
          <input
            type="number"
            id="num_emojis"
            min="0"
            max="10"
            placeholder="2"
            className="w-full px-4 py-3 border border-charcoal-300 dark:border-charcoal-700 bg-white dark:bg-charcoal-800 rounded-xl text-charcoal-900 dark:text-charcoal-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            value={formData.num_emojis}
            onChange={(e) => setFormData({ ...formData, num_emojis: parseInt(e.target.value) || 0 })}
          />
        </div>
      </div>

      {/* Save Button */}
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

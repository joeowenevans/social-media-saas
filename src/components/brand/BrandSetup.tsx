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

  const inputStyle = {
    width: '100%',
    background: '#1a1a1a',
    border: '1px solid #27272a',
    borderRadius: '12px',
    padding: '16px',
    color: '#e5e5e5',
    fontSize: '15px',
    lineHeight: '1.6',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    outline: 'none',
    transition: 'border-color 0.2s ease'
  }

  const labelStyle = {
    color: '#e5e5e5',
    fontSize: '14px',
    fontWeight: 500,
    marginBottom: '8px',
    display: 'block'
  } as const

  const helperTextStyle = {
    color: '#888',
    fontSize: '12px',
    marginTop: '4px'
  }

  const fieldContainerStyle = {
    marginBottom: '32px'
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* 1. Brand Name */}
      <div style={fieldContainerStyle}>
        <label htmlFor="name" style={labelStyle}>
          Brand Name *
        </label>
        <input
          type="text"
          id="name"
          required
          placeholder="e.g., Blue Pencil Gallery"
          style={{ ...inputStyle, height: '44px' }}
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          onFocus={(e) => e.target.style.borderColor = '#14b8a6'}
          onBlur={(e) => e.target.style.borderColor = '#27272a'}
        />
      </div>

      {/* 2. Industry/Niche */}
      <div style={fieldContainerStyle}>
        <label htmlFor="industry_niche" style={labelStyle}>
          Industry/Niche
        </label>
        <input
          type="text"
          id="industry_niche"
          placeholder="e.g., Pet Portrait Artist, Animation-Inspired Art"
          style={{ ...inputStyle, height: '44px' }}
          value={formData.industry_niche}
          onChange={(e) => setFormData({ ...formData, industry_niche: e.target.value })}
          onFocus={(e) => e.target.style.borderColor = '#14b8a6'}
          onBlur={(e) => e.target.style.borderColor = '#27272a'}
        />
        <p style={helperTextStyle}>What industry or niche does your brand operate in?</p>
      </div>

      {/* 3. Voice Description */}
      <div style={fieldContainerStyle}>
        <label htmlFor="voice_description" style={labelStyle}>
          Voice Description
        </label>
        <textarea
          id="voice_description"
          style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
          placeholder="e.g., Friendly, professional, enthusiastic about pets"
          value={formData.voice_description}
          onChange={(e) => setFormData({ ...formData, voice_description: e.target.value })}
          onFocus={(e) => e.target.style.borderColor = '#14b8a6'}
          onBlur={(e) => e.target.style.borderColor = '#27272a'}
        />
        <p style={helperTextStyle}>How should your brand sound? Describe the tone and personality.</p>
      </div>

      {/* 4. Audience Priorities */}
      <div style={fieldContainerStyle}>
        <label htmlFor="audience_priorities" style={labelStyle}>
          Audience Priorities
        </label>
        <textarea
          id="audience_priorities"
          style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
          placeholder="e.g., Pet owners looking for custom artwork, fans of animation"
          value={formData.audience_priorities}
          onChange={(e) => setFormData({ ...formData, audience_priorities: e.target.value })}
          onFocus={(e) => e.target.style.borderColor = '#14b8a6'}
          onBlur={(e) => e.target.style.borderColor = '#27272a'}
        />
        <p style={helperTextStyle}>Who is your target audience? What do they care about?</p>
      </div>

      {/* 5. Brand Values */}
      <div style={fieldContainerStyle}>
        <label htmlFor="brand_values" style={labelStyle}>
          Brand Values
        </label>
        <textarea
          id="brand_values"
          style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
          placeholder="e.g., Quality craftsmanship, customer satisfaction, creativity"
          value={formData.brand_values}
          onChange={(e) => setFormData({ ...formData, brand_values: e.target.value })}
          onFocus={(e) => e.target.style.borderColor = '#14b8a6'}
          onBlur={(e) => e.target.style.borderColor = '#27272a'}
        />
        <p style={helperTextStyle}>What values does your brand stand for?</p>
      </div>

      {/* 6. Preferred Caption Length */}
      <div style={fieldContainerStyle}>
        <label htmlFor="preferred_caption_length" style={labelStyle}>
          Preferred Caption Length
        </label>
        <select
          id="preferred_caption_length"
          style={{
            ...inputStyle,
            height: '44px',
            cursor: 'pointer',
            appearance: 'none',
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'%3E%3Cpath fill='%23e5e5e5' d='M4.427 6.427l3.396 3.396a.25.25 0 00.354 0l3.396-3.396A.25.25 0 0011.396 6H4.604a.25.25 0 00-.177.427z'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 12px center',
            paddingRight: '40px'
          }}
          value={formData.preferred_caption_length}
          onChange={(e) => setFormData({ ...formData, preferred_caption_length: e.target.value })}
          onFocus={(e) => e.target.style.borderColor = '#14b8a6'}
          onBlur={(e) => e.target.style.borderColor = '#27272a'}
        >
          <option value="short" style={{ background: '#1a1a1a', color: '#e5e5e5' }}>Short (1-2 sentences)</option>
          <option value="medium" style={{ background: '#1a1a1a', color: '#e5e5e5' }}>Medium (3-5 sentences)</option>
          <option value="long" style={{ background: '#1a1a1a', color: '#e5e5e5' }}>Long (6+ sentences)</option>
        </select>
      </div>

      {/* 7. Hashtag Topics/Branding */}
      <div style={fieldContainerStyle}>
        <label htmlFor="hashtag_topics" style={labelStyle}>
          Hashtag Topics/Branding
        </label>
        <input
          type="text"
          id="hashtag_topics"
          placeholder="e.g., petportrait, customart, animationstyle, brandname"
          style={{ ...inputStyle, height: '44px' }}
          value={formData.hashtag_topics}
          onChange={(e) => setFormData({ ...formData, hashtag_topics: e.target.value })}
          onFocus={(e) => e.target.style.borderColor = '#14b8a6'}
          onBlur={(e) => e.target.style.borderColor = '#27272a'}
        />
        <p style={helperTextStyle}>Keywords for hashtag generation (comma-separated)</p>
      </div>

      {/* 8. CTA Style */}
      <div style={fieldContainerStyle}>
        <label htmlFor="cta_style" style={labelStyle}>
          Call-to-Action Style
        </label>
        <select
          id="cta_style"
          style={{
            ...inputStyle,
            height: '44px',
            cursor: 'pointer',
            appearance: 'none',
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'%3E%3Cpath fill='%23e5e5e5' d='M4.427 6.427l3.396 3.396a.25.25 0 00.354 0l3.396-3.396A.25.25 0 0011.396 6H4.604a.25.25 0 00-.177.427z'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 12px center',
            paddingRight: '40px'
          }}
          value={formData.cta_style}
          onChange={(e) => setFormData({ ...formData, cta_style: e.target.value })}
          onFocus={(e) => e.target.style.borderColor = '#14b8a6'}
          onBlur={(e) => e.target.style.borderColor = '#27272a'}
        >
          <option value="direct" style={{ background: '#1a1a1a', color: '#e5e5e5' }}>Direct (e.g., 'Shop now', 'Book today')</option>
          <option value="soft" style={{ background: '#1a1a1a', color: '#e5e5e5' }}>Soft (e.g., 'Learn more', 'Discover')</option>
          <option value="question" style={{ background: '#1a1a1a', color: '#e5e5e5' }}>Question (e.g., 'Ready to transform your space?')</option>
          <option value="none" style={{ background: '#1a1a1a', color: '#e5e5e5' }}>None (No CTA)</option>
        </select>
      </div>

      {/* 9. Example Captions */}
      <div style={fieldContainerStyle}>
        <label htmlFor="example_captions" style={labelStyle}>
          Example Captions
        </label>
        <textarea
          id="example_captions"
          style={{ ...inputStyle, minHeight: '120px', resize: 'vertical' }}
          placeholder="Paste 2-3 example captions that match your desired style..."
          value={formData.example_captions}
          onChange={(e) => setFormData({ ...formData, example_captions: e.target.value })}
          onFocus={(e) => e.target.style.borderColor = '#14b8a6'}
          onBlur={(e) => e.target.style.borderColor = '#27272a'}
        />
        <p style={helperTextStyle}>Provide examples of captions you love - AI will learn from these</p>
      </div>

      {/* 10. Signature Phrases/Taglines */}
      <div style={fieldContainerStyle}>
        <label htmlFor="phrases_taglines" style={labelStyle}>
          Signature Phrases/Taglines
        </label>
        <input
          type="text"
          id="phrases_taglines"
          placeholder="e.g., 'Art that captures the soul', 'Your pet, immortalized'"
          style={{ ...inputStyle, height: '44px' }}
          value={formData.phrases_taglines}
          onChange={(e) => setFormData({ ...formData, phrases_taglines: e.target.value })}
          onFocus={(e) => e.target.style.borderColor = '#14b8a6'}
          onBlur={(e) => e.target.style.borderColor = '#27272a'}
        />
        <p style={helperTextStyle}>Phrases you want occasionally included in captions</p>
      </div>

      {/* 11. General Goals */}
      <div style={fieldContainerStyle}>
        <label htmlFor="general_goals" style={labelStyle}>
          General Goals
        </label>
        <textarea
          id="general_goals"
          style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
          placeholder="e.g., Increase bookings for custom portraits, build community of pet lovers"
          value={formData.general_goals}
          onChange={(e) => setFormData({ ...formData, general_goals: e.target.value })}
          onFocus={(e) => e.target.style.borderColor = '#14b8a6'}
          onBlur={(e) => e.target.style.borderColor = '#27272a'}
        />
        <p style={helperTextStyle}>What are your overall social media goals?</p>
      </div>

      {/* 12 & 13. Number Inputs Row */}
      <div style={{ display: 'flex', gap: '24px', marginBottom: '32px' }}>
        <div style={{ flex: 1 }}>
          <label htmlFor="num_hashtags" style={labelStyle}>
            Number of Hashtags
          </label>
          <input
            type="number"
            id="num_hashtags"
            min="0"
            max="30"
            placeholder="7"
            style={{ ...inputStyle, height: '44px' }}
            value={formData.num_hashtags}
            onChange={(e) => setFormData({ ...formData, num_hashtags: parseInt(e.target.value) || 0 })}
            onFocus={(e) => e.target.style.borderColor = '#14b8a6'}
            onBlur={(e) => e.target.style.borderColor = '#27272a'}
          />
        </div>

        <div style={{ flex: 1 }}>
          <label htmlFor="num_emojis" style={labelStyle}>
            Number of Emojis
          </label>
          <input
            type="number"
            id="num_emojis"
            min="0"
            max="10"
            placeholder="2"
            style={{ ...inputStyle, height: '44px' }}
            value={formData.num_emojis}
            onChange={(e) => setFormData({ ...formData, num_emojis: parseInt(e.target.value) || 0 })}
            onFocus={(e) => e.target.style.borderColor = '#14b8a6'}
            onBlur={(e) => e.target.style.borderColor = '#27272a'}
          />
        </div>
      </div>

      {/* Save Button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '32px' }}>
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '12px 32px',
            background: loading ? '#2a2a2a' : '#2a2a2a',
            color: 'white',
            fontSize: '16px',
            fontWeight: 600,
            border: 'none',
            borderRadius: '20px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1,
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.currentTarget.style.background = '#14b8a6'
              e.currentTarget.style.transform = 'scale(1.05)'
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#2a2a2a'
            e.currentTarget.style.transform = 'scale(1)'
          }}
        >
          {loading ? 'Saving...' : initialData ? 'Update Brand' : 'Create Brand'}
        </button>
      </div>
    </form>
  )
}

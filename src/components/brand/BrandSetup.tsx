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

  const inputStyle = {
    width: '100%',
    background: '#0d0d0d',
    border: '1px solid #27272a',
    borderRadius: '8px',
    padding: '12px 16px',
    color: '#e5e5e5',
    fontSize: '15px',
    outline: 'none',
    transition: 'border-color 0.2s ease'
  }

  const labelStyle = {
    color: '#e5e5e5',
    fontSize: '14px',
    fontWeight: 500,
    marginBottom: '8px',
    display: 'block'
  }

  const fieldContainerStyle = {
    marginBottom: '24px'
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Brand Name */}
      <div style={fieldContainerStyle}>
        <label htmlFor="name" style={labelStyle}>
          Brand Name *
        </label>
        <input
          type="text"
          id="name"
          required
          style={{ ...inputStyle, height: '44px' }}
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          onFocus={(e) => e.target.style.borderColor = '#14b8a6'}
          onBlur={(e) => e.target.style.borderColor = '#27272a'}
        />
      </div>

      {/* Brand Voice */}
      <div style={fieldContainerStyle}>
        <label htmlFor="brand_voice" style={labelStyle}>
          Brand Voice
        </label>
        <textarea
          id="brand_voice"
          style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }}
          placeholder="e.g., Friendly, professional, witty..."
          value={formData.brand_voice}
          onChange={(e) => setFormData({ ...formData, brand_voice: e.target.value })}
          onFocus={(e) => e.target.style.borderColor = '#14b8a6'}
          onBlur={(e) => e.target.style.borderColor = '#27272a'}
        />
      </div>

      {/* Target Audience */}
      <div style={fieldContainerStyle}>
        <label htmlFor="target_audience" style={labelStyle}>
          Target Audience
        </label>
        <textarea
          id="target_audience"
          style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
          placeholder="e.g., Young professionals aged 25-35 interested in technology..."
          value={formData.target_audience}
          onChange={(e) => setFormData({ ...formData, target_audience: e.target.value })}
          onFocus={(e) => e.target.style.borderColor = '#14b8a6'}
          onBlur={(e) => e.target.style.borderColor = '#27272a'}
        />
      </div>

      {/* Number Inputs Row */}
      <div style={{ display: 'flex', gap: '24px', marginBottom: '24px' }}>
        <div style={{ flex: 1 }}>
          <label htmlFor="hashtag_count" style={labelStyle}>
            Number of Hashtags
          </label>
          <input
            type="number"
            id="hashtag_count"
            min="0"
            max="30"
            style={{ ...inputStyle, height: '44px', width: '100px' }}
            value={formData.hashtag_count}
            onChange={(e) => setFormData({ ...formData, hashtag_count: parseInt(e.target.value) })}
            onFocus={(e) => e.target.style.borderColor = '#14b8a6'}
            onBlur={(e) => e.target.style.borderColor = '#27272a'}
          />
        </div>

        <div style={{ flex: 1 }}>
          <label htmlFor="emoji_count" style={labelStyle}>
            Number of Emojis
          </label>
          <input
            type="number"
            id="emoji_count"
            min="0"
            max="10"
            style={{ ...inputStyle, height: '44px', width: '100px' }}
            value={formData.emoji_count}
            onChange={(e) => setFormData({ ...formData, emoji_count: parseInt(e.target.value) })}
            onFocus={(e) => e.target.style.borderColor = '#14b8a6'}
            onBlur={(e) => e.target.style.borderColor = '#27272a'}
          />
        </div>
      </div>

      {/* Always Use Hashtags */}
      <div style={fieldContainerStyle}>
        <label htmlFor="hashtags_always_use" style={labelStyle}>
          Always Use These Hashtags
        </label>
        <input
          type="text"
          id="hashtags_always_use"
          style={{ ...inputStyle, height: '44px' }}
          placeholder="e.g., #brandname, #yourhashtag (comma-separated)"
          value={formData.hashtags_always_use}
          onChange={(e) => setFormData({ ...formData, hashtags_always_use: e.target.value })}
          onFocus={(e) => e.target.style.borderColor = '#14b8a6'}
          onBlur={(e) => e.target.style.borderColor = '#27272a'}
        />
      </div>

      {/* Avoid Hashtags */}
      <div style={fieldContainerStyle}>
        <label htmlFor="hashtags_avoid" style={labelStyle}>
          Avoid These Hashtags
        </label>
        <input
          type="text"
          id="hashtags_avoid"
          style={{ ...inputStyle, height: '44px' }}
          placeholder="e.g., #spam, #unwanted (comma-separated)"
          value={formData.hashtags_avoid}
          onChange={(e) => setFormData({ ...formData, hashtags_avoid: e.target.value })}
          onFocus={(e) => e.target.style.borderColor = '#14b8a6'}
          onBlur={(e) => e.target.style.borderColor = '#27272a'}
        />
      </div>

      {/* Call-to-Action Dropdown */}
      <div style={fieldContainerStyle}>
        <label htmlFor="cta_preference" style={labelStyle}>
          Call-to-Action Preference
        </label>
        <select
          id="cta_preference"
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
          value={formData.cta_preference}
          onChange={(e) => setFormData({ ...formData, cta_preference: e.target.value })}
          onFocus={(e) => e.target.style.borderColor = '#14b8a6'}
          onBlur={(e) => e.target.style.borderColor = '#27272a'}
        >
          <option value="visit_link" style={{ background: '#1a1a1a', color: '#e5e5e5' }}>Visit Link in Bio</option>
          <option value="comment" style={{ background: '#1a1a1a', color: '#e5e5e5' }}>Leave a Comment</option>
          <option value="like_follow" style={{ background: '#1a1a1a', color: '#e5e5e5' }}>Like & Follow</option>
          <option value="shop_now" style={{ background: '#1a1a1a', color: '#e5e5e5' }}>Shop Now</option>
          <option value="learn_more" style={{ background: '#1a1a1a', color: '#e5e5e5' }}>Learn More</option>
          <option value="custom" style={{ background: '#1a1a1a', color: '#e5e5e5' }}>Custom</option>
        </select>
      </div>

      {/* Update Button */}
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

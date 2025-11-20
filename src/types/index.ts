// Database Types
export interface Brand {
  id: string
  user_id: string
  name: string
  brand_voice: string | null
  target_audience: string | null
  hashtag_count: number
  hashtags_always_use: string[]
  hashtags_avoid: string[]
  cta_preference: string | null
  emoji_count: number
  created_at: string
}

export interface SocialAccount {
  id: string
  brand_id: string
  platform: 'instagram' | 'facebook' | 'pinterest'
  account_name: string | null
  account_id: string | null
  access_token: string | null
  refresh_token: string | null
  token_expires_at: string | null
  is_active: boolean
  connected_at: string
}

export interface Media {
  id: string
  brand_id: string
  cloudinary_url: string
  cloudinary_public_id: string | null
  thumbnail_url: string | null
  media_type: 'image' | 'video'
  file_format: string | null
  file_size: number | null
  width: number | null
  height: number | null
  duration: number | null
  uploaded_at: string
}

export interface Post {
  id: string
  brand_id: string
  media_id: string
  generated_caption: string | null
  final_caption: string | null
  status: 'draft' | 'scheduled' | 'posting' | 'posted' | 'failed'
  scheduled_for: string | null
  posted_at: string | null
  platforms: string[]
  error_message: string | null
  created_at: string
  media?: Media
}

export interface PostResult {
  id: string
  post_id: string
  platform: string
  platform_post_id: string | null
  status: 'pending' | 'posted' | 'failed'
  error_message: string | null
  posted_at: string | null
}

export interface Subscription {
  id: string
  user_id: string
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  plan_id: string | null
  status: 'active' | 'canceled' | 'past_due'
  current_period_end: string | null
  posts_used: number
  posts_limit: number
  created_at: string
}

// UI Types
export interface CloudinaryUploadResponse {
  public_id: string
  secure_url: string
  url: string
  format: string
  resource_type: string
  width: number
  height: number
  bytes: number
  duration?: number
  thumbnail_url?: string
}

export interface CaptionGenerationRequest {
  mediaUrl: string
  brandVoice: string
  targetAudience: string
  hashtagCount: number
  hashtagsAlwaysUse: string[]
  hashtagsAvoid: string[]
  ctaPreference: string
  emojiCount: number
}

export interface CaptionGenerationResponse {
  caption: string
}

export interface PostScheduleRequest {
  caption: string
  mediaUrl: string
  platforms: string[]
  socialTokens: Record<string, string>
}

// Auth Types
export interface User {
  id: string
  email: string
  created_at: string
}

// Component Props Types
export interface MediaUploaderProps {
  onUploadComplete: (media: Media) => void
  brandId: string
}

export interface CaptionEditorProps {
  caption: string
  onChange: (caption: string) => void
}

export interface PostSchedulerProps {
  mediaId: string
  brandId: string
  generatedCaption: string
}

-- Brand Settings Redesign - Database Migration
-- Run this in Supabase SQL Editor

-- Add new comprehensive brand profile fields
ALTER TABLE brands ADD COLUMN IF NOT EXISTS industry_niche TEXT;
ALTER TABLE brands ADD COLUMN IF NOT EXISTS voice_description TEXT;
ALTER TABLE brands ADD COLUMN IF NOT EXISTS audience_priorities TEXT;
ALTER TABLE brands ADD COLUMN IF NOT EXISTS brand_values TEXT;
ALTER TABLE brands ADD COLUMN IF NOT EXISTS preferred_caption_length TEXT DEFAULT 'medium';
ALTER TABLE brands ADD COLUMN IF NOT EXISTS hashtag_topics TEXT;
ALTER TABLE brands ADD COLUMN IF NOT EXISTS cta_style TEXT DEFAULT 'direct';
ALTER TABLE brands ADD COLUMN IF NOT EXISTS example_captions TEXT;
ALTER TABLE brands ADD COLUMN IF NOT EXISTS phrases_taglines TEXT;
ALTER TABLE brands ADD COLUMN IF NOT EXISTS general_goals TEXT;
ALTER TABLE brands ADD COLUMN IF NOT EXISTS num_hashtags INTEGER DEFAULT 7;
ALTER TABLE brands ADD COLUMN IF NOT EXISTS num_emojis INTEGER DEFAULT 2;
ALTER TABLE brands ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();

-- Optional: Migrate existing data from old fields to new fields
-- Uncomment if you want to preserve existing data
-- UPDATE brands SET voice_description = brand_voice WHERE brand_voice IS NOT NULL;
-- UPDATE brands SET audience_priorities = target_audience WHERE target_audience IS NOT NULL;
-- UPDATE brands SET num_hashtags = hashtag_count WHERE hashtag_count IS NOT NULL;
-- UPDATE brands SET num_emojis = emoji_count WHERE emoji_count IS NOT NULL;

-- Create trigger to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_brands_updated_at ON brands;
CREATE TRIGGER update_brands_updated_at
  BEFORE UPDATE ON brands
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_brands_user_id ON brands(user_id);
CREATE INDEX IF NOT EXISTS idx_brands_created_at ON brands(created_at);

-- Summary of new fields:
-- 1. industry_niche - Industry or niche description
-- 2. voice_description - Brand voice and tone description
-- 3. audience_priorities - Target audience details
-- 4. brand_values - Core brand values
-- 5. preferred_caption_length - short, medium, or long
-- 6. hashtag_topics - Keywords for hashtag generation
-- 7. cta_style - direct, soft, question, or none
-- 8. example_captions - Example captions for AI to learn from
-- 9. phrases_taglines - Signature phrases to include
-- 10. general_goals - Social media goals
-- 11. num_hashtags - Number of hashtags to generate (0-30)
-- 12. num_emojis - Number of emojis to include (0-10)
-- 13. updated_at - Auto-updated timestamp

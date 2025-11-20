-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Brands table
CREATE TABLE brands (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  brand_voice TEXT,
  target_audience TEXT,
  hashtag_count INTEGER DEFAULT 7,
  hashtags_always_use TEXT[] DEFAULT '{}',
  hashtags_avoid TEXT[] DEFAULT '{}',
  cta_preference TEXT,
  emoji_count INTEGER DEFAULT 2,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on brands
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;

-- RLS policies for brands
CREATE POLICY "Users can view their own brands"
  ON brands FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own brands"
  ON brands FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own brands"
  ON brands FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own brands"
  ON brands FOR DELETE
  USING (auth.uid() = user_id);

-- Social Accounts table
CREATE TABLE social_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_id UUID REFERENCES brands(id) ON DELETE CASCADE NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('instagram', 'facebook', 'pinterest')),
  account_name TEXT,
  account_id TEXT,
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  connected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on social_accounts
ALTER TABLE social_accounts ENABLE ROW LEVEL SECURITY;

-- RLS policies for social_accounts
CREATE POLICY "Users can view their own social accounts"
  ON social_accounts FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM brands WHERE brands.id = social_accounts.brand_id AND brands.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert their own social accounts"
  ON social_accounts FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM brands WHERE brands.id = brand_id AND brands.user_id = auth.uid()
  ));

CREATE POLICY "Users can update their own social accounts"
  ON social_accounts FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM brands WHERE brands.id = social_accounts.brand_id AND brands.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete their own social accounts"
  ON social_accounts FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM brands WHERE brands.id = social_accounts.brand_id AND brands.user_id = auth.uid()
  ));

-- Media table
CREATE TABLE media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_id UUID REFERENCES brands(id) ON DELETE CASCADE NOT NULL,
  cloudinary_url TEXT NOT NULL,
  cloudinary_public_id TEXT,
  thumbnail_url TEXT,
  media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video')),
  file_format TEXT,
  file_size INTEGER,
  width INTEGER,
  height INTEGER,
  duration INTEGER,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on media
ALTER TABLE media ENABLE ROW LEVEL SECURITY;

-- RLS policies for media
CREATE POLICY "Users can view their own media"
  ON media FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM brands WHERE brands.id = media.brand_id AND brands.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert their own media"
  ON media FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM brands WHERE brands.id = brand_id AND brands.user_id = auth.uid()
  ));

CREATE POLICY "Users can update their own media"
  ON media FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM brands WHERE brands.id = media.brand_id AND brands.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete their own media"
  ON media FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM brands WHERE brands.id = media.brand_id AND brands.user_id = auth.uid()
  ));

-- Posts table
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_id UUID REFERENCES brands(id) ON DELETE CASCADE NOT NULL,
  media_id UUID REFERENCES media(id) ON DELETE CASCADE NOT NULL,
  generated_caption TEXT,
  final_caption TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'posting', 'posted', 'failed')),
  scheduled_for TIMESTAMP WITH TIME ZONE,
  posted_at TIMESTAMP WITH TIME ZONE,
  platforms TEXT[] DEFAULT '{}',
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on posts
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- RLS policies for posts
CREATE POLICY "Users can view their own posts"
  ON posts FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM brands WHERE brands.id = posts.brand_id AND brands.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert their own posts"
  ON posts FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM brands WHERE brands.id = brand_id AND brands.user_id = auth.uid()
  ));

CREATE POLICY "Users can update their own posts"
  ON posts FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM brands WHERE brands.id = posts.brand_id AND brands.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete their own posts"
  ON posts FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM brands WHERE brands.id = posts.brand_id AND brands.user_id = auth.uid()
  ));

-- Post Results table
CREATE TABLE post_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  platform TEXT NOT NULL,
  platform_post_id TEXT,
  status TEXT CHECK (status IN ('pending', 'posted', 'failed')),
  error_message TEXT,
  posted_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS on post_results
ALTER TABLE post_results ENABLE ROW LEVEL SECURITY;

-- RLS policies for post_results
CREATE POLICY "Users can view their own post results"
  ON post_results FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM posts
    JOIN brands ON brands.id = posts.brand_id
    WHERE posts.id = post_results.post_id AND brands.user_id = auth.uid()
  ));

-- Subscriptions table
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  plan_id TEXT,
  status TEXT CHECK (status IN ('active', 'canceled', 'past_due')),
  current_period_end TIMESTAMP WITH TIME ZONE,
  posts_used INTEGER DEFAULT 0,
  posts_limit INTEGER DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on subscriptions
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS policies for subscriptions
CREATE POLICY "Users can view their own subscription"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscription"
  ON subscriptions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscription"
  ON subscriptions FOR UPDATE
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_brands_user_id ON brands(user_id);
CREATE INDEX idx_social_accounts_brand_id ON social_accounts(brand_id);
CREATE INDEX idx_media_brand_id ON media(brand_id);
CREATE INDEX idx_posts_brand_id ON posts(brand_id);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_scheduled_for ON posts(scheduled_for);
CREATE INDEX idx_post_results_post_id ON post_results(post_id);
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);

-- Function to automatically create subscription on user signup
CREATE OR REPLACE FUNCTION create_user_subscription()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO subscriptions (user_id, status, posts_limit, posts_used)
  VALUES (NEW.id, 'active', 10, 0);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create subscription on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_user_subscription();

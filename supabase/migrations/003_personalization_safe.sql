-- User profiles (anonymous)
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  nickname text,
  session_id text UNIQUE -- localStorage ID
);

-- User interest weights
CREATE TABLE IF NOT EXISTS public.user_interests (
  user_id uuid REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  tag text NOT NULL,
  weight float NOT NULL DEFAULT 1.0,
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, tag)
);

-- Event reviews
CREATE TABLE IF NOT EXISTS public.event_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES public.events(id) ON DELETE CASCADE,
  rating int NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamptz NOT NULL DEFAULT now(),
  user_id uuid REFERENCES public.user_profiles(id) ON DELETE SET NULL
);

-- Helper reviews
CREATE TABLE IF NOT EXISTS public.helper_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  helper_id uuid REFERENCES public.helpers(id) ON DELETE CASCADE,
  rating int NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamptz NOT NULL DEFAULT now(),
  user_id uuid REFERENCES public.user_profiles(id) ON DELETE SET NULL
);

-- Add helper photo and ratings (safe - only if not exists)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='helpers' AND column_name='photo_url') THEN
    ALTER TABLE public.helpers ADD COLUMN photo_url text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='helpers' AND column_name='rating_avg') THEN
    ALTER TABLE public.helpers ADD COLUMN rating_avg float DEFAULT 4.8;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='helpers' AND column_name='rating_count') THEN
    ALTER TABLE public.helpers ADD COLUMN rating_count int DEFAULT 0;
  END IF;
END $$;

-- Indexes (safe - only if not exists)
CREATE INDEX IF NOT EXISTS idx_event_reviews_event_id ON public.event_reviews(event_id);
CREATE INDEX IF NOT EXISTS idx_helper_reviews_helper_id ON public.helper_reviews(helper_id);
CREATE INDEX IF NOT EXISTS idx_user_interests_user_id ON public.user_interests(user_id);

-- Enable RLS (safe - won't error if already enabled)
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.helper_reviews ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist, then recreate
DROP POLICY IF EXISTS "Allow public read user_profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Allow public insert user_profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Allow public read user_interests" ON public.user_interests;
DROP POLICY IF EXISTS "Allow public insert user_interests" ON public.user_interests;
DROP POLICY IF EXISTS "Allow public update user_interests" ON public.user_interests;
DROP POLICY IF EXISTS "Allow public read event_reviews" ON public.event_reviews;
DROP POLICY IF EXISTS "Allow public insert event_reviews" ON public.event_reviews;
DROP POLICY IF EXISTS "Allow public read helper_reviews" ON public.helper_reviews;
DROP POLICY IF EXISTS "Allow public insert helper_reviews" ON public.helper_reviews;

-- Create policies
CREATE POLICY "Allow public read user_profiles" ON public.user_profiles FOR SELECT USING (true);
CREATE POLICY "Allow public insert user_profiles" ON public.user_profiles FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read user_interests" ON public.user_interests FOR SELECT USING (true);
CREATE POLICY "Allow public insert user_interests" ON public.user_interests FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update user_interests" ON public.user_interests FOR UPDATE USING (true);

CREATE POLICY "Allow public read event_reviews" ON public.event_reviews FOR SELECT USING (true);
CREATE POLICY "Allow public insert event_reviews" ON public.event_reviews FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read helper_reviews" ON public.helper_reviews FOR SELECT USING (true);
CREATE POLICY "Allow public insert helper_reviews" ON public.helper_reviews FOR INSERT WITH CHECK (true);


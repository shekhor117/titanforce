-- Create news_updates table for NEWS & UPDATES
CREATE TABLE IF NOT EXISTS public.news_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  summary TEXT,
  category TEXT NOT NULL CHECK (category IN ('match_update', 'transfer_news', 'injury_report', 'general_news', 'announcement')) DEFAULT 'general_news',
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
  featured BOOLEAN DEFAULT false,
  status TEXT NOT NULL CHECK (status IN ('draft', 'scheduled', 'published', 'archived')) DEFAULT 'draft',
  published_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  scheduled_at TIMESTAMP WITH TIME ZONE,
  published_at TIMESTAMP WITH TIME ZONE,
  image_url TEXT,
  image_alt TEXT,
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for faster queries
CREATE INDEX idx_news_updates_status ON public.news_updates(status);
CREATE INDEX idx_news_updates_category ON public.news_updates(category);
CREATE INDEX idx_news_updates_published_at ON public.news_updates(published_at DESC);
CREATE INDEX idx_news_updates_created_at ON public.news_updates(created_at DESC);
CREATE INDEX idx_news_updates_featured ON public.news_updates(featured);
CREATE INDEX idx_news_updates_priority ON public.news_updates(priority);

-- Enable Row Level Security
ALTER TABLE public.news_updates ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Public can view published news updates
CREATE POLICY "Public can view published news updates" ON public.news_updates
  FOR SELECT USING (
    status = 'published' 
    AND (scheduled_at IS NULL OR scheduled_at <= now())
    AND published_at <= now()
  );

-- Authenticated users can view their own draft updates
CREATE POLICY "Users can view their own draft updates" ON public.news_updates
  FOR SELECT USING (
    auth.uid() = published_by 
    AND status = 'draft'
  );

-- Admin can view all news updates
CREATE POLICY "Admin can view all news updates" ON public.news_updates
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.app_users
      WHERE app_users.id = auth.uid()
      AND app_users.role IN ('admin', 'moderator')
    )
  );

-- Admin can create news updates
CREATE POLICY "Admin can create news updates" ON public.news_updates
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.app_users
      WHERE app_users.id = auth.uid()
      AND app_users.role IN ('admin', 'moderator')
    )
  );

-- Admin can update news updates
CREATE POLICY "Admin can update news updates" ON public.news_updates
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.app_users
      WHERE app_users.id = auth.uid()
      AND app_users.role IN ('admin', 'moderator')
    )
  ) WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.app_users
      WHERE app_users.id = auth.uid()
      AND app_users.role IN ('admin', 'moderator')
    )
  );

-- Admin can delete news updates
CREATE POLICY "Admin can delete news updates" ON public.news_updates
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.app_users
      WHERE app_users.id = auth.uid()
      AND app_users.role IN ('admin', 'moderator')
    )
  );

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_news_updates_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS news_updates_update_updated_at ON public.news_updates;
CREATE TRIGGER news_updates_update_updated_at
  BEFORE UPDATE ON public.news_updates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_news_updates_updated_at();

-- Create function to publish scheduled news
CREATE OR REPLACE FUNCTION public.publish_scheduled_news()
RETURNS void AS $$
BEGIN
  UPDATE public.news_updates
  SET 
    status = 'published',
    published_at = now()
  WHERE 
    status = 'scheduled'
    AND scheduled_at <= now();
END;
$$ LANGUAGE plpgsql;

-- Create news_items table for NEWS & UPDATES
CREATE TABLE IF NOT EXISTS public.news_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  image TEXT,
  category TEXT DEFAULT 'Club News',
  status TEXT NOT NULL CHECK (status IN ('draft', 'published', 'archived')) DEFAULT 'published',
  featured BOOLEAN DEFAULT false,
  views INTEGER DEFAULT 0,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_news_items_status ON public.news_items(status);
CREATE INDEX IF NOT EXISTS idx_news_items_category ON public.news_items(category);
CREATE INDEX IF NOT EXISTS idx_news_items_created_at ON public.news_items(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_items_featured ON public.news_items(featured);

-- Enable Row Level Security
ALTER TABLE public.news_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Public can view published news items
CREATE POLICY IF NOT EXISTS "Public can view published news items" ON public.news_items
  FOR SELECT USING (status = 'published');

-- Admin can view all news items
CREATE POLICY IF NOT EXISTS "Admin can view all news items" ON public.news_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.app_users
      WHERE app_users.id = auth.uid()
      AND app_users.role IN ('admin', 'moderator')
    )
  );

-- Admin can create news items
CREATE POLICY IF NOT EXISTS "Admin can create news items" ON public.news_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.app_users
      WHERE app_users.id = auth.uid()
      AND app_users.role IN ('admin', 'moderator')
    )
  );

-- Admin can update news items
CREATE POLICY IF NOT EXISTS "Admin can update news items" ON public.news_items
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

-- Admin can delete news items
CREATE POLICY IF NOT EXISTS "Admin can delete news items" ON public.news_items
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.app_users
      WHERE app_users.id = auth.uid()
      AND app_users.role IN ('admin', 'moderator')
    )
  );

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_news_items_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS news_items_update_updated_at ON public.news_items;
CREATE TRIGGER news_items_update_updated_at
  BEFORE UPDATE ON public.news_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_news_items_updated_at();

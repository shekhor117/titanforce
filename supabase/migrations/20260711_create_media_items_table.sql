-- Media Items table for gallery, photos, and videos
CREATE TABLE IF NOT EXISTS public.media_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('photo', 'video', 'image')),
  category TEXT,
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  storage_path TEXT,
  file_size INTEGER,
  mime_type TEXT,
  duration INTEGER,
  width INTEGER,
  height INTEGER,
  tags TEXT[],
  is_featured BOOLEAN DEFAULT FALSE,
  view_count INTEGER DEFAULT 0,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_media_items_type ON public.media_items(type);
CREATE INDEX IF NOT EXISTS idx_media_items_category ON public.media_items(category);
CREATE INDEX IF NOT EXISTS idx_media_items_featured ON public.media_items(is_featured);
CREATE INDEX IF NOT EXISTS idx_media_items_created_at ON public.media_items(created_at);

-- Enable Row Level Security
ALTER TABLE public.media_items ENABLE ROW LEVEL SECURITY;

-- Create policies for media items
CREATE POLICY "Anyone can view media items" ON public.media_items
  FOR SELECT USING (TRUE);

CREATE POLICY "Service role can insert media items" ON public.media_items
  FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Service role can update media items" ON public.media_items
  FOR UPDATE USING (TRUE) WITH CHECK (TRUE);

CREATE POLICY "Service role can delete media items" ON public.media_items
  FOR DELETE USING (TRUE);

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_media_items_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER media_items_updated_at_trigger
BEFORE UPDATE ON public.media_items
FOR EACH ROW
EXECUTE FUNCTION update_media_items_updated_at();

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.media_items TO authenticated, service_role, anon;

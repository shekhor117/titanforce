-- Site Settings table for storing global configuration
CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  setting_key TEXT NOT NULL UNIQUE,
  setting_value JSONB,
  description TEXT,
  category TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_site_settings_key ON public.site_settings(setting_key);
CREATE INDEX IF NOT EXISTS idx_site_settings_category ON public.site_settings(category);

-- Enable Row Level Security
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for site settings
CREATE POLICY "Public can view public settings" ON public.site_settings
  FOR SELECT USING (is_public = TRUE);

CREATE POLICY "Service role can manage settings" ON public.site_settings
  FOR ALL USING (TRUE) WITH CHECK (TRUE);

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_site_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER site_settings_updated_at_trigger
BEFORE UPDATE ON public.site_settings
FOR EACH ROW
EXECUTE FUNCTION update_site_settings_updated_at();

-- Grant permissions
GRANT SELECT ON public.site_settings TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_settings TO service_role;

-- Insert default settings
INSERT INTO public.site_settings (setting_key, setting_value, category, description, is_public)
VALUES
  ('site_name', '"Titan Force FC"'::jsonb, 'general', 'Main site name', TRUE),
  ('site_logo_url', 'null'::jsonb, 'general', 'Site logo URL', TRUE),
  ('site_description', '""'::jsonb, 'general', 'Site description', TRUE),
  ('maintenance_mode', 'false'::jsonb, 'general', 'Is site in maintenance mode', FALSE),
  ('enable_registrations', 'true'::jsonb, 'security', 'Allow new user registrations', FALSE)
ON CONFLICT (setting_key) DO NOTHING;

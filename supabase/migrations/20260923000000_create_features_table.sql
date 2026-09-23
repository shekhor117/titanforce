-- Restore the feature flags table used by the admin feature manager.
CREATE TABLE IF NOT EXISTS public.features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  enabled BOOLEAN NOT NULL DEFAULT FALSE,
  config JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.features ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Features are viewable by authenticated users" ON public.features;
CREATE POLICY "Features are viewable by authenticated users"
  ON public.features FOR SELECT TO authenticated USING (TRUE);

DROP POLICY IF EXISTS "Service role can manage features" ON public.features;
CREATE POLICY "Service role can manage features"
  ON public.features FOR ALL TO service_role USING (TRUE) WITH CHECK (TRUE);

GRANT SELECT ON public.features TO authenticated;
GRANT ALL ON public.features TO service_role;

CREATE OR REPLACE FUNCTION public.update_features_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS features_updated_at_trigger ON public.features;
CREATE TRIGGER features_updated_at_trigger
  BEFORE UPDATE ON public.features
  FOR EACH ROW EXECUTE FUNCTION public.update_features_updated_at();

-- No fabricated feature rows are inserted: feature names/config are product data
-- and must be created from the admin panel rather than guessed defaults.

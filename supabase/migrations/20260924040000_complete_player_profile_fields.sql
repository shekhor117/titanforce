ALTER TABLE public.players
  ADD COLUMN IF NOT EXISTS height numeric,
  ADD COLUMN IF NOT EXISTS weight numeric,
  ADD COLUMN IF NOT EXISTS foot text,
  ADD COLUMN IF NOT EXISTS preferred_foot text,
  ADD COLUMN IF NOT EXISTS strong_foot text;

UPDATE public.players
SET foot = COALESCE(foot, preferred_foot, strong_foot),
    preferred_foot = COALESCE(preferred_foot, strong_foot, foot),
    strong_foot = COALESCE(strong_foot, preferred_foot, foot)
WHERE foot IS NOT NULL OR preferred_foot IS NOT NULL OR strong_foot IS NOT NULL;

ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_players" ON public.players;
CREATE POLICY "public_read_players" ON public.players FOR SELECT TO anon, authenticated USING (true);
GRANT SELECT ON public.players TO anon, authenticated;
NOTIFY pgrst, 'reload schema';

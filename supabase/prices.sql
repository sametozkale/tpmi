-- Spot prices cache (source: api.gold-api.com)
CREATE TABLE IF NOT EXISTS public.spot_cache (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol text NOT NULL,
  price_usd numeric(18, 4) NOT NULL,
  fetched_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS spot_cache_symbol_fetched_at_idx
  ON public.spot_cache (symbol, fetched_at DESC);

-- FX cache (source: open.er-api.com)
CREATE TABLE IF NOT EXISTS public.fx_cache (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  base text NOT NULL DEFAULT 'USD',
  rates jsonb NOT NULL,
  fetched_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS fx_cache_fetched_at_idx
  ON public.fx_cache (fetched_at DESC);

-- Public read-only policies
ALTER TABLE public.spot_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fx_cache ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'spot_cache'
      AND policyname = 'public read spot_cache'
  ) THEN
    CREATE POLICY "public read spot_cache"
      ON public.spot_cache
      FOR SELECT
      USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'fx_cache'
      AND policyname = 'public read fx_cache'
  ) THEN
    CREATE POLICY "public read fx_cache"
      ON public.fx_cache
      FOR SELECT
      USING (true);
  END IF;
END $$;

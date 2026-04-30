CREATE TABLE IF NOT EXISTS public.contact_rate_limit (
  id bigserial PRIMARY KEY,
  ip_hash text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_contact_rate_limit_ip_time
  ON public.contact_rate_limit (ip_hash, created_at DESC);

ALTER TABLE public.contact_rate_limit ENABLE ROW LEVEL SECURITY;
-- No policies: only service_role (which bypasses RLS) can read/write.

-- Atomically check the rate limit and record the attempt if allowed.
-- Limits: 5 sends / hour and 20 sends / 24h per IP hash.
CREATE OR REPLACE FUNCTION public.check_contact_rate_limit(_ip_hash text)
RETURNS TABLE(allowed boolean, retry_after_seconds integer)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  hour_count int;
  day_count int;
  oldest_in_hour timestamptz;
  oldest_in_day timestamptz;
  retry_sec int := 0;
BEGIN
  -- Cleanup old rows opportunistically (older than 25h)
  DELETE FROM public.contact_rate_limit WHERE created_at < now() - interval '25 hours';

  SELECT count(*), min(created_at)
    INTO hour_count, oldest_in_hour
    FROM public.contact_rate_limit
    WHERE ip_hash = _ip_hash AND created_at > now() - interval '1 hour';

  SELECT count(*), min(created_at)
    INTO day_count, oldest_in_day
    FROM public.contact_rate_limit
    WHERE ip_hash = _ip_hash AND created_at > now() - interval '24 hours';

  IF hour_count >= 5 THEN
    retry_sec := GREATEST(1, EXTRACT(EPOCH FROM (oldest_in_hour + interval '1 hour' - now()))::int);
    RETURN QUERY SELECT false, retry_sec;
    RETURN;
  END IF;

  IF day_count >= 20 THEN
    retry_sec := GREATEST(1, EXTRACT(EPOCH FROM (oldest_in_day + interval '24 hours' - now()))::int);
    RETURN QUERY SELECT false, retry_sec;
    RETURN;
  END IF;

  INSERT INTO public.contact_rate_limit (ip_hash) VALUES (_ip_hash);
  RETURN QUERY SELECT true, 0;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.check_contact_rate_limit(text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.check_contact_rate_limit(text) TO service_role;
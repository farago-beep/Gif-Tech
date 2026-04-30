-- Lock down has_role: only callable by postgres/service_role; RLS still works because SECURITY DEFINER
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;

-- Server-side admin bootstrap: atomically inserts admin role only if no admin exists yet
CREATE OR REPLACE FUNCTION public.claim_first_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid uuid := auth.uid();
  admin_exists boolean;
BEGIN
  IF uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') INTO admin_exists;
  IF admin_exists THEN
    RETURN false;
  END IF;

  INSERT INTO public.user_roles (user_id, role) VALUES (uid, 'admin')
  ON CONFLICT DO NOTHING;
  RETURN true;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.claim_first_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.claim_first_admin() TO authenticated;

-- Defense-in-depth trigger: prevent more than one bootstrap admin via direct INSERT
CREATE OR REPLACE FUNCTION public.enforce_single_bootstrap_admin()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.role = 'admin' AND EXISTS (
    SELECT 1 FROM public.user_roles WHERE role = 'admin' AND user_id <> NEW.user_id
  ) THEN
    -- Allow only if invoker is already an admin (i.e. an admin promoting another user)
    IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin') THEN
      RAISE EXCEPTION 'Only existing admins can grant the admin role';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_enforce_single_bootstrap_admin ON public.user_roles;
CREATE TRIGGER trg_enforce_single_bootstrap_admin
BEFORE INSERT ON public.user_roles
FOR EACH ROW EXECUTE FUNCTION public.enforce_single_bootstrap_admin();